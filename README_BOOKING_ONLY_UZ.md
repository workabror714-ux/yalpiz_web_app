# Yalpiz sayti — bron + Telegram bot rejimi

Bu versiyada saytning vazifasi aniq ajratildi:

- sayt: restoran haqida ma'lumot, menyuni ko'rish va joy band qilish;
- taom buyurtmasi: faqat `@restoran_buyurtma_bot` orqali;
- saytdagi savat, checkout, buyurtmalar tarixi va profil olib tashlandi.

## Asosiy o'zgarishlar

1. Header, hero, taom kartalari, taom oynasi, footer va mobil pastki navigatsiyadagi buyurtma tugmalari Telegram botni ochadi.
2. Mobil navigatsiya `Bosh sahifa / Menyu / Bron / Buyurtma` ko'rinishida ishlaydi.
3. `CartDrawer`, `ProfileMenu`, `ExtraModals`, eski `Hero` va `Promotions` komponentlari olib tashlandi.
4. Backend menyusi ishlamasa soxta demo taomlar ko'rsatilmaydi. Foydalanuvchiga bot yoki telefon taklif qilinadi.
5. Bron formasi kuchaytirildi:
   - telefon `+998` + 9 raqam formatida;
   - sana o'tgan kun bo'la olmaydi;
   - vaqt 10:00–23:59;
   - mehmonlar soni 1–300;
   - modal ochilganda orqa sahifa scroll qilmaydi;
   - `Escape` bilan yopiladi;
   - bron faqat xodim qo'ng'irog'idan keyin tasdiqlanishi yozildi.
6. SEO matnlari yangilandi:
   - `OrderAction` Telegram botga;
   - `ReserveAction` `#booking`ga;
   - saytda to'g'ridan-to'g'ri buyurtma berish haqidagi noto'g'ri matnlar olib tashlandi.

## Patch o'rnatish

Patchdagi fayllarni loyiha ildiziga nusxalang va mavjud fayllarni almashtiring.

`DELETE_FILES.txt` ichidagi eski komponentlarni o'chiring.

Keyin:

```bash
npm install
npm run build
git add .
git commit -m "Convert website to booking and Telegram ordering"
git push
```

## Vercel ENV

Menyu va bron backend bilan ishlashi uchun Vercel'da quyidagi qiymat saqlangan bo'lishi kerak:

```env
VITE_API_URL=https://food-order-system-0pj9.onrender.com
```

## Deploydan keyin tekshiruv

1. Desktop va mobil navbar bo'limlarga scroll qilishi.
2. Barcha `Buyurtma` tugmalari `@restoran_buyurtma_bot`ni ochishi.
3. Saytda savat, checkout, profil va buyurtmalar tarixi qolmaganligi.
4. Menyu backend ishlaganda real taomlar chiqishi.
5. Backend o'chirilganda demo menyu emas, xatolik oynasi chiqishi.
6. Bron formasida noto'g'ri telefon, o'tgan sana va ish vaqtidan tashqari vaqt o'tmasligi.
7. Bron yuborilganda backenddagi `/api/booking` ishlashi.
