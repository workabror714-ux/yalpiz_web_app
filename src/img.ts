import type { SyntheticEvent } from 'react';

// Rasm tezligi yordamchisi.
// Menyu rasmlari i.ibb.co'da to'liq o'lchamda (sekin). thumb() ularni tashqi
// rasm-CDN (wsrv.nl) orqali kichik WebP qilib beradi — CDN keshlaydi, keyingi
// yuklashlar tez bo'ladi (botdagi kabi). data:/blob:/bo'sh URL tegilmaydi.
export const thumb = (url?: string, w = 500): string => {
  if (!url || url.startsWith('data:') || url.startsWith('blob:')) return url || '';
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${w}&q=82&output=webp&we`;
};

// Proxy yiqilsa — bir marta originalga qaytadi (tsikl bo'lmasin).
export const imgFallback = (e: SyntheticEvent<HTMLImageElement>, original?: string) => {
  const el = e.currentTarget;
  if (el.dataset.fb || !original) return;
  el.dataset.fb = '1';
  el.src = original;
};
