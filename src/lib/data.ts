export type AppStatus = "released" | "beta" | "development";

export interface AppVideo {
  title: string;
  subtitle?: string;
  src: string;
  poster?: string;
}

export interface StudioApp {
  slug: string;
  name: string;
  nameEn: string;
  tagline: string;
  description: string;
  longDescription: string;
  icon: string;
  cover: string;
  screenshots: string[];
  features: string[];
  educationalBenefits: string[];
  technology: string[];
  status: AppStatus;
  category: string;
  ageRange: string;
  size: string;
  version: string;
  updated: string;
  androidMin: string;
  video?: string;
  videos?: AppVideo[];
  palette: {
    from: string;
    to: string;
    accent: string;
  };
}

export const CONTACT = {
  email: "farshadparsa2019@gmail.com",
  telegram: "https://t.me/Parsaappsadmin",
  telegramHandle: "@Parsaappsadmin",
  instagram: "https://instagram.com/parsa_apps",
  instagramHandle: "@parsa_apps",
};

export const apps: StudioApp[] = [
  {
    slug: "fandoghi",
    name: "جزیره فندقی",
    nameEn: "Jazireh Fandoghi",
    tagline: "دنیایی شاد برای یادگیری، بازی و خلاقیت کودکان",
    description:
      "یک دنیای آموزشی و سرگرم‌کننده برای کودکان ۳ تا ۹ سال؛ جایی که بازی، داستان و یادگیری به هم می‌رسند.",
    longDescription:
      "جزیره فندقی یک اپلیکیشن آموزشی کودکانه است که یادگیری را با بازی، داستان و سرگرمی ترکیب می‌کند. در جدیدترین به‌روزرسانی، بخش‌های آموزشی پایه — حروف الفبا، اعداد، اشکال و رنگ‌ها — با بازی‌ها و تمرین‌های تعاملی به دنیای جزیره اضافه شده‌اند تا هر کودک مانند یک کاشف کوچک، هر لحظه یک تجربه تازه کشف کند.",
    icon: "/assets/brand/jazireh-fandoghi-app-icon-512.png",
    cover: "/assets/images/island/jazireh-promo-cover.jpg",
    screenshots: [
      "/assets/screenshots/1_home.png",
      "/assets/screenshots/2_learning.png",
      "/assets/screenshots/3_games.png",
      "/assets/screenshots/4_stories.png",
      "/assets/screenshots/5_progress.png",
      "/assets/screenshots/6_missions.png",
      "/assets/screenshots/7_profile.png",
      "/assets/screenshots/8_safe.png",
    ],
    features: [
      "آموزش حروف الفبای فارسی",
      "یادگیری اعداد و شمارش",
      "آشنایی با اشکال و رنگ‌ها",
      "قصه‌های صوتی و تصویری",
      "بازی‌های تعاملی مرحله‌ای",
      "بخش نقاشی و خلاقیت",
      "محیط امن بدون تبلیغات",
      "رابط فارسی و راست‌چین",
    ],
    educationalBenefits: [
      "تقویت حافظه و تمرکز کودک",
      "پرورش خلاقیت و مهارت‌های هنری",
      "آموزش مفاهیم پایه پیش از مدرسه",
      "یادگیری غیرمستقیم از طریق بازی",
    ],
    technology: ["Flutter", "Dart", "Firebase", "Android", "UI/UX"],
    status: "development",
    category: "آموزشی",
    ageRange: "۳ تا ۹ سال",
    size: "52 MB",
    version: "1.0.0",
    updated: "مرداد ۱۴۰۵",
    androidMin: "Android 8+",
    video: "/assets/videos/jazire_fandoqi_promo_portrait.mp4",
    videos: [
      {
        title: "تیزر رسمی معرفی جزیره فندقی",
        subtitle: "آشنایی با دنیای شاد و آموزشی جزیره فندقی",
        src: "/assets/videos/jazire_fandoqi_promo_portrait.mp4",
        poster: "/assets/images/island/jazireh-promo-cover.jpg",
      },
      {
        title: "بررسی جامع و ویدیوی عملکرد اپلیکیشن جزیره فندقی",
        subtitle: "مشاهده کامل بخش‌های بازی، آموزش الفبا و اعداد، قصه‌ها و امکانات محیط برنامه",
        src: "/assets/videos/VideoCompress_%D8%A8%D8%B1%D8%B1%D8%B3%DB%8C_%D8%A7%D9%BE%D9%84%DB%8C%DA%A9%DB%8C%D8%B4%D9%86_%D8%AC%D8%B2%DB%8C%D8%B1%D9%87_%D9%81%D9%86%D8%AF%D9%82%DB%8C.mp4",
        poster: "/assets/screenshots/1_home.png",
      },
    ],
    palette: { from: "#4fd8eb", to: "#ffb347", accent: "#7ef2ff" },
  },
  {
    slug: "kartoniya",
    name: "کارتونیا",
    nameEn: "Kartoniya",
    tagline: "فضای امن تماشای کارتون برای کودکان",
    description:
      "پیدا کردن و تماشای محتوای کودک، با تجربه‌ای رنگی برای خردسال و تنظیمات محافظت‌شده برای والد.",
    longDescription:
      "کارتونیا یک تجربه امن تماشای کارتون است که برای خردسالان ساده طراحی شده و برای والدین قابل کنترل است. خانه، دسته‌بندی، جست‌وجوی فارسی و علاقه‌مندی‌ها، پخش با جلو و عقب ۱۰ ثانیه‌ای و ادامه از همان‌جا که کودک ایستاد. قفل والدین با مسئله ریاضی تصادفی و بدون پین قابل حدس، تم روشن و تاریک، و ذخیره محلی علاقه‌مندی‌ها.",
    icon: "/assets/images/app-kartoniya.jpg",
    cover: "/assets/images/app-kartoniya.jpg",
    screenshots: [],
    features: [
      "خانه و دسته‌بندی کارتون‌ها",
      "جست‌وجوی فارسی",
      "پخش با جلو و عقب ۱۰ ثانیه",
      "ادامه تماشا از همان‌جا",
      "قفل والدین با مسئله ریاضی",
      "تم روشن و تاریک",
      "ذخیره محلی علاقه‌مندی‌ها",
      "گرید واکنش‌گرا برای موبایل و تبلت",
    ],
    educationalBenefits: [
      "انتخاب محتوای مناسب و بدون محتوای نامناسب",
      "تجربه تماشای ساده و آرام برای خردسال",
      "کنترل والدین بر زمان و محتوا",
    ],
    technology: ["Flutter", "Dart", "Firebase", "Material 3", "Android"],
    status: "development",
    category: "سرگرمی و تماشا",
    ageRange: "۲ تا ۸ سال",
    size: "—",
    version: "۱.۱",
    updated: "در حال توسعه",
    androidMin: "Android 8+",
    palette: { from: "#ff5fa2", to: "#7c5cff", accent: "#ffb3d1" },
  },
  {
    slug: "bagh-alfaba",
    name: "باغ الفبا",
    nameEn: "Bagh Alfaba",
    tagline: "یادگیری حروف الفبا با ماجراجویی در باغ جادویی",
    description: "یادگیری حروف و الفبای فارسی با بازی و ماجراجویی در یک باغ جادویی؛ مخصوص پیش‌دبستانی و دبستان.",
    longDescription:
      "باغ الفبا یک ماجراجویی جادویی برای یادگیری حروف الفبای فارسی است. کودکان در یک باغ رنگارنگ قدم می‌زنند، با هر حرف آشنا می‌شوند و با بازی‌های کوچک آن را تثبیت می‌کنند.",
    icon: "/assets/images/upcoming/bagh-alfaba.png",
    cover: "/assets/images/upcoming/bagh-alfaba.png",
    screenshots: [],
    features: ["یادگیری حروف الفبا", "بازی و ماجراجویی", "تمرین تلفظ", "طراحی کودکانه"],
    educationalBenefits: ["آموزش الفبا پیش از مدرسه", "تقویت مهارت خواندن"],
    technology: ["Flutter", "Dart", "Android"],
    status: "development",
    category: "آموزشی",
    ageRange: "۴ تا ۸ سال",
    size: "—",
    version: "—",
    updated: "در حال توسعه",
    androidMin: "Android 8+",
    palette: { from: "#7ddc9a", to: "#2e9e5a", accent: "#b6ffd0" },
  },
  {
    slug: "gheseh-shab",
    name: "قصه‌های شب فندقی",
    nameEn: "Ghesehaye Shab",
    tagline: "قصه‌های صوتی و تعاملی برای خوابی آرام",
    description: "قصه‌های صوتی و تعاملی قبل از خواب با شخصیت‌های محبوب؛ آرامش، خیال‌پردازی و خواب شیرین.",
    longDescription:
      "قصه‌های شب فندقی مجموعه‌ای از قصه‌های صوتی و تعاملی پیش از خواب است که با شخصیت‌های محبوب جزیره، کودکان را به آرامش و خیال‌پردازی دعوت می‌کند.",
    icon: "/assets/images/upcoming/gheseh-shab.png",
    cover: "/assets/images/upcoming/gheseh-shab.png",
    screenshots: [],
    features: ["قصه‌های صوتی فارسی", "شخصیت‌های جزیره", "حالت شب", "تنظیم زمان قصه"],
    educationalBenefits: ["تقویت تخیل", "آرامش پیش از خواب"],
    technology: ["Flutter", "Dart", "Firebase"],
    status: "development",
    category: "قصه و خواب",
    ageRange: "۳ تا ۸ سال",
    size: "—",
    version: "—",
    updated: "در حال توسعه",
    androidMin: "Android 8+",
    palette: { from: "#8b7cff", to: "#4a3ba0", accent: "#c8b6ff" },
  },
  {
    slug: "riyazidan",
    name: "ریاضیدان کوچولو",
    nameEn: "Riyazidan",
    tagline: "آموزش شیرین ریاضی با بازی و جایزه",
    description: "آموزش شیرین ریاضی با بازی، جایزه و چالش‌های مرحله‌ای؛ از شمارش تا ضرب، بدون استرس.",
    longDescription:
      "ریاضیدان کوچولو ریاضی را با بازی، جایزه و چالش‌های مرحله‌ای برای کودکان شیرین می‌کند؛ از شمارش ساده تا ضرب، همگی بدون استرس و با تشویق مداوم.",
    icon: "/assets/images/upcoming/riyazidan.png",
    cover: "/assets/images/upcoming/riyazidan.png",
    screenshots: [],
    features: ["شمارش و اعداد", "جمع و تفریق", "ضرب مرحله‌ای", "جایزه و امتیاز"],
    educationalBenefits: ["تقویت پایه ریاضی", "اعتمادبه‌نفس در حل مسئله"],
    technology: ["Flutter", "Dart", "Android"],
    status: "development",
    category: "آموزشی",
    ageRange: "۵ تا ۹ سال",
    size: "—",
    version: "—",
    updated: "در حال توسعه",
    androidMin: "Android 8+",
    palette: { from: "#ff8a5c", to: "#ef7a1a", accent: "#ffd0a6" },
  },
  {
    slug: "ashpazkhaneh",
    name: "آشپزخانه فندقی",
    nameEn: "Ashpazkhaneh",
    tagline: "بازی آشپزی و آموزش تغذیه سالم",
    description: "بازی آشپزی و آموزش تغذیه سالم؛ دستور پخت‌های ساده و سرگرم‌کننده برای کودکان و خانواده.",
    longDescription:
      "آشپزخانه فندقی یک بازی آشپزی شاد و آموزشی است که کودکان را با مواد سالم، دستورهای ساده و مهارت‌های آشپزخانه آشنا می‌کند.",
    icon: "/assets/images/upcoming/ashpazkhaneh.png",
    cover: "/assets/images/upcoming/ashpazkhaneh.png",
    screenshots: [],
    features: ["دستورهای ساده", "مواد سالم", "بازی مرحله‌ای", "یادگیری تغذیه"],
    educationalBenefits: ["آشنایی با تغذیه سالم", "مهارت هماهنگی دست و چشم"],
    technology: ["Flutter", "Dart", "Android"],
    status: "development",
    category: "بازی و آشپزی",
    ageRange: "۴ تا ۹ سال",
    size: "—",
    version: "—",
    updated: "در حال توسعه",
    androidMin: "Android 8+",
    palette: { from: "#f9c74f", to: "#f8961e", accent: "#ffe6a0" },
  },
  {
    slug: "sayarehnama",
    name: "سیاره‌نما",
    nameEn: "Sayarehnama",
    tagline: "ماجراجویی فضایی و آشنایی با نجوم",
    description: "ماجراجویی فضایی و آشنایی کودکان با ستاره‌ها، سیاره‌ها و نجوم؛ با گرافیک خیره‌کننده.",
    longDescription:
      "سیاره‌نما کودکان را به سفری فضایی می‌برد و با ستاره‌ها، سیاره‌ها و پدیده‌های نجومی آشنا می‌کند؛ با گرافیک خیره‌کننده و داستان‌های علمی شیرین.",
    icon: "/assets/images/upcoming/sayarehnama.png",
    cover: "/assets/images/upcoming/sayarehnama.png",
    screenshots: [],
    features: ["گشت‌وگذار در فضا", "آشنایی با سیاره‌ها", "انیمیشن‌های علمی", "داستان‌های فضایی"],
    educationalBenefits: ["پرورش کنجکاوی علمی", "آشنایی با نجوم"],
    technology: ["Flutter", "Dart", "Android", "Three.js"],
    status: "development",
    category: "دانش و ماجراجویی",
    ageRange: "۵ تا ۱۰ سال",
    size: "—",
    version: "—",
    updated: "در حال توسعه",
    androidMin: "Android 8+",
    palette: { from: "#7c5cff", to: "#00c6ff", accent: "#b4d7ff" },
  },
  {
    slug: "negar-khaneh",
    name: "نگارخانه فندقی",
    nameEn: "Negar Khaneh",
    tagline: "استودیوی نقاشی و خلاقیت کودکان",
    description: "استودیوی نقاشی و خلاقیت کودکان؛ ابزارهای حرفه‌ای، براش‌های جادویی و آلبوم شاهکارها.",
    longDescription:
      "نگارخانه فندقی یک استودیوی نقاشی دیجیتال برای کودکان است؛ با براش‌های جادویی، ابزارهای حرفه‌ای و آلبومی برای نگهداری شاهکارهای کوچک.",
    icon: "/assets/images/upcoming/negar-khaneh.png",
    cover: "/assets/images/upcoming/negar-khaneh.png",
    screenshots: [],
    features: ["براش‌های جادویی", "ابزارهای رنگ و شکل", "آلبوم نقاشی", "ذخیره و اشتراک"],
    educationalBenefits: ["پرورش خلاقیت", "مهارت‌های هنری"],
    technology: ["Flutter", "Dart", "Android"],
    status: "development",
    category: "هنر و خلاقیت",
    ageRange: "۳ تا ۱۰ سال",
    size: "—",
    version: "—",
    updated: "در حال توسعه",
    androidMin: "Android 8+",
    palette: { from: "#ff5fa2", to: "#ffa7b6", accent: "#ffd6e4" },
  },
];

