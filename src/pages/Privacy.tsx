import { Reveal, SectionHeader } from "@/components/ui";

const sections = [
  { icon: "📋", title: "اطلاعات کاربران", text: "ما تلاش می‌کنیم کمترین اطلاعات مورد نیاز را دریافت کنیم و امنیت اطلاعات کاربران را حفظ کنیم. هیچ داده‌ای بدون ضرورت جمع‌آوری نمی‌شود." },
  { icon: "🧒", title: "امنیت کودکان", text: "جزیره فندقی با هدف ایجاد محیطی امن و مناسب برای کودکان طراحی شده است: بدون تبلیغات مزاحم، بدون محتوای نامناسب و با تمرکز کامل روی یادگیری و سرگرمی سالم." },
  { icon: "🔐", title: "تعهد ما", text: "در صورت تغییر در سیاست‌های حریم خصوصی، این صفحه به‌روزرسانی خواهد شد و کاربران در جریان قرار می‌گیرند." },
];

export default function Privacy() {
  return (
    <div className="pt-28">
      <section className="section-shell">
        <div className="container-px max-w-3xl">
          <SectionHeader
            eyebrow="🔒 حریم خصوصی"
            title={<>شفافیت، <span className="text-gradient">اصل کار ما</span></>}
            subtitle="پارسا اپس به حریم خصوصی کاربران اهمیت می‌دهد و شفافیت را اصل کار خود قرار داده است."
          />

          <div className="mt-12 space-y-6">
            {sections.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <div className="card p-6 sm:p-8">
                  <span className="text-3xl">{s.icon}</span>
                  <h2 className="mt-4 text-xl font-black text-white">{s.title}</h2>
                  <p className="mt-2 leading-8 text-white/60">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
