import { MenuItem } from './types';

const API = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export interface Category {
  id: string;
  label_uz: string;
  label_ru: string;
}

export type MenuSource = 'api' | 'unavailable';

export interface MenuResult {
  items: MenuItem[];
  categories: Category[];
  source: MenuSource;
  error?: string;
}

interface BackendFood {
  _id: string;
  title?: { uz?: string; ru?: string };
  description?: { uz?: string; ru?: string };
  category?: { uz?: string; ru?: string };
  price?: number;
  image?: string;
  isAvailable?: boolean;
}

function mapFood(food: BackendFood): MenuItem {
  const titleUz = (food.title?.uz || food.title?.ru || '').trim();
  const titleRu = (food.title?.ru || food.title?.uz || '').trim();
  const descriptionUz = (food.description?.uz || food.description?.ru || '').trim();
  const descriptionRu = (food.description?.ru || food.description?.uz || '').trim();

  return {
    id: food._id,
    name_uz: titleUz,
    name_ru: titleRu,
    desc_uz: descriptionUz,
    desc_ru: descriptionRu,
    price: Number(food.price) || 0,
    category: (food.category?.uz || food.category?.ru || 'Boshqa').trim(),
    image: food.image || '',
    available: food.isAvailable !== false,
  };
}

function buildCategories(foods: BackendFood[]): Category[] {
  const seen = new Map<string, Category>();

  for (const food of foods) {
    const uz = (food.category?.uz || food.category?.ru || '').trim();
    if (!uz || seen.has(uz)) continue;

    seen.set(uz, {
      id: uz,
      label_uz: uz,
      label_ru: (food.category?.ru || food.category?.uz || uz).trim(),
    });
  }

  return [...seen.values()];
}

