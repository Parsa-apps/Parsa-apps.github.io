(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  const year = document.querySelector("[data-year]");
  const form = document.querySelector("#contact-form");
  const success = document.querySelector(".form-success");

  if (year) year.textContent = new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(new Date());

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    links.querySelectorAll("a").forEach((anchor) => {
      anchor.addEventListener("click", () => {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (header) {
    const onScroll = () => {
      header.style.boxShadow = window.scrollY > 8 ? "0 10px 30px rgba(0,0,0,.18)" : "none";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
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
      const body = encodeURIComponent(`نام: ${name}\nایمیل: ${email}\nموضوع: ${topic}\n\n${message}`);
      window.location.href = `mailto:farshadparsa2019@gmail.com?subject=${subject}&body=${body}`;

      if (success) {
        success.classList.add("show");
        success.textContent = "پنجرهٔ ایمیل باز شد. اگر باز نشد، مستقیم به farshadparsa2019@gmail.com بنویسید.";
      }
      form.reset();
    });
  }
})();
