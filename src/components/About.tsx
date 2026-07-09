import { motion } from 'motion/react';
import { Leaf, Award, UtensilsCrossed } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data';

interface AboutProps {
  lang: Language;
}

export default function About({ lang }: AboutProps) {
  const t = TRANSLATIONS[lang];

  return (
    <section id="about" className="py-20 bg-white relative overflow-hidden">
      {/* Background soft gradients */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-brand-accent/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Asymmetric Imagery Grid (Left) */}
          <div className="lg:col-span-5 grid grid-cols-12 gap-4 relative">
            
            {/* Main large image */}
            <div className="col-span-8 rounded-3xl overflow-hidden shadow-lg aspect-3/4 bg-brand-primary/5">
              <img
                src="https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=600&auto=format&fit=crop"
                alt="Cooking pilaf traditionally over fire"
                className="w-full h-full object-cover hover:scale-103 transition-transform duration-500"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </div>

            {/* Shifted secondary image */}
            <div className="col-span-4 self-end space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-md aspect-square bg-brand-primary/5">
                <img
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=300&auto=format&fit=crop"
                  alt="Fresh organic tomatoes for Achichuk"
                  className="w-full h-full object-cover hover:scale-103 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md aspect-square bg-brand-primary/5">
                <img
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=300&auto=format&fit=crop"
                  alt="Fresh baking flatbread"
                  className="w-full h-full object-cover hover:scale-103 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Visual highlight box: Years of quality */}
            <div className="absolute -bottom-4 -right-2 bg-brand-accent text-brand-dark p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-white">
              <span className="font-serif text-3xl font-bold leading-none">2</span>
              <span className="font-sans text-xs font-semibold leading-tight">
                {lang === 'uz' ? 'Qulay\nfilial' : 'Удобных\nфилиала'}
              </span>
            </div>

          </div>

          {/* Narrative Content (Right) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Section Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/5 rounded-full text-brand-primary font-bold text-xs uppercase tracking-widest">
              <Leaf className="w-3.5 h-3.5 fill-current text-brand-accent" />
              <span>{t.navAbout}</span>
            </div>

            {/* Display Heading */}
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-dark tracking-tight leading-tight">
              {t.aboutTitle}
            </h2>

            {/* Story Paragraphs */}
            <div className="font-sans text-brand-muted text-sm sm:text-base space-y-4 leading-relaxed font-normal">
              <p>{t.aboutP1}</p>
              <p>{t.aboutP2}</p>
              <p>{t.aboutP3}</p>
            </div>

            {/* Highlights row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-brand-primary/10">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary flex-shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-brand-dark text-sm sm:text-base">
                    {lang === 'uz' ? 'Samimiy xizmat' : 'Радушный сервис'}
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-brand-muted mt-0.5">
                    {lang === 'uz' ? 'Har bir mehmonni iliq choy va samimiy kutib olamiz.' : 'Каждого гостя встречаем чаем и искренней заботой.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/5 flex items-center justify-center text-brand-primary flex-shrink-0">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-brand-dark text-sm sm:text-base">
                    {lang === 'uz' ? 'To‘kin dasturxon' : 'Щедрые порции'}
                  </h4>
                  <p className="font-sans text-xs sm:text-sm text-brand-muted mt-0.5">
                    {lang === 'uz' ? 'Katta va to‘kin portsiyalar, hamyonbop narxlarda.' : 'Большие щедрые порции по доступным ценам.'}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
