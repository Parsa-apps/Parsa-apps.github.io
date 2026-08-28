# پارسا اپس | Parsa Apps Studio

> Building the future of mobile experiences — استودیوی نرم‌افزار پرمیوم فرشاد پارسا.

وب‌سایت رسمی [Parsa Apps](https://parsa-apps.github.io/) — یک صفحهٔ استاتیک تک‌صفحه‌ای با طراحی سه‌بعدی پرمیوم که طبق فایل طراحی جدید (`public/assets/index.html` سابق) بازسازی شده است.

---

## ✨ چه چیزی در سایت هست

- 🎬 **تجربهٔ ورود سینمایی** — لودر با کریستال سه‌بعدی (Three.js)، نوار پیشرفت با اعداد فارسی و دکمهٔ «رد کردن»
- 🌌 **هیروی سه‌بعدی** — کریستال تعاملی WebGL که با حرکت ماوس واکنش می‌دهد + آمار متحرک + کاروسل سه‌بعدی Coverflow از اسکرین‌شات‌های جزیره فندقی (قابل لمس/درگ)
- 🏝️ **محصول شاخص** — جزیره فندقی با فریم گوشی سه‌بعدی (افکت Tilt)، مشخصات نسخه و لینک دانلود مایکت
- 👨‍💻 **دربارهٔ فرشاد پارسا** — کریستال سه‌بعدی + تایم‌لاین مسیر شغلی
- ⚙️ **فرآیند توسعه، مهارت‌ها و پروژه‌ها** — کارت‌های شیشه‌ای (Glassmorphism) با انیمیشن ورود
- 🌍 **سه‌زبانهٔ کامل** — فارسی (RTL)، انگلیسی (LTR) و عربی (RTL) با ذخیرهٔ انتخاب کاربر
- 📲 **PWA** — منیفست + Service Worker برای نصب و کارکرد آفلاین
- ⚡ **تماماً خودکفا** — فونت‌ها (Vazirmatn + JetBrains Mono) و Three.js روی خود سرور هستند؛ هیچ درخواست خارجی (CDN/گوگل‌فونت) وجود ندارد

## 🧱 تکنولوژی

| لایه | فناوری |
| --- | --- |
| صفحه | HTML5 + CSS3 سفارشی (متغیرهای طراحی، Glassmorphism) |
| سه‌بعدی | رندرر WebGL دست‌نویس سبک (~۱۰KB، بدون وابستگی) |
| انیمیشن | CSS + IntersectionObserver + requestAnimationFrame |
| زبان | فارسی / انگلیسی / عربی با `data-i18n` |
| بیلد | اسکریپت Node.js بدون هیچ وابستگی (`scripts/build.mjs`) |
| فونت | Vazirmatn و JetBrains Mono (خود-میزبان، فرمت woff2) |

## 🗂 ساختار

```
index.html            ← کل سایت (مارک‌آپ + استایل + اسکریپت + دیکشنری ترجمه)
public/
  assets/
    fonts/            ← Vazirmatn Variable (۱۰۰–۹۰۰) + JetBrains Mono (400/700)
    screenshots/      ← اسکرین‌شات‌های جزیره فندقی (نسخهٔ کامل + sm/ بهینه برای وب)
    images/           ← تصاویر پروژه‌ها، او‌جی و …
    brand/            ← لوگوها و برند
  manifest.json       ← PWA
  sw.js               ← Service Worker (network-first برای ناوبری)
  robots.txt, sitemap.xml
scripts/
  build.mjs           ← ساخت dist/ برای گیت‌هاب پیجز
  dev-server.mjs      ← سرور توسعه بدون وابستگی
  deploy-gh-pages.mjs ← انتشار dist/ روی شاخهٔ gh-pages
contrib/github-pages.deploy.yml  ← خط لولهٔ GitHub Actions (در صورت فعال بودن)
```

## 🚀 اجرای محلی

پیش‌نیاز: Node.js نسخهٔ ۲۰.۱۱ یا بالاتر.

```bash
npm run dev          # توسعه → http://localhost:4173
npm run build        # خروجی نهایی در dist/ (index.html + 404.html + assets + .nojekyll)
npm run preview      # پیش‌نمایش خروجی build
```

نیازی به `npm install` نیست؛ پروژه هیچ وابستگی‌ای ندارد.

## 📤 انتشار

1. سایت GitHub Pages روی `main` یا از طریق GitHub Actions (فایل `contrib/github-pages.deploy.yml` → باید به `.github/workflows/` منتقل و Pages روی «GitHub Actions» تنظیم شود) و یا:
2. انتشار مستقیم روی شاخهٔ `gh-pages`:

```bash
npm run deploy:pages
```

> اگر Pages روی «Deploy from a branch: gh-pages / (root)» تنظیم باشد، همین دستور کافی است.

## 🌍 تغییر متن‌ها و ترجمه‌ها

- کل ترجمه‌ها در دیکشنری `I18N` داخل `index.html` هستند (`fa`, `en`, `ar`).
- متن‌های ایستا با اتریبیوت `data-i18n="کلید"` به دیکشنری وصل می‌شوند.
- بخش‌های داینامیک (مهارت‌ها، تایم‌لاین، پروژه‌ها) از همان دیکشنری ساخته می‌شوند.
- انتخاب زبان کاربر در `localStorage` ذخیره می‌شود.

---

© پارسا اپس — ساخته شده با ❤️ توسط فرشاد پارسا.
