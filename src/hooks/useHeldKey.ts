import { useEffect, useState } from "react";

export function useHeldKey(key: string, holdMs: number) {
  const [held, setHeld] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    const clear = () => {
      if (timer) clearTimeout(timer);
      timer = null;
    };

    const release = () => {
      clear();
      setHeld(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
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
      clear();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", release);
    };
  }, [key, holdMs]);

  return held;
}
