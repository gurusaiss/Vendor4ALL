import { ProduceItem, VendorProfile, CustomerInquiry } from '../types';
import { INITIAL_SEED_PRODUCE, DEFAULT_VENDOR_PROFILE } from './produceLogic';

const STORAGE_KEYS = {
  PRODUCTS: 'vendor4all_products_v2',
  PROFILE: 'vendor4all_vendor_profile_v2',
  INQUIRIES: 'vendor4all_inquiries_v2',
  LANGUAGE: 'vendor4all_lang_v1',
};

const INITIAL_INQUIRIES: CustomerInquiry[] = [
  {
    id: 'inq-1',
    customer_name: 'Lakshmi G. (Seethammadhara)',
    product_name: 'Country Tomatoes (నాటు టమాటాలు)',
    message: 'Are 5 kg country tomatoes available? Can I pick them up around 8:30 AM?',
    time: '25 mins ago',
    status: 'replied',
  },
  {
    id: 'inq-2',
    customer_name: 'Ramesh Naidu (Sector 4, MVP)',
    product_name: 'Fresh Spinach (పాలకూర)',
    message: 'Need 4 fresh bunches of spinach for lunch, please keep aside.',
    time: '45 mins ago',
    status: 'pending',
  },
  {
    id: 'inq-3',
    customer_name: 'K. Satyanarayana (Kirlampudi)',
    product_name: 'Simhachalam Bananas',
    message: 'Will fresh Chakkarakeli bananas arrive again tomorrow morning?',
    time: '1 hour ago',
    status: 'replied',
  },
];

export function getStoredProducts(): ProduceItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_SEED_PRODUCE));
      return INITIAL_SEED_PRODUCE;
    }
    const parsed: ProduceItem[] = JSON.parse(data);
    // Auto-update legacy tomato image if present
    const migrated = parsed.map(p => {
      if (p.id === 'prod-1' && p.image_url?.includes('photo-1546470427-0d4db154ceb7')) {
        return {
          ...p,
          image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
        };
      }
      return p;
    });
    return migrated;
  } catch (e) {
    console.error('Failed to read products from localStorage', e);
    return INITIAL_SEED_PRODUCE;
  }
}

export function saveStoredProducts(products: ProduceItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (e) {
    console.error('Failed to save products to localStorage', e);
  }
}

export function addStoredProduct(product: ProduceItem | ProduceItem[]): ProduceItem[] {
  const current = getStoredProducts();
  const toAdd = Array.isArray(product) ? product : [product];
  const updated = [...toAdd, ...current];
  saveStoredProducts(updated);
  return updated;
}

export function updateStoredProduct(product: ProduceItem): ProduceItem[] {
  const current = getStoredProducts();
  const updated = current.map(p => (p.id === product.id ? product : p));
  saveStoredProducts(updated);
  return updated;
}

export function deleteStoredProduct(id: string): ProduceItem[] {
  const current = getStoredProducts();
  const updated = current.filter(p => p.id !== id);
  saveStoredProducts(updated);
  return updated;
}

export function getStoredVendorProfile(): VendorProfile {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_VENDOR_PROFILE));
      return DEFAULT_VENDOR_PROFILE;
    }
    return JSON.parse(data);
  } catch (e) {
    return DEFAULT_VENDOR_PROFILE;
  }
}

export function getStoredInquiries(): CustomerInquiry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(INITIAL_INQUIRIES));
      return INITIAL_INQUIRIES;
    }
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_INQUIRIES;
  }
}

export function getStoredLanguage(): 'en' | 'te' {
  try {
    const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return lang === 'te' ? 'te' : 'en';
  } catch {
    return 'en';
  }
}

export function saveStoredLanguage(lang: 'en' | 'te'): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  } catch {}
}

export function resetAllToDefaults(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.INQUIRIES);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_SEED_PRODUCE));
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_VENDOR_PROFILE));
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(INITIAL_INQUIRIES));
  } catch (e) {
    console.error('Failed to reset localStorage', e);
  }
}
