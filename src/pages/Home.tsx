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
  { n: "01", icon: "🎯", title: "تحلیل دقیق", text: "تحلیل عمیق نیاز کاربر و ساختاردهی دقیق محصول پیش از شروع توسعه." },
  { n: "02", icon: "🎨", title: "طراحی داده‌محور", text: "تجربه کاربری مدرن و راست‌چین فارسی بر پایه داده و الگوهای روز دنیا." },
  { n: "03", icon: "⚙️", title: "مهندسی تمیز", text: "کدنویسی سریع‌تر و تمیزتر با بازبینی دقیق و تست خودکار کد." },
  { n: "04", icon: "🚀", title: "انتشار و بهبود", text: "پایش کاربران و به‌روزرسانی منظم برای تجربه‌ای همیشه بهتر." },
];

const values = [
  { icon: "💡", title: "خلاقیت", text: "ایده‌های نو برای دنیای دیجیتال" },
  { icon: "⚙️", title: "مهندسی دقیق", text: "کدنویسی تمیز، تست و استانداردهای کیفیت" },
  { icon: "🎨", title: "طراحی", text: "ساخت تجربه‌های زیبا و کاربردی" },
  { icon: "🚀", title: "نوآوری", text: "به‌کارگیری فناوری‌های روز دنیا" },
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
                <Link to="/store" className="btn btn-primary" data-cursor-label="مشاهده">
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
                { to: 4, label: "اپلیکیشن" },
                { to: 8, label: "مهارت تخصصی" },
                { to: 100, label: "تعهد کیفیت", suffix: "%" },
              ].map((s, i) => (
                <div key={i} className="flex flex-col">
                  <Counter to={s.to} suffix={s.suffix ?? ""} className="text-2xl font-black text-white" />
                  <span className="mt-1 text-xs text-white/45">{s.label}</span>
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
            <span className="eyebrow">درباره استودیو</span>
            <h2 className="mt-5 text-3xl font-black leading-[1.3] sm:text-4xl lg:text-5xl">
              پارسا اپس یک <span className="text-gradient">برند جدی نرم‌افزار</span> است
            </h2>
            <p className="mt-5 max-w-xl leading-8 text-white/60">
              ما فقط برنامه نمی‌سازیم؛ تجربه‌های دیجیتال باکیفیت خلق می‌کنیم. از مهندسی دقیق و طراحی مدرن
              تا استانداردهای روز دنیا، هر محصول نشانه‌ای از تعهد ما به کیفیت است.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/about" className="btn btn-ghost">درباره فرشاد پارسا</Link>
              <Link to="/store" className="btn btn-primary">مشاهده محصولات</Link>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <TiltCard className="card p-6">
                  <span className="text-3xl">{v.icon}</span>
                  <h3 className="mt-4 text-lg font-black text-white">{v.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/55">{v.text}</p>
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
            eyebrow="☀️ محصول پرچم‌دار"
            title={<>جزیره فندقی، <span className="text-gradient">دنیای یادگیری کودکان</span></>}
            subtitle="دنیایی شاد، امن و آموزشی برای کودکان ۳ تا ۹ سال؛ جایی که بازی و یادگیری به هم می‌رسند."
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
                    <h3 className="text-2xl font-black text-white">جزیره فندقی</h3>
                    <div className="mt-2"><StatusBadge status={fandoghi.status} /></div>
                  </div>
                </div>
                <p className="mt-6 leading-8 text-white/65">{fandoghi.longDescription}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {fandoghi.features.slice(0, 5).map((f) => (
                    <span key={f} className="chip">✓ {f}</span>
                  ))}
                </div>
                <p className="mt-5 text-sm text-white/40">با Flutter، Dart و Firebase — طراحی‌شده برای آرامش والدین و شادی کودکان.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to={`/apps/${fandoghi.slug}`} className="btn btn-primary">مشاهده صفحه محصول</Link>
                  <button className="btn btn-ghost" onClick={() => document.getElementById("download")?.scrollIntoView({ behavior: "smooth" })}>
                    دانلود APK
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
              eyebrow="📱 پارسا استور"
              title={<>هر محصول، <span className="text-gradient">یک تجربه کامل</span></>}
              subtitle="میکرواستور رسمی اپلیکیشن‌های پارسا اپس — هر اپ با صفحه محصول، گالری و دانلود اختصاصی."
            />
            <Reveal delay={0.1}>
              <Link to="/store" className="btn btn-ghost shrink-0">همه اپلیکیشن‌ها ←</Link>
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
            eyebrow="⚡ فرآیند توسعه محصول"
            title={<>از ایده تا انتشار، <span className="text-gradient">قدم به قدم</span></>}
            subtitle="در پارسا اپس، هر محصول از تحلیل نیاز تا انتشار و بهبود، در یک مسیر مهندسی‌شده و دقیق ساخته می‌شود."
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
                        <span className="text-sm font-black text-white/25">{s.n}</span>
                      </div>
                      <h3 className="mt-4 font-black text-white">{s.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-white/55">{s.text}</p>
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
            <span className="eyebrow">👨‍💻 توسعه‌دهنده</span>
            <h2 className="mt-5 flex items-center gap-3 text-3xl font-black sm:text-4xl">
              <span>فرشاد پارسا</span>
              <img
                src="/assets/logo.png"
                alt="پارسا اپس"
                width={36}
                height={36}
                className="inline-block object-contain drop-shadow-[0_0_12px_rgba(0,198,255,0.45)]"
              />
            </h2>
            <p className="mt-4 text-white/65">
              بنیان‌گذار و برنامه‌نویس ارشد پارسا اپس — توسعه‌دهنده اندروید و فلاتر و طراح UI/UX.
              هر خط کد با تست، بازبینی و عشق به جزئیات نوشته می‌شود.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Android Developer", "Flutter Developer", "UI/UX Designer", "Software Architect"].map((r) => (
                <span key={r} className="chip" dir="ltr">{r}</span>
              ))}
            </div>
            <div className="mt-8 flex gap-3">
              <Link to="/about" className="btn btn-primary">پروفایل کامل</Link>
              <a href={CONTACT.telegram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">تلگرام</a>
            </div>
          </Reveal>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-full bg-neon-violet/10 blur-[60px]" />
            {timeline.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="relative flex gap-5 pb-8 last:pb-0">
                  <div className="relative flex flex-col items-center">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-neon-violet to-neon-blue text-xs font-black text-white shadow-glow">
                      {i + 1}
                    </span>
                    {i < timeline.length - 1 && <span className="mt-2 w-px flex-1 bg-gradient-to-b from-white/30 to-transparent" />}
                  </div>
                  <div className="glass flex-1 rounded-2xl p-5">
                    <span className="text-xs font-bold text-neon-cyan">{item.year}</span>
                    <h3 className="mt-1 font-black text-white">{item.title}</h3>
                    <p className="mt-1 text-sm leading-7 text-white/55">{item.text}</p>
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
            eyebrow="🧩 تخصص‌ها"
            title={<>ابزارهایی که <span className="text-gradient">ایده را واقعی می‌کنند</span></>}
            subtitle="مهارت‌های فنی و طراحی پشت هر محصول پارسا اپس."
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
            eyebrow="🗂️ پروژه‌ها"
            title={<>تاریخچه‌ای از <span className="text-gradient">محصولات واقعی</span></>}
            subtitle="هر پروژه یک تجربه یادگیری است که به محصولی برای کاربران تبدیل شده است."
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
                    <span className="absolute right-4 top-4 chip !border-white/20 !bg-black/40">{p.status}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-black text-white">{p.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-white/55">{p.description}</p>
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
                آیا ایده‌ای برای محصول بعدی دارید؟
              </h2>
              <p className="relative mx-auto mt-4 max-w-xl leading-8 text-white/60">
                از طراحی تا انتشار، کنار شما هستیم. پیام شما مستقیم به مدیر و توسعه‌دهنده ارشد می‌رسد.
              </p>
              <div className="relative mt-8 flex flex-wrap justify-center gap-4">
                <Link to="/contact" className="btn btn-primary">ارتباط با ما</Link>
                <Link to="/store" className="btn btn-ghost">مشاهده محصولات</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
