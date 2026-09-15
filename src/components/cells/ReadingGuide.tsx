import { useEffect, useRef, type RefObject } from "react";
import { getReadingGuide } from "@/lib/readingGuide";

export function ReadingGuide({
  listRef,
  onActiveRowChange,
}: {
  listRef: RefObject<HTMLUListElement>;
  onActiveRowChange: (index: number | null) => void;
}) {
  const guideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = listRef.current;
    const guide = guideRef.current;
    if (!section || !guide || typeof onActiveRowChange !== "function") return;

    const mobile = window.matchMedia("(max-width: 767px)");
    const viewport = window.visualViewport;
    let frame = 0;

    const update = () => {
      frame = 0;
      const firstRow = section.firstElementChild;
      if (!mobile.matches || !firstRow) {
        guide.dataset.active = "false";
        onActiveRowChange(null);
        return;
      }

      const rows = Array.from(section.children, (child) => child.getBoundingClientRect());
      const { top, height, index } = getReadingGuide(
        rows,
        viewport?.height ?? window.innerHeight,
        viewport?.offsetTop ?? 0,
      );

      guide.style.top = `${top}px`;
      guide.style.height = `${height}px`;
      guide.dataset.active = String(index !== null);
      onActiveRowChange(index);
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const observer = new ResizeObserver(schedule);
    observer.observe(section);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    viewport?.addEventListener("scroll", schedule, { passive: true });
    viewport?.addEventListener("resize", schedule);
    mobile.addEventListener("change", schedule);
    update();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      viewport?.removeEventListener("scroll", schedule);
      viewport?.removeEventListener("resize", schedule);
      mobile.removeEventListener("change", schedule);
    };
  }, [listRef, onActiveRowChange]);

  return (
    <div
      ref={guideRef}
      aria-hidden="true"
      data-active="false"
      className="pointer-events-none fixed inset-x-0 z-20 opacity-0 transition-opacity duration-200 data-[active=true]:opacity-100 motion-reduce:transition-none md:hidden"
    >
      <span className="absolute inset-x-0 top-0 h-[0.5px] bg-[#002fa7]" />
      <span className="absolute inset-x-0 top-full h-[0.5px] bg-[#002fa7]" />
    </div>
  );
}
