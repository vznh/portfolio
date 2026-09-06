import { useEffect, useState } from "react";

/**
 * True once `key` has been held down for at least `holdMs`, false the
 * moment it is released (or the window loses focus, which swallows keyup).
 */
export function useHeldKey(key: string, holdMs: number) {
  const [held, setHeld] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const release = () => {
      if (timer) clearTimeout(timer);
      timer = null;
      setHeld(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // keydown repeats while held; only arm the timer once.
      if (e.key !== key || timer) return;
      timer = setTimeout(() => setHeld(true), holdMs);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === key) release();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", release);
    return () => {
      release();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", release);
    };
  }, [key, holdMs]);

  return held;
}
