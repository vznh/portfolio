"use client";

import React from "react";

// Subscribes to a CSS media query. Returns false on the server and for the very
// first client render so the markup matches during hydration, then settles on
// the real match in an effect.
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);

    update();
    list.addEventListener("change", update);
    return () => list.removeEventListener("change", update);
  }, [query]);

  return matches;
}
