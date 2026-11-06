import { ProduceItem, ExtractedProduceItem, ExtractedProduceResponse, VendorProfile } from '../types';

export const DEFAULT_VENDOR_PROFILE: VendorProfile = {
  name: 'Apparao Fresh Vegetables',
  name_te: 'అప్పారావు తాజా కూరగాయలు',
  stall_number: 'Stall #24 (స్టాల్ 24)',
  market_name: 'MVP Colony Rythu Bazaar',
  market_name_te: 'ఎం.వి.పి. కాలనీ రైతు బజార్',
  city: 'Visakhapatnam',
  city_te: 'విశాఖపట్నం',
  phone: '+91 98480 22334',
  whatsapp_number: '919848022334',
  opening_time: '06:00 AM',
  closing_time: '08:30 PM',
  is_demo: true,
  avatar_url:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAHR2Z9QYEdYjrpnQt1mg_HVHvH0gnUPAX_hME3gq_fHPH5vxqGXhbUZ_AT6S523DvMsLjU2WGlj1PEbHr6bxNqVATeWnjB7s1v2EAoWKnKSxPiCxM75wQzcyCNzYgimkda1LCk6UO6wfcckVwo4tJBghdYfYpLk9mzt7GsFc4Z5dHOLi6vYQVR5lYYWGoCVnr2beRPCALeZMCKVQ-Bj_QeFIqjYkOORLs3ayx-lYU',
  address_details: 'Opposite Sector 4 Gate, MVP Colony, Visakhapatnam',
};

