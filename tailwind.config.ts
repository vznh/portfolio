import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/presets/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        "jb": ["JB", "sans-serif"],
        "plex": ["IBM Plex Sans", "Plex", "sans-serif"],
        "lora": ["Lora", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
