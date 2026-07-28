#!/usr/bin/env python3
from pathlib import Path
import re
import shutil
import sys

ROOT = Path.cwd()


def fail(message: str) -> None:
    print(f"\nXATO: {message}")
    sys.exit(1)


def read(rel: str) -> tuple[Path, str]:
    path = ROOT / rel
    if not path.exists():
        fail(f"{rel} topilmadi. Skriptni yalpiz_web_app loyihasining root papkasida ishga tushiring.")
    return path, path.read_text(encoding="utf-8")


def save(path: Path, content: str) -> None:
    backup = path.with_suffix(path.suffix + ".before_delivery_only.bak")
    if not backup.exists():
        shutil.copy2(path, backup)
    path.write_text(content, encoding="utf-8")
    print(f"OK: {path.relative_to(ROOT)}")


def replace_once(content: str, old: str, new: str, label: str) -> str:
    count = content.count(old)
    if count != 1:
        fail(f"{label}: kutilgan blok {count} marta topildi (1 marta bo‘lishi kerak). GitHubdagi eng oxirgi versiyani tekshiring.")
    return content.replace(old, new, 1)


def regex_once(content: str, pattern: str, replacement: str, label: str) -> str:
    updated, count = re.subn(pattern, replacement, content, count=1, flags=re.S)
    if count != 1:
        fail(f"{label}: kutilgan blok topilmadi.")
    return updated


# 1) CartDrawer.tsx — faqat delivery + Click/Payme, Telegram tasdig‘i yo‘q
path, content = read("src/components/CartDrawer.tsx")
for line in ["  CreditCard,\n", "  RefreshCw,\n", "  Send,\n"]:
    content = content.replace(line, "")

content = replace_once(
    content,
    """import {
  Branch,
  calculateDeliveryPrice,
  checkWebsiteOrderConfirmation,
  createOrder,
  createWebsiteOrderConfirmation,
  fetchBranches,
} from '../api';""",
    """import {
  Branch,
  calculateDeliveryPrice,
  createOrder,
  fetchBranches,
} from '../api';""",
    "CartDrawer API importlari",
)

content = regex_once(
    content,
    r"\ninterface ConfirmationState \{.*?\n\}\n",
    "\n",
    "ConfirmationState interfeysi",
)
content = replace_once(content, "  type: 'pickup',", "  type: 'delivery',", "default order type")
content = replace_once(content, "  payment: 'cash',", "  payment: 'payme',", "default payment")
content = replace_once(
    content,
    "  const [confirmation, setConfirmation] = useState<ConfirmationState | null>(null);\n",
    "",
    "confirmation state",
)

content = regex_once(
    content,
    r"\n  useEffect\(\(\) => \{\n    if \(!confirmation.*?\n  \}, \[confirmation\?\.pendingOrderId, confirmation\?\.token, confirmation\?\.status, onClearCart\]\);\n",
    "\n",
    "Telegram status polling",
)
content = regex_once(
    content,
    r"\n  const selectType = \(type: 'delivery' \| 'pickup'\) => \{.*?\n  \};\n",
    "\n",
    "pickup/delivery selector funksiyasi",
)

content = replace_once(
    content,
    """    if (details.type === 'delivery') {
      if (!details.address.trim()) next.address = isUz ? 'Manzilni kiriting.' : 'Введите адрес.';
      if (!location) next.location = isUz ? 'Joylashuvni aniqlang.' : 'Определите местоположение.';
    }
    if (details.payment === 'cash' && details.type !== 'pickup') {
      next.payment = isUz ? 'Naqd to‘lov faqat olib ketishda.' : 'Наличные доступны только при самовывозе.';
    }""",
    """    if (!details.address.trim()) next.address = isUz ? 'Manzilni kiriting.' : 'Введите адрес.';
    if (!location) next.location = isUz ? 'Joylashuvni aniqlang.' : 'Определите местоположение.';""",
    "delivery validatsiyasi",
)
content = replace_once(
    content,
    """    const baseAddress = details.type === 'delivery'
      ? details.address.trim()
      : branch?.address || (isUz ? 'Yalpiz — Shota Rustaveli 115' : 'Yalpiz — Шота Руставели 115');""",
    "    const baseAddress = details.address.trim();",
    "delivery address payload",
)
content = replace_once(content, "      orderType: details.type,", "      orderType: 'delivery' as const,", "orderType payload")
content = replace_once(content, "      location: details.type === 'delivery' ? location : null,", "      location,", "location payload")
content = replace_once(
    content,
    "    if (details.type === 'delivery') localStorage.setItem('yalpiz_user_address', details.address.trim());",
    "    localStorage.setItem('yalpiz_user_address', details.address.trim());",
    "address localStorage",
)

