import { motion } from 'motion/react';
import { Clock, Flame, Minus, Plus } from 'lucide-react';
import { Language, MenuItem } from '../types';
import { TRANSLATIONS } from '../data';
import { imgFallback, thumb } from '../img';

interface ProductCardProps {
  item: MenuItem;
  lang: Language;
  quantityInCart: number;
  onAddToCart: () => void;
  onUpdateQuantity: (quantity: number) => void;
  onSelect: () => void;
}

export default function ProductCard({
  item,
  lang,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
  onSelect,
}: ProductCardProps) {
  const t = TRANSLATIONS[lang];
  const isUz = lang === 'uz';
  const name = isUz ? item.name_uz : item.name_ru;
  const desc = isUz ? item.desc_uz : item.desc_ru;
  const badge = isUz ? item.badge_uz : item.badge_ru;
  const prepTime = isUz ? item.prepTime_uz : item.prepTime_ru;
  const formatPrice = (value: number) => `${value.toLocaleString('uz-UZ')} ${t.currency}`;

  const openDetails = () => {
    if (item.available) onSelect();
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      className={`bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-brand-primary/5 transition-all duration-300 flex flex-col h-full group ${
        item.available ? 'hover:border-brand-primary/10 hover:shadow-xl hover:-translate-y-1' : 'opacity-80'
      }`}
    >
      <button
        type="button"
        onClick={openDetails}
        disabled={!item.available}
        className="relative aspect-4/3 overflow-hidden bg-brand-primary/5 w-full text-left disabled:cursor-default focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary/30"
        aria-label={item.available ? `${name} — ${formatPrice(item.price)}` : `${name} — ${t.outOfStock}`}
      >
        <img
          src={thumb(item.image, 450)}
          alt={name}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={(event) => event.currentTarget.classList.add('opacity-100')}
          onError={(event) => imgFallback(event, item.image)}
          className="w-full h-full object-cover opacity-0 transition duration-500 group-hover:scale-[1.04]"
        />
        {badge && <span className="absolute top-3 left-3 bg-brand-accent text-brand-dark text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">{badge}</span>}
        {item.isPopular && !badge && (
          <span className="absolute top-3 left-3 bg-brand-primary text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
            <Flame className="w-3 h-3 text-brand-accent fill-current" />{t.popularBadge}
          </span>
        )}
        {!item.available && (
          <div className="absolute inset-0 bg-brand-dark/65 backdrop-blur-xs flex items-center justify-center">
            <span className="text-white text-sm font-bold uppercase tracking-widest px-4 py-2 bg-red-600 rounded-xl">{t.outOfStock}</span>
          </div>
        )}
        {prepTime && item.available && (
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-brand-dark text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-brand-primary" />{prepTime}
          </div>
        )}
      </button>

      <div className="p-3 sm:p-6 flex flex-col flex-grow">
        <h3 className="font-serif italic text-base sm:text-xl font-bold text-brand-dark leading-snug group-hover:text-brand-primary transition-colors">
          <button type="button" onClick={openDetails} disabled={!item.available} className="text-left disabled:cursor-default focus:outline-none focus:underline">{name}</button>
        </h3>
        {desc && <p className="font-sans text-brand-muted text-[11px] sm:text-sm mt-1.5 sm:mt-2 leading-relaxed flex-grow line-clamp-2 sm:line-clamp-3">{desc}</p>}

        <div className="mt-3 sm:mt-6 pt-3 sm:pt-4 border-t border-brand-primary/5 flex flex-col gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-brand-muted tracking-wider">{isUz ? 'Narxi' : 'Цена'}</span>
            <span className="font-sans text-sm sm:text-lg font-extrabold text-brand-dark leading-none mt-1">{formatPrice(item.price)}</span>
          </div>

          {item.available && (
            quantityInCart > 0 ? (
              <div className="flex items-center justify-center bg-brand-primary text-white rounded-xl overflow-hidden shadow-md">
                <button type="button" onClick={() => onUpdateQuantity(quantityInCart - 1)} className="p-2.5 hover:bg-brand-dark" aria-label={isUz ? 'Kamaytirish' : 'Уменьшить'}><Minus className="w-4 h-4" /></button>
                <span className="px-4 text-sm font-bold min-w-10 text-center">{quantityInCart}</span>
                <button type="button" onClick={() => onUpdateQuantity(quantityInCart + 1)} className="p-2.5 hover:bg-brand-dark" aria-label={isUz ? 'Ko‘paytirish' : 'Увеличить'}><Plus className="w-4 h-4" /></button>
              </div>
            ) : (
              <button type="button" onClick={onAddToCart} className="w-full px-4 py-2.5 bg-brand-primary hover:bg-brand-dark text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95">
                <Plus className="w-4 h-4" />{t.addToCart}
              </button>
            )
          )}
        </div>
      </div>
    </motion.article>
  );
}