export const INITIAL_SEED_PRODUCE: ProduceItem[] = [
  {
    id: 'prod-1',
    name_en: 'Guntur Tomatoes (Naatu Tomato)',
    name_te: 'గుంటూరు నాటు టమాటాలు',
    category: 'vegetables',
    quantity: 45,
    unit: 'kg',
    price: 35,
    price_unit: 'kg',
    availability: 'available',
    location: 'MVP Colony Rythu Bazaar',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgvSgEGL5xPJJYqVB1tMazOUZOWJHgZQKWSKoMBQ7WQ5n8v9ATBBSEWU6QNjp8_AQvolbiwtTsU2cFFH7RVy7F98USlDeq4bMQuvgpmnz3B7YPqI120ysDlpBwWjtCv46uXrMmhbka1ZR-T_2M1dG7LfbZ24bNaQfgWdYQi1XHtqi7vhheemU_aTQaVVtbwP1pgHRyLdwV-vZRbj45Y137CMmbu3TiiAtCdSc7liI',
    last_updated: 'Today, 06:45 AM',
    created_at: new Date().toISOString(),
    is_demo: true,
    voice_transcript_te: 'తాజా నాటు టమోటాలు 45 కేజీలు స్టాక్ ఉంది, కేజీ ధర 35 రూపాయలు.',
    voice_transcript_en: 'Fresh country tomatoes 45 kg in stock, price 35 rupees per kg.',
  },
  {
    id: 'prod-2',
    name_en: 'Vizag Brinjal (Vankaya)',
    name_te: 'వైజాగ్ గుత్తి వంకాయలు',
    category: 'vegetables',
    quantity: 30,
    unit: 'kg',
    price: 40,
    price_unit: 'kg',
    availability: 'available',
    location: 'MVP Colony Rythu Bazaar',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8jCI3qWWsUXS4EHPe5Fe7byEIrMPsIK6iYEf_ie7xPSxjD1E1iMFFTiBY1KmnUnxUukvi5vx3q1paq2gEexcNo7uJwbegDBMftmzMAyHvp7L8WjkyZvvXs9p8YKRM-XE72fpNqyxZvOc7C770jv1KwA2J0ciyU_DTagDhRt_loMfMbaE7c-mWICq5MI5u-bm-A8UkJNqHSVJtuMUQg1oOJOjjeTmCBz-baEOOPL4',
    last_updated: 'Today, 07:00 AM',
    created_at: new Date().toISOString(),
    is_demo: true,
    voice_transcript_te: 'గుత్తి వంకాయలు 30 కిలోలు, కిలో 40 రూపాయలు.',
    voice_transcript_en: 'Vizag brinjals 30 kg, 40 rupees per kg.',
  },
  {
    id: 'prod-3',
    name_en: 'Green Chillies (Pachi Mirapa)',
    name_te: 'పచ్చి మిరపకాయలు',
    category: 'vegetables',
    quantity: 4,
    unit: 'kg',
    price: 60,
    price_unit: 'kg',
    availability: 'available',
    location: 'MVP Colony Rythu Bazaar',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJqSzsdFsrW-vPRwXhcCjVfAGo6ZwCDobGZz5HvA1K1Cs3b7__ztmew4g7TnAtygSyHpfJA7xVB6L-0rFSYE9hUoQlsjDM79ICW--CoqJmSz-JEjjzLKeFKWTcxnQaqxPsXu2R8fOJXkg7ZYmWaaOTMXx-3Z26N9nVw78-lPMbLS_CXcxvwNYSf7Vfwxhq6SAFT36MqSaeera3pkvGbOWKL9tihCr1FhfQkVtHEUw',
    last_updated: 'Today, 07:10 AM',
    created_at: new Date().toISOString(),
    is_demo: true,
    voice_transcript_te: 'పచ్చి మిరపకాయలు 4 కిలోలు, కిలో 60 రూపాయలు.',
    voice_transcript_en: 'Green chillies 4 kg, 60 rupees per kg.',
  },
  {
    id: 'prod-4',
    name_en: 'Garden Spinach (Thota Palakura)',
    name_te: 'తోట పాలకూర కట్ట',
    category: 'greens',
    quantity: 24,
    unit: 'bunch',
    price: 20,
    price_unit: 'bunch',
    availability: 'available',
    location: 'MVP Colony Rythu Bazaar',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtt8xvrY95iFv2inkSlyGY2ftvHxdqk2_orJSwCExaQTcIgpQQxWw0LACBZS-iHo6BC9zOAX6hME2EvzLh0yEi5XchYTVUafj3V-jIMwXiYl97yVU79GONJnu9EtYMEVZt24WxKYTc1SbJKX4i-w2o9zdiVJLt45yTqoVnkWh14Hz70EC4D_SPmqBk8xCZrpopad7vgwkH05mFhUAZiqtgCfMgJUMxm9EYrKtV5Fg',
    last_updated: 'Today, 06:15 AM',
    created_at: new Date().toISOString(),
    is_demo: true,
    voice_transcript_te: 'తోట పాలకూర 24 కట్టలు, కట్ట 20 రూపాయలు.',
    voice_transcript_en: 'Spinach 24 bunches, 20 rupees per bunch.',
  },
  {
    id: 'prod-5',
    name_en: 'Tender Ladies Finger (Bhendi)',
    name_te: 'లేత బెండకాయలు',
    category: 'vegetables',
    quantity: 15,
    unit: 'kg',
    price: 45,
    price_unit: 'kg',
    availability: 'available',
    location: 'MVP Colony Rythu Bazaar',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6DsEl69DEOoul9LoMf9WD1MIB37ZT3FmJLwb6DPvSp0vhqzUZ7wtawxVw4H_JIneCiwiTQqugD-ZVFWDiAr4_e9bhmSqtEyrsiG6EvDj9zQpkR9C2PtM7Bk4LuhyCaRZRcPJywB1T9hNQRQhAEPo9XcdiVQHIvtT3RBjVx_7_HLHMKdPAjTY789GxcSk3lg3Mj4fQ1s4IAl0WbH2CXakQu7Xex8aI2GKulT28maE',
    last_updated: 'Today, 06:30 AM',
    created_at: new Date().toISOString(),
    is_demo: true,
    voice_transcript_te: 'లేత బెండకాయలు 15 కిలోలు, కిలో 45 రూపాయలు.',
    voice_transcript_en: 'Tender ladies finger 15 kg, 45 rupees per kg.',
  },
  {
    id: 'prod-6',
    name_en: 'Simhachalam Bananas (Karpura Chakkarakeli)',
    name_te: 'కర్పూర చక్కెరకేళి అరటిపండ్లు',
    category: 'fruits',
    quantity: 0,
    unit: 'dozen',
    price: 60,
    price_unit: 'dozen',
    availability: 'sold_out',
    location: 'MVP Colony Rythu Bazaar',
    image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    last_updated: 'Today, 09:30 AM',
    created_at: new Date().toISOString(),
    is_demo: true,
    voice_transcript_te: 'అరటిపండ్లు అన్నీ అయిపోయాయి.',
    voice_transcript_en: 'All bananas are sold out for today.',
  },
];

