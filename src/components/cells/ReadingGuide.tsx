import { useEffect, useRef, type RefObject } from "react";

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
    let frame = 0;

    const update = () => {
      frame = 0;
      const firstRow = section.firstElementChild;
      if (!mobile.matches || !firstRow) {
        guide.dataset.active = "false";
        onActiveRowChange(null);
        return;
      }

      const bounds = section.getBoundingClientRect();
      const y = window.innerHeight * 0.25;
      const inZone = bounds.top <= y && bounds.bottom > y;
      const rows = Array.from(section.children, (child) => child.getBoundingClientRect());
      const nextIndex = rows.findIndex((rect) => rect.bottom > y);
      const index = nextIndex === -1 ? rows.length - 1 : nextIndex;
      const rowHeight = rows[index].height;

      guide.style.top = `${y}px`;
      guide.style.height = `${rowHeight}px`;
      guide.dataset.active = String(inZone);
      onActiveRowChange(inZone ? index : null);
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const observer = new ResizeObserver(schedule);
    observer.observe(section);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    mobile.addEventListener("change", schedule);
    update();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
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
