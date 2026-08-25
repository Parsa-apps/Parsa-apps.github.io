#!/usr/bin/env node
/**
 * Deploy the built site to the `gh-pages` branch (orphan, force-pushed).
 *
 * Why: the Arena GitHub App can push branches but has no `workflows`/`pages`
 * permissions, so the Actions pipeline in contrib/github-pages.deploy.yml
 * cannot be installed from here. GitHub Pages serves the `gh-pages` branch
 * (Settings → Pages → Source: gh-pages / root) instead of the raw source.
 *
 * Usage:
 *   npm run deploy:pages            # build + push dist/ to gh-pages
 *   node scripts/deploy-gh-pages.mjs --skip-build
 */
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const skipBuild = process.argv.includes("--skip-build");

const run = (cmd, opts = {}) =>
  execSync(cmd, { stdio: "inherit", cwd: root, ...opts });

if (!skipBuild) {
  console.log("→ Building production bundle…");
  run("npm run build");
} else if (!existsSync(dist)) {
  console.error("dist/ not found — run without --skip-build first.");
  process.exit(1);
}

console.log("→ Publishing dist/ to gh-pages (orphan, force)…");
const tmp = mkdtempSync(resolve(tmpdir(), "parsa-ghpages-"));
try {
  run(`git worktree add --detach ${JSON.stringify(tmp)} HEAD`);
  // Unique local name avoids clashing with any existing gh-pages checkout;
  // the push below targets the remote gh-pages branch explicitly.
  run("git checkout --orphan gh-pages-deploy-tmp", { cwd: tmp });
  run("git rm -rf -q .", { cwd: tmp });
  cpSync(dist, tmp, { recursive: true });
  writeFileSync(resolve(tmp, ".nojekyll"), "");
  run("git add -A", { cwd: tmp });
  const sha = execSync("git rev-parse --short HEAD", { cwd: root }).toString().trim();
  run(`git commit -q -m "Deploy built site (${sha})"`, { cwd: tmp });
  run("git push --force origin HEAD:gh-pages", { cwd: tmp });
  console.log("✓ gh-pages updated.");
  console.log('  Make sure Settings → Pages → Source = "Deploy from a branch: gh-pages / (root)".');
} finally {
  run(`git worktree remove --force ${JSON.stringify(tmp)}`);
  rmSync(tmp, { recursive: true, force: true });
}