content = replace_once(
    content,
    """    if (details.payment === 'cash' && details.type === 'pickup') {
      const result = await createWebsiteOrderConfirmation(payload);
      setSubmitting(false);
      if (!result.ok || !result.pendingOrderId || !result.confirmationToken || !result.confirmationUrl) {
        setErrors({ submit: result.message });
        return;
      }

      setConfirmation({
        pendingOrderId: result.pendingOrderId,
        token: result.confirmationToken,
        url: result.confirmationUrl,
        expiresAt: result.expiresAt || '',
        status: 'pending',
        message: result.message,
      });
      window.open(result.confirmationUrl, '_blank', 'noopener,noreferrer');
      return;
    }

""",
    "",
    "Telegram confirmation submit oqimi",
)
content = replace_once(content, "    setConfirmation(null);\n", "", "reset confirmation")
content = replace_once(content, "\n  const showConfirmation = confirmation && !successOrderId;\n", "\n", "showConfirmation")

content = replace_once(
    content,
    """                  {successOrderId
                    ? isUz ? 'Buyurtma tasdiqlandi' : 'Заказ подтверждён'
                    : showConfirmation
                      ? isUz ? 'Telegramda tasdiqlang' : 'Подтвердите в Telegram'
                      : isUz ? 'Savat va buyurtma' : 'Корзина и заказ'}""",
    """                  {successOrderId
                    ? isUz ? 'Buyurtma tasdiqlandi' : 'Заказ подтверждён'
                    : isUz ? 'Savat va buyurtma' : 'Корзина и заказ'}""",
    "drawer title",
)
content = regex_once(
    content,
    r"\n              \) : showConfirmation \? \(.*?\n              \) : cart\.length === 0 \? \(",
    "\n              ) : cart.length === 0 ? (",
    "Telegram confirmation UI",
)

content = replace_once(
    content,
    """                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => selectType('pickup')}
                        className={`py-3 rounded-xl border font-bold text-sm ${details.type === 'pickup' ? 'bg-brand-primary text-white border-brand-primary' : 'border-brand-primary/10'}`}
                      >
                        {isUz ? 'Olib ketish' : 'Самовывоз'}
                      </button>
                      <button
                        type="button"
                        onClick={() => selectType('delivery')}
                        className={`py-3 rounded-xl border font-bold text-sm ${details.type === 'delivery' ? 'bg-brand-primary text-white border-brand-primary' : 'border-brand-primary/10'}`}
                      >
                        {isUz ? 'Yetkazib berish' : 'Доставка'}
                      </button>
                    </div>""",
    """                    <div className="rounded-xl border border-brand-primary/15 bg-brand-primary/5 p-3.5 text-sm text-brand-primary font-bold flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {isUz ? 'Sayt orqali faqat yetkazib berish mavjud' : 'На сайте доступна только доставка'}
                    </div>""",
    "order type UI",
)

content = replace_once(
    content,
    """                    {details.type === 'delivery' ? (
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
                      </div>
                    ) : (
                      <label className="block text-xs font-bold">
                        {isUz ? 'Filial' : 'Филиал'}
                        <select
                          value={details.branchId}
                          onChange={(event) => setField('branchId', event.target.value)}
                          className="mt-1 w-full p-3.5 rounded-xl border border-brand-primary/10 bg-brand-neutral/30 outline-none"
                        >
                          {branchList.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
                        </select>
                      </label>
                    )}""",
    """                    <div className="space-y-2">
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
                    </div>""",
    "delivery address UI",
)

