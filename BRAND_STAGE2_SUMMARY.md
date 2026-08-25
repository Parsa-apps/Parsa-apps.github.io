# مرحله ۲ — هویت برند ✅ تکمیل شد

تاریخ: 2026-08-14

## خلاصه اجرایی
هویت بصری جدید در دو سطح ساخته شد:
1. **برند مادر: پارسا اپس** — استودیوی پرمیوم ساخت تجربه دیجیتال خلاقانه
2. **برند محصول: جزیره فندقی** — اپ کودک با دنیای جادویی امن

تمام خروجی‌ها وکتور + رستر + شبکه اجتماعی آماده و روی سایت اعمال شد.

---

## 🎨 لوگوی اصلی: پارسا اپس (برای شرکت/برند)

**کانسپت نهایی:**
حرف P به شکل فندق — پوسته بیرونی دور P می‌پیچد، برگ فیروزه‌ای کوچک برای زندگی، نقطه طلایی برای جرقه ایده.

**فایل‌های تحویل:**
- `assets/logo.svg` — وکتور آیکون اصلی (جدید) — استفاده در هدر سایت
- `assets/brand/parsa-apps-icon.svg` — وکتور تمیز آیکون
- `assets/logo.png` (512) — رستر اصلی سایت
- `assets/brand/parsa-apps-icon-1024.png` — سورس 1024 اصلی
- `assets/brand/parsa-apps-icon-512.png` / 192 / 180 — سایزهای استاندارد
- `assets/brand/parsa-apps-logo-horizontal.svg` — افقی با متن فارسی روشن
- `assets/brand/parsa-apps-logo-horizontal-light.svg` — افقی برای بک تیره
- `assets/brand/parsa-apps-logo-vertical.svg` — عمودی

**رنگ:**
- Ink #0F172A / Orange #EF7A1A / Light #FBD06F / Leaf #2BB3A0 / Sand #FFF6EB

**کاربرد:** سایت، گیت‌هاب، امضا ایمیل، پاورپوینت

---

## 🏝️ لوگوی محصول: جزیره فندقی (برای اپلیکیشن)

**دو آیکون استراتژیک:**

**A) Mascot (پیشنهاد اصلی برای استور):**
- فندق بامزه با کلاه برگی، چشم براق، پاپیون آبی، فانوس
- حس صمیمی، قابل اعتماد
- فایل: `assets/brand/jazireh-fandoghi-app-icon-1024.png` → 512 / 192

**B) Island (آلترناتیو / سایت):**
- جزیره شناور از نصف فندق، خانه درختی چوبی، دو درخت، خزه، ریشه
- حس ماجراجویی
- فایل: `assets/brand/jazireh-fandoghi-island-icon-1024.png` → `jazireh-island-512.png`

**وکتور محصول:**
- `assets/brand/jazireh-fandoghi-icon.svg` — آیکون ساده‌شده جزیره برای سایت
- `assets/brand/jazireh-fandoghi-logo.svg` — لوگوی افقی با متن فارسی

**جایگزینی در سایت:**
- `assets/island-logo.jpg` → جدید 800px island icon
- `assets/images/mascot-fandoghi.jpg` → جدید mascot 600px
- `assets/images/island-mascot.jpg` → جدید island scene

---

## 📱 آیکون اپ

**پک کامل App Icon:**
- iOS/Android: 1024 منبع، 512، 192، 180 apple-touch
- مسکات بامزه پیشنهاد اصلی چون در استور بیشتر کلیک می‌گیرد و چهره دارد
- جزیره به عنوان آیکون دوم برای لودینگ اسکرین، اوپن گراف، داخل اپ
- فایل‌ها: `assets/brand/jazireh-fandoghi-app-icon*.png` + `jazireh-island-*.png`

**چک‌لیست استور:**
- [x] گوشه گرد خودکار iOS رعایت شده (طرح مربع با حاشیه امن)
- [x] بدون متن روی آیکون
- [x] بک‌گراند روشن، کنتراست بالا
- [x] نسخه 512 برای PWA manifest

---

## 🔖 favicon سایت

**جدید:**
- `assets/favicon.svg` — وکتور P + فندق مینیمال، بک دارک #0F172A
- `assets/icons/favicon-32.png` / 16.png — fallback PNG
- `assets/icons/icon-192.png` / 512.png — برای PWA
- `favicon.ico` روت — شامل 16+32+192 برای مرورگر قدیمی
- `site.webmanifest` — آپدیت شده با 4 آیکون (192 any, 512 maskable, 512 برند، 512 محصول)

