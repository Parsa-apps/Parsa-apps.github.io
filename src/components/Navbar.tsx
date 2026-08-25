import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n, type Lang } from "@/lib/i18n";
import { Magnetic } from "./ui";

const LINKS = [
  { to: "/", key: "nav.home" },
  { to: "/store", key: "nav.store" },
  { to: "/about", key: "nav.about" },
  { to: "/contact", key: "nav.contact" },
];

function LanguageSwitch() {
  const { lang, setLang } = useI18n();
  const langs: Lang[] = ["fa", "en", "ar"];
  return (
    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 text-[11px] font-bold">
      {langs.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`rounded-full px-3 py-1.5 transition-all ${
            lang === l ? "bg-neon-violet text-white shadow-[0_0_16px_rgba(124,92,255,0.5)]" : "text-white/60 hover:text-white"
          }`}
          aria-pressed={lang === l}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export default function Navbar() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[90] transition-all duration-500 ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
        <div className="container-px">
          <div
            className={`flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500 sm:px-5 ${
              scrolled ? "glass-strong shadow-glass" : "border border-transparent"
            }`}
          >
            <Link to="/" className="group flex items-center gap-3" aria-label="پارسا اپس">
              <span className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/15">
                <img src="/assets/logo.svg" alt="" width={44} height={44} className="transition-transform duration-500 group-hover:scale-110" />
              </span>
              <span className="leading-tight">
                <span dir="ltr" className="block text-base font-black tracking-tight text-white">
                  Parsa <span className="text-gradient">Apps</span>
                </span>
                <span className="block text-[10px] font-semibold text-white/45">استودیو نرم‌افزار پرمیوم</span>
              </span>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex" aria-label="منوی اصلی">
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) =>
                    `relative rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                      isActive ? "text-white" : "text-white/55 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {t(l.key)}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-0 -z-10 rounded-full bg-white/10 ring-1 ring-white/15"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <LanguageSwitch />
              <Magnetic>
                <Link to="/store" className="btn btn-primary !px-5 !py-2.5 !text-xs">
                  {t("nav.apps")}
                </Link>
              </Magnetic>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <LanguageSwitch />
              <button
                className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 text-white"
                onClick={() => setOpen((v) => !v)}
                aria-label="باز کردن منو"
                aria-expanded={open}
              >
                <span className="relative block h-4 w-5">
                  <motion.span animate={open ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="absolute inset-x-0 top-0 h-0.5 bg-white" />
                  <motion.span animate={open ? { opacity: 0 } : { opacity: 1 }} className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-white" />
                  <motion.span animate={open ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="absolute inset-x-0 bottom-0 h-0.5 bg-white" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[85] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setOpen(false)} />
            <motion.nav
              className="absolute inset-x-4 top-24 rounded-3xl glass-strong p-5 shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
              initial={{ y: -20, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -16, opacity: 0, scale: 0.98 }}
              transition={{ ease: [0.22, 1, 0.36, 1], duration: 0.35 }}
            >
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <NavLink
                    to={l.to}
                    end={l.to === "/"}
                    className={({ isActive }) =>
                      `block rounded-2xl px-4 py-3 text-base font-bold ${
                        isActive ? "bg-neon-violet/20 text-white" : "text-white/70"
                      }`
                    }
                  >
                    {t(l.key)}
                  </NavLink>
                </motion.div>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
