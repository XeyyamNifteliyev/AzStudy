import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "1.5rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      fontFamily: {
        // PERF: a single font family (Geist) for both body and display — only
        // one variable font downloads instead of two. Geist covers latin +
        // latin-ext; cyrillic locales (ru/bg/kk/ky/uz) fall back to system-ui.
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        // shadcn semantic tokens (light only for Phase 1)
        background: "#f9f9ff",
        foreground: "#151c27",
        card: "#FFFFFF",
        "card-foreground": "#151c27",
        popover: "#FFFFFF",
        "popover-foreground": "#151c27",
        primary: {
          DEFAULT: "#003d9b",
          foreground: "#FFFFFF",
          container: "#0052cc",
        },
        secondary: {
          DEFAULT: "#e2e8f8",
          foreground: "#003d9b",
        },
        muted: {
          DEFAULT: "#f0f3ff",
          foreground: "#434654",
        },
        accent: {
          DEFAULT: "#f0f3ff",
          foreground: "#151c27",
        },
        destructive: {
          DEFAULT: "#ba1a1a",
          foreground: "#FFFFFF",
        },
        border: "#E5E7EB",
        input: "#c3c6d6",
        ring: "#003d9b",

        // Kinetic Horizon brand extensions
        cta: {
          DEFAULT: "#c95c00",
          foreground: "#FFFFFF",
          container: "#994700",
        },
        tertiary: {
          DEFAULT: "#004b58",
          foreground: "#FFFFFF",
          container: "#006476",
        },
        verified: "#10B981",
        outline: {
          DEFAULT: "#737685",
          variant: "#c3c6d6",
        },
        surface: {
          DEFAULT: "#f9f9ff",
          dim: "#d3daea",
          bright: "#f9f9ff",
          lowest: "#FFFFFF",
          low: "#f0f3ff",
          container: "#e7eefe",
          high: "#e2e8f8",
          highest: "#dce2f3",
        },
        "on-surface": {
          DEFAULT: "#151c27",
          variant: "#434654",
        },
        "border-low": "#E5E7EB",
        "bg-subtle": "#F9FAFB",
        // M15: social brand colors (were arbitrary hex values in components).
        brand: {
          whatsapp: "#25D366",
          telegram: "#229ED9",
        },
        // Pastel tints for the "Why Choose Us" cards.
        "why-us": {
          blue: "#D5EEFF",
          beige: "#A2845E52",
          amber: "#FFAA003D",
          pink: "#FF2D553D",
          green: "#00D68F52",
          sky: "#007AFF3D",
        },
      },
      backgroundImage: {
        // UI-5: primary-tinted dot grid (was an inline rgba in hero-section).
        "dot-grid":
          "radial-gradient(circle at 1px 1px, rgb(0 61 155 / 0.12) 1px, transparent 0)",
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
        full: "9999px",
      },
      fontSize: {
        // Editorial display scale — clamp-based, massive on desktop
        "display-xl": [
          "clamp(2.75rem, 5.5vw, 4.5rem)",
          { lineHeight: "1.04", letterSpacing: "-0.03em", fontWeight: "700" },
        ],
        "display-lg": [
          "clamp(2.25rem, 4vw, 3.25rem)",
          { lineHeight: "1.08", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "headline-xl": [
          "3rem",
          { lineHeight: "3.5rem", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "headline-lg": [
          "2rem",
          { lineHeight: "2.5rem", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "headline-md": ["1.5rem", { lineHeight: "2rem", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.75rem" }],
        "body-md": ["1rem", { lineHeight: "1.5rem" }],
        "body-sm": ["0.875rem", { lineHeight: "1.25rem" }],
        "label-md": [
          "0.875rem",
          { lineHeight: "1rem", letterSpacing: "0.02em", fontWeight: "600" },
        ],
        tabular: ["0.875rem", { lineHeight: "1.25rem", fontWeight: "500" }],
      },
      maxWidth: {
        container: "1280px",
      },
      spacing: {
        "section-lg": "80px",
        "section-md": "48px",
        "section-xl": "120px",
      },
      boxShadow: {
        // Flat-Plus elevation (DESIGN.md): tonal layers + low-contrast outlines
        "flat-plus":
          "0 1px 2px 0 rgba(21, 28, 39, 0.04), 0 0 0 1px rgba(21, 28, 39, 0.04)",
        "flat-hover":
          "0 8px 24px -8px rgba(21, 28, 39, 0.08), 0 0 0 1px rgba(21, 28, 39, 0.06)",
        overlay: "0 24px 48px -12px rgba(21, 28, 39, 0.18)",
        // Premium ambient: highly diffused, soft — the "$50k" shadow
        ambient:
          "0 32px 64px -24px rgba(21, 28, 39, 0.14), 0 12px 24px -12px rgba(21, 28, 39, 0.07)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        // Fluid mass physics (high-end-visual-design skill §5)
        fluid: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        // Heavy cinematic entry: deep translate + blur resolve (skill §5C)
        "fade-in-blur": {
          "0%": { opacity: "0", transform: "translateY(28px)", filter: "blur(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)", filter: "blur(0)" },
        },
        // Logo marquee: translate the duplicated track by half its width so the
        // seam between the two copies is never visible.
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in-blur": "fade-in-blur 0.9s cubic-bezier(0.32, 0.72, 0, 1) both",
        marquee: "marquee var(--marquee-duration, 40s) linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate, typography],
};

export default config;
