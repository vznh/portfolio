# Crossword content and shapes

The page cycles through **1,000 prebuilt puzzles** stored as literal constants in
`src/presets/crosswordPermutations.ts`. Each has 3–6 answers, a distinct word set and grid,
and a single theme. There are 250 puzzles of each size. One hundred variations of ten themes are interleaved so consecutive puzzles
explore different parts of the content page. All grids fit within 9×9 bounds.

Layouts favor interlocking answers: 3,508 of 4,500 answers (78%) cross at least two
other answers, and 707 of the 1,000 puzzles contain a loop of crossings. Three-answer
puzzles necessarily retain two single-crossing ends. Catalog generation compares
48 eligible candidates per slot, prioritizing crossing count, then how many answers
have multiple crossings, then favoring less-used answers before compactness. Regression checks require at least 75%
multiply-crossed answers and 70% of layouts with loops.

`src/presets/crosswordWords.ts` contains 158 curated answer/clue pairs from visible text in
`content.ts` and `profile.ts`, grouped into related themes.
All 158 appear in the catalog. Word reuse is a tie-breaker when selecting equally
interlocked layouts; the most frequent answer appears in 50 of 1,000 puzzles (5%).
Distinct puzzles have unique answer sets and grids, but individual words still repeat.
Clues are short, direct definitions; visitors need not read the
portfolio before playing. Link destinations and image filenames are not word sources.

Every page reload selects the next puzzle, even if the previous puzzle was unfinished.
Solving a puzzle still plays the completion animation and opens the content page;
completion does not advance the rotation a second time. The refresh control also advances
after its exit animation. React Strict Mode effect replays consume only one puzzle per visit.
After puzzle 1,000,
the sequence starts again with fresh progress keys. Stored solutions from earlier cycles
are retained. Rotation and progress are local to the browser; when storage is blocked,
each reload starts at the first puzzle, while refresh still advances during the current visit.

There is no shape selector. The generator still supports other bounds, and the original
mini remains available as a preset in the code. Puzzles are not generated at runtime.

To regenerate the constants after editing the word bank:

```sh
bun scripts/generate-crossword-permutations.ts
bunx prettier --write src/presets/crosswordPermutations.ts
node --experimental-strip-types --test tests/crossword*.test.mjs
```

The grid has a reserved square area, at most 360×360 px, which shrinks to fit narrow
screens. Each shape is centered and scaled to fit both dimensions with square cells.
The crossword and clues are vertically centered as a group, with scrolling on short screens.

## Generator

`src/lib/crosswordGenerator.ts` accepts an answer/clue list, seed, bounding width and height,
and a maximum answer count. The themed content-page word bank lives in
`src/presets/crosswordWords.ts`.

1. Shuffle the word list with a deterministic seed and place a first word.
2. Search for matching-letter crossings. Reject overlaps in the same direction,
   conflicting letters, touching parallel words, and occupied word endings.
3. Retry unplaced words after the shape grows. Run 24 bounded attempts, reject
   swastika-like silhouettes, and keep the remaining layout with the most words,
   preferring more crossings and more multiply-crossed answers before a smaller footprint.
4. Crop empty outer rows and columns, assign clue numbers in reading order, and
   derive a content-based puzzle ID for saved progress.

Every generated word connects to the existing puzzle. Freeform cells may belong to
one answer; unused cells are transparent. The regular mini still requires both directions.
The renderer supports rectangular bounds up to 15×15 and adapts letter sizes to the grid.

The silhouette guard checks both mirror directions and cardinal/diagonal axes for
four-way crossings with at least three arms hooked in the same rotational direction.
It also catches uneven arms and some partially formed motifs. If every fuller layout
is rejected, generation falls back to a simple connected pair of words. This is a
conservative geometry heuristic, not a guarantee against every visual resemblance or
every objectionable symbol. It only inspects generated layouts, not the curated original mini.

This is a word-placement prototype. It does not invent clues, fill a fixed silhouette,
guarantee symmetry, guarantee that every supplied word fits, or generate fully checked
newspaper-style grids. Wide and tall options set bounds, not an exact outline.

Validation: `node --experimental-strip-types --test tests/crossword*.test.mjs`.
Generator tests cover 90 seeded layouts across the three shapes, including clue matching,
crossings, numbering, connectedness, size limits, reproducibility, and failure cases.
Catalog tests validate all 1,000 stored layouts, unique answer sets, 3–6 connected answers,
theme membership, source-word provenance, concise clues, and the silhouette guard.
Rotation tests cover reload advancement, duplicate refresh, wraparound, stale tabs, and
corrupt or unavailable browser storage.
