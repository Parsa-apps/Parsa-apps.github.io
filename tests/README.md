# تست‌های سایت و لوگوی Parsa-Apps

اسکریپت `motion.test.js` رفتار رابط کاربری را روی همهٔ صفحات با jsdom بررسی می‌کند:
موتور حرکت، منوی موبایل، فرم تماس، PWA و Service Worker، دسترسی‌پذیری و
`prefers-reduced-motion`. همچنین حضور لوگوی GIF رسمی در هدر، فوتر، صفحهٔ اصلی،
معرفی شخصی، صفحهٔ درباره ما و 404، املای دقیق `Parsa-Apps`، پوستر ثابت و خروجی‌های
آیکون را کنترل می‌کند.

## اجرا

```bash
npm install jsdom      # پیش‌نیاز محلی؛ node_modules در Git ذخیره نمی‌شود
node tests/motion.test.js
```
