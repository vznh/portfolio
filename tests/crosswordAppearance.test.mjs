import assert from "node:assert/strict";
import { test } from "node:test";
import { getBrushFrequency, getNativeStrokeWidth } from "../src/lib/crosswordAppearance.ts";
import { crosswordAppearanceDefaults } from "../src/presets/crosswordAppearance.ts";
import {
  crosswordBrushPresets,
  getBrushPresetUpdates,
  matchesBrushPreset,
} from "../src/presets/crosswordBrushes.ts";

import { createScatterTile } from "../src/lib/crosswordScatter.ts";

const stroke = crosswordAppearanceDefaults.stroke;

test("brush presets change texture without overwriting geometry, color, fill, or halftone", () => {
  for (const preset of crosswordBrushPresets) {
    const updates = getBrushPresetUpdates(preset.id);
    assert.ok(updates);
    assert.ok(
      Object.keys(updates).every(
        (key) =>
          key.startsWith("stroke.brush.") ||
          key.startsWith("stroke.scatter.") ||
          key === "stroke.style" ||
          key === "stroke.enabled",
      ),
    );
    assert.equal(
      matchesBrushPreset(preset.id, {
        ...stroke,
        style: preset.family,
        brush: preset.brush,
        scatter: preset.scatter ?? stroke.scatter,
      }),
      true,
    );
    assert.equal(
      matchesBrushPreset(preset.id, {
        ...stroke,
        style: preset.family,
        scatter: preset.scatter ?? stroke.scatter,
        brush: { ...preset.brush, roughness: preset.brush.roughness + 0.1 },
      }),
      false,
    );
  }
  assert.equal(getBrushPresetUpdates("custom"), null);
  assert.equal(new Set(crosswordBrushPresets.map((preset) => JSON.stringify(preset.brush))).size, 25);
});

test("native stroke width changes geometry without depending on opacity", () => {
  for (const weight of [0, 0.2, 0.45, 0.5, 1, 2]) {
    for (const opacity of [0, 0.3, 1]) {
      assert.equal(getNativeStrokeWidth({ ...stroke, position: "outside", weight, opacity }), weight * 2);
      assert.equal(getNativeStrokeWidth({ ...stroke, position: "inside", weight, opacity }), weight * 2);
      assert.equal(getNativeStrokeWidth({ ...stroke, position: "center", weight, opacity }), weight);
    }
  }
  assert.equal(getNativeStrokeWidth({ ...stroke, enabled: false, weight: 2 }), 0);
});

test("stretch changes bristle length along only the chosen axis", () => {
  const horizontal = getBrushFrequency({
    ...stroke,
    style: "stretch",
    brush: { ...stroke.brush, grain: 1, stretch: 10, direction: "horizontal" },
  });
  const vertical = getBrushFrequency({
    ...stroke,
    style: "stretch",
    brush: { ...stroke.brush, grain: 1, stretch: 10, direction: "vertical" },
  });
  assert.deepEqual(horizontal, [0.1, 1]);
  assert.deepEqual(vertical, [1, 0.1]);
  assert.deepEqual(
    getBrushFrequency({ ...stroke, style: "brush", brush: { ...stroke.brush, grain: 1 } }),
    [1, 1],
  );
});

test("zero or negative brush settings cannot generate invalid SVG frequencies or radii", () => {
  assert.equal(getNativeStrokeWidth({ ...stroke, weight: -1 }), 0);
  const frequencies = getBrushFrequency({
    ...stroke,
    brush: { ...stroke.brush, grain: 0, stretch: 0 },
  });
  assert.ok(frequencies.every((value) => Number.isFinite(value) && value > 0));
});

test("catalog includes every built-in stretch and scatter brush with unique ids", () => {
  assert.equal(crosswordBrushPresets.filter((p) => p.family === "stretch").length, 15);
  assert.equal(crosswordBrushPresets.filter((p) => p.family === "scatter").length, 10);
  assert.equal(new Set(crosswordBrushPresets.map((p) => p.id)).size, 25);
});

test("scatter is repeatable and spacing, jitter, tip and seed affect the generated texture", () => {
  const s = stroke.scatter;
  const tile = createScatterTile(s, 7);
  assert.deepEqual(createScatterTile(s, 7), tile);
  assert.notEqual(createScatterTile(s, 8).uri, tile.uri);
  assert.equal(createScatterTile({ ...s, gap: s.gap * 2 }, 7).size, tile.size * 2);
  for (const change of [
    { tip: s.tip === "dust" ? "spray" : "dust" },
    { wiggle: 2 },
    { sizeJitter: 1.5 },
    { angularJitter: 90 },
    { rotation: 45 },
  ]) {
    assert.notEqual(createScatterTile({ ...s, ...change }, 7).uri, tile.uri);
  }
  for (const preset of crosswordBrushPresets.filter((p) => p.family === "scatter")) {
    const output = createScatterTile(preset.scatter, preset.brush.seed);
    assert.ok(output.size > 0);
    assert.ok(!output.uri.includes("NaN"));
    assert.ok(output.uri.length < 250000, "texture generation stays bounded");
    const modified = {
      ...stroke,
      style: "scatter",
      brush: preset.brush,
      scatter: { ...preset.scatter, gap: 3.9 },
    };
    assert.equal(matchesBrushPreset(preset.id, modified), false);
  }
});
