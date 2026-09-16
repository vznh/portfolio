import { useEffect, type RefObject } from "react";
import { waitForAnimation } from "@/lib/animationCompletion";

export function useAnimationCompletion(ref: RefObject<HTMLElement>, active: boolean, onComplete: () => void) {
  useEffect(() => {
    const element = ref.current;
    if (!active || !element) return;
    const href = window.location.href;
    const finish = () => {
      if (window.location.href === href) onComplete();
    };
    let cancel = waitForAnimation(element, window.getComputedStyle(element), finish);
    const onNavigate = () => {
      cancel();
      if (window.location.href === href) {
        cancel = waitForAnimation(element, window.getComputedStyle(element), finish);
      }
    };
    window.addEventListener("popstate", onNavigate);
    window.addEventListener("hashchange", onNavigate);
    return () => {
      cancel();
      window.removeEventListener("popstate", onNavigate);
      window.removeEventListener("hashchange", onNavigate);
    };
  }, [ref, active, onComplete]);
}
