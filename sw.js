/* service worker v16 - AURUM 2.0 theme layer + brand remap */

const CACHE_NAME = "parsa-apps-v16";

/* ===== official 2026 brand logo map (release: brand-2026) ===== */
const BRAND_LOGO_PNG =
  "https://github.com/Parsa-apps/Parsa-apps.github.io/releases/download/brand-2026/parsa-apps-logo-official-2026.png";
const BRAND_MAP = {
  "/assets/brand/parsa-apps-logo-320.webp": BRAND_LOGO_PNG,
  "/assets/brand/parsa-apps-logo-320.png": BRAND_LOGO_PNG,
  "/assets/brand/parsa-apps-logo-512.webp": BRAND_LOGO_PNG,
  "/assets/brand/parsa-apps-logo-512.png": BRAND_LOGO_PNG,
  "/assets/brand/parsa-apps-logo-1024.webp": BRAND_LOGO_PNG,
  "/assets/brand/parsa-apps-logo-1024.png": BRAND_LOGO_PNG,
  "/assets/icons/icon-192.png": BRAND_LOGO_PNG,
  "/assets/icons/icon-512.png": BRAND_LOGO_PNG,
  "/assets/icons/icon-512-maskable.png": BRAND_LOGO_PNG,
  "/assets/brand/parsa-apps-icon-512.png": BRAND_LOGO_PNG,
  "/assets/favicon.svg": BRAND_LOGO_PNG,
  "/favicon.ico": BRAND_LOGO_PNG,
};
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./assets/css/aurum.css",
  "./assets/js/aurum.js",
];

/* ---- AURUM 2.0 injector: adds theme layer CSS+JS to HTML pages ---- */
function aurumify(response) {
  return (async () => {
    try {
      const ctype = response.headers.get("content-type") || "";
      if (!ctype.includes("text/html")) return response;
      const html = await response.text();
      if (html.indexOf("aurum.css") !== -1 || !html.includes("</head>")) {
        return new Response(html, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } });
      }
      const patched = html
        .replace("</head>", '<link rel="stylesheet" href="/assets/css/aurum.css">\n</head>')
        .replace(/<\/body>/i, '<script src="/assets/js/aurum.js" defer></script>\n</body>');
      return new Response(patched, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } });
    } catch (e) {
      return response;
    }
  })();
}

const MAX_CACHE_BYTES = 30 * 1024 * 1024;
const MAX_ENTRY_BYTES = 2 * 1024 * 1024;
const META_KEY = "__parsa-meta-v16__";

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
  if (request.headers.get("range")) return false;
  if (!response || response.status !== 200 || response.type !== "basic") return false;

  const len = Number(response.headers.get("content-length"));
  if (!len || len > MAX_ENTRY_BYTES) return false;

  const url = new URL(request.url).pathname;
  const meta = await getMeta(cache);
  meta.entries[url] = { size: len, time: Date.now() };

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

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(APP_SHELL);
      } catch {
        // ignore offline install failure
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

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  /* brand logo/icons -> official 2026 asset */
  const brandTarget = BRAND_MAP[url.pathname];
  if (brandTarget) {
    event.respondWith(
      fetch(brandTarget, { mode: "cors", cache: "force-cache" }).catch(() =>
        fetch(brandTarget, { mode: "no-cors" })
      )
    );
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request, { cache: "no-store" });
          if (fresh && fresh.ok) {
            const cache = await caches.open(CACHE_NAME);
            const page = await aurumify(fresh.clone());
            cache.put("./index.html", page.clone()).catch(() => undefined);
            return page;
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

  if (
    request.destination === "video" ||
    request.destination === "audio" ||
    request.headers.get("range")
  ) {
    return;
  }

  const isCacheable =
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "font" ||
    request.destination === "image" ||
    url.pathname.endsWith(".json") ||
    url.pathname.endsWith(".woff2") ||
    url.pathname.endsWith(".webmanifest") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".webp") ||
    url.pathname.endsWith(".avif");

  if (!isCacheable) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);

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
