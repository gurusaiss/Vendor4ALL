# Vendor4ALL — Telugu-First Voice AI for Local Rythu Bazaar Vendors

> **Civic Technology Pilot**: MVP Colony Rythu Bazaar (Stall #24), Visakhapatnam, Andhra Pradesh  
> **Core Philosophy**: *"AI proposes; human vendor decides."*

---

## 🌾 Project Overview

**Vendor4ALL** is a responsive, browser-based civic-tech web application built to empower local street vendors, pushcart sellers, and Rythu Bazaar stall owners in Visakhapatnam. Local vendors face rapid daily price fluctuations and often struggle with complex English e-commerce interfaces. Nearby residents frequently turn to aggregator delivery apps, unaware of the fresher, cheaper produce available right at their neighbourhood Rythu Bazaar.

Vendor4ALL bridges this divide with a **Telugu-first, voice-assisted workflow**:
1. **Vendor speaks in natural Telugu** (e.g., *"ఈ రోజు 5 కిలోల టమాటాలు, కిలో 40 రూపాయలు"*).
2. **Server-side Gemini AI extracts structured inventory** (produce name, quantity, price, unit) into editable fields.
3. **Mandatory Human-in-the-Loop Confirmation**: Nothing is published without the vendor reviewing and tapping explicit approval.
4. **Instant Zero-Login Digital Storefront**: Generates a public web catalog and scannable QR code standee.
5. **Direct WhatsApp Commerce**: Nearby customers discover stock in real-time and place orders directly with the vendor via WhatsApp, with **0% commission and no middleman markups**.

---

## 📱 Core Screens & Architecture

| Screen | Description | Approved Design Tokens |
|---|---|---|
| **1. Vendor Home** (`VendorHome.tsx`) | Vendor dashboard with $\ge 48\text{px}$ tactile quantity steppers (`+` and `-`), non-negative stock safety, quick price edits, stock metrics (Total, In Stock, Low Stock, Sold Out), and LocalStorage persistence. | `kisaan_modern_tactile`, high-contrast emerald green for bright outdoor sunlight |
| **2. Add Product Flow** (`AddProductScreen.tsx`) | 3-step visual progress tracker (`1. వాయిస్ → 2. ఫోటో → 3. సరిచూసి ప్రచురించు`). $80\text{px}$ pulsing mic button, empty audio guards, preset Telugu dialect chips, image upload (<10MB), server-side Gemini parsing, and mandatory verification checkbox. | Linear progress rail, zero fabricated AI accuracy percentages |
| **3. Customer Storefront** (`CustomerStorefront.tsx`) | Public catalog with dual stock availability & category filters, real-time search, interactive QR code modal, genuine Google Maps directions, and direct WhatsApp click-to-chat links per item. | Clear demo vendor tag (`డెమో వ్యాపారి`), mobile 2-col / desktop 3-col |
| **4. About Vendor4ALL** (`AboutScreen.tsx`) | 4-step connected visual timeline, authentic Rythu Bazaar community photography, vendor-first ethics guarantee, and LocalStorage data reset. | No fabricated helplines or fake government endorsements |

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide React, Google Material Symbols.
- **Backend**: Express (Node.js) server with Vite middleware integration.
- **AI Processing**: Google GenAI SDK (`@google/genai`) via secure server-side endpoint `/api/gemini/parse-produce` with model fallback (`gemini-3.1-flash-lite` $\rightarrow$ `gemini-3.8-flash`) and exponential backoff retry.
- **Client Storage**: HTML5 LocalStorage with schema versioning (`vendor4all_products_v2`).
- **QR Standee**: `qrcode` canvas generation.

---

## 🚀 Quickstart & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher (Tested on Node `v24.14.0` / npm `11.5.2`)

### 1. Installation
Clone the repository and install dependencies using legacy peer resolution:
```bash
cd "AI Studio Export/vendor4all"
npm install --legacy-peer-deps
```

### 2. Environment Configuration
Create a `.env` file in the project root:
```env
PORT=3000
APP_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note on API Keys:** If `GEMINI_API_KEY` is omitted, the application starts normally and remains fully operational. When a voice or text extraction is triggered without a key, the backend returns a structured `AUTH_403` response with `{ fallbackAvailable: true }`, allowing the user to seamlessly use the built-in **Manual Entry Fallback** or quick preset Telugu dialect chips.

### 3. Run Development Server
```bash
npm run dev
# Or alternatively:
npx tsx server.ts
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧪 Verification & Testing Commands

All verification suites pass cleanly:

- **Unit Tests** (10 tests covering validation, calculations, stock metrics, and WhatsApp URL generation):
  ```bash
  npm test
  # Output: 10 tests passed, 0 failed
  ```

- **TypeScript Lint & Type-Check**:
  ```bash
  npm run lint
  # Output: > tsc --noEmit (0 errors)
  ```

- **Production Build**:
  ```bash
  npm run build
  # Output: ✓ built in ~600ms (dist/assets/index-*.js, dist/assets/index-*.css)
  ```

---

## 🔒 Security & Data Privacy

1. **Zero Secret Leakage**: The Google Gemini API key is accessed exclusively server-side in `server.ts`. Client bundles (`dist/assets/*.js`) contain zero references to `GEMINI_API_KEY` or `process.env`.
2. **Strict AI Safety Boundaries**:
   - Missing fields (price, unit, quantity) are left blank for vendor entry rather than hallucinated.
   - Images are used solely for produce identification assistance; price, quantity, and market location are never inferred from photos.
   - AI outputs are never automatically published to the customer storefront without explicit vendor review and confirmation.
3. **Transparent Data Storage**:
   - This prototype operates without user login or remote tracking, storing inventory state in browser LocalStorage (`vendor4all_products_v2`).
   - Listings are device/browser-specific. Data does not synchronize across separate devices unless connected to a centralized cloud database backend.

---

## 📍 Initial Pilot Details

- **Pilot Location**: Stall #24 (*Apparao Fresh Vegetables*), MVP Colony Rythu Bazaar, Sector 4, Visakhapatnam, Andhra Pradesh.
- **Operating Hours**: Morning (6:00 AM – 1:00 PM), Evening (4:30 PM – 8:30 PM).
- **Direct Stall Payments**: Cash or vendor's own UPI QR code (GPay / PhonePe). Zero transaction fees.
