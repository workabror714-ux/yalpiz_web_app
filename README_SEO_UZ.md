# Yalpiz Restaurant — SEO deploy yo‘riqnomasi

## Tayyorlangan texnik SEO

- Asosiy canonical domen: `https://www.yalpiz-restaurant.uz/`
- O‘zbekcha title va meta-description
- Open Graph va Telegram/Facebook preview rasmi
- `Restaurant` JSON-LD structured data
- To‘g‘ri manzil, telefon, ish vaqti va koordinatalar
- `robots.txt`
- `sitemap.xml`
- favicon va PWA ikonkalari
- Bosh sahifada Google ko‘ra oladigan lokal SEO matni va FAQ
- Saytdan eski Mirobod filiali olib tashlandi
- Footer, manzil, telefon va ish vaqti bir xil qilindi
- Vercel uchun cache va xavfsizlik headerlari qo‘shildi

## 1. Deploy

```bash
npm ci
npm run build
```

Keyin GitHub’ga push qiling yoki Vercel’ga deploy qiling.

## 2. Vercel’da domenni bir xil qilish

Vercel → Project → Settings → Domains:

1. `www.yalpiz-restaurant.uz` ni primary domain qiling.
2. `yalpiz-restaurant.uz` ni `www.yalpiz-restaurant.uz` ga permanent redirect qiling.
3. Ikkala domen ham HTTPS bilan ishlayotganini tekshiring.

Tekshiruv:

```text
https://yalpiz-restaurant.uz
→ https://www.yalpiz-restaurant.uz/
```

## 3. Deploydan keyin ochilishi shart bo‘lgan URL’lar

```text
https://www.yalpiz-restaurant.uz/
https://www.yalpiz-restaurant.uz/robots.txt
https://www.yalpiz-restaurant.uz/sitemap.xml
https://www.yalpiz-restaurant.uz/og-cover.jpg
https://www.yalpiz-restaurant.uz/site.webmanifest
```

## 4. Google Search Console

1. Google Search Console’ni oching.
2. `Domain` property tanlang.
3. Domen sifatida `yalpiz-restaurant.uz` kiriting.
4. Google bergan DNS TXT yozuvni domen DNS paneliga qo‘shing.
5. Tasdiqlangach `Sitemaps` bo‘limiga kiring.
6. `sitemap.xml` yuboring.
7. `URL inspection` orqali `https://www.yalpiz-restaurant.uz/` ni tekshirib `Request indexing` bosing.

**Parol, token yoki SMS kodni hech kimga yubormang.**

## 5. Google Business Profile

Google Maps’da `Yalpiz` profilini toping. Profil egasi ekaningizni tekshiring yoki `Own this business?` orqali tasdiqlashni boshlang.

Ma’lumotlar aynan shunday bo‘lsin:

```text
Nomi: Yalpiz
Manzil: Toshkent sh., Shota Rustaveli ko‘chasi, 115-uy
Telefon: +998 95 193 98 98
Sayt: https://www.yalpiz-restaurant.uz/
Ish vaqti: Har kuni 10:00–00:00
Kategoriya: Restaurant / Family restaurant
```

## 6. Yandex Maps va 2GIS’dagi tafovutlarni tuzatish

Saytdagi rasmiy vaqt: `10:00–00:00`.

Hozir kataloglarda boshqa vaqt ko‘rinishi mumkin. Yandex Business va 2GIS biznes kabinetida quyidagilarni bir xil qiling:

```text
Yalpiz
Toshkent sh., Shota Rustaveli ko‘chasi, 115-uy
+998 95 193 98 98
Har kuni 10:00–00:00
https://www.yalpiz-restaurant.uz/
```

Instagram, Facebook va Telegram profiliga ham shu sayt havolasini qo‘shing.

## 7. Structured data tekshiruvi

Deploydan keyin Google Rich Results Test’da bosh sahifani tekshiring. `Restaurant` obyektida xato bo‘lmasligi kerak.

## 8. Keyingi eng kuchli SEO ishlari

1. Unsplash rasmlarini Yalpizning original restoran va taom rasmlariga almashtirish.
2. Google Business Profile’ni tasdiqlash.
3. Google Maps’da haqiqiy mijozlardan muntazam sharh olish.
4. Yandex Maps va 2GIS’dagi ish vaqti, sayt va telefonni bir xil qilish.
5. Search Console’da indeksatsiya va qidiruv so‘rovlarini har hafta tekshirish.
6. Keyinchalik alohida SEO sahifalar yaratish: menyu, yetkazib berish, banket va stol bron qilish.

## Muhim

Google’da birinchi o‘rin kafolatlanmaydi. Ushbu patch saytingizni qidiruv tizimlari uchun to‘g‘ri va tushunarli qiladi. Lokal reytingni Google Business Profile, kataloglardagi bir xil ma’lumotlar, original rasmlar, haqiqiy sharhlar va vaqt davomida yig‘iladigan obro‘ kuchaytiradi.
