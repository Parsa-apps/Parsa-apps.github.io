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

  // matchMedia stub
  w.matchMedia = (q) => {
    let matches = false;
    if (q.includes("prefers-reduced-motion")) matches = !!opts.reducedMotion;
    if (q.includes("hover: none")) matches = !!opts.coarse;
    const listeners = [];
    return {
      media: q,
      matches,
      addEventListener: (_, cb) => listeners.push(cb),
      removeEventListener: () => {},
      addListener: (cb) => listeners.push(cb),
      removeListener: () => {},
      _listeners: listeners,
    };
  };

  if (opts.saveData || opts.effectiveType) {
    Object.defineProperty(w.navigator, "connection", {
      value: { saveData: !!opts.saveData, effectiveType: opts.effectiveType || "4g" },
      configurable: true,
    });
  }
  if (opts.cores) {
    Object.defineProperty(w.navigator, "hardwareConcurrency", {
      value: opts.cores,
      configurable: true,
    });
  }

  if (!opts.noObserver) {
    w.IntersectionObserver = class {
      constructor(cb, o) {
        this.cb = cb;
        this.opts = o;
        this.targets = [];
        observed.push(this);
      }
      observe(t) {
        this.targets.push(t);
      }
      unobserve(t) {
        this.targets = this.targets.filter((x) => x !== t);
      }
      disconnect() {
        this.targets = [];
      }
      fireAll(isIntersecting = true) {
        this.cb(
          this.targets.map((t) => ({ target: t, isIntersecting })),
          this
        );
      }
    };
  }

  // jsdom getBoundingClientRect always returns zeros -> everything counts as
  // "already in view" via the bottom>0 test failing. Give elements a real box
  // so the observer path is genuinely exercised.
  w.Element.prototype.getBoundingClientRect = function () {
    const far = this.hasAttribute("data-pa-offscreen");
    const top = far ? 5000 : 100;
    return { top, bottom: top + 300, left: 0, right: 800, width: 800, height: 300, x: 0, y: top };
  };

  w.eval(SCRIPT);
  return { dom, w, doc: w.document, errors, observed };
}

