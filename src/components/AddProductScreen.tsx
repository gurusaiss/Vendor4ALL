import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Upload,
  Image as ImageIcon,
  Check,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowLeft,
  X,
  Volume2,
  Lock,
  Loader2,
  CheckCircle2,
  ShieldAlert,
  Camera,
  RefreshCw,
  Plus,
  Trash2,
} from 'lucide-react';
import { ProduceItem, ExtractedProduceItem, ExtractedProduceResponse, Language, VendorProfile } from '../types';
import { translations } from '../utils/translations';
import { validateProduceFields, parseLocalTeluguInput, getRythuBazaarBenchmark } from '../utils/produceLogic';

// When the frontend (e.g. Firebase Hosting) and the API server (e.g. Render)
// are deployed separately, VITE_API_BASE_URL points at the API's full origin
// (e.g. "https://vendor4all-api.onrender.com"). Leave it unset for local dev,
// where Vite's dev proxy forwards relative "/api" calls to localhost:3000.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export function resolveProduceImageUrl(nameEn: string, customImage?: string | null): string {
  if (customImage) return customImage;
  const lower = (nameEn || '').toLowerCase();
  if (lower.includes('tomato') || lower.includes('టమాట') || lower.includes('టమోట')) {
    return 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgvSgEGL5xPJJYqVB1tMazOUZOWJHgZQKWSKoMBQ7WQ5n8v9ATBBSEWU6QNjp8_AQvolbiwtTsU2cFFH7RVy7F98USlDeq4bMQuvgpmnz3B7YPqI120ysDlpBwWjtCv46uXrMmhbka1ZR-T_2M1dG7LfbZ24bNaQfgWdYQi1XHtqi7vhheemU_aTQaVVtbwP1pgHRyLdwV-vZRbj45Y137CMmbu3TiiAtCdSc7liI';
  }
  if (lower.includes('brinjal') || lower.includes('vankaya') || lower.includes('వంకాయ') || lower.includes('eggplant')) {
    return 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8jCI3qWWsUXS4EHPe5Fe7byEIrMPsIK6iYEf_ie7xPSxjD1E1iMFFTiBY1KmnUnxUukvi5vx3q1paq2gEexcNo7uJwbegDBMftmzMAyHvp7L8WjkyZvvXs9p8YKRM-XE72fpNqyxZvOc7C770jv1KwA2J0ciyU_DTagDhRt_loMfMbaE7c-mWICq5MI5u-bm-A8UkJNqHSVJtuMUQg1oOJOjjeTmCBz-baEOOPL4';
  }
  if (lower.includes('chilli') || lower.includes('mirapa') || lower.includes('మిరప') || lower.includes('mirchi')) {
    return 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJqSzsdFsrW-vPRwXhcCjVfAGo6ZwCDobGZz5HvA1K1Cs3b7__ztmew4g7TnAtygSyHpfJA7xVB6L-0rFSYE9hUoQlsjDM79ICW--CoqJmSz-JEjjzLKeFKWTcxnQaqxPsXu2R8fOJXkg7ZYmWaaOTMXx-3Z26N9nVw78-lPMbLS_CXcxvwNYSf7Vfwxhq6SAFT36MqSaeera3pkvGbOWKL9tihCr1FhfQkVtHEUw';
  }
  if (
    lower.includes('spinach') ||
    lower.includes('palak') ||
    lower.includes('పాలకూర') ||
    lower.includes('gongura') ||
    lower.includes('గోంగూర') ||
    lower.includes('thotakura') ||
    lower.includes('తోటకూర') ||
    lower.includes('coriander') ||
    lower.includes('కొత్తిమీర')
  ) {
    return 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtt8xvrY95iFv2inkSlyGY2ftvHxdqk2_orJSwCExaQTcIgpQQxWw0LACBZS-iHo6BC9zOAX6hME2EvzLh0yEi5XchYTVUafj3V-jIMwXiYl97yVU79GONJnu9EtYMEVZt24WxKYTc1SbJKX4i-w2o9zdiVJLt45yTqoVnkWh14Hz70EC4D_SPmqBk8xCZrpopad7vgwkH05mFhUAZiqtgCfMgJUMxm9EYrKtV5Fg';
  }
  if (
    lower.includes('ladies finger') ||
    lower.includes('bhendi') ||
    lower.includes('okra') ||
    lower.includes('బెండకాయ')
  ) {
    return 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6DsEl69DEOoul9LoMf9WD1MIB37ZT3FmJLwb6DPvSp0vhqzUZ7wtawxVw4H_JIneCiwiTQqugD-ZVFWDiAr4_e9bhmSqtEyrsiG6EvDj9zQpkR9C2PtM7Bk4LuhyCaRZRcPJywB1T9hNQRQhAEPo9XcdiVQHIvtT3RBjVx_7_HLHMKdPAjTY789GxcSk3lg3Mj4fQ1s4IAl0WbH2CXakQu7Xex8aI2GKulT28maE';
  }
  if (lower.includes('banana') || lower.includes('aratipandu') || lower.includes('అరటి')) {
    return 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80';
  }
  if (lower.includes('onion') || lower.includes('ullipaya') || lower.includes('ఉల్లి')) {
    return 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80';
  }
  if (lower.includes('potato') || lower.includes('bangaladumpa') || lower.includes('బంగాళాదుంప')) {
    return 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80';
  }
  if (lower.includes('carrot') || lower.includes('క్యారెట్')) {
    return 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80';
  }
  return 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=600&q=80';
}

interface AddProductScreenProps {
  vendorProfile: VendorProfile;
  lang: Language;
  onBack: () => void;
  onPublish: (item: ProduceItem | ProduceItem[]) => void;
}