/**
 * Validates whether an extracted item has complete required information
 * Returns list of missing required field names
 */
export function validateProduceFields(item: Partial<ExtractedProduceItem>): string[] {
  const missing: string[] = [];
  if (!item.name_en && !item.name_te) {
    missing.push('product_name');
  }
  if (item.price === undefined || item.price === null || item.price <= 0) {
    missing.push('price');
  }
  if (!item.price_unit) {
    missing.push('price_unit');
  }
  if (item.quantity === undefined || item.quantity === null || item.quantity < 0) {
    missing.push('quantity');
  }
  if (!item.unit) {
    missing.push('unit');
  }
  return missing;
}

/**
 * Calculates summary metrics for vendor dashboard
 */
export function calculateStockMetrics(products: ProduceItem[]) {
  const total = products.length;
  const inStock = products.filter(p => p.availability === 'available' && p.quantity > 0).length;
  const lowStock = products.filter(p => p.availability === 'available' && p.quantity > 0 && p.quantity <= 5).length;
  const soldOut = products.filter(p => p.availability === 'sold_out' || p.quantity === 0).length;
  return { total, inStock, lowStock, soldOut };
}

/**
 * Generates WhatsApp click-to-chat URL with pre-filled message
 */
export function createWhatsAppChatUrl(
  phone: string,
  produceName: string,
  vendorName: string,
  priceStr: string,
  lang: 'en' | 'te' = 'en'
): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const textEn = `Namaste ${vendorName}, I saw your listing for "${produceName}" (${priceStr}) at MVP Colony Rythu Bazaar on Vendor4ALL. Is it available right now?`;
  const textTe = `నమస్తే ${vendorName} గారు, నేను Vendor4ALL లో MVP కాలనీ రైతు బజార్ వద్ద మీ "${produceName}" (${priceStr}) చూశాను. ప్రస్తుతం అందుబాటులో ఉందా?`;
  const message = lang === 'te' ? textTe : textEn;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates general vendor WhatsApp URL
 */
export function createGeneralWhatsAppUrl(
  phone: string,
  vendorName: string,
  lang: 'en' | 'te' = 'en'
): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const textEn = `Namaste ${vendorName}, I am visiting MVP Colony Rythu Bazaar today. What fresh produce is available at your stall?`;
  const textTe = `నమస్తే ${vendorName} గారు, నేను ఈరోజు MVP కాలనీ రైతు బజార్‌కి వస్తున్నాను. మీ స్టాల్‌లో ఏ తాజా కూరగాయలు ఉన్నాయి?`;
  const message = lang === 'te' ? textTe : textEn;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Formats produce price string cleanly
 */
export function formatProducePrice(price: number, price_unit: string): string {
  return `₹${price} / ${price_unit}`;
}

export interface PriceBenchmark {
  min: number;
  max: number;
  unit: string;
  source: string;
  isFair: (price: number) => boolean;
}

/**
 * Returns daily Rythu Bazaar fair market benchmark range for MVP Colony Rythu Bazaar
 */
