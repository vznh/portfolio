// presets/theme.ts
// Theme palettes toggled at runtime. Values are injected as CSS custom
// properties on the document root so Tailwind arbitrary values like
// `bg-[var(--bg-color)]` resolve against the active theme.

export interface Theme {
  bg: string;
  text: string;
  highlight: string;
}

export const THEMES: Theme[] = [
  {
    bg: "#F8FBF8",
    text: "#1E1919",
    highlight: "#222",
  },
];
