/**
 * Build the static site into dist/ for GitHub Pages.
 *
 * Pipeline:
 *   1. Copy index.html      -> dist/index.html
 *   2. Copy index.html      -> dist/404.html   (unknown paths still show the site)
 *   3. Copy public/**       -> dist/**         (assets, fonts, manifest, sw.js, ...)
 *   4. Write dist/.nojekyll                    (no Jekyll processing on GitHub Pages)
 *
 * No bundler, no dependencies — the site is a self-contained static page.
 */
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

// Main page + 404 fallback
const html = readFileSync(resolve(root, "index.html"));
writeFileSync(resolve(dist, "index.html"), html);
writeFileSync(resolve(dist, "404.html"), html);

// Static assets
cpSync(resolve(root, "public"), dist, { recursive: true });

// Disable Jekyll on GitHub Pages
writeFileSync(resolve(dist, ".nojekyll"), "");

console.log("✓ dist/ built (index.html + 404.html + public assets)");
