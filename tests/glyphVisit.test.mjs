import assert from "node:assert/strict";
import { test } from "node:test";
import { createVisitGlyphPicker } from "../src/lib/glyphVisit.ts";

function memoryStorage() {
  const values = new Map();
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}

test("one visit keeps its logo through navigation, remounts, and effect replays", () => {
  const storage = memoryStorage();
  const pick = createVisitGlyphPicker();
  let draws = 0;
  const random = () => {
    draws++;
    return 0.6;
  };
  const first = pick(5, storage, random);
  for (let navigation = 0; navigation < 20; navigation++) {
    assert.equal(pick(5, storage, random), first);
  }
  assert.equal(draws, 1);
});

test("fresh visits vary across all versions without immediately repeating", () => {
  const storage = memoryStorage();
  const seen = new Set();
  let previous;
  for (let visit = 0; visit < 100; visit++) {
    const pick = createVisitGlyphPicker();
    const index = pick(5, storage, () => (visit % 10) / 10);
    assert.ok(index >= 0 && index < 5);
    assert.notEqual(index, previous);
    previous = index;
    seen.add(index);
  }
  assert.equal(seen.size, 5);
});

test("blocked storage still gives a stable logo for the current visit", () => {
  const blocked = {
    getItem() {
      throw new Error("blocked");
    },
    setItem() {
      throw new Error("blocked");
    },
  };
  for (const storage of [undefined, blocked]) {
    const pick = createVisitGlyphPicker();
    assert.equal(
      pick(5, storage, () => 0.8),
      4,
    );
    assert.equal(
      pick(5, storage, () => 0),
      4,
    );
  }
});

test("invalid saved indices are ignored and one-version catalogs stay valid", () => {
  for (const value of [null, "", "bad", "-1", "1.5", "99"]) {
    assert.equal(
      createVisitGlyphPicker()(5, { getItem: () => value, setItem() {} }, () => 0),
      0,
    );
  }
  const storage = memoryStorage();
  assert.equal(
    createVisitGlyphPicker()(1, storage, () => 0.9),
    0,
  );
  assert.equal(
    createVisitGlyphPicker()(1, storage, () => 0.9),
    0,
  );
  assert.throws(() => createVisitGlyphPicker()(0), /At least one/);
});
