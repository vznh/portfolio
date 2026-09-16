import type { CrosswordEntry, CrosswordPuzzle, Direction } from "./crossword";

export function crosswordIntersections(entries: ReadonlyArray<Pick<CrosswordEntry, "cells">>) {
  const counts = new Map<number, number>();
  for (const entry of entries) {
    for (const cell of entry.cells) counts.set(cell, (counts.get(cell) ?? 0) + 1);
  }
  return {
    crossings: [...counts.values()].filter((count) => count > 1).length,
    multiplyCrossed: entries.filter(
      (entry) => entry.cells.filter((cell) => (counts.get(cell) ?? 0) > 1).length >= 2,
    ).length,
  };
}

export interface CrosswordWord {
  answer: string;
  clue: string;
}

export interface GeneratorOptions {
  seed: number;
  width?: number;
  height?: number;
  maxWords?: number;
}

interface Placement extends CrosswordWord {
  x: number;
  y: number;
  direction: Direction;
}
export function hasDisallowedCrosswordShape(rows: readonly string[]): boolean {
  const occupied = (x: number, y: number) => {
    const cell = rows[y]?.[x];
    return cell !== undefined && cell !== "#" && cell !== " ";
  };
  const axes = [
    [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
    ],
    [
      [1, 1],
      [-1, 1],
      [-1, -1],
      [1, -1],
    ],
  ];
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      if (!occupied(x, y)) continue;
      for (const directions of axes) {
        if (!directions.every(([dx, dy]) => occupied(x + dx, y + dy))) continue;
        for (const turn of [-1, 1]) {
          let hooks = 0;
          for (const [dx, dy] of directions) {
            const tx = -dy * turn;
            const ty = dx * turn;
            for (let distance = 1; occupied(x + dx * distance, y + dy * distance); distance++) {
              const ex = x + dx * distance;
              const ey = y + dy * distance;
              if (occupied(ex + tx, ey + ty) && !occupied(ex - tx, ey - ty)) {
                hooks++;
                break;
              }
            }
          }
          if (hooks >= 3) return true;
        }
      }
    }
  }
  return false;
}
function randomSource(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export function generateCrossword(words: CrosswordWord[], options: GeneratorOptions): CrosswordPuzzle {
  const { seed, width = 9, height = 9, maxWords = 8 } = options;
  if (
    !Number.isInteger(seed) ||
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 3 ||
    height < 3 ||
    width > 15 ||
    height > 15 ||
    !Number.isInteger(maxWords) ||
    maxWords < 2 ||
    maxWords > 30
  )
    throw new Error("Use an integer seed, dimensions from 3 to 15, and 2 to 30 words.");

  const unique = new Map<string, CrosswordWord>();
  for (const word of words) {
    const answer = word.answer.trim().toUpperCase();
    if (!/^[A-Z]{3,15}$/.test(answer) || !word.clue.trim()) {
      throw new Error("Each word needs 3 to 15 letters and a clue.");
    }
    if (answer.length <= Math.max(width, height) && !unique.has(answer)) {
      unique.set(answer, { answer, clue: word.clue.trim() });
    }
  }
  const random = randomSource(seed);
  let best: Placement[] = [];
  let fallback: Placement[] = [];
  let bestScore = -Infinity;
  for (let attempt = 0; attempt < 24; attempt++) {
    const pool = [...unique.values()];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const grid = Array.from({ length: height }, () => Array<string>(width).fill(""));
    const axes = Array.from({ length: height }, () => Array<number>(width).fill(0));
    const placed: Placement[] = [];
    const at = (x: number, y: number) => grid[y]?.[x] ?? "";
    const put = (placement: Placement) => {
      const across = placement.direction === "across";
      [...placement.answer].forEach((letter, i) => {
        const x = placement.x + (across ? i : 0);
        const y = placement.y + (across ? 0 : i);
        grid[y][x] = letter;
        axes[y][x] |= across ? 1 : 2;
      });
      placed.push(placement);
    };
    const first = pool.shift();
    if (!first) break;
    const direction: Direction =
      first.answer.length > width
        ? "down"
        : first.answer.length > height
          ? "across"
          : random() < 0.5
            ? "across"
            : "down";
    put({
      ...first,
      direction,
      x: Math.floor((width - (direction === "across" ? first.answer.length : 1)) / 2),
      y: Math.floor((height - (direction === "down" ? first.answer.length : 1)) / 2),
    });
    for (let pass = 0; pass < maxWords && placed.length < maxWords; pass++) {
      let added = false;
      for (const word of pool) {
        if (placed.length >= maxWords) break;
        if (placed.some((item) => item.answer === word.answer)) continue;
        let candidate: Placement | undefined;
        let candidateScore = -Infinity;
        for (const direction of ["across", "down"] as const) {
          const dx = direction === "across" ? 1 : 0;
          const dy = 1 - dx;
          const axis = dx ? 1 : 2;
          for (let y = 0; y < height; y++)
            for (let x = 0; x < width; x++) {
              const endX = x + dx * (word.answer.length - 1);
              const endY = y + dy * (word.answer.length - 1);
              if (endX >= width || endY >= height || at(x - dx, y - dy) || at(endX + dx, endY + dy)) continue;
              let crossings = 0;
              let valid = true;
              for (let i = 0; i < word.answer.length; i++) {
                const cx = x + dx * i;
                const cy = y + dy * i;
                const existing = at(cx, cy);
                if (existing) {
                  if (existing !== word.answer[i] || axes[cy][cx] & axis) {
                    valid = false;
                    break;
                  }
                  crossings++;
                } else if (at(cx - dy, cy - dx) || at(cx + dy, cy + dx)) {
                  valid = false;
                  break;
                }
              }
              if (!valid || !crossings) continue;
              const score = crossings * 10 + random();
              if (score > candidateScore) {
                candidateScore = score;
                candidate = { ...word, x, y, direction };
              }
            }
        }
        if (candidate) {
          put(candidate);
          if (!fallback.length && placed.length === 2) fallback = [...placed];
          added = true;
        }
      }
      if (!added) break;
    }
    if (hasDisallowedCrosswordShape(grid.map((row) => row.map((cell) => cell || "#").join("")))) continue;
    const xs = placed.flatMap((p) => [p.x, p.x + (p.direction === "across" ? p.answer.length - 1 : 0)]);
    const ys = placed.flatMap((p) => [p.y, p.y + (p.direction === "down" ? p.answer.length - 1 : 0)]);
    const area = (Math.max(...xs) - Math.min(...xs) + 1) * (Math.max(...ys) - Math.min(...ys) + 1);
    const intersections = crosswordIntersections(
      placed.map((p) => ({
        cells: [...p.answer].map(
          (_, i) =>
            (p.y + (p.direction === "down" ? i : 0)) * width + p.x + (p.direction === "across" ? i : 0),
        ),
      })),
    );
    const score = intersections.crossings * 1000 + intersections.multiplyCrossed * 200 - area;
    if (placed.length > best.length || (placed.length === best.length && score > bestScore)) {
      best = placed;
      bestScore = score;
    }
  }
  if (best.length < 2) best = fallback;
  if (best.length < 2)
    throw new Error("These words cannot form a connected crossword within the chosen dimensions.");

  const minX = Math.min(...best.map((p) => p.x));
  const minY = Math.min(...best.map((p) => p.y));
  const maxX = Math.max(...best.map((p) => p.x + (p.direction === "across" ? p.answer.length - 1 : 0)));
  const maxY = Math.max(...best.map((p) => p.y + (p.direction === "down" ? p.answer.length - 1 : 0)));
  const rows = Array.from({ length: maxY - minY + 1 }, () => Array<string>(maxX - minX + 1).fill("#"));
  const clues: CrosswordPuzzle["clues"] = { across: {}, down: {} };
  const starts = [...new Set(best.map((p) => p.y * width + p.x))].sort((a, b) => a - b);
  for (const p of best) {
    [...p.answer].forEach((letter, i) => {
      rows[p.y - minY + (p.direction === "down" ? i : 0)][p.x - minX + (p.direction === "across" ? i : 0)] =
        letter;
    });
    clues[p.direction][starts.indexOf(p.y * width + p.x) + 1] = p.clue;
  }
  let hash = 2166136261;
  for (const char of JSON.stringify([rows, clues]))
    hash = Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0;
  return {
    id: `generated-v1-${hash.toString(36)}`,
    layout: "freeform",
    rows: rows.map((row) => row.join("")),
    clues,
  };
}
