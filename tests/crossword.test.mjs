import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildCrossword,
  isCrosswordSolved,
  nextClue,
  nextSquare,
  nextUnfinishedSquare,
} from "../src/lib/crossword.ts";
import { miniCrossword } from "../src/presets/crossword.ts";

const puzzle = buildCrossword(miniCrossword);

test("Tab visits clues in display order and wraps through Across and Down", () => {
  const first = puzzle.entries.find((entry) => entry.number === 1 && entry.direction === "across");
  let current = first;
  const visited = [];
  for (let i = 0; i < puzzle.entries.length; i++) {
    visited.push(`${current.number} ${current.direction}`);
    current = nextClue(puzzle.entries, current, 1);
  }
  assert.deepEqual(visited, [
    "1 across",
    "4 across",
    "5 across",
    "6 across",
    "7 across",
    "1 down",
    "2 down",
    "3 down",
    "4 down",
    "5 down",
  ]);
  assert.equal(current, first);
});

test("Shift+Tab reverses every clue transition, including wraparound", () => {
  for (const entry of puzzle.entries) {
    assert.equal(nextClue(puzzle.entries, nextClue(puzzle.entries, entry, 1), -1), entry);
    assert.equal(nextClue(puzzle.entries, nextClue(puzzle.entries, entry, -1), 1), entry);
  }
  const first = puzzle.entries.find((entry) => entry.number === 1 && entry.direction === "across");
  const previous = nextClue(puzzle.entries, first, -1);
  assert.equal(previous.number, 5);
  assert.equal(previous.direction, "down");
});

test("Tab and Shift+Tab skip correct answers across direction boundaries and wraparound", () => {
  const across = puzzle.entries.filter((entry) => entry.direction === "across");
  const down = puzzle.entries.filter((entry) => entry.direction === "down");
  const letters = puzzle.cells.map(() => "");
  for (const entry of [across.at(-1), down[0], down.at(-1)]) {
    entry.cells.forEach((cell, position) => {
      letters[cell] = entry.answer[position];
    });
  }
  assert.equal(nextClue(puzzle.entries, across.at(-2), 1, letters), down[1]);
  assert.equal(nextClue(puzzle.entries, down[1], -1, letters), across.at(-2));
  assert.equal(nextClue(puzzle.entries, down.at(-2), 1, letters), across[0]);
  assert.equal(nextClue(puzzle.entries, across[0], -1, letters), down.at(-2));
});

test("filled but incorrect answers remain reachable and corrected answers are skipped", () => {
  const first = puzzle.entries.find((entry) => entry.number === 1 && entry.direction === "across");
  const second = nextClue(puzzle.entries, first, 1);
  const letters = puzzle.cells.map(() => "");
  second.cells.forEach((cell, position) => {
    letters[cell] = second.answer[position];
  });
  assert.notEqual(nextClue(puzzle.entries, first, 1, letters), second);
  letters[second.cells[0]] = "Z";
  assert.equal(nextClue(puzzle.entries, first, 1, letters), second);
  letters[second.cells[0]] = "";
  assert.equal(nextClue(puzzle.entries, first, 1, letters), second);
});

test("navigation terminates when every clue is correct and finds the only unfinished clue", () => {
  for (const step of [1, -1]) {
    assert.equal(nextClue(puzzle.entries, puzzle.entries[0], step, puzzle.cells), undefined);
  }
  const entries = [
    { number: 1, direction: "across", cells: [0, 1], answer: "AB" },
    { number: 2, direction: "down", cells: [1, 2], answer: "BC" },
  ];
  for (const step of [1, -1]) {
    assert.equal(nextClue(entries, entries[0], step, ["", "B", "C"]), entries[0]);
    assert.equal(nextClue(entries, entries[1], step, ["", "B", "C"]), entries[0]);
  }
});

