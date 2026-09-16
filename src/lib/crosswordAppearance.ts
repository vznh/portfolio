import type { CrosswordAppearance } from "../presets/crosswordAppearance";

export function getNativeStrokeWidth(stroke: CrosswordAppearance["stroke"]) {
  const weight = stroke.enabled ? Math.max(0, stroke.weight) : 0;
  return stroke.position === "center" ? weight : weight * 2;
}
export function getBrushFrequency(stroke: CrosswordAppearance["stroke"]) {
  const grain = Math.max(0.05, stroke.brush.grain);
  const longAxis = stroke.style === "stretch" ? grain / Math.max(1, stroke.brush.stretch) : grain;
  return stroke.brush.direction === "vertical" ? [grain, longAxis] : [longAxis, grain];
}
