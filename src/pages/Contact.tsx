import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONTACT } from "@/lib/data";
import { Reveal, SectionHeader } from "@/components/ui";

const channels = [
  { icon: "📩", title: "ایمیل", value: CONTACT.email, href: `mailto:${CONTACT.email}`, note: "همکاری و پیشنهادهای تجاری" },
  { icon: "✈️", title: "تلگرام", value: CONTACT.telegramHandle, href: CONTACT.telegram, note: "پاسخ سریع در کمتر از ۲۴ ساعت" },
  { icon: "📸", title: "اینستاگرام", value: CONTACT.instagramHandle, href: CONTACT.instagram, note: "پیج رسمی پارسا اپس" },
];

export default function Contact() {
  const [subject, setSubject] = useState("پشتیبانی محصول");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    const mailto = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${body}`;
    setSent(true);
    window.location.href = mailto;
    window.setTimeout(() => setSent(false), 4200);
  };

  return (
    <div className="pt-28">
      <section className="section-shell pb-8">
        <div className="container-px grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionHeader
              align="start"
              eyebrow="💬 ارتباط با ما"
              title={<>بیایید <span className="text-gradient">درباره ایده شما</span> صحبت کنیم</>}
              subtitle="برای همکاری، پشتیبانی یا ایده، پیام‌ها مستقیم به فرشاد پارسا، مدیر و برنامه‌نویس ارشد پارسا اپس می‌رسد."
            />

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {channels.map((c, i) => (
                <Reveal key={c.title} delay={i * 0.06}>
                  <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" data-cursor-label={c.title} className="card group block p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow">
                    <motion.span
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 280, damping: 18 }}
                      className="inline-block text-2xl"
                    >
                      {c.icon}
                    </motion.span>
                    <h3 className="mt-3 font-black text-white">{c.title}</h3>
                    <p className="mt-1 text-sm font-bold text-neon-cyan" dir="ltr">{c.value}</p>
                    <p className="mt-2 text-xs text-white/45">{c.note}</p>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.1}>
            <form onSubmit={handleSubmit} className="card sticky top-28 p-6 sm:p-8">
              <h2 className="text-xl font-black text-white">فرم تماس</h2>
              <p className="mt-2 text-sm text-white/50">فرم، پیش‌نویس ایمیل شما را باز می‌کند. داده‌ای روی سرور ذخیره نمی‌شود.</p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-bold text-white/70">نام</label>
                  <input className="glass-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="نام شما" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-white/70">ایمیل</label>
                  <input type="email" className="glass-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@gmail.com" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-white/70">موضوع</label>
                  <select className="glass-input" value={subject} onChange={(e) => setSubject(e.target.value)}>
                    <option>پشتیبانی محصول</option>
                    <option>همکاری و انتشار</option>
                    <option>پیشنهاد محتوا</option>
                    <option>سایر</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-white/70">پیام</label>
                  <textarea className="glass-input min-h-32 resize-y" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="پیام خود را بنویسید…" required />
                </div>
              </div>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                type="submit"
                className="btn btn-primary mt-6 w-full !py-3.5"
              >
                ارسال پیام
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4Z"/></svg>
              </motion.button>
              <AnimatePresence>
                {sent && (
                  <motion.p
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    className="mt-4 rounded-xl border border-neon-cyan/30 bg-neon-cyan/10 px-4 py-3 text-center text-sm font-bold text-neon-cyan shadow-[0_0_24px_rgba(0,255,208,0.15)]"
                  >
                    ✓ پیام شما آماده ارسال شد — ممنون!
                  </motion.p>
                )}
              </AnimatePresence>
              <p className="mt-4 text-center text-xs text-white/40">پیام‌ها به {CONTACT.email} ارسال می‌شوند.</p>
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
