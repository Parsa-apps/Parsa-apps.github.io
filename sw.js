/* ============================================================
   Parsa Apps — Service Worker v11 (performance + cache health)
   - v11: images are plain cache-first (stale-while-revalidate was
     re-downloading every image on every visit = double bandwidth)
   - Never caches videos / big files / range requests
   - Cache quota: keeps the cache small (LRU eviction)
   - JS/CSS/fonts: stale-while-revalidate (instant loads)
   ============================================================ */

const CACHE_NAME = "parsa-apps-v11";
const APP_SHELL = ["./", "./index.html", "./manifest.json"];

// Cache health limits
const MAX_CACHE_BYTES = 30 * 1024 * 1024; // 30 MB total (mobile-friendly)
const MAX_ENTRY_BYTES = 2 * 1024 * 1024; // skip anything bigger than 2 MB
const META_KEY = "__parsa-meta-v10__";

/* ---------- LRU bookkeeping (kept inside the same cache) ---------- */
async function getMeta(cache) {
  try {
    const r = await cache.match(META_KEY);
    if (!r) return { entries: {} };
    return (await r.json()) || { entries: {} };
  } catch {
    return { entries: {} };
  }
}

async function saveMeta(cache, meta) {
  try {
    await cache.put(
      META_KEY,
      new Response(JSON.stringify(meta), {
        headers: { "Content-Type": "application/json" },
      })
    );
  } catch {
    /* ignore */
  }
}

async function putGuarded(cache, request, response) {
  if (request.method !== "GET") return false;
  if (request.headers.get("range")) return false; // media seeking
  if (!response || response.status !== 200 || response.type !== "basic") return false;

  // Only cache responses with a known, safe size. GitHub Pages always
  // sends Content-Length for static files, so we never have to read a
  // huge body just to measure it.
  const len = Number(response.headers.get("content-length"));
  if (!len || len > MAX_ENTRY_BYTES) return false;

  const url = new URL(request.url).pathname;
  const meta = await getMeta(cache);
  meta.entries[url] = { size: len, time: Date.now() };

  // Evict oldest entries until we are under the quota
  let total = Object.keys(meta.entries).reduce(
    (sum, k) => sum + (meta.entries[k].size || 0),
    0
  );
  if (total > MAX_CACHE_BYTES) {
    const ordered = Object.keys(meta.entries).sort(
      (a, b) => (meta.entries[a].time || 0) - (meta.entries[b].time || 0)
    );
    for (const key of ordered) {
      if (total <= MAX_CACHE_BYTES) break;
      await cache.delete(key).catch(() => undefined);
      total -= meta.entries[key].size || 0;
      delete meta.entries[key];
    }
  }

  await saveMeta(cache, meta);
  await cache.put(request, response.clone()).catch(() => undefined);
  return true;
}

/* ---------- Install / Activate ---------- */
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
      await Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== "parsa-apps-meta")
          .map((k) => caches.delete(k))
      );
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

/* ---------- Fetch ---------- */
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navigation: network-first, cached fallback
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

  // Media (video/audio) and range requests: let the browser stream them
  // normally — they are NEVER stored in Cache Storage (this was the
  // main cause of the oversized cache).
  if (
    request.destination === "video" ||
    request.destination === "audio" ||
    request.headers.get("range")
  ) {
    return;
  }

  // Images: cache-first, no background revalidation — a repeat visit
  // downloads ZERO image bytes instead of silently re-fetching all of
  // them while the cache is served.
  if (
    request.destination === "image" ||
    /\.(png|jpe?g|webp|gif|ico|svg)$/i.test(url.pathname)
  ) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const fresh = await fetch(request);
          if (fresh && fresh.ok) {
            putGuarded(cache, request, fresh).catch(() => undefined);
          }
          return fresh;
        } catch {
          return Response.error();
        }
      })()
    );
    return;
  }

  const isCacheable =
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "font" ||
    url.pathname.endsWith(".json") ||
    url.pathname.endsWith(".woff2") ||
    url.pathname.endsWith(".webmanifest");

  if (!isCacheable) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);

      // Stale-while-revalidate: return cache instantly, refresh quietly
      const network = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            putGuarded(cache, request, response).catch(() => undefined);
          }
          return response;
        })
        .catch(() => cached);

      if (cached) {
        return cached;
      }
      const fresh = await network;
      if (fresh) return fresh;
      return Response.error();
    })()
  );
});

/* ---------- Messages ---------- */
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
