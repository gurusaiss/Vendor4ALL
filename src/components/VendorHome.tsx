import React, { useState } from 'react';
import {
  Mic,
  QrCode,
  Eye,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  Edit2,
  Clock,
  MapPin,
  MessageSquare,
  Sparkles,
  RotateCcw,
  Scale,
  Package,
  ShieldCheck,
  ArrowRight,
  Volume2,
  MessageCircle,
} from 'lucide-react';
import { ProduceItem, VendorProfile, CustomerInquiry, Language } from '../types';
import { translations } from '../utils/translations';
import { calculateStockMetrics, getRythuBazaarBenchmark } from '../utils/produceLogic';
import { QrCodeModal } from './QrCodeModal';
import { EditProductModal } from './EditProductModal';
import { MorningBroadcastModal } from './MorningBroadcastModal';

interface VendorHomeProps {
  products: ProduceItem[];
  vendorProfile: VendorProfile;
  inquiries: CustomerInquiry[];
  lang: Language;
  onNavigateToAdd: () => void;
  onNavigateToStorefront: () => void;
  onUpdateProduct: (product: ProduceItem) => void;
  onDeleteProduct: (id: string) => void;
  onResetData: () => void;
}

export const VendorHome: React.FC<VendorHomeProps> = ({
  products,
  vendorProfile,
  inquiries,
  lang,
  onNavigateToAdd,
  onNavigateToStorefront,
  onUpdateProduct,
  onDeleteProduct,
  onResetData,
}) => {
  const t = translations[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStockFilter, setSelectedStockFilter] = useState<'all' | 'available' | 'low' | 'sold_out'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProduceItem | null>(null);

  const metrics = calculateStockMetrics(products);

  // Total quantity in kg / units for summary
  const totalStockCount = products
    .filter((p) => p.availability === 'available')
    .reduce((sum, p) => sum + (p.quantity || 0), 0);

  const filteredProducts = products.filter((p) => {
    // Category match
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

    // Stock status match
    let matchesStock = true;
    if (selectedStockFilter === 'available') {
      matchesStock = p.availability === 'available' && p.quantity > 0;
    } else if (selectedStockFilter === 'low') {
      matchesStock = p.availability === 'available' && p.quantity > 0 && p.quantity <= 5;
    } else if (selectedStockFilter === 'sold_out') {
      matchesStock = p.availability === 'sold_out' || p.quantity === 0;
    }

    // Text search match
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      p.name_en.toLowerCase().includes(query) ||
      p.name_te.includes(query) ||
      p.location.toLowerCase().includes(query);

    return matchesCategory && matchesStock && matchesSearch;
  });

  // Tactile Quantity Increment/Decrement
  const handleQuantityChange = (product: ProduceItem, delta: number) => {
    const currentQty = typeof product.quantity === 'number' ? product.quantity : parseFloat(String(product.quantity)) || 0;
    // Rule: Never allow quantity to become negative
    const nextQty = Math.max(0, currentQty + delta);

    // Automatically transition availability if stock reaches 0 or is restored from 0
    let nextAvailability = product.availability;
    if (nextQty === 0) {
      nextAvailability = 'sold_out';
    } else if (currentQty === 0 && nextQty > 0) {
      nextAvailability = 'available';
    }

    const updated: ProduceItem = {
      ...product,
      quantity: nextQty,
      availability: nextAvailability,
      is_demo: false, // Marked as active vendor record once modified
      last_updated: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    };

    onUpdateProduct(updated);
  };

  // Quick availability toggle (Available vs Sold Out)
  const toggleAvailability = (product: ProduceItem) => {
    const newStatus = product.availability === 'available' ? 'sold_out' : 'available';
    const updated: ProduceItem = {
      ...product,
      availability: newStatus,
      quantity: newStatus === 'sold_out' ? 0 : product.quantity > 0 ? product.quantity : 10,
      is_demo: false,
      last_updated: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    };
    onUpdateProduct(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5">
      {/* 1. Vendor Greeting & Location Banner (Matching Stitch) */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/60 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-telugu text-xs text-slate-500 font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                {vendorProfile.market_name}, {vendorProfile.city}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                {vendorProfile.stall_number}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {t.statusOpenToday} ({vendorProfile.opening_time} - {vendorProfile.closing_time})
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {lang === 'te' ? 'నమస్కారం అప్పారావు గారు' : 'Namaste Sri Apparao'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {lang === 'te' ? vendorProfile.name_te : vendorProfile.name} • {vendorProfile.stall_number}
            </p>
          </div>

          {/* Quick Sharing & Preview Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsBroadcastModalOpen(true)}
              aria-label="Generate Morning Mandi WhatsApp Broadcast"
              className="touch-target flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 text-xs sm:text-sm font-bold transition-all shadow-2xs active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-emerald-700" aria-hidden="true" />
              <span>{lang === 'te' ? '📢 ఉదయపు సందేశం' : '📢 Morning Broadcast'}</span>
            </button>
            <button
              onClick={() => setQrModalOpen(true)}
              aria-label="Share Storefront QR Standee"
              className="touch-target flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold transition-all shadow-2xs active:scale-95"
            >
              <QrCode className="w-4 h-4 text-emerald-700" aria-hidden="true" />
              <span>{t.shareStorefront}</span>
            </button>
            <button
              onClick={onNavigateToStorefront}
              aria-label="Preview Customer Storefront"
              className="touch-target flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-all shadow-2xs active:scale-95"
            >
              <Eye className="w-4 h-4 text-slate-300" aria-hidden="true" />
              <span>{t.previewStorefront}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Today's Stock Overview Metrics (Matching Stitch Business Summary Grid) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>{t.summaryTitle}</span>
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold border border-slate-200">
            {t.summaryDemoTag}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {/* Metric 1: Total Items */}
          <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-xs font-bold truncate">{t.metricTotalItems}</span>
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Package className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none">{metrics.total}</p>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                {lang === 'te' ? 'రకాలు (Active)' : 'Total varieties'}
              </span>
            </div>
          </div>

          {/* Metric 2: In Stock */}
          <div className="bg-emerald-50/70 rounded-xl p-3.5 sm:p-4 border border-emerald-200/90 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-800">
              <span className="text-xs font-bold truncate">{t.metricInStock}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            </div>
            <div className="mt-2">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-950 leading-none">{metrics.inStock}</p>
              <span className="text-[11px] text-emerald-800 font-medium mt-1 block">
                {totalStockCount} {lang === 'te' ? 'యూనిట్లు సిద్ధంగా ఉన్నాయి' : 'units available'}
              </span>
            </div>
          </div>

          {/* Metric 3: Low Stock */}
          <div className="bg-amber-50/70 rounded-xl p-3.5 sm:p-4 border border-amber-200/90 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-amber-900">
              <span className="text-xs font-bold truncate">{t.metricLowStock}</span>
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            </div>
            <div className="mt-2">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-950 leading-none">{metrics.lowStock}</p>
              <span className="text-[11px] text-amber-800 font-medium mt-1 block">
                {lang === 'te' ? 'తక్కువగా ఉన్నాయి (≤5)' : 'Needs restock'}
              </span>
            </div>
          </div>

          {/* Metric 4: Sold Out */}
          <div className="bg-rose-50/70 rounded-xl p-3.5 sm:p-4 border border-rose-200/90 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-rose-900">
              <span className="text-xs font-bold truncate">{t.metricSoldOut}</span>
              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
            </div>
            <div className="mt-2">
              <p className="text-2xl sm:text-3xl font-extrabold text-rose-950 leading-none">{metrics.soldOut}</p>
              <span className="text-[11px] text-rose-800 font-medium mt-1 block">
                {lang === 'te' ? 'నేటికి ముగిశాయి' : 'Completed today'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Primary Action Trigger: Add Product with Telugu Voice (Matching Stitch Hero CTA) */}
      <div className="relative w-full shadow-lg rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-sky-700 p-1">
        <button
          onClick={onNavigateToAdd}
          type="button"
          aria-label="Add Product with Telugu Voice AI"
          className="w-full min-h-[72px] bg-emerald-800 text-white rounded-xl px-4 py-3 flex items-center justify-between active:scale-[0.99] transition-all hover:bg-emerald-850 group cursor-pointer"
        >
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className="relative flex items-center justify-center shrink-0">
              <span className="w-12 h-12 rounded-full bg-sky-400/30 animate-ping absolute"></span>
              <div className="w-12 h-12 rounded-full bg-white text-emerald-800 flex items-center justify-center shadow-md relative z-10 group-hover:scale-105 transition-transform">
                <Mic className="w-6 h-6 text-emerald-800 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="font-extrabold text-base sm:text-xl text-white tracking-tight truncate">
                {t.addVoiceCta}
              </span>
              <span className="text-emerald-100 text-xs sm:text-sm font-medium truncate flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
                <span>{t.addVoiceCtaDesc}</span>
              </span>
            </div>
          </div>

          <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0 text-white ml-2 shadow-xs group-hover:bg-white/25 transition-colors">
            <ArrowRight className="w-5 h-5" />
          </div>
        </button>
      </div>

      {/* 4. QR Standee & WhatsApp Share Card (Matching Stitch) */}
      <div className="bg-gradient-to-r from-sky-50/70 via-white to-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white p-1.5 rounded-xl shadow-xs border border-slate-200 flex items-center justify-center shrink-0">
            <QrCode className="w-full h-full text-emerald-800" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
              {t.qrCardTitle}
            </span>
            <span className="text-xs text-slate-500 font-medium truncate mt-0.5">
              {t.qrCardSubtitle}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setQrModalOpen(true)}
          aria-label="Share stall QR code"
          className="touch-target self-stretch sm:self-auto px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs active:scale-95 transition-all shrink-0"
        >
          <QrCode className="w-4 h-4" />
          <span>{t.qrCardShareBtn}</span>
        </button>
      </div>

      {/* 5. Produce Section Header with Quick Filters & Search */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">{t.activeListings}</h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {products.length} {lang === 'te' ? 'రకాలు' : 'items'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'te'
                ? 'ధరలు లేదా స్టాక్ పరిమాణాన్ని నేరుగా బటన్లతో సర్దుబాటు చేయవచ్చు (+ / -).'
                : 'Adjust live stock using tactile + / - steppers. Updates sync instantly to customer storefront.'}
            </p>
          </div>

          <button
            onClick={onNavigateToAdd}
            className="touch-target inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'te' ? 'కొత్త సరుకు' : 'Add Item'}</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchProducePlaceholder}
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:bg-white focus:outline-none transition-all"
          />
        </div>

        {/* Quick Filter Chips (Matching Stitch design) */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Stock state filter chips */}
          <button
            type="button"
            onClick={() => setSelectedStockFilter('all')}
            className={`min-h-[44px] px-3.5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
              selectedStockFilter === 'all'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {t.filterAll} ({metrics.total})
          </button>
          <button
            type="button"
            onClick={() => setSelectedStockFilter('available')}
            className={`min-h-[44px] px-3.5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
              selectedStockFilter === 'available'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {t.stockAvailable} ({metrics.inStock})
          </button>
          <button
            type="button"
            onClick={() => setSelectedStockFilter('low')}
            className={`min-h-[44px] px-3.5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
              selectedStockFilter === 'low'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            {t.lowStockBadge} ({metrics.lowStock})
          </button>
          <button
            type="button"
            onClick={() => setSelectedStockFilter('sold_out')}
            className={`min-h-[44px] px-3.5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
              selectedStockFilter === 'sold_out'
                ? 'bg-rose-700 text-white shadow-2xs'
                : 'bg-rose-50 text-rose-900 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            {t.soldOutBadge} ({metrics.soldOut})
          </button>
        </div>

        {/* Product Cards Grid with Stitch Styling & 48px Tactile Steppers */}
        {filteredProducts.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="font-semibold">{t.noProductsFound}</p>
            <p className="text-xs text-slate-400 mt-1">Try clearing filters or search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
            {filteredProducts.map((product) => {
              const isAvailable = product.availability === 'available' && product.quantity > 0;
              const isLowStock = isAvailable && product.quantity <= 5;

              return (
                <div
                  key={product.id}
                  className={`bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-3 border shadow-xs transition-all ${
                    !isAvailable
                      ? 'border-rose-200 bg-rose-50/25'
                      : isLowStock
                      ? 'border-amber-200 hover:border-amber-300'
                      : 'border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {/* Card Header: Thumbnail, Name, Status, and Price Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name_en}
                          className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl object-cover shrink-0 bg-slate-100 border border-slate-200 shadow-2xs"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0 font-bold text-xs p-1">
                          {product.name_en.slice(0, 3)}
                        </div>
                      )}

                      <div className="flex flex-col min-w-0">
                        {/* Status Pills */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                              !isAvailable
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : isLowStock
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            }`}
                          >
                            {!isAvailable
                              ? t.soldOutBadge
                              : isLowStock
                              ? `${t.lowStockBadge} (${product.quantity} ${product.unit})`
                              : t.inStockBadge}
                          </span>

                          {/* Demo Record vs Verified Indicator */}
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                              product.is_demo
                                ? 'bg-slate-100 text-slate-600 border border-slate-200'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {product.is_demo ? t.demoRecordTag : t.vendorVerifiedTag}
                          </span>
                        </div>

                        {/* Produce Name */}
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base mt-1 truncate">
                          {lang === 'te' ? product.name_te : product.name_en}
                        </h3>
                        <p className="text-xs text-slate-500 font-telugu truncate">
                          {lang === 'te' ? product.name_en : product.name_te}
                        </p>

                        {/* Timestamp */}
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{product.last_updated}</span>
                        </span>

                        {/* Rythu Bazaar Market Benchmark Badge */}
                        {(() => {
                          const benchmark = getRythuBazaarBenchmark(product.name_en || product.name_te);
                          if (!benchmark) return null;
                          const isFair = benchmark.isFair(product.price);
                          return (
                            <div
                              className={`mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                                isFair
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200'
                              }`}
                            >
                              <span>⚖️</span>
                              <span>
                                {isFair
                                  ? lang === 'te'
                                    ? `రైతు బజార్ ధర (₹${benchmark.min}-₹${benchmark.max})`
                                    : `Rythu Bazaar Fair (₹${benchmark.min}-₹${benchmark.max})`
                                  : lang === 'te'
                                  ? `ప్రామాణికం: ₹${benchmark.min}-₹${benchmark.max}`
                                  : `Market: ₹${benchmark.min}-₹${benchmark.max}`}
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Quick Price Badge with 1-Tap Edit Trigger */}
                    <button
                      type="button"
                      onClick={() => setEditingProduct(product)}
                      title={t.changePrice}
                      aria-label={`${t.changePrice} for ${product.name_en}`}
                      className="touch-target flex flex-col items-end px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 active:scale-95 transition-all text-right justify-center shrink-0"
                    >
                      <div className="flex items-center gap-1 text-emerald-800">
                        <span className="text-base sm:text-lg font-extrabold">₹{product.price}</span>
                        <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium leading-none">
                        / {product.price_unit}
                      </span>
                    </button>
                  </div>

                  {/* Tactile + and - Stock Quantity Steppers (min 48px touch targets) */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] font-semibold text-slate-500">
                        {t.stockQuantity}
                      </span>
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {product.quantity} {product.unit} {t.stockAvailable}
                      </span>
                    </div>

                    {/* Stepper Control */}
                    <div className="flex items-center bg-slate-100 rounded-xl p-1 shadow-2xs border border-slate-200 shrink-0">
                      {/* Decrement Button */}
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(product, -1)}
                        disabled={product.quantity <= 0}
                        aria-label={`Decrease ${product.name_en} stock`}
                        className="stock-minus min-w-[48px] min-h-[48px] rounded-lg bg-white text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center font-bold text-xl active:bg-slate-100 active:scale-95 transition-all shadow-xs"
                      >
                        -
                      </button>

                      {/* Current Quantity Display */}
                      <span
                        className={`w-12 text-center font-extrabold text-base sm:text-lg ${
                          !isAvailable ? 'text-rose-700' : isLowStock ? 'text-amber-800' : 'text-slate-900'
                        }`}
                      >
                        {product.quantity}
                      </span>

                      {/* Increment Button */}
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(product, 1)}
                        aria-label={`Increase ${product.name_en} stock`}
                        className="stock-plus min-w-[48px] min-h-[48px] rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 flex items-center justify-center font-bold text-xl active:scale-95 transition-all shadow-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Secondary Actions: Quick Status Toggle & Full Edit */}
                  <div className="pt-1.5 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => toggleAvailability(product)}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${
                        isAvailable
                          ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
                          : 'border-emerald-300 text-emerald-800 hover:bg-emerald-50'
                      }`}
                    >
                      {isAvailable ? t.markSoldOut : t.markAvailable}
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingProduct(product)}
                      className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>{t.editProduce}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Customer Inquiry Activity Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-700" />
              <span>{t.customerInquiriesTitle}</span>
            </h2>
            <p className="text-xs text-slate-500">{t.customerInquiriesSubtitle}</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {inquiries.length} {lang === 'te' ? 'విచారణలు' : 'Inquiries'}
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {inquiries.map((inq) => (
            <div key={inq.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">{inq.customer_name}</span>
                  <span className="text-[10px] text-slate-400">• {inq.time}</span>
                  <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                    {inq.product_name}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 italic">"{inq.message}"</p>
              </div>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  'Namaste! Thank you for inquiring about fresh produce at MVP Colony Rythu Bazaar Stall #24.'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 transition-colors"
              >
                <span>{t.replyOnWhatsapp}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* 7. LocalStorage Notice & Reset Option */}
      <div className="bg-slate-100/90 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            <strong>Prototype Data Transparency: </strong>
            {t.prototypeDisclaimer}
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            if (window.confirm(t.clearDataConfirm)) {
              onResetData();
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white text-slate-700 font-semibold whitespace-nowrap self-start sm:self-auto transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>{t.clearDataBtn}</span>
        </button>
      </div>

      {/* QR Code Sharing Modal */}
      <QrCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        vendorProfile={vendorProfile}
        lang={lang}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        product={editingProduct}
        isOpen={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
        onSave={(updated) => {
          onUpdateProduct({
            ...updated,
            is_demo: false, // Explicitly marked as vendor edited
          });
        }}
        onDelete={onDeleteProduct}
        lang={lang}
      />

      {/* Morning Mandi WhatsApp Broadcast Modal */}
      <MorningBroadcastModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        vendorProfile={vendorProfile}
        products={products}
        lang={lang}
      />
    </div>
  );
};
