import { useDialKit } from "dialkit";
import { embossDefaults, type EmbossParams } from "@/presets/emboss";
import { profile } from "@/presets/profile";
import { EmbossedGlyph } from "./EmbossedGlyph";

// Dev-only calibration panel mirroring Photoshop's Bevel & Emboss controls.
// Names, ranges, and defaults match embossDefaults; press Copy in the DialKit
// toolbar to export the current values as JSON for src/presets/emboss.ts.
export function EmbossDial() {
  const p = useDialKit(
    "Bevel & Emboss",
    {
      glyph: { type: "text", default: profile.glyph },
      structure: {
        style: {
          type: "select",
          options: ["inner-bevel", "outer-bevel", "emboss", "pillow-emboss"],
          default: embossDefaults.style,
        },
        technique: {
          type: "select",
          options: ["smooth", "chisel-hard", "chisel-soft"],
          default: embossDefaults.technique,
        },
        depth: [embossDefaults.depth, 1, 1000, 1],
        direction: { type: "select", options: ["up", "down"], default: embossDefaults.direction },
        size: [embossDefaults.size, 0, 60, 1],
        soften: [embossDefaults.soften, 0, 16, 0.5],
      },
      shading: {
        angle: [embossDefaults.angle, -180, 180, 1],
        altitude: [embossDefaults.altitude, 0, 90, 1],
      },
      highlight: {
        color: { type: "color", default: embossDefaults.highlight.color },
        opacity: [embossDefaults.highlight.opacity, 0, 1, 0.01],
      },
      shadow: {
        color: { type: "color", default: embossDefaults.shadow.color },
        opacity: [embossDefaults.shadow.opacity, 0, 1, 0.01],
      },
      fill: { type: "color", default: embossDefaults.fill },
    },
    { id: "emboss", persist: true },
  );

  // Select controls resolve to plain strings; narrow them back to the unions.
  const params: EmbossParams = {
    style: p.structure.style as EmbossParams["style"],
    technique: p.structure.technique as EmbossParams["technique"],
    depth: p.structure.depth,
    direction: p.structure.direction as EmbossParams["direction"],
    size: p.structure.size,
    soften: p.structure.soften,
    angle: p.shading.angle,
    altitude: p.shading.altitude,
    highlight: { color: p.highlight.color, opacity: p.highlight.opacity },
    shadow: { color: p.shadow.color, opacity: p.shadow.opacity },
    fill: p.fill,
  };

  return <EmbossedGlyph glyph={p.glyph} params={params} />;
}
