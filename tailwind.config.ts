import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // PitchSoup Periwinkle Palette
        techTeal: "#ccccff", // Replaced with periwinkle
        mutedPlum: "#a3a3ff", // Replaced with darker periwinkle
        primary: "#ccccff",
        secondary: "#8a8aff",
        tertiary: "#e6e6ff",
        
        // System colors
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
      fontFamily: {
        "headline-lg-mobile": ["Sora"],
        "label-caps": ["Geist"],
        "body-md": ["Hanken Grotesk"],
        "headline-lg": ["Sora"],
        "headline-md": ["Sora"],
        "headline-xl": ["Sora"],
        "body-lg": ["Hanken Grotesk"],
        "mono-data": ["Geist"],
        "sans": ["Hanken Grotesk", "sans-serif"],
      },
      fontSize: {
        "headline-lg-mobile": ["32px", { lineHeight: "1.2", fontWeight: "700" }],
        "label-caps": ["12px", { lineHeight: "1", letterSpacing: "0.1em", fontWeight: "600" }],
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "headline-lg": ["40px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "headline-xl": ["64px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "mono-data": ["14px", { lineHeight: "1", fontWeight: "500" }],
      },
      animation: {
        "fade-in-up": "fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "glow": "glow 4s ease-in-out infinite",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(204, 204, 255, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(204, 204, 255, 0.4)" }
        }
      }
    },
  },
  plugins: [],
};
export default config;
