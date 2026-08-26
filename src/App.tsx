import { Suspense, lazy, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import SiteLayout from "@/layouts/SiteLayout";
import Preloader from "@/components/Preloader";
import { useI18n } from "@/lib/i18n";
import ErrorBoundary from "@/components/ErrorBoundary";

const Home = lazy(() => import("@/pages/Home"));
const Store = lazy(() => import("@/pages/Store"));
const AppDetail = lazy(() => import("@/pages/AppDetail"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export default function App() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);

  // Triple safety net: guarantees site becomes visible even if preloader crashes,
  // tab was hidden, or framer-motion never fires.
  useEffect(() => {
    const t1 = window.setTimeout(() => setLoading(false), 4800);
    const t2 = window.setTimeout(() => setLoading(false), 7000);
    const onError = () => setLoading(false);
    const onLoad = () => {
      // give the cinematic intro a moment, but don't block forever
      window.setTimeout(() => setLoading(false), 500);
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onError);
    window.addEventListener("load", onLoad);

    // If page was hidden during boot, rAF is throttled — force show when visible again
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        window.setTimeout(() => setLoading(false), 400);
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onError);
      window.removeEventListener("load", onLoad);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return (
    <ErrorBoundary>
      {loading && <Preloader onFinish={() => setLoading(false)} />}
      <Suspense
        fallback={
          <div className="grid min-h-screen place-items-center bg-[#05060e]">
            <div className="flex flex-col items-center gap-4">
              <img
                src="/assets/logo.png"
                alt="Parsa Apps"
                width={72}
                height={72}
                className="animate-pulse object-contain drop-shadow-[0_0_20px_rgba(0,198,255,0.4)]"
                onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
              />
              <p className="text-sm text-white/60">{t("common.loading")}</p>
            </div>
          </div>
        }
      >
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<Home />} />
            <Route path="store" element={<Store />} />
            <Route path="apps/:slug" element={<AppDetail />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
