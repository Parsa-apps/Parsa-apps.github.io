import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Phase timeline (ms). The overlay must never outlive the App hard cap (4500ms). */
const THRESHOLDS = [0, 300, 950, 1750, 2550, 3200, 3850];
const FINISH_MS = 4400;

const PARSA = Array.from("PARSA");
const APPS = Array.from("APPS");

function freshParticles(count: number) {
  return Array.from({ length: count }).map((_, i) => {
    const green = i % 3 === 0;
    return {
      left: `${(i * 47) % 100}%`,
      top: `${(i * 61) % 100}%`,
      dx: `${(i % 2 === 0 ? 1 : -1) * (28 + (i % 5) * 10)}px`,
      dy: `${(i % 2 === 0 ? -1 : 1) * (20 + (i % 4) * 12)}px`,
      size: 2 + (i % 5),
      duration: `${6 + (i % 6) * 0.9}s`,
      delay: `${(i % 9) * 0.35}s`,
      background: green ? "#00ff9b" : "#00c6ff",
      boxShadow: green ? "0 0 10px 2px rgba(0,255,155,0.7)" : "0 0 10px 2px rgba(0,198,255,0.7)",
    };
  });
}

export default function Preloader({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState(0);
  const [done, setDone] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;
  const finishedRef = useRef(false);

  // Fixed: call hooks directly, not wrapped in useRef (was violating rules of hooks and could cause crash)
  const rxBase = useMotionValue(0);
  const ryBase = useMotionValue(0);
  const tiltRX = useSpring(rxBase, { stiffness: 90, damping: 18 });
  const tiltRY = useSpring(ryBase, { stiffness: 90, damping: 18 });

  const particles = useMemo(() => freshParticles(32), []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const finish = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      setDone(true);
      window.setTimeout(() => {
        try {
          finishRef.current();
        } catch {
          // ensure unmount even if callback throws
        }
      }, 860);
    };

    // ABSOLUTE SAFETY: force finish after 5s even if rAF stalls (hidden tab, throttling, error)
    const hardTimeout = window.setTimeout(finish, 5000);

    if (reduced) {
      const t = window.setTimeout(finish, 900);
      return () => {
        window.clearTimeout(t);
        window.clearTimeout(hardTimeout);
      };
    }

    let raf = 0;
    let idx = 0;
    let start = 0;
    try {
      start = performance.now();
    } catch {
      start = Date.now();
    }

    const tick = (now: number) => {
      try {
        const elapsed = now - start;
        while (idx < THRESHOLDS.length && elapsed >= THRESHOLDS[idx]) {
          setPhase(idx);
          idx += 1;
        }
        if (elapsed >= FINISH_MS) {
          finish();
          return;
        }
      } catch {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(hardTimeout);
    };
  }, []);

  const bootText =
    phase >= 3
      ? phase >= 5
        ? "NEURAL CORE ONLINE"
        : phase >= 4
          ? "AI BOOTING · SYSTEM READY"
          : "ANDROID CORE · ACTIVATING"
      : phase >= 1
        ? "HARDWARE LINK · ESTABLISHING"
        : "INITIALIZING PARSA SYSTEMS";

  const markVisible = phase >= 1;
  const markFull = phase >= 2;
  const circuitsOn = phase >= 1;
  const androidOn = phase >= 3;
  const parsaOn = phase >= 4;
  const appsOn = phase >= 5;
  const finale = phase >= 6;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#02030a]"
          exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.85, ease: [0.83, 0, 0.17, 1] }}
          onPointerMove={(e) => {
            try {
              const r = overlayRef.current?.getBoundingClientRect();
              if (!r) return;
              const nx = (e.clientX - r.left) / r.width;
              const ny = (e.clientY - r.top) / r.height;
              rxBase.set((ny - 0.5) * -16);
              ryBase.set((nx - 0.5) * 16);
            } catch {
              // ignore pointer errors
            }
          }}
        >
          {/* dark depth floor */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 50% 42%, #050816 0%, #03040c 42%, #01020a 78%)",
            }}
          />
          <div aria-hidden="true" className="grid-bg absolute inset-0 opacity-40" />

          {/* drifting blue / green tech particles */}
          {particles.map((p, i) => (
            <span
              key={i}
              className="brand-particle"
              style={
                {
                  left: p.left,
                  top: p.top,
                  width: p.size,
                  height: p.size,
                  background: p.background,
                  boxShadow: p.boxShadow,
                  "--dx": p.dx,
                  "--dy": p.dy,
                  "--pt": p.duration,
                  "--pd": p.delay,
                } as never
              }
            />
          ))}

          {/* cinematic camera: slight orbit/z push that settles at the end */}
          <motion.div
            className="relative w-full"
            style={{ perspective: 1400 }}
            animate={
              finale
                ? { scale: 1, rotateY: 0, rotateX: 0, z: 0 }
                : { scale: 0.92 + Math.min(phase, 2) * 0.04, rotateY: 7 - Math.min(phase, 2) * 3.5, rotateX: -5 + Math.min(phase, 2) * 2.5, z: 24 }
            }
            transition={{ duration: 1.2, ease: EASE }}
          >
            {/* tilt layer responds to the pointer */}
            <motion.div style={{ rotateX: tiltRX, rotateY: tiltRY, transformStyle: "preserve-3d" }}>
              <div className="brand-stage px-6 py-2 sm:py-4">
                {/* orbit / circuit ring draws around the mark */}
                <svg
                  aria-hidden="true"
                  className="absolute pointer-events-none"
                  style={{ width: "min(76vw, 420px)", height: "min(76vw, 420px)", zIndex: 0 }}
                  viewBox="0 0 420 420"
                  fill="none"
                >
                  {[
                    { d: "M84 96 H260 A70 70 0 0 1 330 166 V234 A70 70 0 0 1 260 304 H120", delay: "0.05s", color: "#00c6ff" },
                    { d: "M40 150 H108 L126 132 H168", delay: "0.2s", color: "#00ff9b" },
                    { d: "M28 210 H92 L112 230 H156", delay: "0.32s", color: "#00c6ff" },
                    { d: "M56 286 H120 L144 262 H176", delay: "0.44s", color: "#00ff9b" },
                    { d: "M40 150 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0", delay: "0.2s", color: "#00ff9b" },
                    { d: "M28 210 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0", delay: "0.32s", color: "#00c6ff" },
                    { d: "M380 132 H318 L300 150 H268", delay: "0.5s", color: "#00c6ff" },
                    { d: "M392 268 H322 L302 250 H274", delay: "0.62s", color: "#00ff9b" },
                  ].map((line, i) => (
                    <path
                      key={i}
                      d={line.d}
                      pathLength={1}
                      className={`circuit-line ${circuitsOn ? "is-on" : ""}`}
                      style={{ stroke: line.color, "--d": line.delay, "--ease": "cubic-bezier(0.22,1,0.36,1)" } as never}
                    />
                  ))}
                </svg>

                <div
                  className={`relative grid place-items-center ${finale ? "animate-float-soft" : ""}`}
                  style={{ width: "clamp(230px, 46vw, 360px)", transformStyle: "preserve-3d" }}
                >
                  <motion.div
                    aria-hidden="true"
                    className="absolute"
                    style={{
                      inset: "-9%",
                      borderRadius: "24%",
                      border: "2px solid rgba(0,198,255,0.85)",
                      boxShadow: "0 0 30px rgba(0,198,255,0.4), inset 0 0 22px rgba(0,255,208,0.18)",
                    }}
                    initial={{ opacity: 0, scale: 1.22 }}
                    animate={
                      markVisible
                        ? { opacity: markFull ? 0.9 : 0.5, scale: 1 }
                        : { opacity: 0, scale: 1.22 }
                    }
                    transition={{ duration: 0.7, ease: EASE }}
                  />
                  <motion.div
                    aria-hidden="true"
                    className="absolute"
                    style={{ inset: "-15%", borderRadius: "26%", border: "1px solid rgba(0,255,208,0.25)" }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={markVisible ? { opacity: markFull ? 0.8 : 0.4, scale: 1.04 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
                  />

                  <motion.div
                    className="relative z-10 w-full"
                    style={{ filter: "drop-shadow(0 32px 70px rgba(0,0,0,0.75))" }}
                    initial={{ opacity: 0, scale: 1.26, rotateY: -18 }}
                    animate={
                      markVisible
                        ? { opacity: markFull ? 1 : 0.55, scale: markFull ? 1 : 1.12, rotateY: markFull ? 0 : -8 }
                        : { opacity: 0, scale: 1.26, rotateY: -18 }
                    }
                    transition={{ duration: 1, ease: EASE }}
                  >
                    <motion.img
                      src="/assets/brand/parsa-cyber-mark.png"
                      alt="Parsa Apps"
                      width={760}
                      height={612}
                      decoding="async"
                      className="w-full object-contain"
                      initial={{ filter: "brightness(0.08) saturate(0.2)" }}
                      animate={
                        markVisible
                          ? { filter: markFull ? "brightness(1.08) saturate(1.05)" : "brightness(0.55) saturate(0.5)" }
                          : { filter: "brightness(0.08) saturate(0.2)" }
                      }
                      transition={{ duration: 1, ease: EASE }}
                      onError={(e) => {
                        // if image fails, don't block the whole intro
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </motion.div>

                  {markFull && !finale && <div className="brand-scanner z-20" aria-hidden="true" />}

                  <motion.div
                    aria-hidden="true"
                    className="absolute z-20"
                    style={{
                      inset: "7% 55% 45% 10%",
                      borderRadius: "50%",
                      background: "radial-gradient(circle at 50% 45%, rgba(0,255,128,0.55), rgba(0,255,128,0.12) 52%, transparent 72%)",
                      filter: "blur(10px)",
                    }}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={androidOn ? { opacity: finale ? 0.5 : 0.9, scale: 1 } : { opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.8, ease: EASE }}
                  />

                  <AnimatePresence>
                    {androidOn && (
                      <motion.div
                        initial={{ opacity: 0, y: 18, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.94 }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="absolute -top-3 right-1/2 z-30 w-[min(74vw,86%)] translate-x-1/2 sm:top-2 sm:right-8 sm:translate-x-0"
                      >
                        <div className="rounded-2xl border border-neon-green/30 bg-[#03130e]/85 px-4 py-3 shadow-[0_0_30px_rgba(0,255,128,0.18)] backdrop-blur-md sm:px-5">
                          <div className="flex items-center justify-between gap-4">
                            <span className="flex items-center gap-2 text-[10px] font-black tracking-[0.28em] text-neon-cyan sm:text-xs">
                              <span className="h-1.5 w-1.5 rounded-full bg-neon-green shadow-[0_0_12px_rgba(0,255,128,0.9)]" />
                              ANDROID · BOOT
                            </span>
                            <span className="text-[9px] font-bold tabular-nums text-neon-green/80 sm:text-[10px]" dir="ltr">
                              {bootText}
                            </span>
                          </div>
                          <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-white/10">
                            <div className="boot-bar-fill h-full rounded-full bg-gradient-to-l from-neon-green to-neon-cyan" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative z-10 -mt-1 h-8 w-[min(70vw,340px)]" aria-hidden="true">
                  <motion.div
                    className="absolute inset-x-4 top-0 h-6 rounded-full bg-neon-cyan/35 blur-xl"
                    animate={{ x: [-16, 16, -16], opacity: finale ? [0.45, 0.7, 0.45] : 0.35 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>

                <div className="relative z-10 mt-1 flex items-end justify-center gap-[0.16em]" dir="ltr">
                  {PARSA.map((ch, i) => (
                    <span key={`p${i}`} className="inline-block overflow-hidden">
                      <motion.span
                        className="brand-metallic inline-block text-[clamp(2.1rem,8.5vw,4.4rem)] font-black leading-none tracking-[0.08em]"
                        initial={{ opacity: 0, y: 34, scale: 0.42, filter: "blur(12px)" }}
                        animate={
                          parsaOn
                            ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
                            : { opacity: 0, y: 34, scale: 0.42, filter: "blur(12px)" }
                        }
                        transition={{ duration: 0.55, delay: 0.08 * i, ease: EASE }}
                      >
                        {ch}
                      </motion.span>
                    </span>
                  ))}
                </div>

                <div className="relative z-10 mt-3 flex items-center gap-3" dir="ltr">
                  <motion.span
                    aria-hidden="true"
                    className="h-px flex-1 bg-gradient-to-l from-transparent via-neon-cyan/60 to-neon-cyan/80"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={appsOn ? { opacity: 1, scaleX: 1 } : {}}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
                    style={{ transformOrigin: "right" }}
                  />
                  <div className="flex items-center gap-[0.24em]">
                    {APPS.map((ch, i) => (
                      <span key={`a${i}`} className="relative inline-block">
                        <span
                          aria-hidden="true"
                          className="absolute -left-1 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-neon-green/80"
                          style={{ boxShadow: "0 0 8px rgba(0,255,128,0.8)" }}
                        />
                        <motion.span
                          className="brand-green inline-block text-[clamp(0.95rem,3.2vw,1.6rem)] font-black tracking-[0.42em]"
                          initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
                          animate={
                            appsOn
                              ? { opacity: 1, y: 0, filter: "blur(0px)" }
                              : { opacity: 0, y: 12, filter: "blur(8px)" }
                          }
                          transition={{ duration: 0.45, delay: 0.1 * i, ease: EASE }}
                        >
                          {ch}
                        </motion.span>
                      </span>
                    ))}
                  </div>
                  <motion.span
                    aria-hidden="true"
                    className="h-px flex-1 bg-gradient-to-r from-transparent via-neon-green/60 to-neon-green/80"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={appsOn ? { opacity: 1, scaleX: 1 } : {}}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
                    style={{ transformOrigin: "left" }}
                  />
                </div>

                {finale && <div className="brand-energy-wave absolute inset-0 z-40" aria-hidden="true" />}
                <div className={`${finale ? "brand-energy-ring is-active" : "brand-energy-ring"} z-50`} aria-hidden="true" />
                {finale && (
                  <motion.div
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2 z-50 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(0,198,255,0.32), rgba(0,255,208,0.08) 45%, transparent 70%)" }}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: [0, 0.85, 0], scale: 1 }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                  />
                )}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="pointer-events-none absolute bottom-[8%] flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 1 : 0.6 }}
            transition={{ duration: 0.5 }}
          >
            <span className="flex items-center gap-2 text-[9px] font-bold tracking-[0.32em] text-white/40 sm:text-[10px]">
              <span className="dot-blink h-1 w-1 rounded-full bg-neon-cyan" />
              PARSA · PRECISION MOBILE ENGINEERING
              <span className="dot-blink h-1 w-1 rounded-full bg-neon-green" />
            </span>
          </motion.div>

          <div aria-hidden="true" className="sr-only">
            Parsa Apps — برند نرم‌افزار پرمیوم
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
