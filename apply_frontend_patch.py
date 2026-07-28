#!/usr/bin/env python3
from pathlib import Path
import shutil
import sys

ROOT = Path.cwd()
SCRIPT_DIR = Path(__file__).resolve().parent
ASSETS_DIR = SCRIPT_DIR / "assets"

def fail(message: str) -> None:
    print(f"\nXATO: {message}")
    sys.exit(1)

def replace_once(content: str, old: str, new: str, label: str) -> str:
    count = content.count(old)
    if count != 1:
        fail(f"{label}: kutilgan blok {count} marta topildi; 1 marta bo‘lishi kerak.")
    return content.replace(old, new, 1)

api_path = ROOT / "src" / "api.ts"
cart_path = ROOT / "src" / "components" / "CartDrawer.tsx"
index_path = ROOT / "index.html"
public_dir = ROOT / "public"

for path in [api_path, cart_path, index_path]:
    if not path.exists():
        fail(f"{path.relative_to(ROOT)} topilmadi. Skriptni yalpiz_web_app root papkasida ishga tushiring.")

# api.ts
api = api_path.read_text(encoding="utf-8")
if "export async function reverseGeocode(" not in api:
    anchor = """export interface CreateOrderPayload {
"""
    block = """export interface ReverseGeocodeResult {
  ok: boolean;
  address: string;
  message: string;
  attribution?: string;
}

export async function reverseGeocode(
  location: { lat: number; lng: number },
  lang: 'uz' | 'ru',
): Promise<ReverseGeocodeResult> {
  if (!API) {
    return { ok: false, address: '', message: 'Backend sozlanmagan.' };
  }

  try {
    const query = new URLSearchParams({
      lat: String(location.lat),
      lng: String(location.lng),
      lang,
    });
    const response = await fetch(`${API}/api/geocode/reverse?${query.toString()}`, {
      headers: { Accept: 'application/json' },
    });
    const data = await response.json().catch(() => ({} as Record<string, unknown>));

    if (!response.ok) {
      return {
        ok: false,
        address: '',
        message: String(data?.message || `Xato (${response.status})`),
      };
    }

    return {
      ok: true,
      address: String(data?.address || '').trim(),
      message: '',
      attribution: String(data?.attribution || '© OpenStreetMap contributors'),
    };
  } catch {
    return {
      ok: false,
      address: '',
      message: 'Manzilni avtomatik aniqlab bo‘lmadi.',
    };
  }
}

"""
    if anchor not in api:
        fail("api.ts ichida CreateOrderPayload topilmadi.")
    backup = api_path.with_suffix(".ts.before_location_fix.bak")
    if not backup.exists():
        shutil.copy2(api_path, backup)
    api = api.replace(anchor, block + anchor, 1)
    api_path.write_text(api, encoding="utf-8")
    print("OK: src/api.ts")
else:
    print("SKIP: reverseGeocode oldin qo‘shilgan")

# CartDrawer.tsx
cart = cart_path.read_text(encoding="utf-8")
if "reverseGeocode," not in cart:
    cart = replace_once(
        cart,
        """  calculateDeliveryPrice,
  createOrder,
  fetchBranches,
""",
        """  calculateDeliveryPrice,
  createOrder,
  fetchBranches,
  reverseGeocode,
""",
        "CartDrawer import",
    )

old_detect = """  const detectLocation = () => {
    if (!navigator.geolocation) {
      setErrors((current) => ({
        ...current,
        location: isUz ? 'Brauzer geolokatsiyani qo‘llamaydi.' : 'Браузер не поддерживает геолокацию.',
      }));
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocating(false);
        setErrors((current) => ({ ...current, location: '' }));
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
      { enableHighAccuracy: true, timeout: 12000 },
    );
  };
"""

new_detect = """  const detectLocation = () => {
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
"""

if old_detect in cart:
    backup = cart_path.with_suffix(".tsx.before_location_fix.bak")
    if not backup.exists():
        shutil.copy2(cart_path, backup)
    cart = cart.replace(old_detect, new_detect, 1)
else:
    if "const result = await reverseGeocode(coordinates, lang);" not in cart:
        fail("CartDrawer detectLocation bloki topilmadi.")

old_attribution = """                      {errors.location && <span className="text-red-600 text-xs block">{errors.location}</span>}
                    </div>
"""
new_attribution = """                      {errors.location && <span className="text-red-600 text-xs block">{errors.location}</span>}
                      <a
                        href="https://www.openstreetmap.org/copyright"
                        target="_blank"
                        rel="noreferrer"
                        className="block text-[10px] text-brand-muted text-center hover:underline"
                      >
                        {isUz ? 'Manzil ma’lumoti © OpenStreetMap contributors' : 'Данные адреса © OpenStreetMap contributors'}
                      </a>
                    </div>
"""
if old_attribution in cart:
    cart = cart.replace(old_attribution, new_attribution, 1)
elif "OpenStreetMap contributors" not in cart:
    fail("CartDrawer attribution joyi topilmadi.")

cart_path.write_text(cart, encoding="utf-8")
print("OK: src/components/CartDrawer.tsx")

# index.html favicon tags
index = index_path.read_text(encoding="utf-8")
old_links = """    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
"""
new_links = """    <link rel="icon" href="/favicon.ico?v=3" sizes="any" />
    <link rel="shortcut icon" href="/favicon.ico?v=3" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=3" />
    <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png?v=3" />
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png?v=3" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=3" />
    <link rel="manifest" href="/site.webmanifest?v=3" />
"""
if old_links in index:
    backup = index_path.with_suffix(".html.before_favicon_fix.bak")
    if not backup.exists():
        shutil.copy2(index_path, backup)
    index = index.replace(old_links, new_links, 1)
    index_path.write_text(index, encoding="utf-8")
    print("OK: index.html")
elif 'href="/favicon.ico?v=3"' not in index:
    fail("index.html favicon bloki topilmadi.")
else:
    print("SKIP: favicon linklari oldin yangilangan")

# Copy favicon assets
public_dir.mkdir(parents=True, exist_ok=True)
for source in ASSETS_DIR.iterdir():
    if source.is_file():
        shutil.copy2(source, public_dir / source.name)
        print(f"OK: public/{source.name}")

print("\nFRONTEND PATCH TAYYOR ✅")
print("Keyingi tekshiruv: npm run build")
