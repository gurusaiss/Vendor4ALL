import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { VendorHome } from './components/VendorHome';
import { AddProductScreen } from './components/AddProductScreen';
import { CustomerStorefront } from './components/CustomerStorefront';
import { AboutScreen } from './components/AboutScreen';
import { Language, ProduceItem, VendorProfile, CustomerInquiry } from './types';
import {
  getStoredProducts,
  saveStoredProducts,
  addStoredProduct,
  updateStoredProduct,
  deleteStoredProduct,
  getStoredVendorProfile,
  getStoredInquiries,
  getStoredLanguage,
  saveStoredLanguage,
  resetAllToDefaults,
} from './utils/storage';
import { DEFAULT_VENDOR_PROFILE, INITIAL_SEED_PRODUCE } from './utils/produceLogic';
import { translations } from './utils/translations';
import { MapPin } from 'lucide-react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'add' | 'storefront' | 'about'>('home');
  const [lang, setLang] = useState<Language>('en');
  const [products, setProducts] = useState<ProduceItem[]>([]);
  const [vendorProfile, setVendorProfile] = useState<VendorProfile>(DEFAULT_VENDOR_PROFILE);
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initial load from localStorage and URL query params
  useEffect(() => {
    const storedLang = getStoredLanguage();
    setLang(storedLang);

    const storedProducts = getStoredProducts();
    setProducts(storedProducts);

    const storedProfile = getStoredVendorProfile();
    setVendorProfile(storedProfile);

    const storedInq = getStoredInquiries();
    setInquiries(storedInq);

    // Support URL routing via query param (e.g. ?screen=storefront)
    const params = new URLSearchParams(window.location.search);
    const screenParam = params.get('screen');
    if (screenParam === 'storefront' || screenParam === 'add' || screenParam === 'about') {
      setCurrentScreen(screenParam);
    }

    setIsLoaded(true);
  }, []);

  const handleNavigate = (screen: 'home' | 'add' | 'storefront' | 'about') => {
    setCurrentScreen(screen);
    try {
      const url = new URL(window.location.href);
      if (screen === 'home') {
        url.searchParams.delete('screen');
      } else {
        url.searchParams.set('screen', screen);
      }
      window.history.pushState(null, '', url.toString());
    } catch {
      // Fallback in case window history is not accessible
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleLang = () => {
    const nextLang = lang === 'en' ? 'te' : 'en';
    setLang(nextLang);
    saveStoredLanguage(nextLang);
  };

  const handleAddProduct = (item: ProduceItem | ProduceItem[]) => {
    const updated = addStoredProduct(item);
    setProducts(updated);
  };

  const handleUpdateProduct = (item: ProduceItem) => {
    const updated = updateStoredProduct(item);
    setProducts(updated);
  };

  const handleDeleteProduct = (id: string) => {
    const updated = deleteStoredProduct(id);
    setProducts(updated);
  };

  const handleResetData = () => {
    resetAllToDefaults();
    setProducts(INITIAL_SEED_PRODUCE);
    setVendorProfile(DEFAULT_VENDOR_PROFILE);
    setInquiries(getStoredInquiries());
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Loading Vendor4ALL...</p>
        </div>
      </div>
    );
  }

  const t = translations[lang];

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8ff] selection:bg-emerald-100 selection:text-emerald-950 font-sans">
      {/* Top Header Navigation */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        lang={lang}
        onToggleLang={handleToggleLang}
      />

      {/* Main Content View with responsive padding for mobile bottom nav */}
      <main className="flex-1 pb-24 md:pb-12">
        {currentScreen === 'home' && (
          <VendorHome
            products={products}
            vendorProfile={vendorProfile}
            inquiries={inquiries}
            lang={lang}
            onNavigateToAdd={() => handleNavigate('add')}
            onNavigateToStorefront={() => handleNavigate('storefront')}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onResetData={handleResetData}
          />
        )}

        {currentScreen === 'add' && (
          <AddProductScreen
            vendorProfile={vendorProfile}
            lang={lang}
            onBack={() => handleNavigate('home')}
            onPublish={handleAddProduct}
          />
        )}

        {currentScreen === 'storefront' && (
          <CustomerStorefront
            products={products}
            vendorProfile={vendorProfile}
            lang={lang}
          />
        )}

        {currentScreen === 'about' && (
          <AboutScreen
            lang={lang}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mb-16 md:mb-0 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">Vendor4ALL</span>
            <span>•</span>
            <span className="flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              MVP Colony Rythu Bazaar, Visakhapatnam
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNavigate('about')}
              className="hover:text-emerald-800 font-semibold transition-colors"
            >
              {t.navAbout}
            </button>
            <button
              onClick={() => handleNavigate('storefront')}
              className="hover:text-emerald-800 font-semibold transition-colors"
            >
              {t.navStorefront}
            </button>
            <span className="text-slate-400">
              {lang === 'te' ? 'రైతు సోదరుల సౌలభ్యం కోసం' : 'Empowering Local Livelihoods'}
            </span>
          </div>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Navigation (< 768px) matching Stitch design */}
      <MobileBottomNav
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        lang={lang}
      />
    </div>
  );
}
