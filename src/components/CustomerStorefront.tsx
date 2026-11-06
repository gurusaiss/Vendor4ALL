import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Search,
  MessageCircle,
  Share2,
  ExternalLink,
  QrCode,
  Mic,
  Navigation,
  CreditCard,
  Banknote,
  Info,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { ProduceItem, VendorProfile, Language } from '../types';
import { translations } from '../utils/translations';
import { createWhatsAppChatUrl, createGeneralWhatsAppUrl, getRythuBazaarBenchmark } from '../utils/produceLogic';
import { QrCodeModal } from './QrCodeModal';

interface CustomerStorefrontProps {
  products: ProduceItem[];
  vendorProfile: VendorProfile;
  lang: Language;
}

export const CustomerStorefront: React.FC<CustomerStorefrontProps> = ({
  products,
  vendorProfile,
  lang,
}) => {
  const t = translations[lang];

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'sold_out'>('all');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isVoiceSearchActive, setIsVoiceSearchActive] = useState(false);

  // Filter products based on search, category, and availability
  const filteredProducts = products.filter((p) => {
    // Availability filter
    if (availabilityFilter === 'available' && (p.availability !== 'available' || p.quantity <= 0)) {
      return false;
    }
    if (availabilityFilter === 'sold_out' && p.availability === 'available' && p.quantity > 0) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && p.category !== selectedCategory) {
      return false;
    }

    // Search query
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    return (
      (p.name_en && p.name_en.toLowerCase().includes(query)) ||
      (p.name_te && p.name_te.includes(query)) ||
      (p.location && p.location.toLowerCase().includes(query))
    );
  });

  const handleShareStore = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      navigator
        .share({
          title: `${vendorProfile.name} - ${vendorProfile.market_name}`,
          text: `Check today's fresh produce and live prices at ${vendorProfile.stall_number}, ${vendorProfile.market_name}!`,
          url,
        })
        .catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const toggleVoiceSearch = () => {
    setIsVoiceSearchActive((prev) => !prev);
    if (!isVoiceSearchActive) {
      setTimeout(() => {
        setIsVoiceSearchActive(false);
      }, 3500);
    }
  };

  // Google Maps link only if market_name is configured
  const mapsUrl = vendorProfile.market_name
    ? `https://maps.google.com/?q=${encodeURIComponent(
        `${vendorProfile.market_name}, ${vendorProfile.city || 'Visakhapatnam'}`
      )}`
    : null;

  return (
    <div className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-6">
      {/* 1. Vendor Profile Header (Matching Stitch Customer Storefront) */}
      <section className="bg-white rounded-3xl p-4 sm:p-6 shadow-xs border border-slate-200 relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute -right-12 -bottom-12 w-40 h-40 rounded-full bg-emerald-50 pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 relative z-10">
          {/* Vendor Avatar */}
          <div className="relative shrink-0">
            {vendorProfile.avatar_url ? (
              <img
                src={vendorProfile.avatar_url}
                alt={vendorProfile.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shadow-xs border-2 border-emerald-100"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-extrabold text-2xl shadow-xs">
                {vendorProfile.name.charAt(0)}
              </div>
            )}

            {/* Demo indicator tag on avatar if demo vendor */}
            {vendorProfile.is_demo && (
              <span className="absolute -bottom-2 -left-1 text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full shadow-2xs whitespace-nowrap">
                {t.demoVendorBadge}
              </span>
            )}
          </div>

          {/* Profile Text */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-800 text-white shadow-2xs">
                {vendorProfile.stall_number}
              </span>

              {vendorProfile.is_demo && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-300">
                  {t.demoStorefrontBadge}
                </span>
              )}

              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-900 border border-emerald-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>{t.statusOpenToday}</span>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {lang === 'te' ? vendorProfile.name_te : vendorProfile.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium font-telugu">
              {lang === 'te' ? vendorProfile.name : vendorProfile.name_te}
            </p>

            <p className="text-xs text-slate-600 flex items-center gap-1 font-medium pt-0.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>
                {vendorProfile.market_name}, {vendorProfile.city}
              </span>
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
            <button
              type="button"
              onClick={() => setIsQrModalOpen(true)}
              className="touch-target flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors active:scale-95"
            >
              <QrCode className="w-4 h-4 text-emerald-800" />
              <span>{t.viewStallQr}</span>
            </button>

            <button
              type="button"
              onClick={handleShareStore}
              className="touch-target flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>{copiedLink ? (lang === 'te' ? 'కాపీ అయింది!' : 'Copied!') : (lang === 'te' ? 'షేర్' : 'Share')}</span>
            </button>
          </div>
        </div>

        {/* Stall Timings & Live Update Strip */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-emerald-800" />
            <span>
              {t.operatingHoursTitle}: {vendorProfile.opening_time} - {vendorProfile.closing_time}
            </span>
          </div>

          {vendorProfile.address_details && (
            <span className="text-[11px] text-slate-500 font-medium">
              {vendorProfile.address_details}
            </span>
          )}
        </div>
      </section>

      {/* 2. Direct General WhatsApp / Call Action Bar */}
      <section className="grid grid-cols-5 gap-2 sm:gap-3">
        <a
          href={createGeneralWhatsAppUrl(
            vendorProfile.whatsapp_number,
            vendorProfile.name,
            lang
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-4 touch-target-lg min-h-[52px] sm:min-h-[56px] px-4 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white shadow-sm flex items-center justify-between active:scale-[0.99] transition-transform"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="font-extrabold text-sm sm:text-base leading-tight truncate">
                {t.orderOnWhatsapp}
              </span>
              <span className="text-[11px] text-emerald-100 truncate">
                {vendorProfile.phone ? `Direct: ${vendorProfile.phone}` : 'Chat with Vendor'}
              </span>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-emerald-200 shrink-0" />
        </a>

        {vendorProfile.phone ? (
          <a
            href={`tel:${vendorProfile.phone.replace(/\s+/g, '')}`}
            aria-label="Call Vendor"
            className="col-span-1 touch-target min-h-[52px] sm:min-h-[56px] rounded-2xl bg-slate-100 hover:bg-slate-200 text-emerald-900 flex flex-col items-center justify-center active:scale-95 transition-transform border border-slate-200 shadow-2xs"
          >
            <Phone className="w-5 h-5 text-emerald-800" />
            <span className="text-[10px] font-bold mt-0.5">{t.callVendorBtn}</span>
          </a>
        ) : (
          <div className="col-span-1 min-h-[52px] rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
            <Phone className="w-5 h-5" />
          </div>
        )}
      </section>

      {/* 3. Search and Filters (Availability & Category) */}
      <section className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-2xs space-y-3">
        {/* Search Input with Voice Feedback simulation */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isVoiceSearchActive
                  ? t.voiceSearchPlaceholder
                  : t.searchProducePlaceholder
              }
              className={`w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 sm:py-3 border rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none transition-all ${
                isVoiceSearchActive
                  ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-200'
                  : 'border-slate-300 bg-white'
              }`}
            />
          </div>

          <button
            type="button"
            onClick={toggleVoiceSearch}
            aria-label="Telugu Voice Search"
            className={`touch-target w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all ${
              isVoiceSearchActive
                ? 'bg-emerald-700 text-white animate-pulse'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Availability Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 px-1 shrink-0">
            {lang === 'te' ? 'లభ్యత:' : 'Stock:'}
          </span>
          {[
            { id: 'all', label: t.filterAllStock },
            { id: 'available', label: t.filterInStock },
            { id: 'sold_out', label: t.filterSoldOut },
          ].map((statusTab) => (
            <button
              key={statusTab.id}
              type="button"
              onClick={() => setAvailabilityFilter(statusTab.id as any)}
              className={`touch-target px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                availabilityFilter === statusTab.id
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {statusTab.label}
            </button>
          ))}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 px-1 shrink-0">
            {lang === 'te' ? 'రకం:' : 'Type:'}
          </span>
          {[
            { id: 'all', label: t.filterAll },
            { id: 'vegetables', label: t.filterVegetables },
            { id: 'greens', label: t.filterGreens },
            { id: 'fruits', label: t.filterFruits },
            { id: 'other', label: t.filterOther },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`touch-target px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-slate-800 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* 4. Product Catalog Grid (Mobile 2-col, Desktop 3-col) */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            {lang === 'te' ? 'నేటి సరుకుల ధరల పట్టిక' : "Today's Verified Produce"}
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            {filteredProducts.length} {lang === 'te' ? 'వస్తువులు' : 'items'}
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center text-slate-500 border border-slate-200 space-y-2">
            <Info className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-700">{t.noProductsFound}</p>
            <p className="text-xs text-slate-400">
              {lang === 'te'
                ? 'శోధన పదాన్ని మార్చండి లేదా లభ్యత ఫిల్టర్‌ను రీసెట్ చేయండి.'
                : 'Try clearing search filters or choosing another category.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4.5">
            {filteredProducts.map((product) => {
              const isAvailable = product.availability === 'available' && product.quantity > 0;
              const priceStr = `₹${product.price} / ${product.price_unit || product.unit}`;
              const whatsappUrl = createWhatsAppChatUrl(
                vendorProfile.whatsapp_number,
                lang === 'te' ? product.name_te : product.name_en,
                vendorProfile.name,
                priceStr,
                lang
              );

              return (
                <div
                  key={product.id}
                  className={`bg-white rounded-2xl border p-2.5 sm:p-3.5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between ${
                    isAvailable ? 'border-slate-200 hover:border-emerald-300' : 'border-slate-200 opacity-80'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Produce Image Card */}
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name_en}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xs p-2 text-center">
                          {product.name_en}
                        </div>
                      )}

                      {/* In-Stock / Sold-Out Badge */}
                      <div className="absolute top-1.5 left-1.5">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs backdrop-blur-xs ${
                            isAvailable
                              ? 'bg-emerald-700 text-white'
                              : 'bg-rose-700 text-white'
                          }`}
                        >
                          {isAvailable ? t.inStockBadge : t.soldOutBadge}
                        </span>
                      </div>

                      {/* Demo Record Tag if sample record */}
                      {product.is_demo && (
                        <div className="absolute top-1.5 right-1.5">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-900/80 text-amber-200 shadow-2xs">
                            Demo
                          </span>
                        </div>
                      )}

                      {/* Last Updated Timestamp */}
                      {product.last_updated && (
                        <div className="absolute bottom-1.5 right-1.5 bg-slate-900/85 backdrop-blur-xs text-white text-[9px] font-medium px-1.5 py-0.5 rounded flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span className="truncate max-w-[85px]">{product.last_updated}</span>
                        </div>
                      )}
                    </div>

                    {/* Produce Name in Telugu and English */}
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-1">
                        {lang === 'te' ? product.name_te : product.name_en}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-telugu line-clamp-1 mt-0.5">
                        {lang === 'te' ? product.name_en : product.name_te}
                      </p>
                    </div>

                    {/* Confirmed Price and Available Quantity */}
                    <div className="pt-1 border-t border-slate-100 flex items-baseline justify-between gap-1 flex-wrap">
                      <div>
                        <span className="text-base sm:text-lg font-extrabold text-emerald-900">
                          ₹{product.price}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 ml-0.5">
                          / {product.price_unit || product.unit}
                        </span>
                      </div>

                      {isAvailable && (
                        <span className="text-[10px] text-slate-500 font-medium">
                          {product.quantity} {product.unit}
                        </span>
                      )}
                    </div>

                    {/* Rythu Bazaar Price Benchmark Tag for Storefront Buyers */}
                    {(() => {
                      const benchmark = getRythuBazaarBenchmark(product.name_en || product.name_te);
                      if (!benchmark) return null;
                      const isFair = benchmark.isFair(product.price);
                      return (
                        <div
                          className={`text-[9.5px] font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                            isFair
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          <span>⚖️</span>
                          <span className="truncate">
                            {isFair
                              ? lang === 'te'
                                ? `రైతు బజార్ ధర: ₹${benchmark.min}-₹${benchmark.max}/${benchmark.unit}`
                                : `Rythu Bazaar Fair: ₹${benchmark.min}-₹${benchmark.max}`
                              : `Market: ₹${benchmark.min}-₹${benchmark.max}`}
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Individual WhatsApp Inquiry Button */}
                  <div className="pt-3">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`touch-target w-full flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                        isAvailable
                          ? 'bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current shrink-0" />
                      <span className="truncate">
                        {isAvailable ? t.orderOnWhatsapp : t.inquireOnWhatsapp}
                      </span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. Location, Timings & Directions Card (Matching Stitch) */}
      {mapsUrl && (
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-800 shrink-0" />
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {t.operatingHoursTitle}
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
              {vendorProfile.stall_number}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">{t.morningTiming}</span>
              <p className="text-slate-600 font-semibold">{vendorProfile.opening_time} - 01:00 PM</p>
              <span className="text-[10px] text-slate-400">{t.dailyOpenText}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">{t.eveningTiming}</span>
              <p className="text-slate-600 font-semibold">04:30 PM - {vendorProfile.closing_time}</p>
              <span className="text-[10px] text-slate-400">{t.freshHarvestText}</span>
            </div>
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="touch-target w-full min-h-[44px] flex items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold border border-slate-300 active:scale-98 transition-transform"
          >
            <Navigation className="w-4 h-4 text-emerald-800" />
            <span>{t.getDirectionsBtn}</span>
          </a>
        </section>
      )}

      {/* 6. Direct Payment Trust & Zero Aggregator Fee Notice (Matching Stitch) */}
      <section className="bg-emerald-900 text-white rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Banknote className="w-4 h-4 text-emerald-200" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold">{t.directPaymentTitle}</h3>
            <p className="text-[11px] text-emerald-200 font-medium">{t.directPaymentSubtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
          <div className="flex items-center gap-1.5 bg-white/10 rounded-lg p-2">
            <CreditCard className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            <span>{t.directPaymentUpi}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 rounded-lg p-2">
            <Banknote className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            <span>{t.directPaymentCash}</span>
          </div>
        </div>

        <p className="text-[10px] text-emerald-300/90 leading-relaxed pt-1">
          {t.directPaymentNotice}
        </p>
      </section>

      {/* 7. Prototype Transparency Notice */}
      <div className="bg-slate-100 rounded-xl p-3 border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2.5">
        <Info className="w-4 h-4 text-slate-500 shrink-0" />
        <p>
          <strong>{lang === 'te' ? 'గమనిక:' : 'Notice:'} </strong>
          {t.prototypeDisclaimer}
        </p>
      </div>

      {/* Interactive QR Code Modal */}
      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        vendorProfile={vendorProfile}
        lang={lang}
      />
    </div>
  );
};
