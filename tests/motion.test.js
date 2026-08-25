/* ============================================================
   تست‌های موتور حرکتی سایت جدید پارسا اپس
   اجرا: node tests/motion.test.js
   ============================================================ */

const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");

const ROOT = "/home/user/Parsa-apps.github.io";
const SCRIPT = fs.readFileSync(path.join(ROOT, "script.js"), "utf8");

let pass = 0;
let fail = 0;
const check = (name, cond, extra) => {
  if (cond) {
    pass += 1;
    console.log("  PASS  " + name);
  } else {
    fail += 1;
    console.log("  FAIL  " + name + (extra ? "  -> " + extra : ""));
  }
};

function makeDom(page, opts = {}) {
  const html = fs.readFileSync(path.join(ROOT, page), "utf8");
  const errors = [];
  const vc = new VirtualConsole();
  vc.on("jsdomError", (e) => errors.push(String(e.message)));
  vc.on("error", (e) => errors.push(String(e)));

  const dom = new JSDOM(html, {
    runScripts: "outside-only",
    pretendToBeVisual: true,
    url: "https://parsa-apps.github.io/" + page,
    virtualConsole: vc,
  });

  const w = dom.window;
  const observed = [];

  w.matchMedia = (q) => ({
    media: q,
    matches: q.includes("prefers-reduced-motion") ? !!opts.reducedMotion : false,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
  });

  if (!opts.noObserver) {
    w.IntersectionObserver = class {
      constructor(cb, o) {
        this.cb = cb;
        this.opts = o;
        this.targets = [];
        observed.push(this);
      }
      observe(t) { this.targets.push(t); }
      unobserve(t) { this.targets = this.targets.filter((x) => x !== t); }
      disconnect() { this.targets = []; }
      fireAll(isIntersecting = true) {
        this.cb(this.targets.map((t) => ({ target: t, isIntersecting })), this);
      }
    };
  }

  w.Element.prototype.getBoundingClientRect = function () {
    return { top: 100, bottom: 400, left: 0, right: 800, width: 800, height: 300, x: 0, y: 100 };
  };

  w.HTMLMediaElement.prototype.play = () => Promise.resolve();
  w.HTMLMediaElement.prototype.pause = () => {};

  w.eval(SCRIPT);
  // شبیه‌سازی رویدادی که در مرورگر واقعی بعد از اجرای اسکریپت فایر می‌شود
  w.document.dispatchEvent(new w.Event("DOMContentLoaded", { bubbles: true }));
  return { dom, w, doc: w.document, errors, observed };
}

console.log("\n=== A. index.html ===\n");
{
  const { w, doc, errors, observed } = makeDom("index.html");
  check("no runtime errors", errors.length === 0, errors.join(" | "));
  check("body loaded class", doc.body.classList.contains("loaded"));

  check("header exists", !!doc.querySelector(".header"));
  check("nav has 4 links", doc.querySelectorAll("nav a").length === 4);

  // Scroll reveal
  const reveals = doc.querySelectorAll(".section, .glass-card, .product-card, .timeline-item");
  check("reveal targets found", reveals.length >= 10, "count=" + reveals.length);
  check("reveal targets start hidden", doc.querySelectorAll(".section.hidden").length >= 2);
  observed.forEach((o) => o.fireAll(true));
  check("in-view elements revealed", doc.querySelectorAll(".section.show").length >= 2);

  // dark/light toggle
  const toggle = doc.querySelector(".theme-toggle");
  check("theme toggle exists", !!toggle);
  if (toggle) {
    toggle.click();
    check("body gets light class", doc.body.classList.contains("light"));
    toggle.click();
    check("body returns to dark", !doc.body.classList.contains("light"));
  }

  // mobile menu
  const menuBtn = doc.querySelector(".menu-btn");
  const nav = doc.querySelector("nav");
  check("menu button exists", !!menuBtn);
  if (menuBtn && nav) {
    menuBtn.click();
    check("nav opens (active)", nav.classList.contains("active"));
    menuBtn.click();
    check("nav closes", !nav.classList.contains("active"));
  }

  // ripple targets
  check("buttons for ripple", doc.querySelectorAll(".btn").length >= 2);

  // لینک‌های واقعی تماس در فوتر
  check("footer contact link", !!doc.querySelector('a[href="contact.html"]'));
  check("footer telegram link", !!doc.querySelector('a[href*="t.me/Parsaappsadmin"]'));

  // محصولات: جزیره فندقی + کارتونیا
  check("two product cards", doc.querySelectorAll(".product-card").length === 2);
  check("kartoniya card linked", !!doc.querySelector('a[href="kartoniya.html"]'));

  // parallax targets
  check("background glow spans", doc.querySelectorAll(".background-effects span").length === 4);
}

