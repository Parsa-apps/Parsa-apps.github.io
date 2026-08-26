import React from "react";
import { Link } from "react-router-dom";
import { tStatic } from "@/lib/i18n";

interface Props {
  children: React.ReactNode;
}
interface State {
  hasError: boolean;
  errorInfo?: string;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, errorInfo: error instanceof Error ? error.message : String(error) };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.error("Parsa Apps UI error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-screen place-items-center bg-[#05060e] px-6 text-center">
          <div className="max-w-md">
            <img
              src="/assets/logo.png"
              alt="Parsa Apps"
              width={88}
              height={88}
              className="mx-auto object-contain drop-shadow-[0_0_24px_rgba(0,198,255,0.4)]"
              onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
            />
            <h1 className="mt-6 text-2xl font-black text-white">{tStatic("error.title")}</h1>
            <p className="mt-3 text-white/55">{tStatic("error.text")}</p>
            {this.state.errorInfo && (
              <p className="mt-2 text-xs text-white/30" dir="ltr">
                {this.state.errorInfo.slice(0, 200)}
              </p>
            )}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button onClick={() => window.location.reload()} className="btn btn-primary">
                {tStatic("error.reload")}
              </button>
              <Link to="/" className="btn btn-ghost" onClick={() => this.setState({ hasError: false })}>
                {tStatic("error.home")}
              </Link>
              <button
                onClick={() => {
                  try {
                    localStorage.clear();
                    sessionStorage.clear();
                    if ("caches" in window) {
                      caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
                    }
                    if ("serviceWorker" in navigator) {
                      navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()));
                    }
                  } catch {
                    // ignore
                  }
                  window.location.reload();
                }}
                className="btn btn-ghost"
              >
                {tStatic("error.clearCache")}
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
