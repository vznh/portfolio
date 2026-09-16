import assert from "node:assert/strict";
import { test } from "node:test";
import { buildCrossword, nextClue } from "../src/lib/crossword.ts";
import { generateCrossword, hasDisallowedCrosswordShape } from "../src/lib/crosswordGenerator.ts";
import { crosswordWords } from "../src/presets/crosswordWords.ts";

test("generated layouts have valid clues, crossings, coverage, and a single connected shape", () => {
  const bank = new Map(crosswordWords.map((word) => [word.answer, word.clue]));
  for (const [width, height] of [
    [9, 9],
    [13, 7],
    [7, 13],
  ]) {
    for (let seed = 1; seed <= 30; seed++) {
      const definition = generateCrossword(crosswordWords, { seed, width, height, maxWords: 8 });
      const puzzle = buildCrossword(definition);
      assert.equal(hasDisallowedCrosswordShape(definition.rows), false);
      assert.ok(puzzle.width <= width && puzzle.height <= height);
      assert.ok(puzzle.entries.length >= 5 && puzzle.entries.length <= 8);
      assert.equal(new Set(puzzle.entries.map((entry) => entry.answer)).size, puzzle.entries.length);
      assert.ok(puzzle.entries.some((entry) => entry.direction === "across"));
      assert.ok(puzzle.entries.some((entry) => entry.direction === "down"));
      for (const entry of puzzle.entries) {
        assert.equal(bank.get(entry.answer), entry.clue);
        assert.equal(puzzle.numbers[entry.cells[0]], entry.number);
        assert.equal(nextClue(puzzle.entries, nextClue(puzzle.entries, entry, 1), -1), entry);
      }
      const open = puzzle.cells.flatMap((letter, index) => (letter === "#" ? [] : [index]));
      const reached = new Set([open[0]]);
      const queue = [open[0]];
      for (const index of queue) {
        for (const next of [index - 1, index + 1, index - puzzle.width, index + puzzle.width]) {
          if (next < 0 || next >= puzzle.cells.length || puzzle.cells[next] === "#" || reached.has(next))
            continue;
          if (
            Math.abs(next - index) === 1 &&
            Math.floor(next / puzzle.width) !== Math.floor(index / puzzle.width)
          )
            continue;
          reached.add(next);
          queue.push(next);
        }
      }
      assert.equal(reached.size, open.length);
      for (const index of open) {
        const entries = puzzle.entries.filter((entry) => entry.cells.includes(index));
        assert.ok(entries.length >= 1 && entries.length <= 2);
        assert.equal(new Set(entries.map((entry) => entry.direction)).size, entries.length);
      }
    }
  }
});

function hookedCross({ diagonal = false, lengths = [2, 2, 2, 2], hooks = 4, extra = false } = {}) {
  const grid = Array.from({ length: 17 }, () => Array(17).fill("#"));
  const directions = diagonal
    ? [
        [1, 1],
        [-1, 1],
        [-1, -1],
        [1, -1],
      ]
    : [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1],
      ];
  grid[8][8] = "A";
  directions.forEach(([dx, dy], arm) => {
    const length = lengths[arm];
    for (let i = 1; i <= length; i++) grid[8 + dy * i][8 + dx * i] = "A";
    if (arm < hooks) {
      for (let i = 1; i <= 2; i++) grid[8 + dy * length + dx * i][8 + dx * length - dy * i] = "A";
    }
  });
  if (extra) {
    grid[8][9] = "A";
    grid[8][10] = "A";
    grid[8][11] = "A";
  }
  return grid.map((row) => row.join(""));
}

const rotate = (rows) =>
  rows[0].split("").map((_, x) =>
    rows
      .map((row) => row[x])
      .reverse()
      .join(""),
  );
const mirror = (rows) => rows.map((row) => [...row].reverse().join(""));

test("shape guard rejects rotated, mirrored, diagonal, uneven, and partial hooked crosses", () => {
  for (const options of [{}, { diagonal: true }, { lengths: [2, 3, 4, 2] }, { hooks: 3 }, { extra: true }]) {
    let rows = hookedCross(options);
    for (let rotation = 0; rotation < 4; rotation++) {
      assert.equal(hasDisallowedCrosswordShape(rows), true);
      assert.equal(hasDisallowedCrosswordShape(mirror(rows)), true);
      rows = rotate(rows);
    }
  }
});

test("shape guard allows ordinary crosses, rectangles, and asymmetrical branches", () => {
  for (const rows of [
    ["##A##", "##A##", "AAAAA", "##A##", "##A##"],
    ["AAAAA", "AAAAA", "AAAAA", "AAAAA", "AAAAA"],
    ["AAAAA", "##A##", "##AAA", "##A##"],
    hookedCross({ hooks: 2 }),
    ["###", "###"],
  ])
    assert.equal(hasDisallowedCrosswordShape(rows), false);
});

test("generator replaces a previously selected flagged layout deterministically", () => {
  const rejected = [
    "LIGHT##",
    "##R####",
    "##A#INK",
    "##I#M##",
    "CANVAS#",
    "####G##",
    "FRAME##",
    "##R####",
    "PATTERN",
  ];
  assert.equal(hasDisallowedCrosswordShape(rejected), true);
  const options = { seed: 7, width: 9, height: 9, maxWords: 8 };
  const result = generateCrossword(crosswordWords, options);
  assert.notDeepEqual(result.rows, rejected);
  assert.equal(hasDisallowedCrosswordShape(result.rows), false);
  assert.ok(buildCrossword(result).entries.length >= 5);
  assert.deepEqual(generateCrossword(crosswordWords, options), result);
});

test("seeds reproduce layouts and different seeds provide variation", () => {
  const options = { seed: 42, width: 13, height: 7 };
  assert.deepEqual(generateCrossword(crosswordWords, options), generateCrossword(crosswordWords, options));
  const ids = new Set(
    Array.from({ length: 10 }, (_, seed) => generateCrossword(crosswordWords, { seed }).id),
  );
  assert.ok(ids.size >= 8);
});

test("invalid inputs and impossible word lists fail clearly", () => {
  assert.throws(() => generateCrossword(crosswordWords, { seed: 1, width: 16 }), /dimensions/);
  assert.throws(() => generateCrossword(crosswordWords, { seed: 1, maxWords: 1 }), /words/);
  assert.throws(() => generateCrossword([{ answer: "A B", clue: "Bad" }], { seed: 1 }), /letters/);
  assert.throws(() => generateCrossword([], { seed: 1 }), /connected crossword/);
  assert.throws(
    () =>
      generateCrossword(
        [
          { answer: "ABC", clue: "One" },
          { answer: "XYZ", clue: "Two" },
        ],
        { seed: 1 },
      ),
    /connected crossword/,
  );
});

test("freeform grids allow single-direction squares but reject orphan cells", () => {
  const definition = {
    id: "cross",
    layout: "freeform",
    rows: ["#C#", "BAR", "#T#"],
    clues: { across: { 2: "A counter" }, down: { 1: "A feline" } },
  };
  assert.deepEqual(
    buildCrossword(definition).entries.map((entry) => entry.answer),
    ["CAT", "BAR"],
  );
  assert.throws(() => buildCrossword({ ...definition, rows: ["###", "#A#", "###"] }), /belong/);
  assert.throws(() => buildCrossword({ ...definition, rows: ["###", "###", "###"] }), /belong/);
});
