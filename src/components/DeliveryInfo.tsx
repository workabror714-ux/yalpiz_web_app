import { Bike, CheckCircle2, MapPin, ShieldCheck, ShoppingBag } from 'lucide-react';
import { Language } from '../types';

interface DeliveryInfoProps {
  lang: Language;
  onOrderClick: () => void;
}

export default function DeliveryInfo({ lang, onOrderClick }: DeliveryInfoProps) {
  const isUz = lang === 'uz';
  const steps = [
    {
      icon: ShoppingBag,
      titleUz: 'Menyudan tanlang',
      titleRu: 'Выберите блюда',
      textUz: 'Taomlarni savatga qo‘shing va miqdorini belgilang.',
      textRu: 'Добавьте блюда в корзину и укажите количество.',
    },
    {
      icon: MapPin,
      titleUz: 'Usulni tanlang',
      titleRu: 'Выберите способ',
      textUz: 'Yetkazib berish yoki olib ketishni tanlang.',
      textRu: 'Выберите доставку или самовывоз.',
    },
    {
      icon: ShieldCheck,
      titleUz: 'Xavfsiz tasdiqlang',
      titleRu: 'Безопасно подтвердите',
      textUz: 'Naqd buyurtma Telegramda tasdiqlangandan keyin kassaga tushadi.',
      textRu: 'Заказ за наличные попадёт на кассу после подтверждения в Telegram.',
    },
  ];

  return (
    <section id="delivery" className="py-16 bg-brand-neutral/50 border-y border-brand-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/5 rounded-full text-brand-primary font-bold text-xs uppercase tracking-widest">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isUz ? 'Sayt orqali buyurtma' : 'Заказ через сайт'}</span>
            </div>
            <div className="space-y-3">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark">
                {isUz ? 'Taomlarni saytdan buyurtma bering' : 'Заказывайте блюда на сайте'}
              </h2>
              <p className="font-sans text-brand-muted text-sm sm:text-base leading-relaxed max-w-2xl">
                {isUz
                  ? 'Menyu, savat, yetkazib berish va olib ketish xizmatlari shu saytning o‘zida ishlaydi. Soxta buyurtmalardan himoya uchun naqd buyurtma Telegram orqali tasdiqlanadi.'
                  : 'Меню, корзина, доставка и самовывоз доступны прямо на сайте. Для защиты от ложных заказов наличный заказ подтверждается через Telegram.'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {steps.map((step) => (
                <div key={step.titleUz} className="bg-white rounded-2xl border border-brand-primary/5 p-4 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-3"><step.icon className="w-5 h-5" /></div>
                  <h3 className="font-bold text-brand-dark text-sm">{isUz ? step.titleUz : step.titleRu}</h3>
                  <p className="text-brand-muted text-xs leading-relaxed mt-1">{isUz ? step.textUz : step.textRu}</p>
                </div>
              ))}
            </div>
            <button type="button" onClick={onOrderClick} className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-primary hover:bg-brand-dark text-white font-bold rounded-2xl transition-colors shadow-md">
              <ShoppingBag className="w-5 h-5" />
              {isUz ? 'Buyurtma berish' : 'Оформить заказ'}
            </button>
          </div>

          <div className="bg-brand-dark text-white rounded-[28px] p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-brand-accent/10 rounded-full blur-2xl" />
            <div className="relative space-y-6">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">{isUz ? 'Yetkazib berish va olib ketish' : 'Доставка и самовывоз'}</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 text-brand-accent flex items-center justify-center flex-shrink-0"><Bike className="w-5 h-5" /></div>
                  <div><h4 className="font-bold text-sm">{isUz ? 'Yetkazib berish' : 'Доставка'}</h4><p className="text-white/70 text-xs mt-1 leading-relaxed">{isUz ? 'Manzil va geolokatsiyani kiriting. Yetkazib berishda Click yoki Payme orqali online to‘lov qilinadi.' : 'Укажите адрес и геолокацию. Для доставки оплата производится онлайн через Click или Payme.'}</p></div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 text-brand-accent flex items-center justify-center flex-shrink-0"><MapPin className="w-5 h-5" /></div>
                  <div><h4 className="font-bold text-sm">{isUz ? 'Olib ketish' : 'Самовывоз'}</h4><p className="text-white/70 text-xs mt-1 leading-relaxed">{isUz ? 'Buyurtmani Shota Rustaveli 115 dagi Yalpiz restoranidan olib ketishingiz mumkin. Naqd buyurtma Telegram orqali tasdiqlanadi.' : 'Заказ можно забрать в ресторане Yalpiz на Шота Руставели, 115. Наличный заказ подтверждается через Telegram.'}</p></div>
                </div>
              </div>
              <div className="pt-5 border-t border-white/10 text-xs text-white/60 flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-brand-accent flex-shrink-0" />{isUz ? 'Tasdiqlangan buyurtma avtomatik Delever va Neon Alisa kassasiga tushadi.' : 'Подтверждённый заказ автоматически поступает в Delever и кассу Neon Alisa.'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
