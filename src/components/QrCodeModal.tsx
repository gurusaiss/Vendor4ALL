import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, Download, ExternalLink, Store } from 'lucide-react';
import { Language, VendorProfile } from '../types';
import { translations } from '../utils/translations';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorProfile: VendorProfile;
  lang: Language;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  vendorProfile,
  lang,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const t = translations[lang];

  // Storefront URL pointing to current origin + ?screen=storefront
  const storefrontUrl = typeof window !== 'undefined'
    ? `${window.location.origin}?screen=storefront`
    : 'https://vendor4all.local?screen=storefront';

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        storefrontUrl,
        {
          width: 240,
          margin: 2,
          color: {
            dark: '#15803D',
            light: '#FFFFFF',
          },
        },
        (error) => {
          if (error) console.error('Failed to generate QR code', error);
        }
      );
    }
  }, [isOpen, storefrontUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(storefrontUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `vendor4all-stall24-qr.png`;
      a.click();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {lang === 'te' ? 'కస్టమర్ స్టోర్‌ఫ్రంట్ క్యూఆర్ కోడ్' : 'Customer Storefront QR Code'}
              </h3>
              <p className="text-xs text-slate-500">{vendorProfile.stall_number} • {vendorProfile.market_name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Canvas */}
        <div className="flex flex-col items-center justify-center py-6 bg-slate-50 rounded-xl my-4 border border-slate-100">
          <canvas ref={canvasRef} className="rounded-lg shadow-sm bg-white p-2" />
          <p className="text-xs text-slate-500 mt-3 text-center px-4">
            {lang === 'te'
              ? 'వినియోగదారులు ఈ క్యూఆర్ కోడ్‌ను స్కాన్ చేసి నేరుగా మీ రోజువారీ సరుకులు మరియు ధరలను చూడవచ్చు.'
              : 'Rythu Bazaar shoppers can scan this at your stall to view today’s fresh produce and live prices.'}
          </p>
        </div>

        {/* Shareable Link */}
        <div className="space-y-2 mb-4">
          <label className="text-xs font-semibold text-slate-700">
            {lang === 'te' ? 'స్టోర్‌ఫ్రంట్ వెబ్ లింక్:' : 'Storefront Web Link:'}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={storefrontUrl}
              className="w-full text-xs bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-600 font-mono select-all focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (lang === 'te' ? 'కాపీ అయింది!' : 'Copied!') : (lang === 'te' ? 'కాపీ' : 'Copy')}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>{lang === 'te' ? 'క్యూఆర్ డౌన్‌లోడ్' : 'Download QR'}</span>
          </button>
          <button
            onClick={() => {
              onClose();
              window.open(storefrontUrl, '_blank');
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold transition-colors shadow-xs"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{lang === 'te' ? 'స్టోర్‌ని చూడండి' : 'Open Storefront'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
