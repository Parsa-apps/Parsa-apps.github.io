import React, { Fragment, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;
const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------------------------- Reveal --------------------------------- */
interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
  rotate?: number;
  blur?: number;
  once?: boolean;
  variant?: "fade" | "slide" | "zoom" | "blur";
}
export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 28,
  x = 0,
  scale = 1,
  rotate = 0,
  blur = 0,
  once = true,
  variant = "slide",
}: RevealProps) {
  const initial = (() => {
    if (prefersReduced()) return { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, filter: "none" };
    switch (variant) {
      case "fade":
        return { opacity: 0, x, y: y * 0.4, scale, rotate, filter: blur ? `blur(${blur}px)` : "none" };
      case "zoom":
        return { opacity: 0, x, y: y * 0.2, scale: scale * 0.9, rotate, filter: blur ? `blur(${blur}px)` : "none" };
      case "blur":
        return { opacity: 0, x, y, scale, rotate, filter: "blur(10px)" };
      default:
        return { opacity: 0, x, y, scale, rotate, filter: blur ? `blur(${blur}px)` : "none" };
    }
  })();

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, filter: "none" }}
      viewport={{ once, margin: "-70px" }}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------- Animated split text ---------------------------- */
interface AnimatedTextProps {
  text: string;
  className?: string;
  mode?: "words" | "chars";
  as?: keyof HTMLElementTagNameMap;
  delay?: number;
  stagger?: number;
  once?: boolean;
}
export function AnimatedText({
  text,
  className = "",
  mode = "words",
  as: Tag = "span",
  delay = 0,
  stagger = 0.045,
  once = true,
}: AnimatedTextProps) {
  const reduced = prefersReduced();
  const units = mode === "words" ? text.split(" ") : Array.from(text);
  const MotionTag = motion[Tag as "span"];

  return (
    <MotionTag className={className} aria-label={text}>
      {units.map((unit, i) => {
        const node: React.ReactNode = mode === "words" ? unit : unit;
        return (
          <Fragment key={`${unit}-${i}`}>
            <span className="word-mask">
              <motion.span
                initial={reduced ? false : { opacity: 0, y: "0.9em", filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: "0em", filter: "blur(0px)" }}
                viewport={{ once, margin: "-60px" }}
                transition={{ duration: 0.65, delay: delay + i * stagger, ease: EASE }}
              >
                {node}
              </motion.span>
            </span>
            {mode === "words" && i < units.length - 1 ? " " : null}
          </Fragment>
        );
      })}
    </MotionTag>
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
  glare?: boolean;
}
export function TiltCard({ children, className = "", scale = 1.02, intensity = 14, glare = true, ...rest }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 240, damping: 24 });
  const sy = useSpring(my, { stiffness: 240, damping: 24 });

  const rotateX = useTransform(sy, [0, 1], [intensity, -intensity]);
  const rotateY = useTransform(sx, [0, 1], [-intensity, intensity]);
  const glowX = useTransform(sx, [0, 1], ["28%", "72%"]);
  const glowY = useTransform(sy, [0, 1], ["28%", "72%"]);

  return (
    <motion.div
      ref={ref}
      className={`${glare ? "card-spotlight" : ""} ${className}`}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000, "--mx": glowX, "--my": glowY } as never}
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

/* ------------------------------ Mouse parallax ---------------------------- */
export function MouseParallax({
  children,
  className = "",
  strength = 14,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 90, damping: 18, mass: 0.6 });
  const y = useSpring(my, { stiffness: 90, damping: 18, mass: 0.6 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set(((e.clientX - r.left) / r.width - 0.5) * strength * 2);
        my.set(((e.clientY - r.top) / r.height - 0.5) * strength * 2);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------- Parallax --------------------------------- */
export function Parallax({
  children,
  className = "",
  speed = 0.15,
  rotate = 0,
  clamp = 180,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  rotate?: number;
  clamp?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [speed * clamp, -speed * clamp]);
  const r = useTransform(scrollYProgress, [0, 1], [rotate, -rotate]);

  return (
    <motion.div ref={ref} className={className} style={{ y, rotate: r, willChange: "transform" }}>
      {children}
    </motion.div>
  );
}

/* ------------------------------- Counter ---------------------------------- */
export function Counter({
  to,
  suffix = "",
  prefix = "",
  className = "",
  duration = 1.6,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const value = useMotionValue(0);

  React.useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, { duration, ease: [0.22, 1, 0.36, 1] });
    const unsub = value.on("change", (v) => {
      if (ref.current) ref.current.textContent = `${prefix}${Math.round(v).toLocaleString()}${suffix}`;
    });
    return () => {
      controls.stop();
      unsub();
    };
  }, [inView, to, suffix, prefix, duration, value]);

  return (
    <span ref={ref} className={className}>
      {`${prefix}0${suffix}`}
    </span>
  );
}

/* ------------------------------- Marquee ---------------------------------- */
export function Marquee({ items, className = "", reverse = false }: { items: string[]; className?: string; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className={`relative overflow-hidden ${className}`} dir="ltr">
      <div className="marquee-track gap-3" style={reverse ? { animationDirection: "reverse" } : undefined}>
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

/* ----------------------------- Cinematic media ---------------------------- */
export function MediaReveal({
  src,
  alt,
  className = "",
  imgClassName = "",
  loading = "lazy",
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  loading?: "lazy" | "eager";
}) {
  return (
    <div className={`media-reveal ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        initial={prefersReduced() ? false : { clipPath: "inset(0 0 100% 0)", transform: "scale(1.2)" }}
        whileInView={{ clipPath: "inset(0 0 0% 0)", transform: "scale(1.04)" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.05, ease: EASE }}
        whileHover={{ transform: "scale(1.08)" }}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
