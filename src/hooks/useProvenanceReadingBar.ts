import type { FrameSpec } from "@/components/provenance/ProvenanceFrame";
import {
  BAR_OVERLAP_THRESHOLD,
  BAR_VIEWPORT_RATIO,
  CANVAS_FONT_FAMILY,
  FONT_SIZE_REM,
  LINE_HEIGHT_REM,
  TRACKING_EM,
} from "@/components/provenance/constants";
import {
  oldestFirstStory,
  type ProvenanceAccent,
} from "@/presets/provenance";
import type { PreparedTextWithSegments } from "@chenglou/pretext";
import React from "react";

const isAccent = (
  part: string | ProvenanceAccent,
): part is ProvenanceAccent => typeof part !== "string";

type PretextModule = typeof import("@chenglou/pretext");

type ParagraphLayout = {
  flatText: string;
  partStarts: number[];
  prepared: PreparedTextWithSegments;
  lineEndsByWidth: Map<number, number[] | null>;
};

type BarCandidate = {
  key: string;
  paragraphIndex: number;
  partIndex: number;
  overlap: number;
  top: number;
  width: number;
  singleLine: boolean;
};

export const useProvenanceReadingBar = ({
  provenanceRef,
  isExpanded,
  isMobile,
  isSettled,
}: {
  provenanceRef: React.RefObject<HTMLDivElement>;
  isExpanded: boolean;
  isMobile: boolean;
  isSettled: boolean;
}) => {
  const [activeKey, setActiveKey] = React.useState<string | null>(null);
  const [frames, setFrames] = React.useState<FrameSpec[]>([]);
  const [barVisible, setBarVisible] = React.useState(false);
  const pretextRef = React.useRef<PretextModule | null>(null);
  const paragraphLayoutsRef = React.useRef(new Map<number, ParagraphLayout>());
  const activeKeyRef = React.useRef<string | null>(null);
  const framesRef = React.useRef<FrameSpec[]>([]);
  const lastScrollYRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    framesRef.current = frames;
  }, [frames]);

  React.useEffect(() => {
    let cancelled = false;
    const rootFontSize = Number.parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    );
    const fontPx = FONT_SIZE_REM * rootFontSize;

    // Pretext needs Canvas + the real webfont before measuring line breaks.
    Promise.all([
      import("@chenglou/pretext"),
      document.fonts
        .load(`400 ${fontPx}px ${CANVAS_FONT_FAMILY}`)
        .catch(() => undefined),
    ])
      .then(([module]) => {
        if (!cancelled) pretextRef.current = module;
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const computeSplitOffset = React.useCallback(
    (paragraphIndex: number, partIndex: number): number | null => {
      const pretext = pretextRef.current;
      const section = provenanceRef.current;
      if (!pretext || !section) return null;

      const paragraphElement = section.querySelector<HTMLElement>(
        `[data-provenance-paragraph="${paragraphIndex}"]`,
      );
      const parts = oldestFirstStory[paragraphIndex];
      if (!paragraphElement || !parts) return null;

      const rootFontSize = Number.parseFloat(
        getComputedStyle(document.documentElement).fontSize,
      );
      const lineHeightPx = LINE_HEIGHT_REM * rootFontSize;
      const fontPx = FONT_SIZE_REM * rootFontSize;

      let entry = paragraphLayoutsRef.current.get(paragraphIndex);
      if (!entry) {
        let flatText = "";
        const partStarts: number[] = [];
        for (const part of parts) {
          partStarts.push(flatText.length);
          flatText += isAccent(part) ? part.text : part;
        }
        entry = {
          flatText,
          partStarts,
          prepared: pretext.prepareWithSegments(
            flatText,
            `400 ${fontPx}px ${CANVAS_FONT_FAMILY}`,
            { letterSpacing: TRACKING_EM * fontPx },
          ),
          lineEndsByWidth: new Map(),
        };
        paragraphLayoutsRef.current.set(paragraphIndex, entry);
      }

      const width = paragraphElement.getBoundingClientRect().width;
      const widthKey = Math.round(width * 10);
      let lineEnds = entry.lineEndsByWidth.get(widthKey);
      if (lineEnds === undefined) {
        const { lines } = pretext.layoutWithLines(
          entry.prepared,
          width,
          lineHeightPx,
        );
        const ends: number[] = [];
        let offset = 0;
        let matchesBrowserText = lines.length > 0;
        for (const line of lines) {
          while (
            offset < entry.flatText.length &&
            entry.flatText[offset] === " "
          ) {
            offset += 1;
          }
          if (!entry.flatText.startsWith(line.text, offset)) {
            const found = entry.flatText.indexOf(line.text, offset);
            if (found === -1) {
              matchesBrowserText = false;
              break;
            }
            offset = found;
          }
          offset += line.text.length;
          ends.push(offset);
        }
        lineEnds = matchesBrowserText ? ends : null;

        // A disagreement with the DOM means the calculated split would rewrap.
        if (
          lineEnds &&
          !framesRef.current.some(
            (frame) => frame.paragraphIndex === paragraphIndex,
          )
        ) {
          const domLineCount = Math.round(
            paragraphElement.getBoundingClientRect().height / lineHeightPx,
          );
          if (domLineCount > 0 && domLineCount !== lineEnds.length) {
            lineEnds = null;
          }
        }
        entry.lineEndsByWidth.set(widthKey, lineEnds);
      }
      if (!lineEnds) return null;

      const part = parts[partIndex];
      const accentStart = entry.partStarts[partIndex] ?? 0;
      const accentLastCharacter =
        accentStart + (isAccent(part) ? part.text.length : 0) - 1;
      const lineIndex = lineEnds.findIndex(
        (end) => accentLastCharacter < end,
      );
      return lineIndex === -1 ? null : lineEnds[lineIndex];
    },
    [provenanceRef],
  );

  const detect = React.useCallback(() => {
    const section = provenanceRef.current;
    if (!section) return;

    if (!isExpanded) {
      setBarVisible(false);
      activeKeyRef.current = null;
      setActiveKey(null);
      return;
    }

    const rootFontSize = Number.parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    );
    const lineHeightPx = LINE_HEIGHT_REM * rootFontSize;
    const barTop =
      window.innerHeight * BAR_VIEWPORT_RATIO - lineHeightPx / 2;
    const barBottom = barTop + lineHeightPx;
    const sectionRect = section.getBoundingClientRect();
    const visible =
      sectionRect.top < barBottom && sectionRect.bottom > barTop;
    const previousScrollY = lastScrollYRef.current;
    const scrollDirection =
      previousScrollY === null
        ? 0
        : Math.sign(window.scrollY - previousScrollY);
    lastScrollYRef.current = window.scrollY;

    setBarVisible(!isMobile && visible);

    let best: BarCandidate | null = null;
    if (visible) {
      const rectsByKey = new Map<string, DOMRect[]>();
      for (const element of Array.from(
        section.querySelectorAll<HTMLElement>("[data-accent-key]"),
      )) {
        const key = element.dataset.accentKey;
        if (!key) continue;
        const rects = rectsByKey.get(key) ?? [];
        for (const rect of Array.from(element.getClientRects())) {
          if (rect.width <= 0 || rect.height <= 0) continue;
          if (
            rect.bottom <= sectionRect.top ||
            rect.top >= sectionRect.bottom
          ) {
            continue;
          }
          rects.push(rect);
        }
        rectsByKey.set(key, rects);
      }

      const candidates: BarCandidate[] = [];
      for (const [key, rects] of Array.from(rectsByKey.entries())) {
        for (const rect of rects) {
          const overlap =
            Math.min(rect.bottom, barBottom) - Math.max(rect.top, barTop);
          const denominator = Math.min(lineHeightPx, rect.height);
          if (
            denominator <= 0 ||
            overlap / denominator < BAR_OVERLAP_THRESHOLD
          ) {
            continue;
          }
          const [paragraphIndex, partIndex] = key.split(":").map(Number);
          candidates.push({
            key,
            paragraphIndex,
            partIndex,
            overlap,
            top: rect.top,
            width: rect.width,
            singleLine: rects.length === 1,
          });
        }
      }

      if (candidates.length > 0) {
        const maxOverlap = Math.max(
          ...candidates.map((candidate) => candidate.overlap),
        );
        const lineTop =
          candidates.find(
            (candidate) => candidate.overlap === maxOverlap,
          )?.top ?? 0;
        const sameLine = candidates.filter(
          (candidate) => Math.abs(candidate.top - lineTop) < 2,
        );
        const pool = sameLine.some((candidate) => candidate.singleLine)
          ? sameLine.filter((candidate) => candidate.singleLine)
          : sameLine;
        best =
          pool.sort(
            (left, right) =>
              right.width - left.width || right.overlap - left.overlap,
          )[0] ?? null;
      }
    }

    const framesToClear = new Set<string>();
    for (const frame of Array.from(
      section.querySelectorAll<HTMLElement>("[data-provenance-frame]"),
    )) {
      const key = frame.dataset.provenanceFrame;
      const rect = frame.getBoundingClientRect();
      const shouldClear =
        (scrollDirection > 0 && rect.bottom <= 0) ||
        (scrollDirection < 0 && rect.top >= window.innerHeight);
      if (key && shouldClear) framesToClear.add(key);
    }

    const nextKey = best?.key ?? null;
    const activeKeyChanged = nextKey !== activeKeyRef.current;
    if (!activeKeyChanged && framesToClear.size === 0) return;

    if (activeKeyChanged) {
      activeKeyRef.current = nextKey;
      setActiveKey(nextKey);
    }

    let newFrame: FrameSpec | null = null;
    if (
      best &&
      isSettled &&
      !framesRef.current.some((frame) => frame.key === best.key)
    ) {
      const accent =
        oldestFirstStory[best.paragraphIndex]?.[best.partIndex];
      if (
        accent &&
        isAccent(accent) &&
        !accent.disableReveal &&
        (accent.url || accent.media)
      ) {
        const splitOffset = computeSplitOffset(
          best.paragraphIndex,
          best.partIndex,
        );
        if (splitOffset !== null) {
          newFrame = {
            key: best.key,
            paragraphIndex: best.paragraphIndex,
            partIndex: best.partIndex,
            splitOffset,
            state: "open",
          };
        }
      }
    }

    setFrames((previous) => {
      let next = previous.map((frame) => {
        if (
          !framesToClear.has(frame.key) ||
          frame.state === "closing"
        ) {
          return frame;
        }
        return { ...frame, state: "closing" as const };
      });
      if (
        newFrame &&
        !previous.some((frame) => frame.key === newFrame?.key)
      ) {
        next = [...next, newFrame];
      }
      return next;
    });
  }, [
    computeSplitOffset,
    isExpanded,
    isMobile,
    isSettled,
    provenanceRef,
  ]);

  React.useEffect(() => {
    let animationFrame = 0;
    const schedule = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        detect();
      });
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [detect]);

  const removeFrame = React.useCallback((key: string) => {
    setFrames((previous) => {
      const frame = previous.find((candidate) => candidate.key === key);
      if (!frame || frame.state !== "closing") return previous;
      return previous.filter((candidate) => candidate.key !== key);
    });
  }, []);

  return {
    activeKey,
    barVisible,
    frames,
    removeFrame,
  };
};