export function getApp(slug: string) {
  return apps.find((a) => a.slug === slug);
}

export const skills = [
  { name: "Flutter", year: "Strong", icon: "💠", level: 92 },
  { name: "Dart", year: "Strong", icon: "🎯", level: 90 },
  { name: "Kotlin", year: "Good", icon: "🟣", level: 82 },
  { name: "Android", year: "Strong", icon: "🤖", level: 88 },
  { name: "Java", year: "Good", icon: "☕", level: 78 },
  { name: "Firebase", year: "Good", icon: "🔥", level: 80 },
  { name: "UI/UX Design", year: "Strong", icon: "🎨", level: 90 },
  { name: "Git & Version Control", year: "Good", icon: "🔧", level: 80 },
];

export const timeline = [
  { year: "آغاز", title: "شروع مسیر", text: "آشنایی عمیق با برنامه‌نویسی و دنیای اپلیکیشن‌های موبایل." },
  { year: "یادگیری", title: "یادگیری مستمر", text: "تسلط بر Flutter، Dart، Kotlin و Android." },
  { year: "پروژه‌ها", title: "ساخت پروژه‌های واقعی", text: "طراحی و توسعه اپلیکیشن‌های آموزشی و خلاقانه برای کودکان و خانواده‌ها." },
  { year: "استودیو", title: "تأسیس پارسا اپس", text: "تبدیل تجربه‌ها به یک استودیوی نرم‌افزار با کیفیت و برند واقعی." },
];

export const projects = apps.map((a) => ({
  slug: a.slug,
  title: a.name,
  description: a.description,
  image: a.cover,
  technologies: a.technology,
  status: a.status === "development" ? "در حال توسعه" : "منتشر شده",
  color: a.palette.accent,
}));
