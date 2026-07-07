import { BookOpen, ShoppingBag, ClipboardList, User } from 'lucide-react';
import { Language } from '../types';

interface BottomNavProps {
  lang: Language;
  cartCount: number;
  onCartToggle: () => void;
  onTabClick: (tab: 'menu' | 'cart' | 'orders' | 'profile') => void;
  activeTab: 'menu' | 'cart' | 'orders' | 'profile' | null;
}

export default function BottomNav({
  lang,
  cartCount,
  onCartToggle,
  onTabClick,
  activeTab,
}: BottomNavProps) {
  const isUz = lang === 'uz';

  const tabs = [
    {
      id: 'menu' as const,
      label: isUz ? 'Menyu' : 'Меню',
      icon: BookOpen,
      action: () => {
        onTabClick('menu');
        const element = document.querySelector('#menu');
        if (element) {
          const offset = 80;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      },
    },
    {
      id: 'cart' as const,
      label: isUz ? 'Savat' : 'Корзина',
      icon: ShoppingBag,
      action: () => {
        onTabClick('cart');
        onCartToggle();
      },
      hasBadge: true,
    },
    {
      id: 'orders' as const,
      label: isUz ? 'Tarix' : 'Заказы',
      icon: ClipboardList,
      action: () => onTabClick('orders'),
    },
    {
      id: 'profile' as const,
      label: isUz ? 'Profil' : 'Профиль',
      icon: User,
      action: () => onTabClick('profile'),
    },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#f7f5f0]/95 backdrop-blur-md border-t border-brand-primary/10 py-2 pb-safe shadow-lg flex items-center justify-around"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`bottom-nav-${tab.id}`}
            onClick={tab.action}
            className={`flex flex-col items-center justify-center py-1 px-3 text-[10px] sm:text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer relative ${
              isActive
                ? 'text-brand-primary font-bold scale-[1.05]'
                : 'text-brand-dark/60 hover:text-brand-primary'
            }`}
          >
            {/* Tab icon wrapper */}
            <div className={`p-1.5 rounded-xl ${isActive ? 'bg-brand-primary/5 text-brand-primary' : 'text-current'}`}>
              <Icon className="w-5 h-5" />
            </div>

            {/* Label */}
            <span className="mt-0.5 leading-none">{tab.label}</span>

            {/* Badge for cart count */}
            {tab.hasBadge && cartCount > 0 && (
              <span className="absolute top-0 right-3.5 bg-brand-accent text-brand-dark text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
