import { Clock, MapPin, Phone, Car, Baby, DoorOpen, UtensilsCrossed } from 'lucide-react';
import { Language } from '../types';

interface SeoLocalSectionProps {
  lang: Language;
}

const DETAILS = {
  address: 'Toshkent sh., Shota Rustaveli ko‘chasi, 115-uy',
  phone: '+998 95 193 98 98',
  phoneRaw: '+998951939898',
  googleMaps: 'https://maps.app.goo.gl/gqtPmmVPRRTcLWCv9',
};

export default function SeoLocalSection({ lang }: SeoLocalSectionProps) {
  const isUz = lang === 'uz';

  const faq = isUz
    ? [
        {
          question: 'Yalpiz restorani qayerda joylashgan?',
          answer: 'Yalpiz Toshkent shahri, Yakkasaroy tumani, Shota Rustaveli ko‘chasi 115-uyda joylashgan.',
        },
        {
          question: 'Yalpiz restorani soat nechagacha ishlaydi?',
          answer: 'Restoran har kuni soat 10:00 dan 00:00 gacha ishlaydi.',
        },
        {
          question: 'Yetkazib berish va olib ketish xizmati bormi?',
          answer: 'Ha. Sayt orqali yetkazib berish yoki restorandan olib ketish uchun buyurtma berish mumkin.',
        },
        {
          question: 'Stol yoki tadbir uchun joy bron qilish mumkinmi?',
          answer: 'Ha. Stol, banket, tug‘ilgan kun va boshqa tadbirlar uchun oldindan joy bron qilish mumkin.',
        },
        {
          question: 'Yalpizdagi o‘rtacha chek qancha?',
          answer: 'Bir mehmon uchun o‘rtacha chek taxminan 100 000 so‘m.',
        },
      ]
    : [
        {
          question: 'Где находится ресторан Yalpiz?',
          answer: 'Yalpiz находится в Ташкенте, Яккасарайском районе, по адресу: улица Шота Руставели, 115.',
        },
        {
          question: 'До скольких работает ресторан Yalpiz?',
          answer: 'Ресторан работает ежедневно с 10:00 до 00:00.',
        },
        {
          question: 'Есть ли доставка и самовывоз?',
          answer: 'Да. На сайте можно оформить доставку или заказать блюда навынос.',
        },
        {
          question: 'Можно ли забронировать стол или банкет?',
          answer: 'Да. Можно заранее забронировать стол, банкет, день рождения или другое мероприятие.',
        },
        {
          question: 'Какой средний чек в Yalpiz?',
          answer: 'Средний чек на одного гостя составляет примерно 100 000 сумов.',
        },
      ];

  return (
    <section id="restaurant-info" className="py-16 sm:py-20 bg-white border-t border-brand-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/5 rounded-full text-brand-primary font-bold text-xs uppercase tracking-widest">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>{isUz ? 'Toshkentdagi Yalpiz restorani' : 'Ресторан Yalpiz в Ташкенте'}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark">
            {isUz
              ? 'Yalpiz — Shota Rustaveli 115 dagi oilaviy restoran'
              : 'Yalpiz — семейный ресторан на Шота Руставели, 115'}
          </h2>
          <p className="font-sans text-brand-muted text-sm sm:text-base leading-relaxed">
            {isUz
              ? 'Yalpiz — Toshkentdagi oilaviy restoran. Menyuda o‘zbek milliy va turk taomlari, go‘shtli taomlar, salatlar, sho‘rvalar va ichimliklar mavjud. Sayt orqali yetkazib berish yoki olib ketish uchun buyurtma berishingiz, stol va tadbirlar uchun joy bron qilishingiz mumkin.'
              : 'Yalpiz — семейный ресторан в Ташкенте. В меню представлены блюда узбекской и турецкой кухни, мясные блюда, салаты, супы и напитки. На сайте можно оформить доставку или самовывоз, а также забронировать стол или мероприятие.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <a
            href={DETAILS.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-brand-primary/10 bg-brand-neutral/40 p-5 hover:border-brand-primary/30 transition-colors"
          >
            <MapPin className="w-6 h-6 text-brand-primary mb-3" />
            <h3 className="font-bold text-brand-dark text-sm mb-1">{isUz ? 'Manzil' : 'Адрес'}</h3>
            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">{DETAILS.address}</p>
          </a>

          <div className="rounded-2xl border border-brand-primary/10 bg-brand-neutral/40 p-5">
            <Clock className="w-6 h-6 text-brand-primary mb-3" />
            <h3 className="font-bold text-brand-dark text-sm mb-1">{isUz ? 'Ish vaqti' : 'Время работы'}</h3>
            <p className="text-xs sm:text-sm text-brand-muted">{isUz ? 'Har kuni 10:00–00:00' : 'Ежедневно 10:00–00:00'}</p>
          </div>

          <a
            href={`tel:${DETAILS.phoneRaw}`}
            className="rounded-2xl border border-brand-primary/10 bg-brand-neutral/40 p-5 hover:border-brand-primary/30 transition-colors"
          >
            <Phone className="w-6 h-6 text-brand-primary mb-3" />
            <h3 className="font-bold text-brand-dark text-sm mb-1">{isUz ? 'Telefon' : 'Телефон'}</h3>
            <p className="text-xs sm:text-sm text-brand-muted">{DETAILS.phone}</p>
          </a>

          <div className="rounded-2xl border border-brand-primary/10 bg-brand-neutral/40 p-5">
            <div className="flex items-center gap-2 text-brand-primary mb-3">
              <Car className="w-5 h-5" />
              <Baby className="w-5 h-5" />
              <DoorOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-brand-dark text-sm mb-1">{isUz ? 'Qulayliklar' : 'Удобства'}</h3>
            <p className="text-xs sm:text-sm text-brand-muted">
              {isUz ? 'Avtoturargoh, bolalar xonasi va VIP xona' : 'Парковка, детская комната и VIP-зал'}
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-dark text-center mb-6">
            {isUz ? 'Ko‘p so‘raladigan savollar' : 'Частые вопросы'}
          </h2>
          <div className="space-y-3">
            {faq.map((item) => (
              <details key={item.question} className="group rounded-2xl border border-brand-primary/10 bg-brand-neutral/30 p-5">
                <summary className="cursor-pointer list-none font-bold text-sm sm:text-base text-brand-dark flex items-center justify-between gap-3">
                  {item.question}
                  <span className="text-brand-primary text-xl leading-none group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-brand-muted leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
