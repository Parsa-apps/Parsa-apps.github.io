/* =====================================================================
   PARSA APPS — MOTION ENGINE
   Cinematic loader • particle fields • 3D tilt • scroll-driven reveals
   ===================================================================== */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };

  /* =====================================================================
     1. LOADER — cinematic logo assembly + curtain reveal
     ===================================================================== */
  var loader = $('#loader');
  var loaderBar = $('#loaderBar');
  var loaderStatus = $('#loaderStatus');
  var loaderDone = false;

  var STATUS = [
    ['INITIALIZING CORE', 'راه‌اندازی هسته'],
    ['DRAWING MONOGRAM', 'ترسیم مونوگرام P'],
    ['CONNECTING CIRCUITS', 'اتصال مدارهای نئونی'],
    ['CHARGING SHADERS', 'شارژ نور و سایه'],
    ['PLACING CROWN', 'نشان‌گذاری طلایی'],
    ['READY', 'آماده']
  ];

  function runLoader() {
    if (!loader) return;
    if (REDUCED) {
      loader.classList.add('gone');
      loader.remove();
      document.body.classList.remove('lock');
      startHero();
      return;
    }

    var t0 = performance.now();
    var DURATION = 3600;
    var frame;
    var idx = 0;
    var statusFlick = 0;

    function tick(now) {
      var t = clamp((now - t0) / DURATION, 0, 1);
      var eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; // easeInOut
      var pct = Math.round(eased * 100);

      if (loaderBar) loaderBar.style.width = pct + '%';

      statusFlick += 1;
      var si = Math.min(STATUS.length - 1, Math.floor(t * STATUS.length));
      if (si !== idx) {
        idx = si;
        if (loaderStatus) loaderStatus.innerHTML = STATUS[si][0] + ' · ' + STATUS[si][1] + ' <span class="tick">▮</span>';
      } else if (loaderStatus && statusFlick % 14 === 0) {
        loaderStatus.innerHTML = STATUS[si][0] + ' · ' + STATUS[si][1] + ' <span class="tick">▮</span>';
      }

      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        finishLoader();
      }
    }
    frame = requestAnimationFrame(tick);

    // safety: never hold the user beyond 5.2s
    setTimeout(function () {
      if (!loaderDone) finishLoader(true);
    }, 5200);

    function finishLoader(force) {
      if (loaderDone) return;
      loaderDone = true;
      cancelAnimationFrame(frame);
      loader.classList.add('done');
      startHero();
      // unlock scroll after curtains finish opening
      setTimeout(function () { document.body.classList.remove('lock'); }, 1050);
      setTimeout(function () {
        loader.classList.add('gone');
        loader.style.display = 'none';
        window.dispatchEvent(new CustomEvent('parsa:loaded'));
      }, 1350);
    }
  }

  /* =====================================================================
     2. PARTICLE FIELDS (canvas)
     ===================================================================== */
  function ParticleField(canvas, opts) {
    if (!canvas) return null;
    var ctx = canvas.getContext('2d');
    var o = opts || {};
    var W = 0, H = 0, DPR = 1;
    var parts = [];
    var links = [];
    var running = true;

    var COLORS = o.colors || ['139,123,255', '63,224,255', '245,197,102', '255,110,199'];
    var COUNT = o.count || 60;
    var LINK_DIST = o.linkDist || 130;
    var SPEED = o.speed || 0.22;
    var MOUSE = o.mouse || false;
    var mouse = { x: -9999, y: -9999 };

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth || window.innerWidth;
      H = canvas.clientHeight || window.innerHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      seed();
    }

    function seed() {
      var n = REDUCED ? 0 : Math.round(COUNT * clamp(W / 1440, 0.42, 1));
      parts = [];
      for (var i = 0; i < n; i++) {
        parts.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * SPEED,
          vy: (Math.random() - 0.5) * SPEED,
          r: Math.random() * 1.6 + 0.4,
          c: COLORS[(Math.random() * COLORS.length) | 0],
          a: Math.random() * 0.5 + 0.15,
          ph: Math.random() * Math.PI * 2
        });
      }
    }

    function step(t) {
      if (!running) { requestAnimationFrame(step); return; }
      ctx.clearRect(0, 0, W, H);
      var i, j, p, q;

      for (i = 0; i < parts.length; i++) {
        p = parts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;

        // gentle mouse repulsion
        if (MOUSE) {
          var dx = p.x - mouse.x, dy = p.y - mouse.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < 120 * 120 && d2 > 0.01) {
            var d = Math.sqrt(d2);
            p.x += (dx / d) * 0.9;
            p.y += (dy / d) * 0.9;
          }
        }

        var tw = 0.55 + 0.45 * Math.sin(t * 0.002 + p.ph);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.c + ',' + (p.a * tw).toFixed(3) + ')';
        ctx.fill();
      }

      // connection lines
      ctx.lineWidth = 0.5;
      for (i = 0; i < parts.length; i++) {
        for (j = i + 1; j < parts.length; j++) {
          p = parts[i]; q = parts[j];
          var ddx = p.x - q.x, ddy = p.y - q.y;
          var dist = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dist < LINK_DIST) {
            ctx.strokeStyle = 'rgba(139,123,255,' + ((1 - dist / LINK_DIST) * 0.16).toFixed(3) + ')';
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(step);
    }

    if (MOUSE && FINE_POINTER) {
      window.addEventListener('mousemove', function (e) {
        mouse.x = e.clientX; mouse.y = e.clientY;
      }, { passive: true });
    }

    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(step);

    return {
      pause: function () { running = false; },
      play: function () { running = true; }
    };
  }

  /* =====================================================================
     3. CUSTOM CURSOR
     ===================================================================== */
  function cursorFX() {
    if (!FINE_POINTER || REDUCED) return;
    var dot = $('.cursor-dot');
    var ring = $('.cursor-ring');
    if (!dot || !ring) return;
    var mx = -100, my = -100, rx = -100, ry = -100;

    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.opacity = '1'; ring.style.opacity = '1';
      var t = e.target.closest ? e.target.closest('a,button,.proj-card,.gal-item,.hero-chip,.skill-card,.up-item') : null;
      ring.classList.toggle('grow', !!t);
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      dot.style.opacity = '0'; ring.style.opacity = '0';
    });

    (function loop() {
      rx = lerp(rx, mx, 0.16);
      ry = lerp(ry, my, 0.16);
      dot.style.transform = 'translate3d(' + (mx - 3) + 'px,' + (my - 3) + 'px,0)';
      ring.style.transform = 'translate3d(' + (rx - ring.offsetWidth / 2) + 'px,' + (ry - ring.offsetHeight / 2) + 'px,0)';
      requestAnimationFrame(loop);
    })();
  }

  /* =====================================================================
     4. HERO: staged entrance + 3D core parallax + magnetic buttons
     ===================================================================== */
  function startHero() {
    document.body.classList.add('loaded');
    var hero = $('#hero');
    if (hero) hero.classList.add('in');
  }

  function hero3D() {
    if (REDUCED || !FINE_POINTER) return;
    var stage = $('#heroStage');
    if (!stage) return;

    var tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', function (e) {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    (function loop() {
      cx = lerp(cx, tx, 0.07);
      cy = lerp(cy, ty, 0.07);
      stage.style.transform = 'translate3d(' + (cx * 14).toFixed(2) + 'px,' + (cy * 10).toFixed(2) + 'px,0) rotateY(' + (cx * 14).toFixed(2) + 'deg) rotateX(' + (-cy * 12).toFixed(2) + 'deg)';
      requestAnimationFrame(loop);
    })();
  }

  function magnetic() {
    if (!FINE_POINTER || REDUCED) return;
    $$('.btn, .socials a, .to-top').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) * 0.22;
        var dy = (e.clientY - r.top - r.height / 2) * 0.28;
        el.style.transform = 'translate3d(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px,0)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transition = 'transform .6s cubic-bezier(.34,1.56,.64,1)';
        el.style.transform = '';
        setTimeout(function () { el.style.transition = ''; }, 620);
      });
    });
  }

  function phoneTilt() {
    var phone = $('#phone3d');
    var stage = $('#phoneStage');
    if (!phone || !stage) return;
    if (REDUCED) return;

    var rx = 0, ry = 0, trx = 0, try_ = 0;
    window.addEventListener('mousemove', function (e) {
      var r = stage.getBoundingClientRect();
      var dx = (e.clientX - r.left - r.width / 2) / r.width;
      var dy = (e.clientY - r.top - r.height / 2) / r.height;
      try_ = clamp(dx, -1, 1) * 16;
      trx = clamp(dy, -1, 1) * -14;
    }, { passive: true });

    (function loop() {
      rx = lerp(rx, trx, 0.09);
      ry = lerp(ry, try_, 0.09);
      phone.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
      requestAnimationFrame(loop);
    })();
  }

  /* =====================================================================
     5. SCROLL ENGINE: progress, nav, reveals, counters, parallax, timeline
     ===================================================================== */
  function initScroll() {
    var progress = $('#scrollProgress');
    var nav = $('#nav');
    var toTop = $('.to-top');
    var lastY = 0;

    function onScroll() {
      var y = window.scrollY || document.documentElement.scrollTop;
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var p = max > 0 ? y / max : 0;
      if (progress) progress.style.transform = 'scaleX(' + p.toFixed(4) + ')';

      // timeline progress
      var tl = $('.timeline');
      if (tl) {
        var r = tl.getBoundingClientRect();
        var vh = window.innerHeight;
        var prog = clamp((vh * 0.72 - r.top) / (r.height + vh * 0.1), 0, 1) * 100;
        tl.style.setProperty('--tl-progress', prog.toFixed(1));
      }

      if (nav) {
        nav.classList.toggle('solid', y > 30);
        nav.classList.toggle('hidden', y > 500 && y > lastY && y < doc.scrollHeight - vp() * 1.4);
      }
      lastY = y;
      if (toTop) toTop.classList.toggle('show', y > 900);
    }
    function vp() { return window.innerHeight || 800; }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Scroll-spy
    var spy = $$('section[id]');
    var links = $$('.nav-links a[href^="#"]');
    if ('IntersectionObserver' in window && spy.length) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (en.isIntersecting) {
            links.forEach(function (l) {
              l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id);
            });
          }
        });
      }, { rootMargin: '-42% 0px -52% 0px' });
      spy.forEach(function (s) { io.observe(s); });
    }

    // Reveal on scroll
    var rvs = $$('.rv');
    if ('IntersectionObserver' in window && !REDUCED) {
      var rio = new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            rio.unobserve(en.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      rvs.forEach(function (el) { rio.observe(el); });
    } else {
      rvs.forEach(function (el) { el.classList.add('in'); });
    }

    // Counters
    $$('.stat-num[data-count]').forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suf = el.getAttribute('data-suffix') || '';
      var done = false;
      if (!('IntersectionObserver' in window) || REDUCED) {
        el.innerHTML = target + (suf ? '<span class="suf">' + suf + '</span>' : '');
        return;
      }
      var cio = new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (!en.isIntersecting || done) return;
          done = true;
          cio.unobserve(el);
          var t0 = performance.now(), dur = 1700;
          (function cstep(now) {
            var t = clamp((now - t0) / dur, 0, 1);
            var e = 1 - Math.pow(1 - t, 4);
            var val = Math.round(target * e);
            el.innerHTML = val + (suf ? '<span class="suf">' + suf + '</span>' : '');
            if (t < 1) requestAnimationFrame(cstep);
          })(t0);
        });
      }, { threshold: 0.5 });
      cio.observe(el);
    });

    // Parallax floats
    if (!REDUCED) {
      var floats = $$('[data-parallax]');
      if (floats.length) {
        var py = 0, pyT = 0;
        window.addEventListener('scroll', function () { pyT = window.scrollY; }, { passive: true });
        (function loop() {
          py = lerp(py, pyT, 0.08);
          floats.forEach(function (el) {
            var sp = parseFloat(el.getAttribute('data-parallax')) || 0.12;
            el.style.setProperty('--py', ((py * sp) % 120).toFixed(1) + 'px');
            el.style.transform = 'translateY(calc(var(--py,0px) * -1))';
          });
          requestAnimationFrame(loop);
        })();
      }
    }
  }

  /* =====================================================================
     6. SPOTLIGHT + TILT CARDS
     ===================================================================== */
  function spotFX() {
    if (!FINE_POINTER) return;
    $$('.spot,.skill-card').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      }, { passive: true });
    });

    if (REDUCED) return;
    $$('.proj-card').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - r.left) / r.width - 0.5;
        var dy = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(1100px) rotateY(' + dx * 10 + 'deg) rotateX(' + (-dy * 9) + 'deg) translateY(-6px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transition = 'transform .8s cubic-bezier(.22,1,.36,1)';
        el.style.transform = '';
        setTimeout(function () { el.style.transition = ''; }, 820);
      });
    });
  }

  /* =====================================================================
     7. GALLERY: drag scroll + lightbox
     ===================================================================== */
  function galleryFX() {
    var track = $('#galTrack');
    var items = $$('.gal-item');
    var lb = $('#lightbox');
    var lbImg = $('#lightboxImg');
    var lbCap = $('#lightboxCap');
    var idx = 0;

    if (track && items.length) {
      var isDown = false, startX = 0, startScroll = 0, moved = false;
      track.addEventListener('pointerdown', function (e) {
        isDown = true; moved = false;
        startX = e.clientX; startScroll = track.scrollLeft;
        track.classList.add('dragging');
        track.setPointerCapture(e.pointerId);
      });
      track.addEventListener('pointermove', function (e) {
        if (!isDown) return;
        var dx = e.clientX - startX;
        if (Math.abs(dx) > 6) moved = true;
        track.scrollLeft = startScroll - dx;
      });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
        track.addEventListener(ev, function () {
          isDown = false;
          track.classList.remove('dragging');
        });
      });
      items.forEach(function (it, i) {
        it.addEventListener('click', function () {
          if (moved) return;
          openLb(i);
        });
        it.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLb(i);
          }
        });
      });
    }

    function openLb(i) {
      if (!lb) return;
      idx = i;
      var img = items[i].querySelector('img');
      var cap = items[i].querySelector('.cap');
      lbImg.src = img.getAttribute('data-full') || img.src;
      lbImg.alt = img.alt;
      if (lbCap) lbCap.textContent = cap ? cap.textContent : img.alt;
      lb.classList.add('open');
      document.body.classList.add('lock');
    }
    function closeLb() {
      if (!lb) return;
      lb.classList.remove('open');
      document.body.classList.remove('lock');
    }
    function navLb(d) {
      if (!items.length) return;
      openLb((idx + d + items.length) % items.length);
    }

    if (lb) {
      $('.lb-close', lb).addEventListener('click', closeLb);
      $('.lb-btn.prev', lb).addEventListener('click', function (e) { e.stopPropagation(); navLb(-1); });
      $('.lb-btn.next', lb).addEventListener('click', function (e) { e.stopPropagation(); navLb(1); });
      lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
      document.addEventListener('keydown', function (e) {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape') closeLb();
        if (e.key === 'ArrowLeft') navLb(-1);
        if (e.key === 'ArrowRight') navLb(1);
      });
    }
  }

  /* =====================================================================
     8. MENU
     ===================================================================== */
  function menuFX() {
    var burger = $('#burgerBtn');
    var menu = $('#menu');
    if (!burger || !menu) return;
    var canvas = $('#menuCanvas');
    var field = ParticleField(canvas, {
      count: 44, colors: ['139,123,255', '63,224,255'], linkDist: 110, speed: 0.18, mouse: true
    });
    var open = false;

    function toggle() {
      open = !open;
      menu.classList.toggle('open', open);
      burger.classList.toggle('on', open);
      document.body.classList.toggle('lock', open);
      document.body.classList.toggle('menu-open', open);
      var items = $$('.menu-links a');
      items.forEach(function (a, i) {
        a.style.transitionDelay = (open ? 0.08 + i * 0.06 : 0) + 's';
      });
      if (field) { open ? field.play() : field.pause(); }
    }

    burger.addEventListener('click', toggle);
    $$('.menu-links a, .menu-close').forEach(function (a) {
      a.addEventListener('click', function () { if (open) toggle(); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && open) toggle();
    });
  }

  /* =====================================================================
     9. SMOOTH ANCHORS + NAV CTA
     ===================================================================== */
  function anchorsFX() {
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
      });
    });
    var top = $('.to-top');
    if (top) top.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' });
    });
  }

  /* =====================================================================
     10. BOOT
     ===================================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('lock');

    // global canvases
    ParticleField($('#fxCanvas'), {
      count: 70, colors: ['139,123,255', '63,224,255', '255,255,255'], linkDist: 150, speed: 0.2, mouse: true
    });
    ParticleField($('#heroCanvas'), {
      count: 46, colors: ['139,123,255', '63,224,255', '245,197,102', '255,110,199'], linkDist: 0, speed: 0.32
    });
    ParticleField($('#loaderFx'), {
      count: 60, colors: ['139,123,255', '63,224,255', '245,197,102'], linkDist: 170, speed: 0.3
    });

    cursorFX();
    hero3D();
    magnetic();
    phoneTilt();
    initScroll();
    spotFX();
    galleryFX();
    menuFX();
    anchorsFX();
    runLoader();
  });

})();
