/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#030310",
          900: "#05060e",
          850: "#080b1a",
          800: "#0b0f22",
          700: "#141a35",
        },
        neon: {
          violet: "#7c5cff",
          blue: "#00c6ff",
          cyan: "#00ffd0",
          gold: "#f5c857",
          pink: "#ff5fa2",
          green: "#00ff9b",
        },
      },
      fontFamily: {
        sans: ["Vazirmatn", "Inter", "system-ui", "sans-serif"],
        display: ["Vazirmatn", "Space Grotesk", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 24px 80px -30px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06)",
        glow: "0 0 70px -18px rgba(124,92,255,0.75)",
        "glow-blue": "0 0 70px -18px rgba(0,198,255,0.75)",
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        "float-slow": "float 11s ease-in-out infinite",
        shimmer: "shimmer 2.4s linear infinite",
        "spin-slow": "spin 16s linear infinite",
        marquee: "marquee 32s linear infinite",
        pulseGlow: "pulseGlow 4.5s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-16px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseGlow: {
          "0%,100%": { opacity: 0.45, transform: "scale(1)" },
          "50%": { opacity: 0.9, transform: "scale(1.08)" },
        },
      },
    },
  },
  plugins: [],
};
