import { motion } from 'motion/react';
import { Leaf, Truck, UtensilsCrossed, Smartphone } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data';

interface WhyUsProps {
  lang: Language;
}

export default function WhyUs({ lang }: WhyUsProps) {
  const t = TRANSLATIONS[lang];

  const cards = [
    {
      title: t.whyFreshTitle,
      desc: t.whyFreshDesc,
      icon: Leaf,
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/10',
    },
    {
      title: t.whyFastTitle,
      desc: t.whyFastDesc,
      icon: Truck,
      color: 'bg-amber-500/10 text-amber-600 border-amber-500/10',
    },
    {
      title: t.whyTasteTitle,
      desc: t.whyTasteDesc,
      icon: UtensilsCrossed,
      color: 'bg-brand-primary/10 text-brand-primary border-brand-primary/10',
    },
    {
      title: t.whyAppTitle,
      desc: t.whyAppDesc,
      icon: Smartphone,
      color: 'bg-sky-500/10 text-sky-600 border-sky-500/10',
    },
  ];

  return (
    <section className="py-16 bg-[#f7f5f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark">
            {t.whyTitle}
          </h2>
          <p className="font-sans text-brand-muted text-sm sm:text-base">
            {t.whySub}
          </p>
        </div>

        {/* Bento Grid cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-brand-primary/5 hover:border-brand-primary/15 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  
                  {/* Icon wrap */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${card.color} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-sans text-lg font-bold text-brand-dark group-hover:text-brand-primary transition-colors">
                    {card.title}
                  </h3>
                  
                  <p className="font-sans text-brand-muted text-xs sm:text-sm leading-relaxed">
                    {card.desc}
                  </p>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
