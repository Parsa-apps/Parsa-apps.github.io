/* ============================================================
   پارسا اپس — Parsa-Apps
   موتور سینمایی ورود | بدون هیچ کتابخانه‌ی خارجی
   نمایش لوگوی اصلی: متمرکز شدن (focus-pull)، درخشش نور،
   دو مدار کونیک، ذرات طلایی، خط پیشرفت و خروج لنسی
   ────────────────────────────────────────────────────────────
   نکات فنی:
   - فقط صفحه‌ای که حاوی #intro باشد (حالت‌های پنهان اولیه
     در CSS داخل scope .js قرار دارند؛ بدون JS صفحه دست‌نخورده است).
   - خروج: max(حداقل زمان، لود کامل صفحه) + سقف سخت زمانی.
     سقف سخت «اول از همه» ثبت می‌شود تا حتی اگر خطایی رخ دهد،
     محتوا هرگز پشت پردهی ورود گیر نکند.
   - کلیک / لمس / کلید: شتاب‌دهی فوری به خروج.
   - prefers-reduced-motion: نسخه‌ی ساده و کوتاه.
   - canvas فقط با پشتیبانی واقعی فعال می‌شود (jsdom و مرورگرهای
     قدیمی: بدون خطا، ذرات بی‌سروصدا رد می‌شوند).
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

    var n = window.innerWidth < 640 ? 22 : 38;
    for (var i = 0; i < n; i++) {
      parts.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (0.6 + Math.random() * 1.9) * dpr,
        vy: (0.1 + Math.random() * 0.28) * dpr,
        vx: (Math.random() - 0.5) * 0.1 * dpr,
        tw: Math.random() * Math.PI * 2,
        ts: 0.006 + Math.random() * 0.02,
        hue: 36 + Math.random() * 16,
        a: 0.2 + Math.random() * 0.5,
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

  /* ---------- فرماندهی چرخه‌ی حیات ---------- */
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
    var t0 = 0;
    try {
      t0 = window.performance ? performance.now() : Date.now();
    } catch (e) {
      t0 = Date.now();
    }

    function elapsed() {
      try {
        return (window.performance ? performance.now() : Date.now()) - t0;
      } catch (e) {
        return Date.now() - t0;
      }
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
      } catch (e) {
        /* اگر افزودن کلاس ممکن نبود، در ادامه گره حذف می‌شود */
      }
      setTimeout(function () {
        try {
          if (intro.parentNode) intro.parentNode.removeChild(intro);
        } catch (e) {}
      }, 1250);
    }

    var MIN = reduced ? 1000 : 3050;
    var MAX = reduced ? 1700 : 6500;

    /* ۱) سقف سخت: اول از همه ثبت می‌شود تا محتوا هرگز گیر نکند */
    setTimeout(finish, MAX);

    function tryFinish() {
      if (exited) return;
      if (document.readyState === "complete" && elapsed() >= MIN) finish();
    }

    tryFinish();
    window.addEventListener("load", tryFinish, { once: true });
    setTimeout(tryFinish, MIN);

    /* ۲) قفل اسکرول در طول نمایش */
    try {
      body.classList.add("intro-lock");
    } catch (e) {}

    /* ۳) ذرات: فقط وقتی canvas واقعاً getContext را بدهد */
    var dust = null;
    if (!reduced) {
      try {
        var canvas = intro.querySelector(".intro-dust");
        var ctx = canvas && canvas.getContext ? canvas.getContext("2d") : null;
        if (ctx && typeof ctx.clearRect === "function") dust = startDust(ctx, canvas);
      } catch (e) {
        dust = null;
      }
    }

    /* ۴) شتاب‌دهی کاربر: اولین تعامل → خروج فوری */
    ["pointerdown", "keydown", "touchstart"].forEach(function (ev) {
      try {
        intro.addEventListener(ev, finish, { once: true, passive: true });
      } catch (e) {
        try {
          intro.addEventListener(ev, finish);
        } catch (e2) {}
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
