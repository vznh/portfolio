import type { CrosswordEntry } from "./crossword";

export function parseCrosswordLetters(value: string | null, cellCount: number): string[] | null {
  try {
    const saved: unknown = JSON.parse(value ?? "null");
    if (
      !Array.isArray(saved) ||
      saved.length !== cellCount ||
      !saved.every((letter) => typeof letter === "string" && /^[A-Z]?$/.test(letter))
    ) {
      return null;
    }
    return saved;
  } catch {
    return null;
  }
}

export function applyCrosswordInput(
  letters: readonly string[],
  entry: Pick<CrosswordEntry, "cells">,
  index: number,
  value: string,
): { letters: string[]; lastEntered: number } | null {
  const text = value.toUpperCase().replace(/[^A-Z]/g, "");
  if (!text) return null;

  const run = entry.cells.slice(entry.cells.indexOf(index));
  const next = [...letters];
  const count = Math.min(text.length, run.length);
  for (let offset = 0; offset < count; offset++) next[run[offset]] = text[offset];
  return { letters: next, lastEntered: run[count - 1] };
}
