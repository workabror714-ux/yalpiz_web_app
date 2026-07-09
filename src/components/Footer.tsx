import React from 'react';
import { Phone, MapPin, Clock, Instagram, Facebook, Send } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data';

interface FooterProps {
  lang: Language;
  onNavClick: (href: string) => void;
}

export default function Footer({ lang, onNavClick }: FooterProps) {
  const t = TRANSLATIONS[lang];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onNavClick(href);
  };

  return (
    <footer className="bg-brand-dark text-white pt-16 pb-24 md:pb-12 border-t border-brand-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/logo_white.png" alt="YALPIZ" className="h-10 w-auto" />
            </div>
            <p className="font-sans text-white/70 text-xs sm:text-sm leading-relaxed">
              {t.footerSlogan}
            </p>
            {/* Socials */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-accent block">
                {t.footerSocials}
              </span>
              <div className="flex items-center gap-3">
                <a
                  id="social-instagram"
                  href="https://www.instagram.com/yalpiz_restaurant/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-brand-primary hover:text-brand-accent text-white flex items-center justify-center transition-all duration-200"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  id="social-facebook"
                  href="https://www.facebook.com/yalpiz.uz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-brand-primary hover:text-brand-accent text-white flex items-center justify-center transition-all duration-200"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  id="social-telegram"
                  href="https://t.me/restoran_buyurtma_bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-brand-primary hover:text-brand-accent text-white flex items-center justify-center transition-all duration-200"
                  aria-label="Telegram"
                >
                  <Send className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-white tracking-tight">
              {lang === 'uz' ? 'Tezkor havolalar' : 'Быстрые ссылки'}
            </h4>
            <nav className="flex flex-col gap-2.5 font-sans text-xs sm:text-sm text-white/80">
              <a href="#menu" onClick={(e) => handleLinkClick(e, '#menu')} className="hover:text-brand-accent transition-colors">
                {t.navMenu}
              </a>
              <a href="#promos" onClick={(e) => handleLinkClick(e, '#promos')} className="hover:text-brand-accent transition-colors">
                {t.navPromo}
              </a>
              <a href="#about" onClick={(e) => handleLinkClick(e, '#about')} className="hover:text-brand-accent transition-colors">
                {t.navAbout}
              </a>
              <a href="#branches" onClick={(e) => handleLinkClick(e, '#branches')} className="hover:text-brand-accent transition-colors">
                {t.navBranches}
              </a>
              <a href="#delivery" onClick={(e) => handleLinkClick(e, '#delivery')} className="hover:text-brand-accent transition-colors">
                {t.navContact}
              </a>
            </nav>
          </div>

          {/* Column 3: Contact & Hours */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-white tracking-tight">
              {t.navContact}
            </h4>
            <div className="space-y-3 font-sans text-xs sm:text-sm text-white/80">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-brand-accent flex-shrink-0" />
                <span>{lang === 'uz' ? 'Har kuni 10:00 - 00:00' : 'Ежедневно 10:00 - 00:00'}</span>
              </div>
              <a href="tel:+998333350011" className="flex items-center gap-3 hover:text-brand-accent transition-colors">
                <Phone className="w-5 h-5 text-brand-accent flex-shrink-0" />
                <span>+998 33 335 00 11</span>
              </a>
              <a href="tel:+998951939898" className="flex items-center gap-3 hover:text-brand-accent transition-colors">
                <Phone className="w-5 h-5 text-brand-accent flex-shrink-0" />
                <span>+998 95 193 98 98</span>
              </a>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" />
                <span>{lang === 'uz' ? 'Mirobod ko‘chasi 5 · Shota Rustaveli 115' : 'ул. Миробод 5 · ул. Шота Руставели 115'}</span>
              </div>
            </div>
          </div>

          {/* Column 4: Mobile App & Telegram Bot */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-white tracking-tight">
              {lang === 'uz' ? 'Qulay buyurtmalar' : 'Удобные заказы'}
            </h4>
            
            {/* Telegram Bot Card */}
            <a
              id="footer-tg-bot-link"
              href="https://t.me/restoran_buyurtma_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-brand-primary hover:bg-[#1a5c30] p-4 rounded-2xl border border-brand-accent/20 hover:border-brand-accent/40 shadow-sm transition-all text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-brand-accent">
                  <Send className="w-4.5 h-4.5 fill-current" />
                </div>
                <div className="text-xs">
                  <span className="font-bold block text-brand-accent">@restoran_buyurtma_bot</span>
                  <span className="text-white/80">{t.footerBot}</span>
                </div>
              </div>
            </a>

            {/* App stores preview labels */}
            <div className="space-y-2 pt-1 text-white/60">
              <span className="text-[10px] uppercase font-bold tracking-wider block">
                {t.footerApp}
              </span>
              <div className="flex gap-2.5">
                {/* Google Play Graphic Card */}
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center justify-center text-center">
                  <span className="font-sans font-semibold text-[10px] tracking-wide text-white/80">Google Play</span>
                </div>
                {/* App Store Graphic Card */}
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center justify-center text-center">
                  <span className="font-sans font-semibold text-[10px] tracking-wide text-white/80">App Store</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom footer bar */}
        <div className="mt-12 pt-8 border-t border-white/5 text-center flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs text-white/60">
          <span>
            &copy; {new Date().getFullYear()} YALPIZ. {t.footerRights}
          </span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-brand-accent transition-colors">
              {lang === 'uz' ? 'Foydalanish shartlari' : 'Условия использования'}
            </a>
            <a href="#" className="hover:text-brand-accent transition-colors">
              {lang === 'uz' ? 'Maxfiylik siyosati' : 'Политика конфиденциальности'}
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
