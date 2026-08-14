(() => {
  const body = document.body;
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  const year = document.querySelector("[data-year]");
  const form = document.querySelector("#contact-form");
  const success = document.querySelector(".form-success");
  const revealItems = document.querySelectorAll("[data-reveal]");

  body.classList.add("js-ready");

  if (year) {
    year.textContent = new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
    }).format(new Date());
  }

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

  if (header) {
    let ticking = false;
    const updateHeader = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
      ticking = false;
    };

    updateHeader();
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  }

  if (revealItems.length) {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, {
        threshold: 0.12,
        rootMargin: "0px 0px -35px",
      });

      revealItems.forEach((item) => observer.observe(item));
    } else {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    }
  }

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
