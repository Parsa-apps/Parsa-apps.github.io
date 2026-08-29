/* =====================================================================
   PARSA APPS — PREMIUM MOTION ENGINE v3
   Cinematic loader • particle fields • 3D tilt • scroll-driven reveals
   • magnetic buttons • custom cursor • phone tilt • smooth scroll
   ===================================================================== */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  /* Low-power / mobile devices: heavy GPU effects are disabled so the
     browser tab does not run out of memory (aurora blur, 3 particle
     canvases, cursor rings, 3D tilts …). */
  var LOW_POWER =
    !FINE_POINTER ||
    (navigator.hardwareConcurrency || 8) <= 4 ||
    (navigator.deviceMemory || 8) <= 4 ||
    (window.innerWidth || 1280) < 900;
  var SAVER = REDUCED || LOW_POWER;
  /* CSS hook: lets the stylesheet strip heavy filters/layers for weak
     hardware even when it has a mouse (budget laptops, hybrid tablets). */
  if (LOW_POWER) document.documentElement.classList.add('lite');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };

  /* =====================================================================
     1. CINEMATIC LOADER — logo assembly + curtain reveal + flash
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
    ['LOADING PARTICLES', 'بارگذاری ذرات'],
    ['PLACING CROWN', 'نشان‌گذاری طلایی'],
    ['READY', 'آماده']
  ];

  function runLoader() {
    if (!loader) return;
    /* Show the cinematic loader only once per visit, and never on
       mobile / low-end devices — it was blocking the page for ~4 s. */
    var skip = REDUCED || LOW_POWER || sessionStorage.getItem('pa-loader-seen') === '1';
    try { sessionStorage.setItem('pa-loader-seen', '1'); } catch (e) { /* ignore */ }
    if (skip) {
      loader.classList.add('gone');
      loader.remove();
      document.body.classList.remove('lock');
      startHero();
      return;
    }

    var t0 = performance.now();
    var DURATION = 1300;
    var frame;
    var idx = 0;
    var statusFlick = 0;

    function tick(now) {
      var t = clamp((now - t0) / DURATION, 0, 1);
      // smooth easeInOutCubic
      var eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      var pct = Math.round(eased * 100);

      if (loaderBar) loaderBar.style.width = pct + '%';

      statusFlick += 1;
      var si = Math.min(STATUS.length - 1, Math.floor(t * STATUS.length));
      if (si !== idx) {
        idx = si;
        if (loaderStatus) loaderStatus.innerHTML = STATUS[si][0] + ' · ' + STATUS[si][1] + ' <span class="tick">▮</span>';
      } else if (loaderStatus && statusFlick % 12 === 0) {
        loaderStatus.innerHTML = STATUS[si][0] + ' · ' + STATUS[si][1] + ' <span class="tick">▮</span>';
      }

      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        finishLoader();
      }
    }
    frame = requestAnimationFrame(tick);

    // safety: never hold the user beyond 2.6s
    setTimeout(function () {
      if (!loaderDone) finishLoader(true);
    }, 2600);

    function finishLoader(force) {
      if (loaderDone) return;
      loaderDone = true;
      cancelAnimationFrame(frame);
      loader.classList.add('done');
      startHero();
      setTimeout(function () { document.body.classList.remove('lock'); }, 1100);
      setTimeout(function () {
        loader.classList.add('gone');
        loader.style.display = 'none';
        window.dispatchEvent(new CustomEvent('parsa:loaded'));
      }, 1500);
    }
  }

  /* =====================================================================
     2. ADVANCED PARTICLE FIELD ENGINE
     ===================================================================== */
  function ParticleField(canvas, opts) {
    if (!canvas || REDUCED) return null;
    var ctx = canvas.getContext('2d');
    var o = opts || {};
    var W = 0, H = 0, DPR = 1;
    var parts = [];
    var running = o.autoplay !== false;
    var rafId = 0;
    var mouse = { x: -9999, y: -9999 };
    var time = 0;

    var COLORS = o.colors || ['139,123,255', '63,224,255', '245,197,102', '255,110,199'];
    var COUNT = o.count || 65;
    var LINK_DIST = o.linkDist || 140;
    var SPEED = o.speed || 0.2;
    var MOUSE_INTERACT = o.mouse || false;
    var GLOW = o.glow !== undefined ? o.glow : true;

    function resize() {
      /* Cap the backing store: DPR 2 on a phone = a ~10 MP canvas
         cleared 60×/s, which is what made low-end devices crash. */
      DPR = Math.min(window.devicePixelRatio || 1, LOW_POWER ? 1 : 1.5);
      W = canvas.clientWidth || window.innerWidth;
      H = canvas.clientHeight || window.innerHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      seed();
    }

    function seed() {
      var scale = LOW_POWER ? 0.3 : clamp(W / 1440, 0.4, 1);
      var n = Math.max(8, Math.round(COUNT * scale));
      parts = [];
      for (var i = 0; i < n; i++) {
        parts.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * SPEED,
          vy: (Math.random() - 0.5) * SPEED,
          r: Math.random() * 1.8 + 0.3,
          c: COLORS[(Math.random() * COLORS.length) | 0],
          a: Math.random() * 0.5 + 0.12,
          ph: Math.random() * Math.PI * 2,
          // Orbit drift for extra motion
          orbitSpeed: (Math.random() - 0.5) * 0.003,
          orbitRadius: Math.random() * 0.4
        });
      }
    }

    function step() {
      if (!running) { rafId = 0; return; }
      ctx.clearRect(0, 0, W, H);
      time++;
      var i, j, p, q;

      for (i = 0; i < parts.length; i++) {
        p = parts[i];
        // Add orbital drift for organic feel
        p.x += p.vx + Math.sin(time * p.orbitSpeed + p.ph) * p.orbitRadius;
        p.y += p.vy + Math.cos(time * p.orbitSpeed + p.ph) * p.orbitRadius;
        
        if (p.x < -30) p.x = W + 30; if (p.x > W + 30) p.x = -30;
        if (p.y < -30) p.y = H + 30; if (p.y > H + 30) p.y = -30;

        // Mouse repulsion
        if (MOUSE_INTERACT && FINE_POINTER) {
          var dx = p.x - mouse.x, dy = p.y - mouse.y;
          var d2 = dx * dx + dy * dy;
          if (d2 < 140 * 140 && d2 > 0.01) {
            var d = Math.sqrt(d2);
            var force = (140 - d) / 140;
            p.x += (dx / d) * force * 1.2;
            p.y += (dy / d) * force * 1.2;
          }
        }

        var tw = 0.5 + 0.5 * Math.sin(time * 0.015 + p.ph);
        
        // Draw glow
        if (GLOW && p.r > 1) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(' + p.c + ',' + (p.a * tw * 0.15).toFixed(3) + ')';
          ctx.fill();
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.c + ',' + (p.a * tw).toFixed(3) + ')';
        ctx.fill();
      }

      // Connection lines with gradient (skipped on low-power devices —
      // the O(n²) pair check is the most expensive part of the field)
      if (LINK_DIST > 0 && !LOW_POWER) {
        ctx.lineWidth = 0.4;
        for (i = 0; i < parts.length; i++) {
          for (j = i + 1; j < parts.length; j++) {
            p = parts[i]; q = parts[j];
            var ddx = p.x - q.x, ddy = p.y - q.y;
            var dist = Math.sqrt(ddx * ddx + ddy * ddy);
            if (dist < LINK_DIST) {
              var alpha = (1 - dist / LINK_DIST) * 0.14;
              ctx.strokeStyle = 'rgba(139,123,255,' + alpha.toFixed(3) + ')';
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.stroke();
            }
          }
        }
      }
      rafId = requestAnimationFrame(step);
    }

    /* One rAF chain while playing, zero while paused — a paused field
       must not keep waking up the main thread. */
    function kick() {
      if (!rafId && running) rafId = requestAnimationFrame(step);
    }

    if (MOUSE_INTERACT && FINE_POINTER) {
      window.addEventListener('mousemove', function (e) {
        mouse.x = e.clientX; mouse.y = e.clientY;
      }, { passive: true });
    }

    window.addEventListener('resize', resize);
    resize();
    kick();

    return {
      pause: function () {
        running = false;
        if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
      },
      play: function () { running = true; kick(); },
      resize: resize
    };
  }

  /* =====================================================================
     3. CUSTOM CURSOR with click feedback
     ===================================================================== */
  function cursorFX() {
    if (!FINE_POINTER || REDUCED) return;
    var dot = $('.cursor-dot');
    var ring = $('.cursor-ring');
    if (!dot || !ring) return;
    var mx = -100, my = -100, rx = -100, ry = -100;
    var rafId = 0, rw = 20, rh = 20;

    function measure() {
      rw = ring.offsetWidth / 2 || 20;
      rh = ring.offsetHeight / 2 || 20;
    }
    window.addEventListener('resize', measure, { passive: true });

    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.opacity = '1'; ring.style.opacity = '1';
      var t = e.target.closest ? e.target.closest('a,button,.proj-card,.gal-item,.hero-chip,.skill-card,.up-item') : null;
      ring.classList.toggle('grow', !!t);
      /* Restart the follow loop only when there is actual movement. */
      if (!rafId) { measure(); rafId = requestAnimationFrame(loop); }
    }, { passive: true });

    // Click animation
    window.addEventListener('mousedown', function () {
      ring.classList.add('click');
      setTimeout(function () { ring.classList.remove('click'); }, 200);
    });

    document.addEventListener('mouseleave', function () {
      dot.style.opacity = '0'; ring.style.opacity = '0';
    });

    /* Follows the pointer, then parks itself once it has caught up —
       an idle loop that keeps writing transforms 60×/s forever is what
       kept mid-range machines hot for nothing. */
    function loop() {
      rx = lerp(rx, mx, 0.15);
      ry = lerp(ry, my, 0.15);
      dot.style.transform = 'translate3d(' + (mx - 2.5) + 'px,' + (my - 2.5) + 'px,0)';
      ring.style.transform = 'translate3d(' + (rx - rw) + 'px,' + (ry - rh) + 'px,0)';
      if (Math.abs(rx - mx) < 0.15 && Math.abs(ry - my) < 0.15) { rafId = 0; return; }
      rafId = requestAnimationFrame(loop);
    }
    measure();
  }

  /* =====================================================================
     4. HERO ENTRANCE + 3D CORE PARALLAX
     ===================================================================== */
  function startHero() {
    document.body.classList.add('loaded');
    var hero = $('#hero');
    if (hero) {
      // Small delay to ensure CSS transitions trigger properly
      requestAnimationFrame(function () {
        hero.classList.add('in');
      });
    }
  }

  function hero3D() {
    if (REDUCED || !FINE_POINTER) return;
    var stage = $('#heroStage');
    if (!stage) return;

    var tx = 0, ty = 0, cx = 0, cy = 0;
    var rafId = 0;

    function loop() {
      cx = lerp(cx, tx, 0.06);
      cy = lerp(cy, ty, 0.06);
      stage.style.transform = 'translate3d(' + (cx * 16).toFixed(2) + 'px,' + (cy * 12).toFixed(2) + 'px,0) rotateY(' + (cx * 16).toFixed(2) + 'deg) rotateX(' + (-cy * 14).toFixed(2) + 'deg)';
      if (Math.abs(cx - tx) < 0.01 && Math.abs(cy - ty) < 0.01) { rafId = 0; return; }
      rafId = requestAnimationFrame(loop);
    }

    window.addEventListener('mousemove', function (e) {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!rafId) rafId = requestAnimationFrame(loop);
    }, { passive: true });
  }

  /* =====================================================================
     5. MAGNETIC BUTTONS
     ===================================================================== */
  function magnetic() {
    if (!FINE_POINTER || REDUCED) return;
    $$('.btn, .socials a, .to-top').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) * 0.24;
        var dy = (e.clientY - r.top - r.height / 2) * 0.3;
        el.style.transform = 'translate3d(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px,0)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transition = 'transform .65s cubic-bezier(.34,1.56,.64,1)';
        el.style.transform = '';
        setTimeout(function () { el.style.transition = ''; }, 650);
      });
    });
  }

  /* =====================================================================
     6. PHONE 3D TILT
     ===================================================================== */
  function phoneTilt() {
    var phone = $('#phone3d');
    var stage = $('#phoneStage');
    /* Fine pointer only: on touch devices mousemove never fires, so the
       old loop just wrote rotateX(0) rotateY(0) 60×/s forever — a
       permanent style-invalidation treadmill on every phone. */
    if (!phone || !stage || REDUCED || !FINE_POINTER) return;

    var rx = 0, ry = 0, trx = 0, try_ = 0;
    var rafId = 0;

    function loop() {
      rx = lerp(rx, trx, 0.08);
      ry = lerp(ry, try_, 0.08);
      phone.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
      if (Math.abs(rx - trx) < 0.01 && Math.abs(ry - try_) < 0.01) { rafId = 0; return; }
      rafId = requestAnimationFrame(loop);
    }

    window.addEventListener('mousemove', function (e) {
      var r = stage.getBoundingClientRect();
      var dx = (e.clientX - r.left - r.width / 2) / r.width;
      var dy = (e.clientY - r.top - r.height / 2) / r.height;
      try_ = clamp(dx, -1, 1) * 18;
      trx = clamp(dy, -1, 1) * -16;
      if (!rafId) rafId = requestAnimationFrame(loop);
    }, { passive: true });
  }

  /* =====================================================================
     7. SCROLL ENGINE
     ===================================================================== */
  function initScroll() {
    var progress = $('#scrollProgress');
    var nav = $('#nav');
    var toTop = $('.to-top');
    var lastY = 0;
    var ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY || document.documentElement.scrollTop;
        var doc = document.documentElement;
        var max = doc.scrollHeight - doc.clientHeight;
        var p = max > 0 ? y / max : 0;
        if (progress) progress.style.transform = 'scaleX(' + p.toFixed(4) + ')';

        // Timeline progress
        var tl = $('.timeline');
        if (tl) {
          var r = tl.getBoundingClientRect();
          var vh = window.innerHeight;
          var prog = clamp((vh * 0.72 - r.top) / (r.height + vh * 0.1), 0, 1) * 100;
          tl.style.setProperty('--tl-progress', prog.toFixed(1));
        }

        // Nav behavior
        if (nav) {
          nav.classList.toggle('solid', y > 30);
          nav.classList.toggle('hidden', y > 500 && y > lastY && y < doc.scrollHeight - (window.innerHeight || 800) * 1.4);
        }
        lastY = y;
        if (toTop) toTop.classList.toggle('show', y > 900);
        ticking = false;
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Scroll-spy for active nav link
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
      }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
      rvs.forEach(function (el) { rio.observe(el); });
    } else {
      rvs.forEach(function (el) { el.classList.add('in'); });
    }

    // Animated counters
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
          var t0 = performance.now(), dur = 2000;
          (function cstep(now) {
            var t = clamp((now - t0) / dur, 0, 1);
            var e = 1 - Math.pow(1 - t, 5); // quintic ease out
            var val = Math.round(target * e);
            el.innerHTML = val + (suf ? '<span class="suf">' + suf + '</span>' : '');
            if (t < 1) requestAnimationFrame(cstep);
          })(t0);
        });
      }, { threshold: 0.5 });
      cio.observe(el);
    });
  }

  /* =====================================================================
     8. SPOTLIGHT + 3D TILT CARDS
     ===================================================================== */
  function spotFX() {
    if (!FINE_POINTER) return;
    
    // Spotlight follow for glass cards
    $$('.spot,.skill-card').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      }, { passive: true });
    });

    if (REDUCED) return;
    
    // 3D tilt on project cards
    $$('.proj-card').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - r.left) / r.width - 0.5;
        var dy = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(1200px) rotateY(' + (dx * 12) + 'deg) rotateX(' + (-dy * 10) + 'deg) translateY(-8px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transition = 'transform .85s cubic-bezier(.22,1,.36,1)';
        el.style.transform = '';
        setTimeout(function () { el.style.transition = ''; }, 850);
      });
    });

    // Subtle tilt on skill cards
    $$('.skill-card').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - r.left) / r.width - 0.5;
        var dy = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(800px) rotateY(' + (dx * 8) + 'deg) rotateX(' + (-dy * 6) + 'deg) translateY(-10px) scale(1.03)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transition = 'transform .6s cubic-bezier(.22,1,.36,1)';
        el.style.transform = '';
        setTimeout(function () { el.style.transition = ''; }, 600);
      });
    });
  }

  /* =====================================================================
     9. GALLERY: drag scroll + lightbox
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
     10. FULLSCREEN MENU
     ===================================================================== */
  function menuFX() {
    var burger = $('#burgerBtn');
    var menu = $('#menu');
    if (!burger || !menu) return;
    var canvas = $('#menuCanvas');
    /* Created paused: the old field started animating a hidden canvas
       immediately and never stopped until the menu was toggled once. */
    var field = SAVER ? null : ParticleField(canvas, {
      count: 32, colors: ['139,123,255', '63,224,255'], linkDist: 110, speed: 0.14, mouse: true, autoplay: false
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
        a.style.transitionDelay = (open ? 0.08 + i * 0.065 : 0) + 's';
      });
      if (field) {
        if (open) { field.resize(); field.play(); } else { field.pause(); }
      }
    }

    burger.addEventListener('click', toggle);
    $$('.menu-links a').forEach(function (a) {
      a.addEventListener('click', function () { if (open) toggle(); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && open) toggle();
    });
  }

  /* =====================================================================
     11. SMOOTH ANCHOR SCROLLING
     ===================================================================== */
  function anchorsFX() {
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        if (typeof el.scrollIntoView === 'function') {
          el.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
        } else {
          window.scrollTo(0, el.offsetTop || 0);
        }
      });
    });
    var top = $('.to-top');
    if (top) top.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' });
    });
  }

  /* =====================================================================
     12. PARALLAX SCROLL for data-parallax elements
     ===================================================================== */
  function parallaxFX() {
    if (REDUCED) return;
    var floats = $$('[data-parallax]');
    if (!floats.length) return;
    var py = 0, pyT = 0;
    window.addEventListener('scroll', function () { pyT = window.scrollY; }, { passive: true });
    (function loop() {
      py = lerp(py, pyT, 0.07);
      floats.forEach(function (el) {
        var sp = parseFloat(el.getAttribute('data-parallax')) || 0.12;
        el.style.transform = 'translateY(' + (-(py * sp) % 130).toFixed(1) + 'px)';
      });
      requestAnimationFrame(loop);
    })();
  }

  /* =====================================================================
     13. SECTION DIVIDER GLOW — subtle breathing light between sections
     ===================================================================== */
  function sectionGlowFX() {
    if (REDUCED) return;
    // Add subtle glow dividers between major sections
    $$('section').forEach(function (sec, i) {
      if (i === 0) return;
      var divider = document.createElement('div');
      divider.setAttribute('aria-hidden', 'true');
      divider.style.cssText = 'position:absolute;top:-1px;left:10%;right:10%;height:1px;' +
        'background:linear-gradient(90deg,transparent,rgba(139,123,255,.3),rgba(63,224,255,.2),transparent);' +
        'pointer-events:none;z-index:10';
      sec.style.position = 'relative';
      sec.appendChild(divider);
    });
  }

  /* =====================================================================
     14. TYPING EFFECT for hero eyebrow (optional subtle touch)
     ===================================================================== */
  function heroTypingFX() {
    // Removed - keep the eyebrow static for cleaner look
  }

  /* =====================================================================
     BOOT — initialize everything
     ===================================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('lock');

    /* One particle layer only (was 3 fullscreen canvases running at
       60 fps forever — the main CPU/GPU killer on phones). */
    var fxField = null;
    if (!SAVER) {
      fxField = ParticleField($('#fxCanvas'), {
        count: 40, colors: ['139,123,255', '63,224,255', '255,255,255'], linkDist: 150, speed: 0.16, mouse: true, glow: true
      });
    }

    // Pause the particle engine while the tab is hidden
    document.addEventListener('visibilitychange', function () {
      if (!fxField) return;
      if (document.hidden) { fxField.pause(); } else { fxField.play(); }
    });

    // Initialize all interactive systems (heavy ones only on capable devices)
    if (!SAVER) {
      cursorFX();
      hero3D();
      magnetic();
      phoneTilt();
      spotFX();
      parallaxFX();
    }
    initScroll();
    galleryFX();
    menuFX();
    anchorsFX();
    sectionGlowFX();

    // Run the cinematic loader last
    runLoader();
  });

})();
