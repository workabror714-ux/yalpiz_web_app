import { Bike, Bot, CheckCircle2, MapPin, Send, ShoppingBag } from 'lucide-react';
import { Language } from '../types';

interface DeliveryInfoProps {
  lang: Language;
  onBotOrder: () => void;
}

export default function DeliveryInfo({ lang, onBotOrder }: DeliveryInfoProps) {
  const isUz = lang === 'uz';

  const steps = [
    {
      icon: Bot,
      titleUz: 'Telegram botni oching',
      titleRu: 'Откройте Telegram-бот',
      textUz: 'Menyu va mavjud taomlar botda ko‘rsatiladi.',
      textRu: 'Меню и доступные блюда отображаются в боте.',
    },
    {
      icon: ShoppingBag,
      titleUz: 'Buyurtmani yig‘ing',
      titleRu: 'Соберите заказ',
      textUz: 'Yetkazib berish yoki olib ketishni tanlang.',
      textRu: 'Выберите доставку или самовывоз.',
    },
    {
      icon: CheckCircle2,
      titleUz: 'Tasdiqlang',
      titleRu: 'Подтвердите',
      textUz: 'Botdagi ko‘rsatmalar orqali buyurtmani yakunlang.',
      textRu: 'Завершите заказ по подсказкам в боте.',
    },
  ];

  return (
    <section id="delivery" className="py-16 bg-brand-neutral/50 border-y border-brand-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/5 rounded-full text-brand-primary font-bold text-xs uppercase tracking-widest">
              <Send className="w-3.5 h-3.5" />
              <span>{isUz ? 'Buyurtma Telegram botda' : 'Заказ в Telegram-боте'}</span>
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark">
                {isUz ? 'Taom buyurtmasi — bot orqali' : 'Заказ блюд — через бот'}
              </h2>
              <p className="font-sans text-brand-muted text-sm sm:text-base leading-relaxed max-w-2xl">
                {isUz
                  ? 'Saytimiz restoran haqida ma’lumot, menyu ko‘rish va joy band qilish uchun xizmat qiladi. Taom buyurtmalari esa xavfsiz va qulay tarzda Telegram botimiz orqali qabul qilinadi.'
                  : 'На сайте можно посмотреть информацию о ресторане, меню и забронировать стол. Заказы на блюда принимаются через наш Telegram-бот.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {steps.map((step) => (
                <div key={step.titleUz} className="bg-white rounded-2xl border border-brand-primary/5 p-4 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-3">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-brand-dark text-sm">{isUz ? step.titleUz : step.titleRu}</h3>
                  <p className="text-brand-muted text-xs leading-relaxed mt-1">{isUz ? step.textUz : step.textRu}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={onBotOrder}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-primary hover:bg-brand-dark text-white font-bold rounded-2xl transition-colors shadow-md"
            >
              <Send className="w-5 h-5" />
              {isUz ? 'Telegram botda buyurtma berish' : 'Заказать в Telegram-боте'}
            </button>
          </div>

          <div className="bg-brand-dark text-white rounded-[28px] p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-brand-accent/10 rounded-full blur-2xl" />
            <div className="relative space-y-6">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                {isUz ? 'Yetkazib berish va olib ketish' : 'Доставка и самовывоз'}
              </h3>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 text-brand-accent flex items-center justify-center flex-shrink-0">
                    <Bike className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{isUz ? 'Yetkazib berish' : 'Доставка'}</h4>
                    <p className="text-white/70 text-xs mt-1 leading-relaxed">
                      {isUz
                        ? 'Manzil va yetkazib berish tafsilotlari buyurtma vaqtida botda kiritiladi.'
                        : 'Адрес и детали доставки указываются в боте при оформлении заказа.'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 text-brand-accent flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{isUz ? 'Olib ketish' : 'Самовывоз'}</h4>
                    <p className="text-white/70 text-xs mt-1 leading-relaxed">
                      {isUz
                        ? 'Buyurtmani Shota Rustaveli ko‘chasi, 115-uydagi Yalpiz restoranidan olib ketishingiz mumkin.'
                        : 'Заказ можно забрать в ресторане Yalpiz по адресу: ул. Шота Руставели, 115.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-5 border-t border-white/10 text-xs text-white/60">
                {isUz
                  ? 'Buyurtma narxi, mavjud to‘lov usuli va yetkazib berish shartlari botda yakuniy tasdiqlashdan oldin ko‘rsatiladi.'
                  : 'Стоимость заказа, доступный способ оплаты и условия доставки показываются в боте до подтверждения.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
