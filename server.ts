import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config({ quiet: true });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// When this server is deployed as a standalone API (e.g. on Render) while the
// frontend is hosted separately (e.g. Firebase Hosting), the frontend's origin
// must be allowed here. Comma-separated list, e.g.
// "https://vendor4all.web.app,https://vendor4all.firebaseapp.com"
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
  })
);

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Diagnostic endpoint to check model statuses
app.get('/api/test-models', async (_req: Request, res: Response) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: 'No API key' });
    return;
  }
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
  });
  const candidates = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
  const results: Record<string, any> = {};

  for (const m of candidates) {
    try {
      const start = Date.now();
      const r = await ai.models.generateContent({
        model: m,
        contents: 'Say OK',
      });
      results[m] = { status: 'OK', latencyMs: Date.now() - start, text: r.text?.trim() };
    } catch (e: any) {
      results[m] = { status: 'ERROR', message: e.message || String(e), code: e.status || e.code };
    }
  }
  res.json({ results });
});

/**
 * Utility to parse and categorize Gemini API errors
 */
function categorizeGeminiError(err: any): {
  statusCode: number;
  errorType: 'AVAILABILITY_503' | 'QUOTA_429' | 'AUTH_403' | 'CLIENT_400' | 'SERVER_500';
  rawMessage: string;
} {
  const message = err?.message || String(err || '');
  const status = err?.status || err?.code;

  // Check for 503 UNAVAILABLE or high demand
  if (
    status === 503 ||
    message.includes('503') ||
    message.includes('UNAVAILABLE') ||
    message.includes('high demand') ||
    message.includes('overloaded')
  ) {
    return {
      statusCode: 503,
      errorType: 'AVAILABILITY_503',
      rawMessage: message,
    };
  }

  // Check for 429 RESOURCE_EXHAUSTED or quota
  if (
    status === 429 ||
    message.includes('429') ||
    message.includes('RESOURCE_EXHAUSTED') ||
    message.includes('quota') ||
    message.includes('rate limit')
  ) {
    return {
      statusCode: 429,
      errorType: 'QUOTA_429',
      rawMessage: message,
    };
  }

  // Check for 403 or PERMISSION_DENIED
  if (
    status === 403 ||
    message.includes('403') ||
    message.includes('PERMISSION_DENIED') ||
    message.includes('API_KEY_INVALID')
  ) {
    return {
      statusCode: 403,
      errorType: 'AUTH_403',
      rawMessage: message,
    };
  }

  // Check for 400 or INVALID_ARGUMENT
  if (status === 400 || message.includes('400') || message.includes('INVALID_ARGUMENT')) {
    return {
      statusCode: 400,
      errorType: 'CLIENT_400',
      rawMessage: message,
    };
  }

  return {
    statusCode: 500,
    errorType: 'SERVER_500',
    rawMessage: message,
  };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Executes a Gemini request with exponential backoff and model fallback
 */
async function generateWithRetry(
  ai: GoogleGenAI,
  generateConfig: {
    contents: any;
    config: any;
  },
  modelsToTry: string[] = ['gemini-3.1-flash-lite', 'gemini-3.8-flash']
): Promise<{ text: string | undefined; modelUsed: string; attempts: number }> {
  let lastError: any = null;
  let totalAttempts = 0;

  for (const model of modelsToTry) {
    const maxRetries = 2; // 1 initial attempt + 2 retries = 3 attempts per model

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      totalAttempts++;
      try {
        console.log(`[Gemini] Attempting ${model} (attempt ${attempt + 1}/${maxRetries + 1})...`);
        const response = await ai.models.generateContent({
          model,
          contents: generateConfig.contents,
          config: generateConfig.config,
        });

        console.log(`[Gemini] ${model} succeeded on attempt ${attempt + 1}.`);
        return {
          text: response.text,
          modelUsed: model,
          attempts: totalAttempts,
        };
      } catch (err: any) {
        lastError = err;
        const categorized = categorizeGeminiError(err);
        console.warn(
          `[Gemini] ${model} attempt ${attempt + 1} failed: [${categorized.errorType}] ${categorized.rawMessage.slice(0, 140)}`
        );

        // If it's a client error (e.g. 400) or auth error (403), retrying will not help
        if (categorized.errorType === 'CLIENT_400' || categorized.errorType === 'AUTH_403') {
          throw err;
        }

        // If it's a 429 quota error, retrying immediately is unlikely to help; stop immediately
        if (categorized.errorType === 'QUOTA_429') {
          throw err;
        }

        // If it's a 503 UNAVAILABLE, apply exponential backoff with jitter if more retries remain
        if (attempt < maxRetries && categorized.errorType === 'AVAILABILITY_503') {
          const delayMs = Math.floor(1000 * Math.pow(1.8, attempt) + Math.random() * 300);
          console.log(`[Gemini] Waiting ${delayMs}ms before retrying ${model}...`);
          await sleep(delayMs);
        }
      }
    }

    console.warn(`[Gemini] All attempts exhausted for model ${model}. Checking next candidate model...`);
  }

  // If all models and attempts were exhausted, throw the last error encountered
  throw lastError;
}

