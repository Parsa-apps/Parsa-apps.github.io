import { Suspense, lazy, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import SiteLayout from "@/layouts/SiteLayout";
import Preloader from "@/components/Preloader";
import ErrorBoundary from "@/components/ErrorBoundary";

const Home = lazy(() => import("@/pages/Home"));
const Store = lazy(() => import("@/pages/Store"));
const AppDetail = lazy(() => import("@/pages/AppDetail"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export default function App() {
  const [loading, setLoading] = useState(true);

  // Absolute hard cap: even if the preloader somehow never calls onFinish,
  // the loading overlay is dropped after 4.5s so content is always visible.
  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 4500);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <ErrorBoundary>
      {loading && <Preloader onFinish={() => setLoading(false)} />}
      <Suspense
        fallback={
          <div className="grid min-h-screen place-items-center bg-[var(--bg)]">
            <div className="flex flex-col items-center gap-4">
              <img src="/assets/logo.svg" alt="" width={72} height={72} className="animate-pulse" />
              <p className="text-sm text-white/60">در حال بارگذاری…</p>
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
