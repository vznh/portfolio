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

export interface EmbossVersion extends EmbossParams {
  glyph: string;
}

export const embossVersions: EmbossVersion[] = [];
