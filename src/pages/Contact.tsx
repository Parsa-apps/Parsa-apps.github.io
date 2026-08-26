import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONTACT } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { Reveal, SectionHeader } from "@/components/ui";

const channels = [
  { icon: "📩", key: "channel.email", value: CONTACT.email, href: `mailto:${CONTACT.email}`, noteKey: "channel.email.note" },
  { icon: "✈️", key: "channel.telegram", value: CONTACT.telegramHandle, href: CONTACT.telegram, noteKey: "channel.telegram.note" },
  { icon: "📸", key: "channel.instagram", value: CONTACT.instagramHandle, href: CONTACT.instagram, noteKey: "channel.instagram.note" },
];

export default function Contact() {
  const { t } = useI18n();
  const [subject, setSubject] = useState("contact.subject.support");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
    const mailto = `mailto:${CONTACT.email}?subject=${encodeURIComponent(t(subject))}&body=${body}`;
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
              eyebrow={t("contact.hero.eyebrow")}
              title={<>{t("contact.hero.title.a")} <span className="text-gradient">{t("contact.hero.title.b")}</span></>}
              subtitle={t("contact.hero.subtitle")}
            />

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {channels.map((c, i) => (
                <Reveal key={c.key} delay={i * 0.06}>
                  <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" data-cursor-label={t(c.key)} className="card group block p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow">
                    <motion.span
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 280, damping: 18 }}
                      className="inline-block text-2xl"
                    >
                      {c.icon}
                    </motion.span>
                    <h3 className="mt-3 font-black text-white">{t(c.key)}</h3>
                    <p className="mt-1 text-sm font-bold text-neon-cyan" dir="ltr">{c.value}</p>
                    <p className="mt-2 text-xs text-white/45">{t(c.noteKey)}</p>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.1}>
            <form onSubmit={handleSubmit} className="card sticky top-28 p-6 sm:p-8">
              <h2 className="text-xl font-black text-white">{t("contact.form.title")}</h2>
              <p className="mt-2 text-sm text-white/50">{t("contact.form.note")}</p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-bold text-white/70">{t("contact.form.name")}</label>
                  <input className="glass-input" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("contact.form.namePh")} required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-white/70">{t("contact.form.email")}</label>
                  <input type="email" className="glass-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@gmail.com" required />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-white/70">{t("contact.form.subject")}</label>
                  <select className="glass-input" value={subject} onChange={(e) => setSubject(e.target.value)}>
                    <option value="contact.subject.support">{t("contact.subject.support")}</option>
                    <option value="contact.subject.collab">{t("contact.subject.collab")}</option>
                    <option value="contact.subject.content">{t("contact.subject.content")}</option>
                    <option value="contact.subject.other">{t("contact.subject.other")}</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-white/70">{t("contact.form.message")}</label>
                  <textarea className="glass-input min-h-32 resize-y" value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t("contact.form.messagePh")} required />
                </div>
              </div>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                type="submit"
                className="btn btn-primary mt-6 w-full !py-3.5"
              >
                {t("contact.form.submit")}
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
                    {t("contact.form.sent")}
                  </motion.p>
                )}
              </AnimatePresence>
              <p className="mt-4 text-center text-xs text-white/40">{t("contact.form.emailNote.a")} <span dir="ltr">{CONTACT.email}</span>{t("contact.form.emailNote.b")}</p>
            </form>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