console.log("\n=== B. island.html ===\n");
{
  const { w, doc, errors, observed } = makeDom("island.html");
  check("no runtime errors", errors.length === 0, errors.join(" | "));
  check("island page class", doc.body.classList.contains("island-page"));
  check("island bg + clouds", doc.querySelectorAll(".island-bg .cloud").length === 3);

  // phone slider
  const slides = doc.querySelectorAll(".app-slide");
  const dots = doc.querySelectorAll(".phone-slider-dots span");
  check("4 app screenshots", slides.length === 4, "count=" + slides.length);
  check("4 slider dots", dots.length === 4, "count=" + dots.length);
  check("first slide active", slides[0].classList.contains("active"));

  // manual dot navigation
  if (dots.length >= 2) {
    dots[2].click();
    check("dot click switches slide", slides[2].classList.contains("active"));
  }

  // phone wake observer
  const phone = doc.getElementById("phone");
  check("phone mockup exists", !!phone);
  const wakeObs = observed.find(
    (o) => o.targets.length && o.targets[0].classList.contains("reveal-phone")
  );
  check("phone wake observer created", !!wakeObs);
  if (wakeObs) {
    check("phone hidden pre-reveal (js-reveal)", phone.classList.contains("js-reveal"));
    wakeObs.fireAll(true);
    check("phone wakes (phone-active)", phone.classList.contains("phone-active"));
    check("phone js-reveal removed after wake", !phone.classList.contains("js-reveal"));
  }

  // feature / trust / review reveal
  check("feature cards hidden pre-reveal", doc.querySelectorAll(".feature-3d-card.js-reveal").length === 6);
  check("trust cards hidden pre-reveal", doc.querySelectorAll(".trust-card.js-reveal").length === 4);
  check("review cards hidden pre-reveal", doc.querySelectorAll(".review-card.js-reveal").length === 3);

  observed.forEach((o) => o.fireAll(true));
  check("feature cards revealed", doc.querySelectorAll(".feature-3d-card.show-feature").length === 6);
  check("trust cards revealed", doc.querySelectorAll(".trust-card.show").length === 4);
  check("review cards revealed", doc.querySelectorAll(".review-card.show-review").length === 3);
  check("js-reveal removed after reveal", doc.querySelectorAll(".feature-3d-card.js-reveal, .trust-card.js-reveal, .review-card.js-reveal").length === 0);

  // FAQ accordion
  const faqItems = doc.querySelectorAll(".faq-item");
  check("6 FAQ items", faqItems.length === 6, "count=" + faqItems.length);
  if (faqItems.length >= 2) {
    const first = faqItems[0];
    const btn = first.querySelector(".faq-question");
    btn.click();
    check("FAQ opens", first.classList.contains("active"));
    check("FAQ answer has height", first.querySelector(".faq-answer").style.maxHeight !== "");
    btn.click();
    check("FAQ closes", !first.classList.contains("active"));
  }

  // trailer
  check("trailer video exists", !!doc.getElementById("islandVideo"));
  check(
    "promo video source points to mp4",
    !!doc.querySelector('video source[src="assets/videos/jazire_fandoqi_promo_portrait.mp4"]')
  );
  check(
    "promo video has matching poster",
    doc.getElementById("islandVideo").getAttribute("poster") ===
      "assets/images/island/jazireh-promo-cover.jpg"
  );
  check(
    "trailer has controls + playsinline",
    doc.getElementById("islandVideo").hasAttribute("controls") &&
      doc.getElementById("islandVideo").hasAttribute("playsinline")
  );
  check("play button exists", !!doc.getElementById("playButton"));
  check("coming-soon overlay removed", !doc.getElementById("comingSoon"));

  // گالری اسکرین‌شات
  const gallery = doc.querySelector(".gallery-section");
  check("gallery section exists", !!gallery);
  check("4 gallery shots", doc.querySelectorAll(".gallery .shot").length === 4, "count=" + doc.querySelectorAll(".gallery .shot").length);
  check("gallery images point to app screens", doc.querySelectorAll(".gallery .shot img[src*='assets/images/island/app-screen-']").length === 4);

  // لینک استور در بخش دانلود
  check("store link in download section", !!doc.querySelector(".download-section a[href='store.html']"));
  check("faq anchor id", !!doc.getElementById("faq"));

  // download
  const dlBtn = doc.querySelector(".download-button");
  check("download button exists", !!dlBtn);
  check("download is coming-soon", dlBtn.hasAttribute("data-coming-soon"));

  // toast appears on coming-soon click
  const toast = doc.getElementById("toast");
  if (dlBtn && toast) {
    dlBtn.click();
    check("toast shows coming-soon", toast.classList.contains("show"));
  }

  // فوتر جزیره لینک تماس دارد
  check("island footer contact link", !!doc.querySelector('a[href="contact.html"]'));
}

