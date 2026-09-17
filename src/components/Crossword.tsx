import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import dynamic from "next/dynamic";
import {
  buildCrossword,
  isCrosswordSolved,
  nextClue,
  nextSquare,
  nextUnfinishedSquare,
  type CrosswordPuzzle,
  type Direction,
} from "@/lib/crossword";
import { crosswordTransition } from "@/lib/crosswordTransition";
import { getContentView, useContentView, useNavigationHash } from "@/hooks/useContentView";
import { useAnimationCompletion } from "@/hooks/useAnimationCompletion";
import { advanceCrossword, selectCrossword, type CrosswordSelection } from "@/lib/crosswordRotation";
import { crosswordPermutations } from "@/presets/crosswordPermutations";
import { profile } from "@/presets/profile";
import styles from "@/styles/crossword.module.css";
import { crosswordAppearanceDefaults } from "@/presets/crosswordAppearance";
import { getNativeStrokeWidth } from "@/lib/crosswordAppearance";
import { CrosswordHalftone, CrosswordStrokeFilter } from "./CrosswordPrintEffects";
import { applyCrosswordInput, parseCrosswordLetters } from "@/lib/crosswordInput";

const CrosswordDial =
  process.env.NODE_ENV === "development" ? dynamic(() => import("./CrosswordDial"), { ssr: false }) : null;

const useBrowserLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function withLocalStorage<T>(operation: (storage: Storage | null) => T): T {
  try {
    return operation(window.localStorage);
  } catch {
    return operation(null);
  }
}

export function Crossword({ contentVisible = false }: { contentVisible?: boolean }) {
  const [selection, setSelection] = useState<CrosswordSelection | null>(null);
  const [autoCheck, setAutoCheck] = useState(true);
  const selectedForVisit = useRef(false);

  useEffect(() => {
    if (selectedForVisit.current) return;
    selectedForVisit.current = true;
    setSelection(withLocalStorage((storage) => selectCrossword(storage, crosswordPermutations)));
  }, []);

  const nextSelection = useCallback(() => {
    if (!selection) return null;
    return withLocalStorage((storage) => advanceCrossword(storage, selection, crosswordPermutations));
  }, [selection]);
  const onRefresh = useCallback(() => {
    setSelection(nextSelection());
  }, [nextSelection]);
  if (!selection) return <main className={styles.page} aria-busy="true" aria-label="Loading crossword" />;
  return (
    <CrosswordGame
      key={selection.progressKey}
      definition={crosswordPermutations[selection.index]}
      progressKey={selection.progressKey}
      autoCheck={autoCheck}
      onAutoCheck={() => setAutoCheck((enabled) => !enabled)}
      onRefresh={onRefresh}
      contentVisible={contentVisible}
    />
  );
}

