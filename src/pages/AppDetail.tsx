import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getApp, CONTACT } from "@/lib/data";
import { Reveal, SectionHeader } from "@/components/ui";
import { AppIcon, FeatureItem, PhoneMockup, StatusBadge } from "@/components/apps";
import NotFound from "./NotFound";

export default function AppDetail() {
  const { slug } = useParams();
  const app = getApp(slug ?? "");
  const [notified, setNotified] = useState(false);

  if (!app) return <NotFound />;

  const isReleased = app.status === "released";

  const handleDownload = () => {
    if (!isReleased) {
      setNotified(true);
      window.setTimeout(() => setNotified(false), 3200);
      return;
    }
    window.open("#", "_blank");
  };

  return (
    <div className="pt-28">
      {/* hero */}
      <section className="section-shell pb-10">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-40"
          style={{ background: `radial-gradient(circle at 80% 20%, ${app.palette.from}66, transparent 65%), radial-gradient(circle at 15% 40%, ${app.palette.to}44, transparent 60%)` }}
        />
        <div className="container-px relative">
          <Link to="/store" className="mb-8 inline-flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-white">
            ← بازگشت به استور
          </Link>

          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <Reveal>
              <div className="flex items-center gap-5">
                <AppIcon app={app} size={104} />
                <div>
                  <div className="mb-2"><StatusBadge status={app.status} /></div>
                  <h1 className="text-3xl font-black text-white sm:text-4xl">{app.name}</h1>
                  <p className="mt-1 text-sm text-white/45" dir="ltr">{app.nameEn}</p>
                </div>
              </div>

              <p className="mt-7 text-lg font-bold leading-8 text-white">{app.tagline}</p>
              <p className="mt-3 leading-8 text-white/60">{app.longDescription}</p>

              <div className="mt-6 grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { l: "نسخه", v: app.version },
                  { l: "حجم", v: app.size },
                  { l: "اندروید", v: app.androidMin },
                  { l: "دسته", v: app.category },
                ].map((d) => (
                  <div key={d.l} className="glass rounded-2xl p-3 text-center">
                    <p className="text-[11px] text-white/45">{d.l}</p>
                    <p className="mt-1 text-sm font-black text-white">{d.v}</p>
                  </div>
                ))}
              </div>

              <div className="relative mt-8 flex flex-wrap items-center gap-4">
                <button onClick={handleDownload} className="btn btn-primary">
                  {isReleased ? "دانلود APK" : "⬇️ دانلود — به‌زودی"}
                </button>
                <a href={CONTACT.telegram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                  پشتیبانی در تلگرام
                </a>
                <AnimatePresenceToast show={notified} />
              </div>
            </Reveal>

            <Reveal delay={0.14} className="flex justify-center">
              {app.screenshots.length > 0 ? (
                <PhoneMockup screenshots={app.screenshots} />
              ) : (
                <div className="relative">
                  <div className="absolute inset-0 -z-10 rounded-full blur-[100px]" style={{ background: app.palette.from }} />
                  <img src={app.cover} alt={app.name} className="w-72 rounded-[2rem] object-cover shadow-2xl sm:w-80" />
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* features */}
      <section className="section-shell pt-4">
        <div className="container-px">
          <SectionHeader eyebrow="⚡ امکانات" title={<>چه چیزی <span className="text-gradient">این اپ را خاص می‌کند؟</span></>} />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {app.features.map((f, i) => (
              <Reveal key={f} delay={i * 0.05}>
                <FeatureItem icon="✦" title={f} text="تجربه‌ای ساده، روان و لذت‌بخش برای کاربر." />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* screenshots gallery */}
      {app.screenshots.length > 0 && (
        <section className="section-shell">
          <div className="container-px">
            <SectionHeader
              eyebrow="🖼️ گالری"
              title={<>نگاهی به <span className="text-gradient">دنیای {app.name}</span></>}
              subtitle="گلچینی از اسکرین‌شات‌های واقعی تجربه کاربری برنامه."
            />
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {app.screenshots.map((src, i) => (
                <Reveal key={src} delay={i * 0.06}>
                  <motion.img
                    src={src}
                    alt={`${app.name} اسکرین‌شات ${i + 1}`}
                    loading="lazy"
                    className="aspect-[9/16] w-full rounded-3xl object-cover ring-1 ring-white/10 shadow-lg"
                    whileHover={{ y: -8, scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* benefits */}
      {app.educationalBenefits.length > 0 && (
        <section className="section-shell">
          <div className="container-px">
            <div className="card grid gap-8 p-8 sm:p-10 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="eyebrow">🌱 مزایای آموزشی</span>
                <h2 className="mt-5 text-3xl font-black">بیش از یک بازی؛ یک مسیر یادگیری</h2>
                <p className="mt-4 leading-8 text-white/60">
                  طراحی‌شده با درک عمیق از رشد کودک تا یادگیری با بازی، طبیعی و لذت‌بخش باشد.
                </p>
              </div>
              <div className="space-y-4">
                {app.educationalBenefits.map((b) => (
                  <div key={b} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <span className="grid h-9 w-9 place-items-center rounded-xl text-neon-cyan" style={{ background: `${app.palette.accent}22` }}>
                      ✓
                    </span>
                    <p className="font-bold text-white">{b}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* tech */}
      <section className="section-shell">
        <div className="container-px">
          <SectionHeader eyebrow="🛠️ تکنولوژی" title={<>ساخته‌شده با <span className="text-gradient">تکنولوژی‌های مدرن</span></>} />
          <Reveal className="mt-10 flex flex-wrap justify-center gap-3">
            {app.technology.map((tech) => (
              <span key={tech} className="chip !px-6 !py-3 !text-base" dir="ltr">{tech}</span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* video */}
      {app.video && (
        <section className="section-shell">
          <div className="container-px">
            <SectionHeader eyebrow="🎬 تریلر" title={<>ویدئوی معرفی <span className="text-gradient">{app.name}</span></>} />
            <Reveal className="mt-10">
              <div className="card overflow-hidden p-2">
                <video
                  className="aspect-[9/16] w-full rounded-2xl object-cover sm:mx-auto sm:max-w-sm"
                  poster={app.cover}
                  controls
                  playsInline
                  preload="metadata"
                >
                  <source src={app.video} type="video/mp4" />
                  مرورگر شما از پخش ویدئو پشتیبانی نمی‌کند.
                </video>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* download */}
      <section className="section-shell" id="download">
        <div className="container-px">
          <Reveal>
            <div className="card relative overflow-hidden p-8 text-center sm:p-12">
              <div
                className="absolute inset-0 opacity-30"
                style={{ background: `radial-gradient(circle at 50% 20%, ${app.palette.from}, transparent 70%)` }}
              />
              <div className="relative">
                <AppIcon app={app} size={88} />
                <h2 className="mt-6 text-2xl font-black sm:text-3xl">{app.name} را دانلود کنید</h2>
                <p className="mx-auto mt-3 max-w-xl leading-8 text-white/60">
                  {isReleased
                    ? "نسخه نهایی برنامه را مستقیماً نصب کنید."
                    : "این محصول در حال توسعه است؛ پس از انتشار رسمی، لینک دانلود اینجا قرار می‌گیرد."}
                </p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <button onClick={handleDownload} className="btn btn-primary">
                    {isReleased ? "⬇️ دانلود APK" : "⬇️ دانلود — به‌زودی"}
                  </button>
                  <Link to="/store" className="btn btn-ghost">مشاهده بقیه محصولات</Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

function AnimatePresenceToast({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-full border border-neon-gold/40 bg-neon-gold/10 px-4 py-2 text-sm font-bold text-neon-gold"
    >
      🌰 به‌زودی منتشر می‌شود!
    </motion.span>
  );
}
