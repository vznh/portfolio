"use client";

import {
  MUTED_PALETTE,
  oldestFirstStory,
  type ProvenanceAccent,
  type ProvenanceStoryPart,
} from "@/presets/provenance";
import type { PreparedTextWithSegments } from "@chenglou/pretext";
import { m } from "framer-motion";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const isAccent = (part: string | ProvenanceAccent): part is ProvenanceAccent =>
  typeof part !== "string";

// Keep the initial teaser small until the section gets an explicit reveal.
const previewStory = oldestFirstStory.slice(0, 1);
const COLLAPSED_FADE_DISTANCE_REM = 3.5;
const EXPANSION_SCROLL_DURATION = 3000;
const MASK_CLEAR_DURATION = 4000;
const MASK_CLEAR_START_MS = 1750;
const MASK_CLEAR_END_MS = MASK_CLEAR_START_MS + MASK_CLEAR_DURATION;

// Reading bar + reveal frame. The bar sits 45% down the viewport; the
// values below must mirror the paragraph classes (text-xl leading-7
// tracking-tight font-plex) so pretext reproduces the browser's line breaks.
const BAR_VIEWPORT_RATIO = 0.45;
const LINE_HEIGHT_REM = 1.75;
const FONT_SIZE_REM = 1.25;
const TRACKING_EM = -0.025;
const CANVAS_FONT_FAMILY = '"IBM Plex Sans"';
const FRAME_ROWS = 6;
const BAR_OVERLAP_THRESHOLD = 0.5;

type PretextModule = typeof import("@chenglou/pretext");

type FrameSpec = {
  key: string;
  paragraphIndex: number;
  partIndex: number;
  splitOffset: number;
  state: "open" | "closing";
};

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
  singleLine: boolean;
};

const accentKeyOf = (paragraphIndex: number, partIndex: number) =>
  `${paragraphIndex}:${partIndex}`;

const barColorOf = (accent: ProvenanceAccent) => {
  const hasLink = Boolean(accent.url);
  const hasPreview = Boolean(accent.media);

  if (hasLink && hasPreview) return "#002fa7";
  if (hasLink || hasPreview) return "orange";
  return "red";
};

const hostnameOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "view";
  }
};

const easeReveal = (progress: number) => {
  // Match the cubic-bezier used by the Framer height and mask animations.
  const cubic = (t: number, first: number, second: number) =>
    3 * (1 - t) ** 2 * t * first +
    3 * (1 - t) * t ** 2 * second +
    t ** 3;

  let low = 0;
  let high = 1;

  // Solve the bezier's x component for the requested time, then return y.
  for (let iteration = 0; iteration < 12; iteration += 1) {
    const midpoint = (low + high) / 2;
    if (cubic(midpoint, 0.22, 0.36) < progress) {
      low = midpoint;
    } else {
      high = midpoint;
    }
  }

  return cubic((low + high) / 2, 1, 1);
};

const interpolate = (from: number, to: number, progress: number) =>
  from + (to - from) * progress;

const FrameBlock = ({
  frame,
  accent,
  reducedMotion,
  onClosed,
}: {
  frame: FrameSpec;
  accent: ProvenanceAccent | null;
  reducedMotion: boolean;
  onClosed: (key: string) => void;
}) => {
  const open = frame.state === "open";
  const frameHeightRem = LINE_HEIGHT_REM * (accent?.frameRows ?? FRAME_ROWS);
  const mediaList = accent?.media
    ? Array.isArray(accent.media)
      ? accent.media
      : [accent.media]
    : [];

  return (
    <m.span
      className="provenance-frame"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: open ? `${frameHeightRem}rem` : 0, opacity: open ? 1 : 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.55, ease: [0.22, 0.61, 0.36, 1] }}
      onAnimationComplete={() => {
        if (!open) onClosed(frame.key);
      }}
    >
      <span
        className="provenance-frame__inner"
        style={{ height: `${frameHeightRem}rem` }}
      >
        {mediaList.length > 0 ? (
          mediaList.map((media) =>
            media.type === "video" ? (
              <video
                key={media.src}
                className="provenance-frame__media"
                src={media.src}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={media.src}
                className="provenance-frame__media"
                src={media.src}
                alt={accent?.text ?? ""}
              />
            ),
          )
        ) : (
          <span className="provenance-frame__placeholder">
            {accent?.url ? hostnameOf(accent.url) : ""}
          </span>
        )}
      </span>
    </m.span>
  );
};

