import { useState, useEffect, useRef } from 'react';
import { User, ClipboardList, ChevronRight, Settings } from 'lucide-react';
import { Language } from '../types';
import { fetchMyOrders, MyOrder } from '../api';

interface ProfileMenuProps {
  lang: Language;
  onOpenOrders: () => void;
  onOpenProfile: () => void;
}

const STATUS_LABEL: Record<MyOrder['status'], { uz: string; ru: string; dot: string }> = {
  new:       { uz: 'Qabul qilindi', ru: 'Принят',     dot: 'bg-amber-500' },
  preparing: { uz: 'Tayyorlanmoqda', ru: 'Готовится', dot: 'bg-amber-500' },
  on_way:    { uz: "Yo'lda",         ru: 'В пути',     dot: 'bg-blue-500' },
  delivered: { uz: 'Yetkazildi',     ru: 'Доставлено', dot: 'bg-emerald-500' },
  cancelled: { uz: 'Bekor qilindi',  ru: 'Отменён',    dot: 'bg-red-500' },
};

export default function ProfileMenu({ lang, onOpenOrders, onOpenProfile }: ProfileMenuProps) {
  const isUz = lang === 'uz';
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState<MyOrder[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const active = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled');
  const name = localStorage.getItem('yalpiz_user_name') || (isUz ? 'Mehmon' : 'Гость');
  const phone = localStorage.getItem('yalpiz_user_phone') || '';

  // Ochilganda faol buyurtmalarni yuklash
  useEffect(() => {
    if (!open || !phone) return;
    fetchMyOrders(phone).then(setOrders);
  }, [open, phone]);

  // Tashqariga bosilsa yopish
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        id="header-profile-btn"
        onClick={() => setOpen((v) => !v)}
        className="relative w-10 h-10 rounded-xl bg-white hover:bg-brand-primary hover:text-white transition-all duration-200 shadow-sm border border-brand-primary/5 flex items-center justify-center text-brand-dark cursor-pointer group"
        aria-label={isUz ? 'Profil' : 'Профиль'}
      >
        <User className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
        {active.length > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 bg-brand-accent text-brand-dark text-[10px] font-bold rounded-full border-2 border-[#f7f5f0] flex items-center justify-center">
            {active.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-brand-primary/10 overflow-hidden z-50 animate-[fadeIn_0.15s_ease-out]">
          {/* Profil boshi */}
          <div className="p-4 bg-brand-primary/5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-brand-primary flex items-center justify-center text-white flex-shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-brand-dark text-sm truncate">{name}</p>
              <p className="text-brand-muted text-xs truncate">{phone || (isUz ? 'Telefon kiritilmagan' : 'Телефон не указан')}</p>
            </div>
          </div>

          {/* Faol buyurtmalar */}
          {active.length > 0 && (
            <div className="p-3 border-b border-brand-primary/5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-muted px-1 mb-2">
                {isUz ? 'Faol buyurtmalar' : 'Активные заказы'}
              </p>
              <div className="space-y-1.5">
                {active.slice(0, 3).map((o) => {
                  const s = STATUS_LABEL[o.status];
                  return (
                    <button
                      key={o.id}
                      onClick={() => { setOpen(false); onOpenOrders(); }}
                      className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-brand-primary/5 transition-colors text-left cursor-pointer"
                    >
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot} ${o.status !== 'on_way' ? 'animate-pulse' : ''}`} />
                      <div className="min-w-0 flex-grow">
                        <p className="text-xs font-semibold text-brand-dark truncate">#{o.id}</p>
                        <p className="text-[11px] text-brand-muted">{isUz ? s.uz : s.ru}</p>
                      </div>
                      <span className="text-xs font-bold text-brand-dark whitespace-nowrap">{o.total.toLocaleString('uz-UZ')}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Havolalar */}
          <div className="p-2">
            <button
              onClick={() => { setOpen(false); onOpenOrders(); }}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-brand-primary/5 transition-colors text-brand-dark cursor-pointer"
            >
              <ClipboardList className="w-4 h-4 text-brand-primary" />
              <span className="text-sm font-medium flex-grow text-left">{isUz ? 'Mening buyurtmalarim' : 'Мои заказы'}</span>
              <ChevronRight className="w-4 h-4 text-brand-muted" />
            </button>
            <button
              onClick={() => { setOpen(false); onOpenProfile(); }}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-brand-primary/5 transition-colors text-brand-dark cursor-pointer"
            >
              <Settings className="w-4 h-4 text-brand-primary" />
              <span className="text-sm font-medium flex-grow text-left">{isUz ? 'Profil sozlamalari' : 'Настройки профиля'}</span>
              <ChevronRight className="w-4 h-4 text-brand-muted" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
