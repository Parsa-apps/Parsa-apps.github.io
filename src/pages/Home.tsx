import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { apps, skills, timeline, projects, CONTACT } from "@/lib/data";
import { AnimatedText, Counter, Magnetic, Marquee, MediaReveal, MouseParallax, Parallax, Reveal, SectionHeader, TiltCard } from "@/components/ui";
import { AppIcon, PhoneMockup, StatusBadge, StoreCard } from "@/components/apps";
import BrandMark from "@/components/BrandMark";

const teaserApps = apps.slice(0, 4);
const featured = apps.find((a) => a.slug === "fandoghi")!;

const processSteps = [
  { n: "1", icon: "🎯" },
  { n: "2", icon: "🎨" },
  { n: "3", icon: "⚙️" },
  { n: "4", icon: "🚀" },
];

const values = [
  { icon: "💡", key: "creativity" },
  { icon: "⚙️", key: "engineering" },
  { icon: "🎨", key: "design" },
  { icon: "🚀", key: "innovation" },
];

const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.1 } },
};
const heroItem = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function Home() {
  const { t } = useI18n();
  const fandoghi = featured;

  return (
    <div className="pt-28">
      {/* ===================== HERO ===================== */}
      <section className="relative pb-10 pt-10 sm:pt-16">
        <div className="container-px grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            className="relative z-10"
            variants={heroContainer}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={heroItem}>
              <span className="eyebrow">
                <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan shadow-[0_0_12px_2px_rgba(0,255,208,0.8)]" />
                {t("hero.kicker")}
              </span>
            </motion.div>

            <h1 className="mt-6 text-4xl font-black leading-[1.2] sm:text-5xl lg:text-6xl">
              <AnimatedText text={t("hero.title.1")} as="span" mode="words" className="-mx-1" delay={0.2} />
              <motion.span
                className="mt-2 block text-gradient-animated"
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {t("hero.title.2")}
              </motion.span>
            </h1>

            <motion.div variants={heroItem}>
              <p className="mt-6 max-w-xl text-base leading-8 text-[var(--muted)] sm:text-lg">{t("hero.sub")}</p>
            </motion.div>

            <motion.div variants={heroItem} className="mt-8 flex flex-wrap items-center gap-4">
              <Magnetic>
                <Link to="/store" className="btn btn-primary" data-cursor-label={t("cursor.view")}>
                  {t("hero.cta.primary")}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
                </Link>
              </Magnetic>
              <Magnetic>
                <Link to="/contact" className="btn btn-ghost">{t("hero.cta.secondary")}</Link>
              </Magnetic>
            </motion.div>

            <motion.div variants={heroItem} className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6">
              {[
                { to: 4, key: "hero.stats.apps" },
                { to: 8, key: "hero.stats.skills" },
                { to: 100, key: "hero.stats.quality", suffix: "%" },
              ].map((s, i) => (
                <div key={i} className="flex flex-col">
                  <Counter to={s.to} suffix={s.suffix ?? ""} className="text-2xl font-black text-white" />
                  <span className="mt-1 text-xs text-white/45">{t(s.key)}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* hero visual */}
          <Reveal delay={0.15} className="relative">
            <Parallax speed={0.09} rotate={1.5}>
              <div className="relative mx-auto flex flex-col items-center">
                <motion.div
                  className="absolute inset-0 -z-10 rounded-full blur-[110px]"
                  style={{ background: "radial-gradient(circle, rgba(124,92,255,0.45), rgba(0,198,255,0.2), transparent 70%)" }}
                  animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
                <MouseParallax strength={9}>
                  <div className="relative z-10 -mb-6 w-28 sm:w-36">
                    <BrandMark size={112} interactive scanline />
                  </div>
                  <PhoneMockup screenshots={fandoghi.screenshots} />
                </MouseParallax>

                {/* floating chips */}
                <motion.div className="absolute -right-2 top-24 hidden sm:block" animate={{ y: [0, -14, 0] }} transition={{ duration: 4.5, repeat: Infinity }}>
                  <div className="glass-strong rounded-2xl px-4 py-2 text-xs font-bold text-white shadow-glass transition-transform duration-300 hover:scale-105 hover:-translate-y-1">
                    <span className="text-neon-cyan">⚡</span> Flutter &amp; Dart
                  </div>
                </motion.div>
                <motion.div className="absolute -left-4 top-1/2 hidden sm:block" animate={{ y: [0, 14, 0] }} transition={{ duration: 5.5, repeat: Infinity }}>
                  <div className="glass-strong rounded-2xl px-4 py-2 text-xs font-bold text-white shadow-glass transition-transform duration-300 hover:scale-105 hover:-translate-y-1">
                    <span className="text-neon-gold">👑</span> Farshad Parsa
                  </div>
                </motion.div>
                <motion.div className="absolute bottom-20 -left-2 hidden sm:block" animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                  <div className="glass-strong rounded-2xl px-4 py-2 text-xs font-bold text-white shadow-glass transition-transform duration-300 hover:scale-105 hover:-translate-y-1">
                    <span className="text-neon-violet">🎯</span> Clean Code
                  </div>
                </motion.div>
              </div>
            </Parallax>
          </Reveal>
        </div>
      </section>

      {/* ===================== MARQUEE ===================== */}
      <section className="relative py-8">
        <Marquee items={["Flutter", "Dart", "Kotlin", "Android", "Java", "Firebase", "UI/UX", "Material 3", "Mobile Games", "Clean Code"]} />
      </section>

      {/* ===================== STUDIO STATEMENT ===================== */}
      <section className="section-shell">
        <div className="container-px grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <span className="eyebrow">{t("home.about.eyebrow")}</span>
            <h2 className="mt-5 text-3xl font-black leading-[1.3] sm:text-4xl lg:text-5xl">
              {t("home.about.title.a")} <span className="text-gradient">{t("home.about.title.b")}</span>{t("home.about.title.c") ? ` ${t("home.about.title.c")}` : ""}
            </h2>
            <p className="mt-5 max-w-xl leading-8 text-white/60">
              {t("home.about.text")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/about" className="btn btn-ghost">{t("home.about.btnAbout")}</Link>
              <Link to="/store" className="btn btn-primary">{t("home.about.btnProducts")}</Link>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((v, i) => (
              <Reveal key={v.key} delay={i * 0.08}>
                <TiltCard className="card p-6">
                  <span className="text-3xl">{v.icon}</span>
                  <h3 className="mt-4 text-lg font-black text-white">{t(`value.${v.key}.title`)}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/55">{t(`value.${v.key}.text`)}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FLAGSHIP APP ===================== */}
      <section className="section-shell relative">
        <div className="pointer-events-none absolute right-0 top-20 h-72 w-72 rounded-full bg-neon-cyan/15 blur-[120px]" />
        <div className="container-px">
          <SectionHeader
            eyebrow={t("home.flag.eyebrow")}
            title={<>{t("home.flag.title.a")} <span className="text-gradient">{t("home.flag.title.b")}</span></>}
            subtitle={t("home.flag.subtitle")}
          />

          <Reveal delay={0.1} className="mt-14">
            <div className="card grid gap-10 p-6 sm:p-10 lg:grid-cols-2 lg:items-center">
              <div className="relative">
                <PhoneMockup screenshots={fandoghi.screenshots} />
              </div>
              <div>
                <div className="flex items-center gap-4">
                  <AppIcon app={fandoghi} size={92} />
                  <div>
                    <h3 className="text-2xl font-black text-white">{t("app.fandoghi.name")}</h3>
                    <div className="mt-2"><StatusBadge status={fandoghi.status} /></div>
                  </div>
                </div>
                <p className="mt-6 leading-8 text-white/65">{t("app.fandoghi.longDescription")}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {fandoghi.features.slice(0, 5).map((_, fi) => (
                    <span key={fi} className="chip">✓ {t(`app.fandoghi.feat.${fi}`)}</span>
                  ))}
                </div>
                <p className="mt-5 text-sm text-white/40">{t("home.flag.note")}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to={`/apps/${fandoghi.slug}`} className="btn btn-primary">{t("app.btnViewProduct")}</Link>
                  <button className="btn btn-ghost" onClick={() => document.getElementById("download")?.scrollIntoView({ behavior: "smooth" })}>
                    {t("app.downloadApk")}
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== STORE PREVIEW ===================== */}
      <section className="section-shell">
        <div className="container-px">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              align="start"
              eyebrow={t("home.store.eyebrow")}
              title={<>{t("home.store.title.a")} <span className="text-gradient">{t("home.store.title.b")}</span></>}
              subtitle={t("home.store.subtitle")}
            />
            <Reveal delay={0.1}>
              <Link to="/store" className="btn btn-ghost shrink-0">{t("home.store.btnAll")}</Link>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {teaserApps.map((app, i) => (
              <StoreCard key={app.slug} app={app} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== DEVELOPMENT PROCESS ===================== */}
      <section className="section-shell relative">
        <div className="pointer-events-none absolute inset-0 grid-bg" />
        <div className="container-px">
          <SectionHeader
            eyebrow={t("home.process.eyebrow")}
            title={<>{t("home.process.title.a")} <span className="text-gradient">{t("home.process.title.b")}</span></>}
            subtitle={t("home.process.subtitle")}
          />

          {/* process visual */}
          <Reveal delay={0.1} className="mt-12">
            <div className="card relative overflow-hidden p-6 sm:p-10">
              <div className="absolute inset-0 opacity-30">
                <svg width="100%" height="100%" viewBox="0 0 800 300" preserveAspectRatio="none" aria-hidden="true">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <circle key={`c${i}`} cx={60 + i * 90} cy={150 + (i % 2 === 0 ? -50 : 50)} r={7} fill="none" stroke="rgba(124,92,255,0.6)" />
                  ))}
                  {Array.from({ length: 7 }).map((_, i) => (
                    <line key={`l${i}`} x1={60 + i * 90} y1={150 + (i % 2 === 0 ? -50 : 50)} x2={150 + i * 90} y2={150 + ((i + 1) % 2 === 0 ? -50 : 50)} stroke="rgba(0,198,255,0.35)" strokeWidth="1.5" />
                  ))}
                </svg>
              </div>
              <div className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                {processSteps.map((s, i) => (
                  <Reveal key={s.n} delay={i * 0.08}>
                    <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-neon-violet/40 hover:bg-white/[0.06]">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6">{s.icon}</span>
                        <span className="text-sm font-black text-white/25">0{s.n}</span>
                      </div>
                      <h3 className="mt-4 font-black text-white">{t(`process.${s.n}.title`)}</h3>
                      <p className="mt-2 text-sm leading-7 text-white/55">{t(`process.${s.n}.text`)}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== DEVELOPER ===================== */}
      <section className="section-shell">
        <div className="container-px grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Reveal>
            <span className="eyebrow">{t("home.dev.eyebrow")}</span>
            <h2 className="mt-5 flex items-center gap-3 text-3xl font-black sm:text-4xl">
              <span>{t("person.name")}</span>
              <img
                src="/assets/logo.png"
                alt="Parsa Apps"
                width={36}
                height={36}
                className="inline-block object-contain drop-shadow-[0_0_12px_rgba(0,198,255,0.45)]"
              />
            </h2>
            <p className="mt-4 text-white/65">
              {t("home.dev.text")}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Android Developer", "Flutter Developer", "UI/UX Designer", "Software Architect"].map((r) => (
                <span key={r} className="chip" dir="ltr">{r}</span>
              ))}
            </div>
            <div className="mt-8 flex gap-3">
              <Link to="/about" className="btn btn-primary">{t("home.dev.btnProfile")}</Link>
              <a href={CONTACT.telegram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">{t("common.telegram")}</a>
            </div>
          </Reveal>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-full bg-neon-violet/10 blur-[60px]" />
            {timeline.map((_, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="relative flex gap-5 pb-8 last:pb-0">
                  <div className="relative flex flex-col items-center">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-neon-violet to-neon-blue text-xs font-black text-white shadow-glow">
                      {i + 1}
                    </span>
                    {i < timeline.length - 1 && <span className="mt-2 w-px flex-1 bg-gradient-to-b from-white/30 to-transparent" />}
                  </div>
                  <div className="glass flex-1 rounded-2xl p-5">
                    <span className="text-xs font-bold text-neon-cyan">{t(`tl.${i + 1}.year`)}</span>
                    <h3 className="mt-1 font-black text-white">{t(`tl.${i + 1}.title`)}</h3>
                    <p className="mt-1 text-sm leading-7 text-white/55">{t(`tl.${i + 1}.text`)}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== SKILLS ===================== */}
      <section className="section-shell">
        <div className="container-px">
          <SectionHeader
            eyebrow={t("home.skills.eyebrow")}
            title={<>{t("home.skills.title.a")} <span className="text-gradient">{t("home.skills.title.b")}</span></>}
            subtitle={t("home.skills.subtitle")}
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map((skill, i) => (
              <Reveal key={skill.name} delay={i * 0.05}>
                <TiltCard className="card p-6" intensity={10}>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{skill.icon}</span>
                    <span className="text-xs font-bold text-neon-cyan">{skill.level}%</span>
                  </div>
                  <h3 className="mt-4 text-lg font-black text-white" dir="ltr">{skill.name}</h3>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-neon-violet to-neon-cyan"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== PROJECTS ===================== */}
      <section className="section-shell">
        <div className="container-px">
          <SectionHeader
            eyebrow={t("home.projects.eyebrow")}
            title={<>{t("home.projects.title.a")} <span className="text-gradient">{t("home.projects.title.b")}</span></>}
            subtitle={t("home.projects.subtitle")}
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.06}>
                <Link to={`/apps/${p.slug}`} className="card group block h-full overflow-hidden">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <MediaReveal
                      src={p.image}
                      alt={p.title}
                      className="absolute inset-0"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute right-4 top-4 chip !border-white/20 !bg-black/40">{t(p.status === "development" ? "status.development" : "status.released")}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-black text-white">{t(`app.${p.slug}.name`)}</h3>
                    <p className="mt-2 text-sm leading-7 text-white/55">{t(`app.${p.slug}.description`)}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.technologies.slice(0, 3).map((tech) => (
                        <span key={tech} className="chip">{tech}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="section-shell">
        <div className="container-px">
          <Reveal>
            <div className="card relative overflow-hidden p-8 text-center sm:p-14">
              <div className="absolute inset-0 grid-bg" />
              <motion.img
                src="/assets/logo.png"
                alt="Parsa Apps"
                width={96}
                height={96}
                className="relative mx-auto mb-6 drop-shadow-[0_0_30px_rgba(0,198,255,0.45)] animate-float object-contain"
              />
              <h2 className="relative text-3xl font-black sm:text-4xl">
                {t("home.cta.title")}
              </h2>
              <p className="relative mx-auto mt-4 max-w-xl leading-8 text-white/60">
                {t("home.cta.text")}
              </p>
              <div className="relative mt-8 flex flex-wrap justify-center gap-4">
                <Link to="/contact" className="btn btn-primary">{t("home.cta.btnContact")}</Link>
                <Link to="/store" className="btn btn-ghost">{t("home.about.btnProducts")}</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
