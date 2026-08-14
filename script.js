/* ============================================================
   پارسا اپس — Parsa Apps
   Motion Engine | بدون هیچ کتابخانه خارجی
   Scroll Reveal / 3D Tilt / Ripple / Parallax / Slider /
   Phone Wake / FAQ / Theme / PWA
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* -----------------------------
     1) Scroll Reveal
  ----------------------------- */
  const revealElements = document.querySelectorAll(
    ".section, .glass-card, .product-card, .timeline-item, .about-block"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => {
    el.classList.add("hidden");
    observer.observe(el);
  });

  /* -----------------------------
     2) 3D Tilt Cards (دسکتاپ)
  ----------------------------- */
  const tiltCards = document.querySelectorAll(".floating-card, .product-card");

  tiltCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      if (window.innerWidth < 800) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = (x / rect.width - 0.5) * 14;
      const rotateX = (y / rect.height - 0.5) * -14;
      card.style.transform =
        "perspective(900px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) scale(1.02)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  /* -----------------------------
     3) Ripple Effect
  ----------------------------- */
  document.querySelectorAll(".btn, .download-button, .footer-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = size + "px";
      ripple.style.height = size + "px";
      ripple.style.left = e.clientX - rect.left - size / 2 + "px";
      ripple.style.top = e.clientY - rect.top - size / 2 + "px";
      ripple.className = "ripple";
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* -----------------------------
     4) Background Parallax
  ----------------------------- */
  const glows = document.querySelectorAll(".background-effects span");
  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const y = window.scrollY;
          glows.forEach((item, index) => {
            item.style.transform = "translateY(" + y * (index + 1) * 0.035 + "px)";
          });
          ticking = false;
        });
      }
    },
    { passive: true }
  );

  /* -----------------------------
     5) هدر: سایه هنگام اسکرول
  ----------------------------- */
  const header = document.querySelector(".header");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 30);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* -----------------------------
     6) منوی موبایل
  ----------------------------- */
  const menuBtn = document.querySelector(".menu-btn");
  const nav = document.querySelector("nav");

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      nav.classList.toggle("active");
      menuBtn.textContent = nav.classList.contains("active") ? "✕" : "☰";
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
        menuBtn.textContent = "☰";
      });
    });

    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !menuBtn.contains(e.target) && nav.classList.contains("active")) {
        nav.classList.remove("active");
        menuBtn.textContent = "☰";
      }
    });
  }

  /* -----------------------------
     7) حالت Dark / Light
  ----------------------------- */
  const toggleBtn = document.querySelector(".theme-toggle");
  if (toggleBtn) {
    const saved = localStorage.getItem("parsa-theme");
    if (saved === "light") document.body.classList.add("light");

    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("light");
      localStorage.setItem(
        "parsa-theme",
        document.body.classList.contains("light") ? "light" : "dark"
      );
    });
  }

  /* -----------------------------
     8) موکاپ گوشی: چرخش سه‌بعدی با موس و لمس
  ----------------------------- */
  const phone = document.getElementById("phone");
  if (phone) {
    phone.addEventListener("mousemove", (e) => {
      if (window.innerWidth < 800) return;
      const rect = phone.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = (x / rect.width - 0.5) * 26;
      const rotateX = (y / rect.height - 0.5) * -26;
      phone.style.animation = "none";
      phone.style.transform = "rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg)";
    });

    phone.addEventListener("mouseleave", () => {
      phone.style.transform = "";
      phone.style.animation = "phoneIdle 5.5s infinite ease-in-out";
    });

    phone.addEventListener(
      "touchmove",
      (e) => {
        if (!e.touches.length) return;
        const touch = e.touches[0];
        const move = touch.clientX / window.innerWidth;
        phone.style.animation = "none";
        phone.style.transform = "rotateY(" + (move * 30 - 15) + "deg)";
      },
      { passive: true }
    );

    phone.addEventListener("touchend", () => {
      phone.style.transform = "";
      phone.style.animation = "phoneIdle 5.5s infinite ease-in-out";
    });
  }

  /* -----------------------------
     9) روشن شدن سینمایی گوشی هنگام اسکرول
  ----------------------------- */
  const phoneReveal = document.querySelector(".reveal-phone");
  if (phoneReveal) {
    const phoneObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            phoneReveal.classList.add("phone-active");
            phoneObserver.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );
    phoneObserver.observe(phoneReveal);
  }

  /* -----------------------------
     10) اسلایدشو اسکرین‌شات داخل گوشی
  ----------------------------- */
  const slides = document.querySelectorAll(".app-slide");
  const dots = document.querySelectorAll(".phone-slider-dots span");
  let currentSlide = 0;
  let sliderTimer = null;

  function changeSlide(index) {
    slides.forEach((s) => s.classList.remove("active"));
    dots.forEach((d) => d.classList.remove("active"));
    if (slides[index]) slides[index].classList.add("active");
    if (dots[index]) dots[index].classList.add("active");
  }

  function nextSlide() {
    currentSlide++;
    if (currentSlide >= slides.length) currentSlide = 0;
    changeSlide(currentSlide);
  }

  function startSlider() {
    if (sliderTimer || slides.length < 2) return;
    sliderTimer = setInterval(nextSlide, 3500);
  }

  function stopSlider() {
    clearInterval(sliderTimer);
    sliderTimer = null;
  }

  if (slides.length) {
    changeSlide(0);
    startSlider();

    if (phone) {
      phone.addEventListener("mouseenter", stopSlider);
      phone.addEventListener("mouseleave", startSlider);
      phone.addEventListener("touchstart", stopSlider, { passive: true });
      phone.addEventListener("touchend", startSlider, { passive: true });
    }

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        currentSlide = index;
        changeSlide(index);
      });
    });
  }

  /* -----------------------------
     11) تریلر: دکمه پخش + حالت «به‌زودی»
  ----------------------------- */
  const video = document.getElementById("islandVideo");
  const playButton = document.getElementById("playButton");
  const comingSoon = document.getElementById("comingSoon");

  if (video && playButton) {
    let videoAvailable = false;

    video.addEventListener("loadeddata", () => {
      videoAvailable = true;
    });
    video.addEventListener("error", () => {
      videoAvailable = false;
    });

    playButton.addEventListener("click", () => {
      if (video.readyState >= 2) {
        videoAvailable = true;
      }
      if (videoAvailable) {
        video.play().catch(() => {
          if (comingSoon) comingSoon.classList.add("show");
        });
        playButton.style.display = "none";
      } else if (comingSoon) {
        comingSoon.classList.add("show");
      }
    });

    video.addEventListener("click", () => {
      if (video.paused && videoAvailable) {
        video.play();
      } else if (!videoAvailable && comingSoon) {
        comingSoon.classList.add("show");
      } else {
        video.pause();
        playButton.style.display = "flex";
      }
    });

    video.addEventListener("play", () => {
      if (comingSoon) comingSoon.classList.remove("show");
      playButton.style.display = "none";
    });
  }

  /* -----------------------------
     12) FAQ آکاردئون
  ----------------------------- */
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    if (!button || !answer) return;

    button.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      faqItems.forEach((other) => {
        other.classList.remove("active");
        const ans = other.querySelector(".faq-answer");
        if (ans) ans.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add("active");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* -----------------------------
     13) ورود کارت‌های جزیره هنگام اسکرول
  ----------------------------- */
  const featureCards = document.querySelectorAll(".feature-3d-card");
  const trustCards = document.querySelectorAll(".trust-card");
  const reviewCards = document.querySelectorAll(".review-card");

  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains("feature-3d-card")) {
            entry.target.classList.add("show-feature");
          } else if (entry.target.classList.contains("trust-card")) {
            entry.target.classList.add("show");
          } else if (entry.target.classList.contains("review-card")) {
            entry.target.classList.add("show-review");
          }
          cardObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  featureCards.forEach((c) => cardObserver.observe(c));
  trustCards.forEach((c) => cardObserver.observe(c));
  reviewCards.forEach((c) => cardObserver.observe(c));

  /* -----------------------------
     14) فرم تماس — ساخت پیش‌نویس ایمیل
  ----------------------------- */
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = (document.getElementById("name") || {}).value || "";
      const email = (document.getElementById("email") || {}).value || "";
      const topic = (document.getElementById("topic") || {}).value || "";
      const message = (document.getElementById("message") || {}).value || "";

      const subject = "پیام از سایت پارسا اپس — " + topic;
      const body =
        "نام: " + name + "\n" +
        "ایمیل: " + email + "\n" +
        "موضوع: " + topic + "\n\n" +
        message;

      const mailtoUrl =
        "mailto:farshadparsa2019@gmail.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      contactForm.dataset.lastMailto = mailtoUrl; // برای تست و دیباگ
      window.location.href = mailtoUrl;

      const success = contactForm.querySelector(".form-success");
      if (success) success.classList.add("show");
    });
  }

  /* -----------------------------
     15) اعلان دانلود (تا انتشار رسمی اپ)
  ----------------------------- */
  const toast = document.getElementById("toast");

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("show"), 3200);
  }

  document.querySelectorAll("[data-coming-soon]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      showToast(el.getAttribute("data-coming-soon") || "به‌زودی منتشر می‌شود ✨");
    });
  });

  /* -----------------------------
     16) PWA — Service Worker
  ----------------------------- */
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {
        /* بی‌صدا — در محیط‌های محلی ممکن است در دسترس نباشد */
      });
    });
  }

  /* -----------------------------
     17) لود نرم صفحه
  ----------------------------- */
  document.body.classList.add("loaded");
});