console.log("\n=== C. about / privacy / contact / kartoniya / 404 ===\n");
{
  ["about.html", "privacy.html"].forEach((page) => {
    const { doc, errors } = makeDom(page);
    check(page + ": no runtime errors", errors.length === 0, errors.join(" | "));
    check(page + ": header present", !!doc.querySelector(".header"));
    check(page + ": footer present", !!doc.querySelector(".main-footer"));
    check(page + ": content blocks", doc.querySelectorAll(".about-block").length >= 2);
    check(page + ": theme toggle", !!doc.querySelector(".theme-toggle"));
  });

  // تماس با ما + فرم
  {
    const { doc, w, errors } = makeDom("contact.html");
    check("contact.html: no runtime errors", errors.length === 0, errors.join(" | "));
    check("contact.html: form exists", !!doc.getElementById("contact-form"));
    check("contact.html: 3 contact channels", doc.querySelectorAll(".contact-list a").length === 3);

    const form = doc.getElementById("contact-form");
    doc.getElementById("name").value = "آزمایش";
    doc.getElementById("email").value = "test@test.com";
    doc.getElementById("message").value = "سلام";
    form.dispatchEvent(new w.Event("submit", { bubbles: true, cancelable: true }));
    check(
      "contact.html: mailto draft built",
      String(form.dataset.lastMailto).startsWith("mailto:farshadparsa2019@gmail.com?subject=")
    );
  }

  // کارتونیا
  {
    const { doc, errors } = makeDom("kartoniya.html");
    check("kartoniya.html: no runtime errors", errors.length === 0, errors.join(" | "));
    check("kartoniya.html: hero title", doc.querySelector("h1").textContent.includes("کارتونیا"));
    check("kartoniya.html: checklist", doc.querySelectorAll(".checklist li").length >= 4);
    check("kartoniya.html: telegram CTA", !!doc.querySelector('a[href*="t.me/Parsaappsadmin"]'));
  }

  // برند
  {
    const { doc, errors } = makeDom("brand.html");
    check("brand.html: no runtime errors", errors.length === 0, errors.join(" | "));
    check("brand.html: color chips", doc.querySelectorAll(".color-chip").length === 5);
    check("brand.html: kit cards", doc.querySelectorAll(".kit-card").length >= 10);
  }

  // استور جزیره فندقی
  {
    const { doc, errors } = makeDom("store.html");
    check("store.html: no runtime errors", errors.length === 0, errors.join(" | "));
    check("store.html: island theme", doc.body.classList.contains("island-page"));
    check("store.html: header present", !!doc.querySelector(".header"));
    check("store.html: footer present", !!doc.querySelector(".main-footer"));
    check("store.html: hero title", !!doc.querySelector(".store-hero h1") && doc.querySelector(".store-hero h1").textContent.includes("جزیره فندقی"));
    check("store.html: app icon", !!doc.querySelector(".store-app-icon img[src*='jazireh-fandoghi-app-icon']"));
    check("store.html: specs (8 detail cards)", doc.querySelectorAll(".store-spec-box .app-details > div").length === 8, "count=" + doc.querySelectorAll(".store-spec-box .app-details > div").length);
    check("store.html: changelog versions", doc.querySelectorAll(".changelog-item").length === 3, "count=" + doc.querySelectorAll(".changelog-item").length);
    check("store.html: download coming-soon", !!doc.querySelector(".download-button[data-coming-soon]"));
    check("store.html: report problem mailto", !!doc.querySelector('a[href^="mailto:farshadparsa2019@gmail.com?subject="]'));
    check("store.html: 3 support cards", doc.querySelectorAll(".support-card").length === 3, "count=" + doc.querySelectorAll(".support-card").length);
    check("store.html: island page link", !!doc.querySelector('a[href="island.html"]'));
  }

  const html404 = fs.readFileSync(path.join(ROOT, "404.html"), "utf8");
  const dom404 = new JSDOM(html404);
  check("404: error content", !!dom404.window.document.querySelector(".error-content"));
  check("404: home link", !!dom404.window.document.querySelector("a[href='index.html']"));
}

