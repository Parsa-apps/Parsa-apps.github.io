import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { apps } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { Reveal, SectionHeader } from "@/components/ui";
import { StoreCard } from "@/components/apps";

const categories = ["store.cat.all", ...Array.from(new Set(apps.map((a) => a.category)))];

export default function Store() {
  const { t } = useI18n();
  const [cat, setCat] = useState("store.cat.all");

  const filtered = useMemo(
    () => (cat === "store.cat.all" ? apps : apps.filter((a) => a.category === cat)),
    [cat]
  );

  return (
    <div className="pt-28">
      <section className="section-shell pb-6">
        <div className="container-px">
          <SectionHeader
            eyebrow={t("store.hero.eyebrow")}
            title={<>{t("store.hero.title.a")} <span className="text-gradient">{t("store.hero.title.b")}</span></>}
            subtitle={t("store.hero.subtitle")}
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
                  className={`relative rounded-full border px-4 py-2 text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
                    cat === c
                      ? "border-transparent text-white"
                      : "border-white/10 bg-white/5 text-white/55 hover:border-white/25 hover:text-white"
                  }`}
                >
                  {cat === c && (
                    <motion.span
                      layoutId="store-cat"
                      className="absolute inset-0 -z-[1] rounded-full border border-neon-violet bg-neon-violet/25 shadow-[0_0_20px_rgba(124,92,255,0.4)]"
                      transition={{ type: "spring", stiffness: 360, damping: 30 }}
                    />
                  )}
                  {t(c)}
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
            <div className="mt-10 text-center text-white/50">{t("store.empty")}</div>
          )}
        </div>
      </section>

      <section className="section-shell">
        <div className="container-px">
          <Reveal>
            <div className="card p-8 text-center sm:p-10">
              <h2 className="text-2xl font-black sm:text-3xl">{t("store.install.title")}</h2>
              <p className="mx-auto mt-4 max-w-2xl leading-8 text-white/60">
                {t("store.install.text")}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link to="/apps/fandoghi" className="btn btn-primary">{t("app.fandoghi.name")}</Link>
                <Link to="/apps/kartoniya" className="btn btn-ghost">{t("app.kartoniya.name")}</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