test("the mini has unique answers, valid crossings, and a clue for every entry", () => {
  assert.equal(puzzle.width, 5);
  assert.equal(puzzle.height, 5);
  assert.equal(puzzle.entries.length, 10);
  assert.equal(new Set(puzzle.entries.map((entry) => entry.answer)).size, 10);
  for (const direction of ["across", "down"]) {
    const entries = puzzle.entries.filter((entry) => entry.direction === direction);
    assert.deepEqual(
      entries.map((entry) => entry.number),
      Object.keys(miniCrossword.clues[direction]).map(Number),
    );
  }
  puzzle.cells.forEach((letter, index) => {
    assert.equal(letter === "#", puzzle.cells.at(-index - 1) === "#", "grid is rotationally symmetric");
    if (letter === "#") return;
    const crossings = puzzle.entries.filter((entry) => entry.cells.includes(index));
    assert.equal(crossings.length, 2);
    assert.deepEqual(new Set(crossings.map((entry) => entry.direction)), new Set(["across", "down"]));
    for (const entry of crossings) assert.equal(entry.answer[entry.cells.indexOf(index)], letter);
  });
});

test("rejects oversized, malformed, or unclued puzzles", () => {
  assert.throws(() => buildCrossword({ ...miniCrossword, rows: Array(16).fill("ABCDE") }), /at most 15/);
  assert.throws(() => buildCrossword({ ...miniCrossword, rows: ["ABCDEFGHIJKLMNOP"] }), /at most 15/);
  assert.throws(() => buildCrossword({ ...miniCrossword, rows: ["ABC", "AB"] }), /rectangular/);
  assert.throws(() => buildCrossword({ ...miniCrossword, clues: { across: {}, down: {} } }), /clue/);
});

test("navigation stays within the grid and never lands on a block or wraps a row", () => {
  for (let index = 0; index < puzzle.cells.length; index++) {
    if (puzzle.cells[index] === "#") continue;
    for (const delta of [-5, -1, 1, 5]) {
      const target = nextSquare(puzzle.cells, puzzle.width, index, delta);
      assert.ok(target >= 0 && target < puzzle.cells.length);
      assert.notEqual(puzzle.cells[target], "#");
      if (Math.abs(delta) === 1) assert.equal(Math.floor(target / 5), Math.floor(index / 5));
      else assert.equal(target % 5, index % 5);
    }
  }
  assert.equal(nextSquare(puzzle.cells, 5, 4, 1), 4);
  assert.equal(nextSquare(puzzle.cells, 5, 2, -1), 2);
  assert.equal(nextSquare(puzzle.cells, 5, 10, 5), 15);
});

test("completion requires every open square to be correct", () => {
  assert.equal(
    isCrosswordSolved(
      puzzle.cells,
      puzzle.cells.map(() => ""),
    ),
    false,
  );
  assert.equal(isCrosswordSolved(puzzle.cells, puzzle.cells), true);
  const letters = [...puzzle.cells];
  letters[2] = "Z";
  assert.equal(isCrosswordSolved(puzzle.cells, letters), false);
  letters[2] = "";
  assert.equal(isCrosswordSolved(puzzle.cells, letters), false);
});

test("typing skips correct crossings in both across and down answers", () => {
  for (const entry of puzzle.entries) {
    const letters = [...puzzle.cells];
    const last = entry.cells.at(-1);
    letters[last] = "";
    assert.equal(nextUnfinishedSquare(entry, entry.cells[0], letters), last);
    letters[last] = "!";
    assert.equal(nextUnfinishedSquare(entry, entry.cells[0], letters), last);
  }
});

test("typing wraps to an unfinished square but stays put when the answer is complete", () => {
  for (const entry of puzzle.entries) {
    const letters = [...puzzle.cells];
    const first = entry.cells[0];
    const last = entry.cells.at(-1);
    assert.equal(nextUnfinishedSquare(entry, first, letters), first);
    assert.equal(nextUnfinishedSquare(entry, last, letters), last);
    letters[first] = "";
    assert.equal(nextUnfinishedSquare(entry, last, letters), first);
    assert.equal(nextUnfinishedSquare(entry, first, letters), first);
  }
});
