"use client";

import React from "react";

interface Options {
  // How far from the viewport center the element may sit, in viewport heights.
  threshold?: number;
  // Skip the listeners entirely (e.g. desktop, where hover drives playback).
  enabled?: boolean;
  // Latch on the first crossing instead of tracking continuously.
  once?: boolean;
}

// True while the element's center sits within `threshold` viewport-heights of
// the viewport's center — the "is this roughly what the reader is looking at"
// test used for scroll-triggered playback and reveals.
export function useNearViewportCenter(
  ref: React.RefObject<HTMLElement>,
  { threshold = 0.5, enabled = true, once = false }: Options = {},
): boolean {
  const [near, setNear] = React.useState(false);

  React.useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      const element = ref.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;
      const distanceFromCenter = Math.abs(
        elementCenter - viewportHeight / 2,
      );
      const isNear = distanceFromCenter <= viewportHeight * threshold;

      if (once && !isNear) return;
      setNear(isNear);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [ref, threshold, enabled, once]);

  return near;
}