export const AddProductScreen: React.FC<AddProductScreenProps> = ({
  vendorProfile,
  lang,
  onBack,
  onPublish,
}) => {
  const t = translations[lang];

  // Visual Stepper State: 1 = Voice, 2 = Photo, 3 = Review & Publish
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [audioMimeType, setAudioMimeType] = useState<string>('audio/webm');
  const [micError, setMicError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const [liveSpeechTranscript, setLiveSpeechTranscript] = useState('');

  // Optional image state
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Text fallback input
  const [textInput, setTextInput] = useState('');

  // AI processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiErrorDetails, setAiErrorDetails] = useState<{
    errorType: 'AVAILABILITY_503' | 'QUOTA_429' | 'AUTH_403' | 'CLIENT_400' | 'SERVER_500' | string;
    message: string;
    messageTe?: string;
    canRetry: boolean;
  } | null>(null);
  const [extractedData, setExtractedData] = useState<
    (ExtractedProduceResponse & { _meta?: { modelUsed?: string; attempts?: number } }) | null
  >(null);

  // Editable fields in review step
  const [nameEn, setNameEn] = useState('');
  const [nameTe, setNameTe] = useState('');
  const [category, setCategory] = useState<'vegetables' | 'fruits' | 'greens' | 'other'>('vegetables');
  const [quantity, setQuantity] = useState<string>('');
  const [unit, setUnit] = useState<string>('kg');
  const [price, setPrice] = useState<string>('');
  const [priceUnit, setPriceUnit] = useState<string>('kg');
  const [availability, setAvailability] = useState<'available' | 'sold_out'>('available');
  const [sourceNote, setSourceNote] = useState<string>('');

  // Tracking if values were auto-suggested by AI
  const [isAiSuggested, setIsAiSuggested] = useState(false);

  // Explicit vendor confirmation state
  const [isConfirmedByVendor, setIsConfirmedByVendor] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Multi-item batch intake state
  const [batchItems, setBatchItems] = useState<ExtractedProduceItem[]>([]);
  // Speech recognition dialect preference: 'te-IN' (Telugu) or 'en-IN' (Tenglish / Multilingual)
  const [speechDialect, setSpeechDialect] = useState<'te-IN' | 'en-IN'>('te-IN');

  // Clean up recording timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Manual entry activation helper
  const activateManualEntry = () => {
    setAiError(null);
    setAiErrorDetails(null);
    setIsAiSuggested(false);
    setActiveStep(3);
    const manualItem: ExtractedProduceItem = {
      name_en: textInput || '',
      name_te: '',
      quantity: null,
      unit: 'kg',
      price: null,
      price_unit: 'kg',
      availability: 'available',
      needs_confirmation: true,
      uncertainty_reason: null,
    };
    setBatchItems([manualItem]);
    setNameEn(manualItem.name_en);
    setNameTe('');
    setQuantity('');
    setPrice('');
    setUnit('kg');
    setPriceUnit('kg');
    setAvailability('available');
    setExtractedData({
      items: [manualItem],
      location: vendorProfile.market_name,
      missing_fields: ['price', 'quantity'],
      clarification_questions: [
        {
          en: 'Please enter the price and quantity in the form below.',
          te: 'దయచేసి సరుకు ధర మరియు పరిమాణాన్ని క్రింది ఫారంలో నమోదు చేయండి.',
          field: 'price',
        },
      ],
      warnings: [],
      vendor_message:
        lang === 'te'
          ? 'నేరుగా వివరాలు నమోదు చేసే విధానం. దయచేసి వివరాలను పూరించి, సరిచూసి ధృవీకరించండి.'
          : 'Manual entry mode. Please fill in the details below and verify before publishing.',
    });
  };

  // Batch item update helper
  const updateBatchItem = (index: number, updates: Partial<ExtractedProduceItem>) => {
    setBatchItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updates };
      return copy;
    });
  };

  // Remove item from batch
  const removeBatchItem = (index: number) => {
    setBatchItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Add empty item to batch
  const addBatchItem = () => {
    const newItem: ExtractedProduceItem = {
      name_en: '',
      name_te: '',
      quantity: 10,
      unit: 'kg',
      price: 30,
      price_unit: 'kg',
      availability: 'available',
      needs_confirmation: true,
      uncertainty_reason: null,
    };
    setBatchItems((prev) => [...prev, newItem]);
  };

  // Start voice recording with device capability checks
  const startRecording = async () => {
    setMicError(null);
    audioChunksRef.current = [];

    // Check browser capability
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicError(
        lang === 'te'
          ? 'ఈ బ్రౌజర్‌లో వాయిస్ రికార్డింగ్ అందుబాటులో లేదు. దయచేసి క్రింద ఉన్న టెక్స్ట్ నమోదు లేదా నేరుగా నమోదు ఉపయోగించండి.'
          : 'Audio recording is not supported on this browser. Please use text input or Manual Entry.'
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';
      setAudioMimeType(mimeType);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        if (audioBlob.size < 400 && recordingDuration < 1) {
          setMicError(t.emptyAudioAlert);
          setAudioBase64(null);
        } else {
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            setAudioBase64(reader.result as string);
            setActiveStep(2); // Progress to photo step once recorded
          };
        }
        // Stop all audio tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      // Concurrently launch Native Speech Recognition in Telugu for live text transcription
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = speechDialect;

          recognition.onresult = (event: any) => {
            let transcriptText = '';
            for (let i = 0; i < event.results.length; i++) {
              transcriptText += event.results[i][0].transcript + ' ';
            }
            const cleanText = transcriptText.trim();
            if (cleanText) {
              // Live preview only. Do NOT feed this into textInput: the
              // browser's built-in recognizer is locked to a single language
              // per session and mangles Telugu-English code-switching, so
              // sending it to the server alongside the real audio would
              // confuse Gemini's own (better) audio transcription instead
              // of helping it.
              setLiveSpeechTranscript(cleanText);
            }
          };

          recognition.onerror = (e: any) => {
            console.warn('SpeechRecognition notification:', e.error);
          };

          recognition.start();
          speechRecognitionRef.current = recognition;
        } catch (recognitionErr) {
          console.warn('Could not start live SpeechRecognition:', recognitionErr);
        }
      }

      mediaRecorder.start(200);
      setIsRecording(true);
      setRecordingDuration(0);
      setLiveSpeechTranscript('');

      timerIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.warn('Microphone permission or hardware issue:', err);
      setMicError(t.micPermissionError);
    }
  };

  // Stop voice recording and speech recognition
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
  };

  // Handle image upload with validation
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setImageError(t.fileTypeError);
      return;
    }

    // Validate file size (10 MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setImageError(t.fileSizeError);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result as string);
      setImagePreview(reader.result as string);
      setActiveStep(3); // Progress to review step
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageBase64(null);
    setImagePreview(null);
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Preset sample audio chip handler for rapid local testing
  const handleSamplePhrase = (phrase: string) => {
    setTextInput(phrase);
    setAudioBase64(null);
    setActiveStep(2);
  };

  // Helper to populate form fields from structured response
  const populateFieldsFromFirstItem = (data: ExtractedProduceResponse) => {
    if (data.items && data.items.length > 0) {
      setBatchItems(data.items);
      const first = data.items[0];
      setNameEn(first.name_en || '');
      setNameTe(first.name_te || '');
      setQuantity(first.quantity !== null && first.quantity !== undefined ? first.quantity.toString() : '');
      setUnit(first.unit || 'kg');
      setPrice(first.price !== null && first.price !== undefined ? first.price.toString() : '');
      setPriceUnit(first.price_unit || 'kg');
      setAvailability(first.availability === 'sold_out' ? 'sold_out' : 'available');

      const lowerName = (first.name_en || '').toLowerCase();
      if (
        lowerName.includes('spinach') ||
        lowerName.includes('koora') ||
        lowerName.includes('coriander') ||
        lowerName.includes('mint') ||
        lowerName.includes('greens')
      ) {
        setCategory('greens');
      } else if (
        lowerName.includes('banana') ||
        lowerName.includes('mango') ||
        lowerName.includes('papaya') ||
        lowerName.includes('guava') ||
        lowerName.includes('fruit')
      ) {
        setCategory('fruits');
      } else {
        setCategory('vegetables');
      }
    }
  };

  // Trigger Gemini AI extraction with resilient local fallback
  const processWithAI = async () => {
    if (!audioBase64 && (!textInput || !textInput.trim()) && !imageBase64) {
      setAiError(
        lang === 'te'
          ? 'దయచేసి తెలుగులో మాట్లాడండి లేదా టెక్స్ట్ నమోదు చేయండి.'
          : 'Please record voice, enter text, or upload a produce photo.'
      );
      return;
    }

    setIsProcessing(true);
    setAiError(null);
    setAiErrorDetails(null);
    setExtractedData(null);
    setIsConfirmedByVendor(false);

    // Falls back to the basic local text parser ONLY when the vendor typed/selected
    // text (it cannot do anything with audio-only input, by design). The result is
    // NEVER marked as AI-suggested, and a visible warning is always attached, since
    // this fallback only ever extracts a single item and does not understand
    // mixed Telugu-English speech the way Gemini does. It still surfaces the
    // underlying error (with Retry / Manual Entry) rather than hiding it.
    const tryLocalFallback = (errorDetails: {
      errorType: string;
      message: string;
      messageTe?: string;
      canRetry: boolean;
    }): boolean => {
      const localData = parseLocalTeluguInput(textInput, vendorProfile.market_name);
      if (!localData) return false;

      localData.warnings = [
        ...(localData.warnings || []),
        lang === 'te'
          ? 'AI సర్వర్‌ను చేరుకోలేకపోయాము. ఇది ప్రాథమిక స్థానిక అంచనా మాత్రమే (ఒక్క ఐటెమ్ మాత్రమే) — ప్రతి వివరాన్ని జాగ్రత్తగా తనిఖీ చేయండి.'
          : 'Could not reach the AI server. This is a basic local guess (one item only, not full AI) — please double-check every field, especially if you listed more than one item.',
      ];

      setExtractedData(localData);
      populateFieldsFromFirstItem(localData);
      setActiveStep(3);
      setIsAiSuggested(false);
      setAiErrorDetails(errorDetails);
      setAiError(errorDetails.message);
      return true;
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/gemini/parse-produce`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: audioBase64 || undefined,
          audioMimeType: audioBase64 ? audioMimeType : undefined,
          text: textInput.trim() || undefined,
          imageBase64: imageBase64 || undefined,
          vendorLocation: vendorProfile.market_name,
        }),
      });

      // 1. Guard against non-JSON (HTML Vite fallback) to prevent "Unexpected token < in JSON"
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const rawText = await response.text();
        console.warn('Server returned non-JSON response:', rawText.slice(0, 150));

        const handled = tryLocalFallback({
          errorType: 'SERVER_500',
          message:
            'The AI server is not reachable right now (unexpected response). Use Manual Entry for full accuracy, especially with multiple items.',
          canRetry: true,
        });
        if (handled) return;

        activateManualEntry();
        return;
      }

      // 2. Server responded with error status
      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: `Server error: ${response.status}` };
        }

        const errorType =
          errorData.errorType ||
          (response.status === 503
            ? 'AVAILABILITY_503'
            : response.status === 429
            ? 'QUOTA_429'
            : 'SERVER_500');

        const handled = tryLocalFallback({
          errorType,
          message: errorData.error || `Server responded with ${response.status}`,
          messageTe: errorData.errorTe,
          canRetry: errorData.canRetry ?? true,
        });
        if (handled) return;

        setAiErrorDetails({
          errorType,
          message: errorData.error || `Server responded with ${response.status}`,
          messageTe: errorData.errorTe,
          canRetry: errorData.canRetry ?? true,
        });
        setAiError(errorData.error || `Server responded with ${response.status}`);
        return;
      }

      // 3. Successful JSON parsing — the real, full Gemini extraction
      const data: ExtractedProduceResponse & { _meta?: { modelUsed?: string; attempts?: number } } =
        await response.json();

      setExtractedData(data);
      populateFieldsFromFirstItem(data);
      setActiveStep(3);
      setIsAiSuggested(true);
    } catch (err: any) {
      console.error('Error parsing produce:', err);

      const msg = err.message || 'Failed to analyze produce input. Please check your network and try again.';
      const handled = tryLocalFallback({
        errorType: 'SERVER_500',
        message: msg,
        canRetry: true,
      });
      if (handled) return;

      setAiError(msg);
      setAiErrorDetails({
        errorType: 'SERVER_500',
        message: msg,
        canRetry: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle final publish with explicit vendor confirmation
  const handlePublish = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!isConfirmedByVendor) {
      alert(
        lang === 'te'
          ? 'దయచేసి వివరాలను ధృవీకరించే చెక్‌బాక్స్‌ను టిక్ చేయండి.'
          : 'Please check the confirmation box to confirm and publish.'
      );
      return;
    }

    if (batchItems.length > 1) {
      // Validate all items in the batch
      for (let i = 0; i < batchItems.length; i++) {
        const item = batchItems[i];
        if (!item.name_en?.trim() && !item.name_te?.trim()) {
          alert(
            lang === 'te'
              ? `సరుకు #${i + 1} పేరు నమోదు చేయండి.`
              : `Please enter produce name for item #${i + 1}.`
          );
          return;
        }
        if (item.price === null || item.price === undefined || item.price <= 0) {
          alert(
            lang === 'te'
              ? `సరుకు #${i + 1} (${item.name_te || item.name_en}) సరైన ధర నమోదు చేయండి.`
              : `Please enter valid price (>0) for item #${i + 1} (${item.name_en}).`
          );
          return;
        }
        if (item.quantity === null || item.quantity === undefined || item.quantity < 0) {
          alert(
            lang === 'te'
              ? `సరుకు #${i + 1} (${item.name_te || item.name_en}) పరిమాణం నమోదు చేయండి.`
              : `Please enter quantity for item #${i + 1} (${item.name_en}).`
          );
          return;
        }
      }

      const produceList: ProduceItem[] = batchItems.map((item, idx) => {
        const lowerName = (item.name_en || '').toLowerCase();
        let cat: 'vegetables' | 'fruits' | 'greens' | 'other' = 'vegetables';
        if (
          lowerName.includes('spinach') ||
          lowerName.includes('koora') ||
          lowerName.includes('gongura') ||
          lowerName.includes('coriander') ||
          lowerName.includes('greens')
        ) {
          cat = 'greens';
        } else if (
          lowerName.includes('banana') ||
          lowerName.includes('fruit') ||
          lowerName.includes('papaya')
        ) {
          cat = 'fruits';
        }

        const qty = item.quantity ?? 10;
        const pr = item.price ?? 30;

        return {
          id: `prod-${Date.now()}-${idx}`,
          name_en: item.name_en.trim(),
          name_te: item.name_te.trim() || item.name_en.trim(),
          category: cat,
          quantity: qty,
          unit: item.unit || 'kg',
          price: pr,
          price_unit: item.price_unit || item.unit || 'kg',
          availability: qty === 0 || item.availability === 'sold_out' ? 'sold_out' : 'available',
          location: vendorProfile.market_name,
          image_url: resolveProduceImageUrl(item.name_en, imagePreview),
          last_updated: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          created_at: new Date().toISOString(),
          is_demo: false,
          voice_transcript_te: extractedData?.raw_transcript_te || textInput,
          voice_transcript_en: extractedData?.raw_transcript_en,
        };
      });

      onPublish(produceList);
      setPublishSuccess(true);
      setTimeout(() => {
        onBack();
      }, 1200);
      return;
    }

    const parsedPrice = parseFloat(price);
    const parsedQuantity = parseFloat(quantity);

    const missing = validateProduceFields({
      name_en: nameEn,
      name_te: nameTe,
      price: parsedPrice,
      price_unit: priceUnit,
      quantity: parsedQuantity,
      unit,
    });

    if (missing.length > 0) {
      alert(
        lang === 'te'
          ? `దయచేసి అన్ని అవసరమైన వివరాలను పూర్తి చేయండి: ${missing.join(', ')}`
          : `Please fill in all required fields: ${missing.join(', ')}`
      );
      return;
    }

    const finalImageUrl = resolveProduceImageUrl(nameEn, imagePreview);

    const newProduce: ProduceItem = {
      id: `prod-${Date.now()}`,
      name_en: nameEn.trim(),
      name_te: nameTe.trim(),
      category,
      quantity: parsedQuantity,
      unit,
      price: parsedPrice,
      price_unit: priceUnit,
      availability: parsedQuantity === 0 ? 'sold_out' : availability,
      location: vendorProfile.market_name,
      image_url: finalImageUrl || undefined,
      last_updated: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      created_at: new Date().toISOString(),
      is_demo: false, // Confirmed actual vendor listing!
      voice_transcript_te: extractedData?.raw_transcript_te || textInput,
      voice_transcript_en: extractedData?.raw_transcript_en,
    };

    onPublish(newProduce);
    setPublishSuccess(true);
    setTimeout(() => {
      onBack();
    }, 1200);
  };

  const hasVoiceOrText = Boolean(audioBase64 || textInput.trim());
  const hasPhoto = Boolean(imagePreview);

  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5">
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          type="button"
          aria-label="Back to Vendor Home"
          className="touch-target flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors p-2 rounded-xl hover:bg-slate-100 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'te' ? 'వెనక్కి' : 'Back to Home'}</span>
        </button>

        <div className="text-right">
          <span className="text-xs font-bold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            {vendorProfile.stall_number} • {vendorProfile.market_name}
          </span>
        </div>
      </div>

      {/* 1. Linear Three-Step Visual Progress Indicator (Matching Stitch) */}
      <section className="w-full bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200">
        <div className="flex items-center justify-between relative px-2 sm:px-6 py-1">
          {/* Background Track Line */}
          <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-slate-200 z-0" />
          {/* Active Progress Fill */}
          <div
            className="absolute left-8 top-1/2 -translate-y-1/2 h-1 bg-emerald-700 z-0 transition-all duration-300"
            style={{
              width: activeStep === 1 ? '10%' : activeStep === 2 ? '50%' : '90%',
            }}
          />

          {/* Step 1: Voice */}
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className="relative z-10 flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-xs transition-transform group-active:scale-95 ${
                hasVoiceOrText
                  ? 'bg-emerald-700 text-white'
                  : activeStep === 1
                  ? 'bg-emerald-800 text-white ring-4 ring-emerald-100'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {hasVoiceOrText ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <span
              className={`text-xs font-bold ${
                activeStep === 1 ? 'text-emerald-900' : 'text-slate-600'
              }`}
            >
              1. {lang === 'te' ? 'వాయిస్' : 'Voice'}
            </span>
          </button>

          {/* Step 2: Photo */}
          <button
            type="button"
            onClick={() => setActiveStep(2)}
            className="relative z-10 flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-xs transition-transform group-active:scale-95 ${
                hasPhoto
                  ? 'bg-emerald-700 text-white'
                  : activeStep === 2
                  ? 'bg-emerald-800 text-white ring-4 ring-emerald-100'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {hasPhoto ? <Check className="w-4 h-4" /> : '2'}
            </div>
            <span
              className={`text-xs font-bold ${
                activeStep === 2 ? 'text-emerald-900' : 'text-slate-600'
              }`}
            >
              2. {lang === 'te' ? 'ఫోటో' : 'Photo'}
            </span>
          </button>

          {/* Step 3: Review & Publish */}
          <button
            type="button"
            onClick={() => setActiveStep(3)}
            className="relative z-10 flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-xs transition-transform group-active:scale-95 ${
                isConfirmedByVendor
                  ? 'bg-emerald-700 text-white'
                  : activeStep === 3
                  ? 'bg-emerald-800 text-white ring-4 ring-emerald-100'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {isConfirmedByVendor ? <Check className="w-4 h-4" /> : '3'}
            </div>
            <span
              className={`text-xs font-bold ${
                activeStep === 3 ? 'text-emerald-900' : 'text-slate-600'
              }`}
            >
              3. {lang === 'te' ? 'సరిచూసి ప్రచురించు' : 'Review & Publish'}
            </span>
          </button>
        </div>
      </section>

      {/* Main Container */}
      <div className="bg-white rounded-2xl p-4 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Mic className="w-6 h-6 text-sky-600" />
            <span>{t.addProductTitle}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            {t.addProductSubtitle}
          </p>
        </div>

        {/* Success Banner if published */}
        {publishSuccess && (
          <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-950 flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span className="font-bold text-sm sm:text-base">{t.publishSuccess}</span>
          </div>
        )}

        {/* Step 1: Voice Recording & Audio Input (Matching Stitch Visual Design) */}
        <section className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200/90 space-y-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-900 font-bold text-xs border border-sky-200">
              <Mic className="w-4 h-4 text-sky-700" />
              <span>{t.step1Voice}</span>
            </div>

            {hasVoiceOrText && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200">
                {t.step1Done}
              </span>
            )}
          </div>

          {/* Multilingual / Dialect Selection Pill */}
          <div className="flex items-center justify-center gap-2 pt-1 pb-1">
            <span className="text-[11px] font-bold text-sky-900">
              {lang === 'te' ? 'వాయిస్ భాష:' : 'Speech Language:'}
            </span>
            <div className="inline-flex p-1 rounded-xl bg-sky-100/90 border border-sky-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setSpeechDialect('te-IN')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  speechDialect === 'te-IN'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-sky-800 hover:text-sky-950'
                }`}
              >
                తెలుగు (Pure Telugu)
              </button>
              <button
                type="button"
                onClick={() => setSpeechDialect('en-IN')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  speechDialect === 'en-IN'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-sky-800 hover:text-sky-950'
                }`}
              >
                తెలుగు + English (Tenglish / 10+ Items)
              </button>
            </div>
          </div>

          {/* Oversized Tactile Microphone Button */}
          <div className="flex flex-col items-center justify-center py-4 sm:py-6">
            {!isRecording ? (
              <div className="relative flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-sky-200/60 pointer-events-none" />
                <button
                  type="button"
                  onClick={startRecording}
                  aria-label="Start recording Telugu produce voice"
                  className="absolute z-10 w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-sky-600 hover:bg-sky-700 active:scale-95 text-white flex flex-col items-center justify-center shadow-lg shadow-sky-600/30 transition-all border-4 border-sky-100 cursor-pointer"
                >
                  <Mic className="w-8 h-8 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-extrabold mt-0.5 uppercase tracking-wide">
                    Record
                  </span>
                </button>
              </div>
            ) : (
              <div className="relative flex items-center justify-center">
                <div className="absolute w-28 h-28 rounded-full bg-rose-400 animate-ping opacity-40 pointer-events-none" />
                <button
                  type="button"
                  onClick={stopRecording}
                  aria-label="Stop recording voice input"
                  className="relative z-10 w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white flex flex-col items-center justify-center shadow-lg shadow-rose-600/30 transition-all border-4 border-rose-100 cursor-pointer animate-pulse"
                >
                  <Square className="w-7 h-7 fill-current" />
                  <span className="text-[10px] font-extrabold mt-0.5 uppercase tracking-wide">
                    Stop
                  </span>
                </button>
              </div>
            )}

            <p className="text-xs sm:text-sm font-bold text-sky-950 mt-3 text-center">
              {isRecording ? `${t.micRecording} (${recordingDuration}s)` : t.micPrompt}
            </p>

            {/* Live speech transcription display while recording */}
            {isRecording && (
              <div className="mt-3 w-full max-w-md bg-white rounded-xl p-3 border-2 border-emerald-400 shadow-sm text-center animate-pulse">
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-800 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                  <span>
                    {lang === 'te' ? 'మీరు మాట్లాడుతున్నది (Live Telugu Speech):' : 'Transcribing Your Voice Live:'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 font-telugu min-h-[22px]">
                  {liveSpeechTranscript || textInput || (lang === 'te' ? 'ఇప్పుడు తెలుగులో మాట్లాడండి...' : 'Speak now in Telugu...')}
                </p>
              </div>
            )}

            {/* Captured Voice Text Preview when finished recording */}
            {!isRecording && textInput && (
              <div className="mt-3 w-full max-w-md bg-white rounded-xl p-3 border border-sky-300 text-left shadow-2xs">
                <span className="text-[10px] font-bold text-sky-800 uppercase block mb-0.5">
                  {lang === 'te' ? 'రికార్డ్ చేయబడిన వాక్యం (Captured Speech Text):' : 'Captured Speech Text:'}
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 font-telugu">
                  "{textInput}"
                </p>
              </div>
            )}

            {/* Audio Captured Success Tag */}
            {audioBase64 && !isRecording && (
              <div className="mt-2.5 flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-sky-300 text-xs text-sky-950 font-bold shadow-2xs">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>
                  {lang === 'te' ? 'ఆడియో రికార్డ్ అయింది' : 'Audio recording captured'} ({recordingDuration}s)
                </span>
                <button
                  type="button"
                  onClick={() => setAudioBase64(null)}
                  aria-label="Clear recorded audio"
                  className="ml-1 text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Microphone Permission / Device Error */}
            {micError && (
              <div className="mt-3 p-3 rounded-xl bg-amber-100 border border-amber-300 text-amber-950 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{micError}</span>
              </div>
            )}
          </div>

          {/* Quick preset Telugu voice test phrases (Visakhapatnam Dialect) */}
          <div className="pt-2 border-t border-sky-200/80">
            <p className="text-xs font-bold text-sky-950 mb-2">{t.trySampleVoice}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  handleSamplePhrase(
                    'టమాటాలు 40 కేజీలు కేజీ 30, వంకాయలు 25 కేజీలు కేజీ 35, పచ్చిమిర్చి 10 కేజీలు కేజీ 60, పాలకూర 30 కట్టలు కట్ట 20, తోటకూర 20 కట్టలు కట్ట 15, గోంగూర 25 కట్టలు కట్ట 20, బెండకాయలు 15 కేజీలు కేజీ 40, ఉల్లిపాయలు 50 కేజీలు కేజీ 28, బంగాళాదుంపలు 40 కేజీలు కేజీ 32, అరటిపండ్లు 6 డజన్లు డజన్ 50'
                  )
                }
                className="sm:col-span-2 text-xs px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/90 text-emerald-950 border border-emerald-300 font-telugu text-left transition-colors font-semibold flex items-center justify-between"
              >
                <span>
                  ⚡ <strong>10 రకాల సరుకుల ఏకధాటి నమోదు (10 Items Batch Mandi Intake):</strong> "టమాటాలు, వంకాయలు, పచ్చిమిర్చి, పాలకూర, తోటకూర, గోంగూర, బెండకాయలు, ఉల్లిపాయలు, బంగాళాదుంపలు, అరటిపండ్లు..."
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleSamplePhrase('తాజా నాటు టమోటాలు 45 కేజీలు, కేజీ 35 రూపాయలు')}
                className="text-xs px-3 py-2 rounded-xl bg-white hover:bg-sky-100/80 text-sky-950 border border-sky-300 font-telugu text-left transition-colors font-medium"
              >
                "తాజా నాటు టమోటాలు 45 కేజీలు, కేజీ 35 రూపాయలు"
              </button>
              <button
                type="button"
                onClick={() => handleSamplePhrase('గుత్తి వంకాయలు 30 కేజీలు, కేజీ 40 రూపాయలు')}
                className="text-xs px-3 py-2 rounded-xl bg-white hover:bg-sky-100/80 text-sky-950 border border-sky-300 font-telugu text-left transition-colors font-medium"
              >
                "గుత్తి వంకాయలు 30 కేజీలు, కేజీ 40 రూపాయలు"
              </button>
              <button
                type="button"
                onClick={() => handleSamplePhrase('తోట పాలకూర 24 కట్టలు, కట్ట 20 రూపాయలు')}
                className="text-xs px-3 py-2 rounded-xl bg-white hover:bg-sky-100/80 text-sky-950 border border-sky-300 font-telugu text-left transition-colors font-medium"
              >
                "తోట పాలకూర 24 కట్టలు, కట్ట 20 రూపాయలు"
              </button>
              <button
                type="button"
                onClick={() => handleSamplePhrase('వంగడాలు 3 కిలోలు, ధర ఇంకా నిర్ణయించలేదు')}
                className="text-xs px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 font-telugu text-left transition-colors font-medium"
              >
                "వంగడాలు 3 కిలోలు, ధర ఇంకా నిర్ణయించలేదు" (Clarification)
              </button>
            </div>
          </div>

          {/* Manual text-entry fallback */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-sky-950 mb-1">
              {t.manualTextFallback}
            </label>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={t.manualTextPlaceholder}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-white border border-sky-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>
        </section>

        {/* Step 2: Optional Produce Snap (Matching Stitch Produce Snap) */}
        <section className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                {t.step2Photo}
              </h2>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-200/70 px-2.5 py-0.5 rounded-full">
                {t.photoOptional}
              </span>
            </div>
          </div>

          {/* Strict AI Safety Note on Image Inference */}
          <p className="text-xs text-slate-500 font-medium">
            {t.photoNote}
          </p>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            id="produce-photo-input"
          />

          {!imagePreview ? (
            <label
              htmlFor="produce-photo-input"
              className="border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer bg-white transition-colors group touch-target"
            >
              <Camera className="w-7 h-7 text-slate-400 group-hover:text-emerald-700 transition-colors" />
              <span className="text-xs font-bold text-slate-700 mt-2">
                {t.dragPhotoOrClick}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                JPG, PNG, WebP supported (Max 10MB)
              </span>
            </label>
          ) : (
            <div className="flex items-center gap-4 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <img
                src={imagePreview}
                alt="Selected produce"
                className="w-18 h-18 rounded-xl object-cover border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>{t.photoAssistBadge}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {lang === 'te' ? 'కెమెరా ఫోటోతో రకం సరిచూడబడుతుంది.' : 'Photo ready to assist identification'}
                </p>
              </div>
              <button
                type="button"
                onClick={removeImage}
                aria-label="Remove uploaded produce photo"
                className="touch-target p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {imageError && (
            <p className="text-xs text-rose-700 flex items-center gap-1 font-semibold">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{imageError}</span>
            </p>
          )}
        </section>

        {/* Action: Trigger AI Processing & Direct Manual Fallback */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={processWithAI}
            disabled={isProcessing}
            className="flex-1 touch-target-lg flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-800 to-sky-700 hover:from-emerald-900 hover:to-sky-800 active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t.processingAI}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>{t.extractDetailsBtn}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={activateManualEntry}
            className="touch-target px-4 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm transition-colors whitespace-nowrap active:scale-95"
          >
            {lang === 'te' ? 'నేరుగా వివరాలు నమోదు (Manual)' : 'Manual Entry Fallback'}
          </button>
        </div>

        {/* AI Error Notification Card (503 High Demand, 429 Quota, 403 Key, 500 Network) */}
        {aiErrorDetails && (
          <div
            className={`p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm space-y-3 animate-in fade-in ${
              aiErrorDetails.errorType === 'AVAILABILITY_503'
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : aiErrorDetails.errorType === 'QUOTA_429'
                ? 'bg-purple-50 border-purple-300 text-purple-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle
                className={`w-5 h-5 shrink-0 mt-0.5 ${
                  aiErrorDetails.errorType === 'AVAILABILITY_503'
                    ? 'text-amber-600'
                    : aiErrorDetails.errorType === 'QUOTA_429'
                    ? 'text-purple-600'
                    : 'text-rose-600'
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-white/80">
                    {aiErrorDetails.errorType}
                  </span>
                  <span className="font-extrabold text-sm text-slate-900">
                    {aiErrorDetails.errorType === 'AVAILABILITY_503'
                      ? lang === 'te'
                        ? 'జెమిని AI సర్వీస్ ప్రస్తుతం అధిక రద్దీలో ఉంది'
                        : 'Gemini AI Experiencing High Demand'
                      : aiErrorDetails.errorType === 'QUOTA_429'
                      ? lang === 'te'
                        ? 'API కోటా పరిమితి ముగిసింది'
                        : 'API Quota Limit Reached'
                      : lang === 'te'
                      ? 'AI విశ్లేషణలో సమస్య ఏర్పడింది'
                      : 'AI Analysis Notice'}
                  </span>
                </div>

                <p className="mt-1.5 text-xs text-slate-700 leading-relaxed font-medium">
                  {lang === 'te' && aiErrorDetails.messageTe
                    ? aiErrorDetails.messageTe
                    : aiErrorDetails.message}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={activateManualEntry}
                    className="touch-target px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-2xs active:scale-95 transition-all"
                  >
                    {lang === 'te'
                      ? 'నేరుగా వివరాలు నమోదు చేయండి (Manual Entry)'
                      : 'Use Manual Entry Fallback'}
                  </button>

                  {aiErrorDetails.canRetry && (
                    <button
                      type="button"
                      onClick={processWithAI}
                      disabled={isProcessing}
                      className="touch-target px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-white text-slate-800 font-semibold text-xs active:scale-95 transition-all"
                    >
                      {lang === 'te' ? 'మళ్లీ ప్రయత్నించండి (Retry)' : 'Try AI Again'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Extracted Product Details, Editable Review & Vendor Safeguards */}
        {extractedData && (
          <div className="border-t-2 border-slate-100 pt-6 space-y-5 animate-in fade-in">
            {/* Informational Safeguard Banner (Matching Stitch) */}
            <div className="w-full rounded-2xl bg-emerald-50 border-2 border-emerald-300 p-4 shadow-xs flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-xs sm:text-sm text-emerald-950">
                    {lang === 'te'
                      ? 'AI సహాయం మాత్రమే — మీ ధృవీకరణ తప్పనిసరి'
                      : 'AI Suggestions Only — Vendor Verification Mandatory'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 text-[10px] font-bold">
                    {lang === 'te' ? 'సురక్షితం' : 'Protected'}
                  </span>
                </div>
                <p className="text-xs text-emerald-800 mt-1 leading-relaxed font-medium">
                  {lang === 'te'
                    ? 'AI సూచనలు మాత్రమే అందిస్తుంది. మీ ఆమోదం లేకుండా ఏ సరుకు కూడా స్టోర్‌లో ప్రచురించబడదు. వివరాలు సరిచూసి అవసరమైతే దిద్దుబాటు చేయండి.'
                    : 'AI provides suggestions only. Produce is never auto-published without your explicit approval. Review and edit all fields below.'}
                </p>
              </div>
            </div>

            {/* AI Transcribed Words Bubble */}
            {extractedData.raw_transcript_te && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                <span className="font-bold text-slate-900">
                  {lang === 'te' ? 'AI విన్న మాటలు: ' : 'Voice Transcript: '}
                </span>
                <span className="font-telugu italic">"{extractedData.raw_transcript_te}"</span>
              </div>
            )}

            {/* Clarification Box for Missing/Ambiguous Fields */}
            {extractedData.missing_fields && extractedData.missing_fields.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-amber-900">
                  <HelpCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{t.clarificationNeeded}</span>
                </div>
                <p className="text-xs">
                  {t.missingFieldsAlert}{' '}
                  <span className="font-bold">{extractedData.missing_fields.join(', ')}</span>
                </p>
                {extractedData.clarification_questions?.map((q, idx) => (
                  <div key={idx} className="bg-white/95 p-2.5 rounded-lg border border-amber-200 text-xs">
                    <p className="font-semibold text-slate-800">{q.en}</p>
                    <p className="text-slate-600 font-telugu mt-0.5">{q.te}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Review Form - Multi-Item Batch Mode or Single Form */}
            {batchItems.length > 1 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span className="font-extrabold text-xs sm:text-sm text-emerald-950">
                      {lang === 'te'
                        ? `⚡ బహుళ సరుకుల సమీక్ష: ${batchItems.length} సరుకులు గుర్తించబడ్డాయి`
                        : `⚡ Multi-Item Batch Review: ${batchItems.length} Produce Items Detected`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={addBatchItem}
                    className="touch-target inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-2xs cursor-pointer active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{lang === 'te' ? '+ సరుకు చేర్చు' : '+ Add Item'}</span>
                  </button>
                </div>

                {/* List of Batch Produce Items */}
                <div className="space-y-3">
                  {batchItems.map((item, index) => {
                    const benchmark = getRythuBazaarBenchmark(item.name_en || item.name_te);
                    const itemPrice = item.price ?? 0;
                    const isFair = benchmark ? benchmark.isFair(itemPrice) : null;

                    return (
                      <div
                        key={index}
                        className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3 relative group hover:border-emerald-400 transition-colors"
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 font-extrabold text-xs flex items-center justify-center">
                              #{index + 1}
                            </span>
                            <span className="text-xs font-bold text-slate-800 font-telugu">
                              {item.name_te || item.name_en || (lang === 'te' ? `సరుకు #${index + 1}` : `Produce #${index + 1}`)}
                            </span>
                            {benchmark && (
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  isFair
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                                }`}
                              >
                                {isFair
                                  ? `✓ రైతు బజార్ ధర (₹${benchmark.min}-₹${benchmark.max}/${benchmark.unit})`
                                  : `రైతు బజార్ ప్రామాణికం: ₹${benchmark.min}-₹${benchmark.max}`}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => removeBatchItem(index)}
                            aria-label={`Remove produce item ${index + 1}`}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                          {/* English Name */}
                          <div className="sm:col-span-1">
                            <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                              Name (English) *
                            </label>
                            <input
                              type="text"
                              value={item.name_en || ''}
                              onChange={(e) => updateBatchItem(index, { name_en: e.target.value })}
                              placeholder="e.g. Tomatoes"
                              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                              required
                            />
                          </div>

                          {/* Telugu Name */}
                          <div className="sm:col-span-1">
                            <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                              పేరు (తెలుగు) *
                            </label>
                            <input
                              type="text"
                              value={item.name_te || ''}
                              onChange={(e) => updateBatchItem(index, { name_te: e.target.value })}
                              placeholder="ఉదా: టమాటాలు"
                              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none font-telugu"
                              required
                            />
                          </div>

                          {/* Price & Price Unit */}
                          <div className="sm:col-span-1">
                            <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                              {t.fieldPrice} (₹) *
                            </label>
                            <div className="flex gap-1">
                              <input
                                type="number"
                                min="0"
                                step="any"
                                value={item.price !== null && item.price !== undefined ? item.price : ''}
                                onChange={(e) =>
                                  updateBatchItem(index, {
                                    price: e.target.value ? parseFloat(e.target.value) : null,
                                  })
                                }
                                placeholder="35"
                                className="w-20 text-xs px-2.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none font-bold text-emerald-900"
                                required
                              />
                              <select
                                value={item.price_unit || 'kg'}
                                onChange={(e) => updateBatchItem(index, { price_unit: e.target.value })}
                                className="flex-1 text-xs px-1.5 py-2 border border-slate-300 rounded-lg bg-white"
                              >
                                <option value="kg">/ kg</option>
                                <option value="bunch">/ bunch</option>
                                <option value="piece">/ piece</option>
                                <option value="dozen">/ dozen</option>
                              </select>
                            </div>
                          </div>

                          {/* Quantity & Unit */}
                          <div className="sm:col-span-1">
                            <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                              {t.fieldQuantity} *
                            </label>
                            <div className="flex gap-1">
                              <input
                                type="number"
                                min="0"
                                step="any"
                                value={item.quantity !== null && item.quantity !== undefined ? item.quantity : ''}
                                onChange={(e) =>
                                  updateBatchItem(index, {
                                    quantity: e.target.value ? parseFloat(e.target.value) : null,
                                  })
                                }
                                placeholder="45"
                                className="w-20 text-xs px-2.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none font-bold"
                                required
                              />
                              <select
                                value={item.unit || 'kg'}
                                onChange={(e) => updateBatchItem(index, { unit: e.target.value })}
                                className="flex-1 text-xs px-1.5 py-2 border border-slate-300 rounded-lg bg-white"
                              >
                                <option value="kg">kg</option>
                                <option value="bunch">bunch</option>
                                <option value="piece">piece</option>
                                <option value="dozen">dozen</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explicit Batch Vendor Confirmation Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border-2 border-emerald-400 cursor-pointer hover:bg-emerald-100/70 transition-colors">
                    <input
                      type="checkbox"
                      checked={isConfirmedByVendor}
                      onChange={(e) => setIsConfirmedByVendor(e.target.checked)}
                      className="mt-0.5 w-5 h-5 rounded text-emerald-800 focus:ring-emerald-600 border-emerald-400 cursor-pointer"
                    />
                    <span className="text-xs sm:text-sm font-bold text-emerald-950 leading-snug">
                      {lang === 'te'
                        ? `నేను పైన పేర్కొన్న అన్ని ${batchItems.length} సరుకుల ధరలు మరియు పరిమాణాలను ధృవీకరిస్తున్నాను.`
                        : `I verify all ${batchItems.length} produce listings, prices, and quantities above.`}
                    </span>
                  </label>
                </div>

                {/* Batch Submit & Cancel Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onBack}
                    className="touch-target px-5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
                  >
                    {t.cancelBtn}
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePublish()}
                    disabled={!isConfirmedByVendor}
                    className="touch-target-lg flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-sm sm:text-base shadow-sm active:scale-98 transition-all cursor-pointer"
                  >
                    <Check className="w-5 h-5" />
                    <span>
                      {lang === 'te'
                        ? `అన్ని ${batchItems.length} సరుకులను ప్రచురించు`
                        : `Publish All ${batchItems.length} Products`}
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              /* Editable Review Form */
              <form onSubmit={handlePublish} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      {t.fieldProduceNameEn} *
                    </label>
                    {isAiSuggested && nameEn && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-800">
                        {t.aiSuggestedBadge}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => {
                      setNameEn(e.target.value);
                      setIsAiSuggested(false);
                    }}
                    required
                    placeholder="e.g. Guntur Tomatoes"
                    className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      {t.fieldProduceNameTe} *
                    </label>
                    {isAiSuggested && nameTe && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 font-telugu">
                        {t.aiSuggestedBadge}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={nameTe}
                    onChange={(e) => {
                      setNameTe(e.target.value);
                      setIsAiSuggested(false);
                    }}
                    required
                    placeholder="ఉదా: గుంటూరు నాటు టమాటాలు"
                    className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-telugu"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.fieldCategory}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                >
                  <option value="vegetables">{t.filterVegetables}</option>
                  <option value="fruits">{t.filterFruits}</option>
                  <option value="greens">{t.filterGreens}</option>
                  <option value="other">{t.filterOther}</option>
                </select>
              </div>

              {/* Price & Price Unit */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.fieldPrice} *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-400 font-extrabold text-sm">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      placeholder="35"
                      className="w-full text-sm pl-8 pr-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-extrabold text-emerald-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.fieldPriceUnit}
                  </label>
                  <select
                    value={priceUnit}
                    onChange={(e) => setPriceUnit(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                  >
                    <option value="kg">kg (కిలో)</option>
                    <option value="bunch">bunch (కట్ట)</option>
                    <option value="piece">piece (కాయ / ముక్క)</option>
                    <option value="dozen">dozen (డజను)</option>
                    <option value="250g">250 grams</option>
                  </select>
                </div>
              </div>

              {/* Quantity & Unit */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.fieldQuantity} *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    placeholder="45"
                    className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none font-extrabold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t.fieldUnit}
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                  >
                    <option value="kg">kg (కిలో)</option>
                    <option value="bunch">bunch (కట్ట)</option>
                    <option value="piece">piece (కాయ)</option>
                    <option value="dozen">dozen (డజను)</option>
                  </select>
                </div>
              </div>

              {/* Produce Sourcing / Quality Grade (Matching Stitch Source / Grade) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.fieldSourceNote}
                </label>
                <input
                  type="text"
                  value={sourceNote}
                  onChange={(e) => setSourceNote(e.target.value)}
                  placeholder={t.sourceNotePlaceholder}
                  className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              {/* Confirmed Location (Locked per Strict Rule 3) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t.fieldLocation}
                </label>
                <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700">
                  <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="font-bold">
                    {vendorProfile.market_name}, {vendorProfile.city}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-auto">({t.locationLockedNote})</span>
                </div>
              </div>

              {/* Explicit Vendor Confirmation Checkbox (Strict Rule 10) */}
              <div className="pt-2">
                <label className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border-2 border-emerald-400 cursor-pointer hover:bg-emerald-100/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={isConfirmedByVendor}
                    onChange={(e) => setIsConfirmedByVendor(e.target.checked)}
                    className="mt-0.5 w-5 h-5 rounded text-emerald-800 focus:ring-emerald-600 border-emerald-400 cursor-pointer"
                  />
                  <span className="text-xs sm:text-sm font-bold text-emerald-950 leading-snug">
                    {t.confirmCheckboxLabel}
                  </span>
                </label>
              </div>

              {/* Final Submit & Cancel Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onBack}
                  className="touch-target px-5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
                >
                  {t.cancelBtn}
                </button>

                <button
                  type="submit"
                  disabled={!isConfirmedByVendor}
                  className="touch-target-lg flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-sm sm:text-base shadow-sm active:scale-98 transition-all cursor-pointer"
                >
                  <Check className="w-5 h-5" />
                  <span>{t.publishBtn}</span>
                </button>
              </div>
            </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
