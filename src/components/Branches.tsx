import { motion } from 'motion/react';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';
import { Branch, Language } from '../types';
import { BRANCHES, TRANSLATIONS } from '../data';

interface BranchesProps {
  lang: Language;
}

export default function Branches({ lang }: BranchesProps) {
  const t = TRANSLATIONS[lang];

  return (
    <section id="branches" className="py-20 bg-[#f7f5f0] border-t border-brand-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/5 rounded-full text-brand-primary font-bold text-xs uppercase tracking-widest">
            <MapPin className="w-3.5 h-3.5" />
            <span>{lang === 'uz' ? 'Restoranlarimiz' : 'Наши рестораны'}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark">
            {t.branchesTitle}
          </h2>
          <p className="font-sans text-brand-muted text-sm sm:text-base">
            {t.branchesSub}
          </p>
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {BRANCHES.map((branch: Branch) => {
            const name = lang === 'uz' ? branch.name_uz : branch.name_ru;
            const address = lang === 'uz' ? branch.address_uz : branch.address_ru;
            const hours = lang === 'uz' ? branch.hours_uz : branch.hours_ru;

            return (
              <motion.div
                key={branch.id}
                id={`branch-card-${branch.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-[32px] border border-brand-primary/5 overflow-hidden shadow-sm hover:shadow-md hover:border-brand-primary/10 transition-all duration-300 flex flex-col h-full"
              >
                {/* Embedded Map Panel */}
                <div className="h-64 sm:h-72 w-full relative bg-brand-primary/5">
                  <iframe
                    title={name}
                    src={branch.mapEmbedUrl}
                    className="w-full h-full border-0"
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                {/* Branch Info Panel */}
                <div className="p-6 sm:p-8 flex flex-col justify-between flex-grow space-y-6">
                  <div className="space-y-4">
                    
                    {/* Branch Title */}
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-dark flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-brand-accent fill-current animate-pulse" />
                      {name}
                    </h3>

                    {/* Meta Details */}
                    <div className="space-y-3 pt-2 text-brand-muted text-xs sm:text-sm">
                      
                      {/* Address */}
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                        <span className="font-sans leading-relaxed">{address}</span>
                      </div>

                      {/* Working Hours */}
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-brand-primary flex-shrink-0" />
                        <span className="font-sans leading-relaxed">
                          <strong className="text-brand-dark">{t.branchHours}:</strong> {hours}
                        </span>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-brand-primary flex-shrink-0" />
                        <span className="font-sans leading-relaxed">
                          <strong className="text-brand-dark">{t.branchPhone}:</strong> {branch.phone}
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-brand-primary/5">
                    
                    {/* Dial branch */}
                    <a
                      id={`branch-dial-${branch.id}`}
                      href={`tel:${branch.phoneRaw}`}
                      className="w-full sm:w-auto px-5 py-3 bg-brand-primary hover:bg-brand-dark text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      <span>{lang === 'uz' ? 'Qo‘ng‘iroq qilish' : 'Позвонить'}</span>
                    </a>

                    {/* Get directions in external map */}
                    <a
                      id={`branch-directions-${branch.id}`}
                      href={branch.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-5 py-3 bg-white border border-brand-primary/10 hover:bg-brand-primary/5 text-brand-dark rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-4 h-4 text-brand-primary" />
                      <span>{t.branchDirections}</span>
                    </a>

                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
