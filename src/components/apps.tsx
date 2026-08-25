import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { StudioApp } from "@/lib/data";
import { TiltCard } from "./ui";

export function StatusBadge({ status }: { status: StudioApp["status"] }) {
  const map = {
    released: { label: "منتشر شده", color: "#00ffd0" },
    beta: { label: "نسخه آزمایشی", color: "#00c6ff" },
    development: { label: "در حال توسعه", color: "#f5c857" },
  } as const;
  const s = map[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold"
      style={{ color: s.color, borderColor: `${s.color}55`, background: `${s.color}14` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color, boxShadow: `0 0 10px 1px ${s.color}` }} />
      {s.label}
    </span>
  );
}

export function AppIcon({ app, size = 72 }: { app: StudioApp; size?: number }) {
  return (
    <span
      className="relative grid shrink-0 place-items-center overflow-hidden rounded-[22%] shadow-lg"
      style={{ width: size, height: size, background: `linear-gradient(145deg, ${app.palette.from}44, ${app.palette.to}33)` }}
    >
      <span
        className="absolute inset-0 opacity-40"
        style={{ background: `radial-gradient(circle at 30% 20%, ${app.palette.from}, transparent 70%)` }}
      />
      <img
        src={app.icon}
        alt={`آیکون ${app.name}`}
        width={size}
        height={size}
        loading="lazy"
        className="relative h-[78%] w-[78%] object-contain drop-shadow-lg"
      />
    </span>
  );
}

export function StoreCard({ app, index = 0 }: { app: StudioApp; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <TiltCard className="card group h-full p-5">
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
          style={{ background: app.palette.from }}
        />
        <div className="relative flex flex-col gap-5 sm:flex-row">
          <AppIcon app={app} size={84} />
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-white">{app.name}</h3>
                <p className="text-[11px] font-semibold text-white/40" dir="ltr">{app.nameEn}</p>
              </div>
              <StatusBadge status={app.status} />
            </div>
            <p className="mt-2 text-sm leading-7 text-white/60">{app.description}</p>
          </div>
        </div>

        <div className="relative mt-5 flex flex-wrap gap-2">
          {app.technology.slice(0, 4).map((tech) => (
            <span key={tech} className="chip">{tech}</span>
          ))}
        </div>

        <div className="relative mt-5 flex flex-wrap items-center gap-3 pt-4">
          <Link to={`/apps/${app.slug}`} className="btn btn-primary !px-5 !py-2.5 !text-xs">
            مشاهده صفحه محصول
          </Link>
          <button
            className="btn btn-ghost !px-5 !py-2.5 !text-xs"
            onClick={() => document.getElementById("download")?.scrollIntoView({ behavior: "smooth" })}
          >
            دانلود
          </button>
          <span className="ms-auto text-xs text-white/40">نسخه {app.version}</span>
        </div>
      </TiltCard>
    </motion.div>
  );
}

export function PhoneMockup({ screenshots }: { screenshots: string[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="relative mx-auto w-[280px] sm:w-[300px]" style={{ filter: `drop-shadow(0 40px 80px rgba(0,0,0,0.55))` }}>
      <div className="relative aspect-[9/19] overflow-hidden rounded-[2.8rem] border-[6px] border-[#0b0e1c] bg-black shadow-[0_0_0_1px_rgba(255,255,255,0.08),inset_0_0_30px_rgba(0,0,0,0.6)]">
        {/* status bar / island */}
        <div className="absolute left-1/2 top-2.5 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-black/90 ring-1 ring-white/10" />
        <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black/70 to-transparent" />
        {screenshots.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`اسکرین‌شات برنامه ${i + 1}`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-all duration-700"
            style={{ opacity: i === active ? 1 : 0, transform: i === active ? "scale(1)" : "scale(1.06)" }}
          />
        ))}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      <div className="mt-5 flex items-center justify-center gap-2">
        {screenshots.map((_, i) => (
          <button
            key={i}
            aria-label={`نمایش اسکرین‌شات ${i + 1}`}
            onClick={() => setActive(i)}
            className="h-1.5 rounded-full transition-all duration-400"
            style={{
              width: i === active ? 30 : 8,
              background: i === active ? "linear-gradient(90deg,#7c5cff,#00c6ff)" : "rgba(255,255,255,0.25)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function FeatureItem({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="card flex items-start gap-4 p-5 transition-transform duration-300 hover:-translate-y-1">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-white/10 to-white/5 text-2xl ring-1 ring-white/10">
        {icon}
      </span>
      <div>
        <h4 className="font-black text-white">{title}</h4>
        <p className="mt-1 text-sm leading-7 text-white/55">{text}</p>
      </div>
    </div>
  );
}
