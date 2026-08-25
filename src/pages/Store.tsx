import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { apps } from "@/lib/data";
import { Reveal, SectionHeader } from "@/components/ui";
import { StoreCard } from "@/components/apps";

const categories = ["همه", ...Array.from(new Set(apps.map((a) => a.category)))];

export default function Store() {
  const [cat, setCat] = useState("همه");

  const filtered = useMemo(() => (cat === "همه" ? apps : apps.filter((a) => a.category === cat)), [cat]);

  return (
    <div className="pt-28">
      <section className="section-shell pb-6">
        <div className="container-px">
          <SectionHeader
            eyebrow="📱 پارسا استور"
            title={<>میکرواستور رسمی <span className="text-gradient">پارسا اپس</span></>}
            subtitle="هر محصول صفحه اختصاصی، گالری اسکرین‌شات، امکانات و مسیر دانلود خود را دارد. اینجا همه اپلیکیشن‌های استودیو را می‌بینید."
          />
        </div>
      </section>

      <section className="section-shell pt-6">
        <div className="container-px">
          <Reveal>
            <div className="mb-10 flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`rounded-full border px-4 py-2 text-sm font-bold transition-all ${
                    cat === c
                      ? "border-neon-violet bg-neon-violet/20 text-white shadow-[0_0_20px_rgba(124,92,255,0.4)]"
                      : "border-white/10 bg-white/5 text-white/55 hover:text-white"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Reveal>

          <motion.div layout className="grid gap-5 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {filtered.map((app, i) => (
                <motion.div layout key={app.slug} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35 }}>
                  <StoreCard app={app} index={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div className="mt-10 text-center text-white/50">محصولی در این دسته وجود ندارد.</div>
          )}
        </div>
      </section>

      <section className="section-shell">
        <div className="container-px">
          <Reveal>
            <div className="card p-8 text-center sm:p-10">
              <h2 className="text-2xl font-black sm:text-3xl">چگونه اپلیکیشن را نصب کنم؟</h2>
              <p className="mx-auto mt-4 max-w-2xl leading-8 text-white/60">
                از صفحه هر محصول، بخش دانلود را باز کنید و فایل APK مستقیم را دریافت کنید. تا زمان انتشار رسمی،
                دکمه دانلود وضعیت «به‌زودی» را نمایش می‌دهد.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link to="/apps/fandoghi" className="btn btn-primary">جزیره فندقی</Link>
                <Link to="/apps/kartoniya" className="btn btn-ghost">کارتونیا</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
