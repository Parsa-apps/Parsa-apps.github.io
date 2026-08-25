/* ============================================================
   پارسا اپس — Service Worker
   نسخه‌ی کش: v9
   استراتژی:
   - صفحات (ناوبری): شبکه‌اول → کش → 404
   - HTML / CSS / JS: شبکه‌اول → کش (همیشه تازه؛ آفلاین از کش)
   - تصاویر / فونت / آیکون: کش‌اول + به‌روزرسانی پس‌زمینه
   ============================================================ */

const CACHE_NAME = "parsa-apps-v9";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./island.html",
  "./store.html",
  "./about.html",
  "./privacy.html",
  "./contact.html",
  "./kartoniya.html",
  "./brand.html",
  "./404.html",
  "./style.css",
  "./script.js",
  "./intro.js",
  "./manifest.json",
  "./site.webmanifest",
  "./favicon.ico",
  "./assets/brand/parsa-main-logo.jpg",
  "./assets/brand/parsa-main-mark.jpg",
  "./assets/brand/parsa-main-logo-transparent.png",
  "./assets/brand/parsa-main-crown.svg",
  "./assets/brand/parsa-apps-animated-logo.gif",
  "./assets/brand/parsa-apps-animated-logo-poster.png",
  "./assets/brand/parsa-apps-animated-logo-poster-192.png",
  "./assets/brand/parsa-apps-animated-logo-poster-512.png",
  "./assets/icons/favicon-16.png",
  "./assets/icons/favicon-32.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/brand/jazireh-fandoghi-app-icon-192.png",
  "./assets/brand/jazireh-fandoghi-app-icon-512.png",
  "./assets/images/island/jazireh-promo-cover.jpg",
  "./assets/images/island/app-screen-1.jpg",
  "./assets/images/island/app-screen-2.jpg",
  "./assets/images/island/app-screen-3.jpg",
  "./assets/images/island/app-screen-4.jpg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

/* نصب: کش کردن فایل‌های اصلی */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

/* فعال‌سازی: پاک‌سازی کش‌های قدیمی */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

/* دریافت */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  /* ۱) ناوبری صفحات: شبکه‌اول، در آفلاین از کش */
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches.match(request).then((c) => c || caches.match("./404.html"))
        )
    );
    return;
  }

  /* ۲) فایل‌های همیشه‌تازه (HTML/CSS/JS): شبکه‌اول تا به‌روزرسانی‌ها
        بلافاصله اعمال شوند و کاربر نسخه قدیمی نبیند */
  if (
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "document"
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() =>
          caches.match(request).then((c) => c || caches.match("./404.html"))
        )
    );
    return;
  }

  /* ۳) ویدئو و صوت: عبور مستقیم از شبکه (بدون کش، تا استریم و Seek سالم بماند) */
  if (request.destination === "video" || request.destination === "audio") {
    event.respondWith(fetch(request));
    return;
  }

  /* ۴) دارایی‌های سنگین (تصویر/فونت/آیکون): کش‌اول + به‌روزرسانی در پس‌زمینه */
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === "basic") {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || network;
    })
  );
});
