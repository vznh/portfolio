import assert from "node:assert/strict";
import { test } from "node:test";
import { getReadingGuide } from "../src/lib/readingGuide.ts";

const row = (top, height = 20) => ({ top, bottom: top + height, height });

test("selects the row at the band's midpoint when its top line touches the previous row", () => {
  const guide = getReadingGuide([row(185), row(205)], 800);
  assert.deepEqual(guide, { top: 200, height: 20, index: 1 });
});

test("selects every record under the midpoint throughout a scroll", () => {
  for (let scroll = 0; scroll <= 1000; scroll++) {
    const rows = Array.from({ length: 38 }, (_, index) => row(300 + index * 20 - scroll));
    const guide = getReadingGuide(rows, 800);
    const expected = Math.floor((210 - (300 - scroll)) / 20);
    assert.equal(guide.index, expected >= 0 && expected < 38 ? expected : null);
  }
});

test("switches exactly at a shared row boundary", () => {
  assert.equal(getReadingGuide([row(190), row(210)], 800).index, 1);
  assert.equal(getReadingGuide([row(190.1), row(210.1)], 800).index, 0);
});

test("does not select a record outside the list or in a gap", () => {
  assert.equal(getReadingGuide([], 800).index, null);
  assert.equal(getReadingGuide([row(211)], 800).index, null);
  assert.equal(getReadingGuide([row(190)], 800).index, null);
  assert.equal(getReadingGuide([row(180), row(220)], 800).index, null);
});

test("handles wrapped rows without shifting the scan band", () => {
  const guide = getReadingGuide([row(170), row(190, 40), row(230)], 800);
  assert.deepEqual(guide, { top: 200, height: 20, index: 1 });
});

test("uses the visible viewport height and offset for both the guide and selected row", () => {
  const rows = [row(195), row(215), row(235)];
  assert.deepEqual(getReadingGuide(rows, 600, 50), { top: 200, height: 20, index: 0 });
  assert.deepEqual(getReadingGuide(rows, 680, 50), { top: 220, height: 20, index: 1 });
});
