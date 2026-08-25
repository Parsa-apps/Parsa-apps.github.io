import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Copies the built SPA entry to 404.html so GitHub Pages serves the app for
// any client-side route rather than a blank "not found" screen.
const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = resolve(__dirname, "..", "dist");
const indexHtml = resolve(dist, "index.html");
const notFound = resolve(dist, "404.html");

try {
  copyFileSync(indexHtml, notFound);

  // Inject a tiny script that tells the router to render the 404 page when
  // the URL path is not a real route. The app reads this flag on boot.
  const html = readFileSync(notFound, "utf8");
  const marker = "<div id=\"root\"></div>";
  const enhanced = html.replace(
    marker,
    `<div id="root"></div>\n    <script>window.__PARSA_NOT_FOUND__ = location.pathname;</script>`
  );
  writeFileSync(notFound, enhanced);
  console.log("✓ dist/404.html generated for SPA routing");
} catch (error) {
  console.error("post-build: could not create 404.html", error);
}
