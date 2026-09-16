import { writeFileSync } from "node:fs";
import { buildCrossword } from "../src/lib/crossword";
import { crosswordIntersections, generateCrossword } from "../src/lib/crosswordGenerator";
import { crosswordWords, crosswordWordThemes } from "../src/presets/crosswordWords";

const bank = new Map(crosswordWords.map((word) => [word.answer, word]));
const seenAnswers = new Set<string>();
const seenGrids = new Set<string>();
const wordUses = new Map<string, number>();
const puzzles = [];
const rounds = 100;
for (let round = 0; round < rounds; round++) {
  for (const theme of crosswordWordThemes) {
    const wordCount = 3 + (puzzles.length % 4);
    const words = theme.answers.map((answer) => {
      const word = bank.get(answer);
      if (!word) throw new Error(`Missing clue for ${answer}`);
      return word;
    });
    let best: ReturnType<typeof generateCrossword> | undefined;
    let bestScore = -Infinity;
    let candidates = 0;
    for (let attempt = 0; attempt < 3000; attempt++) {
      const seed = round * 3000 + attempt + 1;
      const puzzle = generateCrossword(words, { seed, width: 9, height: 9, maxWords: wordCount });
      const entries = buildCrossword(puzzle).entries;
      const answerKey = entries
        .map((entry) => entry.answer)
        .sort()
        .join(",");
      const gridKey = puzzle.rows.join("/");
      if (entries.length !== wordCount || seenAnswers.has(answerKey) || seenGrids.has(gridKey)) continue;
      const { crossings, multiplyCrossed } = crosswordIntersections(entries);
      const area = puzzle.rows.length * puzzle.rows[0].length;
      const reuse = entries.reduce((sum, entry) => sum + (wordUses.get(entry.answer) ?? 0), 0);
      const score = crossings * 1_000_000 + multiplyCrossed * 10_000 - reuse * 10 - area;
      if (score > bestScore) {
        best = puzzle;
        bestScore = score;
      }
      if (++candidates === 48) break;
    }
    if (!best) throw new Error(`Could not build variation ${round + 1} for ${theme.id}`);
    seenAnswers.add(
      buildCrossword(best)
        .entries.map((entry) => entry.answer)
        .sort()
        .join(","),
    );
    seenGrids.add(best.rows.join("/"));
    for (const entry of buildCrossword(best).entries) {
      wordUses.set(entry.answer, (wordUses.get(entry.answer) ?? 0) + 1);
    }
    puzzles.push({ ...best, theme: theme.id, title: theme.title });
  }
  if ((round + 1) % 10 === 0) console.log(`Selected ${puzzles.length} puzzles.`);
}

writeFileSync(
  new URL("../src/presets/crosswordPermutations.ts", import.meta.url),
  `import type { CrosswordPuzzle } from "@/lib/crossword";\n\n` +
    `export const crosswordPermutations: Array<CrosswordPuzzle & { theme: string; title: string }> = ${JSON.stringify(puzzles, null, 2)};\n`,
);
console.log(`Stored ${puzzles.length} puzzles with distinct answer sets and grids.`);