content = replace_once(
    content,
    """                      <div className="grid grid-cols-3 gap-2">
                        {(['payme', 'click', 'cash'] as const).map((method) => {
                          const disabled = method === 'cash' && details.type !== 'pickup';
                          return (
                            <button
                              key={method}
                              type="button"
                              disabled={disabled}
                              onClick={() => setField('payment', method)}
                              className={`min-h-14 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 disabled:opacity-40 ${details.payment === method ? 'border-brand-primary bg-brand-primary/5 text-brand-primary ring-2 ring-brand-primary/10' : 'border-brand-primary/10'}`}
                            >
                              {method === 'payme' ? <img src="/payme.png" alt="Payme" className="h-5" /> : method === 'click' ? <img src="/click.png" alt="Click" className="h-5" /> : <><CreditCard className="w-4 h-4" />{isUz ? 'Naqd' : 'Наличные'}</>}
                            </button>
                          );
                        })}
                      </div>""",
    """                      <div className="grid grid-cols-2 gap-2">
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
                      </div>""",
    "payment methods UI",
)

content = replace_once(
    content,
    """                    {details.type === 'delivery' && (
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
                          {isUz ? 'Click/Payme orqali faqat taomlar summasi to‘lanadi.' : 'Через Click/Payme оплачивается только сумма блюд.'}
                        </p>
                      </div>
                    )}""",
    """                    <div className="pt-3 border-t border-white/10 text-xs">
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
                    </div>""",
    "delivery total UI",
)

content = replace_once(
    content,
    """                  {details.payment === 'cash' && details.type === 'pickup' && (
                    <div className="rounded-2xl border border-[#229ED9]/25 bg-[#229ED9]/5 p-4 text-xs text-brand-dark leading-relaxed">
                      <strong className="block mb-1">{isUz ? 'Telegram tasdig‘i kerak' : 'Нужно подтверждение в Telegram'}</strong>
                      {isUz
                        ? 'Naqd buyurtma kassaga faqat Telegramdagi telefon raqami tasdiqlanib, buyurtma ma’qullangandan keyin yuboriladi.'
                        : 'Заказ за наличные попадёт на кассу только после проверки номера телефона и подтверждения в Telegram.'}
                    </div>
                  )}

""",
    "",
    "Telegram information block",
)

content = replace_once(
    content,
    """                    {submitting ? (
                      <><span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />{isUz ? 'Yuborilmoqda…' : 'Отправляется…'}</>
                    ) : details.payment === 'cash' ? (
                      <><Send className="w-5 h-5" />{isUz ? 'Telegram orqali tasdiqlash' : 'Подтвердить через Telegram'}</>
                    ) : (
                      <>{isUz ? 'Buyurtma berish va to‘lash' : 'Заказать и оплатить'}</>
                    )}""",
    """                    {submitting ? (
                      <><span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />{isUz ? 'To‘lovga o‘tilmoqda…' : 'Переход к оплате…'}</>
                    ) : (
                      <>{isUz ? 'Buyurtma berish va onlayn to‘lash' : 'Заказать и оплатить онлайн'}</>
                    )}""",
    "submit button",
)
save(path, content)

# 2) api.ts — Telegram confirmation API kodini olib tashlash
path, content = read("src/api.ts")
content = replace_once(content, "  orderType: 'delivery' | 'pickup';", "  orderType: 'delivery';", "CreateOrderPayload orderType")
content = replace_once(content, "  paymentType: 'payme' | 'click' | 'cash';", "  paymentType: 'payme' | 'click';", "CreateOrderPayload paymentType")
content = regex_once(
    content,
    r"\nexport interface WebsiteConfirmationResult \{.*?\nexport interface BookingPayload",
    "\nexport interface BookingPayload",
    "website confirmation API block",
)
save(path, content)

# 3) types.ts — frontend turini qat’iylashtirish
path, content = read("src/types.ts")
content = replace_once(content, "  type: 'delivery' | 'pickup';", "  type: 'delivery';", "OrderDetails type")
content = replace_once(content, "  payment: 'payme' | 'click' | 'cash';", "  payment: 'payme' | 'click';", "OrderDetails payment")
save(path, content)

