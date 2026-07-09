import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CalendarCheck, Users, PartyPopper, Sparkles, X, Check } from 'lucide-react';
import { Language } from '../types';
import { createBooking } from '../api';

interface BookingSectionProps {
  lang: Language;
}

const EVENT_TYPES = [
  { uz: "Tug'ilgan kun", ru: 'День рождения' },
  { uz: "Nikoh to'yi", ru: 'Свадьба' },
  { uz: 'Yubiley', ru: 'Юбилей' },
  { uz: 'Korporativ tadbir', ru: 'Корпоратив' },
  { uz: 'Boshqa', ru: 'Другое' },
];

const emptyForm = { name: '', phone: '', date: '', time: '', guests: '', eventType: '', note: '' };

export default function BookingSection({ lang }: BookingSectionProps) {
  const isUz = lang === 'uz';
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof typeof emptyForm, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name.trim() || form.phone.trim().length < 7) {
      setError(isUz ? 'Ism va telefon raqamini kiriting' : 'Введите имя и номер телефона');
      return;
    }
    setSubmitting(true);
    setError('');
    const r = await createBooking(form);
    setSubmitting(false);
    if (!r.ok) { setError(r.message); return; }
    setDone(true);
  };

  const close = () => {
    setOpen(false);
    setTimeout(() => { setDone(false); setForm({ ...emptyForm }); setError(''); }, 300);
  };

  const features = [
    { icon: PartyPopper, uz: 'Tug‘ilgan kun va bayramlar', ru: 'Дни рождения и праздники' },
    { icon: Users, uz: 'Katta va kichik guruhlar', ru: 'Большие и малые группы' },
    { icon: CalendarCheck, uz: 'Oldindan joy band qilish', ru: 'Предварительное бронирование' },
  ];

  return (
    <section id="promos" className="py-14 sm:py-16 bg-[#143a22] text-white rounded-[32px] my-12 relative overflow-hidden shadow-xl mx-4 sm:mx-6 lg:mx-8">
      {/* Dekorativ */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-brand-accent/10 rounded-full blur-3xl -z-0" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-primary/20 rounded-full blur-3xl -z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-xs sm:text-sm">
          <Sparkles className="w-4 h-4 text-brand-accent" />
          <span className="tracking-wider uppercase font-semibold">{isUz ? 'Joy bron qilish' : 'Бронирование'}</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          {isUz ? 'Tadbiringizni biz bilan nishonlang' : 'Отпразднуйте ваше событие у нас'}
        </h2>

        <p className="font-sans text-white/80 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
          {isUz
            ? "Tug'ilgan kun, nikoh, yubiley yoki korporativ tadbir — restoranimizda joy band qiling. Mas'ul xodimlarimiz siz bilan bog'lanadi."
            : 'День рождения, свадьба, юбилей или корпоратив — забронируйте место в нашем ресторане. Наши сотрудники свяжутся с вами.'}
        </p>

        {/* Xususiyatlar */}
        <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-4 pt-2">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-brand-accent/15 flex items-center justify-center flex-shrink-0">
                <f.icon className="w-5 h-5 text-brand-accent" />
              </div>
              <span className="text-sm text-white/90 font-medium">{isUz ? f.uz : f.ru}</span>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <button
            id="open-booking-btn"
            onClick={() => setOpen(true)}
            className="px-8 py-4 bg-brand-accent text-brand-dark hover:bg-white rounded-2xl font-bold shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer inline-flex items-center gap-2"
          >
            <CalendarCheck className="w-5 h-5" />
            {isUz ? 'Joy bron qilish' : 'Забронировать'}
          </button>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 bg-brand-dark/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.98 }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className="fixed z-50 bg-white text-brand-dark shadow-2xl flex flex-col overflow-hidden
                         inset-x-0 bottom-0 rounded-t-3xl max-h-[92vh]
                         sm:inset-0 sm:m-auto sm:max-w-md sm:h-fit sm:max-h-[92vh] sm:rounded-3xl"
            >
              {/* Sarlavha */}
              <div className="flex items-center justify-between p-5 border-b border-brand-primary/5 flex-shrink-0">
                <h3 className="font-serif text-xl font-bold">{isUz ? 'Joy bron qilish' : 'Бронирование'}</h3>
                <button onClick={close} aria-label="Yopish" className="w-8 h-8 rounded-full hover:bg-brand-primary/5 flex items-center justify-center cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {done ? (
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-xl font-bold">{isUz ? 'Ariza yuborildi!' : 'Заявка отправлена!'}</h4>
                  <p className="text-brand-muted text-sm">
                    {isUz ? "Rahmat! Mas'ul xodimlarimiz tez orada siz bilan bog'lanadi." : 'Спасибо! Наши сотрудники скоро свяжутся с вами.'}
                  </p>
                  <button onClick={close} className="px-6 py-3 bg-brand-primary text-white text-sm font-bold rounded-xl cursor-pointer">
                    {isUz ? 'Yopish' : 'Закрыть'}
                  </button>
                </div>
              ) : (
                <div className="p-5 space-y-3 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label={isUz ? 'Ismingiz *' : 'Ваше имя *'}>
                      <input value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls} placeholder={isUz ? 'Ism' : 'Имя'} />
                    </Field>
                    <Field label={isUz ? 'Telefon *' : 'Телефон *'}>
                      <input value={form.phone} onChange={(e) => set('phone', e.target.value)} inputMode="tel" className={inputCls} placeholder="+998 90 123 45 67" />
                    </Field>
                    <Field label={isUz ? 'Sana' : 'Дата'}>
                      <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} className={inputCls} />
                    </Field>
                    <Field label={isUz ? 'Vaqt' : 'Время'}>
                      <input type="time" value={form.time} onChange={(e) => set('time', e.target.value)} className={inputCls} />
                    </Field>
                    <Field label={isUz ? 'Mehmonlar soni' : 'Кол-во гостей'}>
                      <input type="number" min="1" value={form.guests} onChange={(e) => set('guests', e.target.value)} className={inputCls} placeholder="10" />
                    </Field>
                    <Field label={isUz ? 'Tadbir turi' : 'Тип события'}>
                      <select value={form.eventType} onChange={(e) => set('eventType', e.target.value)} className={inputCls}>
                        <option value="">{isUz ? 'Tanlang' : 'Выберите'}</option>
                        {EVENT_TYPES.map((ev, i) => (
                          <option key={i} value={isUz ? ev.uz : ev.ru}>{isUz ? ev.uz : ev.ru}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <Field label={isUz ? 'Izoh (ixtiyoriy)' : 'Комментарий (необязательно)'}>
                    <textarea value={form.note} onChange={(e) => set('note', e.target.value)} rows={2} className={inputCls + ' resize-none'} placeholder={isUz ? 'Qo‘shimcha talablar...' : 'Дополнительные пожелания...'} />
                  </Field>

                  {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

                  <button
                    onClick={submit}
                    disabled={submitting}
                    className="w-full py-3.5 bg-brand-primary hover:bg-brand-dark text-white font-bold rounded-xl transition-all disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {submitting ? (isUz ? 'Yuborilmoqda…' : 'Отправка…') : (isUz ? 'Arizani yuborish' : 'Отправить заявку')}
                  </button>
                  <p className="text-[11px] text-brand-muted text-center">
                    {isUz ? "Ariza xodimlarimizga tushadi va ular siz bilan bog'lanadi." : 'Заявка поступит нашим сотрудникам, и они свяжутся с вами.'}
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

const inputCls = 'w-full px-3 py-2.5 bg-brand-primary/5 border border-brand-primary/10 rounded-xl text-sm text-brand-dark placeholder:text-brand-muted/60 focus:outline-none focus:border-brand-primary/40 transition-colors';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold text-brand-muted uppercase tracking-wide">{label}</span>
      {children}
    </label>
  );
}
