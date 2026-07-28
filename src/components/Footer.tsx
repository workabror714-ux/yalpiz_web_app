import { CalendarCheck, Clock, Facebook, Instagram, MapPin, Phone, Send, ShoppingBag } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data';
import { openTelegramBot } from '../config';

interface FooterProps {
  lang: Language;
  onNavClick: (href: string) => void;
  onOrderClick: () => void;
}

export default function Footer({ lang, onNavClick, onOrderClick }: FooterProps) {
  const t = TRANSLATIONS[lang];
  const isUz = lang === 'uz';
  const nav = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    onNavClick(href);
  };

  return (
    <footer className="bg-brand-dark text-white pt-16 pb-24 md:pb-12 border-t border-brand-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <img src="/logo_white.png" alt="Yalpiz restorani logosi" className="h-10 w-auto" />
            <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
              {isUz ? 'Shota Rustaveli ko‘chasi, 115-uydagi Yalpiz oilaviy restorani.' : 'Семейный ресторан Yalpiz по адресу: ул. Шота Руставели, 115.'}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://www.instagram.com/yalpiz_restaurant/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-brand-primary hover:text-brand-accent flex items-center justify-center"><Instagram className="w-5 h-5" /></a>
              <a href="https://www.facebook.com/yalpiz.uz" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-brand-primary hover:text-brand-accent flex items-center justify-center"><Facebook className="w-5 h-5" /></a>
              <button type="button" onClick={openTelegramBot} aria-label="Telegram bot" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-brand-primary hover:text-brand-accent flex items-center justify-center"><Send className="w-5 h-5" /></button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold">{isUz ? 'Tezkor havolalar' : 'Быстрые ссылки'}</h4>
            <nav className="flex flex-col gap-2.5 text-xs sm:text-sm text-white/80">
              <a href="#menu" onClick={(event) => nav(event, '#menu')} className="hover:text-brand-accent">{t.navMenu}</a>
              <a href="#booking" onClick={(event) => nav(event, '#booking')} className="hover:text-brand-accent">{t.navPromo}</a>
              <a href="#about" onClick={(event) => nav(event, '#about')} className="hover:text-brand-accent">{t.navAbout}</a>
              <a href="#branches" onClick={(event) => nav(event, '#branches')} className="hover:text-brand-accent">{t.navBranches}</a>
              <a href="#delivery" onClick={(event) => nav(event, '#delivery')} className="hover:text-brand-accent">{isUz ? 'Buyurtma va yetkazib berish' : 'Заказ и доставка'}</a>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold">{t.navContact}</h4>
            <div className="space-y-3 text-xs sm:text-sm text-white/80">
              <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-brand-accent" /><span>{isUz ? 'Har kuni 10:00–00:00' : 'Ежедневно 10:00–00:00'}</span></div>
              <a href="tel:+998951939898" className="flex items-center gap-3 hover:text-brand-accent"><Phone className="w-5 h-5 text-brand-accent" /><span>+998 95 193 98 98</span></a>
              <a href="https://maps.app.goo.gl/gqtPmmVPRRTcLWCv9" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:text-brand-accent"><MapPin className="w-5 h-5 text-brand-accent mt-0.5" /><span>{isUz ? 'Toshkent sh., Shota Rustaveli ko‘chasi, 115-uy' : 'г. Ташкент, ул. Шота Руставели, 115'}</span></a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold">{isUz ? 'Bron va buyurtma' : 'Бронь и заказ'}</h4>
            <button type="button" onClick={() => onNavClick('#booking')} className="w-full bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/10 text-left">
              <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg bg-brand-accent/15 flex items-center justify-center text-brand-accent"><CalendarCheck className="w-5 h-5" /></div><div className="text-xs"><span className="font-bold block">{isUz ? 'Joy band qilish' : 'Забронировать стол'}</span><span className="text-white/65">{isUz ? 'Saytdagi forma orqali' : 'Через форму на сайте'}</span></div></div>
            </button>
            <button type="button" onClick={onOrderClick} className="w-full bg-brand-primary hover:bg-[#1a5c30] p-4 rounded-2xl border border-brand-accent/20 text-left">
              <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-brand-accent"><ShoppingBag className="w-5 h-5" /></div><div className="text-xs"><span className="font-bold block text-brand-accent">{isUz ? 'Saytdan buyurtma' : 'Заказ на сайте'}</span><span className="text-white/80">{isUz ? 'Savatni ochish' : 'Открыть корзину'}</span></div></div>
            </button>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <span>&copy; {new Date().getFullYear()} YALPIZ. {t.footerRights}</span>
          <span>{isUz ? 'Naqd buyurtma Telegram tasdig‘idan keyin kassaga tushadi.' : 'Наличный заказ поступает на кассу после подтверждения в Telegram.'}</span>
        </div>
      </div>
    </footer>
  );
}
