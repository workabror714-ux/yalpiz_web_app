import { FormEvent, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CheckCircle2,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';

import { CartItem, Language, OrderDetails } from '../types';
import {
  Branch,
  calculateDeliveryPrice,
  createOrder,
  fetchBranches,
  reverseGeocode,
} from '../api';
import { BRANCHES } from '../data';
import { thumb, imgFallback } from '../img';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
}


const normalizeUzPhoneInput = (value: string): string => {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('998')) digits = digits.slice(3);
  return digits.slice(0, 9);
};

const initialDetails = (): OrderDetails => ({
  name: localStorage.getItem('yalpiz_user_name') || '',
  phone: normalizeUzPhoneInput(localStorage.getItem('yalpiz_user_phone') || ''),
  type: 'delivery',
  address: localStorage.getItem('yalpiz_user_address') || '',
  branchId: BRANCHES[0]?.id || '',
  payment: 'payme',
  comment: '',
});

export default function CartDrawer({
  isOpen,
  onClose,
  lang,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const isUz = lang === 'uz';
  const [details, setDetails] = useState<OrderDetails>(initialDetails);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [deliveryPrice, setDeliveryPrice] = useState<number | null>(null);
  const [deliveryPriceLoading, setDeliveryPriceLoading] = useState(false);
  const [deliveryPriceError, setDeliveryPriceError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successOrderId, setSuccessOrderId] = useState('');

  const subtotal = useMemo(
    () => cart.reduce((sum, entry) => sum + Number(entry.item.price || 0) * entry.quantity, 0),
    [cart],
  );

  const branchList = branches.length
    ? branches
    : BRANCHES.map((branch) => ({
        id: branch.id,
        name: isUz ? branch.name_uz : branch.name_ru,
        address: isUz ? branch.address_uz : branch.address_ru,
        lat: null,
        lng: null,
        isActive: true,
      }));

  const price = (value: number) => `${value.toLocaleString('uz-UZ')} so‘m`;

  useEffect(() => {
    void fetchBranches().then((list) => {
      if (!list.length) return;
      setBranches(list);
      setDetails((current) => ({
        ...current,
        branchId: list.some((branch) => branch.id === current.branchId) ? current.branchId : list[0].id,
      }));
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !submitting) onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose, submitting]);

  useEffect(() => {
    if (details.type !== 'delivery' || !location || !details.branchId) {
      setDeliveryPrice(null);
      setDeliveryPriceError('');
      return;
    }

    let cancelled = false;
    setDeliveryPriceLoading(true);
    setDeliveryPriceError('');
    void calculateDeliveryPrice(details.branchId, location).then((result) => {
      if (cancelled) return;
      setDeliveryPriceLoading(false);
      if (result.ok) {
        setDeliveryPrice(result.price);
      } else {
        setDeliveryPrice(null);
        setDeliveryPriceError(result.message);
      }
    });

    return () => { cancelled = true; };
  }, [details.type, details.branchId, location?.lat, location?.lng]);


  const setField = (field: keyof OrderDetails, value: string) => {
    setDetails((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '', submit: '' }));
  };


  const detectLocation = () => {
    if (!navigator.geolocation) {
      setErrors((current) => ({
        ...current,
        location: isUz ? 'Brauzer geolokatsiyani qo‘llamaydi.' : 'Браузер не поддерживает геолокацию.',
      }));
      return;
    }

    setLocating(true);
    setErrors((current) => ({ ...current, location: '', address: '' }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setLocation(coordinates);

        const result = await reverseGeocode(coordinates, lang);
        setLocating(false);

        if (result.ok && result.address) {
          setDetails((current) => ({ ...current, address: result.address }));
          localStorage.setItem('yalpiz_user_address', result.address);
          setErrors((current) => ({ ...current, location: '', address: '' }));
          return;
        }

        setErrors((current) => ({
          ...current,
          location: '',
          address: result.message || (
            isUz
              ? 'Joylashuv topildi, lekin manzilni avtomatik yozib bo‘lmadi. Qo‘lda kiriting.'
              : 'Местоположение найдено, но адрес не удалось заполнить автоматически. Введите его вручную.'
          ),
        }));
      },
      () => {
        setLocating(false);
        setErrors((current) => ({
          ...current,
          location: isUz
            ? 'Joylashuvni aniqlab bo‘lmadi. Brauzerda ruxsat bering.'
            : 'Не удалось определить местоположение. Разрешите доступ.',
        }));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 },
    );
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!details.name.trim()) next.name = isUz ? 'Ismingizni kiriting.' : 'Введите имя.';
    if (!/^\d{9}$/.test(details.phone)) {
      next.phone = isUz ? 'Telefon raqamini 9 ta raqam bilan kiriting.' : 'Введите 9 цифр номера.';
    }
    if (!cart.length) next.submit = isUz ? 'Savat bo‘sh.' : 'Корзина пуста.';
    if (!details.address.trim()) next.address = isUz ? 'Manzilni kiriting.' : 'Введите адрес.';
    if (!location) next.location = isUz ? 'Joylashuvni aniqlang.' : 'Определите местоположение.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildPayload = () => {
    const branch = branchList.find((item) => item.id === details.branchId);
    const comment = details.comment.trim();
    const baseAddress = details.address.trim();
    const address = comment ? `${baseAddress} | Izoh: ${comment}` : baseAddress;

    return {
      customerName: details.name.trim(),
      customerPhone: `+998${details.phone}`,
      items: cart.map((entry) => ({
        foodId: entry.item.id,
        title: isUz ? entry.item.name_uz : entry.item.name_ru,
        quantity: entry.quantity,
      })),
      orderType: 'delivery' as const,
      paymentType: details.payment,
      address,
      location,
      filialId: details.branchId,
      filialName: branch?.name || '',
      persons: 1,
      comment,
      source: 'website' as const,
    };
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting || !validate()) return;

    setSubmitting(true);
    setErrors({});
    localStorage.setItem('yalpiz_user_name', details.name.trim());
    localStorage.setItem('yalpiz_user_phone', `+998${details.phone}`);
    localStorage.setItem('yalpiz_user_address', details.address.trim());

    const payload = buildPayload();

    const result = await createOrder(payload);
    setSubmitting(false);
    if (!result.ok) {
      setErrors({ submit: result.message });
      return;
    }
    if (result.paymentUrl) {
      window.location.assign(result.paymentUrl);
      return;
    }

    onClearCart();
    setSuccessOrderId(result.orderId ? result.orderId.slice(-5) : '—');
  };

  const reset = () => {
    setSuccessOrderId('');
    setDetails(initialDetails());
    setErrors({});
    setLocation(null);
    setDeliveryPrice(null);
    setDeliveryPriceError('');
    onClose();
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label={isUz ? 'Savatni yopish' : 'Закрыть корзину'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            onClick={successOrderId ? reset : onClose}
            className="fixed inset-0 bg-black z-50"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-[#f7f5f0] shadow-2xl border-l border-brand-primary/10 flex flex-col"
          >
            <header className="p-5 sm:p-6 bg-white border-b border-brand-primary/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-primary" />
                <h2 id="cart-title" className="font-serif text-xl font-bold text-brand-dark">
                  {successOrderId
                    ? isUz ? 'Buyurtma tasdiqlandi' : 'Заказ подтверждён'
                    : isUz ? 'Savat va buyurtma' : 'Корзина и заказ'}
                </h2>
              </div>
              <button
                type="button"
                onClick={successOrderId ? reset : onClose}
                className="w-10 h-10 rounded-xl bg-brand-primary/5 hover:bg-brand-primary/10 flex items-center justify-center"
                aria-label={isUz ? 'Yopish' : 'Закрыть'}
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto">
              {successOrderId ? (
                <div className="min-h-[70vh] p-8 flex flex-col items-center justify-center text-center gap-5">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-11 h-11" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl font-bold">
                      {isUz ? 'Buyurtmangiz qabul qilindi!' : 'Ваш заказ принят!'}
                    </h3>
                    <p className="text-brand-muted text-sm">
                      {isUz ? 'Buyurtma raqami: ' : 'Номер заказа: '}<strong>{successOrderId}</strong>
                    </p>
                    <p className="text-brand-muted text-sm">
                      {isUz
                        ? 'Buyurtma Delever va Neon Alisa kassasiga yuborildi.'
                        : 'Заказ отправлен в Delever и кассу Neon Alisa.'}
                    </p>
                  </div>
                  <button type="button" onClick={reset} className="px-6 py-3 bg-brand-primary text-white font-bold rounded-xl">
                    {isUz ? 'Yopish' : 'Закрыть'}
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="min-h-[65vh] p-8 flex flex-col items-center justify-center text-center gap-4">
                  <ShoppingBag className="w-14 h-14 text-brand-primary/25" />
                  <h3 className="font-serif text-2xl font-bold">{isUz ? 'Savat bo‘sh' : 'Корзина пуста'}</h3>
                  <p className="text-brand-muted text-sm">{isUz ? 'Menyudan taom tanlang.' : 'Выберите блюда из меню.'}</p>
                  <button type="button" onClick={onClose} className="px-6 py-3 bg-brand-primary text-white font-bold rounded-xl">
                    {isUz ? 'Menyuga qaytish' : 'Вернуться в меню'}
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="p-4 sm:p-6 space-y-6">
                  <section className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold">{isUz ? 'Tanlangan taomlar' : 'Выбранные блюда'}</h3>
                      <button type="button" onClick={onClearCart} className="text-xs text-red-600 font-bold">
                        {isUz ? 'Savatni tozalash' : 'Очистить'}
                      </button>
                    </div>
                    {cart.map((entry) => {
                      const name = isUz ? entry.item.name_uz : entry.item.name_ru;
                      return (
                        <div key={entry.item.id} className="bg-white rounded-2xl border border-brand-primary/5 p-3 flex gap-3">
                          <img
                            src={thumb(entry.item.image, 180)}
                            alt={name}
                            onError={(event) => imgFallback(event, entry.item.image)}
                            className="w-20 h-20 object-cover rounded-xl bg-brand-primary/5"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between gap-2">
                              <h4 className="font-bold text-sm line-clamp-2">{name}</h4>
                              <button type="button" onClick={() => onRemoveItem(entry.item.id)} aria-label={isUz ? 'Olib tashlash' : 'Удалить'}>
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </button>
                            </div>
                            <p className="text-brand-primary font-extrabold text-sm mt-1">{price(entry.item.price * entry.quantity)}</p>
                            <div className="inline-flex items-center mt-2 bg-brand-primary text-white rounded-lg overflow-hidden">
                              <button type="button" onClick={() => onUpdateQuantity(entry.item.id, entry.quantity - 1)} className="p-2">
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-3 text-sm font-bold">{entry.quantity}</span>
                              <button type="button" onClick={() => onUpdateQuantity(entry.item.id, entry.quantity + 1)} className="p-2">
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </section>

                  <section className="space-y-4 bg-white rounded-2xl border border-brand-primary/5 p-4 sm:p-5">
                    <h3 className="font-bold">{isUz ? 'Buyurtma ma’lumotlari' : 'Данные заказа'}</h3>

                    <div className="rounded-xl border border-brand-primary/15 bg-brand-primary/5 p-3.5 text-sm text-brand-primary font-bold flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {isUz ? 'Sayt orqali faqat yetkazib berish mavjud' : 'На сайте доступна только доставка'}
                    </div>

                    <label className="block text-xs font-bold">
                      {isUz ? 'Ism' : 'Имя'}
                      <input
                        value={details.name}
                        onChange={(event) => setField('name', event.target.value)}
                        className={`mt-1 w-full p-3.5 rounded-xl border bg-brand-neutral/30 outline-none ${errors.name ? 'border-red-500' : 'border-brand-primary/10'}`}
                      />
                      {errors.name && <span className="text-red-600 text-xs mt-1 block">{errors.name}</span>}
                    </label>

                    <label className="block text-xs font-bold">
                      {isUz ? 'Telefon' : 'Телефон'}
                      <div className={`mt-1 flex items-center rounded-xl border bg-brand-neutral/30 ${errors.phone ? 'border-red-500' : 'border-brand-primary/10'}`}>
                        <span className="pl-3 text-sm font-bold text-brand-muted">+998</span>
                        <input
                          inputMode="numeric"
                          maxLength={9}
                          value={details.phone}
                          onChange={(event) => setField('phone', normalizeUzPhoneInput(event.target.value))}
                          placeholder="90 123 45 67"
                          className="w-full p-3.5 bg-transparent outline-none"
                        />
                      </div>
                      {errors.phone && <span className="text-red-600 text-xs mt-1 block">{errors.phone}</span>}
                    </label>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold">
                        {isUz ? 'Yetkazib berish manzili' : 'Адрес доставки'}
                        <textarea
                          rows={2}
                          value={details.address}
                          onChange={(event) => setField('address', event.target.value)}
                          className={`mt-1 w-full p-3.5 rounded-xl border bg-brand-neutral/30 outline-none ${errors.address ? 'border-red-500' : 'border-brand-primary/10'}`}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={detectLocation}
                        disabled={locating}
                        className={`w-full py-3 rounded-xl border font-bold text-sm inline-flex items-center justify-center gap-2 ${location ? 'border-brand-primary text-brand-primary bg-brand-primary/5' : 'border-brand-primary/10'}`}
                      >
                        <MapPin className="w-4 h-4" />
                        {locating
                          ? isUz ? 'Aniqlanmoqda…' : 'Определяется…'
                          : location
                            ? isUz ? 'Joylashuv aniqlandi' : 'Местоположение определено'
                            : isUz ? 'Joylashuvimni aniqlash' : 'Определить местоположение'}
                      </button>
                      {errors.location && <span className="text-red-600 text-xs block">{errors.location}</span>}
                      <a
                        href="https://www.openstreetmap.org/copyright"
                        target="_blank"
                        rel="noreferrer"
                        className="block text-[10px] text-brand-muted text-center hover:underline"
                      >
                        {isUz ? 'Manzil ma’lumoti © OpenStreetMap contributors' : 'Данные адреса © OpenStreetMap contributors'}
                      </a>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold block">{isUz ? 'To‘lov turi' : 'Способ оплаты'}</span>
                      <div className="grid grid-cols-2 gap-2">
                        {(['payme', 'click'] as const).map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setField('payment', method)}
                            className={`min-h-14 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 ${details.payment === method ? 'border-brand-primary bg-brand-primary/5 text-brand-primary ring-2 ring-brand-primary/10' : 'border-brand-primary/10'}`}
                          >
                            <img src={method === 'payme' ? '/payme.png' : '/click.png'} alt={method === 'payme' ? 'Payme' : 'Click'} className="h-5" />
                          </button>
                        ))}
                      </div>
                      {errors.payment && <span className="text-red-600 text-xs block">{errors.payment}</span>}
                    </div>

                    <label className="block text-xs font-bold">
                      {isUz ? 'Izoh' : 'Комментарий'}
                      <textarea
                        rows={2}
                        maxLength={300}
                        value={details.comment}
                        onChange={(event) => setField('comment', event.target.value)}
                        placeholder={isUz ? 'Masalan: piyozsiz, telefon qilib xabar bering…' : 'Например: без лука, позвоните заранее…'}
                        className="mt-1 w-full p-3.5 rounded-xl border border-brand-primary/10 bg-brand-neutral/30 outline-none"
                      />
                    </label>
                  </section>

                  <section className="bg-brand-dark text-white rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/70">{isUz ? 'Taomlar jami' : 'Итого за блюда'}</span>
                      <strong className="text-xl text-brand-accent">{price(subtotal)}</strong>
                    </div>
                    <div className="pt-3 border-t border-white/10 text-xs">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-white/70">{isUz ? 'Taxi narxi (haydovchiga naqd)' : 'Стоимость такси (наличными водителю)'}</span>
                        <strong>
                          {deliveryPriceLoading
                            ? isUz ? 'Hisoblanmoqda…' : 'Расчёт…'
                            : deliveryPrice !== null ? price(deliveryPrice) : '—'}
                        </strong>
                      </div>
                      {deliveryPriceError && <p className="mt-2 text-amber-300">{deliveryPriceError}</p>}
                      <p className="mt-2 text-white/55">
                        {isUz ? 'Click/Payme orqali faqat taomlar summasi to‘lanadi. Taxi puli haydovchiga alohida naqd beriladi.' : 'Через Click/Payme оплачиваются только блюда. Такси оплачивается водителю отдельно наличными.'}
                      </p>
                    </div>
                  </section>

                  {errors.submit && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center">{errors.submit}</div>}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-brand-primary hover:bg-brand-dark disabled:opacity-60 text-white font-bold rounded-2xl shadow-lg inline-flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <><span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />{isUz ? 'To‘lovga o‘tilmoqda…' : 'Переход к оплате…'}</>
                    ) : (
                      <>{isUz ? 'Buyurtma berish va onlayn to‘lash' : 'Заказать и оплатить онлайн'}</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
