import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { skills, timeline, CONTACT } from "@/lib/data";
import { AnimatedText, Parallax, Reveal, SectionHeader, TiltCard, Marquee } from "@/components/ui";

const roles = [
  { icon: "🤖", title: "Android Developer", text: "توسعه اپلیکیشن‌های اندرویدی سبک، سریع و بهینه." },
  { icon: "💠", title: "Flutter Developer", text: "تجربه‌های یکپارچه و مدرن با فلاتر و دارت." },
  { icon: "🎨", title: "UI/UX Designer", text: "طراحی رابط و تجربه کاربری فارسی و راست‌چین." },
  { icon: "🏗️", title: "Software Architect", text: "طراحی معماری دقیق و مقیاس‌پذیر برای محصولات پایدار." },
];

export default function About() {
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
                  alt="لوگوی پارسا اپس"
                  width={120}
                  height={120}
                  className="drop-shadow-[0_0_35px_rgba(0,198,255,0.45)] object-contain"
                  initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </Parallax>
            </div>
            <span className="eyebrow">👨‍💻 درباره توسعه‌دهنده و استودیو</span>
            <h1 className="mt-4 flex items-center justify-center gap-4 text-4xl font-black sm:text-5xl">
              <AnimatedText text="فرشاد پارسا" mode="chars" as="span" stagger={0.05} />
            </h1>
            <p className="mx-auto mt-5 max-w-2xl leading-8 text-white/60">
              بنیان‌گذار و برنامه‌نویس ارشد پارسا اپس. من با سخت‌گیری مهندسی، کدنویسی تمیز و تمرکز روی جزئیات،
              محصولات دیجیتال می‌سازم. هر خط کد با تست و بازبینی، هر صفحه با استانداردهای تجربه کاربری فارسی و
              RTL، و هر انتشار با رعایت اصول امنیت و کیفیت انجام می‌شود؛ چون اینجا یک پروژه معمولی نیست — یک برند حرفه‌ای است.
            </p>
          </Reveal>

          <Reveal delay={0.12} className="mt-10">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {roles.map((r) => (
                <TiltCard key={r.title} className="card p-6">
                  <span className="text-3xl">{r.icon}</span>
                  <h2 className="mt-4 text-base font-black text-white" dir="ltr">{r.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-white/55">{r.text}</p>
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
              eyebrow="🎯 ماموریت"
              title={<>ساخت فناوری که <span className="text-gradient">زندگی را ساده‌تر و شادتر می‌کند</span></>}
              subtitle="هدف من ساخت محصولاتی است که فقط یک نرم‌افزار نباشند؛ بلکه تجربه‌ای جذاب، ساده و ماندگار برای کاربر ایجاد کنند — از کوچک‌ترین کاربران تا خانواده‌ها."
            />
          </Reveal>
          <Reveal delay={0.12}>
            <div className="grid gap-4">
              {[
                "توسعه با استانداردهای مهندسی نرم‌افزار و کدنویسی تمیز",
                "تمرکز کامل روی تجربه کاربری فارسی و RTL",
                "طراحی امن و خانواده‌محور برای کودکان",
                "بدون کتابخانه‌های سنگین — سریع، سبک و بهینه",
                "پشتیبانی واقعی و پاسخ سریع به کاربران",
                "به‌روزرسانی منظم و برنامه توسعه شفاف",
              ].map((item) => (
                <div key={item} className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-neon-violet/40 hover:bg-white/[0.06]">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-neon-violet/20 text-neon-violet transition-transform duration-300 group-hover:rotate-[14deg] group-hover:scale-110">✓</span>
                  <p className="font-bold text-white/85">{item}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* timeline */}
      <section className="section-shell">
        <div className="container-px">
          <SectionHeader eyebrow="🛤️ مسیر من" title={<>از یک ایده تا <span className="text-gradient">استودیوی پارسا اپس</span></>} />
          <div className="mx-auto mt-14 max-w-3xl">
            {timeline.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="relative flex gap-6 pb-10 last:pb-0">
                  <div className="flex flex-col items-center">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-neon-violet to-neon-blue text-sm font-black text-white shadow-glow">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {i < timeline.length - 1 && <span className="mt-3 w-px flex-1 bg-gradient-to-b from-neon-violet/50 to-transparent" />}
                  </div>
                  <div className="glass flex-1 rounded-2xl p-6">
                    <span className="text-xs font-bold text-neon-cyan">{item.year}</span>
                    <h3 className="mt-1 text-xl font-black text-white">{item.title}</h3>
                    <p className="mt-2 leading-7 text-white/60">{item.text}</p>
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
          <SectionHeader eyebrow="🧩 مهارت‌ها" title={<>ابزار و <span className="text-gradient">تکنولوژی</span></>} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map((skill, i) => (
              <Reveal key={skill.name} delay={i * 0.05}>
                <TiltCard className="card p-6" intensity={10}>
                  <span className="text-3xl">{skill.icon}</span>
                  <h3 className="mt-4 text-lg font-black text-white" dir="ltr">{skill.name}</h3>
                  <div className="mt-4 flex items-center justify-between text-xs text-white/45">
                    <span>{skill.year}</span>
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
              <h2 className="relative text-3xl font-black">بیایید با هم بسازیم</h2>
              <p className="relative mx-auto mt-4 max-w-xl leading-8 text-white/60">
                سوال، پیشنهاد یا ایده همکاری دارید؟ پیام شما مستقیم به من می‌رسد.
              </p>
              <div className="relative mt-8 flex flex-wrap justify-center gap-4">
                <Link to="/contact" className="btn btn-primary">ارتباط مستقیم</Link>
                <a href={CONTACT.telegram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">تلگرام {CONTACT.telegramHandle}</a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
