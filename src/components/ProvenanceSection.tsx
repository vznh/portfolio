"use client";

import {
  MUTED_PALETTE,
  oldestFirstStory,
  provenanceIntro,
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

// Keep the initial teaser concise until the section gets an explicit reveal.
const previewStory = oldestFirstStory.slice(0, 1);
const COLLAPSED_PREVIEW_HEIGHT_REM = 10.5;
const COLLAPSED_FADE_DISTANCE_REM = 3.5;
const EXPANSION_SCROLL_DURATION = 3000;
const MASK_CLEAR_DURATION = 4000;
const MASK_CLEAR_START_MS = 1750;
const MASK_CLEAR_END_MS = MASK_CLEAR_START_MS + MASK_CLEAR_DURATION;
// Scrolling during the reveal fast-forwards it instead of waiting it out.
// The tail is long enough that easing ~900px of remaining height across it
// moves no more per frame than the unhurried reveal does at its steepest.
const SKIP_TAIL_MS = 450;
const SKIP_GRACE_MS = 400;

// Reading bar + reveal frame. The bar sits 45% down the viewport; the
// values below must mirror the paragraph classes (text-xl leading-7
// tracking-tight font-plex) so pretext reproduces the browser's line breaks.
const BAR_VIEWPORT_RATIO = 0.45;
const LINE_HEIGHT_REM = 1.75;
const FONT_SIZE_REM = 1.25;
const TRACKING_EM = -0.025;
// Must name the family that actually renders (see tailwind's font-plex). If
// this resolves to nothing, canvas silently measures a fallback and every
// split offset derived from it is wrong.
const CANVAS_FONT_FAMILY = '"Plex"';
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
  width: number;
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

// Cubic Hermite that leaves `from` still travelling at `rate` (px/ms) and
// arrives at `to` at rest. Used to hand the reveal over to its skip tail:
// smoothstep would start from zero velocity and stall for a frame in the
// middle of a movement the eye is already tracking.
const glideToRest = (from: number, to: number, rate: number, t: number) => {
  const span = to - from;
  if (span === 0) return to;
  // Normalized start tangent. Past 3 the curve stops being monotonic, and a
  // negative one would send it backwards; neither is ever wanted here.
  const m = Math.min(Math.max((rate * SKIP_TAIL_MS) / span, 0), 3);
  const shaped = m * (t ** 3 - 2 * t ** 2 + t) + (3 * t ** 2 - 2 * t ** 3);
  return from + span * shaped;
};

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
  const filmstripColumns = mediaList.length <= 2
    ? mediaList.length
    : Math.ceil(mediaList.length / 2);
  const filmstripRows = filmstripColumns > 0
    ? Math.ceil(mediaList.length / filmstripColumns)
    : 1;
  const frameInnerStyle = {
    height: `${frameHeightRem}rem`,
    "--provenance-filmstrip-columns": filmstripColumns,
    "--provenance-filmstrip-rows": filmstripRows,
  } as React.CSSProperties;

  return (
    <m.span
      className="provenance-frame"
      data-provenance-frame={frame.key}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: open ? `${frameHeightRem}rem` : 0, opacity: open ? 1 : 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.55, ease: [0.22, 0.61, 0.36, 1] }}
      onAnimationComplete={() => {
        if (!open) onClosed(frame.key);
      }}
    >
      <span
        className={`provenance-frame__inner${
          mediaList.length > 1 ? " provenance-frame__inner--filmstrip" : ""
        }`}
        style={frameInnerStyle}
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
  const [isMobile, setIsMobile] = useState(false);
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
  const lastScrollYRef = React.useRef<number | null>(null);

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

    Promise.all([import("@chenglou/pretext"), document.fonts.ready])
      .then(([mod]) => {
        if (!cancelled) pretextRef.current = mod;
      })
      .catch(() => {});

    // Neither `fonts.load` nor `fonts.ready` reliably gates this: for a family
    // the browser hasn't registered yet they resolve immediately with zero
    // faces, so pretext can still measure fallback metrics — 13% narrow — and
    // cache a line layout that never recovers. Dropping those measurements
    // whenever a face finishes loading is what actually fixes it.
    const invalidateLayouts = () => paragraphLayoutsRef.current.clear();
    document.fonts.addEventListener("loadingdone", invalidateLayouts);

    return () => {
      cancelled = true;
      document.fonts.removeEventListener("loadingdone", invalidateLayouts);
    };
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
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

    // The reveal is a ~5.75s cinematic, and frames can't open under it: the
    // height is pinned and the mask still covers the lower rows. A reader who
    // starts scrolling has stopped watching and started reading, so hand the
    // section over to them by playing the remainder out fast rather than
    // making them wait out the full run.
    let revealFrame = 0;
    let skippedAt: number | null = null;
    const armSkipAt = performance.now() + SKIP_GRACE_MS;
    const requestSkip = () => {
      // Trackpad momentum from scrolling down to the section can still be
      // firing as the click lands; ignore it so the reveal isn't stillborn.
      const now = performance.now();
      if (skippedAt === null && now >= armSkipAt) skippedAt = now;
    };

    const detachSkipListeners = () => {
      window.removeEventListener("wheel", requestSkip);
      window.removeEventListener("touchmove", requestSkip);
      window.removeEventListener("keydown", requestSkip);
    };

    window.addEventListener("wheel", requestSkip, { passive: true });
    window.addEventListener("touchmove", requestSkip, { passive: true });
    window.addEventListener("keydown", requestSkip);

    const measureFrame = window.requestAnimationFrame(() => {
      const element = provenanceRef.current;
      if (!element) return;

      const naturalExpandedHeight = element.scrollHeight;
      const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
      const fadeDistance = rootFontSize * COLLAPSED_FADE_DISTANCE_REM;
      const collapsedFadeStart = rootFontSize * (
        COLLAPSED_PREVIEW_HEIGHT_REM - COLLAPSED_FADE_DISTANCE_REM
      );

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        detachSkipListeners();
        setIsSettled(true);
        return;
      }

      const startedAt = performance.now();

      // Values and speeds the section held on the frame the skip landed. The
      // tail eases these to their finished state directly — compressing the
      // *timeline* instead would replay the steepest part of the ease at ~16x
      // and land as a lurch, which is the thing the skip exists to avoid.
      let skipFrom:
        | { height: number; fadeStart: number; heightRate: number; fadeRate: number }
        | null = null;
      let previous: { now: number; height: number; fadeStart: number } | null = null;

      const settle = () => {
        element.style.height = "";
        element.style.removeProperty("--provenance-fade-start");
        detachSkipListeners();
        setIsSettled(true);
      };

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

        if (skippedAt !== null) {
          if (!skipFrom) {
            // Carry the speed the reveal was already moving at into the tail.
            const step = previous ? now - previous.now : 0;
            skipFrom = {
              height: currentHeight,
              fadeStart,
              heightRate: step > 0 ? (currentHeight - previous!.height) / step : 0,
              fadeRate: step > 0 ? (fadeStart - previous!.fadeStart) / step : 0,
            };
          }

          // Clamped low as well as high: a wheel event is dispatched after the
          // frame's rAF timestamp is stamped, so the first tail frame can see a
          // negative age and would otherwise extrapolate backwards.
          const tail = Math.min(Math.max((now - skippedAt) / SKIP_TAIL_MS, 0), 1);

          element.style.height = `${glideToRest(
            skipFrom.height,
            naturalExpandedHeight,
            skipFrom.heightRate,
            tail,
          )}px`;
          element.style.setProperty(
            "--provenance-fade-start",
            `${glideToRest(
              skipFrom.fadeStart,
              naturalExpandedHeight + fadeDistance,
              skipFrom.fadeRate,
              tail,
            )}px`,
          );

          if (tail < 1) {
            revealFrame = window.requestAnimationFrame(reveal);
            return;
          }

          settle();
          return;
        }

        element.style.height = `${interpolate(initial.height, naturalExpandedHeight, progress)}px`;
        element.style.setProperty("--provenance-fade-start", `${fadeStart}px`);
        previous = { now, height: currentHeight, fadeStart };

        if (elapsed < MASK_CLEAR_END_MS) {
          revealFrame = window.requestAnimationFrame(reveal);
          return;
        }

        // Fully revealed: drop the fixed height and mask so frames opening
        // below can grow the section instead of being clipped by it.
        settle();
      };

      revealFrame = window.requestAnimationFrame(reveal);
    });

    return () => {
      detachSkipListeners();
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

    const paragraphEl = section.querySelector<HTMLElement>(
      `[data-provenance-paragraph="${paragraphIndex}"]`,
    );
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
    const scrollY = window.scrollY;
    const previousScrollY = lastScrollYRef.current;
    const scrollDirection = previousScrollY === null
      ? 0
      : Math.sign(scrollY - previousScrollY);
    lastScrollYRef.current = scrollY;

    // On touch screens the reading bar remains a positional trigger only. The
    // layout shift is visible, but the bar itself would obstruct reading.
    setBarVisible(!isMobile && visible);

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
            width: rect.width,
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
        // When every candidate wraps, the phrase occupying most of this row
        // is the clearest representation of what the reader is crossing.
        best = pool.sort((a, b) => b.width - a.width || b.overlap - a.overlap)[0] ?? null;
      }
    }

    const framesToClear = new Set<string>();
    section.querySelectorAll<HTMLElement>("[data-provenance-frame]").forEach((frame) => {
      const key = frame.dataset.provenanceFrame;
      const rect = frame.getBoundingClientRect();
      const shouldClear =
        (scrollDirection > 0 && rect.bottom <= 0) ||
        (scrollDirection < 0 && rect.top >= window.innerHeight);
      if (key && shouldClear) {
        framesToClear.add(key);
      }
    });

    const nextKey = best?.key ?? null;
    const activeKeyChanged = nextKey !== activeKeyRef.current;
    if (!activeKeyChanged && framesToClear.size === 0) return;

    if (activeKeyChanged) {
      activeKeyRef.current = nextKey;
      setActiveKey(nextKey);
    }

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
        if (!framesToClear.has(frame.key) || frame.state === "closing") return frame;
        return { ...frame, state: "closing" as const };
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
  }, [isExpanded, isMobile, isSettled]);

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
      const hasOpenPreview = frames.some(
        (frame) => frame.key === accentKey && frame.state === "open",
      );
      const isHighlighted = isActive || hasOpenPreview;
      const color = isHighlighted
        ? colors[part.text] ?? "var(--text-color)"
        : "var(--text-color)";
      const accentStyle = {
        color,
        textDecorationColor: isHighlighted ? color : "transparent",
      };
      const accentClassName = `link provenance-accent transition-colors duration-200${
        isHighlighted ? " provenance-accent--active" : ""
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
        <p className={`${paragraphClassName} opacity-50`}>
          {provenanceIntro}
        </p>
        {story.map((paragraph, paragraphIndex) => {
          const paragraphFrames = frames
            .filter((frame) => frame.paragraphIndex === paragraphIndex)
            .sort((a, b) => a.splitOffset - b.splitOffset);

          if (paragraphFrames.length === 0) {
            return (
              <p
                key={paragraphIndex}
                data-provenance-paragraph={paragraphIndex}
                className={paragraphClassName}
              >
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
            <p
              key={paragraphIndex}
              data-provenance-paragraph={paragraphIndex}
              className={paragraphClassName}
            >
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
