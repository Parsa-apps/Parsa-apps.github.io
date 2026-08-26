import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * Reusable live "P" mark based on the brand's cyber hardware logo.
 * Used in the navbar and hero so the logo keeps a premium 3D, interactive
 * state after the cinematic intro finishes.
 */
export default function BrandMark({
  size = 48,
  className = "",
  floating = true,
  scanline = false,
  interactive = true,
  alt = "Parsa Apps",
}: {
  size?: number;
  className?: string;
  floating?: boolean;
  scanline?: boolean;
  interactive?: boolean;
  alt?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 160, damping: 18 });
  const sy = useSpring(my, { stiffness: 160, damping: 18 });
  const rotateX = useTransform(sy, [0, 1], [9, -9]);
  const rotateY = useTransform(sx, [0, 1], [-9, 9]);

  return (
    <div
      className={`inline-block ${floating ? "animate-float-soft" : ""} ${className}`}
      style={{ perspective: 700 }}
      aria-label={alt}
      role="img"
    >
      <motion.div
        ref={ref}
        className={`relative grid place-items-center ${scanline ? "brand-scan-host" : ""}`}
        style={{
          width: size,
          height: size,
          rotateX: interactive ? rotateX : 0,
          rotateY: interactive ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        onPointerMove={(e) => {
          if (!interactive) return;
          const r = ref.current?.getBoundingClientRect();
          if (!r) return;
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
      >
        {/* ambient glow behind the mark */}
        <span
          aria-hidden="true"
          className="absolute inset-[-32%] rounded-full bg-[radial-gradient(circle,rgba(0,198,255,0.38),rgba(0,255,208,0.12)_45%,transparent_70%)] blur-xl"
        />
        {/* blue outline ring */}
        <span
          aria-hidden="true"
          className="absolute inset-[-12%] rounded-[26%] border border-neon-blue/20"
        />
        <span
          aria-hidden="true"
          className="absolute inset-[-12%] rounded-[26%] border-t-2 border-l-2 border-neon-blue/70 shadow-[0_0_18px_rgba(0,198,255,0.45)]"
        />
        <img
          src={size <= 56 ? "/assets/brand/parsa-cyber-mark-small.png" : "/assets/brand/parsa-cyber-mark.png"}
          alt={alt}
          width={size * 0.94}
          height={size * 0.94}
          style={{ width: "94%", height: "94%" }}
          decoding="async"
          className="relative z-10 object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
        />
        <span
          aria-hidden="true"
          className="absolute inset-x-[8%] bottom-[6%] h-[10%] rounded-full bg-neon-cyan/25 blur-md"
        />
      </motion.div>
    </div>
  );
}
