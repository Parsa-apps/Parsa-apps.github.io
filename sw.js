/* ============================================================
   Parsa Apps — Service Worker v4 (black-screen fix)
   Strategy:
   - Navigations: network-first, never serve stale hashed chunks
   - Static assets: cache-first with background refresh
   - Bumps cache version to purge old broken builds
   - If chunk 404s, delete old cache and force network
   ============================================================ */

const CACHE_NAME = "parsa-apps-v9"; // cache-bust: cinematic intro assets
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  // cinematic intro — precached so the reveal is instant on repeat visits
  "./assets/brand/intro-logo.png",
  "./assets/brand/intro-wire.png",
  "./assets/brand/intro-crown.svg",
  "./assets/brand/parsa-apps-animated-logo.gif",
];

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
      // Notify clients that a new SW is active — they can reload if needed
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

  // Never intercept HMR / Vite dev requests
  if (url.pathname.startsWith("/@") || url.pathname.includes("node_modules")) return;

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

  const isHashedAsset = /\/assets\/.*-[A-Za-z0-9_-]{6,}\.(js|css)$/.test(url.pathname);
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

        // For hashed JS/CSS: network-first to avoid serving old index.html that points to deleted chunks (main cause of black screen)
        if (isHashedAsset) {
          try {
            const fresh = await fetch(request, { cache: "no-store" });
            if (fresh && fresh.ok) {
              cache.put(request, fresh.clone()).catch(() => undefined);
              return fresh;
            }
            // If fresh 404, it's an old chunk — purge caches to force reload of new index.html next time
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

        // For other assets: cache-first with background refresh
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
