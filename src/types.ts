export type Language = 'uz' | 'ru';

export type CategoryType = 'all' | 'osh' | 'mangal' | 'salatlar' | 'ichimliklar' | 'setlar';

export interface MenuItem {
  id: string;
  name_uz: string;
  name_ru: string;
  desc_uz: string;
  desc_ru: string;
  price: number;
  category: Exclude<CategoryType, 'all'>;
  image: string;
  available: boolean;
  isPopular?: boolean;
  badge_uz?: string;
  badge_ru?: string;
  prepTime_uz?: string;
  prepTime_ru?: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
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
}

export interface Promo {
  id: string;
  title_uz: string;
  title_ru: string;
  desc_uz: string;
  desc_ru: string;
  badge_uz: string;
  badge_ru: string;
  image: string;
  price?: number;
  categoryLink: CategoryType;
}

export interface Testimonial {
  id: string;
  name: string;
  role_uz: string;
  role_ru: string;
  comment_uz: string;
  comment_ru: string;
  rating: number;
  avatar: string;
}

export interface OrderDetails {
  name: string;
  phone: string;
  type: 'delivery' | 'pickup';
  address: string;
  branchId: string;
  payment: 'payme' | 'click' | 'cash';
  comment: string;
}
