/* ============================================================
   Parsa Apps — Service Worker v9 (premium redesign)
   Strategy:
   - Navigations: network-first, fall back to cached index.html
   - Static assets: cache-first with background refresh
   - v9 purges v8 caches: new premium design system
     (assets/css/site.css + assets/js/site.js)
   ============================================================ */

const CACHE_NAME = "parsa-apps-v9"; // bumped: premium redesign
const APP_SHELL = ["./", "./index.html", "./manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(APP_SHELL);
      } catch {
        // ignore if some shell asset fails (e.g. offline)
      }
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
      await self.clients.claim();
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((c) => {
        try {
          c.postMessage({ type: "SW_ACTIVATED", version: CACHE_NAME });
        } catch {
          // ignore
        }
      });
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request, { cache: "no-store" });
          if (fresh && fresh.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put("./index.html", fresh.clone()).catch(() => undefined);
            return fresh;
          }
          throw new Error("bad response");
        } catch {
          const cache = await caches.open(CACHE_NAME);
          const cached = await cache.match("./index.html");
          if (cached) return cached;
          return Response.error();
        }
      })()
    );
    return;
  }

  const isAsset =
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "font" ||
    request.destination === "image" ||
    request.destination === "video" ||
    url.pathname.endsWith(".woff2") ||
    url.pathname.endsWith(".json");

  if (isAsset) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);

        // For JS/CSS: network-first to avoid old HTML referencing deleted chunks
        if (request.destination === "script" || request.destination === "style") {
          try {
            const fresh = await fetch(request, { cache: "no-store" });
            if (fresh && fresh.ok) {
              cache.put(request, fresh.clone()).catch(() => undefined);
              return fresh;
            }
            if (fresh && fresh.status === 404) {
              cache.delete(request).catch(() => undefined);
              const keys = await caches.keys();
              await Promise.all(keys.map((k) => caches.delete(k))).catch(() => undefined);
            }
            const cached = await cache.match(request);
            return cached || fresh;
          } catch {
            const cached = await cache.match(request);
            if (cached) return cached;
            return fetch(request).catch(() => Response.error());
          }
        }

        // Other assets: cache-first with background refresh
        const cached = await cache.match(request);
        const network = fetch(request)
          .then((response) => {
            if (response && response.status === 200 && response.type === "basic") {
              cache.put(request, response.clone()).catch(() => undefined);
            }
            return response;
          })
          .catch(() => cached);
        return cached || (await network) || Response.error();
      })()
    );
  }
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
  if (event.data && event.data.type === "CLEAR_CACHE") {
    event.waitUntil(
      (async () => {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      })()
    );
  }
});
