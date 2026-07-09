import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Clock, UtensilsCrossed } from 'lucide-react';
import { MenuItem, Language } from '../types';
import { TRANSLATIONS } from '../data';
import { thumb, imgFallback } from '../img';

interface ProductDetailProps {
  item: MenuItem | null;
  lang: Language;
  quantityInCart: number;
  onAddToCart: () => void;
  onUpdateQuantity: (qty: number) => void;
  onClose: () => void;
}

export default function ProductDetail({
  item,
  lang,
  quantityInCart,
  onAddToCart,
  onUpdateQuantity,
  onClose,
}: ProductDetailProps) {
  const t = TRANSLATIONS[lang];

  const name = item ? (lang === 'uz' ? item.name_uz : item.name_ru) : '';
  const desc = item ? (lang === 'uz' ? item.desc_uz : item.desc_ru) : '';
  const prepTime = item ? (lang === 'uz' ? item.prepTime_uz : item.prepTime_ru) : '';
  const formatPrice = (price: number) => price.toLocaleString('uz-UZ') + ' ' + t.currency;

  return (
    <AnimatePresence>
      {item && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-dark/60 backdrop-blur-sm z-50"
          />

          {/* Modal — mobilda pastdan sheet, desktopda markazda */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.98 }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="fixed z-50 bg-white shadow-2xl flex flex-col overflow-hidden
                       inset-x-0 bottom-0 rounded-t-3xl max-h-[92vh]
                       sm:inset-0 sm:m-auto sm:max-w-lg sm:h-fit sm:max-h-[90vh] sm:rounded-3xl"
          >
            {/* Rasm */}
            <div className="relative aspect-4/3 bg-brand-primary/5 flex-shrink-0">
              <img
                src={thumb(item.image, 800)}
                alt={name}
                onError={(e) => imgFallback(e, item.image)}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={onClose}
                aria-label="Yopish"
                className="absolute top-4 right-4 w-9 h-9 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center text-brand-dark shadow-md cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              {prepTime && (
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-brand-dark text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                  <Clock className="w-3.5 h-3.5 text-brand-primary" />
                  {prepTime}
                </div>
              )}
              {!item.available && (
                <div className="absolute inset-0 bg-brand-dark/65 backdrop-blur-xs flex items-center justify-center">
                  <span className="text-white text-sm font-bold uppercase tracking-widest px-4 py-2 bg-red-600 rounded-xl">
                    {lang === 'uz' ? 'Mavjud emas' : 'Нет в наличии'}
                  </span>
                </div>
              )}
            </div>

            {/* Kontent */}
            <div className="p-5 sm:p-6 flex flex-col gap-3 overflow-y-auto">
              {/* Kategoriya */}
              {item.category && (
                <span className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 bg-brand-primary/5 text-brand-primary rounded-full text-[11px] font-bold uppercase tracking-wider">
                  <UtensilsCrossed className="w-3 h-3" />
                  {item.category}
                </span>
              )}

              {/* Nom */}
              <h2 className="font-serif italic text-2xl sm:text-3xl font-bold text-brand-dark leading-tight">
                {name}
              </h2>

              {/* Tavsif — to'liq */}
              {desc && (
                <p className="font-sans text-brand-muted text-sm leading-relaxed">
                  {desc}
                </p>
              )}

              {/* Narx + savatga qo'shish */}
              <div className="mt-2 pt-4 border-t border-brand-primary/5 flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-brand-muted tracking-wider">
                    {lang === 'uz' ? 'Narxi' : 'Цена'}
                  </span>
                  <span className="font-sans text-xl sm:text-2xl font-extrabold text-brand-dark leading-none mt-1">
                    {formatPrice(item.price)}
                  </span>
                </div>

                {item.available && (
                  <div className="flex-shrink-0">
                    {quantityInCart > 0 ? (
                      <div className="flex items-center bg-brand-primary text-white rounded-xl overflow-hidden shadow-md">
                        <button
                          onClick={() => onUpdateQuantity(quantityInCart - 1)}
                          className="p-3 hover:bg-brand-dark transition-colors cursor-pointer"
                          aria-label="Kamaytirish"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 text-base font-bold min-w-[28px] text-center select-none">
                          {quantityInCart}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(quantityInCart + 1)}
                          className="p-3 hover:bg-brand-dark transition-colors cursor-pointer"
                          aria-label="Ko'paytirish"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={onAddToCart}
                        className="px-6 py-3 bg-brand-primary hover:bg-brand-dark text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
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
        </>
      )}
    </AnimatePresence>
  );
}