console.log("\n=== A. index.html — default (motion enabled) ===");
{
  const { w, doc, errors, observed } = makeDom("index.html", { cores: 8, effectiveType: "4g" });
  check("no runtime errors", errors.length === 0, errors.join(" | "));
  check("body has js-ready", doc.body.classList.contains("js-ready"));
  check("body has js-motion", doc.body.classList.contains("js-motion"));

  const reveals = doc.querySelectorAll("[data-reveal]");
  check("reveal targets found (>=14)", reveals.length >= 14, "count=" + reveals.length);

  const visible = doc.querySelectorAll("[data-reveal].is-visible");
  check("in-view elements revealed", visible.length > 0, "count=" + visible.length);

  // cascade upgrades
  check(".home-hero-copy is cascade", doc.querySelector(".home-hero-copy").hasAttribute("data-cascade"));
  check(".future-copy is cascade", doc.querySelector(".future-copy").hasAttribute("data-cascade"));
  check(
    "all .home-section-head are cascade",
    Array.from(doc.querySelectorAll(".home-section-head")).every((e) => e.hasAttribute("data-cascade"))
  );

  // planned kinds
  check(".brand-showcase reveal=zoom", doc.querySelector(".brand-showcase").getAttribute("data-reveal") === "zoom",
    doc.querySelector(".brand-showcase").getAttribute("data-reveal"));
  check(".main-product-card reveal=zoom", doc.querySelector(".main-product-card").getAttribute("data-reveal") === "zoom");
  check(".future-visual reveal=scale", doc.querySelector(".future-visual").getAttribute("data-reveal") === "scale");

  // all five required sections animate
  const required = {
    Hero: ".home-hero-copy[data-reveal], .brand-showcase[data-reveal]",
    "Island product card": ".main-product-card[data-reveal]",
    "Feature/value cards": ".home-value-card[data-reveal]",
    "Future section": ".future-copy[data-reveal], .future-visual[data-reveal]",
    Footer: ".home-footer-top > [data-reveal]",
  };
  Object.entries(required).forEach(([label, sel]) => {
    check("section animated: " + label, doc.querySelectorAll(sel).length > 0);
  });

  check("4 value cards tagged", doc.querySelectorAll(".home-value-card[data-reveal]").length === 4);

  // stagger indices
  const idx = Array.from(doc.querySelectorAll(".home-values-grid > [data-reveal]")).map((e) =>
    e.style.getPropertyValue("--pa-i")
  );
  check("value cards staggered 0..3", idx.join(",") === "0,1,2,3", idx.join(","));

  // ambient
  const amb = doc.querySelectorAll(".pa-ambient");
  check("ambient layers built", amb.length >= 4, "count=" + amb.length);
  check("ambient is aria-hidden", Array.from(amb).every((a) => a.getAttribute("aria-hidden") === "true"));
  check("wash layers exist", doc.querySelectorAll(".pa-wash").length >= 4);
  check("floating shapes exist", doc.querySelectorAll(".pa-shape").length >= 8,
    "count=" + doc.querySelectorAll(".pa-shape").length);
  check("particles exist", doc.querySelectorAll(".pa-dot").length >= 15,
    "count=" + doc.querySelectorAll(".pa-dot").length);
  check("hero has ambient", !!doc.querySelector(".home-hero > .pa-ambient"));
  check("future has ambient", !!doc.querySelector(".future-section > .pa-ambient"));
  check("footer has ambient", !!doc.querySelector(".home-footer > .pa-ambient"));
  check("hosts start pa-idle (paused)", doc.querySelectorAll(".pa-ambient-host.pa-idle").length >= 4);

  // ambient must never become a reveal target
  check("no ambient tagged as reveal", doc.querySelectorAll(".pa-ambient[data-reveal]").length === 0);

  // no content loss
  const orig = new JSDOM(fs.readFileSync(path.join(ROOT, "index.html"), "utf8")).window.document;
  const norm = (d) => d.body.textContent.replace(/\s+/g, " ").trim();
  check("no text content removed", norm(doc) === norm(orig));

  // structural integrity: same element count except injected motion nodes
  const injected = doc.querySelectorAll(
    ".pa-ambient, .pa-ambient *, .pa-tilt-light, .pa-ripple"
  ).length;
  check(
    "no elements removed",
    doc.querySelectorAll("*").length - injected === orig.querySelectorAll("*").length,
    `${doc.querySelectorAll("*").length - injected} vs ${orig.querySelectorAll("*").length}`
  );

  // parallax
  check("brand-showcase has parallax", doc.querySelector(".brand-showcase").classList.contains("pa-parallax"));
  check("future-visual has parallax", doc.querySelector(".future-visual").classList.contains("pa-parallax"));

  // v2: playful ambient elements (stars / clouds / bubbles / blobs)
  check("twinkling stars exist", doc.querySelectorAll(".pa-star").length >= 8,
    "count=" + doc.querySelectorAll(".pa-star").length);
  check("clouds exist", doc.querySelectorAll(".pa-cloud").length >= 2,
    "count=" + doc.querySelectorAll(".pa-cloud").length);
  check("bubbles exist", doc.querySelectorAll(".pa-bubble").length >= 3,
    "count=" + doc.querySelectorAll(".pa-bubble").length);
  check("gradient blobs exist in hero", doc.querySelectorAll(".home-hero .pa-blob").length >= 2,
    "count=" + doc.querySelectorAll(".home-hero .pa-blob").length);

  // v2: 3D tilt on the main product card + travelling light layer
  const mainCard = doc.querySelector(".main-product-card");
  check("product card has 3D tilt", mainCard.classList.contains("pa-tilt"));
  check("product card has light layer", !!mainCard.querySelector(":scope > .pa-tilt-light"));
  check("light layer aria-hidden", mainCard.querySelector(".pa-tilt-light").getAttribute("aria-hidden") === "true");

  // v2: press ripple hosts on interactive elements
  check("buttons are ripple hosts", doc.querySelectorAll(".btn.pa-ripple-host").length >= 2,
    "count=" + doc.querySelectorAll(".btn.pa-ripple-host").length);
  check("product link is ripple host", doc.querySelector(".product-link").classList.contains("pa-ripple-host"));

  // v2: scroll-linked parallax registered on decorative layers only
  const scrolled = doc.querySelectorAll(".pa-scrolled");
  check("scroll parallax layers registered", scrolled.length >= 4, "count=" + scrolled.length);
  check(
    "scroll parallax never targets text",
    Array.from(scrolled).every((e) =>
      e.classList.contains("pa-shape") || e.classList.contains("pa-blob") || e.classList.contains("hero-glow")
    )
  );

  // observer: offscreen elements are observed, then reveal on intersect
  const revealObs = observed[0];
  check("an IntersectionObserver was created", !!revealObs);

  // RTL preserved
  check("html dir=rtl untouched", doc.documentElement.getAttribute("dir") === "rtl");
  check("html lang=fa untouched", doc.documentElement.getAttribute("lang") === "fa");

  // year
  check("year localised to fa-IR", /[۰-۹]/.test(doc.querySelector("[data-year]").textContent),
    doc.querySelector("[data-year]").textContent);
}

