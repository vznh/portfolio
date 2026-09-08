import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "reading-line": { "0%, 80%": { opacity: "1" }, "100%": { opacity: "0" } },
      },
      animation: {
        "fade-in": "fade-in 500ms ease-out both",
        "reading-line": "reading-line 2500ms ease-out forwards",
      },
      fontFamily: {
        heading: ["var(--font-heading)"],
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  plugins: [],
};

export default config;
