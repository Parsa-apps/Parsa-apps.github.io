import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "@/components/ui";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden pt-20">
      <div className="pointer-events-none absolute inset-0 grid-bg" />
      <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-neon-violet/20 blur-[120px]" />

      <Reveal className="relative text-center">
        <motion.img
          src="/assets/logo.png"
          alt="Parsa Apps"
          width={100}
          height={100}
          className="mx-auto mb-6 drop-shadow-[0_0_30px_rgba(0,198,255,0.45)] animate-float object-contain"
        />
        <h1 className="text-[7rem] font-black leading-none text-gradient sm:text-[10rem]">404</h1>
        <h2 className="mt-4 text-2xl font-black text-white sm:text-3xl">{t("nf.title")}</h2>
        <p className="mx-auto mt-4 max-w-md leading-8 text-white/60">
          {t("nf.text")}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/" className="btn btn-primary">{t("nf.btnHome")}</Link>
          <Link to="/store" className="btn btn-ghost">{t("home.about.btnProducts")}</Link>
        </div>
      </Reveal>
    </div>
  );
}
