export type Language = 'en' | 'te';

export type AvailabilityStatus = 'available' | 'sold_out' | 'unavailable' | 'unknown';

export interface ProduceItem {
  id: string;
  name_en: string;
  name_te: string;
  category: 'vegetables' | 'fruits' | 'greens' | 'other';
  quantity: number;
  unit: string; // 'kg', 'g', 'bunch', 'piece', 'dozen'
  price: number;
  price_unit: string; // 'kg', 'bunch', 'piece'
  availability: AvailabilityStatus;
  location: string;
  image_url?: string;
  last_updated: string;
  created_at: string;
  is_demo?: boolean;
  voice_transcript_te?: string;
  voice_transcript_en?: string;
}

export interface ExtractedProduceItem {
  name_en: string;
  name_te: string;
  quantity: number | null;
  unit: string;
  price: number | null;
  price_unit: string;
  availability: AvailabilityStatus;
  needs_confirmation: boolean;
  uncertainty_reason: string | null;
}

export interface ExtractedProduceResponse {
  items: ExtractedProduceItem[];
  location: string;
  missing_fields: string[];
  clarification_questions: {
    en: string;
    te: string;
    field: string;
  }[];
  warnings: string[];
  vendor_message: string;
  raw_transcript_te?: string;
  raw_transcript_en?: string;
}

export interface VendorProfile {
  name: string;
  name_te: string;
  stall_number: string;
  market_name: string;
  market_name_te: string;
  city: string;
  city_te: string;
  phone: string;
  whatsapp_number: string;
  opening_time: string;
  closing_time: string;
  is_demo?: boolean;
  avatar_url?: string;
  address_details?: string;
}

export interface CustomerInquiry {
  id: string;
  customer_name: string;
  product_name: string;
  message: string;
  time: string;
  status: 'replied' | 'pending';
}
