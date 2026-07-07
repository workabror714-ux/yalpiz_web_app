import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, CheckCircle, MapPin, CreditCard, ShoppingBag, Landmark } from 'lucide-react';
import { CartItem, Language, OrderDetails } from '../types';
import { BRANCHES, TRANSLATIONS } from '../data';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, qty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  lang,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const t = TRANSLATIONS[lang];

  // Form State
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    name: localStorage.getItem('yalpiz_user_name') || '',
    phone: localStorage.getItem('yalpiz_user_phone') || '',
    type: 'delivery',
    address: localStorage.getItem('yalpiz_user_address') || '',
    branchId: BRANCHES[0]?.id || '',
    payment: 'payme',
    comment: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);

  // Totals calculations
  const subtotal = cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);
  const deliveryCost = 0; // Free delivery as per marquee
  const total = subtotal + deliveryCost;

  const formatPrice = (price: number) => {
    return price.toLocaleString('uz-UZ') + ' ' + t.currency;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOrderDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleTypeToggle = (type: 'delivery' | 'pickup') => {
    setOrderDetails((prev) => ({
      ...prev,
      type,
    }));
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!orderDetails.name.trim()) {
      newErrors.name = lang === 'uz' ? 'Ismingizni kiriting' : 'Введите ваше имя';
    }
    if (!orderDetails.phone.trim() || orderDetails.phone.length < 7) {
      newErrors.phone = lang === 'uz' ? 'Telefon raqamini kiriting' : 'Введите номер телефона';
    }
    if (orderDetails.type === 'delivery' && !orderDetails.address.trim()) {
      newErrors.address = lang === 'uz' ? 'Yetkazib berish manzilini kiriting' : 'Введите адрес доставки';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Save profile info to local storage for future orders
    localStorage.setItem('yalpiz_user_name', orderDetails.name);
    localStorage.setItem('yalpiz_user_phone', orderDetails.phone);
    if (orderDetails.type === 'delivery') {
      localStorage.setItem('yalpiz_user_address', orderDetails.address);
    }

    // Simulate order placement
    setTimeout(() => {
      const orderNum = Math.floor(10000 + Math.random() * 90000).toString();
      
      // Save order details to order history!
      const orderItems = cart.map(c => `${c.quantity} x ${lang === 'uz' ? c.item.name_uz : c.item.name_ru}`).join(', ');
      
      const newOrder = {
        id: orderNum,
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        items: orderItems,
        total: total,
        status: 'preparing',
        type: orderDetails.type
      };
      
      const savedOrders = localStorage.getItem('yalpiz_order_history');
      const parsedOrders = savedOrders ? JSON.parse(savedOrders) : [];
      localStorage.setItem('yalpiz_order_history', JSON.stringify([newOrder, ...parsedOrders]));

      setOrderSuccessId(orderNum);
      setIsSubmitting(false);
      onClearCart();
    }, 1500);
  };

  const resetOrderProcess = () => {
    setOrderSuccessId(null);
    setOrderDetails({
      name: localStorage.getItem('yalpiz_user_name') || '',
      phone: localStorage.getItem('yalpiz_user_phone') || '',
      type: 'delivery',
      address: localStorage.getItem('yalpiz_user_address') || '',
      branchId: BRANCHES[0]?.id || '',
      payment: 'payme',
      comment: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            id="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={orderSuccessId ? resetOrderProcess : onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Drawer Wrapper */}
          <motion.div
            id="cart-drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35 }}
            className="fixed inset-y-0 right-0 max-w-lg w-full bg-[#f7f5f0] shadow-2xl z-50 flex flex-col h-full border-l border-brand-primary/10"
          >
            
            {/* Header */}
            <div className="p-6 border-b border-brand-primary/10 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-primary" />
                <h2 className="font-serif text-xl font-bold text-brand-dark">
                  {orderSuccessId ? t.orderSuccess : t.cartTitle}
                </h2>
              </div>
              <button
                id="close-cart-btn"
                onClick={orderSuccessId ? resetOrderProcess : onClose}
                className="w-10 h-10 rounded-xl bg-brand-primary/5 hover:bg-brand-primary/10 text-brand-dark flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-grow overflow-y-auto no-scrollbar">
              {orderSuccessId ? (
                
                /* Success Screen */
                <motion.div
                  id="checkout-success-view"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 text-center space-y-6 flex flex-col items-center justify-center min-h-[60vh]"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                    <CheckCircle className="w-10 h-10 stroke-[2.5]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl font-bold text-brand-dark">
                      {t.orderSuccess}
                    </h3>
                    <p className="font-sans text-brand-muted text-sm max-w-sm">
                      {t.orderSuccessSub}<strong>{orderSuccessId}</strong>
                    </p>
                  </div>

                  {/* Summary of checkout steps */}
                  <div className="bg-white p-6 rounded-2xl border border-brand-primary/5 w-full text-left space-y-3 font-sans text-xs sm:text-sm text-brand-muted">
                    <div className="flex items-center gap-2 text-brand-dark font-bold border-b border-brand-primary/5 pb-2">
                      <span>{lang === 'uz' ? 'Kutilayotgan harakatlar:' : 'Что будет дальше:'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-brand-primary/5 text-brand-primary flex items-center justify-center font-bold text-[10px]">1</span>
                      <span>{lang === 'uz' ? 'Operatorimiz 5 daqiqada sizga aloqaga chiqadi.' : 'Наш оператор свяжется с вами в течение 5 минут.'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-brand-primary/5 text-brand-primary flex items-center justify-center font-bold text-[10px]">2</span>
                      <span>{lang === 'uz' ? 'Taom pishirilgach, kuryerga topshiriladi.' : 'После приготовления заказ будет передан курьеру.'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-brand-primary/5 text-brand-primary flex items-center justify-center font-bold text-[10px]">3</span>
                      <span>{lang === 'uz' ? 'Eshigingizgacha issiqqina kuryer yetkazadi.' : 'Курьер привезет заказ горячим до вашей двери.'}</span>
                    </div>
                  </div>

                  <button
                    id="success-back-btn"
                    onClick={resetOrderProcess}
                    className="w-full py-4 bg-brand-primary hover:bg-brand-dark text-white rounded-2xl font-semibold shadow-md transition-all duration-200 cursor-pointer"
                  >
                    {t.backToMenu}
                  </button>
                </motion.div>

              ) : cart.length === 0 ? (
                
                /* Empty Cart Screen */
                <div id="cart-empty-view" className="p-8 text-center space-y-6 flex flex-col items-center justify-center min-h-[50vh]">
                  <div className="w-20 h-20 rounded-full bg-brand-primary/5 flex items-center justify-center text-brand-muted">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-serif text-lg font-bold text-brand-dark">
                      {lang === 'uz' ? 'Savatingiz bo‘sh' : 'Ваша корзина пуста'}
                    </p>
                    <p className="font-sans text-brand-muted text-sm max-w-xs mx-auto">
                      {t.cartEmpty}
                    </p>
                  </div>
                  <button
                    id="cart-empty-back-btn"
                    onClick={onClose}
                    className="px-6 py-3 bg-brand-primary hover:bg-brand-dark text-white text-sm font-semibold rounded-xl shadow-sm cursor-pointer transition-colors"
                  >
                    {lang === 'uz' ? 'Xarid qilishni davom etish' : 'Перейти в меню'}
                  </button>
                </div>

              ) : (

                /* Cart Contents & Checkout Form */
                <div id="cart-loaded-view" className="p-6 space-y-8">
                  
                  {/* Selected Products list */}
                  <div className="space-y-3">
                    <h3 className="font-serif text-base font-bold text-brand-dark border-b border-brand-primary/5 pb-2">
                      {lang === 'uz' ? 'Tanlangan taomlar' : 'Выбранные блюда'}
                    </h3>
                    
                    <div className="divide-y divide-brand-primary/5">
                      {cart.map((cartItem) => {
                        const item = cartItem.item;
                        const dishName = lang === 'uz' ? item.name_uz : item.name_ru;
                        return (
                          <div
                            key={item.id}
                            id={`cart-item-row-${item.id}`}
                            className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 group"
                          >
                            
                            {/* Small product image */}
                            <img
                              src={item.image}
                              alt={dishName}
                              className="w-16 h-16 rounded-xl object-cover border border-brand-primary/5"
                              referrerPolicy="no-referrer"
                            />

                            {/* Details & actions */}
                            <div className="flex-grow min-w-0">
                              <span className="font-sans font-bold text-brand-dark block text-sm sm:text-base truncate">
                                {dishName}
                              </span>
                              <span className="font-mono text-xs text-brand-primary font-bold mt-1 block">
                                {formatPrice(item.price)}
                              </span>
                            </div>

                            {/* Qty Stepper */}
                            <div className="flex items-center bg-white border border-brand-primary/10 rounded-xl overflow-hidden shadow-xs">
                              <button
                                id={`cart-stepper-decrease-${item.id}`}
                                onClick={() => onUpdateQuantity(item.id, cartItem.quantity - 1)}
                                className="p-1.5 hover:bg-brand-primary/5 text-brand-dark transition-colors cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-2 text-xs font-bold min-w-[20px] text-center select-none">
                                {cartItem.quantity}
                              </span>
                              <button
                                id={`cart-stepper-increase-${item.id}`}
                                onClick={() => onUpdateQuantity(item.id, cartItem.quantity + 1)}
                                className="p-1.5 hover:bg-brand-primary/5 text-brand-dark transition-colors cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Delete Button */}
                            <button
                              id={`cart-remove-item-${item.id}`}
                              onClick={() => onRemoveItem(item.id)}
                              className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                          </div>
                        );
                      })}
                    </div>

                  </div>

                  {/* Delivery vs Pickup Toggle */}
                  <div className="space-y-3">
                    <label className="font-serif text-base font-bold text-brand-dark block">
                      {t.orderType}
                    </label>
                    <div className="grid grid-cols-2 gap-2 bg-white p-1 rounded-2xl border border-brand-primary/10">
                      <button
                        id="order-type-delivery"
                        type="button"
                        onClick={() => handleTypeToggle('delivery')}
                        className={`py-3 rounded-xl font-sans text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                          orderDetails.type === 'delivery'
                            ? 'bg-brand-primary text-white shadow-sm'
                            : 'text-brand-dark/70 hover:text-brand-primary'
                        }`}
                      >
                        {t.typeDelivery}
                      </button>
                      <button
                        id="order-type-pickup"
                        type="button"
                        onClick={() => handleTypeToggle('pickup')}
                        className={`py-3 rounded-xl font-sans text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                          orderDetails.type === 'pickup'
                            ? 'bg-brand-primary text-white shadow-sm'
                            : 'text-brand-dark/70 hover:text-brand-primary'
                        }`}
                      >
                        {t.typePickup}
                      </button>
                    </div>
                  </div>

                  {/* Checkout Form */}
                  <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                    
                    <h3 className="font-serif text-base font-bold text-brand-dark border-b border-brand-primary/5 pb-2 pt-2">
                      {t.checkoutTitle}
                    </h3>

                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-dark block">
                        {t.fullName} <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="checkout-name"
                        type="text"
                        name="name"
                        value={orderDetails.name}
                        onChange={handleInputChange}
                        placeholder={t.fullNamePlaceholder}
                        className={`w-full p-3.5 bg-white border rounded-xl text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent ${
                          errors.name ? 'border-red-500 ring-2 ring-red-500/15' : 'border-brand-primary/10'
                        }`}
                      />
                      {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-dark block">
                        {t.phoneLabel} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-sm font-sans font-bold text-brand-dark/60 select-none">
                          +998
                        </span>
                        <input
                          id="checkout-phone"
                          type="tel"
                          name="phone"
                          value={orderDetails.phone}
                          onChange={handleInputChange}
                          placeholder={t.phonePlaceholder}
                          className={`w-full pl-14 pr-3.5 py-3.5 bg-white border rounded-xl text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent ${
                            errors.phone ? 'border-red-500 ring-2 ring-red-500/15' : 'border-brand-primary/10'
                          }`}
                        />
                      </div>
                      {errors.phone && <p className="text-xs text-red-500 font-medium">{errors.phone}</p>}
                    </div>

                    {/* Conditional Delivery Address */}
                    {orderDetails.type === 'delivery' ? (
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-brand-dark block">
                          {t.addressLabel} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="absolute top-3.5 left-3.5 w-4 h-4 text-brand-muted" />
                          <textarea
                            id="checkout-address"
                            name="address"
                            rows={2}
                            value={orderDetails.address}
                            onChange={handleInputChange}
                            placeholder={t.addressPlaceholder}
                            className={`w-full pl-10 pr-3.5 py-3 bg-white border rounded-xl text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent leading-relaxed ${
                              errors.address ? 'border-red-500 ring-2 ring-red-500/15' : 'border-brand-primary/10'
                            }`}
                          />
                        </div>
                        {errors.address && <p className="text-xs text-red-500 font-medium">{errors.address}</p>}
                      </div>
                    ) : (
                      /* Conditional Branch Selection */
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-brand-dark block">
                          {t.selectBranch} <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="checkout-branch"
                          name="branchId"
                          value={orderDetails.branchId}
                          onChange={handleInputChange}
                          className="w-full p-3.5 bg-white border border-brand-primary/10 rounded-xl text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        >
                          {BRANCHES.map((b) => (
                            <option key={b.id} value={b.id}>
                              {lang === 'uz' ? b.name_uz : b.name_ru}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Payment Select */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-brand-dark block">
                        {t.paymentMethod}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        
                        {/* Payme select card */}
                        <button
                          id="payment-payme-btn"
                          type="button"
                          onClick={() => setOrderDetails((prev) => ({ ...prev, payment: 'payme' }))}
                          className={`p-3 rounded-xl border font-sans text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                            orderDetails.payment === 'payme'
                              ? 'bg-brand-primary/5 border-brand-primary text-brand-primary ring-2 ring-brand-primary/10'
                              : 'bg-white border-brand-primary/5 text-brand-dark/70 hover:bg-brand-primary/5'
                          }`}
                        >
                          <Landmark className="w-4 h-4 text-sky-500" />
                          <span>Payme</span>
                        </button>

                        {/* Click select card */}
                        <button
                          id="payment-click-btn"
                          type="button"
                          onClick={() => setOrderDetails((prev) => ({ ...prev, payment: 'click' }))}
                          className={`p-3 rounded-xl border font-sans text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                            orderDetails.payment === 'click'
                              ? 'bg-brand-primary/5 border-brand-primary text-brand-primary ring-2 ring-brand-primary/10'
                              : 'bg-white border-brand-primary/5 text-brand-dark/70 hover:bg-brand-primary/5'
                          }`}
                        >
                          <Landmark className="w-4 h-4 text-indigo-500" />
                          <span>Click</span>
                        </button>

                        {/* Cash select card */}
                        <button
                          id="payment-cash-btn"
                          type="button"
                          onClick={() => setOrderDetails((prev) => ({ ...prev, payment: 'cash' }))}
                          className={`p-3 rounded-xl border font-sans text-xs font-bold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                            orderDetails.payment === 'cash'
                              ? 'bg-brand-primary/5 border-brand-primary text-brand-primary ring-2 ring-brand-primary/10'
                              : 'bg-white border-brand-primary/5 text-brand-dark/70 hover:bg-brand-primary/5'
                          }`}
                        >
                          <CreditCard className="w-4 h-4 text-emerald-600" />
                          <span>{lang === 'uz' ? 'Naqd' : 'Наличные'}</span>
                        </button>

                      </div>
                    </div>

                    {/* Order comment */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-dark block">
                        {t.commentLabel}
                      </label>
                      <textarea
                        id="checkout-comment"
                        name="comment"
                        rows={1}
                        value={orderDetails.comment}
                        onChange={handleInputChange}
                        placeholder={t.commentPlaceholder}
                        className="w-full p-3.5 bg-white border border-brand-primary/10 rounded-xl text-brand-dark text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary leading-normal"
                      />
                    </div>

                    {/* Checkout Order Summary */}
                    <div className="bg-white p-5 rounded-2xl border border-brand-primary/5 space-y-3 pt-4">
                      <div className="flex items-center justify-between text-xs sm:text-sm text-brand-muted">
                        <span>{lang === 'uz' ? 'Taomlar summasi:' : 'Сумма блюд:'}</span>
                        <span className="font-semibold">{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs sm:text-sm text-brand-muted border-b border-brand-primary/5 pb-2">
                        <span>{t.cartDeliveryCost}</span>
                        <span className="text-brand-primary font-bold">{t.cartFree}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm sm:text-base font-extrabold text-brand-dark pt-1">
                        <span>{t.cartTotal}</span>
                        <span className="text-base sm:text-lg text-brand-primary font-sans font-black">
                          {formatPrice(total)}
                        </span>
                      </div>
                    </div>

                    {/* Submission Button */}
                    <button
                      id="checkout-submit-order-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-brand-primary hover:bg-brand-dark disabled:bg-brand-primary/50 text-white rounded-2xl font-semibold shadow-lg shadow-brand-primary/10 active:scale-98 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>{t.orderProcessing}</span>
                        </>
                      ) : (
                        <span>{t.submitOrder}</span>
                      )}
                    </button>

                  </form>

                </div>
              )}
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
