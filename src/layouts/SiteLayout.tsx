import { Suspense, lazy, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";

// Three.js/WebGL is heavy — load it after first paint.
const WebGLBackground = lazy(() => import("@/components/WebGLBackground"));

const EASE = [0.22, 1, 0.36, 1] as const;

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });
  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 top-0 z-[96] h-[3px] origin-left bg-gradient-to-r from-neon-violet via-neon-blue to-neon-cyan"
      style={{ scaleX, boxShadow: "0 0 18px rgba(0,198,255,0.6)" }}
      aria-hidden="true"
    />
  );
}

export default function SiteLayout() {
  const location = useLocation();

  useEffect(() => {
    // safe scroll — instant is not supported everywhere, fall back to auto
    try {
      window.scrollTo({ top: 0, behavior: "auto" as ScrollBehavior });
    } catch {
      try {
        window.scrollTo(0, 0);
      } catch {
        // ignore
      }
    }
  }, [location.pathname]);

  usePageTitle(location.pathname);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg)]">
      {/* ambient animated background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="aurora absolute inset-0" />
        <div
          className="orb animate-orb absolute -left-40 top-[-10%] h-[520px] w-[520px] bg-neon-violet/25"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="orb animate-orb absolute -right-40 top-[30%] h-[460px] w-[460px] bg-neon-blue/20"
          style={{ animationDelay: "1.6s" }}
        />
        <div
          className="orb animate-orb absolute bottom-[-12%] left-[30%] h-[420px] w-[420px] bg-neon-cyan/15"
          style={{ animationDelay: "3.1s" }}
        />
        <div className="grid-bg absolute inset-0" />
      </div>

      <Suspense fallback={null}>
        <WebGLBackground />
      </Suspense>

      <ScrollProgress />
      <Cursor />
      <Navbar />

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className="relative z-10"
          // Start visible (opacity 1) then animate from hidden -> visible.
          // If framer-motion fails, content is still visible instead of black screen.
          style={{ opacity: 1 }}
          initial={{ opacity: 0, y: 22, scale: 0.996, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -14, scale: 1.004, filter: "blur(8px)" }}
          transition={{ duration: 0.48, ease: EASE }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  );
}

function usePageTitle(pathname: string) {
  const { t } = useI18n();
  useEffect(() => {
    let title = t("title.home");
    switch (pathname) {
      case "/store":
        title = t("title.store");
        break;
      case "/about":
        title = t("title.about");
        break;
      case "/contact":
        title = t("title.contact");
        break;
      case "/privacy":
        title = t("title.privacy");
        break;
      default: {
        const appMatch = pathname.match(/^\/apps\/([a-z-]+)$/);
        if (appMatch) {
          title = `${t(`app.${appMatch[1]}.name`)} | Parsa Apps`;
        }
        break;
      }
    }
    try {
      document.title = title;
    } catch {
      // ignore
    }
  });
}
