import type { CrosswordAppearance } from "./crosswordAppearance";

type Stroke = CrosswordAppearance["stroke"];
export interface CrosswordBrushPreset {
  id: string;
  name: string;
  family: "stretch" | "scatter";
  description: string;
  brush: Stroke["brush"];
  scatter?: Stroke["scatter"];
}

export const crosswordBrushPresets: CrosswordBrushPreset[] = [
  {
    id: "heist",
    name: "Heist",
    family: "stretch",
    description: "Chipped ink",
    brush: { roughness: 1.8, grain: 0.8, dryness: 0.42, stretch: 3, direction: "horizontal", seed: 11 },
  },
  {
    id: "blockbuster",
    name: "Blockbuster",
    family: "stretch",
    description: "Dry bristles",
    brush: { roughness: 0.75, grain: 1.4, dryness: 0.62, stretch: 18, direction: "horizontal", seed: 23 },
  },
  {
    id: "grindhouse",
    name: "Grindhouse",
    family: "stretch",
    description: "Coarse irregular ink",
    brush: { roughness: 3.6, grain: 0.18, dryness: 0.35, stretch: 2, direction: "horizontal", seed: 31 },
  },
  {
    id: "biopic",
    name: "Biopic",
    family: "stretch",
    description: "Smooth flowing ink",
    brush: { roughness: 1.2, grain: 0.1, dryness: 0, stretch: 8, direction: "horizontal", seed: 43 },
  },
  {
    id: "spaghetti-western",
    name: "Spaghetti Western",
    family: "stretch",
    description: "Fine separated strands",
    brush: { roughness: 0.15, grain: 1.6, dryness: 0.76, stretch: 24, direction: "horizontal", seed: 59 },
  },
  {
    id: "slasher",
    name: "Slasher",
    family: "stretch",
    description: "Long torn ribbons",
    brush: { roughness: 1.5, grain: 0.45, dryness: 0.63, stretch: 20, direction: "horizontal", seed: 67 },
  },
  {
    id: "hardboiled",
    name: "Hardboiled",
    family: "stretch",
    description: "Dense edge with crumbling grain",
    brush: { roughness: 2.1, grain: 1.3, dryness: 0.53, stretch: 4, direction: "horizontal", seed: 71 },
  },
  {
    id: "verite",
    name: "Vérité",
    family: "stretch",
    description: "Scratchy overlapping bristles",
    brush: { roughness: 1.2, grain: 1.7, dryness: 0.67, stretch: 14, direction: "horizontal", seed: 73 },
  },
  {
    id: "epic",
    name: "Epic",
    family: "stretch",
    description: "Broken dry ribbons",
    brush: { roughness: 2.4, grain: 0.65, dryness: 0.57, stretch: 11, direction: "horizontal", seed: 79 },
  },
  {
    id: "screwball",
    name: "Screwball",
    family: "stretch",
    description: "Ragged separated tracks",
    brush: { roughness: 2.8, grain: 1.2, dryness: 0.69, stretch: 22, direction: "horizontal", seed: 83 },
  },
  {
    id: "rom-com",
    name: "Rom-com",
    family: "stretch",
    description: "Parallel bands with worn centers",
    brush: { roughness: 0.3, grain: 0.9, dryness: 0.61, stretch: 24, direction: "horizontal", seed: 89 },
  },
  {
    id: "noir",
    name: "Noir",
    family: "stretch",
    description: "Heavy ink with chipped gaps",
    brush: { roughness: 0.85, grain: 0.5, dryness: 0.54, stretch: 3, direction: "horizontal", seed: 97 },
  },
  {
    id: "propaganda",
    name: "Propaganda",
    family: "stretch",
    description: "Broad ink with sharp irregular edges",
    brush: { roughness: 2.3, grain: 0.12, dryness: 0.12, stretch: 5, direction: "horizontal", seed: 19 },
  },
  {
    id: "melodrama",
    name: "Melodrama",
    family: "stretch",
    description: "Soft continuous rounded ink",
    brush: { roughness: 0.6, grain: 0.08, dryness: 0.04, stretch: 3, direction: "horizontal", seed: 29 },
  },
  {
    id: "new-wave",
    name: "New Wave",
    family: "stretch",
    description: "Fine combed bristles",
    brush: { roughness: 0.35, grain: 2, dryness: 0.71, stretch: 24, direction: "horizontal", seed: 37 },
  },

  ...(
    [
      ["bubblegum", "Bubblegum", "mist", "Fine soft spray", 1.5, 1.2],
      ["witch-house", "Witch House", "spray", "Dense spray with a gritty fringe", 2, 0.7],
      ["shoegaze", "Shoegaze", "flecks", "Open scratchy granules", 2, 1.25],
      ["honky-tonk", "Honky Tonk", "grit", "Coarse round ink flecks", 2.5, 0.8],
      ["screamo", "Screamo", "bristle", "Dense short scratch marks", 2, 0.65],
      ["drone", "Drone", "blot", "Large overlapping angular blots", 4, 0.6],
      ["doo-wop", "Doo Wop", "charcoal", "Soft dense charcoal grain", 2, 0.8],
      ["spoken-word", "Spoken Word", "dust", "Sparse fine dust", 1.5, 1.8],
      ["vaporwave", "Vaporwave", "stipple", "Even screen-like stippling", 2, 1.1],
      ["oi", "Oi", "airbrush", "Dense soft airbrush", 2, 0.6],
    ] as const
  ).map(([id, name, tip, description, size, gap], index): CrosswordBrushPreset => ({
    id,
    name,
    family: "scatter",
    description,
    brush: {
      grain: 0.75,
      dryness: 0.4,
      stretch: 7,
      direction: "horizontal",
      roughness: tip === "blot" ? 2.5 : 0.8,
      seed: 10 + index * 9,
    },
    scatter: {
      angularJitter: 35,
      rotation: 0,
      tip,
      size,
      gap,
      wiggle: tip === "stipple" ? 0.15 : 1,
      sizeJitter: tip === "blot" ? 1.2 : 0.5,
    },
  })),
];

export function getBrushPresetUpdates(id: string): Record<string, string | number | boolean> | null {
  const preset = crosswordBrushPresets.find((item) => item.id === id);
  if (!preset) return null;
  return {
    "stroke.enabled": true,
    "stroke.style": preset.family,
    ...Object.fromEntries(Object.entries(preset.brush).map(([key, value]) => [`stroke.brush.${key}`, value])),
    ...Object.fromEntries(
      Object.entries(preset.scatter ?? {}).map(([key, value]) => [`stroke.scatter.${key}`, value]),
    ),
  };
}

export function matchesBrushPreset(id: string, stroke: Stroke) {
  const preset = crosswordBrushPresets.find((item) => item.id === id);
  return Boolean(
    preset &&
    stroke.style === preset.family &&
    Object.entries(preset.brush).every(
      ([key, value]) => stroke.brush[key as keyof Stroke["brush"]] === value,
    ) &&
    (!preset.scatter ||
      Object.entries(preset.scatter).every(
        ([key, value]) => stroke.scatter[key as keyof Stroke["scatter"]] === value,
      )),
  );
}
