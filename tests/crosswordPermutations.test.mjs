import assert from "node:assert/strict";
import { test } from "node:test";
import { sections } from "../src/presets/content.ts";
import { profile } from "../src/presets/profile.ts";
import { crosswordWords, crosswordWordThemes } from "../src/presets/crosswordWords.ts";
import { crosswordPermutations } from "../src/presets/crosswordPermutations.ts";
import { buildCrossword } from "../src/lib/crossword.ts";
import { crosswordIntersections, hasDisallowedCrosswordShape } from "../src/lib/crosswordGenerator.ts";
const visibleText = [profile.name, ...profile.locations.map((place) => place.name)];
for (const section of sections) {
  visibleText.push(section.heading ?? "", ...section.body);
  for (const project of section.projects ?? []) visibleText.push(project.name, project.description);
  for (const record of section.records ?? []) visibleText.push(record.title, record.category);
  for (const entry of section.entries ?? []) {
    for (const block of entry.blocks) visibleText.push(...(typeof block === "string" ? [block] : block.list));
  }
}
const tokens = new Set(
  visibleText
    .join(" ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toUpperCase()
    .match(/[A-Z]+/g),
);

test("every curated answer appears as a visible word on the content page", () => {
  assert.equal(new Set(crosswordWords.map((word) => word.answer)).size, crosswordWords.length);
  for (const word of crosswordWords) {
    assert.ok(tokens.has(word.answer), `${word.answer} is not visible on the content page`);
    assert.ok(word.clue.length > 0 && word.clue.length <= 65, `${word.answer} needs a concise clue`);
  }
});

test("all 1,000 stored permutations have distinct 3–6-answer sets and valid themed clues", () => {
  assert.equal(crosswordPermutations.length, 1000);
  assert.equal(new Set(crosswordPermutations.map((puzzle) => puzzle.id)).size, 1000);
  assert.equal(new Set(crosswordPermutations.map((puzzle) => puzzle.rows.join("/"))).size, 1000);
  const bank = new Map(crosswordWords.map((word) => [word.answer, word.clue]));
  const answerSets = new Set();
  const sizes = new Map();
  for (const [index, definition] of crosswordPermutations.entries()) {
    const puzzle = buildCrossword(definition);
    const theme = crosswordWordThemes.find((theme) => theme.id === definition.theme);
    assert.ok(theme);
    assert.equal(definition.theme, crosswordWordThemes[index % crosswordWordThemes.length].id);
    const wordCount = puzzle.entries.length;
    assert.ok(wordCount >= 3 && wordCount <= 6);
    sizes.set(wordCount, (sizes.get(wordCount) ?? 0) + 1);
    assert.equal(new Set(puzzle.entries.map((entry) => entry.answer)).size, wordCount);
    assert.ok(puzzle.width <= 9 && puzzle.height <= 9);
    assert.equal(definition.layout, "freeform");
    assert.equal(hasDisallowedCrosswordShape(definition.rows), false);
    for (const entry of puzzle.entries) {
      assert.ok(tokens.has(entry.answer));
      assert.ok(theme.answers.includes(entry.answer));
      assert.equal(entry.clue, bank.get(entry.answer));
    }
    answerSets.add(
      puzzle.entries
        .map((entry) => entry.answer)
        .sort()
        .join(","),
    );
    const reached = new Set([0]);
    const queue = [0];
    for (const entryIndex of queue) {
      puzzle.entries.forEach((entry, next) => {
        if (
          !reached.has(next) &&
          entry.cells.some((cell) => puzzle.entries[entryIndex].cells.includes(cell))
        ) {
          reached.add(next);
          queue.push(next);
        }
      });
    }
    assert.equal(reached.size, wordCount);
  }
  assert.equal(answerSets.size, 1000);
  for (const count of [3, 4, 5, 6]) assert.equal(sizes.get(count), 250);
  for (const theme of crosswordWordThemes) {
    assert.equal(crosswordPermutations.filter((puzzle) => puzzle.theme === theme.id).length, 100);
  }
});

test("the catalog favors answers that help with multiple other clues", () => {
  let answerCount = 0;
  let multiplyCrossed = 0;
  let cyclicLayouts = 0;
  for (const definition of crosswordPermutations) {
    const { entries } = buildCrossword(definition);
    const intersections = crosswordIntersections(entries);
    answerCount += entries.length;
    multiplyCrossed += intersections.multiplyCrossed;
    if (intersections.crossings >= entries.length) cyclicLayouts++;
  }
  assert.ok(multiplyCrossed / answerCount >= 0.75, "at least 75% of answers cross multiple others");
  assert.ok(
    cyclicLayouts / crosswordPermutations.length >= 0.7,
    "at least 70% of layouts include an interlocking loop",
  );
});

test("the expanded catalog uses the entire vocabulary", () => {
  const used = new Set(
    crosswordPermutations.flatMap((puzzle) => buildCrossword(puzzle).entries.map((entry) => entry.answer)),
  );
  assert.deepEqual(used, new Set(crosswordWords.map((word) => word.answer)));
});
