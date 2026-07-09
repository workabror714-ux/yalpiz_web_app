import { Leaf } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data';

interface MarqueeProps {
  lang: Language;
}

export default function Marquee({ lang }: MarqueeProps) {
  const t = TRANSLATIONS[lang];

  const items = [
    t.marqueeFreeDelivery,
    t.marqueeFreshDishes,
    t.marqueeHotAndFresh,
    t.marqueeTgOrder,
    t.marqueeTradition,
  ];

  // Repeat items to fill space and guarantee seamless looping
  const duplicatedItems = [...items, ...items, ...items, ...items];

  return (
    <div className="bg-brand-primary py-4 overflow-hidden border-y-2 border-brand-accent/25 select-none shadow-sm w-full min-w-0">
      <div className="relative w-full flex items-center overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
          {duplicatedItems.map((item, index) => (
            <div key={index} className="inline-flex items-center gap-3">
              <span className="text-white font-sans text-sm sm:text-base font-semibold uppercase tracking-wider">
                {item}
              </span>
              <Leaf className="w-4 h-4 text-brand-accent fill-current" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