console.log("\n=== B. index.html — prefers-reduced-motion: reduce ===");
{
  const { doc, errors } = makeDom("index.html", { reducedMotion: true });
  check("no runtime errors", errors.length === 0, errors.join(" | "));
  check("js-motion NOT applied", !doc.body.classList.contains("js-motion"));
  const rv = doc.querySelectorAll("[data-reveal]");
  check("reveal targets still tagged", rv.length >= 14, "count=" + rv.length);
  check(
    "ALL content immediately visible",
    Array.from(rv).every((e) => e.classList.contains("is-visible")),
    Array.from(rv).filter((e) => !e.classList.contains("is-visible")).length + " hidden"
  );
  check("ALL marked settled", Array.from(rv).every((e) => e.classList.contains("pa-settled")));
  check("NO ambient layers created", doc.querySelectorAll(".pa-ambient").length === 0);
  check("NO particles created", doc.querySelectorAll(".pa-dot").length === 0);
  check("NO parallax attached", doc.querySelectorAll(".pa-parallax").length === 0);
  check("NO tilt attached", doc.querySelectorAll(".pa-tilt").length === 0);
  check("NO ripple hosts attached", doc.querySelectorAll(".pa-ripple-host").length === 0);
  check("NO scroll parallax attached", doc.querySelectorAll(".pa-scrolled").length === 0);
}

console.log("\n=== C. index.html — no IntersectionObserver (legacy fallback) ===");
{
  const { doc, errors } = makeDom("index.html", { noObserver: true, cores: 8 });
  check("no runtime errors", errors.length === 0, errors.join(" | "));
  const rv = doc.querySelectorAll("[data-reveal]");
  check("everything visible (no blank page)", Array.from(rv).every((e) => e.classList.contains("is-visible")),
    Array.from(rv).filter((e) => !e.classList.contains("is-visible")).length + " hidden");
  check("ambient hosts un-idled", doc.querySelectorAll(".pa-ambient-host.pa-idle").length === 0);
}

console.log("\n=== D. Save-Data / slow network / low-power ===");
{
  const { doc, errors } = makeDom("index.html", { saveData: true, cores: 8 });
  check("saveData: no errors", errors.length === 0, errors.join(" | "));
  check("saveData: ambient skipped", doc.querySelectorAll(".pa-ambient").length === 0);
  check("saveData: reveals still work", doc.querySelectorAll("[data-reveal].is-visible").length > 0);
}
{
  const { doc } = makeDom("index.html", { effectiveType: "2g", cores: 8 });
  check("2g: ambient skipped", doc.querySelectorAll(".pa-ambient").length === 0);
}
{
  const { doc } = makeDom("index.html", { effectiveType: "4g", cores: 8 });
  check("4g: ambient enabled", doc.querySelectorAll(".pa-ambient").length > 0);
}
{
  const { doc } = makeDom("index.html", { cores: 2 });
  check("low-power: ambient still on but no parallax", doc.querySelectorAll(".pa-ambient").length > 0 &&
    doc.querySelectorAll(".pa-parallax").length === 0);
  check("low-power: fewer particles", doc.querySelectorAll(".pa-dot").length <= 25,
    "count=" + doc.querySelectorAll(".pa-dot").length);
}
{
  const { doc } = makeDom("index.html", { coarse: true, cores: 8 });
  check("touch device: no parallax", doc.querySelectorAll(".pa-parallax").length === 0);
  check("touch device: ambient still present", doc.querySelectorAll(".pa-ambient").length > 0);
  check("touch device: no 3D tilt", doc.querySelectorAll(".pa-tilt").length === 0);
  check("touch device: no scroll parallax", doc.querySelectorAll(".pa-scrolled").length === 0);
  check("touch device: ripples still work (tap feedback)", doc.querySelectorAll(".pa-ripple-host").length > 0);
}
{
  const { doc } = makeDom("index.html", { cores: 2 });
  check("low-power: no 3D tilt", doc.querySelectorAll(".pa-tilt").length === 0);
  check("low-power: no scroll parallax", doc.querySelectorAll(".pa-scrolled").length === 0);
}

