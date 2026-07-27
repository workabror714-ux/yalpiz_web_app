export type Language = 'uz' | 'ru';

export type CategoryType = string; // 'all' yoki backend kategoriya nomi (category.uz)

export interface MenuItem {
  id: string;
  name_uz: string;
  name_ru: string;
  desc_uz: string;
  desc_ru: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  isPopular?: boolean;
  badge_uz?: string;
  badge_ru?: string;
  prepTime_uz?: string;
  prepTime_ru?: string;
}


export interface Branch {
  id: string;
  name_uz: string;
  name_ru: string;
  address_uz: string;
  address_ru: string;
  hours_uz: string;
  hours_ru: string;
  phone: string;
  phoneRaw: string;
  mapEmbedUrl: string;
  mapUrl: string;
}
