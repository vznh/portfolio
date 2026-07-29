"use client";

import {
  MUTED_PALETTE,
  oldestFirstStory,
  type ProvenanceAccent,
} from "@/presets/provenance";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const isAccent = (part: string | ProvenanceAccent): part is ProvenanceAccent =>
  typeof part !== "string";

// Keep the initial teaser small until the section gets an explicit reveal.
const previewStory = oldestFirstStory.slice(0, 1);
const COLLAPSED_FADE_DISTANCE_REM = 3.5;
const EXPANSION_SCROLL_DURATION = 3000;
const MASK_CLEAR_DURATION = 4000;
const MASK_CLEAR_START_MS = 1750;
const MASK_CLEAR_END_MS = MASK_CLEAR_START_MS + MASK_CLEAR_DURATION;
const RETURN_SCROLL_DURATION = 400;
const RETURN_SCROLL_DELAY = 1000;
const RETURN_SCROLL_OFFSET = 64;
const SCROLL_KEYS = new Set([
  "ArrowDown",
  "ArrowUp",
  "PageDown",
  "PageUp",
  "Home",
  "End",
  " ",
]);

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

const animateScrollTo = (
  target: number,
  duration: number,
  onComplete?: () => void,
) => {
  const start = window.scrollY;
  const startedAt = performance.now();
  let frame = 0;

  const tick = (now: number) => {
    const progress = Math.min((now - startedAt) / duration, 1);
    window.scrollTo(0, start + (target - start) * easeReveal(progress));

    if (progress < 1) {
      frame = window.requestAnimationFrame(tick);
    } else {
      onComplete?.();
    }
  };

  frame = window.requestAnimationFrame(tick);
  return () => window.cancelAnimationFrame(frame);
};

const lockPageScroll = () => {
  const preventScroll = (event: Event) => event.preventDefault();
  const preventKeyboardScroll = (event: KeyboardEvent) => {
    if (SCROLL_KEYS.has(event.key)) event.preventDefault();
  };

  window.addEventListener("wheel", preventScroll, { passive: false });
  window.addEventListener("touchmove", preventScroll, { passive: false });
  window.addEventListener("keydown", preventKeyboardScroll);

  return () => {
    window.removeEventListener("wheel", preventScroll);
    window.removeEventListener("touchmove", preventScroll);
    window.removeEventListener("keydown", preventKeyboardScroll);
  };
};

const ProvenanceSection = () => {
  const [colors, setColors] = useState<Record<string, string>>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const provenanceRef = React.useRef<HTMLDivElement>(null);
  const pendingExpansionRef = React.useRef<{ scrollY: number; height: number } | null>(null);

  useEffect(() => {
    const next: Record<string, string> = {};

    oldestFirstStory.flat().filter(isAccent).forEach((part) => {
      next[part.text] = MUTED_PALETTE[Math.floor(Math.random() * MUTED_PALETTE.length)];
    });

    setColors(next);
  }, []);

  const expandProvenance = () => {
    if (isExpanded || !provenanceRef.current) return;

    pendingExpansionRef.current = {
      scrollY: window.scrollY,
      height: provenanceRef.current.offsetHeight,
    };
    setIsExpanded(true);
  };

  React.useEffect(() => {
    if (!isExpanded || !pendingExpansionRef.current) return;

    const initial = pendingExpansionRef.current;
    pendingExpansionRef.current = null;

    let cancelScroll: (() => void) | undefined;
    let returnTimer: number | undefined;
    let unlockScroll: (() => void) | undefined;
    let revealFrame = 0;
    const measureFrame = window.requestAnimationFrame(() => {
      const element = provenanceRef.current;
      if (!element) return;

      const naturalExpandedHeight = element.scrollHeight;
      const heightDelta = Math.max(0, naturalExpandedHeight - initial.height);
      const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
      const fadeDistance = rootFontSize * COLLAPSED_FADE_DISTANCE_REM;
      const collapsedFadeStart = fadeDistance;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        element.style.height = `${naturalExpandedHeight}px`;
        element.style.setProperty(
          "--provenance-fade-start",
          `${naturalExpandedHeight + fadeDistance}px`,
        );
        return;
      }

      unlockScroll = lockPageScroll();
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
        window.scrollTo(0, initial.scrollY + heightDelta * progress);

        if (elapsed < MASK_CLEAR_END_MS) {
          revealFrame = window.requestAnimationFrame(reveal);
          return;
        }

        returnTimer = window.setTimeout(() => {
          cancelScroll = animateScrollTo(
            initial.scrollY + RETURN_SCROLL_OFFSET,
            RETURN_SCROLL_DURATION,
            () => unlockScroll?.(),
          );
        }, RETURN_SCROLL_DELAY);
      };

      revealFrame = window.requestAnimationFrame(reveal);
    });

    return () => {
      window.cancelAnimationFrame(measureFrame);
      window.cancelAnimationFrame(revealFrame);
      cancelScroll?.();
      if (returnTimer !== undefined) window.clearTimeout(returnTimer);
      unlockScroll?.();
    };
  }, [isExpanded]);

  const story = isExpanded ? oldestFirstStory : previewStory;

  return (
    <div
      ref={provenanceRef}
      className="provenance-preview space-y-4"
    >
      {story.map((paragraph, paragraphIndex) => (
        <p
          key={paragraphIndex}
          className="font-plex text-xl leading-7 tracking-tight text-justify text-[var(--text-color)]"
        >
          {paragraph.map((part, partIndex) => {
            if (!isAccent(part)) {
              return (
                <span key={partIndex} className="opacity-50">
                  {part}
                </span>
              );
            }

            const color = colors[part.text] ?? "var(--text-color)";
            const accentStyle = { color, textDecorationColor: color };

            if (!part.url) {
              return (
                <span
                  key={`${part.text}-${partIndex}`}
                  className="link"
                  style={{ ...accentStyle, cursor: "not-allowed" }}
                >
                  {part.text}
                </span>
              );
            }

            return (
              <Link
                key={`${part.text}-${partIndex}`}
                href={part.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link transition-colors duration-200"
                style={accentStyle}
              >
                {part.text}
              </Link>
            );
          })}
        </p>
      ))}
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
  );
};

export default ProvenanceSection;
