export type Lang = "ka" | "ru" | "en";

export interface Doctor {
  id: string;
  full_name: string;
  specialty_ru: string | null;
  specialty_ka: string | null;
  specialty_en: string | null;
  bio_ru: string | null;
  bio_ka: string | null;
  bio_en: string | null;
  photo_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface ServiceCategory {
  id: string;
  title_ru: string;
  title_ka: string;
  title_en: string;
  sort_order: number;
}

export interface Service {
  id: string;
  category_id: string;
  title_ru: string;
  title_ka: string;
  title_en: string;
  price: number | null;
  currency: string;
  sort_order: number;
}

export interface SiteContent {
  key: string;
  value_ru: string | null;
  value_ka: string | null;
  value_en: string | null;
}
