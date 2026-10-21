/* =====================================================================
   پارسا اپس (Parsa Apps) — موتور تعامل، دسترس‌پذیری و پویانمایی سبک
   نسخه ۴.۰ · کاملاً فارسی · سازگار با صفحه‌کلید و کاهش حرکت
   ===================================================================== */
(function () {
  'use strict';

  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  function toFaDigits(val) {
    return String(val).replace(/[0-9]/g, function (d) { return FA_DIGITS[Number(d)]; });
  }

  /* ---------- اعلان کوتاه وضعیت (Toast) ---------- */
  var toastTimer = null;
  function showToast(message) {
    var el = $('#toastMsg');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.classList.remove('show');
    }, 3000);
  }

  /* ---------- ۱. تغییر واقعی پوسته (شب سرمه‌ای / روز روشن) ---------- */
  function initTheme() {
    var html = document.documentElement;
    var metaTheme = $('meta[name="theme-color"]');
    var buttons = $$('[data-theme-toggle]');

    function syncUI(theme) {
      var isLight = theme === 'light';
      html.setAttribute('data-theme', theme);
      if (metaTheme) {
        metaTheme.setAttribute('content', isLight ? '#f7f9fc' : '#050c17');
      }
      buttons.forEach(function (btn) {
        btn.setAttribute('aria-pressed', isLight ? 'true' : 'false');
        var label = isLight ? 'تغییر به پوسته تیره سرمه‌ای' : 'تغییر به پوسته روشن روز';
        btn.setAttribute('aria-label', label);
        btn.setAttribute('title', label);
        var txt = btn.querySelector('[data-theme-label]');
        if (txt) {
          txt.textContent = isLight ? 'حالت شب سینمایی' : 'حالت روز روشن';
        }
      });
    }

    syncUI(html.getAttribute('data-theme') || 'dark');

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        try {
          localStorage.setItem('parsa-theme', next);
        } catch (err) { /* مرورگر در حالت محدود */ }
        syncUI(next);
        showToast(next === 'light' ? 'پوسته روشن فعال شد' : 'پوسته شب سرمه‌ای و طلایی فعال شد');
      });
    });
  }

  /* ---------- ۲. نوار پیمایش، پارالاکس ملایم بخش آغازین و نشانگر بخش فعال ---------- */
  function initScrollAndNav() {
    var header = $('#siteHeader');
    var progress = $('#scrollProgress');
    var toTop = $('#toTopBtn');
    var heroBg = $('#heroBgLayer');
    var heroSec = $('#home');
    var ticking = false;

    function updateOnScroll() {
      var y = window.scrollY || document.documentElement.scrollTop || 0;
      var doc = document.documentElement;
      var maxScroll = Math.max(1, doc.scrollHeight - doc.clientHeight);
      var ratio = Math.min(1, Math.max(0, y / maxScroll));

      if (progress) {
        progress.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
      }
      if (header) {
        header.classList.toggle('scrolled', y > 24);
      }
      if (toTop) {
        toTop.classList.toggle('visible', y > 520);
      }
      if (!REDUCED && heroBg && heroSec) {
        var heroH = heroSec.offsetHeight || 800;
        if (y <= heroH) {
          heroBg.style.transform = 'translate3d(0, ' + (y * 0.14).toFixed(1) + 'px, 0)';
        }
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateOnScroll);
      }
    }, { passive: true });
    updateOnScroll();

    if (toTop) {
      toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' });
      });
    }

    /* همگام‌سازی نشانگر فعال در منوی اصلی و موبایل */
    var navLinks = $$('[data-nav-section]');
    var trackedIds = ['home', 'about', 'projects', 'contact'];
    var sections = trackedIds.map(function (id) { return document.getElementById(id); }).filter(Boolean);

    function setActiveSection(id) {
      navLinks.forEach(function (link) {
        var match = link.getAttribute('data-nav-section') === id;
        link.classList.toggle('active', match);
        if (match) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }

    if ('IntersectionObserver' in window && sections.length) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      }, { rootMargin: '-38% 0px -50% 0px', threshold: 0 });
      sections.forEach(function (sec) { spy.observe(sec); });
    }
  }

  /* ---------- ۳. کشوی منوی موبایل با مدیریت کامل صفحه‌کلید ---------- */
  function initMobileDrawer() {
    var burger = $('#burgerBtn');
    var drawer = $('#mobileDrawer');
    var closeBtn = $('#drawerCloseBtn');
    var backdrop = $('#drawerBackdrop');
    if (!burger || !drawer) return;

    var isOpen = false;

    function setOpen(next) {
      isOpen = next;
      drawer.classList.toggle('open', isOpen);
      drawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.classList.toggle('modal-open', isOpen);
      if (isOpen) {
        if (closeBtn) closeBtn.focus();
      } else {
        burger.focus();
      }
    }

    burger.addEventListener('click', function () { setOpen(!isOpen); });
    if (closeBtn) closeBtn.addEventListener('click', function () { setOpen(false); });
    if (backdrop) backdrop.addEventListener('click', function () { setOpen(false); });

    $$('a[href^="#"]', drawer).forEach(function (a) {
      a.addEventListener('click', function () {
        if (isOpen) setOpen(false);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
      }
    });
  }

  /* ---------- ۴. زبانه‌های تعاملی دسترس‌پذیر (درباره ما و نمایش عمیق محصولات) ---------- */
  function initTabs() {
    $$('[role="tablist"][data-tabs]').forEach(function (tablist) {
      var tabs = $$('[role="tab"]', tablist);
      if (!tabs.length) return;

      function activateTab(selectedTab, moveFocus) {
        tabs.forEach(function (tab) {
          var active = tab === selectedTab;
          var panelId = tab.getAttribute('aria-controls');
          var panel = panelId ? document.getElementById(panelId) : null;
          tab.setAttribute('aria-selected', active ? 'true' : 'false');
          tab.setAttribute('tabindex', active ? '0' : '-1');
          if (panel) {
            if (active) {
              panel.removeAttribute('hidden');
            } else {
              panel.setAttribute('hidden', '');
              $$('video', panel).forEach(function (v) {
                try { v.pause(); } catch (err) { /* نادیده گرفتن */ }
              });
            }
          }
        });
        if (moveFocus) selectedTab.focus();
      }

      tabs.forEach(function (tab, index) {
        tab.addEventListener('click', function () { activateTab(tab, false); });
        tab.addEventListener('keydown', function (e) {
          var nextIndex = null;
          if (e.key === 'ArrowLeft') nextIndex = (index + 1) % tabs.length;
          if (e.key === 'ArrowRight') nextIndex = (index - 1 + tabs.length) % tabs.length;
          if (e.key === 'Home') nextIndex = 0;
          if (e.key === 'End') nextIndex = tabs.length - 1;
          if (nextIndex !== null) {
            e.preventDefault();
            activateTab(tabs[nextIndex], true);
          }
        });
      });
    });
  }

  /* ---------- ۵. داده‌های معتبر پروژه‌ها + پنجره جزئیات + فیلتر و جابه‌جایی ---------- */
  var PROJECTS_DATA = {
    jazire: {
      title: 'جزیره فندقی',
      status: 'منتشرشده در مایکت · نسخهٔ ۷.۵.۷ (۱۴۰۵/۰۷/۲۷)',
      image: '/assets/images/cinema/card-jazire-800.webp',
      alt: 'تصویر هنری محصول جزیره فندقی ساخته پارسا اپس',
      description: 'محصول شاخص پارسا اپس برای کودکان ۳ تا ۹ سال؛ نقشه جزیره با چرخه شب و روز، آموزش الفبا و اعداد و رنگ‌ها، ده بازی آموزشی، قصه‌های صوتی، لالایی، ۸۰ پرسش مهارت زندگی و بخش گزارش و تنظیمات والدین — کاملاً آفلاین، بدون تبلیغ و بدون ردیابی.',
      highlights: [
        '۱۰ بازی آموزشی تعاملی با سطح و امتیاز',
        'آموزش الفبا، اعداد، رنگ، شکل و حیوانات ایران',
        'قصه‌های صوتی، لالایی شبانه و کارتون‌کده',
        'پشتیبانی از ۳ پروفایل کودک و گزارش والدین'
      ],
      links: [
        { label: 'دانلود رسمی از مایکت', href: 'https://myket.ir/app/com.parsaapps.amoozesh_fandoghi', primary: true, external: true },
        { label: 'نسخه کافه‌بازار در گیت‌هاب', href: 'https://github.com/Parsa-apps/Jazire-Fandoqi/releases/tag/v7.5.6-bazaar', primary: false, external: true },
        { label: 'مخزن و یادداشت نسخه‌ها', href: 'https://github.com/Parsa-apps/Jazire-Fandoqi', primary: false, external: true }
      ]
    },
    kartoniya: {
      title: 'کارتونیا',
      status: 'در حال توسعه پیشرفته · نسخهٔ ۱.۳.۰ (۱۴۰۵/۰۷/۲۸)',
      image: '/assets/images/cinema/card-kartoniya-800.webp',
      alt: 'تصویر هنری محصول کارتونیا برای تماشای کارتون کودکان',
      description: 'فضایی رنگارنگ، ساده و امن برای کشف و تماشای کارتون‌های کودکانه به زبان فارسی؛ شامل ۸ دسته‌بندی موضوعی، ۱۶ کارتون با پخش درون‌برنامه‌ای از آپارات، جست‌وجوی هوشمند فارسی، ادامه تماشا و قفل ریاضی مخصوص والدین بدون نیاز به ساخت حساب کاربری.',
      highlights: [
        '۸ دسته‌بندی موضوعی و ۱۶ کارتون منتخب',
        'پخش روان درون‌برنامه‌ای به همراه جست‌وجوی فارسی',
        'پروفایل محلی کودک با ۲۰ آواتار اختصاصی',
        'محافظت از تنظیمات با قفل ریاضی والدین'
      ],
      links: [
        { label: 'مشاهده پروژه در گیت‌هاب', href: 'https://github.com/Parsa-apps/Kartoniya', primary: true, external: true },
        { label: 'مستندات فنی محصول', href: 'https://github.com/Parsa-apps/Kartoniya/tree/main/docs', primary: false, external: true }
      ]
    },
    survival: {
      title: 'سرزمین بقا',
      status: 'در دست طراحی و توسعه در کارگاه پارسا اپس',
      image: '/assets/images/cinema/card-survival-800.webp',
      alt: 'تصویر هنری پروژه بازی سرزمین بقا با محوریت ماجراجویی در جزیره',
      description: 'پروژه بازی موبایل با محوریت بقا، اکتشاف در جزیره‌های ناشناخته، جمع‌آوری منابع و ساخت سرپناه. این محصول هم‌اکنون در مرحله طراحی مکانیک‌های بازی و توسعه فنی قرار دارد و پس از آماده شدن نسخه عمومی، پیوند رسمی آن در همین صفحه منتشر خواهد شد.',
      highlights: [
        'محوریت بقا، کاوش طبیعت و ماجراجویی مرحله‌ای',
        'چرخه محیطی پویا و مدیریت منابع در جزیره',
        'طراحی رابط کاربری لمسی روان برای موبایل',
        'انتشار پیوند عمومی پس از تکمیل نسخه آزمایشی'
      ],
      links: [
        { label: 'پیگیری خبرهای انتشار در تلگرام رسمی', href: 'https://t.me/Parsaappsadmin', primary: true, external: true }
      ]
    },
    naqashi: {
      title: 'استودیو نقاشی فندوقی',
      status: 'منتشرشده به‌صورت متن‌باز · نسخهٔ ۲.۰ آفلاین',
      image: '/assets/images/cinema/card-naqashi-800.webp',
      alt: 'تصویر هنری استودیو نقاشی فندوقی ویژه خلاقیت کودکان',
      description: 'برنامه و وب‌اپلیکیشن ۱۰۰٪ آفلاین نقاشی و خلاقیت کودکان با رابط کاربری راست‌چین فارسی؛ مجهز به قلم‌موهای جادویی (رنگین‌کمان، نئون و مهرهای کودکانه)، ۸ آموزش گام‌به‌گام، آلبوم ذخیره محلی شاهکارها، بازگشت تا ۲۵ مرحله و دروازه ریاضی والدین.',
      highlights: [
        'قلم‌موهای جادویی، سطل رنگ و شکل‌های هندسی',
        '۸ درس آموزش نقاشی گام‌به‌گام برای کودکان',
        'اجرای ۱۰۰٪ آفلاین بدون ارسال داده به سرور',
        'مجهز به ۱۶۷ تست خودکار واحد و یکپارچه'
      ],
      links: [
        { label: 'مشاهده کد و پروژه در گیت‌هاب', href: 'https://github.com/Parsa-apps/Naqashi-Fandoqi', primary: true, external: true }
      ]
    }
  };

  function initProjectsAndModal() {
    /* فیلتر دسته‌بندی کارت‌های پروژه */
    var filterBtns = $$('[data-project-filter]');
    var cards = $$('.product-card[data-status]');

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-project-filter');
        filterBtns.forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('active', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        cards.forEach(function (card) {
          var show = filter === 'all' || card.getAttribute('data-status') === filter;
          if (show) {
            card.removeAttribute('hidden');
          } else {
            card.setAttribute('hidden', '');
          }
        });
      });
    });

    /* دکمه‌های چرخش نرم کارت‌های پروژه (پشتیبانی از لمس و صفحه‌کلید) */
    var track = $('#productsTrack');
    var prevBtn = $('#projPrevBtn');
    var nextBtn = $('#projNextBtn');
    if (track && prevBtn && nextBtn) {
      var highlightIndex = 0;
      var stepHighlight = function (delta) {
        var visibleCards = cards.filter(function (c) { return !c.hasAttribute('hidden'); });
        if (!visibleCards.length) return;
        highlightIndex = (highlightIndex + delta + visibleCards.length) % visibleCards.length;
        var target = visibleCards[highlightIndex];
        target.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
        var btnInside = target.querySelector('button, a');
        if (btnInside) btnInside.focus({ preventScroll: true });
      };
      prevBtn.addEventListener('click', function () { stepHighlight(-1); });
      nextBtn.addEventListener('click', function () { stepHighlight(1); });
    }

    /* پنجره جزئیات کامل پروژه */
    var modal = $('#projectModal');
    var closeBtn = $('#projectModalClose');
    var titleEl = $('#modalProjTitle');
    var statusEl = $('#modalProjStatus');
    var imgEl = $('#modalProjImg');
    var descEl = $('#modalProjDesc');
    var listEl = $('#modalProjList');
    var actionsEl = $('#modalProjActions');
    var lastTrigger = null;

    function openProjectModal(key, trigger) {
      var item = PROJECTS_DATA[key];
      if (!modal || !item) return;
      lastTrigger = trigger || document.activeElement;
      titleEl.textContent = item.title;
      statusEl.textContent = item.status;
      imgEl.src = item.image;
      imgEl.alt = item.alt;
      descEl.textContent = item.description;
      listEl.innerHTML = '';
      item.highlights.forEach(function (h) {
        var li = document.createElement('li');
        li.textContent = '✦ ' + h;
        listEl.appendChild(li);
      });
      actionsEl.innerHTML = '';
      item.links.forEach(function (lnk) {
        var a = document.createElement('a');
        a.href = lnk.href;
        a.className = lnk.primary ? 'btn btn-gold btn-sm' : 'btn btn-glass btn-sm';
        a.textContent = lnk.label;
        if (lnk.external) {
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
        }
        actionsEl.appendChild(a);
      });

      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      if (closeBtn) closeBtn.focus();
    }

    function closeProjectModal() {
      if (!modal || !modal.classList.contains('open')) return;
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      if (lastTrigger && typeof lastTrigger.focus === 'function') {
        lastTrigger.focus();
      }
    }

    $$('[data-open-project]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openProjectModal(btn.getAttribute('data-open-project'), btn);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeProjectModal);
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeProjectModal();
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
        e.preventDefault();
        closeProjectModal();
      }
    });
  }

  /* ---------- ۶. گالری اسکرین‌شات‌های واقعی + بادبزن ۵ گوشی + لایت‌باکس ---------- */
  function initGalleryAndLightbox() {
    var lb = $('#lightbox');
    var lbImg = $('#lightboxImg');
    var lbCap = $('#lightboxCaption');
    var lbClose = $('#lbCloseBtn');
    var lbPrev = $('#lbPrevBtn');
    var lbNext = $('#lbNextBtn');
    var strip = $('#screenshotsStrip');
    var shotCards = $$('.shot-card');
    var activeShots = shotCards.slice();
    var currentIdx = 0;
    var returnFocusEl = null;

    function showAt(idx) {
      if (!lb || !activeShots.length) return;
      currentIdx = (idx + activeShots.length) % activeShots.length;
      var card = activeShots[currentIdx];
      var full = card.getAttribute('data-full');
      var cap = card.getAttribute('data-caption') || '';
      lbImg.src = full;
      lbImg.alt = cap;
      lbCap.textContent = cap + ' (' + toFaDigits(currentIdx + 1) + ' از ' + toFaDigits(activeShots.length) + ')';
    }

    function openLightboxFromIndex(idx, trigger) {
      if (!lb) return;
      returnFocusEl = trigger || document.activeElement;
      showAt(idx);
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      if (lbClose) lbClose.focus();
    }

    function openSinglePreview(fullSrc, captionText, trigger) {
      if (!lb) return;
      returnFocusEl = trigger || document.activeElement;
      lbImg.src = fullSrc;
      lbImg.alt = captionText;
      lbCap.textContent = captionText;
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      if (lbClose) lbClose.focus();
    }

    function closeLightbox() {
      if (!lb || !lb.classList.contains('open')) return;
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      if (returnFocusEl && typeof returnFocusEl.focus === 'function') {
        returnFocusEl.focus();
      }
    }

    shotCards.forEach(function (card) {
      card.addEventListener('click', function () {
        var i = activeShots.indexOf(card);
        openLightboxFromIndex(i >= 0 ? i : 0, card);
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var i = activeShots.indexOf(card);
          openLightboxFromIndex(i >= 0 ? i : 0, card);
        }
      });
    });

    /* کلیک روی هر یک از ۵ گوشی بادبزنی در بخش درباره ما */
    $$('[data-preview-src]').forEach(function (phoneBtn) {
      phoneBtn.addEventListener('click', function () {
        openSinglePreview(
          phoneBtn.getAttribute('data-preview-src'),
          phoneBtn.getAttribute('data-preview-caption') || 'پیش‌نمایش محیط واقعی اپلیکیشن',
          phoneBtn
        );
      });
    });

    /* فیلترهای گالری تصاویر واقعی */
    var galFilters = $$('[data-shot-filter]');
    galFilters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var app = btn.getAttribute('data-shot-filter');
        galFilters.forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('active', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        activeShots = [];
        shotCards.forEach(function (c) {
          var match = app === 'all' || c.getAttribute('data-app') === app;
          if (match) {
            c.removeAttribute('hidden');
            activeShots.push(c);
          } else {
            c.setAttribute('hidden', '');
          }
        });
        if (strip) strip.scrollLeft = 0;
      });
    });

    /* دکمه‌های پیمایش چپ و راست نوار گالری */
    var galPrev = $('#galPrevBtn');
    var galNext = $('#galNextBtn');
    if (strip && galPrev && galNext) {
      galPrev.addEventListener('click', function () {
        strip.scrollBy({ left: 260, behavior: REDUCED ? 'auto' : 'smooth' });
      });
      galNext.addEventListener('click', function () {
        strip.scrollBy({ left: -260, behavior: REDUCED ? 'auto' : 'smooth' });
      });
    }

    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev) lbPrev.addEventListener('click', function () { showAt(currentIdx - 1); });
    if (lbNext) lbNext.addEventListener('click', function () { showAt(currentIdx + 1); });
    if (lb) {
      lb.addEventListener('click', function (e) {
        if (e.target === lb) closeLightbox();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (!lb || !lb.classList.contains('open')) return;
      if (e.key === 'Escape') { e.preventDefault(); closeLightbox(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); showAt(currentIdx - 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); showAt(currentIdx + 1); }
    });
  }

  /* ---------- ۷. شمارنده سبک ویژگی‌های واقعی و ورود نرم بخش‌ها ---------- */
  function initRevealsAndCounters() {
    var reveals = $$('.reveal');
    if ('IntersectionObserver' in window && !REDUCED) {
      var revObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            revObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
      reveals.forEach(function (el) { revObs.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add('in'); });
    }

    var counters = $$('[data-counter]');
    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-counter'), 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      if (REDUCED || !('IntersectionObserver' in window)) {
        el.textContent = toFaDigits(target) + suffix;
        return;
      }
      var started = false;
      var cObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || started) return;
          started = true;
          cObs.unobserve(el);
          var t0 = performance.now();
          var dur = 1100;
          function frame(now) {
            var p = Math.min(1, (now - t0) / dur);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = toFaDigits(Math.round(target * eased)) + suffix;
            if (p < 1) window.requestAnimationFrame(frame);
          }
          window.requestAnimationFrame(frame);
        });
      }, { threshold: 0.4 });
      cObs.observe(el);
    });
  }

  /* ---------- ۸. فرم تماس فارسی با اعتبارسنجی دقیق + کپی نشانی ایمیل ---------- */
  function initContactForm() {
    $$('[data-copy-email]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var email = btn.getAttribute('data-copy-email') || 'farshadparsa2019@gmail.com';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(email).then(function () {
            showToast('نشانی ایمیل رسمی در حافظه کپی شد');
          }).catch(function () {
            showToast('نشانی ایمیل: ' + email);
          });
        } else {
          showToast('نشانی ایمیل: ' + email);
        }
      });
    });

    var form = $('#contactForm');
    if (!form) return;

    var nameInput = $('#senderName');
    var replyInput = $('#senderReply');
    var topicInput = $('#messageTopic');
    var bodyInput = $('#messageBody');
    var feedback = $('#formFeedback');

    function setFieldError(input, errId, msg) {
      var errEl = document.getElementById(errId);
      if (errEl) errEl.textContent = msg || '';
      if (input) input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    }

    function validateAll() {
      var valid = true;
      var nameVal = (nameInput.value || '').trim();
      var replyVal = (replyInput.value || '').trim();
      var bodyVal = (bodyInput.value || '').trim();

      if (nameVal.length < 2) {
        setFieldError(nameInput, 'errSenderName', 'لطفاً نام یا عنوان خود را وارد کنید (حداقل ۲ حرف).');
        valid = false;
      } else {
        setFieldError(nameInput, 'errSenderName', '');
      }

      if (replyVal.length < 4) {
        setFieldError(replyInput, 'errSenderReply', 'لطفاً ایمیل یا شناسه تلگرام معتبر برای پاسخ‌گویی وارد کنید.');
        valid = false;
      } else {
        setFieldError(replyInput, 'errSenderReply', '');
      }

      if (bodyVal.length < 10) {
        setFieldError(bodyInput, 'errMessageBody', 'لطفاً متن پیام را با جزئیات کافی بنویسید (حداقل ۱۰ نویسه).');
        valid = false;
      } else {
        setFieldError(bodyInput, 'errMessageBody', '');
      }

      return valid;
    }

    [nameInput, replyInput, bodyInput].forEach(function (inp) {
      if (!inp) return;
      inp.addEventListener('input', function () {
        if (inp.getAttribute('aria-invalid') === 'true') validateAll();
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateAll()) {
        if (feedback) {
          feedback.className = 'form-feedback err';
          feedback.textContent = 'لطفاً موارد مشخص‌شده در فرم را تکمیل و اصلاح کنید.';
          feedback.removeAttribute('hidden');
        }
        var firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var subject = 'پیام از وب‌سایت پارسا اپس — ' + topicInput.value;
      var formatted =
        'نام فرستنده: ' + nameInput.value.trim() + '\n' +
        'راه ارتباطی پاسخ: ' + replyInput.value.trim() + '\n' +
        'موضوع: ' + topicInput.value + '\n' +
        '────────────────────\n' +
        bodyInput.value.trim();

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(formatted).catch(function () {});
      }

      var mailtoHref =
        'mailto:farshadparsa2019@gmail.com?subject=' +
        encodeURIComponent(subject) +
        '&body=' +
        encodeURIComponent(formatted);

      if (feedback) {
        feedback.className = 'form-feedback ok';
        feedback.textContent =
          'متن پیام شما آماده و در حافظه کپی شد و برنامه ایمیل برای ارسال به farshadparsa2019@gmail.com باز شد. در صورت نداشتن برنامه ایمیل روی دستگاه، می‌توانید همین متن کپی‌شده را مستقیماً در تلگرام رسمی ارسال کنید.';
        feedback.removeAttribute('hidden');
      }

      window.location.href = mailtoHref;
    });
  }

  /* ---------- افتتاحیه سینمایی سه‌ثانیه‌ای لوگوی رسمی ---------- */
  function initCinemaIntro() {
    var intro = $('#cinemaIntro');
    var root = document.documentElement;
    if (!intro) {
      root.classList.remove('cinema-lock');
      return;
    }

    // اگر در همین نشست قبلاً پخش شده، اصلاً نمایش داده نشود
    if (root.getAttribute('data-intro') === 'skip') {
      if (intro.parentNode) intro.parentNode.removeChild(intro);
      root.classList.remove('cinema-lock');
      return;
    }

    var finished = false;

    function removeIntro() {
      root.classList.remove('cinema-lock');
      if (intro && intro.parentNode) {
        intro.parentNode.removeChild(intro);
      }
    }

    function finish(withFade) {
      if (finished) return;
      finished = true;
      try {
        sessionStorage.setItem('parsa-cinema-intro', 'done');
      } catch (e) {}
      if (withFade) {
        root.classList.add('cinema-dismiss');
        setTimeout(removeIntro, 320);
      } else {
        removeIntro();
      }
    }

    var skipBtn = $('#cinemaSkip');
    if (skipBtn) {
      skipBtn.addEventListener('click', function () {
        finish(true);
      });
    }

    // دکمه Escape نیز افتتاحیه را رد می‌کند
    document.addEventListener('keydown', function (e) {
      if (!finished && (e.key === 'Escape' || e.key === 'Esc')) {
        finish(true);
      }
    });

    // پایان انیمیشن پوسته → حذف کامل لایه افتتاحیه
    intro.addEventListener('animationend', function (e) {
      if (e.target === intro) {
        finish(false);
      }
    });

    // تضمین نهایی: سایت هرگز روی صفحه افتتاحیه گیر نمی‌کند
    setTimeout(function () {
      finish(false);
    }, 3800);
  }

  /* ---------- راه‌اندازی اولیه ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initCinemaIntro();
    initScrollAndNav();
    initMobileDrawer();
    initTabs();
    initProjectsAndModal();
    initGalleryAndLightbox();
    initRevealsAndCounters();
    initContactForm();
  });
})();
