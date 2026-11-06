import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Share2,
  Volume2,
  VolumeX,
  MessageCircle,
  Sparkles,
  Calendar,
  MapPin,
  Clock,
} from 'lucide-react';
import { ProduceItem, VendorProfile, Language } from '../types';
import { generateMorningBroadcastText } from '../utils/produceLogic';

interface MorningBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorProfile: VendorProfile;
  products: ProduceItem[];
  lang: Language;
}

export const MorningBroadcastModal: React.FC<MorningBroadcastModalProps> = ({
  isOpen,
  onClose,
  vendorProfile,
  products,
  lang,
}) => {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechSynthesisAvailable, setSpeechSynthesisAvailable] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesisAvailable(true);
    }
  }, []);

  // Stop speech if modal closes
  useEffect(() => {
    if (!isOpen && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const broadcastText = generateMorningBroadcastText(vendorProfile, products, lang);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(broadcastText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(broadcastText)}`;
    window.open(url, '_blank');
  };

  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();

    // Prepare clean announcement speech text
    const available = products.filter((p) => p.availability === 'available' && p.quantity > 0);
    let speechContent = '';

    if (lang === 'te') {
      speechContent = `నమస్కారం! ${vendorProfile.name_te || vendorProfile.name} స్టాల్ నంబర్ 24, MVP కాలనీ రైతు బజార్. నేటి తాజా కూరగాయలు: `;
      available.forEach((p) => {
        speechContent += `${p.name_te || p.name_en}, కిలో ${p.price} రూపాయలు. `;
      });
      speechContent += `రైతు బజార్ సమయం ఉదయం ${vendorProfile.opening_time} నుండి ${vendorProfile.closing_time} వరకు. ధన్యవాదాలు!`;
    } else {
      speechContent = `Namaste! Apparao Fresh Vegetables, Stall 24, MVP Colony Rythu Bazaar. Today's fresh produce: `;
      available.forEach((p) => {
        speechContent += `${p.name_en}, rupees ${p.price} per ${p.price_unit}. `;
      });
      speechContent += `Visit stall 24 today. Thank you!`;
    }

    const utterance = new SpeechSynthesisUtterance(speechContent);
    utterance.lang = lang === 'te' ? 'te-IN' : 'en-IN';
    utterance.rate = 0.9; // Natural announcement cadence

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="morning-broadcast-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200/90 space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 id="morning-broadcast-title" className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
                {lang === 'te' ? 'వాట్సాప్ ఉదయపు సందేశం' : 'WhatsApp Morning Broadcast'}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {lang === 'te'
                  ? 'కస్టమర్ గ్రూపులకు నేటి తాజా ధరల ప్రకటన'
                  : "Daily fresh mandi rates for customer WhatsApp groups"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="touch-target p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Preview Box */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>{lang === 'te' ? 'సందేశం ప్రివ్యూ (WhatsApp Message):' : 'Broadcast Message Preview:'}</span>
            <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
              {products.filter((p) => p.availability === 'available' && p.quantity > 0).length}{' '}
              {lang === 'te' ? 'సరుకులు సిద్ధం' : 'items in stock'}
            </span>
          </div>

          <pre className="p-3.5 sm:p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm font-sans text-slate-800 whitespace-pre-wrap leading-relaxed select-all">
            {broadcastText}
          </pre>
        </div>

        {/* Action Controls */}
        <div className="space-y-2.5 pt-1">
          {/* WhatsApp Direct Share Button */}
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="touch-target-lg w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-sm sm:text-base shadow-sm active:scale-98 transition-all cursor-pointer"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{lang === 'te' ? 'వాట్సాప్‌లో షేర్ చేయండి' : 'Share to WhatsApp Group'}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            {/* Copy Button */}
            <button
              type="button"
              onClick={handleCopy}
              className="touch-target flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm active:scale-95 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4 text-slate-600" />}
              <span>{copied ? (lang === 'te' ? 'కాపీ అయింది!' : 'Copied!') : lang === 'te' ? 'టెక్స్ట్ కాపీ' : 'Copy Text'}</span>
            </button>

            {/* Audio Announcement / Loudspeaker Button */}
            {speechSynthesisAvailable && (
              <button
                type="button"
                onClick={handleToggleAudio}
                className={`touch-target flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border font-bold text-xs sm:text-sm active:scale-95 transition-all ${
                  isPlayingAudio
                    ? 'bg-rose-50 border-rose-300 text-rose-800 animate-pulse'
                    : 'bg-emerald-50 border-emerald-300 hover:bg-emerald-100 text-emerald-900'
                }`}
              >
                {isPlayingAudio ? <VolumeX className="w-4 h-4 text-rose-700" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
                <span>
                  {isPlayingAudio
                    ? lang === 'te'
                      ? 'ఆపు (Stop)'
                      : 'Stop Audio'
                    : lang === 'te'
                    ? 'లౌడ్‌స్పీకర్ అనౌన్స్‌మెంట్'
                    : 'Play Loudspeaker'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Explanatory footer */}
        <p className="text-[11px] text-slate-500 text-center leading-snug pt-1">
          {lang === 'te'
            ? 'ఈ సందేశం మీ స్థానిక కస్టమర్ వాట్సాప్ గ్రూపులకు నేరుగా వెళ్తుంది. కస్టమర్‌లు క్లిక్ చేసి నేరుగా ఆర్డర్ చేయవచ్చు.'
            : 'Sends automated morning price broadcast to your customer WhatsApp group. Customers can reply to order directly.'}
        </p>
      </div>
    </div>
  );
};
