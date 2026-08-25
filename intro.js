/* ============================================================
   پارسا اپس — Parsa-Apps
   موتور سینمایی ورود | بدون هیچ کتابخانه‌ی خارجی
   نمایش لوگوی رسمی:
   ۱) ورود قطعه‌به‌قطعه‌ی لوگو (تکه‌های مونتاژ)
   ۲) ظهور و چرخش هاله‌ی طلایی دور لوگوی کامل
   ۳) فرود شکوهمند تاج طلایی پادشاهی روی سر لوگو + فلاش نور
   ۴) خروج لنسی نرم و ورود به محتوای سایت
   ============================================================ */
(function () {
  "use strict";

  /* ---------- ذرات طلایی شناور ---------- */
  function startDust(ctx, canvas) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0,
      h = 0,
      parts = [],
      raf = 0,
      stopped = false;

    function size() {
      w = canvas.width = Math.floor(window.innerWidth * dpr);
      h = canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    }

    size();

    var n = window.innerWidth < 640 ? 24 : 42;
    for (var i = 0; i < n; i++) {
      parts.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (0.6 + Math.random() * 2.0) * dpr,
        vy: (0.12 + Math.random() * 0.3) * dpr,
        vx: (Math.random() - 0.5) * 0.12 * dpr,
        tw: Math.random() * Math.PI * 2,
        ts: 0.006 + Math.random() * 0.02,
        hue: 36 + Math.random() * 16,
        a: 0.25 + Math.random() * 0.55,
      });
    }

    function tick() {
      if (stopped) return;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.y -= p.vy;
        p.x += p.vx;
        p.tw += p.ts;
        if (p.y < -14) {
          p.y = h + 14;
          p.x = Math.random() * w;
        }
        if (p.x < -14) p.x = w + 14;
        else if (p.x > w + 14) p.x = -14;

        var alpha = p.a * (0.55 + 0.45 * Math.sin(p.tw));
        var light = Math.round(58 + 18 * Math.sin(p.tw * 0.7));

        /* هاله‌ی نرم دور ذره */
        ctx.beginPath();
        ctx.fillStyle =
          "hsla(" + p.hue + ", 92%, " + light + "%, " + (alpha * 0.22).toFixed(3) + ")";
        ctx.arc(p.x, p.y, p.r * 3, 0, 6.2832);
        ctx.fill();

        /* هسته‌ی درخشان */
        ctx.beginPath();
        ctx.fillStyle =
          "hsla(" + p.hue + ", 95%, " + Math.min(92, light + 22) + "%, " + alpha.toFixed(3) + ")";
        ctx.arc(p.x, p.y, p.r, 0, 6.2832);
        ctx.fill();
      }
      raf = window.requestAnimationFrame(tick);
    }

    tick();
    window.addEventListener("resize", size);

    return {
      stop: function () {
        stopped = true;
        window.cancelAnimationFrame(raf);
      },
    };
  }

  /* ---------- فرماندهی چرخه‌ی حیات سینمایی ---------- */
  function boot() {
    var intro = document.getElementById("intro");
    if (!intro || intro.dataset.running) return;
    intro.dataset.running = "1";

    var body = document.body;
    var reduced = false;
    try {
      reduced =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {
      reduced = false;
    }
    var exited = false;
    var dust = null;
    var t0 = 0;

    /* قفل اسکرول در طول نمایش اینترو */
    try {
      body.classList.add("intro-lock");
    } catch (e) {}

    /* ذرات طلایی */
    if (!reduced) {
      try {
        var dustCanvas = intro.querySelector(".intro-dust");
        var dustCtx = dustCanvas && dustCanvas.getContext ? dustCanvas.getContext("2d") : null;
        if (dustCtx && typeof dustCtx.clearRect === "function") dust = startDust(dustCtx, dustCanvas);
      } catch (e) {
        dust = null;
      }
    }

    function now() {
      try {
        return window.performance ? performance.now() : Date.now();
      } catch (e) {
        return Date.now();
      }
    }

    function elapsed() {
      return now() - t0;
    }

    function finish() {
      if (exited) return;
      exited = true;
      try {
        if (dust) dust.stop();
      } catch (e) {}
      try {
        intro.classList.add("intro--exit");
        body.classList.remove("intro-lock");
        body.classList.add("is-loaded"); /* ورود نرم هیرو و هدر */
      } catch (e) {}
      setTimeout(function () {
        try {
          if (intro.parentNode) intro.parentNode.removeChild(intro);
        } catch (e) {}
      }, 1100);
    }

    t0 = now();
    var MIN = reduced ? 800 : 4750;
    var MAX = reduced ? 1500 : 7200;

    /* ۱) سقف سخت زمانی: تضمین می‌کند کاربر هرگز پشت پرده نمی‌ماند */
    setTimeout(finish, MAX);

    function tryFinish() {
      if (exited) return;
      if (document.readyState === "complete" && elapsed() >= MIN) finish();
    }

    tryFinish();
    window.addEventListener("load", tryFinish, { once: true });
    setTimeout(tryFinish, MIN);

    /* ۲) شتاب‌دهی کاربر با تعامل بعد از آغاز مونتاژ (مهلت اولیه جهت جلوگیری از پرش تصادفی) */
    setTimeout(function () {
      ["pointerdown", "keydown", "touchstart"].forEach(function (ev) {
        try {
          intro.addEventListener(ev, finish, { once: true, passive: true });
        } catch (e) {
          try {
            intro.addEventListener(ev, finish);
          } catch (e2) {}
        }
      });
    }, 1200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