console.log("\n=== E. Other pages ===");
["island.html", "contact.html", "kartoniya.html", "brand.html", "404.html", "about.html", "privacy.html"].forEach(
  (page) => {
    const { doc, errors } = makeDom(page);
    check(page + ": no runtime errors", errors.length === 0, errors.join(" | "));
    const n = doc.querySelectorAll("[data-reveal]").length;
    check(page + ": has reveal targets", n > 0, "count=" + n);
    check(
      page + ": in-view content visible",
      doc.querySelectorAll("[data-reveal].is-visible").length > 0
    );
    const orig = new JSDOM(fs.readFileSync(path.join(ROOT, page), "utf8")).window.document;
    const norm = (d) => d.body.textContent.replace(/\s+/g, " ").trim();
    check(page + ": text preserved", norm(doc) === norm(orig));
  }
);

console.log("\n=== F. island.html specifics (feature cards) ===");
{
  const { doc } = makeDom("island.html");
  check("4 feature cards animated", doc.querySelectorAll(".feature[data-reveal]").length === 4);
  check("feature cards staggered", Array.from(doc.querySelectorAll(".feature-grid > [data-reveal]"))
    .map((e) => e.style.getPropertyValue("--pa-i")).join(",") === "0,1,2,3");
  check("why cards animated", doc.querySelectorAll(".why-card[data-reveal]").length === 4);
  check("shot cards animated", doc.querySelectorAll(".shot-card[data-reveal]").length === 3);
  check("island hero has ambient", !!doc.querySelector(".island-hero > .pa-ambient"));
  check("footer legal animated", !!doc.querySelector(".legal[data-reveal]"));
  check("legacy .reveal elements not double-tagged into hidden state",
    Array.from(doc.querySelectorAll(".reveal")).every((e) => !e.hasAttribute("data-reveal") || e.classList.contains("is-visible")));
}

console.log("\n=== G. contact.html form still works ===");
{
  const { w, doc, errors } = makeDom("contact.html");
  check("no errors before submit", errors.length === 0, errors.join(" | "));
  const form = doc.querySelector("#contact-form");
  check("form found", !!form);
  form.querySelector("#name").value = "مریم";
  form.querySelector("#email").value = "a@b.com";
  form.querySelector("#message").value = "سلام";
  // jsdom forbids overriding window.location; instead it reports the blocked
  // navigation ("Not implemented: navigation to mailto:…") through the
  // virtual console, which makeDom collects into `errors`.
  form.dispatchEvent(new w.Event("submit", { bubbles: true, cancelable: true }));
  const navBlocked = errors.some((e) => e.includes("navigation"));
  check("submit triggers mailto navigation", navBlocked, errors.join(" | ").slice(0, 120));
  check("success message shown", doc.querySelector(".form-success").classList.contains("show"));
}

console.log("\n=== H. Nav toggle behaviour ===");
{
  const { w, doc } = makeDom("index.html");
  const toggle = doc.querySelector(".nav-toggle");
  const links = doc.querySelector(".nav-links");
  toggle.dispatchEvent(new w.Event("click", { bubbles: true }));
  check("menu opens", links.classList.contains("open") && toggle.getAttribute("aria-expanded") === "true");
  check("aria-label switches to close", toggle.getAttribute("aria-label") === "بستن فهرست");
  toggle.dispatchEvent(new w.Event("click", { bubbles: true }));
  check("menu closes", !links.classList.contains("open") && toggle.getAttribute("aria-expanded") === "false");
}

console.log("\n=== I. Idempotency (double init safety) ===");
{
  const { w, doc } = makeDom("index.html", { cores: 8 });
  const before = doc.querySelectorAll(".pa-ambient").length;
  w.eval(SCRIPT);
  const after = doc.querySelectorAll(".pa-ambient").length;
  check("re-running script does not duplicate ambient", before === after, before + " -> " + after);
}

console.log(`\n================ ${pass} passed, ${fail} failed ================\n`);
process.exit(fail ? 1 : 0);
