import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight, Leaf } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data';
import { thumb } from '../img';

interface HeroCarouselProps {
  lang: Language;
  onExploreClick: () => void;
  onBookingClick: () => void;
  onOrderClick: () => void;
}

interface Slide {
  image: string;
  badge_uz: string;
  badge_ru: string;
  title_uz: string;
  title_ru: string;
  sub_uz: string;
  sub_ru: string;
  cta: 'order' | 'menu' | 'booking';
}

const SLIDES: Slide[] = [
  {
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&q=80',
    badge_uz: "Haqiqiy milliy mehmondo'stlik",
    badge_ru: 'Настоящее гостеприимство',
    title_uz: 'Yalpiz — Toshkentdagi oilaviy restoran',
    title_ru: 'Yalpiz — семейный ресторан в Ташкенте',
    sub_uz: 'Shota Rustaveli 115 dagi restoranimizda oilaviy uchrashuv, bayram va tadbirlar uchun joy band qiling.',
    sub_ru: 'Забронируйте стол для семейной встречи, праздника или мероприятия в ресторане на Шота Руставели, 115.',
    cta: 'booking',
  },
  {
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80',
    badge_uz: 'Menyu va buyurtma',
    badge_ru: 'Меню и заказ',
    title_uz: 'Taomlarni saytdan buyurtma bering',
    title_ru: 'Смотрите меню и заказывайте на сайте',
    sub_uz: 'Menyudan taom tanlang, savatni to‘ldiring va buyurtmani saytda rasmiylashtiring.',
    sub_ru: 'Выберите блюда, соберите корзину и оформите заказ прямо на сайте.',
    cta: 'order',
  },
  {
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80',
    badge_uz: 'Yalpiz menyusi',
    badge_ru: 'Меню Yalpiz',
    title_uz: 'Sevimli taomlaringizni toping',
    title_ru: 'Найдите любимые блюда',
    sub_uz: 'Menyu, narxlar va mavjud taomlarni sayt orqali ko‘ring.',
    sub_ru: 'Смотрите меню, цены и доступные блюда на сайте.',
    cta: 'menu',
  },
  {
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600&q=80',
    badge_uz: 'Tadbirlar uchun',
    badge_ru: 'Для событий',
    title_uz: 'Bayramingizni biz bilan nishonlang',
    title_ru: 'Отпразднуйте праздник у нас',
    sub_uz: 'Tug‘ilgan kun, nikoh, yubiley va korporativ tadbirlar uchun joy band qiling.',
    sub_ru: 'Забронируйте место для дня рождения, свадьбы, юбилея или корпоратива.',
    cta: 'booking',
  },
];

export default function HeroCarousel({ lang, onExploreClick, onBookingClick, onOrderClick }: HeroCarouselProps) {
  const t = TRANSLATIONS[lang];
  const isUz = lang === 'uz';
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchX = useRef(0);

  const paint = (nextIndex: number, nextDirection: number) => {
    setDirection(nextDirection);
    setCurrent((nextIndex + SLIDES.length) % SLIDES.length);
  };

  const next = () => paint(current + 1, 1);
  const prev = () => paint(current - 1, -1);

  useEffect(() => {
    timer.current = setInterval(() => setCurrent((value) => (value + 1) % SLIDES.length), 5000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [current]);

  const onTouchStart = (event: React.TouchEvent) => {
    touchX.current = event.touches[0].clientX;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const deltaX = event.changedTouches[0].clientX - touchX.current;
    if (deltaX > 50) prev();
    if (deltaX < -50) next();
  };

  const slide = SLIDES[current];
  const title = isUz ? slide.title_uz : slide.title_ru;
  const subtitle = isUz ? slide.sub_uz : slide.sub_ru;
  const badge = isUz ? slide.badge_uz : slide.badge_ru;

  const runPrimaryAction = () => {
    if (slide.cta === 'booking') onBookingClick();
    else if (slide.cta === 'order') onOrderClick();
    else onExploreClick();
  };

  const primaryText =
    slide.cta === 'booking'
      ? isUz ? 'Joy band qilish' : 'Забронировать'
      : slide.cta === 'order'
        ? isUz ? 'Buyurtma berish' : 'Заказать'
        : t.exploreMenu;

  return (
    <section
      id="home"
      className="relative overflow-hidden h-[78dvh] min-h-[520px] sm:h-[82dvh]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src={thumb(slide.image, 1600)}
            alt={title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            fetchPriority={current === 0 ? 'high' : 'auto'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/50 to-brand-dark/25" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/60 to-transparent" />
        </motion.div>
      </AnimatePresence>

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
              {subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                type="button"
                onClick={runPrimaryAction}
                className="px-7 py-3.5 bg-brand-primary text-white hover:bg-brand-dark rounded-2xl font-semibold shadow-lg shadow-brand-dark/30 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 group"
              >
                {primaryText}
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={slide.cta === 'menu' ? onBookingClick : onExploreClick}
                className="px-7 py-3.5 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/25 rounded-2xl font-semibold transition-all duration-300 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center"
              >
                {slide.cta === 'menu'
                  ? isUz ? 'Joy band qilish' : 'Забронировать'
                  : t.exploreMenu}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={prev}
        aria-label={isUz ? 'Oldingi slayd' : 'Предыдущий слайд'}
        className="hidden sm:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 items-center justify-center text-white transition-all"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label={isUz ? 'Keyingi slayd' : 'Следующий слайд'}
        className="hidden sm:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 items-center justify-center text-white transition-all"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => paint(index, index > current ? 1 : -1)}
            aria-label={`${isUz ? 'Slayd' : 'Слайд'} ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === current ? 'w-8 bg-brand-accent' : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
