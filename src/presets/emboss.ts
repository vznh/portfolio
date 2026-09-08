export interface EmbossParams {
  style: "inner-bevel" | "outer-bevel" | "emboss" | "pillow-emboss";
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
  style: "pillow-emboss",
  technique: "chisel-soft",
  depth: 556,
  direction: "up",
  size: 4,
  soften: 0,
  angle: -78,
  altitude: 90,
  highlight: { color: "#ffffff", opacity: 0 },
  shadow: { color: "#6f6f6f", opacity: 1 },
  fill: "#000000",
};

export interface EmbossVersion extends EmbossParams {
  glyph: string;
}

export const embossVersions: EmbossVersion[] = [{ glyph: "♰", ...embossDefaults }];
