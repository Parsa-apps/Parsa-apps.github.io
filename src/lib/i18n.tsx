import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "fa" | "en" | "ar";

export const LANG_META: Record<Lang, { label: string; dir: "rtl" | "ltr"; htmlLang: string }> = {
  fa: { label: "فارسی", dir: "rtl", htmlLang: "fa" },
  en: { label: "English", dir: "ltr", htmlLang: "en" },
  ar: { label: "العربية", dir: "rtl", htmlLang: "ar" },
};

type Dict = Record<string, Record<Lang, string>>;

/**
 * Full site dictionary (fa / en / ar).
 * App content uses keys `app.<slug>.<field>[.<index>]` — data.ts keeps the
 * structure (array lengths, images, technology), the dict holds all copy.
 */
const dict: Dict = {
  /* ============================== NAV / COMMON ============================== */
  "nav.home": { fa: "خانه", en: "Home", ar: "الرئيسية" },
  "nav.store": { fa: "استور", en: "Store", ar: "المتجر" },
  "nav.about": { fa: "درباره", en: "About", ar: "حول" },
  "nav.contact": { fa: "تماس", en: "Contact", ar: "اتصال" },
  "nav.apps": { fa: "اپلیکیشن‌ها", en: "Apps", ar: "التطبيقات" },
  "nav.privacy": { fa: "حریم خصوصی", en: "Privacy", ar: "الخصوصية" },
  "nav.tagline": { fa: "استودیو نرم‌افزار پرمیوم", en: "Premium Software Studio", ar: "استوديو برمجيات فاخر" },
  "a11y.mainNav": { fa: "منوی اصلی", en: "Main menu", ar: "القائمة الرئيسية" },
  "a11y.openMenu": { fa: "باز کردن منو", en: "Open menu", ar: "فتح القائمة" },
  "a11y.backToTop": { fa: "بازگشت به بالا", en: "Back to top", ar: "العودة إلى الأعلى" },
  "cursor.view": { fa: "مشاهده", en: "View", ar: "عرض" },
  "common.telegram": { fa: "تلگرام", en: "Telegram", ar: "تيليجرام" },

  /* ================================ HERO =================================== */
  "hero.kicker": { fa: "استودیو نرم‌افزار پرمیوم", en: "Premium Software Studio", ar: "استوديو برمجيات فاخر" },
  "hero.title.1": { fa: "ساخت آینده تجربه‌های موبایل", en: "Building the Future of Mobile", ar: "بناء مستقبل تطبيقات الجوال" },
  "hero.title.2": { fa: "با خلاقیت و مهندسی دقیق", en: "With Creativity & Precision", ar: "بالإبداع والهندسة الدقيقة" },
  "hero.sub": {
    fa: "توسعه حرفه‌ای اپلیکیشن‌های اندروید و فلاتر، قدرت‌گرفته از مهندسی دقیق و طراحی مدرن.",
    en: "Professional Android and Flutter development powered by modern technology and clean engineering.",
    ar: "تطوير احترافي لتطبيقات أندرويد وفلوتن مدعوم بأحدث التقنيات والهندسة الدقيقة.",
  },
  "hero.cta.primary": { fa: "لیست برنامه‌ها", en: "Explore Applications", ar: "استكشاف التطبيقات" },
  "hero.cta.secondary": { fa: "ارتباط با توسعه‌دهنده", en: "Contact Developer", ar: "تواصل مع المطور" },
  "hero.stats.apps": { fa: "اپلیکیشن", en: "Apps", ar: "تطبيقات" },
  "hero.stats.skills": { fa: "مهارت تخصصی", en: "Expert skills", ar: "مهارات متخصصة" },
  "hero.stats.quality": { fa: "تعهد کیفیت", en: "Quality commitment", ar: "التزام بالجودة" },

  /* ============================ HOME: STATEMENT ============================ */
  "home.about.eyebrow": { fa: "درباره استودیو", en: "About the studio", ar: "عن الاستوديو" },
  "home.about.title.a": { fa: "پارسا اپس یک", en: "Parsa Apps is a", ar: "«بارسا أبس»" },
  "home.about.title.b": { fa: "برند جدی نرم‌افزار", en: "serious software brand", ar: "علامة برمجيات جادة" },
  "home.about.title.c": { fa: "است", en: "", ar: "" },
  "home.about.text": {
    fa: "ما فقط برنامه نمی‌سازیم؛ تجربه‌های دیجیتال باکیفیت خلق می‌کنیم. از مهندسی دقیق و طراحی مدرن تا استانداردهای روز دنیا، هر محصول نشانه‌ای از تعهد ما به کیفیت است.",
    en: "We don't just build apps; we craft quality digital experiences. From precise engineering and modern design to world-class standards, every product is a sign of our commitment to quality.",
    ar: "نحن لا نصنع التطبيقات فحسب؛ بل نخلق تجارب رقمية عالية الجودة. من الهندسة الدقيقة والتصميم العصري إلى معايير عالمية، كل منتج هو دليل على التزامنا بالجودة.",
  },
  "home.about.btnAbout": { fa: "درباره فرشاد پارسا", en: "About Farshad Parsa", ar: "عن فرشاد بارسا" },
  "home.about.btnProducts": { fa: "مشاهده محصولات", en: "View products", ar: "عرض المنتجات" },

  "value.creativity.title": { fa: "خلاقیت", en: "Creativity", ar: "الإبداع" },
  "value.creativity.text": { fa: "ایده‌های نو برای دنیای دیجیتال", en: "Fresh ideas for the digital world", ar: "أفكار جديدة لعالم رقمي" },
  "value.engineering.title": { fa: "مهندسی دقیق", en: "Precise engineering", ar: "هندسة دقيقة" },
  "value.engineering.text": { fa: "کدنویسی تمیز، تست و استانداردهای کیفیت", en: "Clean code, testing and quality standards", ar: "برمجة نظيفة واختبارات ومعايير جودة" },
  "value.design.title": { fa: "طراحی", en: "Design", ar: "تصميم" },
  "value.design.text": { fa: "ساخت تجربه‌های زیبا و کاربردی", en: "Building beautiful, useful experiences", ar: "صناعة تجارب جميلة ومفيدة" },
  "value.innovation.title": { fa: "نوآوری", en: "Innovation", ar: "ابتكار" },
  "value.innovation.text": { fa: "به‌کارگیری فناوری‌های روز دنیا", en: "Using state-of-the-art technologies", ar: "توظيف أحدث التقنيات" },

  /* ============================= HOME: FLAGSHIP ============================= */
  "home.flag.eyebrow": { fa: "☀️ محصول پرچم‌دار", en: "☀️ Flagship product", ar: "☀️ المنتج الرئيسي" },
  "home.flag.title.a": { fa: "جزیره فندقی،", en: "Jazireh Fandoghi,", ar: "جزيرة الفندقي،" },
  "home.flag.title.b": { fa: "دنیای یادگیری کودکان", en: "a world of learning for kids", ar: "عالم تعليمي للأطفال" },
  "home.flag.subtitle": {
    fa: "دنیایی شاد، امن و آموزشی برای کودکان ۳ تا ۹ سال؛ جایی که بازی و یادگیری به هم می‌رسند.",
    en: "A happy, safe and educational world for children aged 3–9; where play and learning meet.",
    ar: "عالم مرح وآمن وتعليمي للأطفال من ٣ إلى ٩ سنوات؛ حيث تلتقي اللعبة بالتعلم.",
  },
  "home.flag.note": {
    fa: "با Flutter، Dart و Firebase — طراحی‌شده برای آرامش والدین و شادی کودکان.",
    en: "Built with Flutter, Dart and Firebase — designed for parents' peace of mind and children's joy.",
    ar: "بُني بـ Flutter وDart وFirebase — صُمم لراحة الآباء وفرح الأطفال.",
  },
  "app.btnViewProduct": { fa: "مشاهده صفحه محصول", en: "View product page", ar: "عرض صفحة المنتج" },
  "app.downloadApk": { fa: "دانلود APK", en: "Download APK", ar: "تحميل APK" },

  /* =========================== HOME: STORE PREVIEW ========================== */
  "home.store.eyebrow": { fa: "📱 پارسا استور", en: "📱 Parsa Store", ar: "📱 متجر بارسا" },
  "home.store.title.a": { fa: "هر محصول،", en: "Every product,", ar: "كل منتج،" },
  "home.store.title.b": { fa: "یک تجربه کامل", en: "a complete experience", ar: "تجربة كاملة" },
  "home.store.subtitle": {
    fa: "میکرواستور رسمی اپلیکیشن‌های پارسا اپس — هر اپ با صفحه محصول، گالری و دانلود اختصاصی.",
    en: "The official micro-store of Parsa Apps — every app with its own product page, gallery and dedicated download.",
    ar: "المتجر المصغّر الرسمي لتطبيقات بارسا أبس — كل تطبيق بصفحة منتج ومعرض وتحميل خاص.",
  },
  "home.store.btnAll": { fa: "همه اپلیکیشن‌ها ←", en: "All apps →", ar: "جميع التطبيقات ←" },

  /* =========================== HOME: PROCESS ================================ */
  "home.process.eyebrow": { fa: "⚡ فرآیند توسعه محصول", en: "⚡ Product development process", ar: "⚡ عملية تطوير المنتج" },
  "home.process.title.a": { fa: "از ایده تا انتشار،", en: "From idea to release,", ar: "من الفكرة إلى الإطلاق،" },
  "home.process.title.b": { fa: "قدم به قدم", en: "step by step", ar: "خطوة بخطوة" },
  "home.process.subtitle": {
    fa: "در پارسا اپس، هر محصول از تحلیل نیاز تا انتشار و بهبود، در یک مسیر مهندسی‌شده و دقیق ساخته می‌شود.",
    en: "At Parsa Apps, every product is built through a precise engineering path, from needs analysis to release and improvement.",
    ar: "في بارسا أبس، يُبنى كل منتج عبر مسار هندسي دقيق، من تحليل الاحتياج إلى الإطلاق والتحسين.",
  },
  "process.1.title": { fa: "تحلیل دقیق", en: "Deep analysis", ar: "تحليل معمّق" },
  "process.1.text": {
    fa: "تحلیل عمیق نیاز کاربر و ساختاردهی دقیق محصول پیش از شروع توسعه.",
    en: "Deeply analyzing user needs and structuring the product before development begins.",
    ar: "تحليل عميق لاحتياجات المستخدم وبناء المنتج بدقة قبل بدء التطوير.",
  },
  "process.2.title": { fa: "طراحی داده‌محور", en: "Data-driven design", ar: "تصميم قائم على البيانات" },
  "process.2.text": {
    fa: "تجربه کاربری مدرن و راست‌چین فارسی بر پایه داده و الگوهای روز دنیا.",
    en: "Modern, RTL-first user experience built on data and up-to-date patterns.",
    ar: "تجربة استخدام حديثة تدعم الاتجاه من اليمين، مبنية على البيانات وأحدث الأنماط.",
  },
  "process.3.title": { fa: "مهندسی تمیز", en: "Clean engineering", ar: "هندسة نظيفة" },
  "process.3.text": {
    fa: "کدنویسی سریع‌تر و تمیزتر با بازبینی دقیق و تست خودکار کد.",
    en: "Faster, cleaner code with careful reviews and automated tests.",
    ar: "برمجة أسرع وأنظف مع مراجعة دقيقة واختبارات آلية.",
  },
  "process.4.title": { fa: "انتشار و بهبود", en: "Release & improve", ar: "الإطلاق والتحسين" },
  "process.4.text": {
    fa: "پایش کاربران و به‌روزرسانی منظم برای تجربه‌ای همیشه بهتر.",
    en: "Monitoring users and shipping regular updates for an ever-better experience.",
    ar: "مراقبة المستخدمين وتحديثات منتظمة لتجربة أفضل باستمرار.",
  },

  /* ============================ HOME: DEVELOPER ============================= */
  "home.dev.eyebrow": { fa: "👨‍💻 توسعه‌دهنده", en: "👨‍💻 Developer", ar: "👨‍💻 المطوّر" },
  "person.name": { fa: "فرشاد پارسا", en: "Farshad Parsa", ar: "فرشاد بارسا" },
  "home.dev.text": {
    fa: "بنیان‌گذار و برنامه‌نویس ارشد پارسا اپس — توسعه‌دهنده اندروید و فلاتر و طراح UI/UX. هر خط کد با تست، بازبینی و عشق به جزئیات نوشته می‌شود.",
    en: "Founder and lead developer of Parsa Apps — Android & Flutter developer and UI/UX designer. Every line of code is written with tests, reviews and love for detail.",
    ar: "المؤسس والمطوّر الرئيسي لبارسا أبس — مطوّر أندرويد وفلتوم ومصمم UI/UX. كل سطر برمجي يُكتب مع الاختبار والمراجعة وحب التفاصيل.",
  },
  "home.dev.btnProfile": { fa: "پروفایل کامل", en: "Full profile", ar: "الملف الكامل" },

  /* ============================== TIMELINE ================================== */
  "tl.1.year": { fa: "آغاز", en: "Beginnings", ar: "البداية" },
  "tl.1.title": { fa: "شروع مسیر", en: "The journey starts", ar: "بداية الطريق" },
  "tl.1.text": {
    fa: "آشنایی عمیق با برنامه‌نویسی و دنیای اپلیکیشن‌های موبایل.",
    en: "A deep dive into programming and the world of mobile apps.",
    ar: "تعرّف عميق على البرمجة وعالم تطبيقات الجوال.",
  },
  "tl.2.year": { fa: "یادگیری", en: "Learning", ar: "التعلّم" },
  "tl.2.title": { fa: "یادگیری مستمر", en: "Constant learning", ar: "تعلّم مستمر" },
  "tl.2.text": {
    fa: "تسلط بر Flutter، Dart، Kotlin و Android.",
    en: "Mastering Flutter, Dart, Kotlin and Android.",
    ar: "إتقان Flutter وDart وKotlin وAndroid.",
  },
  "tl.3.year": { fa: "پروژه‌ها", en: "Projects", ar: "المشاريع" },
  "tl.3.title": { fa: "ساخت پروژه‌های واقعی", en: "Building real projects", ar: "بناء مشاريع حقيقية" },
  "tl.3.text": {
    fa: "طراحی و توسعه اپلیکیشن‌های آموزشی و خلاقانه برای کودکان و خانواده‌ها.",
    en: "Designing and developing creative, educational apps for kids and families.",
    ar: "تصميم وتطوير تطبيقات تعليمية وإبداعية للأطفال والعائلات.",
  },
  "tl.4.year": { fa: "استودیو", en: "Studio", ar: "الاستوديو" },
  "tl.4.title": { fa: "تأسیس پارسا اپس", en: "Founding Parsa Apps", ar: "تأسيس بارسا أبس" },
  "tl.4.text": {
    fa: "تبدیل تجربه‌ها به یک استودیوی نرم‌افزار با کیفیت و برند واقعی.",
    en: "Turning that experience into a quality software studio and a real brand.",
    ar: "تحويل الخبرات إلى استوديو برمجيات عالي الجودة وعلامة حقيقية.",
  },

  /* ============================== HOME: SKILLS ============================== */
  "home.skills.eyebrow": { fa: "🧩 تخصص‌ها", en: "🧩 Expertise", ar: "🧩 التخصصات" },
  "home.skills.title.a": { fa: "ابزارهایی که", en: "The tools that turn", ar: "الأدوات التي" },
  "home.skills.title.b": { fa: "ایده را واقعی می‌کنند", en: "ideas into reality", ar: "تحوّل الأفكار إلى واقع" },
  "home.skills.subtitle": {
    fa: "مهارت‌های فنی و طراحی پشت هر محصول پارسا اپس.",
    en: "The technical and design skills behind every Parsa Apps product.",
    ar: "المهارات التقنية والتصميمية خلف كل منتج من بارسا أبس.",
  },
  "skill.strong": { fa: "قوی", en: "Strong", ar: "قوي" },
  "skill.good": { fa: "خوب", en: "Good", ar: "جيد" },

  /* ============================= HOME: PROJECTS ============================= */
  "home.projects.eyebrow": { fa: "🗂️ پروژه‌ها", en: "🗂️ Projects", ar: "🗂️ المشاريع" },
  "home.projects.title.a": { fa: "تاریخچه‌ای از", en: "A history of", ar: "سجل حافل بـ" },
  "home.projects.title.b": { fa: "محصولات واقعی", en: "real products", ar: "منتجات حقيقية" },
  "home.projects.subtitle": {
    fa: "هر پروژه یک تجربه یادگیری است که به محصولی برای کاربران تبدیل شده است.",
    en: "Every project is a learning experience that grew into a real product for users.",
    ar: "كل مشروع هو تجربة تعلّم تحولت إلى منتج حقيقي للمستخدمين.",
  },

  /* =============================== HOME: CTA ================================ */
  "home.cta.title": {
    fa: "آیا ایده‌ای برای محصول بعدی دارید؟",
    en: "Have an idea for the next product?",
    ar: "هل لديك فكرة للمنتج التالي؟",
  },
  "home.cta.text": {
    fa: "از طراحی تا انتشار، کنار شما هستیم. پیام شما مستقیم به مدیر و توسعه‌دهنده ارشد می‌رسد.",
    en: "From design to release, we're by your side. Your message goes straight to the founder and lead developer.",
    ar: "من التصميم إلى الإطلاق، نحن بجانبك. رسالتك تصل مباشرة إلى المؤسس والمطوّر الرئيسي.",
  },
  "home.cta.btnContact": { fa: "ارتباط با ما", en: "Contact us", ar: "تواصل معنا" },

  /* ================================ STATUS ================================== */
  "status.released": { fa: "منتشر شده", en: "Released", ar: "تم الإصدار" },
  "status.beta": { fa: "نسخه آزمایشی", en: "Beta", ar: "نسخة تجريبية" },
  "status.development": { fa: "در حال توسعه", en: "In development", ar: "قيد التطوير" },
  "dev.generic": { fa: "در حال توسعه", en: "In development", ar: "قيد التطوير" },

  /* ================================ FOOTER ================================== */
  "footer.tagline": {
    fa: "Building the future of mobile experiences. استودیویی که با مهندسی دقیق و طراحی مدرن، محصولات دیجیتال نسل جدید را می‌سازد.",
    en: "Building the future of mobile experiences. A studio crafting next-generation digital products with precise engineering and modern design.",
    ar: "بناء مستقبل تجارب الجوال. استوديو يصنع منتجات رقمية من الجيل الجديد بهندسة دقيقة وتصميم عصري.",
  },
  "footer.quickTitle": { fa: "دسترسی سریع", en: "Quick access", ar: "وصول سريع" },
  "footer.contactTitle": { fa: "ارتباط", en: "Contact", ar: "تواصل" },
  "footer.q.store": { fa: "پارسا استور", en: "Parsa Store", ar: "متجر بارسا" },
  "footer.rights": {
    fa: "© ۱۴۰۵ پارسا اپس | تمامی حقوق محفوظ است",
    en: "© 2026 Parsa Apps | All rights reserved",
    ar: "© ٢٠٢٦ بارسا أبس | جميع الحقوق محفوظة",
  },
  "footer.made.a": { fa: "ساخته‌شده با", en: "Made with", ar: "صُنع بـ" },
  "footer.made.b": { fa: "توسط تیم پارسا اپس", en: "by the Parsa Apps team", ar: "بواسطة فريق بارسا أبس" },

  /* ================================ STORE =================================== */
  "store.hero.eyebrow": { fa: "📱 پارسا استور", en: "📱 Parsa Store", ar: "📱 متجر بارسا" },
  "store.hero.title.a": { fa: "میکرواستور رسمی", en: "The official micro-store of", ar: "المتجر المصغّر الرسمي لـ" },
  "store.hero.title.b": { fa: "پارسا اپس", en: "Parsa Apps", ar: "بارسا أبس" },
  "store.hero.subtitle": {
    fa: "هر محصول صفحه اختصاصی، گالری اسکرین‌شات، امکانات و مسیر دانلود خود را دارد. اینجا همه اپلیکیشن‌های استودیو را می‌بینید.",
    en: "Every product has its own page, screenshot gallery, features and download path. Here you'll find all the studio's apps.",
    ar: "لكل منتج صفحته الخاصة ومعرض لقطات الشاشة والميزات ومسار التحميل. هنا تجد جميع تطبيقات الاستوديو.",
  },
  "store.cat.all": { fa: "همه", en: "All", ar: "الكل" },
  "store.empty": {
    fa: "محصولی در این دسته وجود ندارد.",
    en: "No products in this category.",
    ar: "لا توجد منتجات في هذه الفئة.",
  },
  "store.install.title": {
    fa: "چگونه اپلیکیشن را نصب کنم؟",
    en: "How do I install the app?",
    ar: "كيف أثبّت التطبيق؟",
  },
  "store.install.text": {
    fa: "از صفحه هر محصول، بخش دانلود را باز کنید و فایل APK مستقیم را دریافت کنید. تا زمان انتشار رسمی، دکمه دانلود وضعیت «به‌زودی» را نمایش می‌دهد.",
    en: "Open the download section on each product page and get the direct APK file. Until the official release, the download button shows a “coming soon” state.",
    ar: "افتح قسم التحميل في صفحة كل منتج واحصل على ملف APK المباشر. حتى الإطلاق الرسمي، يُظهر زر التحميل حالة «قريباً».",
  },
  "store.versionPrefix": { fa: "نسخه", en: "v", ar: "الإصدار" },
  "app.download": { fa: "دانلود", en: "Download", ar: "تحميل" },

  /* ============================== CATEGORIES ================================ */
  "cat.education": { fa: "آموزشی", en: "Education", ar: "تعليمي" },
  "cat.entertainment": { fa: "سرگرمی و تماشا", en: "Entertainment & TV", ar: "ترفيه ومشاهدة" },
  "cat.stories": { fa: "قصه و خواب", en: "Stories & sleep", ar: "قصص ونوم" },
  "cat.cooking": { fa: "بازی و آشپزی", en: "Games & cooking", ar: "ألعاب وطهي" },
  "cat.science": { fa: "دانش و ماجراجویی", en: "Science & adventure", ar: "علوم ومغامرة" },
  "cat.art": { fa: "هنر و خلاقیت", en: "Art & creativity", ar: "فنون وإبداع" },

  /* ================================ ABOUT =================================== */
  "about.hero.eyebrow": {
    fa: "👨‍💻 درباره توسعه‌دهنده و استودیو",
    en: "👨‍💻 About the developer & studio",
    ar: "👨‍💻 عن المطوّر والاستوديو",
  },
  "about.hero.text": {
    fa: "بنیان‌گذار و برنامه‌نویس ارشد پارسا اپس. من با سخت‌گیری مهندسی، کدنویسی تمیز و تمرکز روی جزئیات، محصولات دیجیتال می‌سازم. هر خط کد با تست و بازبینی، هر صفحه با استانداردهای تجربه کاربری فارسی و RTL، و هر انتشار با رعایت اصول امنیت و کیفیت انجام می‌شود؛ چون اینجا یک پروژه معمولی نیست — یک برند حرفه‌ای است.",
    en: "Founder and lead developer of Parsa Apps. With engineering rigor, clean code and a focus on detail, I build digital products. Every line of code is tested and reviewed, every screen follows Persian & RTL UX standards, and every release respects security and quality principles — because this is no ordinary project; it's a professional brand.",
    ar: "المؤسس والمطوّر الرئيسي لبارسا أبس. بأناة هندسية وبرمجة نظيفة وتركيز على التفاصيل أبني منتجات رقمية. كل سطر برمجي يُختبر ويُراجع، وكل شاشة تتبع معايير تجربة الاستخدام والدعم من اليمين، وكل إصدار يراعي مبادئ الأمان والجودة — لأن هذا ليس مشروعاً عادياً؛ إنه علامة احترافية.",
  },
  "role.android.text": {
    fa: "توسعه اپلیکیشن‌های اندرویدی سبک، سریع و بهینه.",
    en: "Building lightweight, fast and optimized Android apps.",
    ar: "تطوير تطبيقات أندرويد خفيفة وسريعة ومحسّنة.",
  },
  "role.flutter.text": {
    fa: "تجربه‌های یکپارچه و مدرن با فلاتر و دارت.",
    en: "Modern, cohesive experiences with Flutter and Dart.",
    ar: "تجارب عصرية متكاملة بـ Flutter وDart.",
  },
  "role.uiux.text": {
    fa: "طراحی رابط و تجربه کاربری فارسی و راست‌چین.",
    en: "Designing Persian, RTL-first interfaces and experiences.",
    ar: "تصميم واجهات وتجارب استخدام عربية تدعم الاتجاه من اليمين.",
  },
  "role.architect.text": {
    fa: "طراحی معماری دقیق و مقیاس‌پذیر برای محصولات پایدار.",
    en: "Designing precise, scalable architecture for durable products.",
    ar: "تصميم بنية دقيقة وقابلة للتوسع لمنتجات مستدامة.",
  },
  "about.mission.eyebrow": { fa: "🎯 ماموریت", en: "🎯 Mission", ar: "🎯 المهمة" },
  "about.mission.title.a": { fa: "ساخت فناوری که", en: "Building technology that", ar: "صناعة تقنية تجعل" },
  "about.mission.title.b": {
    fa: "زندگی را ساده‌تر و شادتر می‌کند",
    en: "makes life easier and happier",
    ar: "الحياة أسهل وأسعد",
  },
  "about.mission.subtitle": {
    fa: "هدف من ساخت محصولاتی است که فقط یک نرم‌افزار نباشند؛ بلکه تجربه‌ای جذاب، ساده و ماندگار برای کاربر ایجاد کنند — از کوچک‌ترین کاربران تا خانواده‌ها.",
    en: "My goal is to build products that aren't just software; they create an engaging, simple and lasting experience for users — from the youngest users to whole families.",
    ar: "هدفي أن أبني منتجات ليست مجرد برمجيات؛ بل تخلق تجربة جذابة وبسيطة ودائمة للمستخدم — من أصغر المستخدمين إلى العائلات.",
  },
  "about.mission.1": {
    fa: "توسعه با استانداردهای مهندسی نرم‌افزار و کدنویسی تمیز",
    en: "Development following software engineering standards and clean code",
    ar: "التطوير وفق معايير هندسة البرمجيات والبرمجة النظيفة",
  },
  "about.mission.2": {
    fa: "تمرکز کامل روی تجربه کاربری فارسی و RTL",
    en: "Full focus on Persian & RTL user experience",
    ar: "تركيز كامل على تجربة الاستخدام ودعم الاتجاه من اليمين",
  },
  "about.mission.3": {
    fa: "طراحی امن و خانواده‌محور برای کودکان",
    en: "Secure, family-friendly design for children",
    ar: "تصميم آمن ومناسب للعائلة والأطفال",
  },
  "about.mission.4": {
    fa: "بدون کتابخانه‌های سنگین — سریع، سبک و بهینه",
    en: "No heavy libraries — fast, light and optimized",
    ar: "بدون مكتبات ثقيلة — سريع وخفيف ومحسّن",
  },
  "about.mission.5": {
    fa: "پشتیبانی واقعی و پاسخ سریع به کاربران",
    en: "Real support and fast responses to users",
    ar: "دعم حقيقي ورد سريع للمستخدمين",
  },
  "about.mission.6": {
    fa: "به‌روزرسانی منظم و برنامه توسعه شفاف",
    en: "Regular updates and a transparent roadmap",
    ar: "تحديثات منتظمة وخطة تطوير شفافة",
  },
  "about.path.eyebrow": { fa: "🛤️ مسیر من", en: "🛤️ My path", ar: "🛤️ مسيري" },
  "about.path.title.a": { fa: "از یک ایده تا", en: "From an idea to", ar: "من فكرة إلى" },
  "about.path.title.b": { fa: "استودیوی پارسا اپس", en: "the Parsa Apps studio", ar: "استوديو بارسا أبس" },
  "about.skills.eyebrow": { fa: "🧩 مهارت‌ها", en: "🧩 Skills", ar: "🧩 المهارات" },
  "about.skills.title.a": { fa: "ابزار و", en: "Tools &", ar: "الأدوات و" },
  "about.skills.title.b": { fa: "تکنولوژی", en: "technology", ar: "التقنية" },
  "about.cta.title": { fa: "بیایید با هم بسازیم", en: "Let's build together", ar: "لنبنِ معاً" },
  "about.cta.text": {
    fa: "سوال، پیشنهاد یا ایده همکاری دارید؟ پیام شما مستقیم به من می‌رسد.",
    en: "Have a question, suggestion or collaboration idea? Your message reaches me directly.",
    ar: "لديك سؤال أو اقتراح أو فكرة تعاون؟ رسالتك تصل إليّ مباشرة.",
  },
  "about.cta.btnContact": { fa: "ارتباط مستقیم", en: "Direct contact", ar: "تواصل مباشر" },

  /* =============================== CONTACT ================================== */
  "contact.hero.eyebrow": { fa: "💬 ارتباط با ما", en: "💬 Contact us", ar: "💬 تواصل معنا" },
  "contact.hero.title.a": { fa: "بیایید", en: "Let's talk", ar: "لنتحدث" },
  "contact.hero.title.b": { fa: "درباره ایده شما", en: "about your idea", ar: "عن فكرتك" },
  "contact.hero.subtitle": {
    fa: "برای همکاری، پشتیبانی یا ایده، پیام‌ها مستقیم به فرشاد پارسا، مدیر و برنامه‌نویس ارشد پارسا اپس می‌رسد.",
    en: "For collaboration, support or ideas, messages go straight to Farshad Parsa, founder and lead developer of Parsa Apps.",
    ar: "للتعاون أو الدعم أو الأفكار، تصل رسائلك مباشرة إلى فرشاد بارسا، المؤسس والمطوّر الرئيسي لبارسا أبس.",
  },
  "channel.email": { fa: "ایمیل", en: "Email", ar: "البريد الإلكتروني" },
  "channel.email.note": {
    fa: "همکاری و پیشنهادهای تجاری",
    en: "Collaboration & business inquiries",
    ar: "للتعاون والعروض التجارية",
  },
  "channel.telegram": { fa: "تلگرام", en: "Telegram", ar: "تيليجرام" },
  "channel.telegram.note": {
    fa: "پاسخ سریع در کمتر از ۲۴ ساعت",
    en: "Fast replies in under 24 hours",
    ar: "رد سريع في أقل من ٢٤ ساعة",
  },
  "channel.instagram": { fa: "اینستاگرام", en: "Instagram", ar: "إنستغرام" },
  "channel.instagram.note": {
    fa: "پیج رسمی پارسا اپس",
    en: "The official Parsa Apps page",
    ar: "الصفحة الرسمية لبارسا أبس",
  },
  "contact.form.title": { fa: "فرم تماس", en: "Contact form", ar: "نموذج التواصل" },
  "contact.form.note": {
    fa: "فرم، پیش‌نویس ایمیل شما را باز می‌کند. داده‌ای روی سرور ذخیره نمی‌شود.",
    en: "The form opens an email draft for you. No data is stored on any server.",
    ar: "يفتح النموذج مسودة بريد إلكتروني لك. لا تُخزَّن أي بيانات على الخادم.",
  },
  "contact.form.name": { fa: "نام", en: "Name", ar: "الاسم" },
  "contact.form.namePh": { fa: "نام شما", en: "Your name", ar: "اسمك" },
  "contact.form.email": { fa: "ایمیل", en: "Email", ar: "البريد الإلكتروني" },
  "contact.form.subject": { fa: "موضوع", en: "Subject", ar: "الموضوع" },
  "contact.form.message": { fa: "پیام", en: "Message", ar: "الرسالة" },
  "contact.form.messagePh": { fa: "پیام خود را بنویسید…", en: "Write your message…", ar: "اكتب رسالتك…" },
  "contact.subject.support": { fa: "پشتیبانی محصول", en: "Product support", ar: "دعم المنتج" },
  "contact.subject.collab": { fa: "همکاری و انتشار", en: "Collaboration & release", ar: "التعاون والإصدار" },
  "contact.subject.content": { fa: "پیشنهاد محتوا", en: "Content suggestion", ar: "اقتراح محتوى" },
  "contact.subject.other": { fa: "سایر", en: "Other", ar: "أخرى" },
  "contact.form.submit": { fa: "ارسال پیام", en: "Send message", ar: "إرسال الرسالة" },
  "contact.form.sent": {
    fa: "✓ پیام شما آماده ارسال شد — ممنون!",
    en: "✓ Your message is ready to send — thanks!",
    ar: "✓ رسالتك جاهزة للإرسال — شكراً!",
  },
  "contact.form.emailNote.a": {
    fa: "پیام‌ها به",
    en: "Messages are sent to",
    ar: "تُرسل الرسائل إلى",
  },
  "contact.form.emailNote.b": {
    fa: "ارسال می‌شوند.",
    en: "",
    ar: "",
  },

  /* =============================== PRIVACY ================================== */
  "privacy.hero.eyebrow": { fa: "🔒 حریم خصوصی", en: "🔒 Privacy", ar: "🔒 الخصوصية" },
  "privacy.hero.title.a": { fa: "شفافیت،", en: "Transparency,", ar: "الشفافية،" },
  "privacy.hero.title.b": { fa: "اصل کار ما", en: "our working principle", ar: "مبدأ عملنا" },
  "privacy.hero.subtitle": {
    fa: "پارسا اپس به حریم خصوصی کاربران اهمیت می‌دهد و شفافیت را اصل کار خود قرار داده است.",
    en: "Parsa Apps cares about user privacy and has made transparency its working principle.",
    ar: "تهتم بارسا أبس بخصوصية المستخدمين وجعلت الشفافية مبدأً لعملها.",
  },
  "privacy.1.title": { fa: "اطلاعات کاربران", en: "User information", ar: "معلومات المستخدمين" },
  "privacy.1.text": {
    fa: "ما تلاش می‌کنیم کمترین اطلاعات مورد نیاز را دریافت کنیم و امنیت اطلاعات کاربران را حفظ کنیم. هیچ داده‌ای بدون ضرورت جمع‌آوری نمی‌شود.",
    en: "We strive to collect only the minimum information required and to keep users' data secure. No data is collected without necessity.",
    ar: "نسعى إلى جمع الحد الأدنى من المعلومات اللازمة والحفاظ على أمان بيانات المستخدمين. لا تُجمَع أي بيانات دون ضرورة.",
  },
  "privacy.2.title": { fa: "امنیت کودکان", en: "Children's safety", ar: "أمان الأطفال" },
  "privacy.2.text": {
    fa: "جزیره فندقی با هدف ایجاد محیطی امن و مناسب برای کودکان طراحی شده است: بدون تبلیغات مزاحم، بدون محتوای نامناسب و با تمرکز کامل روی یادگیری و سرگرمی سالم.",
    en: "Jazireh Fandoghi is designed to create a safe, child-friendly environment: no intrusive ads, no inappropriate content, and a full focus on learning and healthy fun.",
    ar: "صُممت جزيرة الفندقي لخلق بيئة آمنة ومناسبة للأطفال: بدون إعلانات مزعجة، وبدون محتوى غير لائق، وبتركيز كامل على التعلم والترفيه الصحي.",
  },
  "privacy.3.title": { fa: "تعهد ما", en: "Our commitment", ar: "التزامنا" },
  "privacy.3.text": {
    fa: "در صورت تغییر در سیاست‌های حریم خصوصی، این صفحه به‌روزرسانی خواهد شد و کاربران در جریان قرار می‌گیرند.",
    en: "If the privacy policy changes, this page will be updated and users will be informed.",
    ar: "في حال تغيّر سياسات الخصوصية، سيتم تحديث هذه الصفحة وإعلام المستخدمين بذلك.",
  },

  /* =============================== NOT FOUND ================================ */
  "nf.title": { fa: "اوه! این صفحه پیدا نشد", en: "Oops! Page not found", ar: "عذراً! الصفحة غير موجودة" },
  "nf.text": {
    fa: "به نظر می‌رسد این مسیر در دنیای پارسا اپس وجود ندارد. اما نگران نباشید، ما شما را به خانه برمی‌گردانیم.",
    en: "Looks like this path doesn't exist in the Parsa Apps world. But don't worry — we'll take you home.",
    ar: "يبدو أن هذا المسار غير موجود في عالم بارسا أبس. لكن لا تقلق — سنعيدك إلى الرئيسية.",
  },
  "nf.btnHome": { fa: "بازگشت به صفحه اصلی", en: "Back to homepage", ar: "العودة للصفحة الرئيسية" },

  /* ============================== APP DETAIL ================================ */
  "app.backToStore": { fa: "← بازگشت به استور", en: "← Back to store", ar: "← العودة إلى المتجر" },
  "app.meta.version": { fa: "نسخه", en: "Version", ar: "الإصدار" },
  "app.meta.size": { fa: "حجم", en: "Size", ar: "الحجم" },
  "app.meta.android": { fa: "اندروید", en: "Android", ar: "أندرويد" },
  "app.meta.category": { fa: "دسته", en: "Category", ar: "الفئة" },
  "app.meta.hintDevVersion": {
    fa: "نسخه آزمایشی داخلی",
    en: "Internal beta build",
    ar: "نسخة تجريبية داخلية",
  },
  "app.meta.hintDevSize": {
    fa: "پس از انتشار مشخص می‌شود",
    en: "To be known after release",
    ar: "يُحدد بعد الإطلاق",
  },
  "app.devNotice": {
    fa: "این محصول در حال توسعه فعال است — اطلاعات حجم و نسخه پس از انتشار نهایی به‌روزرسانی می‌شود.",
    en: "This product is under active development — size and version details will be updated after the final release.",
    ar: "هذا المنتج قيد التطوير الفعّال — ستُحدَّث معلومات الحجم والإصدار بعد الإطلاق النهائي.",
  },
  "app.updatedPrefix": { fa: "آخرین به‌روزرسانی:", en: "Last update:", ar: "آخر تحديث:" },
  "app.btnDownloadSoon": {
    fa: "⬇️ دانلود — به‌زودی",
    en: "⬇️ Download — coming soon",
    ar: "⬇️ تحميل — قريباً",
  },
  "app.supportTelegram": {
    fa: "پشتیبانی در تلگرام",
    en: "Support on Telegram",
    ar: "الدعم عبر تيليجرام",
  },
  "app.features.eyebrow": { fa: "⚡ امکانات", en: "⚡ Features", ar: "⚡ الميزات" },
  "app.features.title.a": { fa: "چه چیزی", en: "What makes", ar: "ما الذي يجعل" },
  "app.features.title.b": { fa: "این اپ را خاص می‌کند؟", en: "this app special?", ar: "هذا التطبيق مميزاً؟" },
  "app.features.itemText": {
    fa: "تجربه‌ای ساده، روان و لذت‌بخش برای کاربر.",
    en: "A simple, smooth and delightful experience for users.",
    ar: "تجربة بسيطة وسلسة وممتعة للمستخدم.",
  },
  "app.gallery.eyebrow": { fa: "🖼️ گالری", en: "🖼️ Gallery", ar: "🖼️ معرض الصور" },
  "app.gallery.title.a": { fa: "نگاهی به", en: "A look inside", ar: "نظرة على" },
  "app.gallery.title.b": { fa: "دنیای", en: "the world of", ar: "عالم" },
  "app.gallery.subtitle": {
    fa: "گلچینی از اسکرین‌شات‌های واقعی تجربه کاربری برنامه.",
    en: "A selection of real app UX screenshots.",
    ar: "مجموعة مختارة من لقطات شاشة حقيقية لتجربة التطبيق.",
  },
  "app.gallery.shot": { fa: "اسکرین‌شات", en: "screenshot", ar: "لقطة شاشة" },
  "app.gallery.hint": {
    fa: "برای مشاهده بزرگ‌تر روی هر اسکرین‌شات ضربه بزنید",
    en: "Tap any screenshot to view it larger",
    ar: "اضغط على أي لقطة لعرضها بحجم أكبر",
  },
  "app.gallery.fallback": {
    fa: "تصویر در دسترس نیست",
    en: "Image unavailable",
    ar: "الصورة غير متوفرة",
  },
  "app.benefits.eyebrow": { fa: "🌱 مزایای آموزشی", en: "🌱 Educational benefits", ar: "🌱 الفوائد التعليمية" },
  "app.benefits.title": {
    fa: "بیش از یک بازی؛ یک مسیر یادگیری",
    en: "More than a game; a learning journey",
    ar: "أكثر من لعبة؛ رحلة تعلّم",
  },
  "app.benefits.text": {
    fa: "طراحی‌شده با درک عمیق از رشد کودک تا یادگیری با بازی، طبیعی و لذت‌بخش باشد.",
    en: "Designed with a deep understanding of child development, so learning through play feels natural and joyful.",
    ar: "صُمم بفهم عميق لنمو الطفل ليكون التعلم عبر اللعبة طبيعياً وممتعاً.",
  },
  "app.tech.eyebrow": { fa: "🛠️ تکنولوژی", en: "🛠️ Technology", ar: "🛠️ التقنية" },
  "app.tech.title.a": { fa: "ساخته‌شده با", en: "Built with", ar: "مبني على" },
  "app.tech.title.b": { fa: "تکنولوژی‌های مدرن", en: "modern technologies", ar: "تقنيات حديثة" },
  "app.videos.eyebrow": { fa: "🎬 ویدئوها", en: "🎬 Videos", ar: "🎬 الفيديوهات" },
  "app.videos.title.a": { fa: "ویدئوهای معرفی و بررسی", en: "Intro & review videos of", ar: "فيديوهات تعريف ومراجعة" },
  "app.videos.subtitle": {
    fa: "تماشای تریلر رسمی و ویدئوی بررسی کامل امکانات و محیط برنامه.",
    en: "Watch the official trailer and a full review of the app's features and environment.",
    ar: "شاهد الإعلان الرسمي وفيديو مراجعة كاملة لميزات التطبيق وبيئته.",
  },
  "app.videos.fallback": {
    fa: "مرورگر شما از پخش ویدئو پشتیبانی نمی‌کند.",
    en: "Your browser doesn't support video playback.",
    ar: "متصفحك لا يدعم تشغيل الفيديو.",
  },
  "app.download.titleBefore": { fa: "", en: "Download ", ar: "حمّل " },
  "app.download.titleAfter": { fa: " را دانلود کنید", en: "", ar: "" },
  "app.download.text.ready": {
    fa: "نسخه نهایی برنامه را مستقیماً نصب کنید.",
    en: "Install the final version of the app directly.",
    ar: "ثبّت النسخة النهائية من التطبيق مباشرة.",
  },
  "app.download.text.soon": {
    fa: "این محصول در حال توسعه است؛ پس از انتشار رسمی، لینک دانلود اینجا قرار می‌گیرد.",
    en: "This product is in development; the download link will be published here after the official release.",
    ar: "هذا المنتج قيد التطوير؛ سيوضع رابط التحميل هنا بعد الإطلاق الرسمي.",
  },
  "app.download.btnMore": {
    fa: "مشاهده بقیه محصولات",
    en: "View more products",
    ar: "عرض المزيد من المنتجات",
  },
  "app.toast.soon": {
    fa: "🌰 به‌زودی منتشر می‌شود!",
    en: "🌰 Releasing soon!",
    ar: "🌰 سيتم الإطلاق قريباً!",
  },
  "app.mockup.title": {
    fa: "کلیک برای مشاهده تصویر بعدی",
    en: "Click to see the next screenshot",
    ar: "اضغط لعرض الصورة التالية",
  },
  "common.loading": { fa: "در حال بارگذاری…", en: "Loading…", ar: "جارٍ التحميل…" },
  "brand.srTagline": {
    fa: "Parsa Apps — برند نرم‌افزار پرمیوم",
    en: "Parsa Apps — premium software brand",
    ar: "بارسا أبس — علامة برمجيات فاخرة",
  },
  "error.title": {
    fa: "مشکلی در نمایش صفحه پیش آمد",
    en: "Something went wrong while showing this page",
    ar: "حدثت مشكلة أثناء عرض الصفحة",
  },
  "error.text": {
    fa: "لطفاً صفحه را دوباره بارگذاری کنید. اگر مشکل ادامه داشت، کش مرورگر را پاک کنید.",
    en: "Please reload the page. If the problem persists, clear your browser cache.",
    ar: "يرجى إعادة تحميل الصفحة. إذا استمرت المشكلة، امسح ذاكرة التخزين المؤقت للمتصفح.",
  },
  "error.reload": { fa: "بارگذاری مجدد", en: "Reload", ar: "إعادة التحميل" },
  "error.home": { fa: "بازگشت به خانه", en: "Back to home", ar: "العودة إلى الرئيسية" },
  "error.clearCache": { fa: "پاک‌سازی کش", en: "Clear cache", ar: "مسح ذاكرة التخزين المؤقت" },

  /* ============================== PAGE TITLES =============================== */
  "title.home": {
    fa: "پارسا اپس | استودیو نرم‌افزار پرمیوم",
    en: "Parsa Apps | Premium Software Studio",
    ar: "بارسا أبس | استوديو برمجيات فاخر",
  },
  "title.store": {
    fa: "پارسا استور | همه اپلیکیشن‌ها",
    en: "Parsa Store | All apps",
    ar: "متجر بارسا | جميع التطبيقات",
  },
  "title.about": {
    fa: "درباره | فرشاد پارسا — پارسا اپس",
    en: "About | Farshad Parsa — Parsa Apps",
    ar: "عن | فرشاد بارسا — بارسا أبس",
  },
  "title.contact": {
    fa: "تماس | ارتباط با استودیو",
    en: "Contact | Get in touch",
    ar: "تواصل | الاتصال بالاستوديو",
  },
  "title.privacy": {
    fa: "حریم خصوصی | پارسا اپس",
    en: "Privacy | Parsa Apps",
    ar: "الخصوصية | بارسا أبس",
  },
  "title.app": {
    fa: "اپلیکیشن | پارسا اپس",
    en: "App | Parsa Apps",
    ar: "تطبيق | بارسا أبس",
  },

  /* ============================== APP CONTENT =============================== */
  /* ---- fandoghi ---- */
  "app.fandoghi.name": { fa: "جزیره فندقی", en: "Jazireh Fandoghi", ar: "جزيرة الفندقي" },
  "app.fandoghi.tagline": {
    fa: "دنیایی شاد برای یادگیری، بازی و خلاقیت کودکان",
    en: "A joyful world for kids' learning, play and creativity",
    ar: "عالم مرح لتعلم الأطفال واللعب والإبداع",
  },
  "app.fandoghi.description": {
    fa: "یک دنیای آموزشی و سرگرم‌کننده برای کودکان ۳ تا ۹ سال؛ جایی که بازی، داستان و یادگیری به هم می‌رسند.",
    en: "An educational and entertaining world for children aged 3–9; where play, stories and learning meet.",
    ar: "عالم تعليمي وترفيهي للأطفال من ٣ إلى ٩ سنوات؛ حيث تلتقي اللعبة والقصة والتعلم.",
  },
  "app.fandoghi.longDescription": {
    fa: "جزیره فندقی یک اپلیکیشن آموزشی کودکانه است که یادگیری را با بازی، داستان و سرگرمی ترکیب می‌کند. در جدیدترین به‌روزرسانی، بخش‌های آموزشی پایه — حروف الفبا، اعداد، اشکال و رنگ‌ها — با بازی‌ها و تمرین‌های تعاملی به دنیای جزیره اضافه شده‌اند تا هر کودک مانند یک کاشف کوچک، هر لحظه یک تجربه تازه کشف کند.",
    en: "Jazireh Fandoghi is a kids' educational app that blends learning with play, stories and fun. In the latest update, core learning sections — alphabet, numbers, shapes and colors — have been added to the island world through games and interactive exercises, so every child, like a little explorer, discovers something new at every moment.",
    ar: "جزيرة الفندقي تطبيق تعليمي للأطفال يمزج التعلم باللعب والقصص والترفيه. في أحدث تحديث، أُضيفت أقسام التعلم الأساسية — الحروف والأرقام والأشكال والألوان — إلى عالم الجزيرة عبر ألعاب وتمارين تفاعلية، ليكتشف كل طفل، كأنه مستكشف صغير، تجربة جديدة في كل لحظة.",
  },
  "app.fandoghi.category": { fa: "آموزشی", en: "Education", ar: "تعليمي" },
  "app.fandoghi.age": { fa: "۳ تا ۹ سال", en: "3–9 years", ar: "٣ إلى ٩ سنوات" },
  "app.fandoghi.size": { fa: "به‌زودی", en: "Coming soon", ar: "قريباً" },
  "app.fandoghi.version": { fa: "۱.۰.۰ بتا", en: "1.0.0 Beta", ar: "١.٠.٠ بيتا" },
  "app.fandoghi.updated": { fa: "در حال توسعه", en: "In development", ar: "قيد التطوير" },
  "app.fandoghi.feat.0": { fa: "آموزش حروف الفبای فارسی", en: "Persian alphabet letters", ar: "تعليم حروف الأبجدية الفارسية" },
  "app.fandoghi.feat.1": { fa: "یادگیری اعداد و شمارش", en: "Numbers and counting", ar: "تعلم الأرقام والعدّ" },
  "app.fandoghi.feat.2": { fa: "آشنایی با اشکال و رنگ‌ها", en: "Shapes and colors", ar: "التعرّف على الأشكال والألوان" },
  "app.fandoghi.feat.3": { fa: "قصه‌های صوتی و تصویری", en: "Audio and picture stories", ar: "قصص صوتية ومصوّرة" },
  "app.fandoghi.feat.4": { fa: "بازی‌های تعاملی مرحله‌ای", en: "Interactive level-based games", ar: "ألعاب تفاعلية متدرجة" },
  "app.fandoghi.feat.5": { fa: "بخش نقاشی و خلاقیت", en: "Drawing and creativity corner", ar: "قسم الرسم والإبداع" },
  "app.fandoghi.feat.6": { fa: "محیط امن بدون تبلیغات", en: "Safe, ad-free environment", ar: "بيئة آمنة بدون إعلانات" },
  "app.fandoghi.feat.7": { fa: "رابط فارسی و راست‌چین", en: "Persian, RTL-first interface", ar: "واجهة تدعم الاتجاه من اليمين" },
  "app.fandoghi.benefit.0": { fa: "تقویت حافظه و تمرکز کودک", en: "Boosts children's memory and focus", ar: "تقوية ذاكرة الطفل وتركيزه" },
  "app.fandoghi.benefit.1": { fa: "پرورش خلاقیت و مهارت‌های هنری", en: "Nurtures creativity and artistic skills", ar: "تنمية الإبداع والمهارات الفنية" },
  "app.fandoghi.benefit.2": { fa: "آموزش مفاهیم پایه پیش از مدرسه", en: "Teaches core concepts before school", ar: "تعليم المفاهيم الأساسية قبل المدرسة" },
  "app.fandoghi.benefit.3": { fa: "یادگیری غیرمستقیم از طریق بازی", en: "Indirect learning through play", ar: "تعلم غير مباشر من خلال اللعب" },
  "app.fandoghi.video1.title": {
    fa: "تیزر رسمی معرفی جزیره فندقی",
    en: "Official Jazireh Fandoghi teaser",
    ar: "الإعلان الرسمي لجزيرة الفندقي",
  },
  "app.fandoghi.video1.subtitle": {
    fa: "آشنایی با دنیای شاد و آموزشی جزیره فندقی",
    en: "Meet the happy, educational world of Jazireh Fandoghi",
    ar: "تعرّف على عالم جزيرة الفندقي الممتع والتعليمي",
  },
  "app.fandoghi.video2.title": {
    fa: "بررسی جامع و ویدیوی عملکرد اپلیکیشن جزیره فندقی",
    en: "In-depth review & performance video of Jazireh Fandoghi",
    ar: "مراجعة شاملة وفيديو أداء تطبيق جزيرة الفندقي",
  },
  "app.fandoghi.video2.subtitle": {
    fa: "مشاهده کامل بخش‌های بازی، آموزش الفبا و اعداد، قصه‌ها و امکانات محیط برنامه",
    en: "Watch the games, alphabet & numbers learning, stories and all app features in full",
    ar: "شاهد الألعاب وتعليم الحروف والأرقام والقصص وميزات التطبيق كاملة",
  },

  /* ---- kartoniya ---- */
  "app.kartoniya.name": { fa: "کارتونیا", en: "Kartoniya", ar: "كارتونيا" },
  "app.kartoniya.tagline": {
    fa: "فضای امن تماشای کارتون برای کودکان",
    en: "A safe space for kids to watch cartoons",
    ar: "فضاء آمن لمشاهدة الكرتون للأطفال",
  },
  "app.kartoniya.description": {
    fa: "پیدا کردن و تماشای محتوای کودک، با تجربه‌ای رنگی برای خردسال و تنظیمات محافظت‌شده برای والد.",
    en: "Finding and watching kids' content, with a colorful experience for toddlers and protected settings for parents.",
    ar: "إيجاد ومشاهدة محتوى الأطفال، بتجربة ملوّنة للصغار وإعدادات محمية للوالدين.",
  },
  "app.kartoniya.longDescription": {
    fa: "کارتونیا یک تجربه امن تماشای کارتون است که برای خردسالان ساده طراحی شده و برای والدین قابل کنترل است. خانه، دسته‌بندی، جست‌وجوی فارسی و علاقه‌مندی‌ها، پخش با جلو و عقب ۱۰ ثانیه‌ای و ادامه از همان‌جا که کودک ایستاد. قفل والدین با مسئله ریاضی تصادفی و بدون پین قابل حدس، تم روشن و تاریک، و ذخیره محلی علاقه‌مندی‌ها.",
    en: "Kartoniya is a safe cartoon-watching experience, designed simple for toddlers and controllable by parents. Home, categories, Persian search and favorites, 10-second skip forward/back and resume where the child left off. A parental lock with a random math question (no guessable PIN), light & dark themes, and local favorites storage.",
    ar: "كارتونيا تجربة آمنة لمشاهدة الكرتون، صُممت ببساطة للصغار وقابلة للتحكم من الوالدين. الرئيسية والتصنيفات والبحث بالفارسية والمفضلة، وتشغيل مع تقديم وتأخير ١٠ ثوانٍ والمتابعة من حيث توقف الطفل. قفل والدين بسؤال رياضي عشوائي دون رقم سرّي قابل للتخمين، ووضع فاتح وداكن، وحفظ محلي للمفضلة.",
  },
  "app.kartoniya.category": { fa: "سرگرمی و تماشا", en: "Entertainment & TV", ar: "ترفيه ومشاهدة" },
  "app.kartoniya.age": { fa: "۲ تا ۸ سال", en: "2–8 years", ar: "٢ إلى ٨ سنوات" },
  "app.kartoniya.size": { fa: "به‌زودی", en: "Coming soon", ar: "قريباً" },
  "app.kartoniya.version": { fa: "در حال توسعه", en: "In development", ar: "قيد التطوير" },
  "app.kartoniya.updated": { fa: "در حال توسعه", en: "In development", ar: "قيد التطوير" },
  "app.kartoniya.feat.0": { fa: "خانه و دسته‌بندی کارتون‌ها", en: "Home & cartoon categories", ar: "الرئيسية وتصنيفات الكرتون" },
  "app.kartoniya.feat.1": { fa: "جست‌وجوی فارسی", en: "Persian search", ar: "بحث بالفارسية" },
  "app.kartoniya.feat.2": { fa: "پخش با جلو و عقب ۱۰ ثانیه", en: "10-second skip forward & back", ar: "تقديم وتأخير ١٠ ثوانٍ" },
  "app.kartoniya.feat.3": { fa: "ادامه تماشا از همان‌جا", en: "Resume where you left off", ar: "متابعة المشاهدة من نفس المكان" },
  "app.kartoniya.feat.4": { fa: "قفل والدین با مسئله ریاضی", en: "Parental lock with a math question", ar: "قفل الوالدين بسؤال رياضي" },
  "app.kartoniya.feat.5": { fa: "تم روشن و تاریک", en: "Light & dark themes", ar: "وضع فاتح وداكن" },
  "app.kartoniya.feat.6": { fa: "ذخیره محلی علاقه‌مندی‌ها", en: "Local favorites storage", ar: "حفظ محلي للمفضلة" },
  "app.kartoniya.feat.7": { fa: "گرید واکنش‌گرا برای موبایل و تبلت", en: "Responsive grid for phone & tablet", ar: "شبكة متجاوبة للهاتف والجهاز اللوحي" },
  "app.kartoniya.benefit.0": {
    fa: "انتخاب محتوای مناسب و بدون محتوای نامناسب",
    en: "Appropriate content only — nothing inappropriate",
    ar: "محتوى مناسب فقط — بلا محتوى غير لائق",
  },
  "app.kartoniya.benefit.1": {
    fa: "تجربه تماشای ساده و آرام برای خردسال",
    en: "A simple, calm viewing experience for toddlers",
    ar: "تجربة مشاهدة بسيطة وهادئة للصغار",
  },
  "app.kartoniya.benefit.2": {
    fa: "کنترل والدین بر زمان و محتوا",
    en: "Parental control over time and content",
    ar: "تحكم الوالدين بالوقت والمحتوى",
  },

  /* ---- bagh-alfaba ---- */
  "app.bagh-alfaba.name": { fa: "باغ الفبا", en: "Bagh Alfaba", ar: "حديقة الحروف" },
  "app.bagh-alfaba.tagline": {
    fa: "یادگیری حروف الفبا با ماجراجویی در باغ جادویی",
    en: "Learning the alphabet with adventures in a magic garden",
    ar: "تعلم الحروف مع المغامرة في حديقة سحرية",
  },
  "app.bagh-alfaba.description": {
    fa: "یادگیری حروف و الفبای فارسی با بازی و ماجراجویی در یک باغ جادویی؛ مخصوص پیش‌دبستانی و دبستان.",
    en: "Learning Persian letters and the alphabet through play and adventure in a magic garden; for preschool and early school.",
    ar: "تعلم حروف الأبجدية الفارسية باللعب والمغامرة في حديقة سحرية؛ لمرحلة ما قبل المدرسة والابتدائية.",
  },
  "app.bagh-alfaba.longDescription": {
    fa: "باغ الفبا یک ماجراجویی جادویی برای یادگیری حروف الفبای فارسی است. کودکان در یک باغ رنگارنگ قدم می‌زنند، با هر حرف آشنا می‌شوند و با بازی‌های کوچک آن را تثبیت می‌کنند.",
    en: "Bagh Alfaba is a magical adventure for learning the Persian alphabet. Children stroll through a colorful garden, meet each letter and reinforce it with mini games.",
    ar: "حديقة الحروف مغامرة سحرية لتعلم الأبجدية الفارسية. يتجول الأطفال في حديقة ملوّنة، ويتعرفون على كل حرف ويثبّتونه بألعاب صغيرة.",
  },
  "app.bagh-alfaba.category": { fa: "آموزشی", en: "Education", ar: "تعليمي" },
  "app.bagh-alfaba.age": { fa: "۴ تا ۸ سال", en: "4–8 years", ar: "٤ إلى ٨ سنوات" },
  "app.bagh-alfaba.size": { fa: "به‌زودی", en: "Coming soon", ar: "قريباً" },
  "app.bagh-alfaba.version": { fa: "در حال توسعه", en: "In development", ar: "قيد التطوير" },
  "app.bagh-alfaba.updated": { fa: "در حال توسعه", en: "In development", ar: "قيد التطوير" },
  "app.bagh-alfaba.feat.0": { fa: "یادگیری حروف الفبا", en: "Learning the alphabet", ar: "تعلم الحروف الأبجدية" },
  "app.bagh-alfaba.feat.1": { fa: "بازی و ماجراجویی", en: "Play & adventure", ar: "لعب ومغامرة" },
  "app.bagh-alfaba.feat.2": { fa: "تمرین تلفظ", en: "Pronunciation practice", ar: "تدريب النطق" },
  "app.bagh-alfaba.feat.3": { fa: "طراحی کودکانه", en: "Child-friendly design", ar: "تصميم مناسب للأطفال" },
  "app.bagh-alfaba.benefit.0": { fa: "آموزش الفبا پیش از مدرسه", en: "Alphabet learning before school", ar: "تعليم الحروف قبل المدرسة" },
  "app.bagh-alfaba.benefit.1": { fa: "تقویت مهارت خواندن", en: "Strengthens reading skills", ar: "تعزيز مهارة القراءة" },

  /* ---- gheseh-shab ---- */
  "app.gheseh-shab.name": { fa: "قصه‌های شب فندقی", en: "Ghesehaye Shab", ar: "حكايات ليل الفندقي" },
  "app.gheseh-shab.tagline": {
    fa: "قصه‌های صوتی و تعاملی برای خوابی آرام",
    en: "Audio & interactive stories for a calm bedtime",
    ar: "قصص صوتية وتفاعلية لنوم هادئ",
  },
  "app.gheseh-shab.description": {
    fa: "قصه‌های صوتی و تعاملی قبل از خواب با شخصیت‌های محبوب؛ آرامش، خیال‌پردازی و خواب شیرین.",
    en: "Audio and interactive bedtime stories with beloved characters; calm, imagination and sweet sleep.",
    ar: "قصص ما قبل النوم الصوتية والتفاعلية مع الشخصيات المحبوبة؛ صفاء وخيال ونوم حلو.",
  },
  "app.gheseh-shab.longDescription": {
    fa: "قصه‌های شب فندقی مجموعه‌ای از قصه‌های صوتی و تعاملی پیش از خواب است که با شخصیت‌های محبوب جزیره، کودکان را به آرامش و خیال‌پردازی دعوت می‌کند.",
    en: "Ghesehaye Shab is a collection of audio and interactive bedtime stories that, with the island's beloved characters, invites children into calm and imagination.",
    ar: "حكايات ليل الفندقي مجموعة قصص صوتية وتفاعلية قبل النوم تدعو الأطفال، مع شخصيات الجزيرة المحبوبة، إلى الصفاء والخيال.",
  },
  "app.gheseh-shab.category": { fa: "قصه و خواب", en: "Stories & sleep", ar: "قصص ونوم" },
  "app.gheseh-shab.age": { fa: "۳ تا ۸ سال", en: "3–8 years", ar: "٣ إلى ٨ سنوات" },
  "app.gheseh-shab.size": { fa: "به‌زودی", en: "Coming soon", ar: "قريباً" },
  "app.gheseh-shab.version": { fa: "در حال توسعه", en: "In development", ar: "قيد التطوير" },
  "app.gheseh-shab.updated": { fa: "در حال توسعه", en: "In development", ar: "قيد التطوير" },
  "app.gheseh-shab.feat.0": { fa: "قصه‌های صوتی فارسی", en: "Persian audio stories", ar: "قصص صوتية فارسية" },
  "app.gheseh-shab.feat.1": { fa: "شخصیت‌های جزیره", en: "Island characters", ar: "شخصيات الجزيرة" },
  "app.gheseh-shab.feat.2": { fa: "حالت شب", en: "Night mode", ar: "الوضع الليلي" },
  "app.gheseh-shab.feat.3": { fa: "تنظیم زمان قصه", en: "Story timer", ar: "مؤقت وقت القصة" },
  "app.gheseh-shab.benefit.0": { fa: "تقویت تخیل", en: "Boosts imagination", ar: "تنمية الخيال" },
  "app.gheseh-shab.benefit.1": { fa: "آرامش پیش از خواب", en: "Calm before sleep", ar: "هدوء قبل النوم" },

  /* ---- riyazidan ---- */
  "app.riyazidan.name": { fa: "ریاضیدان کوچولو", en: "Riyazidan", ar: "الرياضي الصغير" },
  "app.riyazidan.tagline": {
    fa: "آموزش شیرین ریاضی با بازی و جایزه",
    en: "Sweet math learning with games and rewards",
    ar: "تعلم الرياضيات بمتعة مع الألعاب والجوائز",
  },
  "app.riyazidan.description": {
    fa: "آموزش شیرین ریاضی با بازی، جایزه و چالش‌های مرحله‌ای؛ از شمارش تا ضرب، بدون استرس.",
    en: "Sweet math learning with games, rewards and level challenges; from counting to multiplication, stress-free.",
    ar: "تعلم الرياضيات بمتعة مع الألعاب والجوائز وتحديات متدرجة؛ من العدّ إلى الضرب، بلا توتر.",
  },
  "app.riyazidan.longDescription": {
    fa: "ریاضیدان کوچولو ریاضی را با بازی، جایزه و چالش‌های مرحله‌ای برای کودکان شیرین می‌کند؛ از شمارش ساده تا ضرب، همگی بدون استرس و با تشویق مداوم.",
    en: "Riyazidan makes math sweet for kids with games, rewards and level-based challenges; from simple counting to multiplication, all stress-free with constant encouragement.",
    ar: "يجعل الرياضي الصغير الرياضيات ممتعة للأطفال بالألعاب والجوائز والتحديات المتدرجة؛ من العدّ البسيط إلى الضرب، كل ذلك بلا توتر مع تشجيع مستمر.",
  },
  "app.riyazidan.category": { fa: "آموزشی", en: "Education", ar: "تعليمي" },
  "app.riyazidan.age": { fa: "۵ تا ۹ سال", en: "5–9 years", ar: "٥ إلى ٩ سنوات" },
  "app.riyazidan.size": { fa: "به‌زودی", en: "Coming soon", ar: "قريباً" },
  "app.riyazidan.version": { fa: "در حال توسعه", en: "In development", ar: "قيد التطوير" },
  "app.riyazidan.updated": { fa: "در حال توسعه", en: "In development", ar: "قيد التطوير" },
  "app.riyazidan.feat.0": { fa: "شمارش و اعداد", en: "Counting & numbers", ar: "العدّ والأرقام" },
  "app.riyazidan.feat.1": { fa: "جمع و تفریق", en: "Addition & subtraction", ar: "الجمع والطرح" },
  "app.riyazidan.feat.2": { fa: "ضرب مرحله‌ای", en: "Step-by-step multiplication", ar: "الضرب المتدرج" },
  "app.riyazidan.feat.3": { fa: "جایزه و امتیاز", en: "Rewards & points", ar: "جوائز ونقاط" },
  "app.riyazidan.benefit.0": { fa: "تقویت پایه ریاضی", en: "Strengthens math foundations", ar: "تقوية أساس الرياضيات" },
  "app.riyazidan.benefit.1": { fa: "اعتمادبه‌نفس در حل مسئله", en: "Confidence in problem solving", ar: "الثقة في حل المشكلات" },

  /* ---- ashpazkhaneh ---- */
  "app.ashpazkhaneh.name": { fa: "آشپزخانه فندقی", en: "Ashpazkhaneh", ar: "مطبخ الفندقي" },
  "app.ashpazkhaneh.tagline": {
    fa: "بازی آشپزی و آموزش تغذیه سالم",
    en: "A cooking game teaching healthy eating",
    ar: "لعبة طبخ وتعليم الغذاء الصحي",
  },
  "app.ashpazkhaneh.description": {
    fa: "بازی آشپزی و آموزش تغذیه سالم؛ دستور پخت‌های ساده و سرگرم‌کننده برای کودکان و خانواده.",
    en: "A cooking game and healthy-eating teacher; simple, fun recipes for kids and families.",
    ar: "لعبة طبخ وتعليم التغذية الصحية؛ وصفات بسيطة وممتعة للأطفال والعائلة.",
  },
  "app.ashpazkhaneh.longDescription": {
    fa: "آشپزخانه فندقی یک بازی آشپزی شاد و آموزشی است که کودکان را با مواد سالم، دستورهای ساده و مهارت‌های آشپزخانه آشنا می‌کند.",
    en: "Ashpazkhaneh is a cheerful, educational cooking game that introduces children to healthy ingredients, simple recipes and kitchen skills.",
    ar: "مطبخ الفندقي لعبة طبخ مرحّة وتعليمية تعرّف الأطفال على المكونات الصحية والوصفات البسيطة ومهارات المطبخ.",
  },
  "app.ashpazkhaneh.category": { fa: "بازی و آشپزی", en: "Games & cooking", ar: "ألعاب وطهي" },
  "app.ashpazkhaneh.age": { fa: "۴ تا ۹ سال", en: "4–9 years", ar: "٤ إلى ٩ سنوات" },
  "app.ashpazkhaneh.size": { fa: "به‌زودی", en: "Coming soon", ar: "قريباً" },
  "app.ashpazkhaneh.version": { fa: "در حال توسعه", en: "In development", ar: "قيد التطوير" },
  "app.ashpazkhaneh.updated": { fa: "در حال توسعه", en: "In development", ar: "قيد التطوير" },
  "app.ashpazkhaneh.feat.0": { fa: "دستورهای ساده", en: "Simple recipes", ar: "وصفات بسيطة" },
  "app.ashpazkhaneh.feat.1": { fa: "مواد سالم", en: "Healthy ingredients", ar: "مكونات صحية" },
  "app.ashpazkhaneh.feat.2": { fa: "بازی مرحله‌ای", en: "Level-based play", ar: "لعب متدرج" },
  "app.ashpazkhaneh.feat.3": { fa: "یادگیری تغذیه", en: "Nutrition learning", ar: "تعلم التغذية" },
  "app.ashpazkhaneh.benefit.0": { fa: "آشنایی با تغذیه سالم", en: "Introduces healthy eating", ar: "التعرّف على الغذاء الصحي" },
  "app.ashpazkhaneh.benefit.1": { fa: "مهارت هماهنگی دست و چشم", en: "Hand-eye coordination skills", ar: "مهارة التناسق بين اليد والعين" },

  /* ---- sayarehnama ---- */
  "app.sayarehnama.name": { fa: "سیاره‌نما", en: "Sayarehnama", ar: "مرصد الكواكب" },
  "app.sayarehnama.tagline": {
    fa: "ماجراجویی فضایی و آشنایی با نجوم",
    en: "Space adventures and an intro to astronomy",
    ar: "مغامرة فضائية والتعرّف على الفلك",
  },
  "app.sayarehnama.description": {
    fa: "ماجراجویی فضایی و آشنایی کودکان با ستاره‌ها، سیاره‌ها و نجوم؛ با گرافیک خیره‌کننده.",
    en: "Space adventures introducing children to stars, planets and astronomy; with stunning graphics.",
    ar: "مغامرات فضائية تعرّف الأطفال على النجوم والكواكب وعلم الفلك؛ برسوميات مذهلة.",
  },
  "app.sayarehnama.longDescription": {
    fa: "سیاره‌نما کودکان را به سفری فضایی می‌برد و با ستاره‌ها، سیاره‌ها و پدیده‌های نجومی آشنا می‌کند؛ با گرافیک خیره‌کننده و داستان‌های علمی شیرین.",
    en: "Sayarehnama takes children on a space journey, introducing stars, planets and astronomical phenomena; with stunning graphics and sweet science stories.",
    ar: "يأخذ مرصد الكواكب الأطفال في رحلة فضائية ويعرّفهم على النجوم والكواكب والظواهر الفلكية؛ برسوميات مذهلة وقصص علمية جميلة.",
  },
  "app.sayarehnama.category": { fa: "دانش و ماجراجویی", en: "Science & adventure", ar: "علوم ومغامرة" },
  "app.sayarehnama.age": { fa: "۵ تا ۱۰ سال", en: "5–10 years", ar: "٥ إلى ١٠ سنوات" },
  "app.sayarehnama.size": { fa: "به‌زودی", en: "Coming soon", ar: "قريباً" },
  "app.sayarehnama.version": { fa: "در حال توسعه", en: "In development", ar: "قيد التطوير" },
  "app.sayarehnama.updated": { fa: "در حال توسعه", en: "In development", ar: "قيد التطوير" },
  "app.sayarehnama.feat.0": { fa: "گشت‌وگذار در فضا", en: "Explore space", ar: "جولات في الفضاء" },
  "app.sayarehnama.feat.1": { fa: "آشنایی با سیاره‌ها", en: "Meet the planets", ar: "التعرّف على الكواكب" },
  "app.sayarehnama.feat.2": { fa: "انیمیشن‌های علمی", en: "Science animations", ar: "رسوم متحركة علمية" },
  "app.sayarehnama.feat.3": { fa: "داستان‌های فضایی", en: "Space stories", ar: "قصص فضائية" },
  "app.sayarehnama.benefit.0": { fa: "پرورش کنجکاوی علمی", en: "Nurtures scientific curiosity", ar: "تنمية الفضول العلمي" },
  "app.sayarehnama.benefit.1": { fa: "آشنایی با نجوم", en: "An intro to astronomy", ar: "التعرّف على علم الفلك" },

  /* ---- negar-khaneh ---- */
  "app.negar-khaneh.name": { fa: "نگارخانه فندقی", en: "Negar Khaneh", ar: "معرض الفندقي" },
  "app.negar-khaneh.tagline": {
    fa: "استودیوی نقاشی و خلاقیت کودکان",
    en: "A painting & creativity studio for kids",
    ar: "استوديو الرسم والإبداع للأطفال",
  },
  "app.negar-khaneh.description": {
    fa: "استودیوی نقاشی و خلاقیت کودکان؛ ابزارهای حرفه‌ای، براش‌های جادویی و آلبوم شاهکارها.",
    en: "A kids' painting and creativity studio; pro tools, magic brushes and a masterpiece album.",
    ar: "استوديو رسم وإبداع للأطفال؛ أدوات احترافية وفرش سحرية وألبوم للتحف الفنية.",
  },
  "app.negar-khaneh.longDescription": {
    fa: "نگارخانه فندقی یک استودیوی نقاشی دیجیتال برای کودکان است؛ با براش‌های جادویی، ابزارهای حرفه‌ای و آلبومی برای نگهداری شاهکارهای کوچک.",
    en: "Negar Khaneh is a digital painting studio for children; with magic brushes, professional tools and an album to keep their little masterpieces.",
    ar: "معرض الفندقي استوديو رسم رقمي للأطفال؛ بفرش سحرية وأدوات احترافية وألبوم لحفظ تحفهم الصغيرة.",
  },
  "app.negar-khaneh.category": { fa: "هنر و خلاقیت", en: "Art & creativity", ar: "فنون وإبداع" },
  "app.negar-khaneh.age": { fa: "۳ تا ۱۰ سال", en: "3–10 years", ar: "٣ إلى ١٠ سنوات" },
  "app.negar-khaneh.size": { fa: "به‌زودی", en: "Coming soon", ar: "قريباً" },
  "app.negar-khaneh.version": { fa: "در حال توسعه", en: "In development", ar: "قيد التطوير" },
  "app.negar-khaneh.updated": { fa: "در حال توسعه", en: "In development", ar: "قيد التطوير" },
  "app.negar-khaneh.feat.0": { fa: "براش‌های جادویی", en: "Magic brushes", ar: "فرش سحرية" },
  "app.negar-khaneh.feat.1": { fa: "ابزارهای رنگ و شکل", en: "Color & shape tools", ar: "أدوات الألوان والأشكال" },
  "app.negar-khaneh.feat.2": { fa: "آلبوم نقاشی", en: "Drawing album", ar: "ألبوم الرسومات" },
  "app.negar-khaneh.feat.3": { fa: "ذخیره و اشتراک", en: "Save & share", ar: "حفظ ومشاركة" },
  "app.negar-khaneh.benefit.0": { fa: "پرورش خلاقیت", en: "Nurtures creativity", ar: "تنمية الإبداع" },
  "app.negar-khaneh.benefit.1": { fa: "مهارت‌های هنری", en: "Artistic skills", ar: "مهارات فنية" },
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
  t: (k) => dict[k]?.fa ?? k,
});

const STORAGE_KEY = "parsa-lang";

function readInitialLang(): Lang {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "fa" || saved === "en" || saved === "ar") return saved;
  } catch {
    // ignore
  }
  return "fa";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);
  const dir = LANG_META[lang].dir;

  useEffect(() => {
    document.documentElement.lang = LANG_META[lang].htmlLang;
    document.documentElement.dir = LANG_META[lang].dir;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, [lang]);

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

/**
 * Translate outside React/hooks (class components, error screens).
 * Reads the active language from <html lang>.
 */
export function tStatic(key: string): string {
  try {
    const l = document.documentElement.lang;
    const lang: Lang = l === "en" || l === "ar" ? l : "fa";
    return dict[key]?.[lang] ?? key;
  } catch {
    return dict[key]?.fa ?? key;
  }
}
