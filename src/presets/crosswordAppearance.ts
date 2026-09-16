export interface CrosswordAppearance {
  halftone: {
    enabled: boolean;
    opacity: number;
    scale: number;
    rotation: number;
    contrast: number;
    blend: "screen" | "multiply" | "soft-light";
    offsetX: number;
    offsetY: number;
  };
  stroke: {
    enabled: boolean;
    position: "outside" | "center" | "inside";
    style: "solid" | "brush" | "stretch" | "scatter";
    weight: number;
    color: string;
    opacity: number;
    fillOpacity: number;
    inkWear: number;
    brush: {
      roughness: number;
      grain: number;
      dryness: number;
      stretch: number;
      direction: "horizontal" | "vertical";
      seed: number;
    };
    scatter: {
      tip:
        | "mist"
        | "spray"
        | "flecks"
        | "grit"
        | "bristle"
        | "blot"
        | "charcoal"
        | "dust"
        | "stipple"
        | "airbrush";
      size: number;
      gap: number;
      wiggle: number;
      sizeJitter: number;
      angularJitter: number;
      rotation: number;
    };
  };
}

export const crosswordAppearanceDefaults: CrosswordAppearance = {
  halftone: {
    enabled: true,
    opacity: 1,
    scale: 0.25,
    rotation: 0,
    contrast: 1.8,
    blend: "screen",
    offsetX: 0,
    offsetY: 0,
  },
  stroke: {
    enabled: true,
    position: "center",
    style: "stretch",
    weight: 0.35,
    color: "#000000",
    opacity: 1,
    fillOpacity: 1,
    inkWear: 0,
    brush: {
      roughness: 2.25,
      grain: 0.1,
      dryness: 0,
      stretch: 19,
      direction: "horizontal",
      seed: 17,
    },
    scatter: {
      tip: "dust",
      size: 1.5,
      gap: 1.2,
      wiggle: 1,
      sizeJitter: 0.5,
      angularJitter: 35,
      rotation: 0,
    },
  },
};
