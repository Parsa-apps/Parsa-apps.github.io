/* ============================================================
   AURUM 2.0 - interaction layer (additive, defensive)
   ambience / scroll state / cursor glow / magnetic / count-up
   ============================================================ */
(function () {
  "use strict";
  if (window.__AURUM_V2__) return;
  window.__AURUM_V2__ = true;

  var d = document;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia && matchMedia("(pointer: fine)").matches;
  var FA = "\u06F0\u06F1\u06F2\u06F3\u06F4\u06F5\u06F6\u06F7\u06F8\u06F9";

  function toFa(n) {
    return String(n).replace(/\d/g, function (x) { return FA[+x]; });
  }

  /* ---- ambience + grain ---- */
  if (!reduce) {
    var amb = d.createElement("div");
    amb.className = "au-ambience";
    amb.setAttribute("aria-hidden", "true");
    amb.appendChild(d.createElement("i"));
    amb.appendChild(d.createElement("i"));
    amb.appendChild(d.createElement("i"));
    d.body.appendChild(amb);
  }
  var grain = d.createElement("div");
  grain.className = "au-grain";
  grain.setAttribute("aria-hidden", "true");
  d.body.appendChild(grain);

  /* ---- scroll progress + header state ---- */
  var bar = d.createElement("div");
  bar.className = "au-progress";
  bar.setAttribute("aria-hidden", "true");
  d.body.appendChild(bar);

  var docEl = d.documentElement;
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var top = window.scrollY || docEl.scrollTop || 0;
      var max = (docEl.scrollHeight - docEl.clientHeight) || 1;
      bar.style.width = Math.min(100, (top / max) * 100) + "%";
      docEl.classList.toggle("au-scrolled", top > 14);
      ticking = false;
    });
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- cursor glow: set --au-mx/--au-my on cards ---- */
  if (fine && !reduce) {
    var CARDS = ".product-card,.flagship-card,.contact-form-card,.contact-info-card,.shot-card";
    function glow(e) {
      var card = e.currentTarget;
      var r = card.getBoundingClientRect();
      card.style.setProperty("--au-mx", ((e.clientX - r.left) / r.width) * 100 + "%");
      card.style.setProperty("--au-my", ((e.clientY - r.top) / r.height) * 100 + "%");
    }
    d.querySelectorAll(CARDS).forEach(function (c) {
      c.addEventListener("pointermove", glow);
    });

    /* ---- subtle tilt for flagship + products ---- */
    d.querySelectorAll(".product-card,.flagship-card").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var rx = ((e.clientY - r.top) / r.height - 0.5) * -4.5;
        var ry = ((e.clientX - r.left) / r.width - 0.5) * 4.5;
        card.style.transform = "perspective(900px) translateY(-7px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
      });
      card.addEventListener("pointerleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ---- staggered reveal for grids ---- */
  if ("IntersectionObserver" in window) {
    var groups = {};
    d.querySelectorAll(".reveal").forEach(function (el, i) {
      var p = el.parentElement;
      if (!p) return;
      var key = p.id || p.className || "g" + i;
      groups[key] = groups[key] || [];
      var sibs = groups[key];
      if (sibs.length < 9) {
        el.style.transitionDelay = (sibs.length * 90) + "ms";
      }
      sibs.push(el);
    });
  }

  /* ---- metric count-up ---- */
  function countUp(el) {
    var raw = (el.textContent || "").trim();
    var latin = raw.replace(/[\u06F0-\u06F9]/g, function (ch) {
      var idx = FA.indexOf(ch);
      return idx >= 0 ? String(idx) : ch;
    });
    var m = latin.match(/^(\d+)(.*)$/);
    if (!m || m[1].length > 6) return;
    var target = parseInt(m[1], 10);
    var suffix = m[2] || "";
    var isFaText = /[\u06F0-\u06F9]/.test(raw);
    if (reduce || target <= 1) return;
    var t0 = null;
    var dur = 1200;
    function step(t) {
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      var v = String(Math.round(target * eased));
      el.textContent = (isFaText ? toFa(v) : v) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          countUp(en.target);
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.7 });
    d.querySelectorAll(".metric-value").forEach(function (n) { io.observe(n); });
  }

  /* ---- hero crest gentle float ---- */
  if (!reduce) {
    var crest = d.querySelector(".hero-crest-stage");
    if (crest) {
      var logo = crest.querySelector("img") || crest;
      var ph = 0;
      (function float() {
        ph += 0.016;
        var y = Math.sin(ph) * 5;
        var r = Math.sin(ph * 0.7) * 0.6;
        logo.style.transform = "translateY(" + y.toFixed(1) + "px) rotate(" + r.toFixed(2) + "deg)";
        requestAnimationFrame(float);
      })();
    }
  }
})();
