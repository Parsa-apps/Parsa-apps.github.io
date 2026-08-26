import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CONTACT } from "@/lib/data";
import { Reveal } from "./ui";

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          aria-label="بازگشت به بالا"
          initial={{ opacity: 0, y: 24, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.8 }}
          whileHover={{ y: -4, scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 left-6 z-[80] grid h-12 w-12 place-items-center rounded-2xl glass-strong text-white shadow-[0_18px_50px_-12px_rgba(0,198,255,0.45)]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

const quick = [
  { to: "/", label: "خانه" },
  { to: "/store", label: "پارسا استور" },
  { to: "/apps/fandoghi", label: "جزیره فندقی" },
  { to: "/about", label: "درباره" },
  { to: "/privacy", label: "حریم خصوصی" },
];

export default function Footer() {
  return (
    <footer className="relative mt-10 border-t border-white/10 bg-[#03040c]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-violet/60 to-transparent" />
      <div className="container-px py-16">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <Reveal>
            <Link to="/" className="flex items-center gap-3">
              <img src="/assets/logo.png" alt="Parsa Apps" width={48} height={48} className="rounded-xl object-contain drop-shadow-[0_0_12px_rgba(0,198,255,0.35)]" />
              <span>
                <span dir="ltr" className="block text-lg font-black text-white">Parsa <span className="text-gradient">Apps</span></span>
                <span className="block text-[11px] text-white/45">استودیو نرم‌افزار پرمیوم</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm leading-8 text-white/55">
              Building the future of mobile experiences. استودیویی که با مهندسی دقیق و طراحی مدرن،
              محصولات دیجیتال نسل جدید را می‌سازد.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a href={CONTACT.telegram} target="_blank" rel="noopener noreferrer" aria-label="تلگرام" className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-neon-violet/50 hover:text-white">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M21.9 4.6c.3-1-.8-1.8-1.7-1.4L2.3 10.5c-1 .4-.9 1.9.1 2.2l4.2 1.3 1.6 5c.3.8 1.3 1 1.9.4l2.3-2.2 4.3 3.1c.7.5 1.7.2 1.9-.6l3.3-15.1ZM7.2 12.8l10.6-6.1c.2-.1.4.2.2.3l-8.1 7.5-.3 3.2-2.4-4.9Z"/></svg>
              </a>
              <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" aria-label="اینستاگرام" className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-neon-pink/50 hover:text-white">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>
              </a>
              <a href={`mailto:${CONTACT.email}`} aria-label="ایمیل" className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-neon-cyan/50 hover:text-white">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h3 className="mb-4 text-sm font-black text-white">دسترسی سریع</h3>
            <ul className="space-y-3">
              {quick.map((q) => (
                <li key={q.to}>
                  <Link to={q.to} className="text-sm text-white/55 transition-colors hover:text-white">{q.label}</Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.14}>
            <h3 className="mb-4 text-sm font-black text-white">ارتباط</h3>
            <ul className="space-y-3 text-sm text-white/55">
              <li><a href={`mailto:${CONTACT.email}`} className="hover:text-white">{CONTACT.email}</a></li>
              <li><a href={CONTACT.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-white">تلگرام {CONTACT.telegramHandle}</a></li>
              <li><a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white">اینستاگرام {CONTACT.instagramHandle}</a></li>
            </ul>
          </Reveal>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
          <p>© ۱۴۰۵ پارسا اپس | تمامی حقوق محفوظ است</p>
          <p className="flex items-center gap-2">
            ساخته‌شده با <span className="animate-pulse text-neon-pink">♥</span> توسط تیم پارسا اپس
          </p>
        </div>
      </div>
      <BackToTop />
    </footer>
  );
}
