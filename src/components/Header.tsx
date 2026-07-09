import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, ShoppingBag, ClipboardList, Menu, X, Globe } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  cartCount: number;
  onCartToggle: () => void;
  onOrderClick: () => void;
  onOrdersClick: () => void;
}

export default function Header({
  lang,
  setLang,
  cartCount,
  onCartToggle,
  onOrderClick,
  onOrdersClick,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: t.navMenu, href: '#menu' },
    { name: t.navPromo, href: '#promos' },
    { name: t.navAbout, href: '#about' },
    { name: t.navBranches, href: '#branches' },
    { name: t.navContact, href: '#delivery' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const offset = 80; // height of header
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

  return (
    <header
      id="main-header"
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#f7f5f0]/95 backdrop-blur-md shadow-sm border-b border-[#1a5c30]/10 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <a
            id="header-logo"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-brand-accent shadow-md transition-transform duration-300 group-hover:rotate-12">
              <Leaf className="w-5 h-5 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-wider text-brand-dark leading-none">
                YALPIZ
              </span>
              <span className="text-[10px] tracking-widest text-brand-primary font-medium uppercase mt-0.5">
                {t.brandSlogan}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="font-sans text-sm font-medium text-brand-dark/80 hover:text-brand-primary transition-colors duration-200 relative py-1 group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-accent transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div id="header-actions" className="flex items-center gap-3 sm:gap-4">
            
            {/* Language Switcher */}
            <div className="flex items-center bg-white/60 border border-brand-primary/10 rounded-full p-0.5">
              <button
                id="lang-uz-btn"
                onClick={() => setLang('uz')}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                  lang === 'uz'
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'text-brand-dark/70 hover:text-brand-primary'
                }`}
              >
                UZ
              </button>
              <button
                id="lang-ru-btn"
                onClick={() => setLang('ru')}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                  lang === 'ru'
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'text-brand-dark/70 hover:text-brand-primary'
                }`}
              >
                RU
              </button>
            </div>

            {/* Orders / Tarix (Desktop) */}
            <button
              id="header-orders-btn"
              onClick={onOrdersClick}
              className="hidden md:inline-flex relative w-10 h-10 rounded-xl bg-white hover:bg-brand-primary hover:text-white transition-all duration-200 shadow-sm border border-brand-primary/5 items-center justify-center text-brand-dark cursor-pointer group"
              aria-label={lang === 'uz' ? 'Buyurtmalarim' : 'Мои заказы'}
              title={lang === 'uz' ? 'Buyurtmalarim' : 'Мои заказы'}
            >
              <ClipboardList className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
            </button>

            {/* Cart Button */}
            <button
              id="header-cart-btn"
              onClick={onCartToggle}
              className="relative w-10 h-10 rounded-xl bg-white hover:bg-brand-primary hover:text-white transition-all duration-200 shadow-sm border border-brand-primary/5 flex items-center justify-center text-brand-dark cursor-pointer group"
              aria-label={t.cart}
            >
              <ShoppingBag className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              {cartCount > 0 && (
                <span
                  id="cart-badge-count"
                  className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 bg-brand-accent text-brand-dark text-[10px] font-bold rounded-full border-2 border-[#f7f5f0] flex items-center justify-center animate-bounce"
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Call to Action (Desktop) */}
            <button
              id="header-cta-order"
              onClick={onOrderClick}
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 bg-brand-primary text-white hover:bg-brand-dark text-sm font-semibold rounded-xl transition-all duration-200 shadow-md shadow-brand-primary/20 active:scale-95 cursor-pointer"
            >
              {t.orderBtn}
            </button>

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-white text-brand-dark border border-brand-primary/5 flex items-center justify-center shadow-sm cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden bg-[#f7f5f0] border-b border-brand-primary/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="block px-4 py-3 rounded-xl hover:bg-brand-primary/5 text-brand-dark font-medium transition-colors"
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-2 px-4">
                <button
                  id="mobile-drawer-cta"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOrderClick();
                  }}
                  className="w-full py-3 bg-brand-primary text-white text-center font-semibold rounded-xl shadow-md cursor-pointer"
                >
                  {t.orderBtn}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
