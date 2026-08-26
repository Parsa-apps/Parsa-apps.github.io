import { useEffect, useRef, useState } from "react";

/** Custom magnetic cursor with a trailing ring + soft glow. Disabled on touch devices. */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return;
    setEnabled(true);

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let glowX = -100;
    let glowY = -100;
    let raf = 0;
    let hover = false;
    let label = "";

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      const target = e.target as HTMLElement | null;
      const labelled = target?.closest?.("[data-cursor-label]") as HTMLElement | null;
      label = labelled?.dataset.cursorLabel ?? "";
      hover = !!(label || target?.closest?.("a, button, input, textarea, select, [data-cursor]"));
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      glowX += (mouseX - glowX) * 0.09;
      glowY += (mouseY - glowY) * 0.09;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%,-50%)`;
      }
      if (ringRef.current) {
        const scale = label ? 2.6 : hover ? 1.7 : 1;
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%,-50%) scale(${scale})`;
        ringRef.current.style.opacity = hover || label ? "1" : "0.55";
        ringRef.current.style.borderColor = label ? "rgba(0,255,208,0.85)" : "rgba(255,255,255,0.42)";
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%,-50%) scale(${hover ? 1.4 : 1})`;
        glowRef.current.style.opacity = hover ? "0.75" : "0.35";
      }
      if (labelRef.current) {
        labelRef.current.textContent = label;
        labelRef.current.style.opacity = label ? "1" : "0";
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    tick();
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={glowRef}
        className="pointer-events-none fixed left-0 top-0 z-[118] h-24 w-24 rounded-full bg-neon-violet/15 blur-2xl"
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[120] h-2 w-2 rounded-full bg-white mix-blend-screen shadow-[0_0_16px_3px_rgba(0,198,255,0.9)]"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[119] flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/5 backdrop-blur-sm mix-blend-screen"
      >
        <span
          ref={labelRef}
          className="pointer-events-none whitespace-nowrap rounded-full bg-neon-cyan/90 px-3 py-1 text-[10px] font-black text-black opacity-0 shadow-[0_0_20px_rgba(0,255,208,0.6)]"
        >
        </span>
      </div>
    </>
  );
}
