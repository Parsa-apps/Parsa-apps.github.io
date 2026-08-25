import { Link } from "react-router-dom";
import { CONTACT } from "@/lib/data";
import { Reveal } from "./ui";

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
              <img src="/assets/logo.svg" alt="" width={48} height={48} className="rounded-xl" />
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
              <a href={CONTACT.github} target="_blank" rel="noopener noreferrer" aria-label="گیت‌هاب" className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition-colors hover:border-white/40 hover:text-white">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>
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
            ساخته‌شده با <span className="text-neon-pink">♥</span> توسط تیم پارسا اپس
          </p>
        </div>
      </div>
    </footer>
  );
}