console.log("\n=== D. سلامتی فایل‌ها ===\n");
{
  ["index.html", "island.html", "store.html", "about.html", "privacy.html"].forEach((page) => {
    const html = fs.readFileSync(path.join(ROOT, page), "utf8");
    check(page + ": links to style.css", html.includes('rel="stylesheet" href="style.css"'));
    check(page + ": links to script.js", html.includes('src="script.js"'));
    check(page + ": manifest", html.includes('rel="manifest"'));
    check(page + ": self-hosted font (no external import)", !html.includes("@import") && !html.includes("fonts.googleapis.com"));
  });

  const css = fs.readFileSync(path.join(ROOT, "style.css"), "utf8");
  check("css: no google fonts import", !css.includes("fonts.googleapis.com"));
  check("css: font-face Vazirmatn", css.includes('url("assets/fonts/Vazirmatn-Regular.woff2")'));
  check("css: RTL-friendly (no negative letter-spacing)", !/letter-spacing:\s*-/.test(css));
  check("css: reduced-motion support", css.includes("prefers-reduced-motion"));

  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "manifest.json"), "utf8"));
  check("manifest: name", manifest.name.includes("پارسا اپس"));
  check("manifest: rtl", manifest.dir === "rtl");
  check("manifest: icons", manifest.icons.length === 2);

  const sw = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");
  check("sw: cache name", sw.includes("parsa-apps-v8"));
  check("sw: caches main pages", sw.includes("./island.html"));
  check("sw: caches animated brand logo", sw.includes("./assets/brand/parsa-apps-animated-logo.gif"));
  check("sw: caches static logo fallback", sw.includes("./assets/brand/parsa-apps-animated-logo-poster-512.png"));
  check("sw: network-first for css/js", /request\.destination === "style"[\s\S]*request\.destination === "script"/.test(sw));
  check("sw: video pass-through (no cache)", /request\.destination === "video"/.test(sw));

  // فایل‌های مورد نیاز وجود دارند
  ["assets/fonts/Vazirmatn-Bold.woff2",
   "assets/images/island/app-screen-1.jpg",
   "assets/images/island/jazireh-promo-cover.jpg",
   "assets/brand/jazireh-fandoghi-app-icon-512.png",
   "assets/videos/jazire_fandoqi_promo_portrait.mp4",
   "assets/brand/parsa-apps-animated-logo.gif",
   "assets/brand/parsa-apps-animated-logo-poster.png",
   "assets/brand/parsa-apps-animated-logo-poster-192.png",
   "assets/brand/parsa-apps-animated-logo-poster-512.png",
   "icons/icon-192.png",
   "icons/icon-512.png",
   "assets/icons/favicon-16.png",
   "assets/icons/favicon-32.png",
   "assets/icons/icon-192.png",
   "assets/icons/icon-512.png",
   "favicon.ico"].forEach((f) => {
    check("exists: " + f, fs.existsSync(path.join(ROOT, f)));
  });
}

console.log("\n=== E. مقاوم‌سازی نمایش محتوا (بدون IntersectionObserver) ===\n");
{
  const { doc, errors } = makeDom("island.html", { noObserver: true });
  check("no-IO: no runtime errors", errors.length === 0, errors.join(" | "));
  check(
    "no-IO: cards stay visible (no js-reveal)",
    doc.querySelectorAll(".feature-3d-card.js-reveal, .trust-card.js-reveal, .review-card.js-reveal").length === 0
  );
  check("no-IO: sections not hidden", doc.querySelectorAll(".section.hidden").length === 0);
  check("no-IO: phone not hidden", !doc.getElementById("phone").classList.contains("js-reveal"));
  check("no-IO: FAQ still works", (() => {
    const first = doc.querySelector(".faq-item");
    if (!first) return false;
    first.querySelector(".faq-question").click();
    return first.classList.contains("active");
  })());
}

