// The fields mirror Photoshop's Layer Style → Bevel & Emboss. Calibrate in
// dev via the DialKit panel: save versions as presets, then press the panel's
// "copyVersions" action and paste the resulting array into `embossVersions`.
export interface EmbossParams {
  // Structure
  style: "inner-bevel" | "outer-bevel" | "emboss" | "pillow-emboss";
  technique: "smooth" | "chisel-hard" | "chisel-soft";
  depth: number; // percent 1..1000
  direction: "up" | "down";
  size: number; // px 0..60
  soften: number; // px 0..16
  // Shading
  angle: number; // degrees -180..180, global light angle
  altitude: number; // degrees 0..90
  // Highlight / Shadow
  highlight: { color: string; opacity: number }; // opacity 0..1
  shadow: { color: string; opacity: number }; // opacity 0..1
  // Glyph fill; defaults to the canvas color so only the edges show
  fill: string;
}

export const embossDefaults: EmbossParams = {
  style: "inner-bevel",
  technique: "smooth",
  depth: 100,
  direction: "up",
  size: 8,
  soften: 0,
  angle: 120,
  altitude: 30,
  highlight: { color: "#ffffff", opacity: 0.75 },
  shadow: { color: "#000000", opacity: 0.75 },
  fill: "#ffffff",
};

// One entry per saved DialKit version. The page picks one at random on each
// render. Until the calibrated versions are pasted in, it holds the defaults.
export const embossVersions: EmbossParams[] = [embossDefaults];
