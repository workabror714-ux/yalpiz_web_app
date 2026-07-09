import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight, Leaf } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data';
import { thumb } from '../img';

interface HeroCarouselProps {
  lang: Language;
  onExploreClick: () => void;
  onOrderClick: () => void;
}

interface Slide {
  image: string;       // Fon rasm — keyin real rasm bilan almashtiriladi
  badge_uz: string; badge_ru: string;
  title_uz: string; title_ru: string;
  sub_uz: string; sub_ru: string;
  cta: 'order' | 'menu' | 'booking';
}

// Rasmlar hozircha placeholder (Unsplash). public/ ga qo'yib yoki URL bilan almashtiring.
const SLIDES: Slide[] = [
  {
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&q=80',
    badge_uz: "Haqiqiy milliy mehmondo'stlik", badge_ru: 'Настоящее гостеприимство',
    title_uz: 'Milliy taomlar — eshigingizgacha', title_ru: 'Национальные блюда — до порога',
    sub_uz: "An'anaviy retseptlar, eng yangi mahsulotlar va professional oshpazlar mahsuli.",
    sub_ru: 'Традиционные рецепты, свежие продукты и мастерство наших поваров.',
    cta: 'order',
  },
  {
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80',
    badge_uz: 'Tez yetkazib berish', badge_ru: 'Быстрая доставка',
    title_uz: '40 daqiqada issiq yetkazamiz', title_ru: 'Доставим горячим за 40 минут',
    sub_uz: 'Shahar bo‘ylab tez va ishonchli yetkazib berish xizmati.',
    sub_ru: 'Быстрая и надёжная доставка по всему городу.',
    cta: 'order',
  },
  {
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80',
    badge_uz: 'Qulay buyurtma', badge_ru: 'Удобный заказ',
    title_uz: 'Bir necha bosishда buyurtma bering', title_ru: 'Закажите в пару нажатий',
    sub_uz: 'Menyuni ko‘ring, savatga qo‘shing va buyurtma bering — oson.',
    sub_ru: 'Смотрите меню, добавляйте в корзину и заказывайте — легко.',
    cta: 'menu',
  },
  {
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600&q=80',
    badge_uz: 'Tadbirlar uchun', badge_ru: 'Для событий',
    title_uz: 'Bayramingizni biz bilan nishonlang', title_ru: 'Отпразднуйте праздник у нас',
    sub_uz: "Tug'ilgan kun, nikoh va yubiley uchun restoranda joy bron qiling.",
    sub_ru: 'Забронируйте место для дня рождения, свадьбы или юбилея.',
    cta: 'booking',
  },
];

export default function HeroCarousel({ lang, onExploreClick, onOrderClick }: HeroCarouselProps) {
  const t = TRANSLATIONS[lang];
  const isUz = lang === 'uz';
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchX = useRef(0);

  const paint = (n: number, d: number) => { setDir(d); setCurrent((n + SLIDES.length) % SLIDES.length); };
  const next = () => paint(current + 1, 1);
  const prev = () => paint(current - 1, -1);

  // Avto-almashinuv (5s), qo'lda o'zgarganda qayta boshlanadi
  useEffect(() => {
    timer.current = setInterval(() => setCurrent((c) => (c + 1) % SLIDES.length), 5000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [current]);

  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (dx > 50) prev();
    else if (dx < -50) next();
  };

  const s = SLIDES[current];
  const title = isUz ? s.title_uz : s.title_ru;
  const sub = isUz ? s.sub_uz : s.sub_ru;
  const badge = isUz ? s.badge_uz : s.badge_ru;

  return (
    <section
      id="home"
      className="relative overflow-hidden h-[78vh] min-h-[520px] sm:h-[82vh]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slaydlar */}
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={current}
          custom={dir}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src={thumb(s.image, 1600)}
            alt={title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Qorong'i overlay — matn o'qilishi uchun */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/50 to-brand-dark/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/60 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Matn */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end sm:justify-center pb-20 sm:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="max-w-xl space-y-4 sm:space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white text-xs sm:text-sm">
              <Leaf className="w-4 h-4 text-brand-accent fill-current" />
              <span className="tracking-wider uppercase font-semibold">{badge}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              {title}
            </h1>

            <p className="font-sans text-white/85 text-sm sm:text-lg max-w-lg leading-relaxed">
              {sub}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => {
                  if (s.cta === 'order') onOrderClick();
                  else if (s.cta === 'booking') document.querySelector('#promos')?.scrollIntoView({ behavior: 'smooth' });
                  else onExploreClick();
                }}
                className="px-7 py-3.5 bg-brand-primary text-white hover:bg-brand-dark rounded-2xl font-semibold shadow-lg shadow-brand-dark/30 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 cursor-pointer group"
              >
                {s.cta === 'order' ? t.orderBtn : s.cta === 'booking' ? (isUz ? 'Joy bron qilish' : 'Забронировать') : t.exploreMenu}
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              <button
                onClick={s.cta === 'order' ? onExploreClick : onOrderClick}
                className="px-7 py-3.5 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/25 rounded-2xl font-semibold transition-all duration-300 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center cursor-pointer"
              >
                {s.cta === 'order' ? t.exploreMenu : t.orderBtn}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* O'q navigatsiya (desktop) */}
      <button
        onClick={prev}
        aria-label="Oldingi"
        className="hidden sm:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 items-center justify-center text-white transition-all cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        aria-label="Keyingi"
        className="hidden sm:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 items-center justify-center text-white transition-all cursor-pointer"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Nuqta navigatsiya */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => paint(i, i > current ? 1 : -1)}
            aria-label={`Slayd ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              i === current ? 'w-8 bg-brand-accent' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
