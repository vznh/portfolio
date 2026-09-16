const rotationKey = "crossword:content-cycle:v1";
type RotationStorage = Pick<Storage, "getItem" | "setItem">;

export interface CrosswordSelection {
  position: number;
  index: number;
  progressKey: string;
}

function readPosition(storage: RotationStorage | null): number {
  try {
    const value: unknown = JSON.parse(storage?.getItem(rotationKey) ?? "0");
    return typeof value === "number" &&
      Number.isSafeInteger(value) &&
      value >= 0 &&
      value < Number.MAX_SAFE_INTEGER
      ? value
      : 0;
  } catch {
    return 0;
  }
}

function selectionAt(position: number, puzzles: readonly { id: string }[]): CrosswordSelection {
  if (!puzzles.length) throw new Error("The crossword rotation needs at least one puzzle.");
  const index = position % puzzles.length;
  const cycle = Math.floor(position / puzzles.length);
  return { position, index, progressKey: `crossword:${puzzles[index].id}:cycle:${cycle}` };
}

export function selectCrossword(
  storage: RotationStorage | null,
  puzzles: readonly { id: string }[],
): CrosswordSelection {
  const selection = selectionAt(readPosition(storage), puzzles);
  reserveNextPosition(storage, selection.position);
  return selection;
}

function reserveNextPosition(storage: RotationStorage | null, position: number): void {
  try {
    storage?.setItem(rotationKey, JSON.stringify(Math.max(readPosition(storage), position + 1)));
  } catch {}
}

export function advanceCrossword(
  storage: RotationStorage | null,
  selection: CrosswordSelection,
  puzzles: readonly { id: string }[],
): CrosswordSelection {
  const next = selectionAt(selection.position + 1, puzzles);
  reserveNextPosition(storage, next.position);
  return next;
}
