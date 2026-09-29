import { useEffect, useRef } from "react";
import type { CrosswordEntry } from "@/lib/crossword";
import styles from "@/styles/crossword.module.css";

export function CrosswordCluePanel({ entry }: { entry: CrosswordEntry }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const viewport = window.visualViewport;
    let frame = 0;

    const update = () => {
      frame = 0;
      const width = viewport?.width ?? window.innerWidth;
      const bottom = (viewport?.offsetTop ?? 0) + (viewport?.height ?? window.innerHeight);
      const center = (viewport?.offsetLeft ?? 0) + width / 2;
      panel.style.setProperty("--clue-viewport-bottom", `${bottom}px`);
      panel.style.setProperty("--clue-viewport-center", `${center}px`);
      panel.style.setProperty("--clue-viewport-width", `${width}px`);
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("resize", schedule);
    viewport?.addEventListener("resize", schedule);
    viewport?.addEventListener("scroll", schedule, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      viewport?.removeEventListener("resize", schedule);
      viewport?.removeEventListener("scroll", schedule);
    };
  }, []);

  return (
    <div ref={panelRef} className={styles.cluePanel} aria-hidden="true">
      <p className={styles.cluePanelContent}>
        <span className={styles.cluePanelArrow}>{entry.direction === "across" ? "↔" : "↓"}</span>
        <span className={styles.cluePanelNumber}>{entry.number}</span>
        <span>{entry.clue}</span>
      </p>
    </div>
  );
}
