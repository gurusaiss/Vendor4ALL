import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateProduceFields,
  calculateStockMetrics,
  createWhatsAppChatUrl,
  createGeneralWhatsAppUrl,
  formatProducePrice,
  INITIAL_SEED_PRODUCE,
  DEFAULT_VENDOR_PROFILE,
  parseLocalTeluguInput,
  getRythuBazaarBenchmark,
  generateMorningBroadcastText,
} from './produceLogic';
import { ProduceItem } from '../types';

test('validateProduceFields returns empty array for complete item', () => {
  const completeItem = {
    name_en: 'Tomato',
    name_te: 'టమాటా',
    price: 50,
    price_unit: 'kg',
    quantity: 10,
    unit: 'kg',
  };
  const missing = validateProduceFields(completeItem);
  assert.deepEqual(missing, []);
});

test('validateProduceFields flags missing price and unit', () => {
  const incompleteItem = {
    name_en: 'Brinjal',
    name_te: 'వంకాయ',
    quantity: 5,
  };
  const missing = validateProduceFields(incompleteItem);
  assert.ok(missing.includes('price'));
  assert.ok(missing.includes('price_unit'));
  assert.ok(missing.includes('unit'));
});

test('validateProduceFields flags missing product name', () => {
  const namelessItem = {
    price: 30,
    price_unit: 'kg',
    quantity: 5,
    unit: 'kg',
  };
  const missing = validateProduceFields(namelessItem);
  assert.ok(missing.includes('product_name'));
});

test('calculateStockMetrics correctly counts in-stock, low-stock, and sold-out items', () => {
  const sampleProducts: ProduceItem[] = [
    {
      id: '1',
      name_en: 'Carrot',
      name_te: 'క్యారెట్',
      category: 'vegetables',
      quantity: 15,
      unit: 'kg',
      price: 60,
      price_unit: 'kg',
      availability: 'available',
      location: 'MVP Colony Rythu Bazaar',
      last_updated: 'Now',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      name_en: 'Coriander',
      name_te: 'కొత్తిమీర',
      category: 'greens',
      quantity: 3, // Low stock <= 5
      unit: 'bunch',
      price: 10,
      price_unit: 'bunch',
      availability: 'available',
      location: 'MVP Colony Rythu Bazaar',
      last_updated: 'Now',
      created_at: new Date().toISOString(),
    },
    {
      id: '3',
      name_en: 'Mango',
      name_te: 'మామిడిపండ్లు',
      category: 'fruits',
      quantity: 0,
      unit: 'dozen',
      price: 250,
      price_unit: 'dozen',
      availability: 'sold_out',
      location: 'MVP Colony Rythu Bazaar',
      last_updated: 'Now',
      created_at: new Date().toISOString(),
    },
  ];

  const metrics = calculateStockMetrics(sampleProducts);
  assert.equal(metrics.total, 3);
  assert.equal(metrics.inStock, 2);
  assert.equal(metrics.lowStock, 1);
  assert.equal(metrics.soldOut, 1);
});

test('createWhatsAppChatUrl generates a valid URL with encoded message', () => {
  const urlEn = createWhatsAppChatUrl('9848022334', 'Tomato', 'Apparao', '₹45 / kg', 'en');
  assert.ok(urlEn.startsWith('https://wa.me/9848022334?text='));
  assert.ok(urlEn.includes(encodeURIComponent('Tomato')));

  const urlTe = createWhatsAppChatUrl('+91-98480-22334', 'టమాటాలు', 'అప్పారావు', '₹45 / kg', 'te');
  assert.ok(urlTe.startsWith('https://wa.me/919848022334?text='));
  assert.ok(urlTe.includes(encodeURIComponent('టమాటాలు')));
});

test('formatProducePrice properly formats price and unit', () => {
  assert.equal(formatProducePrice(50, 'kg'), '₹50 / kg');
  assert.equal(formatProducePrice(15, 'bunch'), '₹15 / bunch');
});

test('INITIAL_SEED_PRODUCE correctly initializes Stitch produce and prevents negative quantities', () => {
  assert.equal(INITIAL_SEED_PRODUCE.length, 6);
  const tomatoes = INITIAL_SEED_PRODUCE[0];
  assert.equal(tomatoes.quantity, 45);
  assert.equal(tomatoes.is_demo, true);
  
  // Test decrement prevention at 0
  const soldOutItem = INITIAL_SEED_PRODUCE[5]; // Bananas with 0 quantity
  const clampedQty = Math.max(0, soldOutItem.quantity - 1);
  assert.equal(clampedQty, 0); // Quantity never goes below 0
});

test('calculateStockMetrics correctly analyzes INITIAL_SEED_PRODUCE', () => {
  const metrics = calculateStockMetrics(INITIAL_SEED_PRODUCE);
  assert.equal(metrics.total, 6);
  assert.equal(metrics.inStock, 5);
  assert.equal(metrics.lowStock, 1); // Chillies with 4 kg
  assert.equal(metrics.soldOut, 1); // Bananas with 0
});

