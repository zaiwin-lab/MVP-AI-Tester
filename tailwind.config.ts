import type { Config } from "tailwindcss";

/**
 * CAP Digital Clinic design tokens.
 *
 * Palette is composed in OKLCH and exposed with the `<alpha-value>` hook so
 * Tailwind opacity utilities (e.g. `bg-primary/10`) keep working. The mood is
 * "ministry seal under morning light": a deep, credible teal carries the
 * brand, warm sand is the sparing accent, and the surface stays pure white so
 * the warmth lives in the ink and accent, never the background.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Surfaces
        bg: "oklch(1 0 0 / <alpha-value>)",
        surface: "oklch(0.985 0.003 220 / <alpha-value>)",
        "surface-2": "oklch(0.968 0.005 220 / <alpha-value>)",
        border: "oklch(0.912 0.006 220 / <alpha-value>)",
        "border-strong": "oklch(0.86 0.008 220 / <alpha-value>)",

        // Ink
        ink: "oklch(0.24 0.028 235 / <alpha-value>)",
        "ink-soft": "oklch(0.36 0.022 232 / <alpha-value>)",
        muted: "oklch(0.50 0.018 230 / <alpha-value>)",

        // Brand — deep seal teal
        primary: {
          DEFAULT: "oklch(0.46 0.072 196 / <alpha-value>)",
          hover: "oklch(0.41 0.072 196 / <alpha-value>)",
          soft: "oklch(0.95 0.02 196 / <alpha-value>)",
          ink: "oklch(0.30 0.055 198 / <alpha-value>)",
        },
        // Deep institutional navy-teal for dark bands
        deep: {
          DEFAULT: "oklch(0.27 0.032 214 / <alpha-value>)",
          2: "oklch(0.23 0.03 216 / <alpha-value>)",
          soft: "oklch(0.40 0.035 210 / <alpha-value>)",
        },
        // Warm sand accent — used sparingly
        accent: {
          DEFAULT: "oklch(0.74 0.105 74 / <alpha-value>)",
          ink: "oklch(0.52 0.09 66 / <alpha-value>)",
          soft: "oklch(0.955 0.03 78 / <alpha-value>)",
        },
        // Status semantics
        success: "oklch(0.55 0.11 155 / <alpha-value>)",
        "success-soft": "oklch(0.95 0.03 155 / <alpha-value>)",
        warning: "oklch(0.68 0.12 72 / <alpha-value>)",
        "warning-soft": "oklch(0.96 0.04 78 / <alpha-value>)",
        danger: "oklch(0.55 0.16 25 / <alpha-value>)",
        "danger-soft": "oklch(0.95 0.03 25 / <alpha-value>)",
        info: "oklch(0.55 0.09 240 / <alpha-value>)",
        "info-soft": "oklch(0.95 0.025 240 / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
      },
      fontSize: {
        "display": ["clamp(2.35rem, 1.4rem + 4.2vw, 4.6rem)", { lineHeight: "1.02", letterSpacing: "-0.032em" }],
        "h1": ["clamp(1.95rem, 1.3rem + 2.6vw, 3.1rem)", { lineHeight: "1.06", letterSpacing: "-0.026em" }],
        "h2": ["clamp(1.55rem, 1.15rem + 1.5vw, 2.25rem)", { lineHeight: "1.12", letterSpacing: "-0.02em" }],
        "h3": ["clamp(1.25rem, 1.05rem + 0.7vw, 1.55rem)", { lineHeight: "1.2", letterSpacing: "-0.014em" }],
        "lead": ["clamp(1.075rem, 1rem + 0.4vw, 1.28rem)", { lineHeight: "1.55" }],
      },
      // Fill the gaps in the default opacity scale so color/opacity modifiers
      // like `ring-primary/12` and `border-white/15` resolve.
      opacity: {
        4: "0.04",
        12: "0.12",
        15: "0.15",
        35: "0.35",
        45: "0.45",
        55: "0.55",
        65: "0.65",
        85: "0.85",
      },
      maxWidth: {
        prose: "68ch",
        container: "76rem",
      },
      borderRadius: {
        sm: "0.375rem",
        DEFAULT: "0.5rem",
        md: "0.625rem",
        lg: "0.875rem",
        xl: "1.125rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        card: "0 1px 2px oklch(0.24 0.028 235 / 0.04), 0 8px 24px -12px oklch(0.24 0.028 235 / 0.14)",
        "card-lg": "0 2px 4px oklch(0.24 0.028 235 / 0.05), 0 24px 48px -24px oklch(0.24 0.028 235 / 0.22)",
        ring: "0 0 0 1px oklch(0.912 0.006 220 / 1)",
        focus: "0 0 0 3px oklch(0.74 0.105 74 / 0.45)",
      },
      transitionTimingFunction: {
        "out-quart": "cubic-bezier(0.25, 1, 0.5, 1)",
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.98)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 0.5s ease-out both",
        "scale-in": "scale-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