export function getRythuBazaarBenchmark(name: string): PriceBenchmark | null {
  const lower = (name || '').toLowerCase();
  const createBenchmark = (min: number, max: number, unit: string): PriceBenchmark => ({
    min,
    max,
    unit,
    source: 'AP Rythu Bazaar MVP Colony Daily Benchmark',
    isFair: (price: number) => price >= min * 0.85 && price <= max * 1.15,
  });

  if (lower.includes('tomato') || lower.includes('టమాట') || lower.includes('టమోట')) {
    return createBenchmark(30, 38, 'kg');
  }
  if (lower.includes('brinjal') || lower.includes('vankaya') || lower.includes('వంకాయ') || lower.includes('eggplant')) {
    return createBenchmark(35, 45, 'kg');
  }
  if (lower.includes('chilli') || lower.includes('mirapa') || lower.includes('మిరప') || lower.includes('mirchi')) {
    return createBenchmark(55, 70, 'kg');
  }
  if (lower.includes('spinach') || lower.includes('palak') || lower.includes('పాలకూర')) {
    return createBenchmark(15, 25, 'bunch');
  }
  if (lower.includes('thotakura') || lower.includes('తోటకూర') || lower.includes('gongura') || lower.includes('గోంగూర')) {
    return createBenchmark(15, 22, 'bunch');
  }
  if (lower.includes('ladies finger') || lower.includes('bhendi') || lower.includes('okra') || lower.includes('బెండకాయ')) {
    return createBenchmark(40, 50, 'kg');
  }
  if (lower.includes('banana') || lower.includes('aratipandu') || lower.includes('అరటి')) {
    return createBenchmark(50, 65, 'dozen');
  }
  if (lower.includes('onion') || lower.includes('ullipaya') || lower.includes('ఉల్లి')) {
    return createBenchmark(25, 35, 'kg');
  }
  if (lower.includes('potato') || lower.includes('bangaladumpa') || lower.includes('బంగాళాదుంప')) {
    return createBenchmark(28, 36, 'kg');
  }
  if (lower.includes('carrot') || lower.includes('క్యారెట్')) {
    return createBenchmark(45, 55, 'kg');
  }
  if (lower.includes('coriander') || lower.includes('కొత్తిమీర')) {
    return createBenchmark(10, 20, 'bunch');
  }
  return null;
}

/**
 * Generates an automated WhatsApp Morning Mandi Broadcast text for customer groups
 */
export function generateMorningBroadcastText(
  vendor: VendorProfile,
  products: ProduceItem[],
  lang: 'en' | 'te' = 'te'
): string {
  const availableItems = products.filter((p) => p.availability === 'available' && p.quantity > 0);
  const dateStr = new Date().toLocaleDateString(lang === 'te' ? 'te-IN' : 'en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  if (lang === 'te') {
    let msg = `🌾 *${vendor.name_te || vendor.name}*\n`;
    msg += `📍 ${vendor.stall_number}, ${vendor.market_name_te || vendor.market_name}, ${vendor.city_te || vendor.city}\n`;
    msg += `📅 నేటి తాజా కూరగాయల ధరలు (${dateStr}):\n\n`;

    availableItems.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.name_te || item.name_en}*: ₹${item.price}/${item.price_unit} (${item.quantity} ${item.unit} స్టాక్)\n`;
    });

    msg += `\n⏰ సమయం: ఉదయం ${vendor.opening_time} నుండి ${vendor.closing_time} వరకు\n`;
    msg += `📲 డిజిటల్ స్టోర్ చూసేందుకు లింక్ క్లిక్ చేయండి లేదా వాట్సాప్‌లో నేరుగా సందేశం పంపండి!\n`;
    msg += `ధన్యవాదాలు!`;
    return msg;
  } else {
    let msg = `🌾 *${vendor.name}*\n`;
    msg += `📍 ${vendor.stall_number}, ${vendor.market_name}, ${vendor.city}\n`;
    msg += `📅 Today's Fresh Produce Rates (${dateStr}):\n\n`;

    availableItems.forEach((item, idx) => {
      msg += `${idx + 1}. *${item.name_en}*: ₹${item.price}/${item.price_unit} (${item.quantity} ${item.unit} in stock)\n`;
    });

    msg += `\n⏰ Timings: ${vendor.opening_time} to ${vendor.closing_time}\n`;
    msg += `📲 Direct WhatsApp Orders or Inquiries Welcome!\n`;
    msg += `Thank you!`;
    return msg;
  }
}