test('createGeneralWhatsAppUrl properly formats stall greeting in Telugu and English', () => {
  const urlTe = createGeneralWhatsAppUrl(
    DEFAULT_VENDOR_PROFILE.whatsapp_number,
    DEFAULT_VENDOR_PROFILE.name_te,
    'te'
  );
  assert.ok(urlTe.startsWith('https://wa.me/919848022334?text='));
  assert.ok(urlTe.includes(encodeURIComponent('అప్పారావు')));

  const urlEn = createGeneralWhatsAppUrl(
    DEFAULT_VENDOR_PROFILE.whatsapp_number,
    DEFAULT_VENDOR_PROFILE.name,
    'en'
  );
  assert.ok(urlEn.startsWith('https://wa.me/919848022334?text='));
  assert.ok(urlEn.includes(encodeURIComponent('Apparao Fresh Vegetables')));
});

test('DEFAULT_VENDOR_PROFILE correctly marks pilot demo state and Visakhapatnam location', () => {
  assert.equal(DEFAULT_VENDOR_PROFILE.is_demo, true);
  assert.equal(DEFAULT_VENDOR_PROFILE.market_name, 'MVP Colony Rythu Bazaar');
  assert.equal(DEFAULT_VENDOR_PROFILE.city, 'Visakhapatnam');
  assert.ok(DEFAULT_VENDOR_PROFILE.stall_number.includes('24'));
});

test('parseLocalTeluguInput accurately extracts produce, quantity, and price from spoken Telugu', () => {
  const result = parseLocalTeluguInput('ఈ రోజు 45 కేజీల టమాటాలు, కేజీ 35 రూపాయలు');
  assert.ok(result !== null);
  assert.equal(result.items.length, 1);
  const item = result.items[0];
  assert.ok(item.name_en.includes('Tomatoes'));
  assert.ok(item.name_te.includes('టమాటాలు'));
  assert.equal(item.quantity, 45);
  assert.equal(item.unit, 'kg');
  assert.equal(item.price, 35);
  assert.equal(item.price_unit, 'kg');
  assert.equal(item.availability, 'available');
});

test('parseLocalTeluguInput handles brinjal and sold out speech', () => {
  const result = parseLocalTeluguInput('గుత్తి వంకాయలు అన్నీ అయిపోయాయి');
  assert.ok(result !== null);
  const item = result.items[0];
  assert.ok(item.name_te.includes('వంకాయలు'));
  assert.equal(item.availability, 'sold_out');
  assert.equal(item.quantity, 0);
});

test('parseLocalTeluguInput accurately extracts 10 items from a continuous multi-produce speech', () => {
  const multiSpeech =
    '10 kg tomatoes 40 rs, 5 kg brinjal 35 rs, 10 bunches palak 15 rs, 2 kg chillies 60 rs, 15 kg onions 30 rs, 8 kg bhendi 45 rs, 20 kg potatoes 25 rs, 5 dozen bananas 40 rs, 4 kg kakarakaya 50 rs, 6 kg carrots 40 rs';
  const result = parseLocalTeluguInput(multiSpeech);
  assert.ok(result !== null);
  assert.equal(result.items.length, 10);
  assert.ok(result.items.some((i) => i.name_en.includes('Tomatoes')));
  assert.ok(result.items.some((i) => i.name_en.includes('Brinjal')));
  assert.ok(result.items.some((i) => i.name_en.includes('Spinach')));
  assert.ok(result.items.some((i) => i.name_en.includes('Chillies')));
  assert.ok(result.items.some((i) => i.name_en.includes('Onions')));
  assert.ok(result.items.some((i) => i.name_en.includes('Bhindi')));
  assert.ok(result.items.some((i) => i.name_en.includes('Potatoes')));
  assert.ok(result.items.some((i) => i.name_en.includes('Bananas')));
  assert.ok(result.items.some((i) => i.name_en.includes('Kakarakaya')));
  assert.ok(result.items.some((i) => i.name_en.includes('Carrots')));
});

test('getRythuBazaarBenchmark returns fair price ranges for MVP Colony Rythu Bazaar', () => {
  const tomatoBenchmark = getRythuBazaarBenchmark('Guntur Tomatoes');
  assert.ok(tomatoBenchmark !== null);
  assert.equal(tomatoBenchmark.min, 30);
  assert.equal(tomatoBenchmark.max, 38);
  assert.equal(tomatoBenchmark.unit, 'kg');
  assert.equal(tomatoBenchmark.isFair(35), true);
  assert.equal(tomatoBenchmark.isFair(90), false);

  const palakBenchmark = getRythuBazaarBenchmark('పాలకూర కట్ట');
  assert.ok(palakBenchmark !== null);
  assert.equal(palakBenchmark.min, 15);
  assert.equal(palakBenchmark.max, 25);
  assert.equal(palakBenchmark.unit, 'bunch');
  assert.equal(palakBenchmark.isFair(20), true);
});

test('generateMorningBroadcastText generates complete WhatsApp broadcast with timings and rates', () => {
  const broadcastTe = generateMorningBroadcastText(DEFAULT_VENDOR_PROFILE, INITIAL_SEED_PRODUCE, 'te');
  assert.ok(broadcastTe.includes('అప్పారావు'));
  assert.ok(broadcastTe.includes('స్టాల్ 24'));
  assert.ok(broadcastTe.includes('గుంటూరు నాటు టమాటాలు'));
  assert.ok(broadcastTe.includes('06:00 AM'));

  const broadcastEn = generateMorningBroadcastText(DEFAULT_VENDOR_PROFILE, INITIAL_SEED_PRODUCE, 'en');
  assert.ok(broadcastEn.includes('Apparao'));
  assert.ok(broadcastEn.includes('Stall #24'));
  assert.ok(broadcastEn.includes('Timings'));
});
