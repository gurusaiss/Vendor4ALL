import React from 'react';
import {
  Store,
  Mic,
  ShieldCheck,
  CheckCircle2,
  Users,
  RotateCcw,
  Sparkles,
  MapPin,
  MessageCircle,
  QrCode,
  Shield,
  HeartHandshake,
  Check,
  ExternalLink,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface AboutScreenProps {
  lang: Language;
  onResetData: () => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ lang, onResetData }) => {
  const t = translations[lang];

  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6">
      {/* 1. Top Mission Framing Hero Card (Matching Stitch About Hero) */}
      <section className="relative overflow-hidden rounded-3xl bg-white p-5 sm:p-7 shadow-xs border border-slate-200">
        <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-emerald-100/50 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold border border-emerald-300">
              <MapPin className="w-3.5 h-3.5 text-emerald-800" />
              <span>{t.aboutHeroBadge}</span>
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {t.aboutFreeBadge}
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {t.aboutHeroHeading}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            {t.aboutHeroSubheading}
          </p>

          {/* Stitch Hero Photography Slice */}
          <div className="relative w-full h-44 sm:h-56 rounded-2xl overflow-hidden mt-3 shadow-xs">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJBTDfMF7DxpRCiscprQjpPTGRQzaJpGKDbzeFog_UeGcKOKZoWbWDdem-U6czYyXPUolxwVpi4KRRkrhgncfQfyQjDU2SyKBJeK4rsG_sw85opSRU74fv-xX31z8AdzztQKgIspOTXoQuDwUrfLL_N5oSPisFWflk00vSOJXO7NS4kF7Ye4kwwcQSDH-Or2RXX9dEaFO-QWnK9wAFRknZFnVAUAlp_R-l-HVONhM"
              alt="Visakhapatnam Rythu Bazaar pushcart produce vendor"
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-1.5 font-bold">
                <Mic className="w-4 h-4 text-emerald-400" />
                <span>{t.aboutVoiceBadge}</span>
              </div>
              <span className="bg-emerald-700 text-white font-extrabold px-2.5 py-0.5 rounded-full text-[11px]">
                Pilot Stall #24
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Four-Step Connected Visual Timeline (Matching Stitch Process) */}
      <section className="bg-white rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            {t.timelineTitle}
          </h2>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {lang === 'te' ? '4 సులభ దశలు' : '4 Simple Steps'}
          </span>
        </div>

        <div className="pt-2 flex flex-col gap-4">
          {/* Step 1: Telugu Voice */}
          <div className="flex items-start gap-3.5 relative">
            <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs">
              1
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  {t.step1Heading}
                </h3>
                <Mic className="w-4 h-4 text-emerald-800" />
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {t.step1Desc}
              </p>
            </div>
          </div>

          <div className="w-0.5 h-6 bg-slate-200 ml-5 -my-2" />

          {/* Step 2: AI Extraction & Review */}
          <div className="flex items-start gap-3.5 relative">
            <div className="w-10 h-10 rounded-2xl bg-sky-800 text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs">
              2
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  {t.step2Heading}
                </h3>
                <Sparkles className="w-4 h-4 text-sky-700" />
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {t.step2Desc}
              </p>
            </div>
          </div>

          <div className="w-0.5 h-6 bg-slate-200 ml-5 -my-2" />

          {/* Step 3: QR Storefront */}
          <div className="flex items-start gap-3.5 relative">
            <div className="w-10 h-10 rounded-2xl bg-purple-800 text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs">
              3
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  {t.step3Heading}
                </h3>
                <QrCode className="w-4 h-4 text-purple-700" />
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {t.step3Desc}
              </p>
            </div>
          </div>

          <div className="w-0.5 h-6 bg-slate-200 ml-5 -my-2" />

          {/* Step 4: WhatsApp Inquiries */}
          <div className="flex items-start gap-3.5 relative">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs">
              4
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  {t.step4Heading}
                </h3>
                <MessageCircle className="w-4 h-4 text-emerald-700 fill-current" />
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {t.step4Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Vendor-First Agency & Ethics Guarantee (Matching Stitch) */}
      <section className="bg-emerald-50 rounded-2xl p-5 border-2 border-emerald-300 shadow-2xs space-y-2.5">
        <div className="flex items-center gap-2 text-emerald-950">
          <Shield className="w-5 h-5 text-emerald-800 shrink-0" />
          <h3 className="font-extrabold text-sm sm:text-base">
            {t.ethicsGuaranteeTitle}
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          {t.ethicsGuaranteeDesc}
        </p>
        <div className="flex items-center gap-2 pt-1 text-emerald-900 font-bold text-xs">
          <Check className="w-4 h-4 text-emerald-700" />
          <span>{t.ethicsGuaranteeBadge}</span>
        </div>
      </section>

      {/* 4. Rythu Bazaar Community Photo Slice (Matching Stitch) */}
      <section className="relative rounded-2xl overflow-hidden shadow-xs border border-slate-200">
        <div className="h-36 sm:h-44 w-full">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0mI3vuwEwXiOy7ai3jxz38K3zxfyDTpI_tQlcffIElKor85wyH5jPd0__gOhxJNnRadcQTwYAPPXlxivrCiWKQeqYSzXpo7FBhuqb7gsi9RtwguBo89pjEjLeyduFpxvK57tV1IywWuN1p2Mtm4R5f_l0623CJuMqjYUXD5GS2rDR-gXQQEPoe761JrQQjYBoqCAfCBMUF-byUQyVxCgS33hTqGdtwmyrDnwNESk"
            alt="MVP Colony Rythu Bazaar Visakhapatnam morning stalls"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent flex items-end p-4">
          <p className="text-white text-xs font-medium leading-snug">
            {t.communityPhotoCaption}
          </p>
        </div>
      </section>

      {/* 5. Project Context & Pilot Location */}
      <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4 text-sky-800" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">
              {t.projectContextTitle}
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">
              Civic Technology Initiative • MVP Colony, Visakhapatnam
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          {t.projectContextDesc}
        </p>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-800 shrink-0" />
          <span className="font-semibold">
            {lang === 'te'
              ? 'ప్రారంభ పైలట్: ఎం.వి.పి. కాలనీ రైతు బజార్, సెక్టార్ 4 గేట్, విశాఖపట్నం, ఆంధ్రప్రదేశ్'
              : 'Initial Pilot: MVP Colony Rythu Bazaar, Sector 4 Gate, Visakhapatnam, Andhra Pradesh'}
          </span>
        </div>
      </section>

      {/* 6. LocalStorage Data Management & Clear Data Control */}
      <section className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
          {lang === 'te' ? 'డేటా నిర్వహణ & ప్రోటోటైప్ పరీక్ష' : 'Data Management & Prototype Testing'}
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          {t.prototypeDisclaimer}
        </p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(t.clearDataConfirm)) {
              onResetData();
            }
          }}
          className="touch-target flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-300 bg-white hover:bg-rose-50 text-rose-800 text-xs font-bold shadow-2xs active:scale-95 transition-all"
        >
          <RotateCcw className="w-4 h-4 text-rose-700" />
          <span>{t.clearDataBtn}</span>
        </button>
      </section>
    </div>
  );
};
