type VisitStorage = Pick<Storage, "getItem" | "setItem">;
const lastGlyphKey = "portfolio:last-glyph";

// Each picker belongs to one loaded document. React remounts and history/hash
// navigation reuse its choice; a new document creates a new picker.
export function createVisitGlyphPicker() {
  let selected: number | undefined;
  return (count: number, storage?: VisitStorage, random: () => number = Math.random): number => {
    if (!Number.isInteger(count) || count < 1) throw new Error("At least one logo version is required.");
    if (selected !== undefined && selected < count) return selected;
    let previous = -1;
    try {
      const saved = storage?.getItem(lastGlyphKey);
      if (saved !== null && saved !== undefined && /^\d+$/.test(saved)) previous = Number(saved);
    } catch {
      // A visit can still keep a stable logo without browser storage.
    }
    const excludePrevious = count > 1 && previous >= 0 && previous < count;
    const draw = Math.floor(random() * (excludePrevious ? count - 1 : count));
    selected = excludePrevious && draw >= previous ? draw + 1 : draw;
    try {
      storage?.setItem(lastGlyphKey, String(selected));
    } catch {
      // Only avoiding repeats across fresh loads depends on storage.
    }
    return selected;
  };
}

export const pickVisitGlyph = createVisitGlyphPicker();
