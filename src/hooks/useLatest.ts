"use client";

import React from "react";

// Mirrors a reactive value into a ref so async work already in flight (a rAF
// loop, a pending timer) can read the current value without the value having to
// be an effect dependency — which would tear that work down and restart it.
export function useLatest<T>(value: T): React.MutableRefObject<T> {
  const ref = React.useRef(value);

  React.useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
}
