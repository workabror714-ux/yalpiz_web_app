import { motion } from 'motion/react';
import { Leaf, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data';

interface HeroProps {
  lang: Language;
  onExploreClick: () => void;
  onOrderClick: () => void;
}

export default function Hero({ lang, onExploreClick, onOrderClick }: HeroProps) {
  const t = TRANSLATIONS[lang];

  return (
    <section id="home" className="relative overflow-hidden pt-4 pb-16 md:py-24">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#a8d35f]/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 left-0 w-80 h-80 bg-[#1a5c30]/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Tagline Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-primary/10 rounded-full border border-brand-primary/10 text-brand-primary font-medium text-xs sm:text-sm"
            >
              <Leaf className="w-4 h-4 text-brand-accent animate-pulse fill-current" />
              <span className="tracking-wider uppercase font-semibold">
                {lang === 'uz' ? 'Haqiqiy Milliy Mehmondo‘stlik' : 'Истинное Национальное Гостеприимство'}
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-brand-dark tracking-tight leading-[1.1]"
            >
              {t.heroTitle.split(' — ').map((part, i) => (
                <span key={i} className="block">
                  {i === 1 ? (
                    <span className="text-brand-primary relative inline-block">
                      {part}
                      <svg
                        className="absolute left-0 -bottom-2 w-full h-2 text-brand-accent"
                        viewBox="0 0 100 10"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M0,7 C30,2 70,2 100,7"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                        />
                      </svg>
                    </span>
                  ) : (
                    part
                  )}
                  {i === 0 && ' — '}
                </span>
              ))}
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-sans text-brand-muted text-base sm:text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed"
            >
              {t.heroSub}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
            >
              <button
                id="hero-order-now-btn"
                onClick={onOrderClick}
                className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-white hover:bg-brand-dark rounded-2xl font-semibold shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 cursor-pointer group"
              >
                {t.orderBtn}
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <button
                id="hero-view-menu-btn"
                onClick={onExploreClick}
                className="w-full sm:w-auto px-8 py-4 bg-white text-brand-dark hover:bg-brand-primary/5 border-2 border-brand-primary/15 hover:border-brand-primary/30 rounded-2xl font-semibold shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center cursor-pointer"
              >
                {t.exploreMenu}
              </button>
            </motion.div>

            {/* Quick trust metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center lg:justify-start gap-8 pt-8 text-xs sm:text-sm text-brand-muted"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-primary/5 flex items-center justify-center text-brand-primary">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold block text-brand-dark">40 min</span>
                  <span>{lang === 'uz' ? 'O‘rtacha yetkazish' : 'Среднее время'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-primary/5 flex items-center justify-center text-brand-primary">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold block text-brand-dark">Halol</span>
                  <span>{lang === 'uz' ? 'Sertifikatlangan' : 'Сертифицировано'}</span>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Hero Right Visuals */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Circle backdrop */}
            <div className="absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] rounded-full bg-brand-primary border-[16px] border-brand-accent/20 -z-10" />

            {/* Giant Main Dish */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[420px] md:h-[420px] rounded-full overflow-hidden shadow-2xl border-4 border-white"
            >
              <img
                src="https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop"
                alt="Premium Uzbek Shoxona Osh"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Floating floating mint leaves */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute top-12 left-4 sm:left-12 w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-brand-primary border border-brand-primary/5"
            >
              <Leaf className="w-6 h-6 fill-current text-brand-accent" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 15, 0], rotate: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              className="absolute bottom-12 right-2 sm:right-10 w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-brand-primary border border-brand-primary/5"
            >
              <Leaf className="w-7 h-7 fill-current text-brand-primary" />
            </motion.div>

            {/* Floating Promo tag */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute bottom-6 left-0 bg-brand-dark text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-brand-primary/20 max-w-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-accent text-brand-dark flex items-center justify-center font-bold text-sm">
                10%
              </div>
              <div className="text-left text-xs">
                <span className="font-bold block text-brand-accent">
                  {lang === 'uz' ? 'Sayt orqali chegirgma!' : 'Скидка на сайте!'}
                </span>
                <span className="text-white/80">
                  {lang === 'uz' ? 'Birinchi buyurtmaga' : 'На ваш первый заказ'}
                </span>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
