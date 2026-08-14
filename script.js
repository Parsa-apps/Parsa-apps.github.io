(() => {
  const body = document.body;
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  const year = document.querySelector("[data-year]");
  const form = document.querySelector("#contact-form");
  const success = document.querySelector(".form-success");

  body.classList.add("js-ready");

  /* ----------------------------------------------------------------
     Motion capability detection
     ---------------------------------------------------------------- */
  const reduceQuery = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;
  const coarseQuery = window.matchMedia
    ? window.matchMedia("(hover: none)")
    : null;

  const connection = navigator.connection || navigator.webkitConnection;
  const saveData = Boolean(connection && connection.saveData);
  const slowNetwork = Boolean(
    connection && /(^|-)2g$/.test(String(connection.effectiveType || ""))
  );
  const lowPower = (navigator.hardwareConcurrency || 8) <= 4;

  const prefersReduced = () => Boolean(reduceQuery && reduceQuery.matches);
  const isCoarse = () => Boolean(coarseQuery && coarseQuery.matches);

  // Ambient (gradient / shapes / particles) is the only "extra paint" work —
  // skip it entirely on data-saver, very slow networks or weak devices.
  const allowAmbient = () => !prefersReduced() && !saveData && !slowNetwork;

  const supportsObserver = "IntersectionObserver" in window;

  /* ----------------------------------------------------------------
     Footer year
     ---------------------------------------------------------------- */
  if (year) {
    year.textContent = new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
    }).format(new Date());
  }

  /* ----------------------------------------------------------------
     Navigation
     ---------------------------------------------------------------- */
  if (toggle && links) {
    const closeMenu = () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "باز کردن فهرست");
      body.classList.remove("nav-open");
    };

    const openMenu = () => {
      links.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "بستن فهرست");
      body.classList.add("nav-open");
    };

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      isOpen ? closeMenu() : openMenu();
    });

    links.querySelectorAll("a").forEach((anchor) => {
      anchor.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && links.classList.contains("open")) {
        closeMenu();
        toggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (!links.classList.contains("open")) return;
      if (!links.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 760) closeMenu();
    });
  }

  /* ----------------------------------------------------------------
     Sticky header state
     ---------------------------------------------------------------- */
  if (header) {
    let ticking = false;
    const updateHeader = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
      ticking = false;
    };

    updateHeader();
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(updateHeader);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* ================================================================
     MOTION LAYER
     ================================================================ */

  /**
   * Tag elements with [data-reveal] without touching the markup, so every
   * page gets entry animations. Existing data-reveal attributes are kept.
   */
  const autoReveal = () => {
    const plan = [
      // Home page
      [".home-hero-copy", "cascade"],
      [".brand-showcase", "zoom"],
      [".home-section-head", "cascade"],
      [".main-product-card", "zoom"],
      [".home-value-card", "up"],
      [".future-copy", "cascade"],
      [".future-visual", "scale"],
      [".home-footer-top > *", "up"],
      [".home-footer-bottom", "fade"],
      // Inner pages
      [".page-hero .container > *", "up"],
      [".island-hero .container > *", "up"],
      [".section-head", "up"],
      [".feature", "up"],
      [".why-card", "up"],
      [".value-card", "up"],
      [".step", "up"],
      [".shot-card", "zoom"],
      [".product-card", "zoom"],
      [".featured-product", "zoom"],
      [".roadmap li", "up"],
      [".about-grid > *", "up"],
      [".contact-grid > *", "up"],
      [".prose > *", "up"],
      [".download .container > *", "up"],
      [".brand-hero .container > *", "up"],
      [".footer-grid > *", "up"],
      [".legal", "fade"],
      [".error-page > *", "zoom"],
    ];

    plan.forEach(([selector, kind]) => {
      document.querySelectorAll(selector).forEach((el) => {
        if (el.closest(".site-header")) return;
        if (el.closest("[data-cascade]")) return;
        if (el.classList.contains("pa-ambient")) return;

        // index.html already ships bare `data-reveal` attributes. Treat a bare
        // (valueless) attribute as "use the planned effect"; never override an
        // explicit author-set value.
        const existing = el.getAttribute("data-reveal");
        if (existing) return;

        if (kind === "cascade") {
          el.setAttribute("data-cascade", "");
          el.setAttribute("data-reveal", "fade");
        } else if (kind === "up") {
          el.setAttribute("data-reveal", "");
        } else {
          el.setAttribute("data-reveal", kind);
        }
      });
    });

    // Fallback for minimal pages (about / privacy) that match none of the
    // selectors above: animate the direct children of <main> or its container.
    if (!document.querySelector("[data-reveal]")) {
      const main = document.querySelector("main") || document.body;
      const scope = main.querySelector(":scope > .container") || main;
      Array.from(scope.children).forEach((el) => {
        if (el.classList.contains("pa-ambient")) return;
        el.setAttribute("data-reveal", "");
      });
    }
  };

  /**
   * Give siblings inside the same group an incremental stagger index.
   */
  const applyStagger = () => {
    const groups = [
      ".home-values-grid",
      ".feature-grid",
      ".why-grid",
      ".value-grid",
      ".process-list",
      ".shot-grid",
      ".product-grid",
      ".roadmap",
      ".footer-grid",
      ".home-footer-top",
      ".contact-grid",
      ".about-grid",
      ".home-hero-grid",
      ".future-grid",
    ];

    groups.forEach((selector) => {
      document.querySelectorAll(selector).forEach((group) => {
        let index = 0;
        Array.from(group.children).forEach((child) => {
          if (!child.hasAttribute("data-reveal")) return;
          child.style.setProperty("--pa-i", String(index));
          index += 1;
        });
      });
    });
  };

  /**
   * Scroll-triggered reveal. One observer, unobserve after firing, and the
   * will-change hint is cleared once the transition settles.
   */
  const startReveals = () => {
    const items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (prefersReduced() || !supportsObserver) {
      items.forEach((item) => item.classList.add("is-visible", "pa-settled"));
      return;
    }

    const settle = (el) => {
      window.setTimeout(() => el.classList.add("pa-settled"), 1400);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          settle(entry.target);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    items.forEach((item) => {
      // Anything already in view on load reveals immediately (no blank hero).
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
        item.classList.add("is-visible");
        settle(item);
        return;
      }
      observer.observe(item);
    });
  };

  /**
   * Build the ambient background (moving gradient + floating shapes +
   * light particles) purely in JS so no markup changes are needed.
   */
  const buildAmbient = () => {
    if (!allowAmbient()) return;

    const density = lowPower || isCoarse() ? "low" : "full";

    const scenes = [
      {
        host: document.querySelector(".home-hero"),
        wash: ["rgba(245, 138, 36, 0.13)", "rgba(37, 183, 160, 0.12)"],
        shapes: [
          { top: "16%", start: "6%", size: 120, radius: "38%", rot: "22deg", dx: "18px", dy: "-26px", dur: 18, op: 0.6 },
          { top: "62%", start: "12%", size: 62, radius: "50%", rot: "-18deg", dx: "-14px", dy: "-20px", dur: 15, delay: 1.2, op: 0.5 },
          { top: "24%", start: "86%", size: 84, radius: "34%", rot: "16deg", dx: "-20px", dy: "22px", dur: 21, delay: 0.6, op: 0.45 },
        ],
        blobs:
          density === "full"
            ? [
                { top: "6%", start: "58%", size: 330, fill: "rgba(245, 138, 36, 0.10)", dur: 24 },
                { top: "44%", start: "-4%", size: 290, fill: "rgba(37, 183, 160, 0.10)", dur: 28, delay: 2 },
              ]
            : [],
        stars: 5,
        starColor: "rgba(233, 185, 73, 0.8)",
        clouds: 2,
        bubbles: 3,
        bubbleColor: "rgba(37, 183, 160, 0.4)",
        dots: density === "full" ? 10 : 5,
        dotColor: "rgba(245, 138, 36, 0.45)",
        rise: 620,
      },
      {
        host: document.querySelector(".product-section"),
        wash: ["rgba(245, 138, 36, 0.08)", "rgba(37, 183, 160, 0.07)"],
        shapes: [
          { top: "10%", start: "4%", size: 150, radius: "42%", rot: "14deg", dx: "16px", dy: "-18px", dur: 24, op: 0.5 },
          { top: "70%", start: "90%", size: 90, radius: "50%", rot: "-20deg", dx: "-16px", dy: "-24px", dur: 19, delay: 1, op: 0.42 },
        ],
        clouds: density === "full" ? 2 : 1,
        bubbles: density === "full" ? 4 : 2,
        bubbleColor: "rgba(47, 158, 107, 0.35)",
        stars: 3,
        starColor: "rgba(245, 138, 36, 0.7)",
        dots: density === "full" ? 6 : 3,
        dotColor: "rgba(37, 183, 160, 0.35)",
        rise: 520,
      },
      {
        host: document.querySelector(".values-section"),
        wash: ["rgba(37, 183, 160, 0.08)", "rgba(102, 153, 237, 0.07)"],
        shapes: [
          { top: "12%", start: "88%", size: 110, radius: "40%", rot: "-16deg", dx: "-18px", dy: "20px", dur: 22, op: 0.5 },
          { top: "68%", start: "8%", size: 70, radius: "50%", rot: "18deg", dx: "14px", dy: "-22px", dur: 17, delay: 0.9, op: 0.45 },
        ],
        dots: density === "full" ? 6 : 3,
        dotColor: "rgba(83, 139, 228, 0.3)",
        rise: 520,
      },
      {
        host: document.querySelector(".future-section"),
        wash: ["rgba(245, 138, 36, 0.16)", "rgba(37, 183, 160, 0.14)"],
        shapes: [
          { top: "14%", start: "5%", size: 130, radius: "40%", rot: "20deg", dx: "20px", dy: "-22px", dur: 23, op: 0.55, stroke: "rgba(255, 255, 255, 0.07)" },
          { top: "66%", start: "82%", size: 78, radius: "50%", rot: "-22deg", dx: "-18px", dy: "-18px", dur: 18, delay: 1.4, op: 0.5, stroke: "rgba(255, 255, 255, 0.08)" },
        ],
        stars: density === "full" ? 7 : 4,
        starColor: "rgba(255, 224, 138, 0.9)",
        dots: density === "full" ? 12 : 6,
        dotColor: "rgba(255, 182, 92, 0.55)",
        rise: 560,
      },
      {
        host: document.querySelector(".home-footer, .site-footer"),
        wash: ["rgba(245, 138, 36, 0.09)", "rgba(37, 183, 160, 0.08)"],
        shapes: [
          { top: "20%", start: "88%", size: 96, radius: "42%", rot: "-14deg", dx: "-14px", dy: "16px", dur: 26, op: 0.4, stroke: "rgba(255, 255, 255, 0.06)" },
        ],
        dots: density === "full" ? 5 : 0,
        dotColor: "rgba(37, 183, 160, 0.4)",
        rise: 320,
      },
      {
        host: document.querySelector(".island-hero, .page-hero"),
        wash: ["rgba(239, 122, 26, 0.12)", "rgba(78, 179, 212, 0.12)"],
        shapes: [
          { top: "18%", start: "7%", size: 104, radius: "40%", rot: "18deg", dx: "16px", dy: "-20px", dur: 20, op: 0.5 },
          { top: "64%", start: "88%", size: 68, radius: "50%", rot: "-16deg", dx: "-16px", dy: "-18px", dur: 17, delay: 1.1, op: 0.45 },
        ],
        clouds: density === "full" ? 3 : 2,
        stars: density === "full" ? 6 : 3,
        starColor: "rgba(239, 122, 26, 0.75)",
        bubbles: density === "full" ? 5 : 3,
        bubbleColor: "rgba(78, 179, 212, 0.45)",
        dots: density === "full" ? 7 : 3,
        dotColor: "rgba(255, 255, 255, 0.45)",
        rise: 420,
      },
    ];

    const hosts = [];

    scenes.forEach((scene) => {
      const host = scene.host;
      if (!host || host.querySelector(":scope > .pa-ambient")) return;

      const layer = document.createElement("div");
      layer.className = "pa-ambient";
      layer.setAttribute("aria-hidden", "true");

      const wash = document.createElement("span");
      wash.className = "pa-wash";
      wash.style.setProperty("--pa-wash-a", scene.wash[0]);
      wash.style.setProperty("--pa-wash-b", scene.wash[1]);
      layer.appendChild(wash);

      (scene.shapes || []).forEach((shape) => {
        const el = document.createElement("span");
        el.className = "pa-shape";
        el.style.setProperty("--pa-top", shape.top);
        el.style.setProperty("--pa-start", shape.start);
        el.style.setProperty("--pa-size", shape.size + "px");
        el.style.setProperty("--pa-radius", shape.radius);
        el.style.setProperty("--pa-rot", shape.rot);
        el.style.setProperty("--pa-dx", shape.dx);
        el.style.setProperty("--pa-dy", shape.dy);
        el.style.setProperty("--pa-dur-s", shape.dur + "s");
        el.style.setProperty("--pa-delay", (shape.delay || 0) + "s");
        el.style.setProperty("--pa-op", String(shape.op));
        if (shape.stroke) el.style.setProperty("--pa-stroke", shape.stroke);
        layer.appendChild(el);
      });

      // Large soft gradient blobs (hero-grade depth, GPU-only transforms).
      (scene.blobs || []).forEach((blob, i) => {
        const el = document.createElement("span");
        el.className = "pa-blob";
        el.style.setProperty("--pa-top", blob.top);
        el.style.setProperty("--pa-start", blob.start);
        el.style.setProperty("--pa-size", blob.size + "px");
        el.style.setProperty("--pa-fill", blob.fill);
        el.style.setProperty("--pa-dur-s", blob.dur + "s");
        el.style.setProperty("--pa-delay", (blob.delay || 0) + "s");
        el.style.setProperty("--pa-alt", i % 2 ? "-1" : "1");
        layer.appendChild(el);
      });

      // Tiny twinkling stars — the "Jazireh Fandoghi" adventure feel.
      const starCount = scene.stars || 0;
      for (let i = 0; i < starCount; i += 1) {
        const star = document.createElement("span");
        const ratio = (i + 0.5) / starCount;
        star.className = "pa-star";
        star.style.setProperty("--pa-top", (8 + ((i * 31) % 62)).toFixed(0) + "%");
        star.style.setProperty("--pa-start", (4 + ratio * 92).toFixed(1) + "%");
        star.style.setProperty("--pa-size", (7 + ((i * 3) % 6)).toFixed(0) + "px");
        star.style.setProperty("--pa-fill", scene.starColor || "rgba(233, 185, 73, 0.8)");
        star.style.setProperty("--pa-dur-s", (2.6 + ((i * 0.7) % 2.4)).toFixed(1) + "s");
        star.style.setProperty("--pa-delay", (ratio * 3.4).toFixed(1) + "s");
        layer.appendChild(star);
      }

      // Soft drifting clouds (pure CSS shapes, very low opacity).
      const cloudCount = scene.clouds || 0;
      for (let i = 0; i < cloudCount; i += 1) {
        const cloud = document.createElement("span");
        cloud.className = "pa-cloud";
        cloud.style.setProperty("--pa-top", (10 + i * 34 + ((i * 13) % 12)).toFixed(0) + "%");
        cloud.style.setProperty("--pa-start", (i % 2 ? 70 : 6) + ((i * 7) % 12) + "%");
        cloud.style.setProperty("--pa-size", (90 + ((i * 37) % 50)).toFixed(0) + "px");
        cloud.style.setProperty("--pa-dur-s", (34 + i * 9).toFixed(0) + "s");
        cloud.style.setProperty("--pa-delay", (i * 4.5).toFixed(1) + "s");
        cloud.style.setProperty("--pa-alt", i % 2 ? "-1" : "1");
        layer.appendChild(cloud);
      }

      // Rising bubbles with a soft rim — playful but restrained.
      const bubbleCount = scene.bubbles || 0;
      for (let i = 0; i < bubbleCount; i += 1) {
        const bubble = document.createElement("span");
        const ratio = (i + 0.5) / bubbleCount;
        bubble.className = "pa-bubble";
        bubble.style.setProperty("--pa-start", (10 + ratio * 80).toFixed(1) + "%");
        bubble.style.setProperty("--pa-size", (10 + ((i * 9) % 14)).toFixed(0) + "px");
        bubble.style.setProperty("--pa-stroke", scene.bubbleColor || "rgba(37, 183, 160, 0.4)");
        bubble.style.setProperty("--pa-dur-s", (16 + ((i * 6) % 10)).toFixed(0) + "s");
        bubble.style.setProperty("--pa-delay", (ratio * 11).toFixed(1) + "s");
        bubble.style.setProperty("--pa-dx", (((i % 3) - 1) * 22).toFixed(0) + "px");
        bubble.style.setProperty("--pa-rise", (scene.rise || 420) + "px");
        layer.appendChild(bubble);
      }

      const dotCount = scene.dots || 0;
      for (let i = 0; i < dotCount; i += 1) {
        const dot = document.createElement("span");
        const ratio = (i + 0.5) / dotCount;
        dot.className = "pa-dot";
        dot.style.setProperty("--pa-start", (6 + ratio * 88).toFixed(1) + "%");
        dot.style.setProperty("--pa-size", (3 + ((i * 7) % 4)).toFixed(0) + "px");
        dot.style.setProperty("--pa-fill", scene.dotColor);
        dot.style.setProperty("--pa-dur-s", (13 + ((i * 5) % 9)).toFixed(0) + "s");
        dot.style.setProperty("--pa-delay", (ratio * 12).toFixed(1) + "s");
        dot.style.setProperty("--pa-dx", (((i % 5) - 2) * 12).toFixed(0) + "px");
        dot.style.setProperty("--pa-rise", scene.rise + "px");
        dot.style.setProperty("--pa-op", (0.4 + ((i % 3) * 0.18)).toFixed(2));
        layer.appendChild(dot);
      }

      const style = window.getComputedStyle(host);
      if (style.position === "static") host.style.position = "relative";
      if (style.overflow === "visible") host.style.overflow = "hidden";
      if (style.isolation !== "isolate") host.style.isolation = "isolate";

      host.appendChild(layer);
      host.classList.add("pa-ambient-host", "pa-idle");
      hosts.push(host);
    });

    if (!hosts.length) return;

    // Only animate ambient layers for sections currently on screen.
    if (supportsObserver) {
      const visibility = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            entry.target.classList.toggle("pa-idle", !entry.isIntersecting);
          });
        },
        { rootMargin: "120px 0px" }
      );
      hosts.forEach((host) => visibility.observe(host));
    } else {
      hosts.forEach((host) => host.classList.remove("pa-idle"));
    }

    // Stop all ambient work when the tab is hidden.
    document.addEventListener("visibilitychange", () => {
      const hidden = document.hidden;
      hosts.forEach((host) => {
        if (hidden) host.classList.add("pa-idle");
        else host.classList.remove("pa-idle");
      });
    });
  };

  /**
   * Very light pointer parallax on the two hero-ish visuals.
   * Desktop + fine pointer only, rAF-throttled, transform only.
   */
  const startParallax = () => {
    if (prefersReduced() || isCoarse() || lowPower) return;

    const targets = [
      { el: document.querySelector(".brand-showcase"), depth: 10 },
      { el: document.querySelector(".future-visual"), depth: 8 },
      { el: document.querySelector(".island-stage"), depth: 8 },
    ].filter((item) => item.el);

    if (!targets.length) return;

    targets.forEach((item) => item.el.classList.add("pa-parallax"));

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const render = () => {
      frame = 0;
      targets.forEach(({ el, depth }) => {
        el.style.setProperty("--pa-px", (pointerX * depth).toFixed(2) + "px");
        el.style.setProperty("--pa-py", (pointerY * depth).toFixed(2) + "px");
      });
    };

    window.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerType !== "mouse") return;
        pointerX = (event.clientX / window.innerWidth) * 2 - 1;
        pointerY = (event.clientY / window.innerHeight) * 2 - 1;
        if (!frame) frame = window.requestAnimationFrame(render);
      },
      { passive: true }
    );

    window.addEventListener("pointerleave", () => {
      pointerX = 0;
      pointerY = 0;
      if (!frame) frame = window.requestAnimationFrame(render);
    });
  };

  /**
   * 3D tilt + travelling light on the hero product cards.
   * Desktop / fine pointer only; rAF-throttled; transform + opacity only.
   */
  const startTilt = () => {
    if (prefersReduced() || isCoarse() || lowPower) return;

    const cards = document.querySelectorAll(
      ".main-product-card, .featured-product, .product-card"
    );
    if (!cards.length) return;

    cards.forEach((card) => {
      if (card.classList.contains("pa-tilt")) return;
      card.classList.add("pa-tilt");

      const light = document.createElement("span");
      light.className = "pa-tilt-light";
      light.setAttribute("aria-hidden", "true");
      card.appendChild(light);

      let frame = 0;
      let px = 0;
      let py = 0;
      let inside = false;

      const render = () => {
        frame = 0;
        if (!inside) {
          card.style.setProperty("--pa-rx", "0deg");
          card.style.setProperty("--pa-ry", "0deg");
          card.style.setProperty("--pa-lo", "0");
          return;
        }
        // Max ±2.2deg: perceptible depth without looking like a gimmick.
        card.style.setProperty("--pa-rx", (py * -2.2).toFixed(2) + "deg");
        card.style.setProperty("--pa-ry", (px * 2.2).toFixed(2) + "deg");
        card.style.setProperty("--pa-lx", ((px + 1) * 50).toFixed(1) + "%");
        card.style.setProperty("--pa-ly", ((py + 1) * 50).toFixed(1) + "%");
        card.style.setProperty("--pa-lo", "1");
      };

      card.addEventListener(
        "pointermove",
        (event) => {
          if (event.pointerType !== "mouse") return;
          const rect = card.getBoundingClientRect();
          px = ((event.clientX - rect.left) / rect.width) * 2 - 1;
          py = ((event.clientY - rect.top) / rect.height) * 2 - 1;
          inside = true;
          if (!frame) frame = window.requestAnimationFrame(render);
        },
        { passive: true }
      );

      card.addEventListener("pointerleave", () => {
        inside = false;
        if (!frame) frame = window.requestAnimationFrame(render);
      });
    });
  };

  /**
   * Soft press ripple on buttons and primary links.
   * Composited scale/opacity only; nodes are recycled after the animation.
   */
  const startRipples = () => {
    if (prefersReduced()) return;

    const targets = document.querySelectorAll(".btn, .product-link, .nav-cta");
    targets.forEach((el) => {
      if (el.classList.contains("pa-ripple-host")) return;
      el.classList.add("pa-ripple-host");
      el.addEventListener("pointerdown", (event) => {
        const rect = el.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.9;
        const x = (event.clientX || rect.left + rect.width / 2) - rect.left;
        const y = (event.clientY || rect.top + rect.height / 2) - rect.top;

        const ripple = document.createElement("span");
        ripple.className = "pa-ripple";
        ripple.style.width = ripple.style.height = size + "px";
        ripple.style.left = x - size / 2 + "px";
        ripple.style.top = y - size / 2 + "px";
        el.appendChild(ripple);
        ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
        // Safety net if animationend never fires.
        window.setTimeout(() => ripple.remove(), 900);
      });
    });
  };

  /**
   * Gentle scroll parallax on decorative layers (never on text).
   * One rAF-throttled scroll listener drives every registered layer.
   */
  const startScrollParallax = () => {
    if (prefersReduced() || isCoarse() || lowPower) return;

    const layers = [];
    const register = (el, speed) => {
      if (!el) return;
      el.classList.add("pa-scrolled");
      layers.push({ el, speed });
    };

    register(document.querySelector(".hero-glow-one"), -0.06);
    register(document.querySelector(".hero-glow-two"), 0.05);
    document.querySelectorAll(".pa-shape").forEach((el, i) => {
      register(el, (i % 2 ? 0.035 : -0.045));
    });
    document.querySelectorAll(".pa-blob").forEach((el, i) => {
      register(el, (i % 2 ? 0.05 : -0.04));
    });

    if (!layers.length) return;

    let frame = 0;
    const render = () => {
      frame = 0;
      const vh = window.innerHeight;
      layers.forEach(({ el, speed }) => {
        const host = el.closest(".pa-ambient-host, .home-hero");
        if (host && host.classList.contains("pa-idle")) return;
        const rect = (host || el).getBoundingClientRect();
        // Progress of the section through the viewport: -1 → 1
        const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
        el.style.setProperty("--pa-sy", (progress * speed * -220).toFixed(1) + "px");
      });
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!frame) frame = window.requestAnimationFrame(render);
      },
      { passive: true }
    );
    render();
  };

  /**
   * Soft page-to-page transition: fade the page out before navigating to
   * another internal page. Anchors, downloads, external and modified
   * clicks are left untouched.
   */
  const startPageTransitions = () => {
    if (prefersReduced()) return;

    document.addEventListener("click", (event) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = event.target.closest("a[href]");
      if (!link) return;
      if (link.target && link.target !== "_self") return;
      if (link.hasAttribute("download")) return;

      const href = link.getAttribute("href") || "";
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Same page + hash → let the browser scroll.
      if (url.pathname === window.location.pathname && url.hash) return;

      event.preventDefault();
      body.classList.add("pa-leaving");
      window.setTimeout(() => {
        window.location.href = link.href;
      }, 230);
    });

    // Restore state when the page is served from the bfcache.
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) body.classList.remove("pa-leaving");
    });
  };

  /**
   * Boot the motion layer.
   */
  const initMotion = () => {
    autoReveal();
    applyStagger();

    if (prefersReduced()) {
      document
        .querySelectorAll("[data-reveal]")
        .forEach((el) => el.classList.add("is-visible", "pa-settled"));
      return;
    }

    body.classList.add("js-motion");
    startReveals();
    buildAmbient();
    startParallax();
    startTilt();
    startRipples();
    startScrollParallax();
    startPageTransitions();
  };

  // Reveal state must be applied before first paint to avoid a flash.
  initMotion();

  // React to a live change of the motion preference.
  if (reduceQuery) {
    const onChange = () => {
      if (reduceQuery.matches) {
        body.classList.remove("js-motion");
        document
          .querySelectorAll("[data-reveal]")
          .forEach((el) => el.classList.add("is-visible", "pa-settled"));
        document.querySelectorAll(".pa-ambient").forEach((el) => el.remove());
      } else if (!body.classList.contains("js-motion")) {
        body.classList.add("js-motion");
        buildAmbient();
        startParallax();
        startTilt();
        startRipples();
        startScrollParallax();
      }
    };

    if (typeof reduceQuery.addEventListener === "function") {
      reduceQuery.addEventListener("change", onChange);
    } else if (typeof reduceQuery.addListener === "function") {
      reduceQuery.addListener(onChange);
    }
  }

  /* ----------------------------------------------------------------
     Contact form
     ---------------------------------------------------------------- */
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const topic = String(data.get("topic") || "گفتگو");
      const message = String(data.get("message") || "").trim();

      if (!name || !email || !message) {
        form.reportValidity();
        return;
      }

      const subject = encodeURIComponent(`پیام از سایت پارسا اپس — ${topic}`);
      const mailBody = encodeURIComponent(`نام: ${name}\nایمیل: ${email}\nموضوع: ${topic}\n\n${message}`);
      window.location.href = `mailto:farshadparsa2019@gmail.com?subject=${subject}&body=${mailBody}`;

      if (success) {
        success.classList.add("show");
        success.textContent = "پنجرهٔ ایمیل باز شد. اگر باز نشد، مستقیم به farshadparsa2019@gmail.com بنویسید.";
      }
      form.reset();
    });
  }
})();
