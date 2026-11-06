import React from 'react';
import { Store, Mic, ShoppingBag, Info, Globe, MapPin } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface NavbarProps {
  currentScreen: 'home' | 'add' | 'storefront' | 'about';
  onNavigate: (screen: 'home' | 'add' | 'storefront' | 'about') => void;
  lang: Language;
  onToggleLang: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  lang,
  onToggleLang,
}) => {
  const t = translations[lang];

  const navItems = [
    {
      id: 'home' as const,
      label: t.navVendorHome,
      icon: Store,
      badge: null,
    },
    {
      id: 'add' as const,
      label: t.navAddProduct,
      icon: Mic,
      badge: 'AI',
      highlight: true,
    },
    {
      id: 'storefront' as const,
      label: t.navStorefront,
      icon: ShoppingBag,
      badge: null,
    },
    {
      id: 'about' as const,
      label: t.navAbout,
      icon: Info,
      badge: null,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Brand Logo & Rythu Bazaar Status */}
          <div
            onClick={() => onNavigate('home')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onNavigate('home');
              }
            }}
            aria-label="Vendor4ALL Home"
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none min-w-0"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-sm shadow-emerald-900/20 group-hover:bg-emerald-900 group-active:scale-95 transition-all shrink-0">
              <Store className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-base sm:text-2xl text-slate-900 tracking-tight">
                  Vendor<span className="text-emerald-700">4ALL</span>
                </span>
                <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 shrink-0">
                  Stall #24
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                <span className="font-semibold text-emerald-800 text-[11px] sm:text-xs truncate">
                  {lang === 'te' ? 'దుకాణం తెరిచి ఉంది' : 'Stall Open Today'}
                </span>
                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="text-slate-500 text-[11px] sm:text-xs font-medium hidden sm:inline truncate">
                  MVP Colony Rythu Bazaar
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation (>= 768px) */}
          <nav
            role="navigation"
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-1.5 lg:gap-2"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                    isActive
                      ? item.highlight
                        ? 'bg-sky-600 text-white shadow-sm ring-1 ring-sky-700'
                        : 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-900'
                      : item.highlight
                      ? 'text-sky-800 bg-sky-50 hover:bg-sky-100/80 border border-sky-200'
                      : 'text-slate-700 hover:text-emerald-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : item.highlight ? 'text-sky-600' : 'text-slate-500'
                    }`}
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                  {item.badge && !isActive && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-sky-500 text-white ml-0.5">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Language Toggle Switcher */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onToggleLang}
              type="button"
              aria-label={`Switch language to ${lang === 'en' ? 'Telugu' : 'English'}`}
              className="min-h-[44px] min-w-[44px] px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-300 text-slate-800 flex items-center justify-center font-bold text-xs sm:text-sm active:scale-95 transition-all shadow-2xs focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-700 mr-1.5" aria-hidden="true" />
              <span className={lang === 'en' ? 'text-emerald-800 font-extrabold' : 'text-slate-500'}>
                EN
              </span>
              <span className="mx-1 text-slate-300">|</span>
              <span
                className={`font-telugu ${
                  lang === 'te' ? 'text-emerald-800 font-extrabold' : 'text-slate-500'
                }`}
              >
                తెలుగు
              </span>
            </button>

            {/* Vendor Profile Avatar / Stall Identifier */}
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-xs border-2 border-emerald-100 shrink-0 select-none"
              title="Sri Apparao (Stall #24)"
            >
              24
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
