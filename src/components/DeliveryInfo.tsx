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
      titleUz: 'Manzilni kiriting',
      titleRu: 'Укажите адрес',
      textUz: 'Yetkazib berish manzili va geolokatsiyangizni belgilang.',
      textRu: 'Укажите адрес доставки и свою геолокацию.',
    },
    {
      icon: ShieldCheck,
      titleUz: 'Onlayn to‘lang',
      titleRu: 'Оплатите онлайн',
      textUz: 'Taomlar uchun Click yoki Payme orqali xavfsiz to‘lov qiling.',
      textRu: 'Безопасно оплатите блюда через Click или Payme.',
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
                {isUz ? 'Taomlarni saytdan yetkazib berishga buyurtma bering' : 'Закажите доставку блюд на сайте'}
              </h2>
              <p className="font-sans text-brand-muted text-sm sm:text-base leading-relaxed max-w-2xl">
                {isUz
                  ? 'Sayt orqali faqat yetkazib berish buyurtmasi qabul qilinadi. Taomlar uchun Click yoki Payme orqali oldindan onlayn to‘lov qilinadi.'
                  : 'На сайте принимаются только заказы на доставку. Блюда оплачиваются заранее онлайн через Click или Payme.'}
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
              {isUz ? 'Yetkazib berishga buyurtma berish' : 'Заказать доставку'}
            </button>
          </div>

          <div className="bg-brand-dark text-white rounded-[28px] p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-brand-accent/10 rounded-full blur-2xl" />
            <div className="relative space-y-6">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">{isUz ? 'Onlayn to‘lovli yetkazib berish' : 'Доставка с онлайн-оплатой'}</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 text-brand-accent flex items-center justify-center flex-shrink-0"><Bike className="w-5 h-5" /></div>
                  <div><h4 className="font-bold text-sm">{isUz ? 'Yetkazib berish' : 'Доставка'}</h4><p className="text-white/70 text-xs mt-1 leading-relaxed">{isUz ? 'Manzil va geolokatsiyani kiriting. Taomlar uchun Click yoki Payme orqali onlayn to‘lov qilinadi.' : 'Укажите адрес и геолокацию. Блюда оплачиваются онлайн через Click или Payme.'}</p></div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 text-brand-accent flex items-center justify-center flex-shrink-0"><MapPin className="w-5 h-5" /></div>
                  <div><h4 className="font-bold text-sm">{isUz ? 'Taxi narxi' : 'Стоимость такси'}</h4><p className="text-white/70 text-xs mt-1 leading-relaxed">{isUz ? 'Taxi narxi Millenium tizimidan aniq hisoblanadi va haydovchiga alohida naqd to‘lanadi.' : 'Стоимость такси точно рассчитывается системой Millenium и оплачивается водителю отдельно наличными.'}</p></div>
                </div>
              </div>
              <div className="pt-5 border-t border-white/10 text-xs text-white/60 flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-brand-accent flex-shrink-0" />{isUz ? 'Onlayn to‘lov tasdiqlangach buyurtma Delever va Neon Alisa kassasiga yuboriladi.' : 'После подтверждения онлайн-оплаты заказ отправляется в Delever и кассу Neon Alisa.'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
