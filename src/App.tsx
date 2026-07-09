import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Star, UtensilsCrossed, Send, ArrowRight } from 'lucide-react';

import { CategoryType, Language, CartItem, MenuItem } from './types';
import { TRANSLATIONS, TESTIMONIALS } from './data';
import { fetchMenu, Category } from './api';

// Component Imports
import Header from './components/Header';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import CategoryNav from './components/CategoryNav';
import ProductCard from './components/ProductCard';
import Promotions from './components/Promotions';
import WhyUs from './components/WhyUs';
import About from './components/About';
import Branches from './components/Branches';
import DeliveryInfo from './components/DeliveryInfo';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import ExtraModals from './components/ExtraModals';

export default function App() {
  // --- Core States ---
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('yalpiz_lang');
    return (saved === 'uz' || saved === 'ru') ? saved : 'uz';
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('yalpiz_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [extraModal, setExtraModal] = useState<'orders' | 'profile' | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState<'menu' | 'cart' | 'orders' | 'profile' | null>('menu');

  // Menyu — backend'dan (fetchMenu), xato bo'lsa demo fallback
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);

  const t = TRANSLATIONS[lang];

  // --- Persistence Sync ---
  useEffect(() => {
    localStorage.setItem('yalpiz_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('yalpiz_cart', JSON.stringify(cart));
  }, [cart]);

  // Menyuni backend'dan yuklash (bir marta; xato bo'lsa demo ishlatiladi)
  useEffect(() => {
    fetchMenu().then((r) => {
      setMenuItems(r.items);
      setCategories(r.categories);
      setMenuLoading(false);
    });
  }, []);

  // Adjust bottom navigation status active tab based on view states
  useEffect(() => {
    if (cartOpen) {
      setActiveMobileTab('cart');
    } else if (extraModal === 'orders') {
      setActiveMobileTab('orders');
    } else if (extraModal === 'profile') {
      setActiveMobileTab('profile');
    } else {
      setActiveMobileTab('menu');
    }
  }, [cartOpen, extraModal]);

  // --- Cart Operations ---
  const handleAddToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find((c) => c.item.id === item.id);
      if (existing) {
        return prevCart.map((c) =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prevCart, { item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    setCart((prevCart) => {
      if (quantity <= 0) {
        return prevCart.filter((c) => c.item.id !== itemId);
      }
      return prevCart.map((c) =>
        c.item.id === itemId ? { ...c, quantity } : c
      );
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((c) => c.item.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  // --- Filtering & Search Logic ---
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category match
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

      // Case-insensitive query matches
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const nameUz = item.name_uz.toLowerCase();
      const nameRu = item.name_ru.toLowerCase();
      const descUz = item.desc_uz.toLowerCase();
      const descRu = item.desc_ru.toLowerCase();

      const matchesSearch =
        nameUz.includes(query) ||
        nameRu.includes(query) ||
        descUz.includes(query) ||
        descRu.includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  // Navigate & scroll with offset handler
  const handleNavWithOffset = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // Click handler from Promotion cards
  const handlePromoClick = (categoryLink: CategoryType) => {
    setSelectedCategory(categoryLink);
    handleNavWithOffset('#menu');
  };

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-brand-dark flex flex-col font-sans selection:bg-brand-accent selection:text-brand-dark">
      
      {/* 1. Header Navigation */}
      <Header
        lang={lang}
        setLang={setLang}
        cartCount={cartCount}
        onCartToggle={() => setCartOpen(!cartOpen)}
        onOrderClick={() => setCartOpen(true)}
        onOrdersClick={() => setExtraModal('orders')}
      />

      {/* 2. Hero Header */}
      <Hero
        lang={lang}
        onExploreClick={() => handleNavWithOffset('#menu')}
        onOrderClick={() => setCartOpen(true)}
      />

      {/* 3. running looping benefits strip */}
      <Marquee lang={lang} />

      {/* 4. Interactive Menu Grid Block */}
      <main id="menu" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 flex-grow">
        
        {/* Section title */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/5 rounded-full text-brand-primary font-bold text-xs uppercase tracking-widest">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>{lang === 'uz' ? 'Yalpiz Shoxona Oshxonasi' : 'Меню ресторана'}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark">
            {lang === 'uz' ? 'Bizning Milliy Menyu' : 'Наше Национальное Меню'}
          </h2>
          <p className="font-sans text-brand-muted text-xs sm:text-sm leading-normal">
            {lang === 'uz'
              ? 'Eng sara o‘zbek tansiq taomlari, sersuv kaboblar va tansiq salatlar'
              : 'Лучшие узбекские национальные блюда, сочные шашлыки и свежие салаты'}
          </p>
        </div>

        {/* Quick horizontal filter chips & Search bar */}
        <CategoryNav
          lang={lang}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Dynamic Cards Grid */}
        <div className="pt-4">
          {menuLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl border border-brand-primary/5 overflow-hidden animate-pulse">
                  <div className="aspect-4/3 bg-brand-primary/5" />
                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="h-4 bg-brand-primary/5 rounded w-3/4" />
                    <div className="h-3 bg-brand-primary/5 rounded w-full" />
                    <div className="h-3 bg-brand-primary/5 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
          <AnimatePresence mode="popLayout">
            {filteredMenuItems.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
              >
                {filteredMenuItems.map((item) => {
                  const cartEntry = cart.find((c) => c.item.id === item.id);
                  const qty = cartEntry ? cartEntry.quantity : 0;
                  return (
                    <ProductCard
                      key={item.id}
                      item={item}
                      lang={lang}
                      quantityInCart={qty}
                      onAddToCart={() => handleAddToCart(item)}
                      onUpdateQuantity={(newQty) => handleUpdateQuantity(item.id, newQty)}
                    />
                  );
                })}
              </motion.div>
            ) : (
              /* No search matches fallbacks */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-3xl border border-brand-primary/5 p-12 text-center max-w-md mx-auto space-y-4"
              >
                <div className="w-16 h-16 bg-brand-primary/5 text-brand-primary rounded-full flex items-center justify-center mx-auto text-lg font-bold">
                  !
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-lg font-bold text-brand-dark">
                    {lang === 'uz' ? 'Hech narsa topilmadi' : 'Ничего не найдено'}
                  </h4>
                  <p className="font-sans text-brand-muted text-xs sm:text-sm">
                    {lang === 'uz'
                      ? 'Iltimos, boshqa kalit so‘zlar yordamida qidirib ko‘ring.'
                      : 'Попробуйте изменить запрос или сбросить фильтры поиска.'}
                  </p>
                </div>
                <button
                  id="reset-filters-btn"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="px-5 py-2.5 bg-brand-primary text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  {lang === 'uz' ? 'Filtrlarni tiklash' : 'Сбросить фильтры'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          )}
        </div>

      </main>

      {/* 5. Featured / Promo cards Banner block */}
      <Promotions lang={lang} onPromoClick={handlePromoClick} />

      {/* 6. Why Choose Us values list */}
      <WhyUs lang={lang} />

      {/* 7. Culinary brand Story / About section */}
      <About lang={lang} />

      {/* 8. Testimonials block */}
      <section className="py-16 bg-white border-t border-brand-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/5 rounded-full text-brand-primary font-bold text-xs uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 fill-current text-brand-accent" />
              <span>{lang === 'uz' ? 'Mehmondo‘stlik bahosi' : 'Отзывы гостей'}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark">
              {t.reviewsTitle}
            </h2>
            <p className="font-sans text-brand-muted text-xs sm:text-sm">
              {t.reviewsSub}
            </p>
          </div>

          {/* Testimonial grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((review) => {
              const comment = lang === 'uz' ? review.comment_uz : review.comment_ru;
              const role = lang === 'uz' ? review.role_uz : review.role_ru;
              return (
                <div
                  key={review.id}
                  id={`review-${review.id}`}
                  className="bg-brand-neutral/40 border border-brand-primary/5 p-6 sm:p-8 rounded-[28px] space-y-4 hover:border-brand-primary/10 transition-all duration-300 flex flex-col justify-between"
                >
                  <p className="font-sans text-brand-dark/90 text-sm italic leading-relaxed">
                    &ldquo;{comment}&rdquo;
                  </p>

                  <div className="flex items-center gap-3.5 border-t border-brand-primary/5 pt-4">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-sans font-bold text-brand-dark text-xs sm:text-sm">
                        {review.name}
                      </h4>
                      <span className="font-sans text-[10px] sm:text-xs text-brand-muted block mt-0.5">
                        {role}
                      </span>
                    </div>

                    {/* Star Rating */}
                    <div className="ml-auto flex gap-0.5 text-amber-500">
                      {[...Array(review.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 9. physical Locations locator cards + embedded Maps */}
      <Branches lang={lang} />

      {/* 10. Delivery / Payment instructions */}
      <DeliveryInfo lang={lang} />

      {/* 11. Footer details and Telegram connections */}
      <Footer lang={lang} onNavClick={handleNavWithOffset} />

      {/* 12. Client Checkout sliding Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        lang={lang}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* 13. Mobile popups: History and profile sheets */}
      <ExtraModals
        lang={lang}
        activeModal={extraModal}
        onClose={() => setExtraModal(null)}
      />

      {/* 14. Responsive bottom sticky PWA navigation bar (mobile only) */}
      <BottomNav
        lang={lang}
        cartCount={cartCount}
        onCartToggle={() => setCartOpen(true)}
        onTabClick={(tab) => {
          if (tab === 'menu') {
            setExtraModal(null);
            setCartOpen(false);
          } else if (tab === 'cart') {
            setExtraModal(null);
          } else if (tab === 'orders') {
            setExtraModal('orders');
            setCartOpen(false);
          } else if (tab === 'profile') {
            setExtraModal('profile');
            setCartOpen(false);
          }
        }}
        activeTab={activeMobileTab}
      />

    </div>
  );
}
