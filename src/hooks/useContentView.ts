import { useSyncExternalStore } from "react";
import { isContentFragment } from "@/lib/contentFragment";

function subscribe(listener: () => void) {
  window.addEventListener("hashchange", listener);
  window.addEventListener("popstate", listener);
  window.addEventListener("pageshow", listener);
  return () => {
    window.removeEventListener("hashchange", listener);
    window.removeEventListener("popstate", listener);
    window.removeEventListener("pageshow", listener);
  };
}

export function getContentView() {
  return isContentFragment(window.location.hash, (id) =>
    Boolean(document.getElementById(id)?.closest(".portfolio-content")),
  );
}

export function useContentView() {
  return useSyncExternalStore(subscribe, getContentView, () => false);
}

export function useNavigationHash() {
  return useSyncExternalStore(
    subscribe,
    () => window.location.hash,
    () => "",
  );
}
