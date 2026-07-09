import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ClipboardList, User, Save, RefreshCw, Clock, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { fetchMyOrders, MyOrder } from '../api';

interface ExtraModalsProps {
  lang: Language;
  activeModal: 'orders' | 'profile' | null;
  onClose: () => void;
}

export default function ExtraModals({ lang, activeModal, onClose }: ExtraModalsProps) {
  const isUz = lang === 'uz';

  // Profile States
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Orders History State
  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Profil ma'lumotlari (localStorage)
  useEffect(() => {
    setProfileName(localStorage.getItem('yalpiz_user_name') || '');
    setProfilePhone(localStorage.getItem('yalpiz_user_phone') || '');
    setProfileAddress(localStorage.getItem('yalpiz_user_address') || '');
  }, [activeModal]);

  // Buyurtmalar — backend'dan (telefon bo'yicha), modal ochilganda
  useEffect(() => {
    if (activeModal !== 'orders') return;
    const phone = localStorage.getItem('yalpiz_user_phone') || '';
    if (!phone) { setOrders([]); return; }
    setOrdersLoading(true);
    fetchMyOrders(phone).then((list) => {
      setOrders(list);
      setOrdersLoading(false);
    });
  }, [activeModal]);

  // Handle Profile Save
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('yalpiz_user_name', profileName);
    localStorage.setItem('yalpiz_user_phone', profilePhone);
    localStorage.setItem('yalpiz_user_address', profileAddress);

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  // Buyurtmalarni qayta yuklash
  const handleRefreshOrders = () => {
    const phone = localStorage.getItem('yalpiz_user_phone') || '';
    if (!phone) return;
    setOrdersLoading(true);
    fetchMyOrders(phone).then((list) => {
      setOrders(list);
      setOrdersLoading(false);
    });
  };

  // Buyurtma holati uchun rang/matn/ikonka
  const statusBadge = (status: MyOrder['status']) => {
    const map = {
      new:       { cls: 'bg-amber-50 text-amber-600',     uz: 'Qabul qilindi', ru: 'Принят',     pulse: 'animate-pulse', done: false },
      preparing: { cls: 'bg-amber-50 text-amber-600',     uz: 'Tayyorlanmoqda', ru: 'Готовится', pulse: 'animate-pulse', done: false },
      on_way:    { cls: 'bg-blue-50 text-blue-600',       uz: "Yo'lda",         ru: 'В пути',     pulse: '',              done: false },
      delivered: { cls: 'bg-emerald-50 text-emerald-600', uz: 'Yetkazildi',     ru: 'Доставлено', pulse: '',              done: true },
      cancelled: { cls: 'bg-red-50 text-red-500',         uz: 'Bekor qilindi',  ru: 'Отменён',    pulse: '',              done: false },
    };
    const s = map[status] || map.new;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 ${s.cls} rounded-full font-bold text-[10px] ${s.pulse}`}>
        {s.done ? <CheckCircle2 className="w-3 h-3 fill-current" /> : status === 'cancelled' ? <X className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
        {isUz ? s.uz : s.ru}
      </span>
    );
  };

  if (!activeModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black cursor-pointer"
        />

        {/* Modal Panel container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-[#f7f5f0] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-brand-primary/10 max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-5 bg-white border-b border-brand-primary/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {activeModal === 'orders' ? (
                <>
                  <ClipboardList className="w-5 h-5 text-brand-primary" />
                  <h3 className="font-serif text-lg font-bold text-brand-dark">
                    {isUz ? 'Buyurtmalar tarixi' : 'История заказов'}
                  </h3>
                </>
              ) : (
                <>
                  <User className="w-5 h-5 text-brand-primary" />
                  <h3 className="font-serif text-lg font-bold text-brand-dark">
                    {isUz ? 'Foydalanuvchi profili' : 'Профиль гостя'}
                  </h3>
                </>
              )}
            </div>
            <button
              id="close-extra-modal-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-brand-primary/5 hover:bg-brand-primary/10 text-brand-dark flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Content Scroll */}
          <div className="p-6 overflow-y-auto no-scrollbar flex-grow space-y-4">
            
            {/* ORDERS MODAL content */}
            {activeModal === 'orders' && (
              <div className="space-y-4">
                {ordersLoading ? (
                  <div className="text-center py-8 space-y-3">
                    <RefreshCw className="w-10 h-10 text-brand-muted/40 mx-auto animate-spin" />
                    <p className="font-sans text-brand-muted text-sm">
                      {isUz ? 'Yuklanmoqda…' : 'Загрузка…'}
                    </p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8 space-y-3">
                    <ClipboardList className="w-12 h-12 text-brand-muted/40 mx-auto" />
                    <p className="font-sans text-brand-muted text-sm">
                      {localStorage.getItem('yalpiz_user_phone')
                        ? (isUz ? 'Hozircha buyurtmalar mavjud emas.' : 'У вас пока нет оформленных заказов.')
                        : (isUz ? "Buyurtmalar telefon raqamingiz bo'yicha ko'rsatiladi. Avval buyurtma bering." : 'Заказы отображаются по номеру телефона. Сначала оформите заказ.')}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {orders.map((order, i) => (
                        <div
                          key={order.id || i}
                          className="bg-white p-4 rounded-2xl border border-brand-primary/5 space-y-3"
                        >
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="text-brand-primary font-mono">#YALPIZ-{order.id}</span>
                            <span className="text-brand-muted">{order.date}</span>
                          </div>

                          <p className="font-sans text-brand-dark text-xs sm:text-sm font-medium leading-relaxed">
                            {order.items}
                          </p>

                          <div className="flex items-center justify-between border-t border-brand-primary/5 pt-2 text-xs">
                            <div className="flex items-center gap-1.5">
                              {statusBadge(order.status)}
                            </div>
                            <span className="font-extrabold text-brand-dark">
                              {order.total.toLocaleString('uz-UZ')} {isUz ? 'so‘m' : 'сум'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      id="refresh-orders-btn"
                      onClick={handleRefreshOrders}
                      className="w-full py-3 bg-brand-primary/5 hover:bg-brand-primary/10 text-brand-primary text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer mt-4"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>{isUz ? 'Yangilash' : 'Обновить'}</span>
                    </button>
                  </>
                )}
              </div>
            )}

            {/* PROFILE MODAL content */}
            {activeModal === 'profile' && (
              <form onSubmit={handleProfileSave} className="space-y-4 font-sans text-sm">
                
                {/* Profile Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-dark block">
                    {isUz ? 'Ism va Familiyangiz' : 'Ваше Имя и Фамилия'}
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Alisher Karimov"
                    className="w-full p-3 bg-white border border-brand-primary/10 rounded-xl text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>

                {/* Profile Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-dark block">
                    {isUz ? 'Telefon raqamingiz' : 'Номер телефона'}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-sm font-bold text-brand-dark/50 select-none">
                      +998
                    </span>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="99 123 45 67"
                      className="w-full pl-14 pr-3.5 py-3 bg-white border border-brand-primary/10 rounded-xl text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                </div>

                {/* Profile Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-dark block">
                    {isUz ? 'Doimiy manzil (Dostavka uchun)' : 'Адрес доставки по умолчанию'}
                  </label>
                  <textarea
                    rows={2}
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    placeholder={isUz ? 'Tuman, ko‘cha, uy' : 'Район, улица, дом'}
                    className="w-full p-3 bg-white border border-brand-primary/10 rounded-xl text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary leading-normal"
                  />
                </div>

                {/* Action button */}
                <button
                  id="profile-save-btn"
                  type="submit"
                  className="w-full py-3.5 bg-brand-primary hover:bg-brand-dark text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer pt-3"
                >
                  {saveSuccess ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-brand-accent fill-current" />
                      <span>{isUz ? 'Saqlandi!' : 'Сохранено!'}</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{isUz ? 'Ma’lumotlarni saqlash' : 'Сохранить данные'}</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-brand-muted text-center leading-normal max-w-xs mx-auto">
                  {isUz
                    ? 'Saqlangan ma’lumotlar buyurtma rasmiylashtirishda avtomatik to‘ldiriladi.'
                    : 'Сохраненные данные будут автоматически подставляться при оформлении заказа.'}
                </p>

              </form>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
