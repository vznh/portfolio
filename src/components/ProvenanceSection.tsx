"use client";

import {
  MUTED_PALETTE,
  oldestFirstStory,
  provenanceIntro,
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

const ProvenanceSection = () => {
  const [colors, setColors] = useState<Record<string, string>>({});
  const [isExpanded, setIsExpanded] = useState(false);
  const provenanceRef = React.useRef<HTMLDivElement>(null);
  const pendingExpansionRef = React.useRef<{ height: number } | null>(null);

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
        element.style.height = `${naturalExpandedHeight}px`;
        element.style.setProperty(
          "--provenance-fade-start",
          `${naturalExpandedHeight + fadeDistance}px`,
        );
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
      };

      revealFrame = window.requestAnimationFrame(reveal);
    });

    return () => {
      window.cancelAnimationFrame(measureFrame);
      window.cancelAnimationFrame(revealFrame);
    };
  }, [isExpanded]);

  const story = isExpanded ? oldestFirstStory : previewStory;

  return (
    <div
      ref={provenanceRef}
      className="provenance-preview space-y-4"
    >
      <p className="font-plex text-xl leading-7 tracking-tight text-justify text-[var(--text-color)] opacity-50">
        {provenanceIntro}
      </p>
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
