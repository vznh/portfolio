import type { ReactNode } from "react";

interface ShellProps {
  left: ReactNode;
  middle: ReactNode;
  right: ReactNode;
}

/**
 * Three-panel shell.
 *
 * Desktop (md+): fixed viewport, 3-column grid [narrow | wide | narrow].
 * Only the middle panel scrolls (hidden scrollbar, contained overscroll).
 *
 * Desktop side columns and middle content start 40vh from the top
 * (slightly above center); the middle column's inner wrapper carries
 * matching 40vh top/bottom padding so its scrollable area spans the
 * full column height. Mobile: single column in document flow, normal
 * page scrolling, order left -> middle -> right.
 */
export function Shell({ left, middle, right }: ShellProps) {
  return (
    <div className="md:grid md:h-screen md:w-screen md:grid-cols-[1fr_2fr_1fr] md:overflow-hidden">
      <aside className="p-6 md:h-full md:overflow-hidden md:pt-[40vh]">{left}</aside>
      <main className="no-scrollbar md:h-full md:overflow-y-auto">
        <div className="p-6 md:pb-[40vh] md:pt-[40vh]">{middle}</div>
      </main>
      <aside className="p-6 md:h-full md:overflow-hidden md:pt-[40vh]">{right}</aside>
    </div>
  );
}
