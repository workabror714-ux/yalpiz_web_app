import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, Phone, RefreshCw, Send, UtensilsCrossed } from 'lucide-react';

import { CategoryType, Language, MenuItem } from './types';
import { TRANSLATIONS } from './data';
import { Category, fetchMenu } from './api';
import { openTelegramBot } from './config';

import Header from './components/Header';
import HeroCarousel from './components/HeroCarousel';
import Marquee from './components/Marquee';
import CategoryNav from './components/CategoryNav';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';
import BookingSection from './components/BookingSection';
import WhyUs from './components/WhyUs';
import About from './components/About';
import Branches from './components/Branches';
import DeliveryInfo from './components/DeliveryInfo';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import SeoLocalSection from './components/SeoLocalSection';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('yalpiz_lang');
    return saved === 'uz' || saved === 'ru' ? saved : 'uz';
  });
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuUnavailable, setMenuUnavailable] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [expandedCats, setExpandedCats] = useState<string[]>([]);
  const INITIAL_PER_CAT = 8;
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    localStorage.setItem('yalpiz_lang', lang);
    const isUz = lang === 'uz';
    document.documentElement.lang = isUz ? 'uz' : 'ru';
    document.title = isUz
      ? 'Yalpiz Restaurant — Shota Rustaveli 115, Toshkent'
      : 'Ресторан Yalpiz — Шота Руставели 115, Ташкент';

    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) {
      description.content = isUz
        ? 'Yalpiz — Shota Rustaveli 115 dagi oilaviy restoran. Menyu bilan tanishing, joy band qiling va taomlarni Telegram bot orqali buyurtma qiling.'
        : 'Yalpiz — семейный ресторан на Шота Руставели, 115. Смотрите меню, бронируйте стол и заказывайте блюда через Telegram-бот.';
    }
  }, [lang]);

  const loadMenu = useCallback(async () => {
    setMenuLoading(true);
    setMenuUnavailable(false);
    const result = await fetchMenu();
    setMenuItems(result.items);
    setCategories(result.categories);
    setMenuUnavailable(result.source !== 'api');
    setMenuLoading(false);
  }, []);

  useEffect(() => {
    void loadMenu();
  }, [loadMenu]);

  const toggleCat = (id: string) => {
    setExpandedCats((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  };

  const filteredMenuItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      if (!query) return matchesCategory;

      return (
        item.name_uz.toLowerCase().includes(query) ||
        item.name_ru.toLowerCase().includes(query) ||
        item.desc_uz.toLowerCase().includes(query) ||
        item.desc_ru.toLowerCase().includes(query)
      ) && matchesCategory;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  const handleNavWithOffset = useCallback((href: string) => {
    const element = document.querySelector(href);
    if (!element) return;
    const headerHeight = document.getElementById('main-header')?.offsetHeight ?? 80;
    const top = window.scrollY + element.getBoundingClientRect().top - headerHeight - 12;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    window.history.replaceState(null, '', href);
  }, []);

  const handleBotOrder = useCallback(() => {
    openTelegramBot();
  }, []);

  const renderCard = (item: MenuItem) => (
    <ProductCard
      key={item.id}
      item={item}
      lang={lang}
      onSelect={() => setSelectedProduct(item)}
      onBotOrder={handleBotOrder}
    />
  );

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-brand-dark flex flex-col font-sans overflow-x-hidden selection:bg-brand-accent selection:text-brand-dark">
      <Header
        lang={lang}
        setLang={setLang}
        onBookingClick={() => handleNavWithOffset('#booking')}
        onBotOrder={handleBotOrder}
      />

      <HeroCarousel
        lang={lang}
        onExploreClick={() => handleNavWithOffset('#menu')}
        onBookingClick={() => handleNavWithOffset('#booking')}
        onBotOrder={handleBotOrder}
      />

      <Marquee lang={lang} />

      <main id="menu" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 flex-grow min-w-0">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/5 rounded-full text-brand-primary font-bold text-xs uppercase tracking-widest">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>{lang === 'uz' ? 'Yalpiz menyusi' : 'Меню Yalpiz'}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark">
            {lang === 'uz' ? 'Menyu bilan tanishing' : 'Познакомьтесь с меню'}
          </h2>
          <p className="font-sans text-brand-muted text-xs sm:text-sm leading-normal">
            {lang === 'uz'
              ? 'Menyu va narxlarni saytda ko‘ring. Taom buyurtmasi Telegram bot orqali qabul qilinadi.'
              : 'Смотрите меню и цены на сайте. Заказы на блюда принимаются через Telegram-бот.'}
          </p>
        </div>

        {!menuUnavailable && !menuLoading && (
          <CategoryNav
            lang={lang}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        <div className="pt-4">
          {menuLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8" aria-label={lang === 'uz' ? 'Menyu yuklanmoqda' : 'Загрузка меню'}>
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-white rounded-3xl border border-brand-primary/5 overflow-hidden animate-pulse">
                  <div className="aspect-4/3 bg-brand-primary/5" />
                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="h-4 bg-brand-primary/5 rounded w-3/4" />
                    <div className="h-3 bg-brand-primary/5 rounded w-full" />
                    <div className="h-3 bg-brand-primary/5 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : menuUnavailable ? (
            <div className="max-w-xl mx-auto bg-white border border-amber-200 rounded-3xl p-7 sm:p-9 text-center shadow-sm space-y-5">
              <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-brand-dark">
                  {lang === 'uz' ? 'Menyu vaqtincha mavjud emas' : 'Меню временно недоступно'}
                </h3>
                <p className="text-brand-muted text-sm leading-relaxed">
                  {lang === 'uz'
                    ? 'Soxta yoki eskirgan menyu ko‘rsatilmaydi. Buyurtma uchun Telegram botni oching yoki restoranga qo‘ng‘iroq qiling.'
                    : 'Мы не показываем устаревшее демонстрационное меню. Откройте Telegram-бот или позвоните в ресторан.'}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={handleBotOrder}
                  className="px-5 py-3 bg-brand-primary text-white font-bold rounded-xl inline-flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {lang === 'uz' ? 'Telegram botni ochish' : 'Открыть Telegram-бот'}
                </button>
                <a
                  href="tel:+998951939898"
                  className="px-5 py-3 bg-brand-neutral border border-brand-primary/10 text-brand-primary font-bold rounded-xl inline-flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  +998 95 193 98 98
                </a>
                <button
                  type="button"
                  onClick={() => void loadMenu()}
                  className="px-5 py-3 border border-brand-primary/10 text-brand-dark font-bold rounded-xl inline-flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  {lang === 'uz' ? 'Qayta urinish' : 'Повторить'}
                </button>
              </div>
            </div>
          ) : selectedCategory === 'all' && !searchQuery.trim() ? (
            <div className="space-y-14">
              {categories.map((category) => {
                const categoryItems = menuItems.filter((item) => item.category === category.id);
                if (!categoryItems.length) return null;
                const expanded = expandedCats.includes(category.id);
                const visibleItems = expanded ? categoryItems : categoryItems.slice(0, INITIAL_PER_CAT);

                return (
                  <section key={category.id} aria-labelledby={`category-${category.id}`}>
                    <div className="flex items-end justify-between mb-5 gap-4">
                      <h3 id={`category-${category.id}`} className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark">
                        {lang === 'uz' ? category.label_uz : category.label_ru}
                      </h3>
                      <span className="text-xs text-brand-muted whitespace-nowrap">
                        {categoryItems.length} {lang === 'uz' ? 'ta taom' : 'блюд'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
                      {visibleItems.map(renderCard)}
                    </div>
                    {categoryItems.length > INITIAL_PER_CAT && (
                      <div className="text-center mt-6">
                        <button
                          type="button"
                          onClick={() => toggleCat(category.id)}
                          className="px-6 py-2.5 bg-white border-2 border-brand-primary/15 hover:border-brand-primary/40 text-brand-primary text-sm font-bold rounded-xl transition-all inline-flex items-center gap-2"
                        >
                          {expanded
                            ? lang === 'uz' ? 'Kamroq ko‘rsatish' : 'Показать меньше'
                            : lang === 'uz' ? `Ko‘proq (${categoryItems.length - INITIAL_PER_CAT})` : `Ещё (${categoryItems.length - INITIAL_PER_CAT})`}
                          <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredMenuItems.length > 0 ? (
                <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
                  {filteredMenuItems.map(renderCard)}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-3xl border border-brand-primary/5 p-12 text-center max-w-md mx-auto space-y-4"
                >
                  <div className="w-16 h-16 bg-brand-primary/5 text-brand-primary rounded-full flex items-center justify-center mx-auto text-lg font-bold">!</div>
                  <div className="space-y-1">
                    <h4 className="font-serif text-lg font-bold text-brand-dark">
                      {lang === 'uz' ? 'Hech narsa topilmadi' : 'Ничего не найдено'}
                    </h4>
                    <p className="font-sans text-brand-muted text-xs sm:text-sm">
                      {lang === 'uz' ? 'Boshqa kalit so‘z bilan qidirib ko‘ring.' : 'Попробуйте изменить запрос.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="px-5 py-2.5 bg-brand-primary text-white text-xs font-semibold rounded-xl"
                  >
                    {lang === 'uz' ? 'Filtrlarni tiklash' : 'Сбросить фильтры'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>

      <BookingSection lang={lang} />
      <WhyUs lang={lang} />
      <About lang={lang} />

      <Branches lang={lang} />
      <SeoLocalSection lang={lang} />
      <DeliveryInfo lang={lang} onBotOrder={handleBotOrder} />
      <Footer lang={lang} onNavClick={handleNavWithOffset} onBotOrder={handleBotOrder} />

      <ProductDetail
        item={selectedProduct}
        lang={lang}
        onBotOrder={handleBotOrder}
        onClose={() => setSelectedProduct(null)}
      />

      <BottomNav lang={lang} onNavigate={handleNavWithOffset} onBotOrder={handleBotOrder} />
    </div>
  );
}