export async function fetchMenu(): Promise<MenuResult> {
  if (!API) {
    return { items: [], categories: [], source: 'unavailable', error: 'VITE_API_URL sozlanmagan.' };
  }

  try {
    const response = await fetch(`${API}/api/foods`, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const foods: BackendFood[] = await response.json();
    if (!Array.isArray(foods) || foods.length === 0) {
      return { items: [], categories: [], source: 'unavailable', error: 'Menyu bo‘sh yoki noto‘g‘ri formatda qaytdi.' };
    }

    return { items: foods.map(mapFood), categories: buildCategories(foods), source: 'api' };
  } catch (error) {
    console.error('[menu] backend menyusi yuklanmadi:', error);
    return {
      items: [],
      categories: [],
      source: 'unavailable',
      error: error instanceof Error ? error.message : 'Noma’lum tarmoq xatosi',
    };
  }
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
  isActive: boolean;
}

export async function fetchBranches(): Promise<Branch[]> {
  if (!API) return [];
  try {
    const response = await fetch(`${API}/api/filials`, { headers: { Accept: 'application/json' } });
    if (!response.ok) return [];
    const list = await response.json();
    return Array.isArray(list) ? list.filter((branch) => branch?.isActive !== false) : [];
  } catch {
    return [];
  }
}

export interface DeliveryPriceResult {
  ok: boolean;
  price: number;
  message: string;
}

export async function calculateDeliveryPrice(
  filialId: string,
  location: { lat: number; lng: number },
): Promise<DeliveryPriceResult> {
  if (!API) return { ok: false, price: 0, message: "Backend sozlanmagan." };
  try {
    const response = await fetch(`${API}/api/millenium/calc-price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ filialId, location }),
    });
    const data = await response.json().catch(() => ({} as Record<string, unknown>));
    if (!response.ok) {
      return { ok: false, price: 0, message: String(data?.message || `Xato (${response.status})`) };
    }
    return { ok: true, price: Math.max(0, Number(data?.price) || 0), message: '' };
  } catch {
    return { ok: false, price: 0, message: 'Taxi narxini hisoblab bo‘lmadi.' };
  }
}

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
  persons?: number;
  comment?: string;
  source?: 'website';
}

export interface CreateOrderResult {
  ok: boolean;
  message: string;
  orderId?: string;
  paymentUrl?: string;
}

export async function createOrder(payload: CreateOrderPayload): Promise<CreateOrderResult> {
  if (!API) return { ok: false, message: "Backend sozlanmagan (VITE_API_URL yo‘q)." };

  try {
    const response = await fetch(`${API}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({} as Record<string, unknown>));
    if (!response.ok) {
      return { ok: false, message: String(data?.message || `Xato (${response.status})`) };
    }
    const order = data?.order as { _id?: string } | undefined;
    return {
      ok: true,
      message: String(data?.message || 'Buyurtma qabul qilindi.'),
      orderId: order?._id,
      paymentUrl: typeof data?.paymentUrl === 'string' ? data.paymentUrl : '',
    };
  } catch {
    return { ok: false, message: 'Tarmoq xatosi. Internet aloqasini tekshiring.' };
  }
}

export interface WebsiteConfirmationResult {
  ok: boolean;
  message: string;
  pendingOrderId?: string;
  confirmationUrl?: string;
  confirmationToken?: string;
  expiresAt?: string;
}

export async function createWebsiteOrderConfirmation(
  payload: CreateOrderPayload,
): Promise<WebsiteConfirmationResult> {
  if (!API) return { ok: false, message: "Backend sozlanmagan (VITE_API_URL yo‘q)." };

  try {
    const response = await fetch(`${API}/api/website-orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({} as Record<string, unknown>));
    if (!response.ok) {
      return { ok: false, message: String(data?.message || `Xato (${response.status})`) };
    }
    return {
      ok: true,
      message: String(data?.message || 'Telegram orqali tasdiqlang.'),
      pendingOrderId: typeof data?.pendingOrderId === 'string' ? data.pendingOrderId : '',
      confirmationUrl: typeof data?.confirmationUrl === 'string' ? data.confirmationUrl : '',
      confirmationToken: typeof data?.confirmationToken === 'string' ? data.confirmationToken : '',
      expiresAt: typeof data?.expiresAt === 'string' ? data.expiresAt : '',
    };
  } catch {
    return { ok: false, message: 'Tarmoq xatosi. Internet aloqasini tekshiring.' };
  }
}

export type WebsiteConfirmationStatus =
  | 'pending'
  | 'bound'
  | 'processing'
  | 'confirmed'
  | 'cancelled'
  | 'expired'
  | 'failed';

export interface WebsiteConfirmationStatusResult {
  ok: boolean;
  status?: WebsiteConfirmationStatus;
  message: string;
  orderId?: string;
  paymentUrl?: string;
}

export async function checkWebsiteOrderConfirmation(
  pendingOrderId: string,
  token: string,
): Promise<WebsiteConfirmationStatusResult> {
  if (!API || !pendingOrderId || !token) {
    return { ok: false, message: 'Tasdiqlash ma’lumoti topilmadi.' };
  }

  try {
    const response = await fetch(
      `${API}/api/website-orders/${encodeURIComponent(pendingOrderId)}/status?token=${encodeURIComponent(token)}`,
      { headers: { Accept: 'application/json' } },
    );
    const data = await response.json().catch(() => ({} as Record<string, unknown>));
    if (!response.ok) {
      return { ok: false, message: String(data?.message || `Xato (${response.status})`) };
    }
    return {
      ok: true,
      status: data?.status as WebsiteConfirmationStatus,
      message: String(data?.message || ''),
      orderId: typeof data?.orderId === 'string' ? data.orderId : '',
      paymentUrl: typeof data?.paymentUrl === 'string' ? data.paymentUrl : '',
    };
  } catch {
    return { ok: false, message: 'Tasdiqlash holatini tekshirib bo‘lmadi.' };
  }
}

export interface BookingPayload {
  name: string;
  phone: string;
  date?: string;
  time?: string;
  guests?: string;
  eventType?: string;
  note?: string;
}

export async function createBooking(payload: BookingPayload): Promise<{ ok: boolean; message: string }> {
  if (!API) return { ok: false, message: "Backend sozlanmagan (VITE_API_URL yo‘q)." };

  try {
    const response = await fetch(`${API}/api/booking`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({} as { message?: string }));
    if (!response.ok) return { ok: false, message: data?.message || `Xato (${response.status})` };
    return { ok: true, message: data?.message || 'Arizangiz qabul qilindi.' };
  } catch {
    return { ok: false, message: 'Tarmoq xatosi. Internet aloqasini tekshiring.' };
  }
}
