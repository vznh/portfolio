import { useEffect, useRef } from "react";
import { useDialKitController, DialRoot, DialStore, type DialValue } from "dialkit";
import { embossDefaults, type EmbossVersion } from "@/presets/emboss";

const PANEL_ID = "emboss";

const DIAL_GLYPH = "♰";

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

export function EmbossDial({
  initialVersion,
  onChange,
}: {
  initialVersion: EmbossVersion;
  onChange: (version: EmbossVersion) => void;
}) {
  const initialVersionRef = useRef(initialVersion);
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

  useEffect(() => {
    // Reopening the controls edits the visit's existing logo rather than picking
    // a new preset during the page's exit or entrance animation.
    const version = initialVersionRef.current;
    // DialKit writes edits into the active saved preset. Select the base values
    // first so initializing a visit never overwrites a user's preset.
    DialStore.clearActivePreset(PANEL_ID);
    DialStore.updateValues(PANEL_ID, {
      glyph: version.glyph,
      "structure.style": version.style,
      "structure.technique": version.technique,
      "structure.depth": version.depth,
      "structure.direction": version.direction,
      "structure.size": version.size,
      "structure.soften": version.soften,
      "shading.angle": version.angle,
      "shading.altitude": version.altitude,
      "highlight.color": version.highlight.color,
      "highlight.opacity": version.highlight.opacity,
      "shadow.color": version.shadow.color,
      "shadow.opacity": version.shadow.opacity,
      fill: version.fill,
    });
  }, []);
  const p = dial.values;

  useEffect(() => {
    // Read after initialization so stale persisted values cannot flash the logo.
    onChange(fromDialValues(DialStore.getValues(PANEL_ID)));
  }, [onChange, p]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "e") return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }
      e.preventDefault();
      dial.setOpen(!(dial.getOpen() ?? true));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dial]);

  return <DialRoot position="bottom-right" />;
}
