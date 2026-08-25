import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type Lang = "fa" | "en" | "ar";

export const LANG_META: Record<Lang, { label: string; dir: "rtl" | "ltr"; htmlLang: string }> = {
  fa: { label: "فارسی", dir: "rtl", htmlLang: "fa" },
  en: { label: "English", dir: "ltr", htmlLang: "en" },
  ar: { label: "العربية", dir: "rtl", htmlLang: "ar" },
};

type Dict = Record<string, Record<Lang, string>>;

const dict: Dict = {
  "nav.home": { fa: "خانه", en: "Home", ar: "الرئيسية" },
  "nav.store": { fa: "استور", en: "Store", ar: "المتجر" },
  "nav.about": { fa: "درباره", en: "About", ar: "حول" },
  "nav.contact": { fa: "تماس", en: "Contact", ar: "اتصال" },
  "nav.apps": { fa: "اپلیکیشن‌ها", en: "Apps", ar: "التطبيقات" },

  "hero.kicker": { fa: "استودیو نرم‌افزار پرمیوم", en: "Premium Software Studio", ar: "استوديو برمجيات فاخر" },
  "hero.title.1": { fa: "ساخت آینده تجربه‌های موبایل", en: "Building the Future of Mobile", ar: "بناء مستقبل تطبيقات الجوال" },
  "hero.title.2": { fa: "با خلاقیت و هوش مصنوعی", en: "Experiences With AI", ar: "بالإبداع والذكاء الاصطناعي" },
  "hero.sub": {
    fa: "توسعه حرفه‌ای اپلیکیشن‌های اندروید و فلاتر، قدرت‌گرفته از فناوری مدرن و هوش مصنوعی.",
    en: "Professional Android and Flutter development powered by modern technology and artificial intelligence.",
    ar: "تطوير احترافي لتطبيقات أندرويد وفلوتن مدعوم بأحدث التقنيات والذكاء الاصطناعي.",
  },
  "hero.cta.primary": { fa: "اکتشاف اپلیکیشن‌ها", en: "Explore Applications", ar: "استكشاف التطبيقات" },
  "hero.cta.secondary": { fa: "ارتباط با توسعه‌دهنده", en: "Contact Developer", ar: "تواصل مع المطور" },

  "brand.tagline": { fa: "Building the future of mobile experiences", en: "Building the future of mobile experiences", ar: "بناء مستقبل تجارب الجوال" },

  "actions.explore": { fa: "مشاهده بیشتر", en: "Explore", ar: "استكشف" },
  "actions.download": { fa: "دانلود", en: "Download", ar: "تحميل" },
  "actions.comingSoon": { fa: "به‌زودی", en: "Coming soon", ar: "قريباً" },
  "actions.viewApp": { fa: "مشاهده برنامه", en: "View app", ar: "عرض التطبيق" },
};

interface I18nCtx {
  lang: Lang;
  dir: "rtl" | "ltr";
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const Ctx = createContext<I18nCtx>({
  lang: "fa",
  dir: "rtl",
  setLang: () => undefined,
  t: (k) => dict[k]?.fa ?? "…",
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fa");
  const dir = LANG_META[lang].dir;

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    document.documentElement.lang = LANG_META[l].htmlLang;
    document.documentElement.dir = LANG_META[l].dir;
  }, []);

  const t = useCallback(
    (key: string) => dict[key]?.[lang] ?? dict[key]?.fa ?? key,
    [lang]
  );

  const value = useMemo(() => ({ lang, dir, setLang, t }), [lang, dir, setLang, t]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
