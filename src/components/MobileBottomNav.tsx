import React from 'react';
import { Store, PlusCircle, Eye, Info } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface MobileBottomNavProps {
  currentScreen: 'home' | 'add' | 'storefront' | 'about';
  onNavigate: (screen: 'home' | 'add' | 'storefront' | 'about') => void;
  lang: Language;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentScreen,
  onNavigate,
  lang,
}) => {
  const t = translations[lang];

  const items = [
    {
      id: 'home' as const,
      label: t.navMobileHome,
      icon: Store,
      badge: null,
    },
    {
      id: 'add' as const,
      label: t.navMobileAdd,
      icon: PlusCircle,
      badge: 'AI',
    },
    {
      id: 'storefront' as const,
      label: t.navMobileStorefront,
      icon: Eye,
      badge: null,
    },
    {
      id: 'about' as const,
      label: t.navMobileAbout,
      icon: Info,
      badge: null,
    },
  ];

  return (
    <nav
      role="navigation"
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-safe bg-white/95 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center justify-around h-18 px-2 max-w-lg mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex flex-col items-center justify-center min-w-[68px] min-h-[52px] px-2 py-1.5 rounded-xl transition-all duration-150 active:scale-95 touch-target ${
                isActive
                  ? 'text-emerald-900 font-bold bg-emerald-100/80 border border-emerald-300/60 shadow-2xs'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-slate-100/60 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-emerald-800' : 'text-slate-500'
                  }`}
                  aria-hidden="true"
                />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-3 text-[9px] font-extrabold px-1 rounded-full bg-sky-500 text-white shadow-2xs animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] leading-tight mt-1 text-center truncate max-w-[76px] ${
                  lang === 'te' ? 'font-telugu' : ''
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