/**
 * Server-side endpoint for Telugu Voice / Text / Image produce parsing
 */
const handleParseProduce = async (req: Request, res: Response): Promise<void> => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(503).json({
        errorType: 'AUTH_403',
        error: 'GEMINI_API_KEY is not configured on the server. Please check your settings or use Manual Entry.',
        errorTe: 'సర్వర్‌లో జెమిని API కీ సెట్ చేయబడలేదు. దయచేసి సెట్టింగ్స్‌ను తనిఖీ చేయండి లేదా నేరుగా వివరాలు నమోదు (Manual Entry) ఉపయోగించండి.',
        canRetry: false,
        fallbackAvailable: true,
      });
      return;
    }

    const {
      audioBase64,
      audioMimeType = 'audio/webm',
      text,
      imageBase64,
      imageMimeType = 'image/jpeg',
      vendorLocation = 'MVP Colony Rythu Bazaar',
    } = req.body;

    if (!audioBase64 && (!text || !text.trim()) && !imageBase64) {
      res.status(400).json({
        errorType: 'CLIENT_400',
        error: 'Please provide either audio, text, or a produce photo for parsing.',
        errorTe: 'దయచేసి విశ్లేషణ కోసం ఆడియో, టెక్స్ట్ లేదా ఫోటోను అందించండి.',
        canRetry: false,
        fallbackAvailable: true,
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `
You are an expert bilingual (Telugu and English) agricultural market listing assistant for local vegetable and fruit vendors at ${vendorLocation}, Visakhapatnam.
Your job is to understand Telugu speech, English speech, mixed Telugu-English ("Tenglish" / code-switching), written text, and optional produce photographs.

CRITICAL INSTRUCTIONS FOR MULTI-ITEM BATCH INTAKE & MULTILINGUAL SPEECH:
1. Multi-Item Support: Vendors often read out their entire morning cart or daily inventory in a single continuous voice note (e.g. 5, 10, or up to 20 different produce items).
   - You MUST extract EVERY SINGLE distinct produce item mentioned into the "items" array.
   - NEVER drop any item. If the vendor lists 10 items, the "items" array MUST contain 10 distinct objects.
2. Code-Switching & Multilingual: Vendors frequently mix English and Telugu words within the same sentence (e.g., "10 kg tomato 40 rupees, వంకాయలు 5 kg thirty-five rupees, palak 10 bunches 15 rupees, green chillies 2 kg 60 rs"). Understand both Telugu and English seamlessly.
3. For each extracted item:
   - Provide "name_en" (clean English produce name)
   - Provide "name_te" (authentic Telugu script produce name)
   - Extract numeric "quantity" and "unit" (e.g. kg, bunch, piece, dozen)
   - Extract numeric "price" and "price_unit" (e.g. kg, bunch, piece)
   - Set "availability" to "available" (or "sold_out" if vendor says "అయిపోయాయి" / "finished" / "no stock")
   - Set "needs_confirmation" to true.
4. If an item is mentioned without price or quantity:
   - Still include the item in the "items" array!
   - Leave the missing numeric field as null.
   - List the field name in "missing_fields".
5. Never invent or hallucinate missing prices or quantities. Preserve exact spoken numbers.
6. Use the confirmed vendor location: "${vendorLocation}".
7. In "raw_transcript_te" and "raw_transcript_en", provide the complete transcription of the entire voice recording capturing all items.

Contextual Produce Dictionary for Coastal Andhra / Visakhapatnam Rythu Bazaar:
- Tomato / నాటు టమాటాలు / హైబ్రిడ్ టమాటాలు
- Brinjal / Purple Eggplant / గుత్తి వంకాయలు / తెల్ల వంకాయలు
- Green Chillies / పచ్చి మిరపకాయలు
- Potatoes / బంగాళాదుంపలు / ఆలూ
- Onions / ఉల్లిపాయలు
- Lady's Finger / Okra / బెండకాయలు
- Bitter Gourd / కాకరకాయలు
- Bottle Gourd / సొరకాయ / ఆనపకాయ
- Ridge Gourd / బీరకాయ
- Snake Gourd / పొట్లకాయ
- Drumstick / మునక్కాయలు
- Cucumber / దోసకాయ / కీరా
- Spinach / పాలకూర
- Amaranth / తోటకూర
- Sorrel Leaves / గోంగూర
- Coriander / కొత్తిమీర
- Curry Leaves / కరివేపాకు
- Mint / పుదీనా
- Bananas / Simhachalam Chakkarakeli / చక్కెరకేళి / అమృతపాణి
- Papaya / బొప్పాయి
- Guava / జామపండ్లు
- Mango / మామిడిపండ్లు
`;

    const contentsParts: any[] = [];

    // Optional audio part
    if (audioBase64) {
      const cleanAudio = audioBase64.replace(/^data:[^;]+;base64,/, '');
      contentsParts.push({
        inlineData: {
          mimeType: audioMimeType,
          data: cleanAudio,
        },
      });
      contentsParts.push({
        text: `Listen to this Telugu voice recording from a produce vendor at ${vendorLocation}. First transcribe what was said accurately into Telugu and English, then extract the produce item details.`,
      });
    }

    // Optional image part
    if (imageBase64) {
      const cleanImage = imageBase64.replace(/^data:[^;]+;base64,/, '');
      contentsParts.push({
        inlineData: {
          mimeType: imageMimeType,
          data: cleanImage,
        },
      });
      contentsParts.push({
        text: `Here is an optional photograph of the produce. Remember: use this photograph ONLY to suggest or confirm the produce name/identity. NEVER infer quantity, price, or location from the photo.`,
      });
    }

    // Text prompt part
    if (text && text.trim()) {
      contentsParts.push({
        text: `Vendor text input: "${text.trim()}". Extract the produce items according to the rules.`,
      });
    }

    const generateConfig = {
      contents: { parts: contentsParts },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              description: 'List of produce items extracted from the vendor input',
              items: {
                type: Type.OBJECT,
                properties: {
                  name_en: { type: Type.STRING, description: 'Produce name in English' },
                  name_te: { type: Type.STRING, description: 'Produce name in Telugu script' },
                  quantity: { type: Type.NUMBER, description: 'Available quantity stated by vendor (null if omitted)' },
                  unit: { type: Type.STRING, description: 'Quantity unit like kg, bunch, piece, dozen' },
                  price: { type: Type.NUMBER, description: 'Price in Indian Rupees stated by vendor (null if omitted)' },
                  price_unit: { type: Type.STRING, description: 'Unit for price like kg, bunch, piece' },
                  availability: {
                    type: Type.STRING,
                    description: 'One of: available, sold_out, unavailable, unknown',
                  },
                  needs_confirmation: { type: Type.BOOLEAN, description: 'Always true for vendor safety' },
                  uncertainty_reason: { type: Type.STRING, description: 'Explanation if item identity is uncertain' },
                },
                required: ['name_en', 'name_te', 'unit', 'price_unit', 'availability'],
              },
            },
            location: {
              type: Type.STRING,
              description: 'Confirmed vendor location: ' + vendorLocation,
            },
            missing_fields: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of missing required fields like price or quantity',
            },
            clarification_questions: {
              type: Type.ARRAY,
              description: 'Short clarification questions in English and Telugu if required fields are missing',
              items: {
                type: Type.OBJECT,
                properties: {
                  en: { type: Type.STRING, description: 'Short question in English' },
                  te: { type: Type.STRING, description: 'Short question in Telugu' },
                  field: { type: Type.STRING, description: 'Field name needed' },
                },
                required: ['en', 'te', 'field'],
              },
            },
            warnings: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Warnings or notices for the vendor',
            },
            vendor_message: {
              type: Type.STRING,
              description: 'Short conversational confirmation message summarizing what was understood in clear Telugu/English',
            },
            raw_transcript_te: {
              type: Type.STRING,
              description: 'Transcription of audio in Telugu script, if audio was supplied',
            },
            raw_transcript_en: {
              type: Type.STRING,
              description: 'English translation of the Telugu transcription',
            },
          },
          required: [
            'items',
            'location',
            'missing_fields',
            'clarification_questions',
            'warnings',
            'vendor_message',
          ],
        },
      },
    };

    // Use primary model 'gemini-3.1-flash-lite' (high availability, ultra-fast)
    // with automatic fallback to 'gemini-3.8-flash' and exponential backoff
    const result = await generateWithRetry(ai, generateConfig, [
      'gemini-3.1-flash-lite',
      'gemini-3.8-flash',
    ]);

    const responseText = result.text;
    if (!responseText) {
      res.status(502).json({
        errorType: 'SERVER_500',
        error: 'Received empty response from the AI model. Please try speaking again or use Manual Entry.',
        errorTe: 'AI మోడల్ నుండి సమాధానం అందలేదు. దయచేసి మళ్లీ ప్రయత్నించండి లేదా నేరుగా వివరాలు నమోదు చేయండి.',
        canRetry: true,
        fallbackAvailable: true,
      });
      return;
    }

    try {
      const parsedData = JSON.parse(responseText);
      parsedData.location = vendorLocation;
      parsedData._meta = {
        modelUsed: result.modelUsed,
        attempts: result.attempts,
      };
      res.json(parsedData);
    } catch (parseErr) {
      res.status(502).json({
        errorType: 'SERVER_500',
        error: 'Failed to parse AI output into structured produce data. You can continue with Manual Entry.',
        errorTe: 'AI ఫలితాన్ని ప్రాసెస్ చేయలేకపోయాము. మీరు నేరుగా వివరాలు నమోదు (Manual Entry) ఉపయోగించవచ్చు.',
        canRetry: true,
        fallbackAvailable: true,
        raw: responseText,
      });
    }
  } catch (error: any) {
    console.error('[Gemini API Error] /api/gemini/parse-produce caught error:', error);
    const categorized = categorizeGeminiError(error);

    if (categorized.errorType === 'AVAILABILITY_503') {
      res.status(503).json({
        errorType: 'AVAILABILITY_503',
        error:
          'The Gemini AI service is currently experiencing temporary high demand across Google Cloud. Our system automatically retried, but the service remains busy. Please try again in a few moments, or click "Manual Entry Fallback" below to add your produce without waiting.',
        errorTe:
          'జెమిని AI సర్వీస్ ప్రస్తుతం గూగుల్ క్లౌడ్‌లో తాత్కాలికంగా అధిక రద్దీని ఎదుర్కొంటోంది. సిస్టమ్ స్వయంచాలకంగా మళ్లీ ప్రయత్నించింది, కానీ సర్వీస్ ఇంకా రద్దీగా ఉంది. కొద్ది క్షణాల తర్వాత మళ్లీ ప్రయత్నించండి లేదా వేచి ఉండకుండా వెంటనే సరుకును చేర్చడానికి క్రింద ఉన్న "నేరుగా వివరాలు నమోదు (Manual Entry)" బటన్‌ను నొక్కండి.',
        canRetry: true,
        fallbackAvailable: true,
      });
      return;
    }

    if (categorized.errorType === 'QUOTA_429') {
      res.status(429).json({
        errorType: 'QUOTA_429',
        error:
          'API rate or quota limit reached. Please wait a short while before trying again, or use "Manual Entry Fallback" to list your produce immediately.',
        errorTe:
          'API కోటా లేదా రేట్ లిమిట్ పూర్తయింది. దయచేసి కొద్దిసేపు ఆగి మళ్లీ ప్రయత్నించండి లేదా వెంటనే జాబితా చేయడానికి "నేరుగా వివరాలు నమోదు (Manual Entry)" ఉపయోగించండి.',
        canRetry: false,
        fallbackAvailable: true,
      });
      return;
    }

    if (categorized.errorType === 'AUTH_403') {
      res.status(403).json({
        errorType: 'AUTH_403',
        error:
          'Gemini API key is invalid or lacks required permissions. Please verify the API key in the Secrets panel, or continue using Manual Entry.',
        errorTe:
          'API కీ చెల్లదు లేదా సరైన అనుమతులు లేవు. దయచేసి సీక్రెట్స్ ప్యానెల్‌లో కీని సరిచూసుకోండి లేదా నేరుగా వివరాలు నమోదు ఉపయోగించండి.',
        canRetry: false,
        fallbackAvailable: true,
      });
      return;
    }

    res.status(categorized.statusCode).json({
      errorType: categorized.errorType,
      error:
        categorized.rawMessage ||
        'Internal server error while processing speech. You can continue with Manual Entry.',
      errorTe: 'సమాచారాన్ని విశ్లేషించడంలో సమస్య ఏర్పడింది. మీరు నేరుగా వివరాలు నమోదు (Manual Entry) ఉపయోగించవచ్చు.',
      canRetry: true,
      fallbackAvailable: true,
    });
  }
};