# 4) App.tsx meta matni
path, content = read("src/App.tsx")
content = replace_once(
    content,
    "? 'Yalpiz — Shota Rustaveli 115 dagi oilaviy restoran. Menyu, sayt orqali buyurtma, yetkazib berish, olib ketish va joy band qilish.'",
    "? 'Yalpiz — Shota Rustaveli 115 dagi oilaviy restoran. Menyu, sayt orqali onlayn to‘lovli yetkazib berish va joy band qilish.'",
    "App uz meta",
)
content = replace_once(
    content,
    ": 'Yalpiz — семейный ресторан на Шота Руставели, 115. Меню, заказ на сайте, доставка, самовывоз и бронирование.';",
    ": 'Yalpiz — семейный ресторан на Шота Руставели, 115. Меню, доставка с онлайн-оплатой на сайте и бронирование.';",
    "App ru meta",
)
save(path, content)

# 5) DeliveryInfo.tsx — butun blokni aniq matn bilan yangilash
path, _ = read("src/components/DeliveryInfo.tsx")
delivery_info = """import { Bike, CheckCircle2, MapPin, ShieldCheck, ShoppingBag } from 'lucide-react';
import { Language } from '../types';

interface DeliveryInfoProps {
  lang: Language;
  onOrderClick: () => void;
}

export default function DeliveryInfo({ lang, onOrderClick }: DeliveryInfoProps) {
  const isUz = lang === 'uz';
  const steps = [
    {
      icon: ShoppingBag,
      titleUz: 'Menyudan tanlang',
      titleRu: 'Выберите блюда',
      textUz: 'Taomlarni savatga qo‘shing va miqdorini belgilang.',
      textRu: 'Добавьте блюда в корзину и укажите количество.',
    },
    {
      icon: MapPin,
      titleUz: 'Manzilni kiriting',
      titleRu: 'Укажите адрес',
      textUz: 'Yetkazib berish manzili va geolokatsiyangizni belgilang.',
      textRu: 'Укажите адрес доставки и свою геолокацию.',
    },
    {
      icon: ShieldCheck,
      titleUz: 'Onlayn to‘lang',
      titleRu: 'Оплатите онлайн',
      textUz: 'Taomlar uchun Click yoki Payme orqali xavfsiz to‘lov qiling.',
      textRu: 'Безопасно оплатите блюда через Click или Payme.',
    },
  ];

  return (
    <section id="delivery" className="py-16 bg-brand-neutral/50 border-y border-brand-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/5 rounded-full text-brand-primary font-bold text-xs uppercase tracking-widest">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isUz ? 'Sayt orqali buyurtma' : 'Заказ через сайт'}</span>
            </div>
            <div className="space-y-3">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark">
                {isUz ? 'Taomlarni saytdan yetkazib berishga buyurtma bering' : 'Закажите доставку блюд на сайте'}
              </h2>
              <p className="font-sans text-brand-muted text-sm sm:text-base leading-relaxed max-w-2xl">
                {isUz
                  ? 'Sayt orqali faqat yetkazib berish buyurtmasi qabul qilinadi. Taomlar uchun Click yoki Payme orqali oldindan onlayn to‘lov qilinadi.'
                  : 'На сайте принимаются только заказы на доставку. Блюда оплачиваются заранее онлайн через Click или Payme.'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {steps.map((step) => (
                <div key={step.titleUz} className="bg-white rounded-2xl border border-brand-primary/5 p-4 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-3"><step.icon className="w-5 h-5" /></div>
                  <h3 className="font-bold text-brand-dark text-sm">{isUz ? step.titleUz : step.titleRu}</h3>
                  <p className="text-brand-muted text-xs leading-relaxed mt-1">{isUz ? step.textUz : step.textRu}</p>
                </div>
              ))}
            </div>
            <button type="button" onClick={onOrderClick} className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-primary hover:bg-brand-dark text-white font-bold rounded-2xl transition-colors shadow-md">
              <ShoppingBag className="w-5 h-5" />
              {isUz ? 'Yetkazib berishga buyurtma berish' : 'Заказать доставку'}
            </button>
          </div>

          <div className="bg-brand-dark text-white rounded-[28px] p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-brand-accent/10 rounded-full blur-2xl" />
            <div className="relative space-y-6">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">{isUz ? 'Onlayn to‘lovli yetkazib berish' : 'Доставка с онлайн-оплатой'}</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 text-brand-accent flex items-center justify-center flex-shrink-0"><Bike className="w-5 h-5" /></div>
                  <div><h4 className="font-bold text-sm">{isUz ? 'Yetkazib berish' : 'Доставка'}</h4><p className="text-white/70 text-xs mt-1 leading-relaxed">{isUz ? 'Manzil va geolokatsiyani kiriting. Taomlar uchun Click yoki Payme orqali onlayn to‘lov qilinadi.' : 'Укажите адрес и геолокацию. Блюда оплачиваются онлайн через Click или Payme.'}</p></div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 text-brand-accent flex items-center justify-center flex-shrink-0"><MapPin className="w-5 h-5" /></div>
                  <div><h4 className="font-bold text-sm">{isUz ? 'Taxi narxi' : 'Стоимость такси'}</h4><p className="text-white/70 text-xs mt-1 leading-relaxed">{isUz ? 'Taxi narxi Millenium tizimidan aniq hisoblanadi va haydovchiga alohida naqd to‘lanadi.' : 'Стоимость такси точно рассчитывается системой Millenium и оплачивается водителю отдельно наличными.'}</p></div>
                </div>
              </div>
              <div className="pt-5 border-t border-white/10 text-xs text-white/60 flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-brand-accent flex-shrink-0" />{isUz ? 'Onlayn to‘lov tasdiqlangach buyurtma Delever va Neon Alisa kassasiga yuboriladi.' : 'После подтверждения онлайн-оплаты заказ отправляется в Delever и кассу Neon Alisa.'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
"""
save(path, delivery_info)