interface KnownProduceDef {
  key: string;
  name_en: string;
  name_te: string;
  category: 'vegetables' | 'fruits' | 'greens' | 'other';
  defaultUnit: string;
  patterns: RegExp;
}

const KNOWN_PRODUCE_CATALOG: KnownProduceDef[] = [
  {
    key: 'tomato',
    name_en: 'Guntur Tomatoes (Naatu Tomato)',
    name_te: 'గుంటూరు నాటు టమాటాలు',
    category: 'vegetables',
    defaultUnit: 'kg',
    patterns: /(?:tomato|tomatoes|టమాట|టమోట|నాటు టమాట|tamata)/i,
  },
  {
    key: 'brinjal',
    name_en: 'Vizag Brinjal (Gutti Vankaya)',
    name_te: 'వైజాగ్ గుత్తి వంకాయలు',
    category: 'vegetables',
    defaultUnit: 'kg',
    patterns: /(?:brinjal|eggplant|వంకాయ|గుత్తి వంకాయ|vankaya)/i,
  },
  {
    key: 'chilli',
    name_en: 'Green Chillies (Pachi Mirapa)',
    name_te: 'పచ్చి మిరపకాయలు',
    category: 'vegetables',
    defaultUnit: 'kg',
    patterns: /(?:chilli|chillies|green chilli|మిరప|పచ్చిమిర్చి|mirapa|mirchi)/i,
  },
  {
    key: 'spinach',
    name_en: 'Fresh Spinach (Palak)',
    name_te: 'తోట పాలకూర',
    category: 'greens',
    defaultUnit: 'bunch',
    patterns: /(?:spinach|palak|పాలకూర|పాలకూరలు)/i,
  },
  {
    key: 'thotakura',
    name_en: 'Fresh Amaranth Leaves (Thotakura)',
    name_te: 'తాజా తోటకూర',
    category: 'greens',
    defaultUnit: 'bunch',
    patterns: /(?:thotakura|amaranth|తోటకూర)/i,
  },
  {
    key: 'gongura',
    name_en: 'Sorrel Leaves (Gongura)',
    name_te: 'ఆంధ్రా పుల్ల గోంగూర',
    category: 'greens',
    defaultUnit: 'bunch',
    patterns: /(?:gongura|sorrel|గోంగూర)/i,
  },
  {
    key: 'okra',
    name_en: 'Ladies Finger (Bhindi)',
    name_te: 'లేత బెండకాయలు',
    category: 'vegetables',
    defaultUnit: 'kg',
    patterns: /(?:okra|bhendi|bhindi|ladies finger|lady finger|బెండకాయ|బెండ)/i,
  },
  {
    key: 'onion',
    name_en: 'Kurnool Red Onions',
    name_te: 'కర్నూలు ఎర్ర ఉల్లిపాయలు',
    category: 'vegetables',
    defaultUnit: 'kg',
    patterns: /(?:onion|onions|ఉల్లి|ఉల్లిపాయ|ullipaya)/i,
  },
  {
    key: 'potato',
    name_en: 'Fresh Potatoes',
    name_te: 'బంగాళాదుంపలు',
    category: 'vegetables',
    defaultUnit: 'kg',
    patterns: /(?:potato|potatoes|బంగాళాదుంప|ఆలూ|aloo)/i,
  },
  {
    key: 'banana',
    name_en: 'Chakkarakeli Bananas',
    name_te: 'సింహాచలం చక్కెరకేళి అరటిపండ్లు',
    category: 'fruits',
    defaultUnit: 'dozen',
    patterns: /(?:banana|bananas|అరటి|అరటిపండు|aratipandu|chakkarakeli)/i,
  },
  {
    key: 'carrot',
    name_en: 'Fresh Carrots',
    name_te: 'తాజా క్యారెట్లు',
    category: 'vegetables',
    defaultUnit: 'kg',
    patterns: /(?:carrot|carrots|క్యారెట్)/i,
  },
  {
    key: 'cucumber',
    name_en: 'Country Cucumber (Dosakaya)',
    name_te: 'నాటు దోసకాయలు',
    category: 'vegetables',
    defaultUnit: 'kg',
    patterns: /(?:cucumber|dosakaya|దోసకాయ|కీరా|keera)/i,
  },
  {
    key: 'bitter_gourd',
    name_en: 'Bitter Gourd (Kakarakaya)',
    name_te: 'తాజా కాకరకాయలు',
    category: 'vegetables',
    defaultUnit: 'kg',
    patterns: /(?:bitter gourd|karela|kakarakaya|కాకరకాయ|కాకర)/i,
  },
  {
    key: 'bottle_gourd',
    name_en: 'Bottle Gourd (Sorakaya)',
    name_te: 'లేత సొరకాయ',
    category: 'vegetables',
    defaultUnit: 'piece',
    patterns: /(?:bottle gourd|sorakaya|anapakaya|సొరకాయ|ఆనపకాయ)/i,
  },
  {
    key: 'coriander',
    name_en: 'Fresh Coriander Leaves',
    name_te: 'తాజా కొత్తిమీర',
    category: 'greens',
    defaultUnit: 'bunch',
    patterns: /(?:coriander|cilantro|కొత్తిమీర|kothimeera)/i,
  },
];

