import { Suspense, lazy, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";

// Three.js/WebGL is heavy — load it after first paint.
const WebGLBackground = lazy(() => import("@/components/WebGLBackground"));

export default function SiteLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  usePageTitle(location.pathname);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg)]">
      {/* ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-40 top-[-10%] h-[520px] w-[520px] rounded-full bg-neon-violet/20 blur-[130px] animate-pulseGlow" />
        <div className="absolute -right-40 top-[30%] h-[460px] w-[460px] rounded-full bg-neon-blue/15 blur-[130px] animate-pulseGlow" style={{ animationDelay: "1.4s" }} />
        <div className="absolute bottom-[-12%] left-[30%] h-[420px] w-[420px] rounded-full bg-neon-cyan/10 blur-[140px] animate-pulseGlow" style={{ animationDelay: "2.2s" }} />
        <div className="grid-bg absolute inset-0" />
      </div>
      <Suspense fallback={null}>
        <WebGLBackground />
      </Suspense>

      <Cursor />
      <Navbar />

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className="relative z-10"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  );
}

function usePageTitle(pathname: string) {
  useEffect(() => {
    const titles: Record<string, string> = {
      "/": "پارسا اپس | استودیو نرم‌افزار پرمیوم",
      "/store": "پارسا استور | همه اپلیکیشن‌ها",
      "/about": "درباره | فرشاد پارسا — پارسا اپس",
      "/contact": "تماس | ارتباط با استودیو",
      "/privacy": "حریم خصوصی | پارسا اپس",
    };
    let title = titles[pathname] ?? "پارسا اپس | استودیو نرم‌افزار";
    const appMatch = pathname.match(/^\/apps\/([a-z-]+)$/);
    if (appMatch) {
      const apps: Record<string, string> = {
        fandoghi: "جزیره فندقی | Parsa Apps",
        kartoniya: "کارتونیا | Parsa Apps",
      };
      title = apps[appMatch[1]] ?? "اپلیکیشن | پارسا اپس";
    }
    document.title = title;
  }, [pathname]);
}
