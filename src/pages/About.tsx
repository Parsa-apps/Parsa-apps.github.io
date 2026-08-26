import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { skills, timeline, CONTACT } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { Parallax, Reveal, SectionHeader, TiltCard, Marquee } from "@/components/ui";

const roles = [
  { icon: "🤖", title: "Android Developer", key: "role.android" },
  { icon: "💠", title: "Flutter Developer", key: "role.flutter" },
  { icon: "🎨", title: "UI/UX Designer", key: "role.uiux" },
  { icon: "🏗️", title: "Software Architect", key: "role.architect" },
];

export default function About() {
  const { t } = useI18n();
  return (
    <div className="pt-28">
      {/* hero */}
      <section className="section-shell pb-8">
        <div className="container-px text-center">
          <Reveal>
            <div className="mx-auto mb-6 flex justify-center">
              <Parallax speed={0.08}>
                <motion.img
                  src="/assets/logo.png"
                  alt="Parsa Apps"
                  width={120}
                  height={120}
                  className="drop-shadow-[0_0_35px_rgba(0,198,255,0.45)] object-contain"
                  initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </Parallax>
            </div>
            <span className="eyebrow">{t("about.hero.eyebrow")}</span>
            {/* Fixed: Persian name was split char-by-char which breaks Arabic joining. Use full word with strong Vazirmatn Black */}
            <h1 className="mt-6 text-center font-black leading-[1.15] tracking-tight">
              <motion.span
                className="inline-block bg-gradient-to-l from-white via-[#d8d6ff] to-[#8a7dff] bg-clip-text text-transparent"
                style={{
                  fontFamily: "Vazirmatn, system-ui, sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(2.2rem, 6vw, 3.6rem)",
                  letterSpacing: "-0.02em",
                  textRendering: "optimizeLegibility",
                  WebkitFontSmoothing: "antialiased",
                }}
                initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              >
                {t("person.name")}
              </motion.span>
            </h1>
            <p
              className="mx-auto mt-6 max-w-2xl text-[15px] leading-[2.1] text-white/70 sm:text-[16px]"
              style={{ fontFamily: "Vazirmatn, system-ui, sans-serif", fontWeight: 500 }}
            >
              {t("about.hero.text")}
            </p>
          </Reveal>

          <Reveal delay={0.12} className="mt-10">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {roles.map((r) => (
                <TiltCard key={r.title} className="card p-6">
                  <span className="text-3xl">{r.icon}</span>
                  <h2 className="mt-4 text-base font-black text-white" dir="ltr">{r.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-white/55" style={{ fontFamily: "Vazirmatn" }}>{t(`${r.key}.text`)}</p>
                </TiltCard>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Marquee items={["Android", "Flutter", "Kotlin", "Java", "Dart", "Firebase", "UI/UX", "Material 3", "RTL Persian UX", "Clean Code"]} className="py-4" />

      {/* mission */}
      <section className="section-shell">
        <div className="container-px grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeader
              align="start"
              eyebrow={t("about.mission.eyebrow")}
              title={<>{t("about.mission.title.a")} <span className="text-gradient">{t("about.mission.title.b")}</span></>}
              subtitle={t("about.mission.subtitle")}
            />
          </Reveal>
          <Reveal delay={0.12}>
            <div className="grid gap-4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-neon-violet/40 hover:bg-white/[0.06]">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-neon-violet/20 text-neon-violet transition-transform duration-300 group-hover:rotate-[14deg] group-hover:scale-110">✓</span>
                  <p className="font-bold text-white/85" style={{ fontFamily: "Vazirmatn", fontWeight: 700 }}>{t(`about.mission.${n}`)}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* timeline */}
      <section className="section-shell">
        <div className="container-px">
          <SectionHeader eyebrow={t("about.path.eyebrow")} title={<>{t("about.path.title.a")} <span className="text-gradient">{t("about.path.title.b")}</span></>} />
          <div className="mx-auto mt-14 max-w-3xl">
            {timeline.map((_, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="relative flex gap-6 pb-10 last:pb-0">
                  <div className="flex flex-col items-center">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-neon-violet to-neon-blue text-sm font-black text-white shadow-glow">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {i < timeline.length - 1 && <span className="mt-3 w-px flex-1 bg-gradient-to-b from-neon-violet/50 to-transparent" />}
                  </div>
                  <div className="glass flex-1 rounded-2xl p-6">
                    <span className="text-xs font-bold text-neon-cyan">{t(`tl.${i + 1}.year`)}</span>
                    <h3 className="mt-1 text-xl font-black text-white" style={{ fontFamily: "Vazirmatn", fontWeight: 800 }}>{t(`tl.${i + 1}.title`)}</h3>
                    <p className="mt-2 leading-7 text-white/60" style={{ fontFamily: "Vazirmatn" }}>{t(`tl.${i + 1}.text`)}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* skills */}
      <section className="section-shell">
        <div className="container-px">
          <SectionHeader eyebrow={t("about.skills.eyebrow")} title={<>{t("about.skills.title.a")} <span className="text-gradient">{t("about.skills.title.b")}</span></>} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map((skill, i) => (
              <Reveal key={skill.name} delay={i * 0.05}>
                <TiltCard className="card p-6" intensity={10}>
                  <span className="text-3xl">{skill.icon}</span>
                  <h3 className="mt-4 text-lg font-black text-white" dir="ltr">{skill.name}</h3>
                  <div className="mt-4 flex items-center justify-between text-xs text-white/45">
                    <span>{skill.year === "Strong" ? t("skill.strong") : t("skill.good")}</span>
                    <span className="font-bold text-neon-cyan">{skill.level}%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-neon-violet to-neon-cyan"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-shell">
        <div className="container-px">
          <Reveal>
            <div className="card relative overflow-hidden p-8 text-center sm:p-12">
              <div className="absolute inset-0 grid-bg" />
              <motion.img
                src="/assets/logo.png"
                alt="Parsa Apps"
                width={84}
                height={84}
                className="relative mx-auto mb-5 drop-shadow-[0_0_24px_rgba(0,198,255,0.4)] animate-float object-contain"
              />
              <h2 className="relative text-3xl font-black" style={{ fontFamily: "Vazirmatn", fontWeight: 900 }}>{t("about.cta.title")}</h2>
              <p className="relative mx-auto mt-4 max-w-xl leading-8 text-white/60" style={{ fontFamily: "Vazirmatn" }}>
                {t("about.cta.text")}
              </p>
              <div className="relative mt-8 flex flex-wrap justify-center gap-4">
                <Link to="/contact" className="btn btn-primary">{t("about.cta.btnContact")}</Link>
                <a href={CONTACT.telegram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">{t("common.telegram")} <span dir="ltr">{CONTACT.telegramHandle}</span></a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
