export type Direction = "across" | "down";

export interface CrosswordEntry {
  number: number;
  direction: Direction;
  clue: string;
  cells: number[];
  answer: string;
}

export interface CrosswordPuzzle {
  id: string;
  layout?: "freeform";
  rows: string[];
  clues: Record<Direction, Record<number, string>>;
}

export function buildCrossword(puzzle: CrosswordPuzzle) {
  const height = puzzle.rows.length;
  const width = puzzle.rows[0]?.length ?? 0;
  if (
    height < 1 ||
    height > 15 ||
    width < 1 ||
    width > 15 ||
    puzzle.rows.some((row) => row.length !== width || !/^[A-Z#]+$/.test(row))
  ) {
    throw new Error("A crossword must be a rectangular grid of letters and blocks, at most 15×15.");
  }

  const cells = puzzle.rows.join("").split("");
  const numbers: Record<number, number> = {};
  const entries: CrosswordEntry[] = [];
  let number = 0;

  cells.forEach((letter, index) => {
    if (letter === "#") return;
    const row = Math.floor(index / width);
    const column = index % width;
    const startsAcross =
      (column === 0 || cells[index - 1] === "#") &&
      (puzzle.layout !== "freeform" || (column + 1 < width && cells[index + 1] !== "#"));
    const startsDown =
      (row === 0 || cells[index - width] === "#") &&
      (puzzle.layout !== "freeform" || (row + 1 < height && cells[index + width] !== "#"));
    if (!startsAcross && !startsDown) return;
    numbers[index] = ++number;

    for (const direction of ["across", "down"] as const) {
      if (!(direction === "across" ? startsAcross : startsDown)) continue;
      const step = direction === "across" ? 1 : width;
      const run: number[] = [];
      for (let cell = index; cell < cells.length && cells[cell] !== "#"; cell += step) {
        if (direction === "across" && Math.floor(cell / width) !== row) break;
        run.push(cell);
      }
      const clue = puzzle.clues[direction][number];
      if (run.length < 2 || !clue) throw new Error(`Missing or invalid ${number} ${direction} clue.`);
      entries.push({ number, direction, clue, cells: run, answer: run.map((cell) => cells[cell]).join("") });
    }
  });

  const covered = new Set(entries.flatMap((entry) => entry.cells));
  if (!entries.length || cells.some((letter, index) => letter !== "#" && !covered.has(index))) {
    throw new Error("Every open square must belong to an answer.");
  }
  return { width, height, cells, numbers, entries };
}

export function nextSquare(cells: string[], width: number, index: number, delta: number) {
  let next = index + delta;
  while (next >= 0 && next < cells.length) {
    if (Math.abs(delta) === 1 && Math.floor(next / width) !== Math.floor(index / width)) return index;
    if (cells[next] !== "#") return next;
    next += delta;
  }
  return index;
}

export function isCrosswordSolved(solution: string[], letters: string[]) {
  return solution.every((letter, index) => letter === "#" || letters[index] === letter);
}

export function nextUnfinishedSquare(entry: CrosswordEntry, current: number, letters: string[]) {
  const position = entry.cells.indexOf(current);
  for (let offset = 1; offset < entry.cells.length; offset++) {
    const next = (position + offset) % entry.cells.length;
    if (letters[entry.cells[next]] !== entry.answer[next]) return entry.cells[next];
  }
  return current;
}

export function nextClue(
  entries: CrosswordEntry[],
  current: CrosswordEntry,
  step: 1 | -1,
  letters: string[] = [],
) {
  const ordered = [...entries].sort((a, b) =>
    a.direction === b.direction ? a.number - b.number : a.direction === "across" ? -1 : 1,
  );
  const index = ordered.findIndex(
    (entry) => entry.number === current.number && entry.direction === current.direction,
  );
  for (let offset = 1; offset <= ordered.length; offset++) {
    const candidate = ordered[(index + step * offset + ordered.length) % ordered.length];
    const correct = candidate.cells.every((cell, position) => letters[cell] === candidate.answer[position]);
    if (!correct) return candidate;
  }
  return undefined;
}
