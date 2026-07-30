"use client";

import {
  MUTED_PALETTE,
  oldestFirstStory,
  provenanceIntro,
  type ProvenanceAccent,
} from "@/presets/provenance";
import { useProvenanceReadingBar } from "@/hooks/useProvenanceReadingBar";
import React from "react";
import { createPortal } from "react-dom";

import ProvenanceStory from "./provenance/ProvenanceStory";
import {
  COLLAPSED_FADE_DISTANCE_REM,
  COLLAPSED_PREVIEW_HEIGHT_REM,
  EXPANSION_SCROLL_DURATION,
  MASK_CLEAR_END_MS,
  MASK_CLEAR_START_MS,
  MASK_CLEAR_DURATION,
} from "./provenance/constants";

const isAccent = (
  part: string | ProvenanceAccent,
): part is ProvenanceAccent => typeof part !== "string";

const previewStory = oldestFirstStory.slice(0, 1);

const barColorOf = (accent: ProvenanceAccent) => {
  const hasLink = Boolean(accent.url);
  const hasPreview = Boolean(accent.media);

  if (hasLink && hasPreview) return "#002fa7";
  if (hasLink || hasPreview) return "orange";
  return "red";
};

const easeReveal = (progress: number) => {
  const cubic = (time: number, first: number, second: number) =>
    3 * (1 - time) ** 2 * time * first +
    3 * (1 - time) * time ** 2 * second +
    time ** 3;

  let low = 0;
  let high = 1;
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
  const [colors, setColors] = React.useState<Record<string, string>>({});
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isSettled, setIsSettled] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const provenanceRef = React.useRef<HTMLDivElement>(null);
  const pendingExpansionRef = React.useRef<{ height: number } | null>(
    null,
  );
  const { activeKey, barVisible, frames, removeFrame } =
    useProvenanceReadingBar({
      provenanceRef,
      isExpanded,
      isMobile,
      isSettled,
    });

  React.useEffect(() => {
    const next: Record<string, string> = {};
    for (const paragraph of oldestFirstStory) {
      for (const part of paragraph) {
        if (!isAccent(part)) continue;
        next[part.text] =
          MUTED_PALETTE[
            Math.floor(Math.random() * MUTED_PALETTE.length)
          ];
      }
    }
    setColors(next);
  }, []);

  React.useEffect(() => {
    setIsMounted(true);
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  React.useEffect(() => {
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
    let revealFrame = 0;
    const measureFrame = window.requestAnimationFrame(() => {
      const element = provenanceRef.current;
      if (!element) return;

      const naturalExpandedHeight = element.scrollHeight;
      const rootFontSize = Number.parseFloat(
        getComputedStyle(document.documentElement).fontSize,
      );
      const fadeDistance =
        rootFontSize * COLLAPSED_FADE_DISTANCE_REM;
      const collapsedFadeStart =
        rootFontSize *
        (COLLAPSED_PREVIEW_HEIGHT_REM - COLLAPSED_FADE_DISTANCE_REM);

      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        setIsSettled(true);
        return;
      }

      const startedAt = performance.now();
      const reveal = (now: number) => {
        const elapsed = now - startedAt;
        const progress = easeReveal(
          Math.min(elapsed / EXPANSION_SCROLL_DURATION, 1),
        );
        const currentHeight = interpolate(
          initial.height,
          naturalExpandedHeight,
          progress,
        );
        const currentFadeStart = Math.max(
          collapsedFadeStart,
          currentHeight - fadeDistance,
        );
        const maskProgress =
          elapsed < MASK_CLEAR_START_MS
            ? 0
            : Math.min(
                (elapsed - MASK_CLEAR_START_MS) / MASK_CLEAR_DURATION,
                1,
              );
        const fadeStart =
          maskProgress === 0
            ? currentFadeStart
            : interpolate(
                currentFadeStart,
                naturalExpandedHeight + fadeDistance,
                easeReveal(maskProgress),
              );

        element.style.height = `${currentHeight}px`;
        element.style.setProperty(
          "--provenance-fade-start",
          `${fadeStart}px`,
        );

        if (elapsed < MASK_CLEAR_END_MS) {
          revealFrame = window.requestAnimationFrame(reveal);
          return;
        }

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

  const story = isExpanded ? oldestFirstStory : previewStory;
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
        className={`${
          isSettled ? "" : "provenance-preview "
        }provenance-story space-y-4`}
      >
        <p className="font-plex text-xl leading-7 tracking-tight text-justify text-[var(--text-color)] opacity-50">
          {provenanceIntro}
        </p>
        <ProvenanceStory
          story={story}
          frames={frames}
          activeKey={activeKey}
          colors={colors}
          reducedMotion={reducedMotion}
          onFrameClosed={removeFrame}
        />
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
            className={`provenance-bar${
              barVisible ? " provenance-bar--visible" : ""
            }${activeKey ? " provenance-bar--active" : ""}`}
            style={
              activeBarColor
                ? ({
                    "--provenance-bar-active-color": activeBarColor,
                  } as React.CSSProperties)
                : undefined
            }
          />,
          document.body,
        )}
    </div>
  );
};

export default ProvenanceSection;
