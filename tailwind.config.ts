import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "16px",
        md: "48px",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        background: "#F8FAFC",
        foreground: "#0F172A",
        card: "#F8FAFC",
        "card-foreground": "#0F172A",
        border: "#E2E8F0",
        muted: "#F1F5F9",
        "muted-foreground": "#475569",
        primary: {
          50: "#F0FDFA",
          100: "#CCFBF1",
          200: "#99F6E4",
          300: "#5EEAD4",
          400: "#2DD4BF",
          500: "#14B8A6",
          600: "#0D9488",
          700: "#0F766E",
          800: "#115E59",
          900: "#134E4A",
        },
        accent: "#D97706",
        success: "#059669",
        warning: "#D97706",
        error: "#DC2626",
        info: "#2563EB",
      },
      fontFamily: {
        sans: [
          "Inter",
          "HarmonyOS Sans",
          "Source Han Sans SC",
          "Noto Sans CJK SC",
          "Microsoft YaHei",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        xs: ["12px", { lineHeight: "1.4" }],
        sm: ["14px", { lineHeight: "1.5" }],
        base: ["16px", { lineHeight: "1.6" }],
        lg: ["20px", { lineHeight: "1.4" }],
        xl: ["28px", { lineHeight: "1.3" }],
        "2xl": ["36px", { lineHeight: "1.2" }],
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
      },
      boxShadow: {
        card:
          "0 1px 3px 0 rgba(0,0,0,0.05), 0 1px 2px -1px rgba(0,0,0,0.03)",
        hover:
          "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)",
      },
      transitionTimingFunction: {
        financial: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1280px 0" },
          "100%": { backgroundPosition: "1280px 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        shimmer: "shimmer 1500ms cubic-bezier(0.4, 0, 0.2, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
