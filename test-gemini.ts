import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log('API Key prefix:', apiKey ? apiKey.slice(0, 10) : 'none');

async function main() {
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
  });

  const models = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
  for (const m of models) {
    try {
      console.log('Testing model:', m);
      const res = await ai.models.generateContent({
        model: m,
        contents: 'Hello! Respond with OK.',
      });
      console.log(`Model ${m} SUCCESS:`, res.text);
      return;
    } catch (e: any) {
      console.log(`Model ${m} FAILED:`, e.status || e.code, e.message);
    }
  }
}

main();
