# پارسا اپس | Parsa Apps Studio

> Building the future of mobile experiences — استودیوی نرم‌افزار پرمیوم فرشاد پارسا.

وب‌سایت رسمی [Parsa Apps](https://parsa-apps.github.io/) که از یک صفحه استاتیک ساده به یک **استودیوی برند دیجیتال پرمیوم** بازسازی شده است.

---

## ✨ چه چیزی ساخته شد

- 🎬 **تجربه ورود سینمایی** با انیمیشن لوگو، حلقه‌های مداری و ذرات نور
- 🌌 **هیروی سه‌بعدی** با گوشی موکاپ، عناصر شناور و پس‌زمینه WebGL (Three.js)
- 📱 **پارسا استور** — میکرواستور رسمی همه اپلیکیشن‌ها با فیلتر و کارت‌های تعاملی
- 🏝️ **صفحه محصول اختصاصی برای هر اپ** (جزیره فندقی، کارتونیا و پروژه‌های آینده)
- 🧠 **آزمایشگاه هوش مصنوعی** با فلوچارت توسعه و انیمیشن شبکه عصبی
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

Workflow پیشنهادی استقرار خودکار در فایل
[`contrib/github-pages.deploy.yml`](contrib/github-pages.deploy.yml) قرار دارد.
برای فعال‌سازی:

1. در تنظیمات مخزن، **Pages → Source** را روی **GitHub Actions** قرار دهید.
2. فایل `contrib/github-pages.deploy.yml` را به `.github/workflows/deploy.yml` منتقل کنید
   (این کار نیاز به اجازه `workflows` روی اکانت GitHub دارد) و آن را روی `main` بفرستید.
3. پس از ادغام، سایت به‌صورت خودکار از خروجی `dist/` منتشر می‌شود.

> تا فعال شدن workflow، می‌توانید خروجی `dist/` را به‌صورت دستی در `main` انتشار دهید.

## 📞 ارتباط

- ایمیل: `farshadparsa2019@gmail.com`
- تلگرام: [@Parsaappsadmin](https://t.me/Parsaappsadmin)
- اینستاگرام: [@parsa.apps](https://instagram.com/parsa.apps)

**© ۱۴۰۵ پارسا اپس | تمامی حقوق محفوظ است**
