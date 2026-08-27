/**
 * Zero-dependency dev/preview server for the static site.
 *
 * In dev it serves a "merged" view identical to the production build:
 *   /                  -> ./index.html
 *   /assets/** ...     -> ./public/...   (favicon, manifest, sw.js, robots, sitemap, ...)
 * Any other unknown path falls back to index.html (SPA-style 404 behaviour).
 *
 * Usage:
 *   node scripts/dev-server.mjs            # dev   (default port 4173)
 *   node scripts/dev-server.mjs --dist     # serve the built dist/ folder
 *   PORT=8080 node scripts/dev-server.mjs
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, normalize, extname } from "node:path";

const root = resolve(import.meta.dirname, "..");
const serveDist = process.argv.includes("--dist");
const baseDir = serveDist ? resolve(root, "dist") : root;
const publicDir = serveDist ? baseDir : resolve(root, "public");
const port = Number(process.env.PORT || 4173);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".mp4": "video/mp4",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

function send(res, status, body, type, cache) {
  res.writeHead(status, {
    "Content-Type": type || "text/plain; charset=utf-8",
    "Cache-Control": cache || "no-cache",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(body);
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    let pathname = decodeURIComponent(url.pathname);

    // Normalize: strip any path traversal attempts
    const safe = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
    if (pathname !== safe) {
      send(res, 403, "Forbidden");
      return;
    }

    const fileFor = (dir) => resolve(dir, "." + safe);

    let file;
    if (serveDist) {
      file = fileFor(baseDir);
    } else if (safe === "/" || safe === "/index.html") {
      file = resolve(root, "index.html");
    } else {
      file = fileFor(publicDir);
    }

    try {
      const data = await readFile(file);
      const ext = extname(file).toLowerCase();
      const cache = safe.startsWith("/assets/") ? "public, max-age=3600" : "no-cache";
      send(res, 200, data, MIME[ext], cache);
    } catch {
      // Fallback: index.html (404-style for single page)
      const data = await readFile(resolve(baseDir, "index.html"));
      send(res, 200, data, MIME[".html"]);
    }
  } catch (err) {
    send(res, 500, "Internal Server Error");
    console.error(err);
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`✓ Parsa Apps ${serveDist ? "preview (dist/)" : "dev"} server → http://0.0.0.0:${port}`);
});
