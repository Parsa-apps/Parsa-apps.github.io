import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, type HTMLMotionProps } from "framer-motion";

/* ---------------------------------- Reveal --------------------------------- */
interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}
export function Reveal({ children, className = "", delay = 0, y = 28, once = true }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------- Section header ------------------------------ */
interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "center" | "start";
  className?: string;
}
export function SectionHeader({ eyebrow, title, subtitle, align = "center", className = "" }: SectionHeaderProps) {
  const alignClass = align === "center" ? "items-center text-center" : "items-start text-start";
  return (
    <div className={`flex flex-col gap-4 ${alignClass} ${className}`}>
      {eyebrow ? (
        <Reveal>
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-neon-violet shadow-[0_0_12px_2px_rgba(124,92,255,0.9)]" />
            {eyebrow}
          </span>
        </Reveal>
      ) : null}
      <Reveal delay={0.06}>
        <h2 className="text-3xl font-black leading-[1.25] sm:text-4xl lg:text-5xl">{title}</h2>
      </Reveal>
      {subtitle ? (
        <Reveal delay={0.12}>
          <p className="max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">{subtitle}</p>
        </Reveal>
      ) : null}
    </div>
  );
}

/* -------------------------------- Tilt card ------------------------------- */
interface TiltProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  scale?: number;
  intensity?: number;
}
export function TiltCard({ children, className = "", scale = 1.02, intensity = 14, ...rest }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(my, [0, 1], [intensity, -intensity]), { stiffness: 220, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-intensity, intensity]), { stiffness: 220, damping: 18 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      whileHover={{ scale }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onMouseLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------ Magnetic wrap ----------------------------- */
export function Magnetic({ children, className = "", strength = 0.3 }: { children: React.ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 160, damping: 14 });
  const y = useSpring(useMotionValue(0), { stiffness: 160, damping: 14 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------- Counter ---------------------------------- */
export function Counter({ to, suffix = "", className = "" }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 60, damping: 20 });

  React.useEffect(() => {
    const controls = spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = Math.round(v).toLocaleString() + suffix;
    });
    const start = window.requestAnimationFrame(() => motionValue.set(to));
    return () => {
      controls();
      window.cancelAnimationFrame(start);
    };
  }, [to, suffix, spring, motionValue]);

  return <span ref={ref} className={className}>{`0${suffix}`}</span>;
}

/* ------------------------------- Marquee ---------------------------------- */
export function Marquee({ items, className = "" }: { items: string[]; className?: string }) {
  const doubled = [...items, ...items];
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="marquee-track gap-3">
        {doubled.map((item, i) => (
          <span key={i} className="chip shrink-0 !px-5 !py-2 !text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan shadow-[0_0_10px_2px_rgba(0,255,208,0.5)]" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