// Mount handlers to both endpoints for robustness
app.post('/api/gemini/parse-produce', handleParseProduce);
app.post('/api/parse-produce', handleParseProduce);

// NOTE: product listings are intentionally NOT persisted server-side.
// This app stores inventory in the browser's LocalStorage (see
// src/utils/storage.ts). A server-side JSON file would not survive
// restarts/redeploys on most free hosting (e.g. Render's filesystem is
// ephemeral), silently losing every vendor's listings. Use a real database
// if cross-device sync is needed later.

// Fallback for all unmatched /api/* routes - ALWAYS return JSON, never HTML
app.all('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    error: `API route ${req.method} ${req.path} not found`,
    errorType: 'CLIENT_400',
    fallbackAvailable: true,
  });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    const distIndex = path.resolve(__dirname, 'dist', 'index.html');
    if (fs.existsSync(distIndex)) {
      // Frontend build is present (e.g. running the whole app from one host).
      app.use(express.static(path.resolve(__dirname, 'dist')));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(distIndex);
      });
    } else {
      // No frontend build here (e.g. this instance only serves the /api
      // routes, such as when deployed standalone on Render with the
      // frontend hosted separately on Firebase Hosting).
      app.get('/', (_req: Request, res: Response) => {
        res.json({ status: 'ok', service: 'vendor4all-api' });
      });
    }
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Vendor4ALL] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
