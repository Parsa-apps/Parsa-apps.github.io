import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getApp, CONTACT } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { Reveal, SectionHeader } from "@/components/ui";
import { AppIcon, FeatureItem, PhoneMockup, StatusBadge } from "@/components/apps";
import NotFound from "./NotFound";

export default function AppDetail() {
  const { slug } = useParams();
  const app = getApp(slug ?? "");
  const { t } = useI18n();
  const [notified, setNotified] = useState(false);
  const [selectedShot, setSelectedShot] = useState<string | null>(null);

  if (!app) return <NotFound />;

  const appKey = `app.${app.slug}`;
  const isReleased = app.status === "released";
  const isDev = app.status === "development";

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
            {t("app.backToStore")}
          </Link>

          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <Reveal>
              <div className="flex items-center gap-5">
                <AppIcon app={app} size={104} />
                <div>
                  <div className="mb-2"><StatusBadge status={app.status} /></div>
                  <h1 className="text-3xl font-black text-white sm:text-4xl" style={{ fontFamily: "Vazirmatn", fontWeight: 900 }}>{t(`${appKey}.name`)}</h1>
                  <p className="mt-1 text-sm text-white/45" dir="ltr">{app.nameEn}</p>
                </div>
              </div>

              <p className="mt-7 text-lg font-bold leading-8 text-white" style={{ fontFamily: "Vazirmatn" }}>{t(`${appKey}.tagline`)}</p>
              <p className="mt-3 leading-8 text-white/60" style={{ fontFamily: "Vazirmatn" }}>{t(`${appKey}.longDescription`)}</p>

              <div className="mt-6 grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { lKey: "app.meta.version", v: t(`${appKey}.version`), hint: isDev ? t("app.meta.hintDevVersion") : undefined },
                  { lKey: "app.meta.size", v: t(`${appKey}.size`), hint: isDev ? t("app.meta.hintDevSize") : undefined },
                  { lKey: "app.meta.android", v: app.androidMin },
                  { lKey: "app.meta.category", v: t(app.category) },
                ].map((d) => (
                  <div key={d.lKey} className="glass rounded-2xl p-3 text-center transition-all duration-300 hover:border-white/20">
                    <p className="text-[11px] text-white/45" style={{ fontFamily: "Vazirmatn" }}>{t(d.lKey)}</p>
                    <p className="mt-1 text-sm font-black text-white" style={{ fontFamily: "Vazirmatn", fontWeight: 800 }}>{d.v}</p>
                    {d.hint && <p className="mt-1 text-[10px] text-white/35">{d.hint}</p>}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-white/40">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                <span style={{ fontFamily: "Vazirmatn" }}>
                  {isDev ? t("app.devNotice") : `${t("app.updatedPrefix")} ${t(`${appKey}.updated`)}`}
                </span>
              </div>

              <div className="relative mt-8 flex flex-wrap items-center gap-4">
                <button onClick={handleDownload} className="btn btn-primary">
                  {isReleased ? t("app.downloadApk") : t("app.btnDownloadSoon")}
                </button>
                <a href={CONTACT.telegram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                  {t("app.supportTelegram")}
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
                  <div className="aspect-[4/5] w-72 overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-white/10 sm:w-80">
                    <img src={app.cover} alt={t(`${appKey}.name`)} className="h-full w-full object-cover" loading="eager" />
                  </div>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      {/* features */}
      <section className="section-shell pt-4">
        <div className="container-px">
          <SectionHeader eyebrow={t("app.features.eyebrow")} title={<>{t("app.features.title.a")} <span className="text-gradient">{t("app.features.title.b")}</span></>} />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {app.features.map((_, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <FeatureItem icon="✦" title={t(`${appKey}.feat.${i}`)} text={t("app.features.itemText")} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* screenshots gallery — FIXED: robust, no clipPath that hides on mobile */}
      {app.screenshots.length > 0 && (
        <section className="section-shell">
          <div className="container-px">
            <SectionHeader
              eyebrow={t("app.gallery.eyebrow")}
              title={<>{t("app.gallery.title.a")} <span className="text-gradient">{t("app.gallery.title.b")} {t(`${appKey}.name`)}</span></>}
              subtitle={t("app.gallery.subtitle")}
            />
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {app.screenshots.map((src, i) => (
                <Reveal key={src} delay={i * 0.05}>
                  <button
                    onClick={() => setSelectedShot(src)}
                    className="group relative block w-full overflow-hidden rounded-3xl bg-[#0e1020] ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:ring-white/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    style={{ aspectRatio: "9/16" }}
                  >
                    {/* subtle gradient placeholder while image loads */}
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10" />
                    <img
                      src={src}
                      alt={`${t(`${appKey}.name`)} · ${t("app.gallery.shot")} ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="relative h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.style.display = "none";
                        const parent = img.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="grid h-full w-full place-items-center p-4 text-center text-xs text-white/30">${t("app.gallery.fallback")}</div>`;
                        }
                      }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    <span className="pointer-events-none absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-1 text-[10px] font-bold text-white/70 backdrop-blur">
                      {i + 1} / {app.screenshots.length}
                    </span>
                  </button>
                </Reveal>
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-white/30" style={{ fontFamily: "Vazirmatn" }}>
              {t("app.gallery.hint")}
            </p>
          </div>
        </section>
      )}

      {/* lightbox */}
      {selectedShot && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/85 p-4 backdrop-blur-md" onClick={() => setSelectedShot(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            className="relative max-h-[90vh] w-full max-w-sm overflow-hidden rounded-3xl bg-[#0e1020] shadow-2xl ring-1 ring-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={selectedShot} alt={t("app.gallery.shot")} className="h-full w-full object-contain" />
            <button onClick={() => setSelectedShot(null)} className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white backdrop-blur hover:bg-black/80">
              ✕
            </button>
          </motion.div>
        </div>
      )}

      {/* benefits */}
      {app.educationalBenefits.length > 0 && (
        <section className="section-shell">
          <div className="container-px">
            <div className="card grid gap-8 p-8 sm:p-10 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="eyebrow">{t("app.benefits.eyebrow")}</span>
                <h2 className="mt-5 text-3xl font-black" style={{ fontFamily: "Vazirmatn", fontWeight: 900 }}>{t("app.benefits.title")}</h2>
                <p className="mt-4 leading-8 text-white/60" style={{ fontFamily: "Vazirmatn" }}>
                  {t("app.benefits.text")}
                </p>
              </div>
              <div className="space-y-4">
                {app.educationalBenefits.map((_, i) => (
                  <div key={i} className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.06]">
                    <motion.span
                      whileHover={{ rotate: 12, scale: 1.12 }}
                      transition={{ type: "spring", stiffness: 280, damping: 18 }}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-neon-cyan"
                      style={{ background: `${app.palette.accent}22` }}
                    >
                      ✓
                    </motion.span>
                    <p className="font-bold text-white" style={{ fontFamily: "Vazirmatn" }}>{t(`${appKey}.benefit.${i}`)}</p>
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
          <SectionHeader eyebrow={t("app.tech.eyebrow")} title={<>{t("app.tech.title.a")} <span className="text-gradient">{t("app.tech.title.b")}</span></>} />
          <Reveal className="mt-10 flex flex-wrap justify-center gap-3">
            {app.technology.map((tech) => (
              <span key={tech} className="chip !px-6 !py-3 !text-base" dir="ltr">{tech}</span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* video */}
      {((app.videos && app.videos.length > 0) || app.video) && (
        <section className="section-shell">
          <div className="container-px">
            <SectionHeader
              eyebrow={t("app.videos.eyebrow")}
              title={<>{t("app.videos.title.a")} <span className="text-gradient">{t(`${appKey}.name`)}</span></>}
              subtitle={t("app.videos.subtitle")}
            />
            <div className="mx-auto mt-12 flex max-w-3xl flex-col gap-10">
              {(app.videos && app.videos.length > 0
                ? app.videos
                : [{ title: t(`${appKey}.name`), src: app.video!, poster: app.cover }]
              ).map((v, i) => (
                <Reveal key={v.src} delay={i * 0.12}>
                  <div className="card overflow-hidden p-5 sm:p-7">
                    <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <span className="grid h-8 w-8 place-items-center rounded-xl bg-neon-cyan/20 text-xs font-black text-neon-cyan">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-lg font-black text-white" style={{ fontFamily: "Vazirmatn" }}>{app.videos ? t(`${appKey}.video${i + 1}.title`) : v.title}</h3>
                      </div>
                      {v.subtitle && <p className="text-xs text-white/50" style={{ fontFamily: "Vazirmatn" }}>{app.videos ? t(`${appKey}.video${i + 1}.subtitle`) : v.subtitle}</p>}
                    </div>
                    <div className="overflow-hidden rounded-2xl bg-black/80 shadow-2xl ring-1 ring-white/10">
                      <video
                        className="mx-auto max-h-[540px] w-full rounded-2xl object-contain"
                        poster={v.poster ?? app.cover}
                        controls
                        playsInline
                        preload="metadata"
                      >
                        <source src={v.src} type="video/mp4" />
                        {t("app.videos.fallback")}
                      </video>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
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
                <h2 className="mt-6 text-2xl font-black sm:text-3xl" style={{ fontFamily: "Vazirmatn", fontWeight: 900 }}>{t("app.download.titleBefore")}{t(`${appKey}.name`)}{t("app.download.titleAfter")}</h2>
                <p className="mx-auto mt-3 max-w-xl leading-8 text-white/60" style={{ fontFamily: "Vazirmatn" }}>
                  {isReleased
                    ? t("app.download.text.ready")
                    : t("app.download.text.soon")}
                </p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <button onClick={handleDownload} className="btn btn-primary">
                    {isReleased ? t("app.downloadApk") : t("app.btnDownloadSoon")}
                  </button>
                  <Link to="/store" className="btn btn-ghost">{t("app.download.btnMore")}</Link>
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
  const { t } = useI18n();
  if (!show) return null;
  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-full border border-neon-gold/40 bg-neon-gold/10 px-4 py-2 text-sm font-bold text-neon-gold"
      style={{ fontFamily: "Vazirmatn" }}
    >
      {t("app.toast.soon")}
    </motion.span>
  );
}