console.log("\n=== F. لوگوی اصلی جدید + سینمایی ورود — Parsa-Apps ===\n");
{
  const gifPath = "assets/brand/parsa-apps-animated-logo.gif";
  const posterPath = "assets/brand/parsa-apps-animated-logo-poster-512.png";
  const markPath = "assets/brand/parsa-main-mark.jpg";
  const fullPath = "assets/brand/parsa-main-logo.jpg";
  const introPath = "assets/brand/parsa-main-logo-transparent.png";

  /* لوگوی اصلی جدید: نشان مونوگرام در هدر و فوتر همه‌ی صفحات */
  const pages = ["index.html", "island.html", "store.html", "about.html", "contact.html", "privacy.html", "kartoniya.html"];

  pages.forEach((page) => {
    const { doc, errors } = makeDom(page);
    check(page + ": main logo mark in header", !!doc.querySelector(`.header .logo-mark img.logo-main-mark[src="${markPath}"]`));
    check(page + ": main logo mark in footer", !!doc.querySelector(`.main-footer .logo-mark img.logo-main-mark[src="${markPath}"]`));
    check(page + ": old GIF header markup removed", !doc.querySelector(".header .brand-logo-picture"));
    check(page + ": old HTML letter animation removed", doc.querySelectorAll(".logo-word .ch").length === 0);
    check(page + ": no runtime errors", errors.length === 0, errors.join(" | "));
  });

  /* صفحه‌ی کیت برند هنوز GIF متحرک قدیمی را مستند می‌کند */
  {
    const { doc, errors } = makeDom("brand.html");
    check("brand.html: GIF logo in header", !!doc.querySelector(`.header img.brand-logo-gif[src="${gifPath}"]`));
    check("brand.html: GIF logo in footer", !!doc.querySelector(`.main-footer img.brand-logo-gif[src="${gifPath}"]`));
    check("brand.html: reduced-motion poster source", !!doc.querySelector('.brand-logo-picture source[media*="prefers-reduced-motion"]'));
    check("brand.html: no runtime errors", errors.length === 0, errors.join(" | "));
  }

  const { doc } = makeDom("index.html");
  check("index.html: exact static brand spelling", doc.querySelector(".header .logo-name").textContent === "Parsa-Apps");
  check("index.html: main logo image in hero", !!doc.querySelector(`.hero-logo img.logo-main-hero[src="${fullPath}"]`));
  check("index.html: main logo image in personal introduction", !!doc.querySelector(`.brand-intro-card img.logo-main[src="${fullPath}"]`));
  check("index.html: founder introduction", doc.querySelector(".brand-intro-card").textContent.includes("فرشاد پارسا"));

  /* سینمایی ورود: اولین چیزی که بیننده می‌بیند */
  check("index.html: intro cinematic present", !!doc.getElementById("intro"));
  check("index.html: intro transparent logo", !!doc.querySelector(`#intro img.intro-logo[src="${introPath}"]`));
  check("index.html: intro orbits (2)", doc.querySelectorAll("#intro .intro-orbit").length === 2);
  check("index.html: intro dust canvas", !!doc.querySelector("#intro canvas.intro-dust"));
  check("index.html: intro meter + dot", !!doc.querySelector("#intro .intro-meter .intro-meter-fill") && !!doc.querySelector("#intro .intro-meter .intro-meter-dot"));
  check("index.html: intro tagline", !!doc.querySelector("#intro .intro-tagline"));
  check("index.html: intro engine linked", !!doc.querySelector('script[src="intro.js"]'));
  check("index.html: js marker for intro gating", !!doc.querySelector("head script"));
  check("index.html: intro image preloaded", !!doc.querySelector(`link[rel="preload"][href="${introPath}"]`));

  const { doc: aDoc } = makeDom("about.html");
  check("about.html: cinematic main logo stage", !!aDoc.querySelector(`.about-logo-stage img.about-intro-logo[src="${introPath}"]`));
  check("about.html: page intro overlay present", !!aDoc.getElementById("intro"));
  check("about.html: intro engine linked", !!aDoc.querySelector('script[src="intro.js"]'));
  check("about.html: js marker for intro gating", !!aDoc.querySelector("head script"));
  check("about.html: looping logo lives in about slot", !!aDoc.getElementById("about-intro"));
  check("about.html: looping crown + pieces present", aDoc.querySelectorAll("#about-intro .about-intro-piece").length === 5 && !!aDoc.querySelector("#about-intro .about-intro-crown"));
  check("about.html: mark in founder introduction", !!aDoc.querySelector(`.founder-card img.logo-main-mark[src="${markPath}"]`));
  check("about.html: waits for page load before looping logo", !aDoc.getElementById("about-intro").classList.contains("is-playing"));

  const html404 = fs.readFileSync(path.join(ROOT, "404.html"), "utf8");
  const doc404 = new JSDOM(html404).window.document;
  check("404.html: branded main logo mark", !!doc404.querySelector(`.error-brand img.logo-main-mark[src="${markPath}"]`));

  /* استایل سینمایی ورود */
  const css = fs.readFileSync(path.join(ROOT, "style.css"), "utf8");
  check("css: intro hidden without JS", /\.intro\s*\{[^}]*display:\s*none;/.test(css));
  check("css: intro cinematic keyframes", css.includes("@keyframes introLens") && css.includes("@keyframes introLogoIn") && css.includes("@keyframes introOrbitSpin"));
  check("css: sheen masked by the logo itself", /(?:-webkit-)?mask:\s*url\("assets\/brand\/parsa-main-logo-transparent\.png"\)/.test(css));
  check("css: reduced-motion intro variant", css.includes("introLogoSimple"));
  check("css: hero/header revealed after intro", css.includes("body.is-loaded .hero"));
  check("css: about-page shares soft load with hero/header", css.includes("body.is-loaded .about-page"));
  check("css: about-page looping intro in logo slot", css.includes(".about-intro.is-playing") && css.includes(".about-intro.is-exit"));

  /* ایمنی موتور ورود */
  const introJs = fs.readFileSync(path.join(ROOT, "intro.js"), "utf8");
  check("intro.js: hard exit cap (never stuck)", /setTimeout\(finish, MAX\)/.test(introJs));
  check("intro.js: skip on first interaction", introJs.includes("pointerdown") && introJs.includes("keydown"));
  check("intro.js: reduced motion support", introJs.includes("prefers-reduced-motion"));
  check("intro.js: removes intro node after exit", introJs.includes("removeChild(intro)"));
  check("intro.js: runs only where #intro exists", introJs.includes('getElementById("intro")'));

  const sw = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");
  check("sw: caches main logo assets", sw.includes("parsa-main-logo.jpg") && sw.includes("parsa-main-mark.jpg") && sw.includes("parsa-main-logo-transparent.png"));

  const gif = fs.readFileSync(path.join(ROOT, gifPath));
  check("brand asset: valid GIF signature", gif.subarray(0, 6).toString("ascii") === "GIF89a");
  check("brand asset: compact web size", gif.length < 300 * 1024, "bytes=" + gif.length);

  const generator = fs.readFileSync(path.join(ROOT, "tools/generate_animated_logo.py"), "utf8");
  check("generator: exact Parsa-Apps word", generator.includes('WORD = "Parsa-Apps"'));
  check("generator: letters start beyond right edge", generator.includes("start_x = width + 26"));
  check("generator: writes GIF output", generator.includes("parsa-apps-animated-logo.gif"));

  const poster = fs.readFileSync(path.join(ROOT, posterPath));
  check("poster fallback: PNG signature", poster.subarray(1, 4).toString("ascii") === "PNG");

  /* دارایی‌های لوگوی اصلی */
  const markBuf = fs.readFileSync(path.join(ROOT, "assets/brand/parsa-main-mark.jpg"));
  check("main mark: valid JPEG signature", markBuf[0] === 0xff && markBuf[1] === 0xd8);
  check("main mark: compact for header use", markBuf.length < 150 * 1024, "bytes=" + markBuf.length);
  const introBuf = fs.readFileSync(path.join(ROOT, "assets/brand/parsa-main-logo-transparent.png"));
  check("intro logo: valid PNG signature", introBuf.subarray(1, 4).toString("ascii") === "PNG");
  const fullBuf = fs.readFileSync(path.join(ROOT, "assets/brand/parsa-main-logo.jpg"));
  check("main logo: valid JPEG signature", fullBuf[0] === 0xff && fullBuf[1] === 0xd8);
}

console.log("\n================================");
console.log("نتایج: " + pass + " موفق | " + fail + " ناموفق");
console.log("================================");
process.exit(fail > 0 ? 1 : 0);
