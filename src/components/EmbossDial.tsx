import { useEffect } from "react";
import { useDialKitController, DialRoot, DialStore, type DialValue } from "dialkit";
import { embossDefaults, type EmbossParams, type EmbossVersion } from "@/presets/emboss";
import { EmbossedGlyph } from "./EmbossedGlyph";

// Dev-only calibration panel mirroring Photoshop's Bevel & Emboss controls.
// Names, ranges, and defaults match embossDefaults; press Copy in the DialKit
// toolbar to export the current values as JSON for src/presets/emboss.ts.
// Toggle the panel with Cmd/Ctrl+E. On mount a random saved version (preset)
// is loaded, mirroring production. The "copyVersions" action copies every
// saved version as an EmbossParams[] for src/presets/emboss.ts.
const PANEL_ID = "emboss";
// Seed for the panel's glyph field only; real characters live in saved versions.
const DIAL_GLYPH = "A";

// Preset values are stored flat with dotted keys ("highlight.opacity").
function fromDialValues(values: Record<string, DialValue>): EmbossVersion {
  const pick = <T,>(key: string, fallback: T) => (values[key] === undefined ? fallback : (values[key] as T));
  return {
    glyph: pick("glyph", DIAL_GLYPH),
    style: pick("structure.style", embossDefaults.style),
    technique: pick("structure.technique", embossDefaults.technique),
    depth: pick("structure.depth", embossDefaults.depth),
    direction: pick("structure.direction", embossDefaults.direction),
    size: pick("structure.size", embossDefaults.size),
    soften: pick("structure.soften", embossDefaults.soften),
    angle: pick("shading.angle", embossDefaults.angle),
    altitude: pick("shading.altitude", embossDefaults.altitude),
    highlight: {
      color: pick("highlight.color", embossDefaults.highlight.color),
      opacity: pick("highlight.opacity", embossDefaults.highlight.opacity),
    },
    shadow: {
      color: pick("shadow.color", embossDefaults.shadow.color),
      opacity: pick("shadow.opacity", embossDefaults.shadow.opacity),
    },
    fill: pick("fill", embossDefaults.fill),
  };
}

export function EmbossDial() {
  const dial = useDialKitController(
    "Bevel & Emboss",
    {
      glyph: { type: "text", default: DIAL_GLYPH },
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
      copyVersions: { type: "action" },
    },
    {
      id: PANEL_ID,
      persist: true,
      onAction: (action) => {
        if (action !== "copyVersions") return;
        const versions = DialStore.getPresets(PANEL_ID).map((preset) => fromDialValues(preset.values));
        void navigator.clipboard.writeText(JSON.stringify(versions, null, 2));
      },
    },
  );

  // Pick a random saved version on mount, like production does.
  useEffect(() => {
    const presets = DialStore.getPresets(PANEL_ID);
    if (presets.length === 0) return;
    DialStore.loadPreset(PANEL_ID, presets[Math.floor(Math.random() * presets.length)].id);
  }, []);
  const p = dial.values;

  // Panel toggle shortcut: Cmd/Ctrl+E. Undefined open state defers to
  // DialRoot's defaultOpen (true), so treat undefined as open when toggling.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "e") return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      dial.setOpen(!(dial.getOpen() ?? true));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dial]);

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

  // DialRoot must come from the same module instance as the hook: importing
  // dialkit twice (ESM + CJS) yields two DialStores and an empty panel list.
  return (
    <>
      <EmbossedGlyph glyph={p.glyph} params={params} />
      <DialRoot position="bottom-right" />
    </>
  );
}