const ProvenanceSection = () => {
  const [colors, setColors] = useState<Record<string, string>>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSettled, setIsSettled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [frames, setFrames] = useState<FrameSpec[]>([]);
  const [barVisible, setBarVisible] = useState(false);
  const provenanceRef = React.useRef<HTMLDivElement>(null);
  const pendingExpansionRef = React.useRef<{ height: number } | null>(null);
  const pretextRef = React.useRef<PretextModule | null>(null);
  const paragraphLayoutsRef = React.useRef(new Map<number, ParagraphLayout>());
  const activeKeyRef = React.useRef<string | null>(null);
  const framesRef = React.useRef<FrameSpec[]>([]);
  const isSettledRef = React.useRef(false);

  framesRef.current = frames;
  isSettledRef.current = isSettled;

  useEffect(() => {
    const next: Record<string, string> = {};

    oldestFirstStory.flat().filter(isAccent).forEach((part) => {
      next[part.text] = MUTED_PALETTE[Math.floor(Math.random() * MUTED_PALETTE.length)];
    });

    setColors(next);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    let cancelled = false;
    const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
    const fontPx = FONT_SIZE_REM * rootFontSize;

    // Pretext needs Canvas + the real webfont; load both before any measuring.
    Promise.all([
      import("@chenglou/pretext"),
      document.fonts.load(`400 ${fontPx}px ${CANVAS_FONT_FAMILY}`).catch(() => undefined),
    ])
      .then(([mod]) => {
        if (!cancelled) pretextRef.current = mod;
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  const expandProvenance = () => {
    if (isExpanded || !provenanceRef.current) return;

    pendingExpansionRef.current = {
      height: provenanceRef.current.offsetHeight,
    };
    setIsExpanded(true);
  };

  React.useEffect(() => {
    if (!isExpanded || !pendingExpansionRef.current) return;

    const initial = pendingExpansionRef.current;
    pendingExpansionRef.current = null;

    let revealFrame = 0;
    const measureFrame = window.requestAnimationFrame(() => {
      const element = provenanceRef.current;
      if (!element) return;

      const naturalExpandedHeight = element.scrollHeight;
      const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
      const fadeDistance = rootFontSize * COLLAPSED_FADE_DISTANCE_REM;
      const collapsedFadeStart = fadeDistance;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setIsSettled(true);
        return;
      }

      const startedAt = performance.now();

      const reveal = (now: number) => {
        const elapsed = now - startedAt;
        const rawProgress = Math.min(elapsed / EXPANSION_SCROLL_DURATION, 1);
        const progress = easeReveal(rawProgress);
        const currentHeight = interpolate(initial.height, naturalExpandedHeight, progress);
        const currentFadeStart = Math.max(collapsedFadeStart, currentHeight - fadeDistance);
        const maskProgress = elapsed < MASK_CLEAR_START_MS
          ? 0
          : Math.min((elapsed - MASK_CLEAR_START_MS) / MASK_CLEAR_DURATION, 1);
        const fadeStart = maskProgress === 0
          ? currentFadeStart
          : interpolate(
              currentFadeStart,
              naturalExpandedHeight + fadeDistance,
              easeReveal(maskProgress),
            );

        element.style.height = `${interpolate(initial.height, naturalExpandedHeight, progress)}px`;
        element.style.setProperty("--provenance-fade-start", `${fadeStart}px`);

        if (elapsed < MASK_CLEAR_END_MS) {
          revealFrame = window.requestAnimationFrame(reveal);
          return;
        }

        // Fully revealed: drop the fixed height and mask so frames opening
        // below can grow the section instead of being clipped by it.
        element.style.height = "";
        element.style.removeProperty("--provenance-fade-start");
        setIsSettled(true);
      };

      revealFrame = window.requestAnimationFrame(reveal);
    });

    return () => {
      window.cancelAnimationFrame(measureFrame);
      window.cancelAnimationFrame(revealFrame);
    };
  }, [isExpanded]);

  // Where does the accent's last line end? Pretext re-derives the browser's
  // line breaks arithmetically so the paragraph can split at a real break —
  // the text above the frame keeps its exact wrapping.
  const computeSplitOffset = (
    paragraphIndex: number,
    partIndex: number,
  ): number | null => {
    const pretext = pretextRef.current;
    const section = provenanceRef.current;
    if (!pretext || !section) return null;

    const paragraphEl = section.querySelectorAll<HTMLElement>(":scope > p")[paragraphIndex];
    const parts = oldestFirstStory[paragraphIndex];
    if (!paragraphEl || !parts) return null;

    const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
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
        prepared: pretext.prepareWithSegments(flatText, `400 ${fontPx}px ${CANVAS_FONT_FAMILY}`, {
          letterSpacing: TRACKING_EM * fontPx,
        }),
        lineEndsByWidth: new Map(),
      };
      paragraphLayoutsRef.current.set(paragraphIndex, entry);
    }

    const width = paragraphEl.getBoundingClientRect().width;
    const widthKey = Math.round(width * 10);
    let lineEnds = entry.lineEndsByWidth.get(widthKey);
    if (lineEnds === undefined) {
      const { lines } = pretext.layoutWithLines(entry.prepared, width, lineHeightPx);
      const ends: number[] = [];
      let offset = 0;
      let ok = lines.length > 0;
      for (const line of lines) {
        while (offset < entry.flatText.length && entry.flatText[offset] === " ") offset += 1;
        if (!entry.flatText.startsWith(line.text, offset)) {
          const found = entry.flatText.indexOf(line.text, offset);
          if (found === -1) {
            ok = false;
            break;
          }
          offset = found;
        }
        offset += line.text.length;
        ends.push(offset);
      }
      lineEnds = ok ? ends : null;
      // If pretext disagrees with the browser about the line count, its break
      // offsets can't be trusted — skip the reveal rather than re-wrap text.
      if (lineEnds && !framesRef.current.some((f) => f.paragraphIndex === paragraphIndex)) {
        const domLineCount = Math.round(paragraphEl.getBoundingClientRect().height / lineHeightPx);
        if (domLineCount > 0 && domLineCount !== lineEnds.length) lineEnds = null;
      }
      entry.lineEndsByWidth.set(widthKey, lineEnds);
    }
    if (!lineEnds) return null;

    // A wrapping hyperlink opens the frame after the LAST line it occupies.
    const part = parts[partIndex];
    const accentStart = entry.partStarts[partIndex] ?? 0;
    const accentLastChar = accentStart + (isAccent(part) ? part.text.length : 0) - 1;
    const lineIndex = lineEnds.findIndex((end) => accentLastChar < end);
    if (lineIndex === -1) return null;
    return lineEnds[lineIndex];
  };

  const detectRef = React.useRef<() => void>(() => {});
  detectRef.current = () => {
    const section = provenanceRef.current;
    if (!section) return;

    if (!isExpanded) {
      setBarVisible(false);
      activeKeyRef.current = null;
      setActiveKey(null);
      return;
    }

    const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
    const lineHeightPx = LINE_HEIGHT_REM * rootFontSize;
    // Band midpoint at 45% of the viewport; must mirror .provenance-bar's CSS top.
    const barTop = window.innerHeight * BAR_VIEWPORT_RATIO - lineHeightPx / 2;
    const barBottom = barTop + lineHeightPx;
    const sectionRect = section.getBoundingClientRect();
    const visible = sectionRect.top < barBottom && sectionRect.bottom > barTop;

    setBarVisible(visible);

    let best: BarCandidate | null = null;
    if (visible) {
      const rectsByKey = new Map<string, DOMRect[]>();
      section.querySelectorAll<HTMLElement>("[data-accent-key]").forEach((el) => {
        const key = el.dataset.accentKey;
        if (!key) return;
        const list = rectsByKey.get(key) ?? [];
        for (const rect of Array.from(el.getClientRects())) {
          if (rect.width <= 0 || rect.height <= 0) continue;
          // Skip fragments hidden under the collapsed preview's clip.
          if (rect.bottom <= sectionRect.top || rect.top >= sectionRect.bottom) continue;
          list.push(rect);
        }
        rectsByKey.set(key, list);
      });

      const candidates: BarCandidate[] = [];
      rectsByKey.forEach((rects, key) => {
        rects.forEach((rect) => {
          const overlap = Math.min(rect.bottom, barBottom) - Math.max(rect.top, barTop);
          const denominator = Math.min(lineHeightPx, rect.height);
          if (denominator <= 0 || overlap / denominator < BAR_OVERLAP_THRESHOLD) return;
          const [paragraphIndex, partIndex] = key.split(":").map(Number);
          candidates.push({
            key,
            paragraphIndex,
            partIndex,
            overlap,
            top: rect.top,
            singleLine: rects.length === 1,
          });
        });
      });

      if (candidates.length > 0) {
        const maxOverlap = Math.max(...candidates.map((c) => c.overlap));
        const lineTop = candidates.find((c) => c.overlap === maxOverlap)?.top ?? 0;
        const sameLine = candidates.filter((c) => Math.abs(c.top - lineTop) < 2);
        // Two links on one line usually means one bled in from another line —
        // the one living entirely on this line wins.
        const pool = sameLine.some((c) => c.singleLine)
          ? sameLine.filter((c) => c.singleLine)
          : sameLine;
        best = pool.sort((a, b) => b.overlap - a.overlap)[0] ?? null;
      }
    }

    const nextKey = best?.key ?? null;
    if (nextKey === activeKeyRef.current) return;
    activeKeyRef.current = nextKey;
    setActiveKey(nextKey);

    let newFrame: FrameSpec | null = null;
    if (best && isSettledRef.current && !framesRef.current.some((f) => f.key === best.key)) {
      const accent = oldestFirstStory[best.paragraphIndex]?.[best.partIndex];
      // Nothing to reveal (no link, no media) → highlight only, no layout shift.
      if (
        accent &&
        isAccent(accent) &&
        !accent.disableReveal &&
        (accent.url || accent.media)
      ) {
        const splitOffset = computeSplitOffset(best.paragraphIndex, best.partIndex);
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

    setFrames((prev) => {
      let next = prev.map((frame) => {
        const target: FrameSpec["state"] = frame.key === nextKey ? "open" : "closing";
        return frame.state === target ? frame : { ...frame, state: target };
      });
      if (newFrame && !prev.some((frame) => frame.key === newFrame?.key)) {
        next = [...next, newFrame];
      }
      return next;
    });
  };

  useEffect(() => {
    let rafId = 0;
    const schedule = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        detectRef.current();
      });
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    detectRef.current();
  }, [isExpanded, isSettled]);

  const removeFrame = React.useCallback((key: string) => {
    setFrames((prev) => {
      const frame = prev.find((f) => f.key === key);
      if (!frame || frame.state !== "closing") return prev;
      return prev.filter((f) => f.key !== key);
    });
  }, []);

  const renderRange = (
    paragraph: ProvenanceStoryPart[],
    paragraphIndex: number,
    from: number,
    to: number,
  ) => {
    const elements: React.ReactNode[] = [];
    let cursor = 0;

    paragraph.forEach((part, partIndex) => {
      const text = isAccent(part) ? part.text : part;
      const start = cursor;
      const end = cursor + text.length;
      cursor = end;
      if (end <= from || start >= to) return;

      const slice = text.slice(Math.max(start, from) - start, Math.min(end, to) - start);
      if (!slice) return;
      const key = `${partIndex}-${Math.max(start, from)}`;

      if (!isAccent(part)) {
        elements.push(
          <span key={key} className="opacity-50">
            {slice}
          </span>,
        );
        return;
      }

      const accentKey = accentKeyOf(paragraphIndex, partIndex);
      const isActive = activeKey === accentKey;
      const color = isActive
        ? colors[part.text] ?? "var(--text-color)"
        : "var(--text-color)";
      const accentStyle = {
        color,
        textDecorationColor: isActive ? color : "transparent",
      };
      const accentClassName = `link provenance-accent${
        isActive ? " provenance-accent--active" : ""
      }`;

      if (!part.url) {
        elements.push(
          <span
            key={key}
            data-accent-key={accentKey}
            className={accentClassName}
            style={{ ...accentStyle, cursor: "not-allowed" }}
          >
            {slice}
          </span>,
        );
        return;
      }

      elements.push(
        <Link
          key={key}
          data-accent-key={accentKey}
          href={part.url}
          target="_blank"
          rel="noopener noreferrer"
          className={accentClassName}
          style={accentStyle}
        >
          {slice}
        </Link>,
      );
    });

    return elements;
  };

  const story = isExpanded ? oldestFirstStory : previewStory;
  const paragraphClassName =
    "font-plex text-xl leading-7 tracking-tight text-justify text-[var(--text-color)]";
  const activeBarColor = (() => {
    if (!activeKey) return undefined;
    const [paragraphIndex, partIndex] = activeKey.split(":").map(Number);
    const accent = oldestFirstStory[paragraphIndex]?.[partIndex];
    return accent && isAccent(accent) ? barColorOf(accent) : undefined;
  })();

  return (
    <div>
      <div
        ref={provenanceRef}
        className={`${isSettled ? "" : "provenance-preview "}provenance-story space-y-4`}
      >
        {story.map((paragraph, paragraphIndex) => {
          const paragraphFrames = frames
            .filter((frame) => frame.paragraphIndex === paragraphIndex)
            .sort((a, b) => a.splitOffset - b.splitOffset);

          if (paragraphFrames.length === 0) {
            return (
              <p key={paragraphIndex} className={paragraphClassName}>
                {renderRange(paragraph, paragraphIndex, 0, Number.POSITIVE_INFINITY)}
              </p>
            );
          }

          const totalLength = paragraph.reduce(
            (sum, part) => sum + (isAccent(part) ? part.text : part).length,
            0,
          );
          const chunks: React.ReactNode[] = [];
          let from = 0;

          paragraphFrames.forEach((frame) => {
            if (frame.splitOffset > from) {
              chunks.push(
                <span
                  key={`segment-${from}`}
                  style={{
                    display: "block",
                    // Keep the split line justified; it is no longer the block's
                    // real last line, only an artifact of the split.
                    textAlignLast: frame.splitOffset < totalLength ? "justify" : undefined,
                  }}
                >
                  {renderRange(paragraph, paragraphIndex, from, frame.splitOffset)}
                </span>,
              );
            }
            const accent = paragraph[frame.partIndex];
            chunks.push(
              <FrameBlock
                key={frame.key}
                frame={frame}
                accent={isAccent(accent) ? accent : null}
                reducedMotion={reducedMotion}
                onClosed={removeFrame}
              />,
            );
            from = Math.max(from, frame.splitOffset);
          });

          if (from < totalLength) {
            chunks.push(
              <span key={`segment-${from}`} style={{ display: "block" }}>
                {renderRange(paragraph, paragraphIndex, from, Number.POSITIVE_INFINITY)}
              </span>,
            );
          }

          return (
            <p key={paragraphIndex} className={paragraphClassName}>
              {chunks}
            </p>
          );
        })}
        {!isExpanded && (
          <button
            type="button"
            aria-label="Expand Provenance"
            aria-expanded={false}
            onClick={expandProvenance}
            className="provenance-preview__trigger"
          />
        )}
      </div>
      {isExpanded && <div aria-hidden className="provenance-scroll-tail" />}
      {isMounted &&
        isExpanded &&
        createPortal(
          <span
            aria-hidden
            className={`provenance-bar${barVisible ? " provenance-bar--visible" : ""}${
              activeKey ? " provenance-bar--active" : ""
            }`}
            style={
              activeBarColor
                ? ({ "--provenance-bar-active-color": activeBarColor } as React.CSSProperties)
                : undefined
            }
          />,
          document.body,
        )}
    </div>
  );
};

export default ProvenanceSection;
