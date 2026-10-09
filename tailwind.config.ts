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
        background: "var(--background)",
        foreground: "var(--foreground)",
        
        "ink-black": "var(--color-ink-black)",
        "paper-white": "var(--color-paper-white)",
        "mist-gray": "var(--color-mist-gray)",
        "fog-white": "var(--color-fog-white)",
        "slate-gray": "var(--color-slate-gray)",
        "ash-gray": "var(--color-ash-gray)",
        "smoke-gray": "var(--color-smoke-gray)",
        "blush-peach": "var(--color-blush-peach)",
        "sienna-brown": "var(--color-sienna-brown)",

        // Semantic maps
        "bg-primary": "var(--bg-primary)",
        "bg-secondary": "var(--bg-secondary)",
        "bg-card": "var(--bg-card)",
        "bg-floating": "var(--bg-floating)",
        
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-tertiary": "var(--text-tertiary)",
        "text-muted": "var(--text-muted)",

        "border-subtle": "var(--border-subtle)",
        "border-hairline": "var(--border-hairline)",
        
        // Compatibility & fallback tokens
        border: "var(--border-subtle)",
        card: "var(--bg-card)",
        primary: "var(--text-primary)",
        muted: "var(--text-muted)",
        "bone-white": "var(--color-fog-white)",
        "silver-mist": "var(--text-secondary)",
        "saffron-spark": "var(--color-sienna-brown)",
        "electric-iris": "var(--color-sienna-brown)",
        "charcoal-haze": "var(--color-slate-gray)",
        "deep-space": "var(--color-ink-black)",
      },
      borderRadius: {
        "cards": "32px",
        "images": "20px",
        "inputs": "24px",
        "buttons": "9999px",
        "smallcards": "24px",
        "elevatedcards": "28px",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Source Serif 4", "ui-serif", "Georgia", "serif"],
        display: ["Source Serif 4", "ui-serif", "Georgia", "serif"],
      },
      fontSize: {
        caption: ["15px", { lineHeight: "1.5" }],
        body: ["17px", { lineHeight: "1.35" }],
        "body-lg": ["20px", { lineHeight: "1.35" }],
        subheading: ["22px", { lineHeight: "1.5" }],
        "heading-sm": ["26px", { lineHeight: "1.18", letterSpacing: "-0.23px" }],
        heading: ["44px", { lineHeight: "1.3", letterSpacing: "-0.66px" }],
        "heading-lg": ["64px", { lineHeight: "1.3", letterSpacing: "-0.96px" }],
        display: ["90px", { lineHeight: "1.3", letterSpacing: "-2.25px" }],
      },
      fontWeight: {
        regular: "400",
        w430: "430",
        w450: "450",
        w480: "480",
        medium: "500",
      },
      boxShadow: {
        subtle: "var(--shadow-subtle)",
        "subtle-2": "var(--shadow-subtle-2)",
        "subtle-3": "var(--shadow-subtle-3)",
      }
    },
  },
  plugins: [],
};
export default config;
