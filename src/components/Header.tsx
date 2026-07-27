import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CalendarCheck, Menu, Send, X } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  onBookingClick: () => void;
  onBotOrder: () => void;
}

export default function Header({ lang, setLang, onBookingClick, onBotOrder }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[lang];
  const isUz = lang === 'uz';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  const navItems = [
    { name: t.navMenu, href: '#menu' },
    { name: t.navPromo, href: '#booking' },
    { name: t.navAbout, href: '#about' },
    { name: t.navBranches, href: '#branches' },
    { name: isUz ? 'Buyurtma' : 'Заказать', href: '#delivery' },
  ];

  const scrollToSection = (href: string) => {
    const targetId = href.replace(/^#/, '');
    const element = document.getElementById(targetId);
    if (!element) return;

    const headerHeight = document.getElementById('main-header')?.offsetHeight ?? 80;
    const targetTop = window.scrollY + element.getBoundingClientRect().top - headerHeight - 12;
    window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
    window.history.replaceState(null, '', href);
  };

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    setMobileMenuOpen(false);
    window.setTimeout(() => scrollToSection(href), mobileMenuOpen ? 250 : 0);
  };

  const handleBooking = () => {
    setMobileMenuOpen(false);
    window.setTimeout(onBookingClick, mobileMenuOpen ? 250 : 0);
  };

  const handleBotOrder = () => {
    setMobileMenuOpen(false);
    onBotOrder();
  };

  return (
    <header
      id="main-header"
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#f7f5f0]/95 backdrop-blur-md shadow-sm border-b border-[#1a5c30]/10 py-3'
          : 'bg-[#f7f5f0]/90 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <a
            href="#home"
            onClick={(event) => handleNavClick(event, '#home')}
            className="flex items-center gap-2 group"
            aria-label="Yalpiz bosh sahifa"
          >
            <img
              src="/logo_green.png"
              alt="Yalpiz"
              className="h-9 sm:h-11 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </a>

          <nav className="hidden lg:flex items-center gap-7" aria-label={isUz ? 'Asosiy menyu' : 'Главное меню'}>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(event) => handleNavClick(event, item.href)}
                className="font-sans text-sm font-medium text-brand-dark/80 hover:text-brand-primary transition-colors relative py-1 group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-accent transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center bg-white/70 border border-brand-primary/10 rounded-full p-0.5">
              <button
                type="button"
                onClick={() => setLang('uz')}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                  lang === 'uz' ? 'bg-brand-primary text-white shadow-sm' : 'text-brand-dark/70 hover:text-brand-primary'
                }`}
                aria-pressed={lang === 'uz'}
              >
                UZ
              </button>
              <button
                type="button"
                onClick={() => setLang('ru')}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                  lang === 'ru' ? 'bg-brand-primary text-white shadow-sm' : 'text-brand-dark/70 hover:text-brand-primary'
                }`}
                aria-pressed={lang === 'ru'}
              >
                RU
              </button>
            </div>

            <button
              type="button"
              onClick={handleBooking}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-primary/15 bg-white text-brand-primary text-sm font-bold hover:bg-brand-primary/5 transition-colors"
            >
              <CalendarCheck className="w-4 h-4" />
              {isUz ? 'Joy band qilish' : 'Бронирование'}
            </button>

            <button
              type="button"
              onClick={handleBotOrder}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-bold hover:bg-brand-dark transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
              {isUz ? 'Botda buyurtma' : 'Заказать в боте'}
            </button>

            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen((value) => !value)}
              className="lg:hidden w-10 h-10 rounded-xl bg-white text-brand-dark border border-brand-primary/10 flex items-center justify-center shadow-sm"
              aria-label={mobileMenuOpen ? (isUz ? 'Menyuni yopish' : 'Закрыть меню') : (isUz ? 'Menyuni ochish' : 'Открыть меню')}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-drawer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden bg-[#f7f5f0] border-b border-brand-primary/10 overflow-hidden"
          >
            <div className="px-4 pt-3 pb-5 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(event) => handleNavClick(event, item.href)}
                  className="block px-4 py-3 rounded-xl hover:bg-brand-primary/5 text-brand-dark font-medium transition-colors"
                >
                  {item.name}
                </a>
              ))}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleBooking}
                  className="w-full py-3 bg-white border border-brand-primary/15 text-brand-primary font-bold rounded-xl inline-flex items-center justify-center gap-2"
                >
                  <CalendarCheck className="w-4 h-4" />
                  {isUz ? 'Joy band qilish' : 'Бронирование'}
                </button>
                <button
                  type="button"
                  onClick={handleBotOrder}
                  className="w-full py-3 bg-brand-primary text-white font-bold rounded-xl shadow-md inline-flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {isUz ? 'Botda buyurtma' : 'Заказать в боте'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
