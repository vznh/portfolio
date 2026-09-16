import IndexView from "@/views/index";
import { Meta } from "@/presets/meta";
import { Crossword } from "@/components/Crossword";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import { getContentView, useContentView, useNavigationHash } from "@/hooks/useContentView";
import { useAnimationCompletion } from "@/hooks/useAnimationCompletion";

const useBrowserLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function HomePage() {
  const [leavingContent, setLeavingContent] = useState(false);
  const contentView = useContentView();
  const navigationHash = useNavigationHash();
  const [contentVisible, setContentVisible] = useState(false);
  const wasContentView = useRef(contentView);
  const exitSourceHash = useRef<string | null>(null);
  const exitChangesHash = useRef(false);
  const [fadeFrom, setFadeFrom] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useBrowserLayoutEffect(() => {
    const syncNavigation = () => {
      const targetContent = getContentView();
      const opacity = Number.parseFloat(
        contentRef.current ? getComputedStyle(contentRef.current).opacity : "0",
      );
      if (targetContent) {
        setContentVisible(true);
        if (exitSourceHash.current !== null && exitSourceHash.current !== window.location.hash) {
          exitSourceHash.current = null;
          setFadeFrom(Number.isFinite(opacity) ? opacity : 0);
          setLeavingContent(false);
        }
      } else if (wasContentView.current) {
        exitSourceHash.current = window.location.hash;
        exitChangesHash.current = false;
        setFadeFrom(Number.isFinite(opacity) ? opacity : 1);
        setLeavingContent(true);
      } else if (exitSourceHash.current !== null) {
        exitSourceHash.current = window.location.hash;
        exitChangesHash.current = false;
      }
      wasContentView.current = targetContent;
    };
    syncNavigation();
    window.addEventListener("popstate", syncNavigation);
    window.addEventListener("hashchange", syncNavigation);
    return () => {
      window.removeEventListener("popstate", syncNavigation);
      window.removeEventListener("hashchange", syncNavigation);
    };
  }, []);

  function returnToCrossword(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    if (leavingContent) return;
    const opacity = Number.parseFloat(
      contentRef.current ? getComputedStyle(contentRef.current).opacity : "1",
    );
    setFadeFrom(Number.isFinite(opacity) ? opacity : 1);
    exitSourceHash.current = window.location.hash;
    exitChangesHash.current = true;
    setLeavingContent(true);
  }

  const finishContentExit = useCallback(() => {
    if (
      !leavingContent ||
      exitSourceHash.current !== window.location.hash ||
      navigationHash !== window.location.hash
    )
      return;
    const navigate = exitChangesHash.current;
    exitSourceHash.current = null;
    wasContentView.current = false;
    setLeavingContent(false);
    setContentVisible(false);
    setFadeFrom(0);
    if (navigate) window.location.hash = "crossword";
    window.requestAnimationFrame(() => {
      if (getContentView()) return;
      const crossword = document.querySelector<HTMLElement>(".crossword-landing main");
      crossword?.setAttribute("tabindex", "-1");
      crossword?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    });
  }, [leavingContent, navigationHash]);
  useAnimationCompletion(contentRef, leavingContent, finishContentExit);

  return (
    <>
      <Meta />
      <div
        className="home-views"
        data-content-visible={contentVisible ? "" : undefined}
        data-content-exiting={leavingContent ? "" : undefined}
      >
        <div id="crossword" className="crossword-landing">
          <Crossword contentVisible={contentVisible} />
        </div>
        <div
          id="content"
          ref={contentRef}
          className="portfolio-content"
          style={
            {
              "--portfolio-fade-from": fadeFrom,
              "--portfolio-enter-delay": fadeFrom > 0 ? "0ms" : "400ms",
            } as CSSProperties
          }
        >
          <IndexView onCrosswordClick={returnToCrossword} />
        </div>
      </div>
    </>
  );
}
