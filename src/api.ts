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

// ── Filiallar (branch) ──
export interface Branch {
  id: string;      // slug
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
  isActive: boolean;
}

export async function fetchBranches(): Promise<Branch[]> {
  if (!API) return [];
  try {
    const res = await fetch(`${API}/api/filials`);
    if (!res.ok) return [];
    const list = await res.json();
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

// ── Buyurtma yaratish ──
export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  items: { foodId: string; title: string; quantity: number }[];
  orderType: 'delivery' | 'pickup';
  paymentType: 'payme' | 'click' | 'cash';
  address?: string;
  location?: { lat: number; lng: number } | null;
  filialId?: string;
  filialName?: string;
}

export interface CreateOrderResult {
  ok: boolean;
  message: string;
  orderId?: string;
  paymentUrl?: string;
}

export async function createOrder(p: CreateOrderPayload): Promise<CreateOrderResult> {
  if (!API) return { ok: false, message: "Backend sozlanmagan (VITE_API_URL yo'q)." };
  try {
    const res = await fetch(`${API}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p),
    });
    const data = await res.json().catch(() => ({} as { message?: string; order?: { _id?: string }; paymentUrl?: string }));
    if (!res.ok) return { ok: false, message: data?.message || `Xato (${res.status})` };
    return { ok: true, message: data?.message || '', orderId: data?.order?._id, paymentUrl: data?.paymentUrl || '' };
  } catch {
    return { ok: false, message: 'Tarmoq xatosi. Internet aloqasini tekshiring.' };
  }
}

// ── Mening buyurtmalarim (telefon bo'yicha) ──
export type OrderStatus = 'new' | 'preparing' | 'on_way' | 'delivered' | 'cancelled';

export interface MyOrder {
  id: string;
  date: string;
  items: string;
  total: number;
  status: OrderStatus;
  type: 'delivery' | 'pickup';
}

interface BackendOrder {
  _id?: string;
  items?: { title?: string; quantity?: number }[];
  totalPrice?: number;
  paymentAmount?: number;
  orderType?: 'delivery' | 'pickup';
  status?: string;
  createdAt?: string;
}

export async function fetchMyOrders(phone: string): Promise<MyOrder[]> {
  const clean = (phone || '').replace(/[^\d+]/g, '');
  if (!API || !/^\+?\d{9,15}$/.test(clean)) return [];
  try {
    const res = await fetch(`${API}/api/orders/my/${encodeURIComponent(clean)}`);
    if (!res.ok) return [];
    const list: BackendOrder[] = await res.json();
    if (!Array.isArray(list)) return [];
    return list.map((o) => ({
      id: o._id ? o._id.slice(-5) : '—',
      date: o.createdAt
        ? new Date(o.createdAt).toLocaleString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        : '',
      items: (o.items || []).map((it) => `${it.quantity} × ${it.title}`).join(', '),
      total: o.paymentAmount || o.totalPrice || 0,
      status: (o.status as OrderStatus) || 'new',
      type: o.orderType || 'delivery',
    }));
  } catch {
    return [];
  }
}

// ── Joy bron qilish ──
export interface BookingPayload {
  name: string;
  phone: string;
  date?: string;
  time?: string;
  guests?: string;
  eventType?: string;
  note?: string;
}

export async function createBooking(p: BookingPayload): Promise<{ ok: boolean; message: string }> {
  if (!API) return { ok: false, message: "Backend sozlanmagan (VITE_API_URL yo'q)." };
  try {
    const res = await fetch(`${API}/api/booking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p),
    });
    const data = await res.json().catch(() => ({} as { message?: string }));
    if (!res.ok) return { ok: false, message: data?.message || `Xato (${res.status})` };
    return { ok: true, message: data?.message || 'Arizangiz qabul qilindi.' };
  } catch {
    return { ok: false, message: 'Tarmoq xatosi. Internet aloqasini tekshiring.' };
  }
}
