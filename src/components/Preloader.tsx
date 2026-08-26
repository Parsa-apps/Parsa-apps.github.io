import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PARTICLES = Array.from({ length: 26 });

/** Hard ceiling for the whole intro: the preloader must NEVER outlive this. */
const FORCE_FINISH_MS = 3200;

export default function Preloader({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  // Keep the latest callback in a ref: the animation must not depend on the
  // identity of `onFinish`. An unstable prop used to re-run the effect,
  // resetting progress forever and freezing the site on a black screen.
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;
  const finishedRef = useRef(false);

  useEffect(() => {
    if (finishedRef.current) return;

    let current = 0;
    let guardTimeout = 0;

    const finish = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      window.clearInterval(id);
      window.clearTimeout(guardTimeout);
      setProgress(100);
      setDone(true);
      window.setTimeout(() => finishRef.current(), 650);
    };

    const id = window.setInterval(() => {
      current += Math.random() * 9 + 3;
      if (current >= 100) {
        finish();
      } else {
        setProgress(Math.round(current));
      }
    }, 90);

    // Worst case (throttled background tab, slow device, RNG hiccup):
    // force-close after FORCE_FINISH_MS no matter what.
    guardTimeout = window.setTimeout(finish, FORCE_FINISH_MS);

    return () => {
      window.clearInterval(id);
      window.clearTimeout(guardTimeout);
    };
    // Empty deps on purpose: run exactly once for the lifetime of the intro.
  }, []);

  const particles = useMemo(
    () =>
      PARTICLES.map((_, i) => ({
        left: `${(i * 37) % 100}%`,
        top: `${(i * 53) % 100}%`,
        delay: `${(i % 9) * 0.16}s`,
        size: 2 + (i % 4),
      })),
    []
  );

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#030310]"
          exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.8, ease: [0.83, 0, 0.17, 1] }}
        >
          {/* particles */}
          {particles.map((p, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-neon-violet/70 animate-pulseGlow"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                animationDelay: p.delay,
                boxShadow: "0 0 12px 2px rgba(124,92,255,0.7)",
              }}
            />
          ))}

          <motion.div
            className="absolute h-[520px] w-[520px] rounded-full blur-[120px]"
            style={{ background: "radial-gradient(circle, rgba(124,92,255,0.5), transparent 70%)" }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="relative flex flex-col items-center gap-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative">
              {/* orbit rings */}
              <motion.span
                className="absolute -inset-6 rounded-full border border-neon-violet/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                style={{ borderTopColor: "#7c5cff", borderTopWidth: 2 }}
              />
              <motion.span
                className="absolute -inset-10 rounded-full border border-neon-cyan/25"
                animate={{ rotate: -360 }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                style={{ borderBottomColor: "#00c6ff", borderBottomWidth: 2 }}
              />

              <motion.img
                src="/assets/logo.png"
                alt="پارسا اپس"
                width={140}
                height={140}
                className="relative drop-shadow-[0_0_40px_rgba(0,198,255,0.5)]"
                initial={{ opacity: 0, y: 16, scale: 0.75 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            <div className="flex flex-col items-center gap-3 text-center">
              <p className="text-lg font-black tracking-wide text-white">Parsa Apps</p>
              <p className="text-xs text-white/60">استودیو خلاق محصول دیجیتال</p>
            </div>

            <div className="relative h-[3px] w-56 overflow-hidden rounded-full bg-white/10">
              <motion.span
                className="absolute inset-y-0 right-0 rounded-full bg-gradient-to-l from-neon-violet to-neon-cyan"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[11px] font-bold tabular-nums text-white/45">{progress}%</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
