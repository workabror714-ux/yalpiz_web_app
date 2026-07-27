import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CalendarCheck, Check, PartyPopper, Sparkles, Users, X } from 'lucide-react';
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

const emptyForm = {
  name: '',
  phone: '',
  date: '',
  time: '',
  guests: '',
  eventType: '',
  note: '',
};

const inputCls =
  'w-full rounded-xl border border-brand-primary/10 bg-brand-neutral/40 px-3 py-2.5 text-sm outline-none focus:border-brand-primary/40 focus:ring-2 focus:ring-brand-primary/10 transition-all';

function todayIso(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

function normalizeUzPhone(value: string): string {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('998')) digits = digits.slice(3);
  return digits.slice(0, 9);
}

export default function BookingSection({ lang }: BookingSectionProps) {
  const isUz = lang === 'uz';
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const minDate = useMemo(todayIso, []);

  const set = (key: keyof typeof emptyForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const validate = (): string => {
    if (!form.name.trim()) return isUz ? 'Ismingizni kiriting.' : 'Введите ваше имя.';
    if (!/^\d{9}$/.test(form.phone)) {
      return isUz ? 'Telefon raqamini 9 ta raqam bilan kiriting.' : 'Введите 9 цифр номера телефона.';
    }
    if (!form.date) return isUz ? 'Bron sanasini tanlang.' : 'Выберите дату бронирования.';
    if (form.date < minDate) return isUz ? 'O‘tgan sanani tanlab bo‘lmaydi.' : 'Нельзя выбрать прошедшую дату.';
    if (!form.time) return isUz ? 'Bron vaqtini tanlang.' : 'Выберите время бронирования.';
    if (form.time < '10:00' || form.time > '23:59') {
      return isUz ? 'Bron vaqti 10:00 dan 23:59 gacha bo‘lishi kerak.' : 'Время бронирования: с 10:00 до 23:59.';
    }
    const guests = Number(form.guests);
    if (!Number.isInteger(guests) || guests < 1 || guests > 300) {
      return isUz ? 'Mehmonlar sonini 1 dan 300 gacha kiriting.' : 'Укажите количество гостей от 1 до 300.';
    }
    return '';
  };

  const submit = async () => {
    if (submitting) return;
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError('');
    const result = await createBooking({
      ...form,
      name: form.name.trim(),
      phone: `+998${form.phone}`,
      note: form.note.trim(),
    });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }
    setDone(true);
  };

  const close = () => {
    setOpen(false);
    window.setTimeout(() => {
      setDone(false);
      setForm({ ...emptyForm });
      setError('');
      setSubmitting(false);
    }, 250);
  };

  const features = [
    { icon: PartyPopper, uz: 'Tug‘ilgan kun va bayramlar', ru: 'Дни рождения и праздники' },
    { icon: Users, uz: 'Katta va kichik guruhlar', ru: 'Большие и малые группы' },
    { icon: CalendarCheck, uz: 'Oldindan joy band qilish', ru: 'Предварительное бронирование' },
  ];

  return (
    <section
      id="booking"
      className="py-14 sm:py-16 bg-[#143a22] text-white rounded-[32px] my-12 relative overflow-hidden shadow-xl mx-4 sm:mx-6 lg:mx-8"
    >
      <div className="absolute top-0 right-0 w-72 h-72 bg-brand-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-primary/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-xs sm:text-sm">
          <Sparkles className="w-4 h-4 text-brand-accent" />
          <span className="tracking-wider uppercase font-semibold">
            {isUz ? 'Joy band qilish' : 'Бронирование'}
          </span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          {isUz ? 'Tadbiringizni biz bilan nishonlang' : 'Отпразднуйте ваше событие у нас'}
        </h2>

        <p className="font-sans text-white/80 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
          {isUz
            ? "Tug‘ilgan kun, nikoh, yubiley yoki oddiy oilaviy uchrashuv uchun joy band qiling. Mas’ul xodimimiz arizani tasdiqlash uchun siz bilan bog‘lanadi."
            : 'Забронируйте стол для дня рождения, свадьбы, юбилея или семейной встречи. Сотрудник свяжется с вами для подтверждения.'}
        </p>

        <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-4 pt-2">
          {features.map((feature) => (
            <div key={feature.uz} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-brand-accent/15 flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-5 h-5 text-brand-accent" />
              </div>
              <span className="text-sm text-white/90 font-medium">{isUz ? feature.uz : feature.ru}</span>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <button
            id="open-booking-btn"
            type="button"
            onClick={() => setOpen(true)}
            className="px-8 py-4 bg-brand-accent text-brand-dark hover:bg-white rounded-2xl font-bold shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:scale-95 inline-flex items-center gap-2"
          >
            <CalendarCheck className="w-5 h-5" />
            {isUz ? 'Joy band qilish' : 'Забронировать'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 bg-brand-dark/60 backdrop-blur-sm z-50"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="booking-dialog-title"
              initial={{ opacity: 0, y: 60, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.98 }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className="fixed z-50 bg-white text-brand-dark shadow-2xl flex flex-col overflow-hidden inset-x-0 bottom-0 rounded-t-3xl max-h-[92vh] sm:inset-0 sm:m-auto sm:max-w-md sm:h-fit sm:max-h-[92vh] sm:rounded-3xl"
            >
              <div className="flex items-center justify-between p-5 border-b border-brand-primary/5 flex-shrink-0">
                <h3 id="booking-dialog-title" className="font-serif text-xl font-bold">
                  {isUz ? 'Joy band qilish' : 'Бронирование'}
                </h3>
                <button
                  type="button"
                  onClick={close}
                  aria-label={isUz ? 'Yopish' : 'Закрыть'}
                  className="w-8 h-8 rounded-full hover:bg-brand-primary/5 flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {done ? (
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-xl font-bold">
                    {isUz ? 'Ariza yuborildi!' : 'Заявка отправлена!'}
                  </h4>
                  <p className="text-brand-muted text-sm">
                    {isUz
                      ? 'Rahmat! Bron mas’ul xodimimiz siz bilan bog‘langandan keyin tasdiqlanadi.'
                      : 'Спасибо! Бронь будет подтверждена после звонка сотрудника.'}
                  </p>
                  <button type="button" onClick={close} className="px-6 py-3 bg-brand-primary text-white text-sm font-bold rounded-xl">
                    {isUz ? 'Yopish' : 'Закрыть'}
                  </button>
                </div>
              ) : (
                <div className="p-5 space-y-3 overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label={isUz ? 'Ismingiz *' : 'Ваше имя *'}>
                      <input
                        value={form.name}
                        onChange={(event) => set('name', event.target.value)}
                        className={inputCls}
                        autoComplete="name"
                        placeholder={isUz ? 'Ism' : 'Имя'}
                      />
                    </Field>

                    <Field label={isUz ? 'Telefon *' : 'Телефон *'}>
                      <div className="flex rounded-xl border border-brand-primary/10 bg-brand-neutral/40 focus-within:border-brand-primary/40 focus-within:ring-2 focus-within:ring-brand-primary/10 transition-all">
                        <span className="px-3 py-2.5 text-sm text-brand-dark/70 border-r border-brand-primary/10">+998</span>
                        <input
                          value={form.phone}
                          onChange={(event) => set('phone', normalizeUzPhone(event.target.value))}
                          inputMode="numeric"
                          autoComplete="tel-national"
                          maxLength={9}
                          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none"
                          placeholder="90 123 45 67"
                        />
                      </div>
                    </Field>

                    <Field label={isUz ? 'Sana *' : 'Дата *'}>
                      <input
                        type="date"
                        min={minDate}
                        value={form.date}
                        onChange={(event) => set('date', event.target.value)}
                        className={inputCls}
                      />
                    </Field>

                    <Field label={isUz ? 'Vaqt *' : 'Время *'}>
                      <input
                        type="time"
                        min="10:00"
                        max="23:59"
                        value={form.time}
                        onChange={(event) => set('time', event.target.value)}
                        className={inputCls}
                      />
                    </Field>

                    <Field label={isUz ? 'Mehmonlar soni *' : 'Количество гостей *'}>
                      <input
                        type="number"
                        min="1"
                        max="300"
                        value={form.guests}
                        onChange={(event) => set('guests', event.target.value)}
                        className={inputCls}
                        placeholder="10"
                      />
                    </Field>

                    <Field label={isUz ? 'Tadbir turi' : 'Тип события'}>
                      <select value={form.eventType} onChange={(event) => set('eventType', event.target.value)} className={inputCls}>
                        <option value="">{isUz ? 'Tanlang' : 'Выберите'}</option>
                        {EVENT_TYPES.map((eventType) => (
                          <option key={eventType.uz} value={isUz ? eventType.uz : eventType.ru}>
                            {isUz ? eventType.uz : eventType.ru}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <Field label={isUz ? 'Izoh (ixtiyoriy)' : 'Комментарий (необязательно)'}>
                    <textarea
                      value={form.note}
                      onChange={(event) => set('note', event.target.value)}
                      rows={3}
                      maxLength={500}
                      className={`${inputCls} resize-none`}
                      placeholder={isUz ? 'Qo‘shimcha talablar...' : 'Дополнительные пожелания...'}
                    />
                  </Field>

                  {error && <p className="text-xs text-red-600 font-medium" role="alert">{error}</p>}

                  <button
                    type="button"
                    onClick={submit}
                    disabled={submitting}
                    className="w-full py-3.5 bg-brand-primary hover:bg-brand-dark text-white font-bold rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {submitting ? (isUz ? 'Yuborilmoqda…' : 'Отправка…') : (isUz ? 'Arizani yuborish' : 'Отправить заявку')}
                  </button>
                  <p className="text-[11px] text-brand-muted text-center">
                    {isUz
                      ? 'Ariza yuborilishi avtomatik bron tasdig‘i emas. Xodimimiz telefon orqali tasdiqlaydi.'
                      : 'Отправка заявки не является автоматическим подтверждением. Сотрудник подтвердит бронь по телефону.'}
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1.5 text-left">
      <span className="block text-[11px] font-bold text-brand-dark/75">{label}</span>
      {children}
    </label>
  );
}
