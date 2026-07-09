import React from 'react';
import { motion } from 'motion/react';
import { Plus, Minus, Clock, Flame } from 'lucide-react';
import { MenuItem, Language } from '../types';
import { TRANSLATIONS } from '../data';
import { thumb, imgFallback } from '../img';

interface ProductCardProps {
  key?: any;
  item: MenuItem;
  lang: Language;
  quantityInCart: number;
  onAddToCart: () => void;
  onUpdateQuantity: (qty: number) => void;
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

  // Format price helper (e.g. 35 000 so'm)
  const formatPrice = (price: number) => {
    return price.toLocaleString('uz-UZ') + ' ' + t.currency;
  };

  const name = lang === 'uz' ? item.name_uz : item.name_ru;
  const desc = lang === 'uz' ? item.desc_uz : item.desc_ru;
  const badge = lang === 'uz' ? item.badge_uz : item.badge_ru;
  const prepTime = lang === 'uz' ? item.prepTime_uz : item.prepTime_ru;

  return (
    <motion.div
      layout
      id={`product-card-${item.id}`}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      onClick={onSelect}
      className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-brand-primary/5 hover:border-brand-primary/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group cursor-pointer"
    >
      {/* Product Image Section */}
      <div className="relative aspect-4/3 overflow-hidden bg-brand-primary/5">
        <img
          src={thumb(item.image, 450)}
          alt={name}
          onLoad={(e) => e.currentTarget.classList.add('opacity-100')}
          className="w-full h-full object-cover opacity-0 transition duration-500 group-hover:scale-108"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={(e) => imgFallback(e, item.image)}
        />

        {/* Promo / Popular Badges */}
        {badge && (
          <span
            id={`product-badge-${item.id}`}
            className="absolute top-3 left-3 bg-brand-accent text-brand-dark text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm"
          >
            {badge}
          </span>
        )}

        {item.isPopular && !badge && (
          <span
            id={`product-popular-${item.id}`}
            className="absolute top-3 left-3 bg-brand-primary text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1"
          >
            <Flame className="w-3 h-3 text-brand-accent fill-current" />
            {t.popularBadge}
          </span>
        )}

        {/* Available indicator */}
        {!item.available && (
          <div className="absolute inset-0 bg-brand-dark/65 backdrop-blur-xs flex items-center justify-center">
            <span className="text-white text-sm font-bold uppercase tracking-widest px-4 py-2 bg-red-600 rounded-xl">
              {t.outOfStock}
            </span>
          </div>
        )}

        {/* Delivery speed pill */}
        {prepTime && item.available && (
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-brand-dark text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-xs">
            <Clock className="w-3.5 h-3.5 text-brand-primary" />
            <span>{prepTime}</span>
          </div>
        )}
      </div>

      {/* Product Content Section */}
      <div className="p-3 sm:p-6 flex flex-col flex-grow">
        
        {/* Title */}
        <h3 className="font-serif italic text-base sm:text-xl font-bold text-brand-dark leading-snug group-hover:text-brand-primary transition-colors">
          {name}
        </h3>

        {/* Description */}
        <p className="font-sans text-brand-muted text-[11px] sm:text-sm mt-1.5 sm:mt-2 leading-relaxed flex-grow line-clamp-2 sm:line-clamp-3">
          {desc}
        </p>

        {/* Price and Action row */}
        <div className="mt-3 sm:mt-6 pt-3 sm:pt-4 border-t border-brand-primary/5 flex flex-col gap-2 sm:gap-3">
          
          {/* Price */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-brand-muted tracking-wider">
              {lang === 'uz' ? 'Narxi' : 'Цена'}
            </span>
            <span className="font-sans text-sm sm:text-lg font-extrabold text-brand-dark leading-none mt-1">
              {formatPrice(item.price)}
            </span>
          </div>

          {/* Cart Stepper or Add button */}
          {item.available && (
            <div className="flex-shrink-0 w-full" onClick={(e) => e.stopPropagation()}>
              {quantityInCart > 0 ? (
                <div className="flex items-center justify-center bg-brand-primary text-white rounded-xl overflow-hidden shadow-md">
                  <button
                    id={`qty-decrease-${item.id}`}
                    onClick={() => onUpdateQuantity(quantityInCart - 1)}
                    className="p-2 sm:p-2.5 hover:bg-brand-dark transition-colors duration-200 cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span
                    id={`qty-display-${item.id}`}
                    className="px-3 text-sm font-bold min-w-[20px] text-center select-none"
                  >
                    {quantityInCart}
                  </span>
                  <button
                    id={`qty-increase-${item.id}`}
                    onClick={() => onUpdateQuantity(quantityInCart + 1)}
                    className="p-2 sm:p-2.5 hover:bg-brand-dark transition-colors duration-200 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  id={`add-to-cart-btn-${item.id}`}
                  onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
                  className="w-full px-4 py-2.5 bg-brand-primary hover:bg-brand-dark text-white text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.addToCart}</span>
                </button>
              )}
            </div>
          )}

        </div>

      </div>
    </motion.div>
  );
}