function CrosswordGame({
  definition,
  progressKey,
  autoCheck,
  onAutoCheck,
  onRefresh,
  contentVisible,
}: {
  definition: CrosswordPuzzle;
  progressKey: string;
  autoCheck: boolean;
  onAutoCheck: () => void;
  onRefresh: () => void;
  contentVisible: boolean;
}) {
  const [puzzle] = useState(() => buildCrossword(definition));
  const entriesByDirection = useMemo(
    () => ({
      across: puzzle.entries.filter((item) => item.direction === "across"),
      down: puzzle.entries.filter((item) => item.direction === "down"),
    }),
    [puzzle],
  );
  const [appearance, setAppearance] = useState(crosswordAppearanceDefaults);
  const animationStart = useRef(0);
  const strokeId = `crossword-stroke-${useId().replace(/:/g, "")}`;
  const appearanceStyle = {
    "--text-stroke-filter": appearance.stroke.enabled ? `url(#${strokeId})` : "none",
    "--arrow-stroke-filter": appearance.stroke.enabled ? `url(#${strokeId}-arrows)` : "none",
    "--text-source-color": appearance.stroke.enabled ? "#ff0000" : "#000000",
    "--text-source-width": `${getNativeStrokeWidth(appearance.stroke)}px`,
    "--grid-columns": puzzle.width,
    "--grid-extent": Math.max(puzzle.width, puzzle.height),
    "--crossword-from-radius": `${animationStart.current}px`,
    "--crossword-enter-duration": `${Math.max(1, 1000 * (1 - animationStart.current / 4.6))}ms`,
    "--crossword-exit-duration": `${Math.max(1, (850 * animationStart.current) / 4.6)}ms`,
    "--crossword-enter-delay": animationStart.current > 0 ? "0ms" : "400ms",
  } as CSSProperties;
  const [letters, setLetters] = useState<string[]>(() => puzzle.cells.map(() => ""));
  const [active, setActive] = useState(puzzle.entries[0].cells[0]);
  const [direction, setDirection] = useState<Direction>(puzzle.entries[0].direction);
  const [interacting, setInteracting] = useState(false);
  const [restored, setRestored] = useState(false);
  const [transition, dispatchTransition] = useReducer(crosswordTransition, {
    phase: "entering",
    solved: null,
  });
  const contentView = useContentView();
  const wasContentVisible = useRef(contentVisible);
  const navigationHash = useNavigationHash();
  const wasNavigationHash = useRef(navigationHash);
  const wasContentView = useRef(contentView);
  const articleRef = useRef<HTMLElement | null>(null);
  const hasShownCrossword = useRef(false);
  const exitAction = useRef<"website" | "refresh">("website");
  const exitHash = useRef<string | null>(null);
  const solved = isCrosswordSolved(puzzle.cells, letters);
  const locked = transition.phase !== "ready";
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const repeatClick = useRef(false);
  const cycleClues = useRef(true);
  const entry =
    puzzle.entries.find((item) => item.direction === direction && item.cells.includes(active)) ??
    puzzle.entries.find((item) => item.cells.includes(active))!;
  const entryCells = useMemo(() => new Set(entry.cells), [entry]);

  const captureAnimation = useCallback(() => {
    const value = articleRef.current
      ? Number.parseFloat(
          window.getComputedStyle(articleRef.current).getPropertyValue("--crossword-dot-radius"),
        )
      : 0;
    animationStart.current = Number.isFinite(value) ? Math.max(0, Math.min(4.6, value)) : 0;
  }, []);

  useEffect(() => {
    const cancelPendingExit = () => {
      if (exitHash.current === null || exitHash.current === window.location.hash) return;
      if (getContentView()) {
        exitHash.current = window.location.hash;
        return;
      }
      exitHash.current = null;
      articleRef.current?.closest(".home-views")?.removeAttribute("data-crossword-exiting");
      captureAnimation();
      dispatchTransition({ type: "reenter" });
    };
    window.addEventListener("popstate", cancelPendingExit);
    window.addEventListener("hashchange", cancelPendingExit);
    return () => {
      window.removeEventListener("popstate", cancelPendingExit);
      window.removeEventListener("hashchange", cancelPendingExit);
    };
  }, [captureAnimation]);

  const finishAnimation = useCallback(() => {
    if (getContentView() !== contentView || window.location.hash !== navigationHash) return;
    if (transition.phase === "entering" || transition.phase === "exiting") {
      dispatchTransition({ type: "animation-end", phase: transition.phase, run: transition.run ?? 0 });
    }
  }, [transition.phase, transition.run, contentView, navigationHash]);
  useAnimationCompletion(
    articleRef,
    restored &&
      ((transition.phase === "entering" && !contentView && !contentVisible) ||
        transition.phase === "exiting"),
    finishAnimation,
  );

  useEffect(() => {
    try {
      const saved = parseCrosswordLetters(localStorage.getItem(progressKey), puzzle.cells.length);
      if (saved) {
        setLetters(saved);
      }
    } catch {}
    setRestored(true);
  }, [puzzle, progressKey]);

  useEffect(() => {
    if (!restored) return;
    try {
      localStorage.setItem(progressKey, JSON.stringify(letters));
    } catch {}
  }, [letters, progressKey, restored]);

  useEffect(() => {
    if (!restored) return;
    dispatchTransition({ type: "answers", solved });
  }, [restored, solved]);

  useBrowserLayoutEffect(() => {
    const views = articleRef.current?.closest(".home-views");
    const contentTargeted = getContentView();
    if (restored && !contentTargeted) hasShownCrossword.current = true;
    if (
      contentView &&
      !wasContentView.current &&
      !wasContentVisible.current &&
      hasShownCrossword.current &&
      transition.phase !== "complete"
    ) {
      views?.setAttribute("data-crossword-exiting", "");
      exitAction.current = "website";
      exitHash.current = window.location.hash;
      captureAnimation();
      setInteracting(false);
      dispatchTransition({ type: "leave" });
    }
    if (
      !contentView &&
      (wasContentView.current ||
        (wasNavigationHash.current !== navigationHash &&
          (transition.phase === "holding" ||
            transition.phase === "exiting" ||
            transition.phase === "complete")))
    ) {
      views?.removeAttribute("data-crossword-exiting");
      exitAction.current = "website";
      exitHash.current = null;
      captureAnimation();
      dispatchTransition({ type: "reenter" });
    }
    if (contentView && exitHash.current !== null) exitHash.current = window.location.hash;
    wasContentView.current = contentView;
    wasContentVisible.current = contentVisible;
    wasNavigationHash.current = navigationHash;
  }, [contentView, contentVisible, navigationHash, restored, transition.phase, captureAnimation]);

  useEffect(() => {
    if (transition.phase !== "holding") return;
    setInteracting(false);
    exitHash.current = window.location.hash;
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 650;
    const hash = window.location.hash;
    const timer = window.setTimeout(() => {
      if (window.location.hash !== hash) return;
      captureAnimation();
      dispatchTransition({ type: "hold-end", run: transition.run ?? 0 });
    }, delay);
    return () => window.clearTimeout(timer);
  }, [transition.phase, transition.run, captureAnimation]);

  useEffect(() => {
    if (transition.phase !== "complete") return;
    if (exitHash.current === null || exitHash.current !== window.location.hash) return;
    exitHash.current = null;
    articleRef.current?.closest(".home-views")?.removeAttribute("data-crossword-exiting");
    if (exitAction.current === "refresh") {
      onRefresh();
      return;
    }
    if (!getContentView()) {
      window.location.hash = "content";
    }
    const frame = window.requestAnimationFrame(() => {
      if (window.location.hash !== "#content") return;
      const content = document.getElementById("content");
      content?.setAttribute("tabindex", "-1");
      content?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [transition.phase, onRefresh]);

  function leaveCrossword(action: "website" | "refresh") {
    if (locked) return;
    exitAction.current = action;
    exitHash.current = window.location.hash;
    captureAnimation();
    setInteracting(false);
    dispatchTransition({ type: "leave" });
  }

  function focusSquare(index: number, nextDirection = entry.direction) {
    cycleClues.current = true;
    setActive(index);
    setDirection(nextDirection);
    setInteracting(true);
    inputs.current[index]?.focus({ preventScroll: true });
    inputs.current[index]?.select();
  }

  function enterLetters(index: number, value: string) {
    const result = applyCrosswordInput(letters, entry, index, value);
    if (!result) return;
    setLetters(result.letters);
    focusSquare(nextUnfinishedSquare(entry, result.lastEntered, result.letters));
  }

  function clearLetters() {
    setLetters(puzzle.cells.map(() => ""));
    const first = puzzle.entries[0];
    focusSquare(first.cells[0], first.direction);
  }

  function revealEntry() {
    if (locked || !interacting) return;
    setLetters((current) => {
      const next = [...current];
      for (const cell of entry.cells) next[cell] = puzzle.cells[cell];
      return next;
    });
    focusSquare(active);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>, index: number) {
    if (event.metaKey || event.ctrlKey || event.altKey || event.nativeEvent.isComposing) return;
    if (event.key === "Tab") {
      if (!cycleClues.current) return;
      const next = nextClue(puzzle.entries, entry, event.shiftKey ? -1 : 1, letters);
      if (!next) return;
      event.preventDefault();
      focusSquare(
        next.cells.find((cell, position) => letters[cell] !== next.answer[position]) ?? next.cells[0],
        next.direction,
      );
    } else if (event.key === "Escape") {
      event.preventDefault();
      cycleClues.current = false;
    } else if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      setDirection(entry.direction === "across" ? "down" : "across");
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
      <CrosswordStrokeFilter id={strokeId} appearance={appearance} />
      <CrosswordStrokeFilter id={`${strokeId}-arrows`} appearance={appearance} shape />
      <article
        ref={articleRef}
        className={`${styles.newspaper} ${styles[transition.phase]}`}
        style={
          {
            ...appearanceStyle,
            "--crossword-animation-play-state":
              restored && !(transition.phase === "entering" && contentVisible) ? "running" : "paused",
          } as CSSProperties
        }
        aria-label="Crossword"
        aria-hidden={transition.phase === "complete" || undefined}
      >
        <div className={styles.controls} role="group" aria-label="Crossword controls">
          <div className={styles.identity}>
            <span>{profile.name}</span>
            <a
              href="#content"
              tabIndex={locked ? -1 : undefined}
              aria-disabled={locked || undefined}
              onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)
                  return;
                event.preventDefault();
                leaveCrossword("website");
              }}
            >
              Go to website
            </a>
          </div>
          <div className={styles.rightControls}>
            {interacting && (
              <button
                type="button"
                onClick={revealEntry}
                disabled={locked}
                aria-label={`Reveal ${entry.number} ${entry.direction}`}
              >
                Reveal
              </button>
            )}
            <button type="button" aria-pressed={autoCheck} onClick={onAutoCheck} disabled={locked}>
              Auto-check
            </button>
            <button type="button" onClick={() => leaveCrossword("refresh")} disabled={locked}>
              Refresh
            </button>
            <button type="button" onClick={clearLetters} disabled={locked}>
              Clear
            </button>
          </div>
        </div>
        <div className={styles.puzzle}>
          <div className={styles.gridColumn}>
            <p id="crossword-instructions" className="sr-only">
              Type to fill a square and advance past correct letters. Tab selects the next unfinished clue;
              Shift+Tab selects the previous unfinished clue, cycling through Across, then Down and skipping
              correct answers. Click a completed clue or square to edit it. Left and Right move across; Up and
              Down move down. Enter or Space switches direction at a crossing. Backspace erases. Press Escape,
              then Tab to leave the grid. Select a clue to fill its answer. When Auto-check is on, incorrect
              letters are marked with a red line.
            </p>
            <div
              className={`${styles.grid} ${definition.layout === "freeform" ? styles.freeform : ""}`}
              role="group"
              aria-label={`${puzzle.width} by ${puzzle.height} crossword`}
              aria-describedby="crossword-instructions"
              style={{ gridTemplateColumns: `repeat(${puzzle.width}, 1fr)` }}
            >
              {puzzle.cells.map((solution, index) => {
                if (solution === "#") return <div key={index} className={styles.block} aria-hidden="true" />;
                const selected = interacting && active === index;
                const inWord = interacting && entryCells.has(index);
                const incorrect = autoCheck && letters[index] !== "" && letters[index] !== solution;
                return (
                  <div
                    key={index}
                    data-crossword-cell=""
                    className={`${styles.cell} ${inWord ? styles.inWord : ""} ${selected ? styles.selected : ""} ${incorrect ? styles.incorrect : ""}`}
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
                      aria-invalid={incorrect}
                      aria-describedby={
                        active === index ? `clue-${entry.direction}-${entry.number}` : undefined
                      }
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="characters"
                      spellCheck={false}
                      inputMode="text"
                      disabled={locked}
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
                          setDirection(entry.direction === "across" ? "down" : "across");
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
              <CrosswordHalftone appearance={appearance} freeform={definition.layout === "freeform"} />
            </div>
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
                  {entriesByDirection[clueDirection].map((item) => (
                    <li key={item.number}>
                      <button
                        id={`clue-${item.direction}-${item.number}`}
                        className={interacting && entry === item ? styles.activeClue : ""}
                        aria-label={`${item.number} ${item.direction}: ${item.clue}`}
                        aria-pressed={interacting && entry === item}
                        disabled={locked}
                        onClick={() =>
                          focusSquare(
                            item.cells.find((cell) => !letters[cell]) ?? item.cells[0],
                            item.direction,
                          )
                        }
                      >
                        <span className={styles.clueNumber} data-ink-text={item.number}>
                          {item.number}
                        </span>
                        <span className={styles.printedText} data-ink-text={item.clue}>
                          {item.clue}
                        </span>
                      </button>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        </div>
      </article>
      <p className="sr-only" role="status">
        {solved &&
        (transition.phase === "holding" || transition.phase === "exiting" || transition.phase === "complete")
          ? "Crossword complete. All answers are correct."
          : ""}
      </p>
      {CrosswordDial && <CrosswordDial onChange={setAppearance} />}
    </main>
  );
}