**اعمال شده در تمام HTML:**
- index.html, island.html, about.html, contact.html, privacy.html, 404.html, kartoniya.html, brand.html

---

## 🌐 تصویر شبکه‌های اجتماعی

**رندر جادویی اصلی:**
پرامپت: جزیره شناور جنس فندق، خانه درختی چوبی گرم با فانوس، کاراکتر فندقی با فانوس، آبشار کوچک، غروب طلایی، مه نرم، نورهای فیروزه‌ای جادویی.

**خروجی‌ها:**
- `assets/images/og-cover.jpg` — 1200×630 OG اصلی (ری‌سایز از رندر جادویی جدید)
- `assets/brand/social-og-1200x630.jpg` — سورس HQ 1200×630
- `assets/brand/social-square-1080.jpg` — کراپ مربع 1080 برای اینستا/تلگرام پروفایل
- `assets/images/social-share.jpg` — 1200×628 شیر
- `assets/images/hero-island.jpg` — آپدیت شده به همین رندر (1200×700) برای سکشن محصولات صفحه اصلی

**OG meta:**
- index.html og:image → og-cover.jpg + width/height + twitter:card
- island.html og:image → og-cover.jpg + twitter

---

## 📂 ساختار فایل نهایی

```
assets/
  logo.svg (جدید پارسا اپس)
  logo.png (512 جدید)
  logo-sm.jpg (128 جدید)
  island-logo.jpg (800 جدید island)
  favicon.svg (جدید P)
  favicon.ico (جدید)
  icons/
    icon-192.png / icon-512.png (PWA Parsa)
    favicon-32.png / 16.png
  brand/
    parsa-apps-icon.svg / 1024 / 512 / 192 / 180
    parsa-apps-logo-horizontal.svg / horizontal-light / vertical
    jazireh-fandoghi-app-icon-1024 / 512 / 192 / .png
    jazireh-fandoghi-island-icon-1024 / jazireh-island-512/1024
    jazireh-fandoghi-icon.svg / jazireh-fandoghi-logo.svg
    social-og-1200x630.jpg / social-square-1080.jpg
    README.md (راهنمای کامل)
  images/
    og-cover.jpg (جدید 1200x630)
    og-cover-new.jpg (سورس رندر)
    hero-island.jpg (جدید از og)
    mascot-fandoghi.jpg (جدید mascot)
    island-mascot.jpg (جدید island 600)
    social-share.jpg
brand.html (صفحه نمایش کیت برند)
site.webmanifest (اپدیت)
```

---

## 🖥️ صفحه پیش‌نمایش برند

`brand.html` ساخته شد — تمام لوگوها با پیش‌نمایش دارک/لایت، کد مسیر، توضیح کاربرد، پالت رنگ، و تست OG.

برای دیدن: https://parsa-apps.github.io/brand.html (پس از deploy)

---

## ✅ چک‌لیست مرحله ۲

- [x] لوگوی اصلی پارسا اپس (آیکون + افقی + عمودی + SVG + PNG)
- [x] لوگوی محصول جزیره فندقی (جزیره + کاراکتر + وکتور + افقی)
- [x] آیکون اپ (Mascot پیشنهاد اصلی + Island آلترناتیو + سایزهای 1024/512/192/180)
- [x] favicon سایت (SVG + ICO + PNG 32/16 + PWA manifest)
- [x] تصویر شبکه‌های اجتماعی (OG 1200×630 + مربع 1080 + شیر)
- [x] اعمال روی سایت (header, manifest, OG meta, favicon همه صفحات)
- [x] مستندسازی (brand/README.md + این فایل + brand.html)

---

## مرحله بعد پیشنهادی (مرحله ۳)

- طراحی لندینگ جدید جزیره فندقی با آیکون mascot متحرک (Lottie)
- ساخت اسکرین‌شات‌های واقعی اپ با قاب موبایل
- تولید نسخه دارک مود سایت با لوگوهای light
- پک استیکر تلگرام از کاراکتر فندقی (۱۰ حالت)
- انیمیشن کوتاه 3s لوگو (P → فندق → برگ)
