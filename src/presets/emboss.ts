export interface EmbossParams {
  style: "inner-bevel" | "outer-bevel" | "emboss" | "pillow-emboss" | "flat";
  technique: "smooth" | "chisel-hard" | "chisel-soft";
  depth: number;
  direction: "up" | "down";
  size: number;
  soften: number;

  angle: number;
  altitude: number;

  highlight: { color: string; opacity: number };
  shadow: { color: string; opacity: number };

  fill: string;
}

export const embossDefaults: EmbossParams = {
  style: "inner-bevel",
  technique: "chisel-hard",
  depth: 1,
  direction: "up",
  size: 0,
  soften: 2.5,
  angle: -180,
  altitude: 90,
  highlight: { color: "#000000", opacity: 1 },
  shadow: { color: "#000000", opacity: 1 },
  fill: "#020000",
};

export interface EmbossVersion extends EmbossParams {
  glyph: string;
}

// Named snapshots keep the previous buttons and safety-pin treatments easy to restore.
export const embossVersionArchive = {
  buttons: { glyph: "/icons/buttons-mask.png", ...embossDefaults },
  safetyPins: { glyph: "/icons/safety-pins.svg", ...embossDefaults },
  softerButtons: {
    glyph: "/icons/buttons-v2.svg",
    ...embossDefaults,
    depth: 320,
    size: 3,
    soften: 0.5,
    shadow: { ...embossDefaults.shadow, opacity: 0.65 },
  },
  reliefButtons: {
    glyph: "/icons/buttons-v2.svg",
    ...embossDefaults,
  },
  matteButtons: {
    glyph: "/icons/buttons-v2.svg",
    ...embossDefaults,
    style: "flat",
    fill: "#999999",
  },
} satisfies Record<string, EmbossVersion>;

export const embossVersions: EmbossVersion[] = [embossVersionArchive.reliefButtons];
