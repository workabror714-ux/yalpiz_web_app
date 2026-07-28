import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, Phone, RefreshCw, ShoppingBag, UtensilsCrossed } from 'lucide-react';

import { CartItem, CategoryType, Language, MenuItem } from './types';
import { TRANSLATIONS } from './data';
import { Category, fetchMenu } from './api';

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
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import SeoLocalSection from './components/SeoLocalSection';

function readSavedCart(): CartItem[] {
  try {
    const raw = localStorage.getItem('yalpiz_cart');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error('not_array');
    return parsed.filter((entry) => entry?.item?.id && Number.isInteger(entry?.quantity) && entry.quantity > 0);
  } catch {
    localStorage.removeItem('yalpiz_cart');
    return [];
  }
}

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('yalpiz_lang');
    return saved === 'uz' || saved === 'ru' ? saved : 'uz';
  });
  const [cart, setCart] = useState<CartItem[]>(readSavedCart);
  const [cartOpen, setCartOpen] = useState(false);
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
    document.documentElement.lang = lang;
    document.title = lang === 'uz'
      ? 'Yalpiz Restaurant — Shota Rustaveli 115, Toshkent'
      : 'Ресторан Yalpiz — Шота Руставели 115, Ташкент';
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) {
      description.content = lang === 'uz'
        ? 'Yalpiz — Shota Rustaveli 115 dagi oilaviy restoran. Menyu, sayt orqali onlayn to‘lovli yetkazib berish va joy band qilish.'
        : 'Yalpiz — семейный ресторан на Шота Руставели, 115. Меню, доставка с онлайн-оплатой на сайте и бронирование.';
    }
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('yalpiz_cart', JSON.stringify(cart));
  }, [cart]);

  const loadMenu = useCallback(async () => {
    setMenuLoading(true);
    setMenuUnavailable(false);
    const result = await fetchMenu();
    setMenuItems(result.items);
    setCategories(result.categories);
    setMenuUnavailable(result.source !== 'api');

    if (result.source === 'api') {
      const current = new Map(result.items.map((item) => [item.id, item]));
      setCart((saved) => saved.flatMap((entry) => {
        const actual = current.get(entry.item.id);
        if (!actual || !actual.available) return [];
        return [{ item: actual, quantity: Math.max(1, Math.min(99, entry.quantity)) }];
      }));
    }
    setMenuLoading(false);
  }, []);

  useEffect(() => { void loadMenu(); }, [loadMenu]);

  const updateQuantity = (itemId: string, quantity: number) => {
    setCart((current) => {
      if (quantity <= 0) return current.filter((entry) => entry.item.id !== itemId);
      return current.map((entry) => entry.item.id === itemId ? { ...entry, quantity: Math.min(99, quantity) } : entry);
    });
  };

  const addToCart = (item: MenuItem) => {
    if (!item.available) return;
    setCart((current) => {
      const existing = current.find((entry) => entry.item.id === item.id);
      return existing
        ? current.map((entry) => entry.item.id === item.id ? { ...entry, item, quantity: Math.min(99, entry.quantity + 1) } : entry)
        : [...current, { item, quantity: 1 }];
    });
  };

  const cartCount = cart.reduce((sum, entry) => sum + entry.quantity, 0);
  const selectedQty = selectedProduct ? cart.find((entry) => entry.item.id === selectedProduct.id)?.quantity || 0 : 0;

  const filteredMenuItems = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return menuItems.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      if (!query) return matchesCategory;
      return matchesCategory && [item.name_uz, item.name_ru, item.desc_uz, item.desc_ru]
        .some((value) => value.toLowerCase().includes(query));
    });
  }, [menuItems, searchQuery, selectedCategory]);

  const handleNavWithOffset = useCallback((href: string) => {
    const element = document.querySelector(href);
    if (!element) return;
    const headerHeight = document.getElementById('main-header')?.offsetHeight ?? 80;
    const top = window.scrollY + element.getBoundingClientRect().top - headerHeight - 12;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    window.history.replaceState(null, '', href);
  }, []);

  const renderCard = (item: MenuItem) => {
    const quantity = cart.find((entry) => entry.item.id === item.id)?.quantity || 0;
    return (
      <ProductCard
        key={item.id}
        item={item}
        lang={lang}
        quantityInCart={quantity}
        onAddToCart={() => addToCart(item)}
        onUpdateQuantity={(value) => updateQuantity(item.id, value)}
        onSelect={() => setSelectedProduct(item)}
      />
    );
  };

  return (
    <div id="home" className="min-h-screen bg-[#f7f5f0] text-brand-dark flex flex-col font-sans overflow-x-hidden selection:bg-brand-accent selection:text-brand-dark">
      <Header lang={lang} setLang={setLang} cartCount={cartCount} onBookingClick={() => handleNavWithOffset('#booking')} onCartOpen={() => setCartOpen(true)} />
      <HeroCarousel lang={lang} onExploreClick={() => handleNavWithOffset('#menu')} onBookingClick={() => handleNavWithOffset('#booking')} onOrderClick={() => setCartOpen(true)} />
      <Marquee lang={lang} />

      <main id="menu" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 flex-grow min-w-0">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/5 rounded-full text-brand-primary font-bold text-xs uppercase tracking-widest"><UtensilsCrossed className="w-3.5 h-3.5" /><span>{lang === 'uz' ? 'Yalpiz menyusi' : 'Меню Yalpiz'}</span></div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark">{lang === 'uz' ? 'Menyu bilan tanishing va buyurtma bering' : 'Выберите блюда и оформите заказ'}</h2>
          <p className="text-brand-muted text-xs sm:text-sm leading-normal">{lang === 'uz' ? 'Haqiqiy menyu va narxlar Delever bilan sinxronlanadi. Taomlarni savatga qo‘shib, buyurtmani shu saytda yakunlang.' : 'Актуальные меню и цены синхронизируются с Delever. Добавьте блюда в корзину и оформите заказ на сайте.'}</p>
        </div>

        {!menuUnavailable && !menuLoading && <CategoryNav lang={lang} categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}

        <div className="pt-4">
          {menuLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8" aria-label={lang === 'uz' ? 'Menyu yuklanmoqda' : 'Загрузка меню'}>
              {Array.from({ length: 8 }).map((_, index) => <div key={index} className="bg-white rounded-3xl border border-brand-primary/5 overflow-hidden animate-pulse"><div className="aspect-4/3 bg-brand-primary/5" /><div className="p-5 sm:p-6 space-y-3"><div className="h-4 bg-brand-primary/5 rounded w-3/4" /><div className="h-3 bg-brand-primary/5 rounded w-full" /><div className="h-3 bg-brand-primary/5 rounded w-2/3" /></div></div>)}
            </div>
          ) : menuUnavailable ? (
            <div className="max-w-xl mx-auto bg-white border border-amber-200 rounded-3xl p-7 sm:p-9 text-center shadow-sm space-y-5">
              <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto"><UtensilsCrossed className="w-6 h-6" /></div>
              <div className="space-y-2"><h3 className="font-serif text-2xl font-bold">{lang === 'uz' ? 'Menyu vaqtincha mavjud emas' : 'Меню временно недоступно'}</h3><p className="text-brand-muted text-sm">{lang === 'uz' ? 'Soxta yoki eskirgan menyu ko‘rsatilmaydi. Qayta urinib ko‘ring yoki restoranga qo‘ng‘iroq qiling.' : 'Мы не показываем устаревшее меню. Повторите попытку или позвоните в ресторан.'}</p></div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center"><a href="tel:+998951939898" className="px-5 py-3 bg-brand-neutral border border-brand-primary/10 text-brand-primary font-bold rounded-xl inline-flex items-center justify-center gap-2"><Phone className="w-4 h-4" />+998 95 193 98 98</a><button type="button" onClick={() => void loadMenu()} className="px-5 py-3 border border-brand-primary/10 text-brand-dark font-bold rounded-xl inline-flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4" />{lang === 'uz' ? 'Qayta urinish' : 'Повторить'}</button></div>
            </div>
          ) : selectedCategory === 'all' && !searchQuery.trim() ? (
            <div className="space-y-14">
              {categories.map((category) => {
                const categoryItems = menuItems.filter((item) => item.category === category.id);
                if (!categoryItems.length) return null;
                const expanded = expandedCats.includes(category.id);
                const visible = expanded ? categoryItems : categoryItems.slice(0, INITIAL_PER_CAT);
                return (
                  <section key={category.id} aria-labelledby={`category-${category.id}`}>
                    <div className="flex items-end justify-between mb-5 gap-4"><h3 id={`category-${category.id}`} className="font-serif text-2xl sm:text-3xl font-bold">{lang === 'uz' ? category.label_uz : category.label_ru}</h3><span className="text-xs text-brand-muted whitespace-nowrap">{categoryItems.length} {lang === 'uz' ? 'ta taom' : 'блюд'}</span></div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">{visible.map(renderCard)}</div>
                    {categoryItems.length > INITIAL_PER_CAT && <div className="text-center mt-6"><button type="button" onClick={() => setExpandedCats((current) => current.includes(category.id) ? current.filter((id) => id !== category.id) : [...current, category.id])} className="px-6 py-2.5 bg-white border-2 border-brand-primary/15 hover:border-brand-primary/40 text-brand-primary text-sm font-bold rounded-xl inline-flex items-center gap-2">{expanded ? (lang === 'uz' ? 'Kamroq ko‘rsatish' : 'Показать меньше') : (lang === 'uz' ? `Ko‘proq (${categoryItems.length - INITIAL_PER_CAT})` : `Ещё (${categoryItems.length - INITIAL_PER_CAT})`)}<ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} /></button></div>}
                  </section>
                );
              })}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredMenuItems.length ? (
                <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">{filteredMenuItems.map(renderCard)}</motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-3xl border border-brand-primary/5 p-12 text-center max-w-md mx-auto space-y-4"><div className="w-16 h-16 bg-brand-primary/5 text-brand-primary rounded-full flex items-center justify-center mx-auto text-lg font-bold">!</div><h4 className="font-serif text-lg font-bold">{lang === 'uz' ? 'Hech narsa topilmadi' : 'Ничего не найдено'}</h4><button type="button" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} className="px-5 py-2.5 bg-brand-primary text-white text-xs font-semibold rounded-xl">{lang === 'uz' ? 'Filtrlarni tiklash' : 'Сбросить фильтры'}</button></motion.div>
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
      <DeliveryInfo lang={lang} onOrderClick={() => setCartOpen(true)} />
      <Footer lang={lang} onNavClick={handleNavWithOffset} onOrderClick={() => setCartOpen(true)} />

      <ProductDetail item={selectedProduct} lang={lang} quantityInCart={selectedQty} onAddToCart={() => selectedProduct && addToCart(selectedProduct)} onUpdateQuantity={(value) => selectedProduct && updateQuantity(selectedProduct.id, value)} onClose={() => setSelectedProduct(null)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} lang={lang} cart={cart} onUpdateQuantity={updateQuantity} onRemoveItem={(itemId) => setCart((current) => current.filter((entry) => entry.item.id !== itemId))} onClearCart={() => setCart([])} />
      <BottomNav lang={lang} cartCount={cartCount} onNavigate={handleNavWithOffset} onCartOpen={() => setCartOpen(true)} />

      {cartCount > 0 && !cartOpen && (
        <button type="button" onClick={() => setCartOpen(true)} className="hidden md:inline-flex fixed right-6 bottom-6 z-30 px-5 py-3.5 bg-brand-primary text-white font-bold rounded-2xl shadow-xl items-center gap-2">
          <ShoppingBag className="w-5 h-5" />{lang === 'uz' ? `Savat (${cartCount})` : `Корзина (${cartCount})`}
        </button>
      )}
    </div>
  );
}
