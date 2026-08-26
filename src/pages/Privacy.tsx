import { useI18n } from "@/lib/i18n";
import { Reveal, SectionHeader } from "@/components/ui";

const sections = [
  { icon: "📋", n: 1 },
  { icon: "🧒", n: 2 },
  { icon: "🔐", n: 3 },
];

export default function Privacy() {
  const { t } = useI18n();
  return (
    <div className="pt-28">
      <section className="section-shell">
        <div className="container-px max-w-3xl">
          <SectionHeader
            eyebrow={t("privacy.hero.eyebrow")}
            title={<>{t("privacy.hero.title.a")} <span className="text-gradient">{t("privacy.hero.title.b")}</span></>}
            subtitle={t("privacy.hero.subtitle")}
          />

          <div className="mt-12 space-y-6">
            {sections.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="card p-6 sm:p-8">
                  <span className="text-3xl">{s.icon}</span>
                  <h2 className="mt-4 text-xl font-black text-white">{t(`privacy.${s.n}.title`)}</h2>
                  <p className="mt-2 leading-8 text-white/60">{t(`privacy.${s.n}.text`)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
