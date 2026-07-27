import { CalendarCheck, Home, Send, UtensilsCrossed } from 'lucide-react';
import { Language } from '../types';

interface BottomNavProps {
  lang: Language;
  onNavigate: (href: string) => void;
  onBotOrder: () => void;
}

export default function BottomNav({ lang, onNavigate, onBotOrder }: BottomNavProps) {
  const isUz = lang === 'uz';

  const items = [
    {
      id: 'home',
      label: isUz ? 'Bosh sahifa' : 'Главная',
      icon: Home,
      action: () => onNavigate('#home'),
    },
    {
      id: 'menu',
      label: isUz ? 'Menyu' : 'Меню',
      icon: UtensilsCrossed,
      action: () => onNavigate('#menu'),
    },
    {
      id: 'booking',
      label: isUz ? 'Bron' : 'Бронь',
      icon: CalendarCheck,
      action: () => onNavigate('#booking'),
    },
    {
      id: 'bot',
      label: isUz ? 'Buyurtma' : 'Заказать',
      icon: Send,
      action: onBotOrder,
    },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#f7f5f0]/95 backdrop-blur-md border-t border-brand-primary/10 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-lg flex items-center justify-around"
      aria-label={isUz ? 'Mobil navigatsiya' : 'Мобильная навигация'}
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={item.action}
            className="flex flex-col items-center justify-center py-1 px-2 text-[10px] sm:text-xs font-semibold rounded-xl transition-colors text-brand-dark/65 hover:text-brand-primary min-w-[64px]"
          >
            <div className="p-1.5 rounded-xl text-current">
              <Icon className="w-5 h-5" />
            </div>
            <span className="mt-0.5 leading-none">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
