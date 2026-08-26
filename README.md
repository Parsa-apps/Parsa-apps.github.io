# پارسا اپس | Parsa Apps Studio

> Building the future of mobile experiences — استودیوی نرم‌افزار پرمیوم فرشاد پارسا.

وب‌سایت رسمی [Parsa Apps](https://parsa-apps.github.io/) که از یک صفحه استاتیک ساده به یک **استودیوی برند دیجیتال پرمیوم** بازسازی شده است.

---

## ✨ چه چیزی ساخته شد

- 🎬 **تجربه ورود سینمایی** با انیمیشن لوگو، حلقه‌های مداری و ذرات نور
- 🌌 **هیروی سه‌بعدی** با گوشی موکاپ، عناصر شناور و پس‌زمینه WebGL (Three.js)
- 📱 **پارسا استور** — میکرواستور رسمی همه اپلیکیشن‌ها با فیلتر و کارت‌های تعاملی
- 🏝️ **صفحه محصول اختصاصی برای هر اپ** (جزیره فندقی، کارتونیا و پروژه‌های آینده)
- ⚙️ **بخش فرآیند توسعه** با فلوچارت مراحل ساخت محصول از ایده تا انتشار
- 👨‍💻 **پروفایل توسعه‌دهنده** فرشاد پارسا با تاج طلایی و تایم‌لاین
- 🧩 **مهارت‌ها، پروژه‌ها، تماس و حریم خصوصی** با انیمیشن‌های مدرن
- 🌍 **معماری چندزبانه** (فارسی اصلی RTL + آماده انگلیسی/عربی)
- 📲 **PWA** با Service Worker برای نصب و کارکرد آفلاین
- ⚡ **بهینه برای موبایل، SEO و دسترسی**

## 🧱 تکنولوژی

| لایه | فناوری |
| --- | --- |
| فریم‌ورک | React 18 + TypeScript |
| بیلد | Vite |
| استایل | Tailwind CSS + Glassmorphism |
| انیمیشن | Framer Motion + GSAP + Three.js / WebGL |
| مسیریابی | React Router (SPA) |
| PWA | Web App Manifest + Service Worker |
| فونت | Vazirmatn (self-hosted) |

## 🚀 اجرای محلی

```bash
npm install
npm run dev        # توسعه
npm run build      # بیلد نهایی در dist/
npm run preview    # پیش‌نمایش بیلد
```

## 📁 ساختار پروژه

```
├── index.html                 # ورودی Vite + متا/SEO/PWA
├── src/
│   ├── main.tsx               # بوت‌استرپ + Service Worker
│   ├── App.tsx                # روتر + لودینگ سینمایی
│   ├── index.css              # Tailwind + طراحی پایه
│   ├── lib/
│   │   ├── data.ts            # ✅ افزودن اپ جدید اینجا
│   │   └── i18n.tsx           # چندزبانگی
│   ├── components/            # Navbar, Footer, UI, Apps, WebGL, Cursor
│   ├── layouts/SiteLayout.tsx
│   └── pages/                 # Home, Store, AppDetail, About, Contact, Privacy, 404
├── public/                    # اسیت‌ها، فونت‌ها، manifest، sw.js، sitemap
└── scripts/post-build.mjs     # ساخت 404.html برای SPA روی GitHub Pages
```

## ➕ افزودن اپلیکیشن جدید

فقط یک آیتم به آرایه `apps` در `src/lib/data.ts` اضافه کنید. صفحه محصول، استور،
پروژه‌ها و دانلود به‌صورت خودکار ساخته می‌شوند:

```ts
{
  slug: "my-app",
  name: "اسم برنامه",
  nameEn: "My App",
  tagline: "...",
  description: "...",
  longDescription: "...",
  icon: "/assets/my-app-icon.png",
  cover: "/assets/my-app-cover.jpg",
  screenshots: ["/assets/s1.jpg"],
  features: ["..."],
  educationalBenefits: ["..."],
  technology: ["Flutter", "Dart"],
  status: "development",        // یا "released"
  category: "آموزشی",
  ageRange: "۳ تا ۸ سال",
  size: "52 MB",
  version: "1.0.0",
  updated: "به‌زودی",
  androidMin: "Android 8+",
  palette: { from: "#4fd8eb", to: "#ffb347", accent: "#7ef2ff" },
}
```

## 🌐 استقرار (GitHub Pages)

بیلد خروجی را در `dist/` تولید می‌کند و فایل `404.html` برای مسیریابی SPA
به‌صورت خودکار ساخته می‌شود.

**تنظیمات فعلی و الزامی GitHub Pages:**

1. در تنظیمات مخزن: **Settings → Pages → Build and deployment → Source = Deploy from a branch**
2. **Branch را حتماً روی `gh-pages` و path را روی `/ (root)` بگذارید — نه `main`!**
3. ذخیره کنید و منتظر بمانید تا بیلد صفحات تمام شود.

> ⚠️ اگر Source روی `main` باشد، GitHub Pages **سورس خام پروژه (کد React/TSX)** را منتشر
> می‌کند نه خروجی بیلدشده را؛ در نتیجه اپ اجرا نمی‌شود و سایت صفحهٔ سیاه/خالی نشان می‌دهد.
> `main` فقط مخزن سورس است و `dist/` در آن کامیت نمی‌شود.

**انتشار نسخهٔ جدید:**

```bash
npm run build          # بیلد محلی برای تست
npm run deploy:pages   # بیلد + انتشار dist/ به شاخهٔ gh-pages (force-push)
```

اسکریپت `deploy:pages` خروجی بیلد را روی شاخهٔ `gh-pages` (orphan) پوش می‌کند و
سایت بلافاصله پس از بیلد صفحات گیت‌هاب آپدیت می‌شود.

**Workflow پیشنهادی استقرار خودکار** در فایل
[`contrib/github-pages.deploy.yml`](contrib/github-pages.deploy.yml) قرار دارد؛
برای فعال‌سازی آن (اختیاری) فایل را به `.github/workflows/deploy.yml` منتقل کنید —
این کار به اجازهٔ `workflows` روی اکانت GitHub نیاز دارد — و سپس Source را روی
**GitHub Actions** بگذارید.

## 📞 ارتباط

- ایمیل: `farshadparsa2019@gmail.com`
- تلگرام: [@Parsaappsadmin](https://t.me/Parsaappsadmin)
- اینستاگرام: [@parsa_apps](https://instagram.com/parsa_apps)

**© ۱۴۰۵ پارسا اپس | تمامی حقوق محفوظ است**
