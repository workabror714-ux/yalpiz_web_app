import { Gift, ArrowRight } from 'lucide-react';
import { Promo, Language, CategoryType } from '../types';
import { PROMOS, TRANSLATIONS } from '../data';

interface PromotionsProps {
  lang: Language;
  onPromoClick: (category: CategoryType) => void;
}

export default function Promotions({ lang, onPromoClick }: PromotionsProps) {
  const t = TRANSLATIONS[lang];

  return (
    <section id="promos" className="py-16 bg-[#143a22] text-white rounded-[32px] my-12 relative overflow-hidden shadow-xl mx-4 sm:mx-6 lg:mx-8">
      {/* Background mint highlights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-primary/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-2xl -z-10" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Title Block */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-accent/20 border border-brand-accent/20 text-brand-accent rounded-full text-xs font-bold uppercase tracking-widest">
            <Gift className="w-3.5 h-3.5 fill-current" />
            <span>{lang === 'uz' ? 'Aksiyalar' : 'Скидки'}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {t.promoTitle}
          </h2>
          <p className="font-sans text-white/70 text-sm sm:text-base">
            {t.promoSub}
          </p>
        </div>

        {/* Promo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {PROMOS.map((promo: Promo) => {
            const title = lang === 'uz' ? promo.title_uz : promo.title_ru;
            const desc = lang === 'uz' ? promo.desc_uz : promo.desc_ru;
            const badge = lang === 'uz' ? promo.badge_uz : promo.badge_ru;

            return (
              <div
                key={promo.id}
                id={`promo-banner-${promo.id}`}
                className="bg-[#1a5c30]/60 backdrop-blur-xs border border-brand-accent/15 hover:border-brand-accent/40 rounded-3xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col sm:flex-row h-full group"
              >
                
                {/* Image Section */}
                <div className="sm:w-1/2 relative aspect-4/3 sm:aspect-auto overflow-hidden bg-brand-primary/10">
                  <img
                    src={promo.image}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-brand-accent text-brand-dark text-[10px] font-extrabold uppercase px-2.5 py-1.5 rounded-lg">
                    {badge}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 sm:p-8 sm:w-1/2 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight text-white group-hover:text-brand-accent transition-colors">
                      {title}
                    </h3>
                    <p className="font-sans text-white/80 text-xs sm:text-sm leading-relaxed">
                      {desc}
                    </p>
                    {promo.price && (
                      <div className="pt-2">
                        <span className="text-white/60 text-xs block uppercase font-bold tracking-wider">
                          {lang === 'uz' ? 'To‘plam narxi' : 'Цена сета'}
                        </span>
                        <span className="text-brand-accent font-sans text-xl font-extrabold">
                          {promo.price.toLocaleString('uz-UZ')} {t.currency}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    id={`promo-action-btn-${promo.id}`}
                    onClick={() => onPromoClick(promo.categoryLink)}
                    className="inline-flex items-center gap-2 text-brand-accent hover:text-white text-xs sm:text-sm font-bold tracking-wider uppercase transition-colors group/btn cursor-pointer"
                  >
                    <span>{t.exploreMenu}</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
