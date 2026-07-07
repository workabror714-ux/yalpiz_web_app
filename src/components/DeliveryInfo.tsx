import { motion } from 'motion/react';
import { ShoppingBasket, Truck, Sparkles, CreditCard, Wallet } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data';

interface DeliveryInfoProps {
  lang: Language;
}

export default function DeliveryInfo({ lang }: DeliveryInfoProps) {
  const t = TRANSLATIONS[lang];

  const steps = [
    {
      step: '01',
      title: t.step1Title,
      desc: t.step1Desc,
      icon: ShoppingBasket,
      bg: 'bg-emerald-50 text-brand-primary',
    },
    {
      step: '02',
      title: t.step2Title,
      desc: t.step2Desc,
      icon: Truck,
      bg: 'bg-amber-50 text-amber-600',
    },
    {
      step: '03',
      title: t.step3Title,
      desc: t.step3Desc,
      icon: Sparkles,
      bg: 'bg-sky-50 text-sky-600',
    },
  ];

  return (
    <section id="delivery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/5 rounded-full text-brand-primary font-bold text-xs uppercase tracking-widest">
            <Truck className="w-3.5 h-3.5" />
            <span>{lang === 'uz' ? 'Xizmatlarimiz' : 'Сервис'}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark">
            {t.deliveryTitle}
          </h2>
          <p className="font-sans text-brand-muted text-sm sm:text-base">
            {t.deliverySub}
          </p>
        </div>

        {/* 3 Step Ordering Process */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/3 left-16 right-16 h-0.5 bg-brand-primary/10 -z-10" />

          {steps.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white p-8 rounded-[32px] border border-brand-primary/5 text-center flex flex-col items-center space-y-4 shadow-xs relative"
              >
                {/* Step number badge */}
                <span className="absolute top-4 right-6 font-mono text-xs font-bold text-brand-primary/30 uppercase tracking-widest">
                  STEP {item.step}
                </span>

                {/* Icon Wrapper */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.bg} shadow-xs`}>
                  <Icon className="w-7 h-7" />
                </div>

                <h3 className="font-sans text-lg font-bold text-brand-dark">
                  {item.title}
                </h3>
                
                <p className="font-sans text-brand-muted text-xs sm:text-sm leading-relaxed max-w-xs">
                  {item.desc}
                </p>

              </motion.div>
            );
          })}
        </div>

        {/* Payment Methods Banner */}
        <div className="mt-16 bg-brand-neutral/60 border border-brand-primary/10 rounded-[32px] p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-3">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-dark flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-brand-primary" />
                {t.paymentTitle}
              </h3>
              <p className="font-sans text-brand-muted text-xs sm:text-sm leading-relaxed">
                {t.paymentDesc}
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-3 gap-3 sm:gap-4">
              
              {/* Payme Card */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-primary/5 flex flex-col items-center justify-center text-center shadow-xs group hover:border-brand-primary/20 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-[#00c2e8]/10 flex items-center justify-center text-[#00c2e8] font-bold text-xs uppercase tracking-widest mb-2">
                  PM
                </div>
                <span className="font-sans font-bold text-brand-dark text-xs sm:text-sm">Payme</span>
                <span className="font-mono text-[9px] text-[#00c2e8] mt-1 font-semibold tracking-wider uppercase">{lang === 'uz' ? 'Onlayn' : 'Онлайн'}</span>
              </div>

              {/* Click Card */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-primary/5 flex flex-col items-center justify-center text-center shadow-xs group hover:border-brand-primary/20 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-[#0052cc]/10 flex items-center justify-center text-[#0052cc] font-bold text-xs uppercase tracking-widest mb-2">
                  CL
                </div>
                <span className="font-sans font-bold text-brand-dark text-xs sm:text-sm">Click</span>
                <span className="font-mono text-[9px] text-[#0052cc] mt-1 font-semibold tracking-wider uppercase">{lang === 'uz' ? 'Onlayn' : 'Онлайн'}</span>
              </div>

              {/* Cash Card */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-primary/5 flex flex-col items-center justify-center text-center shadow-xs group hover:border-brand-primary/20 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-2">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="font-sans font-bold text-brand-dark text-xs sm:text-sm">
                  {lang === 'uz' ? 'Naqd / Karta' : 'Наличные'}
                </span>
                <span className="font-mono text-[9px] text-emerald-600 mt-1 font-semibold tracking-wider uppercase">{lang === 'uz' ? 'Qabulda' : 'При получении'}</span>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
