import assert from "node:assert/strict";
import { test } from "node:test";
import { advanceCrossword, selectCrossword } from "../src/lib/crosswordRotation.ts";
import { crosswordPermutations } from "../src/presets/crosswordPermutations.ts";

function memoryStorage() {
  const values = new Map();
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}

test("each reload advances even with unfinished answers; refresh also reserves the next reload", () => {
  const storage = memoryStorage();
  const current = selectCrossword(storage, crosswordPermutations);
  storage.setItem(current.progressKey, JSON.stringify(["A", "", "B"]));
  const reloaded = selectCrossword(storage, crosswordPermutations);
  assert.equal(reloaded.index, 1);
  assert.equal(storage.getItem(current.progressKey), '["A","","B"]');
  const next = advanceCrossword(storage, reloaded, crosswordPermutations);
  assert.equal(current.index, 0);
  assert.equal(next.index, 2);
  assert.deepEqual(advanceCrossword(storage, reloaded, crosswordPermutations), next);
  assert.equal(selectCrossword(storage, crosswordPermutations).index, 3);
});

test("cycles through the whole catalog and uses fresh progress after wrapping", () => {
  const storage = memoryStorage();
  const first = selectCrossword(storage, crosswordPermutations);
  let current = first;
  const visited = new Set();
  for (let i = 0; i < crosswordPermutations.length; i++) {
    visited.add(current.index);
    storage.setItem(current.progressKey, "saved solution");
    current = selectCrossword(storage, crosswordPermutations);
  }
  assert.equal(visited.size, crosswordPermutations.length);
  assert.equal(current.index, 0);
  assert.notEqual(current.progressKey, first.progressKey);
  assert.equal(storage.getItem(current.progressKey), null);
  assert.equal(storage.getItem(first.progressKey), "saved solution");
  advanceCrossword(storage, first, crosswordPermutations);
  assert.equal(
    selectCrossword(storage, crosswordPermutations).position,
    crosswordPermutations.length + 1,
    "stale tabs cannot rewind reloads",
  );
});

test("invalid or unavailable storage falls back safely and refresh can advance in memory", () => {
  for (const value of ["broken", "null", "-1", "1.5", '"4"', "{}", "9007199254740991"]) {
    const storage = { getItem: () => value, setItem: () => {} };
    assert.equal(selectCrossword(storage, crosswordPermutations).index, 0);
  }
  const blocked = {
    getItem() {
      throw new Error("blocked");
    },
    setItem() {
      throw new Error("blocked");
    },
  };
  for (const storage of [null, blocked]) {
    let selection = selectCrossword(storage, crosswordPermutations);
    assert.equal(selection.index, 0);
    selection = advanceCrossword(storage, selection, crosswordPermutations);
    selection = advanceCrossword(storage, selection, crosswordPermutations);
    assert.equal(selection.index, 2);
  }
  assert.throws(() => selectCrossword(null, []), /at least one/);
});
