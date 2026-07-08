// Backend bilan bog'lanish — menyu food-order-system dan olinadi.
// VITE_API_URL berilsa real menyu; berilmasa yoki xato bo'lsa demo (data.ts).
import { MenuItem } from './types';
import { MENU_ITEMS, TRANSLATIONS } from './data';

const API = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export interface Category {
  id: string;        // filtrlash uchun (backend: category.uz)
  label_uz: string;
  label_ru: string;
}

export type MenuSource = 'api' | 'demo';

export interface MenuResult {
  items: MenuItem[];
  categories: Category[];
  source: MenuSource;
}

// Backend Food shakli (food-order-system/models/Food.js)
interface BackendFood {
  _id: string;
  title?: { uz?: string; ru?: string };
  description?: { uz?: string; ru?: string };
  category?: { uz?: string; ru?: string };
  price?: number;
  image?: string;
  isAvailable?: boolean;
}

function mapFood(f: BackendFood): MenuItem {
  return {
    id: f._id,
    name_uz: (f.title?.uz || '').trim(),
    name_ru: (f.title?.ru || f.title?.uz || '').trim(),
    desc_uz: (f.description?.uz || '').trim(),
    desc_ru: (f.description?.ru || f.description?.uz || '').trim(),
    price: Number(f.price) || 0,
    category: (f.category?.uz || 'Boshqa').trim(),
    image: f.image || '',
    available: f.isAvailable !== false,
  };
}

// Menyudagi taomlardan takrorlanmas kategoriyalar ro'yxatini quradi
function buildCategories(foods: BackendFood[]): Category[] {
  const seen = new Map<string, Category>();
  for (const f of foods) {
    const uz = (f.category?.uz || '').trim();
    if (!uz || seen.has(uz)) continue;
    seen.set(uz, { id: uz, label_uz: uz, label_ru: (f.category?.ru || uz).trim() });
  }
  return [...seen.values()];
}

// Demo (backend yo'q/xato) — sayt hech qachon bo'sh qolmasin
const DEMO: MenuResult = {
  items: MENU_ITEMS,
  categories: [
    { id: 'osh', label_uz: TRANSLATIONS.uz.cat_osh, label_ru: TRANSLATIONS.ru.cat_osh },
    { id: 'mangal', label_uz: TRANSLATIONS.uz.cat_mangal, label_ru: TRANSLATIONS.ru.cat_mangal },
    { id: 'salatlar', label_uz: TRANSLATIONS.uz.cat_salatlar, label_ru: TRANSLATIONS.ru.cat_salatlar },
    { id: 'ichimliklar', label_uz: TRANSLATIONS.uz.cat_ichimliklar, label_ru: TRANSLATIONS.ru.cat_ichimliklar },
    { id: 'setlar', label_uz: TRANSLATIONS.uz.cat_setlar, label_ru: TRANSLATIONS.ru.cat_setlar },
  ],
  source: 'demo',
};

export async function fetchMenu(): Promise<MenuResult> {
  if (!API) return DEMO;
  try {
    const res = await fetch(`${API}/api/foods`);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const foods: BackendFood[] = await res.json();
    if (!Array.isArray(foods) || foods.length === 0) return DEMO;
    return { items: foods.map(mapFood), categories: buildCategories(foods), source: 'api' };
  } catch (e) {
    console.warn('[menu] backend yuklanmadi, demo ishlatildi:', e);
    return DEMO;
  }
}
