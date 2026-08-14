/* ============================================================
   پارسا اپس — Service Worker
   نسخه‌ی کش: v1
   ============================================================ */

const CACHE_NAME = "parsa-apps-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./island.html",
  "./store.html",
  "./about.html",
  "./privacy.html",
  "./contact.html",
  "./kartoniya.html",
  "./404.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./assets/logo-sm.png",
  "./assets/images/island/mascot.jpg",
  "./assets/images/island/trailer-cover.jpg",
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

/* دریافت: صفحات شبکه-اول (همیشه تازه) / دارایی‌ها کش-اول (سریع) */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  /* ناوبری صفحات: اول شبکه، در آفلاین از کش */
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

  /* دارایی‌های استاتیک: اول کش، بعد شبکه (با به‌روزرسانی کش) */
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
        .catch(() => cached || caches.match("./404.html"));

      return cached || network;
    })
  );
});
