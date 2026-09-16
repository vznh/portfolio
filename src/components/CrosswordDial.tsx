import { useEffect, useRef } from "react";
import { DialRoot, DialStore, useDialKitController, type DialConfig } from "dialkit";
import {
  crosswordAppearanceDefaults as defaults,
  type CrosswordAppearance,
} from "@/presets/crosswordAppearance";
import { useContentView } from "@/hooks/useContentView";
import { crosswordBrushPresets, getBrushPresetUpdates, matchesBrushPreset } from "@/presets/crosswordBrushes";

const PANEL_ID = "crossword-print";
const config = {
  halftone: {
    enabled: defaults.halftone.enabled,
    preview: false,
    opacity: [defaults.halftone.opacity, 0, 1, 0.01],
    scale: [defaults.halftone.scale, 0.15, 3, 0.05],
    rotation: [defaults.halftone.rotation, -180, 180, 1],
    contrast: [defaults.halftone.contrast, 0.5, 5, 0.1],
    blend: {
      type: "select",
      options: [
        { value: "screen", label: "Screen · wear the ink" },
        { value: "multiply", label: "Multiply · mark the paper" },
        { value: "soft-light", label: "Soft light" },
      ],
      default: defaults.halftone.blend,
    },
    offsetX: [defaults.halftone.offsetX, -500, 500, 1],
    offsetY: [defaults.halftone.offsetY, -500, 500, 1],
  },
  stroke: {
    enabled: defaults.stroke.enabled,
    preset: {
      type: "select",
      options: [
        { value: "custom", label: "Custom" },
        ...crosswordBrushPresets.map((preset) => ({
          value: preset.id,
          label: `${preset.family === "stretch" ? "Stretch" : "Scatter"} · ${preset.name}`,
        })),
      ],
      default: "custom",
    },
    position: { type: "select", options: ["outside", "center", "inside"], default: defaults.stroke.position },
    style: {
      type: "select",
      options: [
        { value: "solid", label: "Solid" },
        { value: "brush", label: "Dry brush" },
        { value: "stretch", label: "Stretch brush" },
        { value: "scatter", label: "Scatter brush" },
      ],
      default: defaults.stroke.style,
    },
    weight: [defaults.stroke.weight, 0, 4, 0.05],
    color: { type: "color", default: defaults.stroke.color },
    opacity: [defaults.stroke.opacity, 0, 1, 0.01],
    fillOpacity: [defaults.stroke.fillOpacity, 0, 1, 0.01],
    inkWear: [defaults.stroke.inkWear, 0, 1, 0.01],
    brush: {
      _collapsed: true,
      roughness: [defaults.stroke.brush.roughness, 0, 5, 0.05],
      grain: [defaults.stroke.brush.grain, 0.05, 2, 0.05],
      dryness: [defaults.stroke.brush.dryness, 0, 1, 0.01],
      stretch: [defaults.stroke.brush.stretch, 1, 24, 0.5],
      direction: {
        type: "select",
        options: ["horizontal", "vertical"],
        default: defaults.stroke.brush.direction,
      },
      seed: [defaults.stroke.brush.seed, 1, 100, 1],
    },
    scatter: {
      _collapsed: true,
      tip: {
        type: "select",
        options: [
          "mist",
          "spray",
          "flecks",
          "grit",
          "bristle",
          "blot",
          "charcoal",
          "dust",
          "stipple",
          "airbrush",
        ],
        default: defaults.stroke.scatter.tip,
      },
      size: [defaults.stroke.scatter.size, 0.5, 8, 0.1],
      gap: [defaults.stroke.scatter.gap, 0.25, 4, 0.05],
      wiggle: [defaults.stroke.scatter.wiggle, 0, 3, 0.05],
      sizeJitter: [defaults.stroke.scatter.sizeJitter, 0, 3, 0.05],
      angularJitter: [defaults.stroke.scatter.angularJitter, 0, 180, 1],
      rotation: [defaults.stroke.scatter.rotation, -180, 180, 1],
    },
  },
  reset: { type: "action" },
} satisfies DialConfig;

function PrintControls({ onChange }: { onChange: (appearance: CrosswordAppearance) => void }) {
  const dial = useDialKitController("Crossword · Print", config, {
    id: PANEL_ID,
    persist: true,
    onAction: (action) => {
      if (action === "reset") DialStore.resetValues(PANEL_ID);
    },
  });
  const p = dial.values;
  const previousPreset = useRef(p.stroke.preset);

  useEffect(() => {
    const changedPreset = previousPreset.current !== p.stroke.preset;
    previousPreset.current = p.stroke.preset;
    if (changedPreset) {
      const updates = getBrushPresetUpdates(p.stroke.preset);
      if (updates) {
        DialStore.updateValues(PANEL_ID, updates);
        return;
      }
    }
    const { preview, ...halftone } = p.halftone;
    const { preset, ...strokeValues } = p.stroke;
    const stroke: CrosswordAppearance["stroke"] = {
      ...strokeValues,
      position: p.stroke.position as CrosswordAppearance["stroke"]["position"],
      style: p.stroke.style as CrosswordAppearance["stroke"]["style"],
      brush: { ...p.stroke.brush, direction: p.stroke.brush.direction as "horizontal" | "vertical" },
      scatter: {
        ...p.stroke.scatter,
        tip: p.stroke.scatter.tip as CrosswordAppearance["stroke"]["scatter"]["tip"],
      },
    };
    if (preset !== "custom" && !matchesBrushPreset(preset, stroke)) {
      DialStore.updateValue(PANEL_ID, "stroke.preset", "custom");
      return;
    }
    onChange({
      halftone: {
        ...halftone,
        blend: halftone.blend as CrosswordAppearance["halftone"]["blend"],
        ...(preview ? { enabled: true, opacity: 0.7, scale: 1.2, contrast: 3 } : {}),
      },
      stroke,
    });
  }, [onChange, p]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "e") return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.matches("input, textarea, select") || target.isContentEditable)
      )
        return;
      event.preventDefault();
      dial.setOpen(!(dial.getOpen() ?? true));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dial]);

  return <DialRoot position="bottom-right" theme="light" />;
}

export default function CrosswordDial(props: { onChange: (appearance: CrosswordAppearance) => void }) {
  const contentView = useContentView();
  return contentView ? null : <PrintControls {...props} />;
}