/**
 * Parses a single phrase or sentence chunk for one produce item.
 */
function parseSingleChunk(chunk: string): ExtractedProduceItem | null {
  const text = chunk.trim();
  if (!text) return null;

  // Find matching produce
  let matchedDef: KnownProduceDef | null = null;
  for (const def of KNOWN_PRODUCE_CATALOG) {
    if (def.patterns.test(text)) {
      matchedDef = def;
      break;
    }
  }

  // Extract quantity & unit
  let quantity: number | null = null;
  let unit = matchedDef ? matchedDef.defaultUnit : 'kg';

  const qtyMatch = text.match(
    /(\d+(?:\.\d+)?)\s*(కేజీలు|కేజీ|కిలోలు|కిలో|kg|kgs|కట్టలు|కట్ట|bunches|bunch|డజన్|డజన్లు|dozen|dozens|కాయలు|కాయ|pieces|piece|g|గ్రాములు)/i
  );
  if (qtyMatch) {
    quantity = parseFloat(qtyMatch[1]);
    const uStr = qtyMatch[2].toLowerCase();
    if (uStr.includes('కట్ట') || uStr.includes('bunch')) unit = 'bunch';
    else if (uStr.includes('డజన్') || uStr.includes('dozen')) unit = 'dozen';
    else if (uStr.includes('కాయ') || uStr.includes('piece')) unit = 'piece';
    else unit = 'kg';
  }

  // Extract price
  let price: number | null = null;
  const price_unit = unit;

  // Patterns for price:
  // "కేజీ 35 రూపాయలు", "₹40", "40 rs", "రూపాయలు 50", "40/-"
  const priceMatch =
    text.match(/(?:ధర|price|కేజీ|కిలో|కట్ట|డజన్|piece)?\s*(?:₹|రూ\.?|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(?:రూపాయలు|రూ|rs|inr|\/-)/i) ||
    text.match(/(?:ధర|price)\s*[:=]?\s*(\d+(?:\.\d+)?)/i) ||
    text.match(/₹\s*(\d+(?:\.\d+)?)/i);

  if (priceMatch) {
    price = parseFloat(priceMatch[1]);
  } else {
    // If multiple numbers are in this chunk and quantity took the first, use the second as price
    const numbers = text.match(/\b\d+(?:\.\d+)?\b/g);
    if (numbers && numbers.length >= 2) {
      if (!quantity) quantity = parseFloat(numbers[0]);
      price = parseFloat(numbers[1]);
    } else if (numbers && numbers.length === 1 && quantity === null) {
      quantity = parseFloat(numbers[0]);
    }
  }

  // Availability
  let availability: 'available' | 'sold_out' = 'available';
  if (
    /(?:అయిపోయాయి|లేవు|sold out|finished|ఖతమ్)/i.test(text)
  ) {
    availability = 'sold_out';
    quantity = 0;
  }

  if (!matchedDef && price === null && quantity === null) {
    return null;
  }

  return {
    name_en: matchedDef ? matchedDef.name_en : 'Fresh Produce Item',
    name_te: matchedDef ? matchedDef.name_te : 'తాజా సరుకు',
    quantity,
    unit,
    price,
    price_unit,
    availability,
    needs_confirmation: true,
    uncertainty_reason: !matchedDef || price === null || quantity === null ? 'Confirm details' : null,
  };
}

/**
 * Intelligent local Telugu/English produce extractor.
 * Extracts MULTIPLE produce items from a single continuous spoken or typed sentence
 * even when offline or when Gemini API is unavailable!
 */
export function parseLocalTeluguInput(
  input: string,
  location = 'MVP Colony Rythu Bazaar'
): ExtractedProduceResponse | null {
  if (!input || !input.trim()) return null;
  const rawText = input.trim();

  // 1. Try splitting by natural chunk delimiters (commas, semicolons, newlines, "and", "మరియు", "కూడా")
  const delimiters = /[,;\n\.]+|\s+మరియు\s+|\s+and\s+|\s+కూడా\s+|\s+next\s+/i;
  const rawChunks = rawText.split(delimiters).map((c) => c.trim()).filter(Boolean);

  let extractedItems: ExtractedProduceItem[] = [];

  for (const chunk of rawChunks) {
    const item = parseSingleChunk(chunk);
    if (item) {
      // If this chunk has no produce name (matched generic) and we already have a previous item,
      // merge price / quantity into the previous item rather than creating an orphan item!
      const isGeneric = item.name_en === 'Fresh Produce Item';
      if (isGeneric && extractedItems.length > 0) {
        const prev = extractedItems[extractedItems.length - 1];
        if (item.price !== null && prev.price === null) {
          prev.price = item.price;
          prev.price_unit = item.price_unit;
        }
        if (item.quantity !== null && prev.quantity === null) {
          prev.quantity = item.quantity;
          prev.unit = item.unit;
        }
      } else {
        extractedItems.push(item);
      }
    }
  }

  // 2. If chunking yielded no items or only 1 item, scan for every known produce keyword in the text
  if (extractedItems.length <= 1) {
    const keywordMatches: { def: KnownProduceDef; index: number }[] = [];
    for (const def of KNOWN_PRODUCE_CATALOG) {
      const match = rawText.match(def.patterns);
      if (match && match.index !== undefined) {
        keywordMatches.push({ def, index: match.index });
      }
    }

    // Sort by appearance in sentence
    keywordMatches.sort((a, b) => a.index - b.index);

    if (keywordMatches.length > 1) {
      const multiItems: ExtractedProduceItem[] = [];
      for (let i = 0; i < keywordMatches.length; i++) {
        const start = keywordMatches[i].index;
        const end = i + 1 < keywordMatches.length ? keywordMatches[i + 1].index : rawText.length;
        const subChunk = rawText.substring(start, end);
        const item = parseSingleChunk(subChunk);
        if (item) {
          multiItems.push(item);
        }
      }
      if (multiItems.length > 0) {
        extractedItems = multiItems;
      }
    }
  }

  if (extractedItems.length === 0) {
    // Fallback: try parsing the whole string as one single chunk
    const single = parseSingleChunk(rawText);
    if (single) {
      extractedItems.push(single);
    } else {
      return null;
    }
  }

  // Deduplicate items with same English name if adjacent
  const uniqueItems = extractedItems.filter(
    (item, index, self) => index === self.findIndex((t) => t.name_en === item.name_en)
  );

  return {
    items: uniqueItems.length > 0 ? uniqueItems : extractedItems,
    location,
    missing_fields: [],
    clarification_questions: [],
    warnings: [],
    vendor_message: `${extractedItems.length} సరుకులు గుర్తించబడ్డాయి. దయచేసి ప్రతి వివరాలను సరిచూసి ఒకేసారి ధృవీకరించండి.`,
    raw_transcript_te: rawText,
    raw_transcript_en: rawText,
  };
}