# 6) index.html SEO va fallback matnlari
path, content = read("index.html")
replacements = [
    (
        'content="Menyudan taom tanlang, sayt orqali yetkazib berish yoki olib ketish buyurtmasini rasmiylashtiring va joy band qiling. Har kuni 10:00–00:00."',
        'content="Menyudan taom tanlang, Click yoki Payme orqali onlayn to‘lab yetkazib berishga buyurtma bering va joy band qiling. Har kuni 10:00–00:00."',
        "OG description",
    ),
    (
        '"description": "Toshkent shahri, Shota Rustaveli ko‘chasi 115-uyda joylashgan oilaviy restoran. O‘zbek va turk taomlari, yetkazib berish, olib ketish, stol va banket bron qilish xizmatlari mavjud.",',
        '"description": "Toshkent shahri, Shota Rustaveli ko‘chasi 115-uyda joylashgan oilaviy restoran. O‘zbek va turk taomlari, onlayn to‘lovli yetkazib berish, stol va banket bron qilish xizmatlari mavjud.",',
        "JSON-LD description",
    ),
    (
        '          { "@type": "LocationFeatureSpecification", "name": "Yetkazib berish", "value": true },\n          { "@type": "LocationFeatureSpecification", "name": "Olib ketish", "value": true }',
        '          { "@type": "LocationFeatureSpecification", "name": "Onlayn to‘lovli yetkazib berish", "value": true }',
        "amenity delivery",
    ),
    (
        '"text": "Yetkazib berish yoki olib ketish buyurtmasini saytdagi menyu va savat orqali rasmiylashtirish mumkin. Naqd olib ketish buyurtmasi xavfsizlik uchun Telegram orqali tasdiqlanadi."',
        '"text": "Sayt orqali faqat yetkazib berish buyurtmasi qabul qilinadi. Taomlar uchun Click yoki Payme orqali oldindan onlayn to‘lov qilinadi."',
        "FAQ order answer",
    ),
    (
        'Menyu va narxlarni saytda ko‘rib, yetkazib berish yoki olib ketish buyurtmasini rasmiylashtirish mumkin. Restoran har kuni 10:00 dan 00:00 gacha ishlaydi.',
        'Menyu va narxlarni saytda ko‘rib, Click yoki Payme orqali onlayn to‘lab yetkazib berishga buyurtma berish mumkin. Restoran har kuni 10:00 dan 00:00 gacha ishlaydi.',
        "fallback order text",
    ),
]
for old, new, label in replacements:
    content = replace_once(content, old, new, label)
save(path, content)

print("\nFRONTEND PATCH TAYYOR ✅")
print("Keyingi buyruq: npm run build")
