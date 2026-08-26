import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { LanguageProvider } from "@/lib/i18n";
import "./index.css";

// Global safety: if anything crashes before React mounts, force show fallback after 8s
if (typeof window !== "undefined") {
  window.addEventListener("error", () => {
    const el = document.getElementById("root");
    if (el && el.children.length === 0) {
      // let index.html boot guard handle it, but also try to clear any fixed overlays
      setTimeout(() => {
        document.querySelectorAll('[class*=\"z-[200]\"]').forEach((n) => {
          (n as HTMLElement).style.display = "none";
        });
      }, 100);
    }
  });

  // Kill any lingering preloader if React fails to hydrate
  setTimeout(() => {
    const root = document.getElementById("root");
    if (root && root.children.length === 0) {
      // root empty -> boot guard in index.html will show, but ensure we don't have black overlay blocking
      document.querySelectorAll('[class*=\"fixed inset-0\"][class*=\"z-[200]\"]').forEach((n) => {
        (n as HTMLElement).style.display = "none";
      });
    }
  }, 8000);
}

const rootEl = document.getElementById("root");
if (!rootEl) {
  console.error("Root element not found");
} else {
  try {
    ReactDOM.createRoot(rootEl).render(
      <React.StrictMode>
        <BrowserRouter>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </BrowserRouter>
      </React.StrictMode>
    );
  } catch (e) {
    console.error("Failed to mount React:", e);
    rootEl.innerHTML =
      '<div dir="rtl" style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:#05060e;color:#fff;font-family:system-ui,sans-serif;text-align:center;padding:24px">' +
      '<img src="/assets/logo.png" alt="Parsa Apps" width="84" height="84" onerror="this.style.display=\'none\'" />' +
      '<p style="font-size:18px;font-weight:800;margin:0">Parsa Apps</p>' +
      '<p style="color:rgba(255,255,255,.6);font-size:14px;margin:0">خطا در بارگذاری. لطفاً صفحه را دوباره بارگذاری کنید.</p>' +
      '<button onclick="location.reload()" style="margin-top:6px;padding:10px 22px;border:0;border-radius:12px;background:linear-gradient(90deg,#7c5cff,#00c6ff);color:#fff;font-weight:700;font-size:14px;cursor:pointer">بارگذاری مجدد</button>' +
      "</div>";
  }
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  });
}
