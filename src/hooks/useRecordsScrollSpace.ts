import { useEffect, type RefObject } from "react";

export function useRecordsScrollSpace(listRef: RefObject<HTMLUListElement>) {
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const mobile = window.matchMedia("(max-width: 767px)");
    let frame = 0;

    const update = () => {
      frame = 0;
      if (!mobile.matches || !list.getClientRects().length || !list.children.length) {
        list.style.marginBottom = "0px";
        return;
      }

      const viewportHeight = window.innerHeight;
      const listBottom = list.getBoundingClientRect().bottom + window.scrollY;
      const currentGap = parseFloat(list.style.marginBottom) || 0;
      const pageBottom = document.body.getBoundingClientRect().bottom + window.scrollY;
      const availableBelow = pageBottom - currentGap - listBottom;
      const missingSpace = Math.max(0, Math.ceil(viewportHeight * 0.75 + 1 - availableBelow));
      list.style.marginBottom = `${missingSpace}px`;
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    observer.observe(list);
    window.addEventListener("resize", schedule);
    mobile.addEventListener("change", schedule);
    update();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      mobile.removeEventListener("change", schedule);
      list.style.removeProperty("margin-bottom");
    };
  }, [listRef]);
}
