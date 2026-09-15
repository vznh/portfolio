import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { buildCrossword, isCrosswordSolved, nextClue, nextSquare, type Direction } from "@/lib/crossword";
import { miniCrossword } from "@/presets/crossword";
import styles from "@/styles/crossword.module.css";

const puzzle = buildCrossword(miniCrossword);
const storageKey = `crossword:${miniCrossword.id}`;
const emptyLetters = () => puzzle.cells.map(() => "");

export function Crossword() {
  const [letters, setLetters] = useState<string[]>(emptyLetters);
  const [active, setActive] = useState(puzzle.entries[0].cells[0]);
  const [direction, setDirection] = useState<Direction>("across");
  const [interacting, setInteracting] = useState(false);
  const [restored, setRestored] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const repeatClick = useRef(false);
  const cycleClues = useRef(true);
  const entry = puzzle.entries.find((item) => item.direction === direction && item.cells.includes(active))!;
  const solved = isCrosswordSolved(puzzle.cells, letters);
  const filled = puzzle.cells.every((letter, index) => letter === "#" || letters[index]);

  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "null");
      if (
        Array.isArray(saved) &&
        saved.length === puzzle.cells.length &&
        saved.every((value) => typeof value === "string" && /^[A-Z]?$/.test(value))
      ) {
        setLetters(saved);
      }
    } catch {
      // The puzzle also works when browser storage is unavailable.
    }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(letters));
    } catch {
      // Keeping progress in memory is sufficient for the current visit.
    }
  }, [letters, restored]);

  function focusSquare(index: number, nextDirection = direction) {
    cycleClues.current = true;
    setActive(index);
    setDirection(nextDirection);
    setInteracting(true);
    inputs.current[index]?.focus({ preventScroll: true });
    inputs.current[index]?.select();
  }

  function enterLetters(index: number, value: string) {
    const text = value.toUpperCase().replace(/[^A-Z]/g, "");
    if (!text) return;
    const run = entry.cells.slice(entry.cells.indexOf(index));
    const next = [...letters];
    for (let offset = 0; offset < Math.min(text.length, run.length); offset++) {
      next[run[offset]] = text[offset];
    }
    setLetters(next);
    focusSquare(run[Math.min(text.length, run.length - 1)]);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>, index: number) {
    if (event.metaKey || event.ctrlKey || event.altKey || event.nativeEvent.isComposing) return;
    if (event.key === "Tab") {
      if (!cycleClues.current) return;
      event.preventDefault();
      const next = nextClue(puzzle.entries, entry, event.shiftKey ? -1 : 1);
      focusSquare(next.cells.find((cell) => !letters[cell]) ?? next.cells[0], next.direction);
    } else if (event.key === "Escape") {
      // Let the next Tab leave the grid through the browser's normal focus order.
      event.preventDefault();
      cycleClues.current = false;
    } else if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      setDirection(direction === "across" ? "down" : "across");
    } else if (event.key.startsWith("Arrow")) {
      event.preventDefault();
      const horizontal = event.key === "ArrowLeft" || event.key === "ArrowRight";
      const nextDirection = horizontal ? "across" : "down";
      const delta =
        (event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1) * (horizontal ? 1 : puzzle.width);
      focusSquare(nextSquare(puzzle.cells, puzzle.width, index, delta), nextDirection);
    } else if (event.key === "Backspace" || event.key === "Delete") {
      event.preventDefault();
      const position = entry.cells.indexOf(index);
      const target =
        event.key === "Backspace" && !letters[index] && position > 0 ? entry.cells[position - 1] : index;
      setLetters((current) => current.map((letter, cell) => (cell === target ? "" : letter)));
      focusSquare(target);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      focusSquare(event.key === "Home" ? entry.cells[0] : entry.cells[entry.cells.length - 1]);
    } else if (/^[a-z]$/i.test(event.key)) {
      event.preventDefault();
      enterLetters(index, event.key);
    }
  }

  return (
    <main className={styles.page}>
      <article className={styles.newspaper} aria-label="Mini crossword">
        <div className={styles.puzzle}>
          <div className={styles.gridColumn}>
            <p id="crossword-instructions" className="sr-only">
              Type to fill a square. Tab selects the next clue; Shift+Tab selects the previous clue, cycling
              through Across, then Down. Left and Right move across; Up and Down move down. Enter or Space
              switches direction. Backspace erases. Press Escape, then Tab to leave the grid. Select a clue to
              fill its answer.
            </p>
            <div
              className={styles.grid}
              role="group"
              aria-label={`${puzzle.width} by ${puzzle.height} crossword`}
              aria-describedby="crossword-instructions"
              style={{ gridTemplateColumns: `repeat(${puzzle.width}, 1fr)` }}
            >
              {puzzle.cells.map((solution, index) => {
                if (solution === "#") return <div key={index} className={styles.block} aria-hidden="true" />;
                const selected = interacting && active === index;
                const inWord = interacting && entry.cells.includes(index);
                return (
                  <div
                    key={index}
                    className={`${styles.cell} ${inWord ? styles.inWord : ""} ${selected ? styles.selected : ""}`}
                  >
                    {puzzle.numbers[index] && (
                      <span className={styles.number} aria-hidden="true">
                        {puzzle.numbers[index]}
                      </span>
                    )}
                    <input
                      ref={(element) => {
                        inputs.current[index] = element;
                      }}
                      aria-label={`Row ${Math.floor(index / puzzle.width) + 1}, column ${(index % puzzle.width) + 1}${puzzle.numbers[index] ? `, number ${puzzle.numbers[index]}` : ""}`}
                      aria-describedby={
                        active === index ? `clue-${entry.direction}-${entry.number}` : undefined
                      }
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="characters"
                      spellCheck={false}
                      inputMode="text"
                      tabIndex={active === index ? 0 : -1}
                      value={letters[index]}
                      onFocus={(event) => {
                        cycleClues.current = true;
                        setActive(index);
                        setInteracting(true);
                        event.currentTarget.select();
                      }}
                      onPointerDown={() => {
                        cycleClues.current = true;
                        repeatClick.current =
                          interacting && active === index && document.activeElement === inputs.current[index];
                      }}
                      onClick={(event) => {
                        if (event.detail > 0 && repeatClick.current)
                          setDirection(direction === "across" ? "down" : "across");
                        event.currentTarget.select();
                      }}
                      onKeyDown={(event) => onKeyDown(event, index)}
                      onChange={(event) => {
                        if (!event.target.value)
                          setLetters((current) =>
                            current.map((letter, cell) => (cell === index ? "" : letter)),
                          );
                        else enterLetters(index, event.target.value.slice(-1));
                      }}
                      onPaste={(event) => {
                        event.preventDefault();
                        enterLetters(index, event.clipboardData.getData("text"));
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <p className={styles.status} role="status">
              {solved ? "Beautifully done." : filled ? "A few letters still need another look." : "\u00a0"}
            </p>
          </div>
          <div className={styles.clues}>
            {(["across", "down"] as const).map((clueDirection) => (
              <section key={clueDirection} aria-labelledby={`heading-${clueDirection}`}>
                <h2 id={`heading-${clueDirection}`}>
                  <svg
                    aria-hidden="true"
                    className={`${styles.directionArrow} ${clueDirection === "down" ? styles.downArrow : ""}`}
                    viewBox="0 0 32 32"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path
                      d={
                        clueDirection === "across"
                          ? "M3 16h26M9 10l-6 6 6 6M23 10l6 6-6 6"
                          : "M16 3v26M10 23l6 6 6-6"
                      }
                    />
                  </svg>
                  <span className="sr-only">{clueDirection === "across" ? "Across" : "Down"}</span>
                </h2>
                <ol>
                  {puzzle.entries
                    .filter((item) => item.direction === clueDirection)
                    .map((item) => (
                      <li key={item.number}>
                        <button
                          id={`clue-${item.direction}-${item.number}`}
                          className={interacting && entry === item ? styles.activeClue : ""}
                          aria-label={`${item.number} ${item.direction}: ${item.clue}`}
                          aria-pressed={interacting && entry === item}
                          onClick={() =>
                            focusSquare(
                              item.cells.find((cell) => !letters[cell]) ?? item.cells[0],
                              item.direction,
                            )
                          }
                        >
                          <span className={styles.clueNumber}>{item.number}</span>
                          <span>{item.clue}</span>
                        </button>
                      </li>
                    ))}
                </ol>
              </section>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}
