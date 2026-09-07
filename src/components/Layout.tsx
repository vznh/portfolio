import type { ReactNode } from "react";
import { useHeldKey } from "@/hooks/useHeldKey";

interface ShellProps {
  left: ReactNode;
  // Rows under the left content row; together they fill the remaining viewport
  // height in equal parts. Each row's bottom edge is part of the grid reveal.
  leftBelow?: ReactNode[];
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
 *
 * Easter egg: holding Cmd for 350ms reveals the grid: the column edges plus
 * the top and bottom of each side column's content row. Fades out on release.
 */
function SideColumn({
  side,
  edge,
  below = [],
  children,
}: {
  side: "left" | "right";
  edge: string;
  below?: ReactNode[];
  children: ReactNode;
}) {
  // Desktop: rows [spacer | content | remainder...]. The content row has 24px
  // padding on every side and its top edge sits 24px above 40vh, so the
  // content itself still starts at exactly 40vh, level with the middle column.
  // The remainder is one row, or split equally across `below` rows. Row edges
  // are part of the grid reveal. Mobile: plain padded blocks in flow.
  const remainder = Math.max(1, below.length);
  const rows = `calc(40vh - 1.5rem) auto ${"1fr ".repeat(remainder).trim()}`;
  return (
    <aside
      className={`md:grid md:h-full md:overflow-visible ${
        side === "left" ? "md:border-r" : "md:border-l"
      } ${edge}`}
      style={{ gridTemplateRows: rows }}
    >
      <div className="hidden md:block" />
      <div className={`p-6 md:border-y ${edge}`}>{children}</div>
      {below.length === 0 ? (
        <div className="hidden md:block" />
      ) : (
        below.map((row, i) => (
          <div
            key={i}
            className={`p-6 ${i < below.length - 1 ? "md:border-b" : ""} ${edge}`}
          >
            {row}
          </div>
        ))
      )}
    </aside>
  );
}

export function Shell({ left, leftBelow, middle, right }: ShellProps) {
  const revealed = useHeldKey("Meta", 350);
  // Borders are always present (transparent) so revealing them never shifts layout.
  const edge = `transition-colors duration-300 ease-out ${revealed ? "md:border-gray-200" : "md:border-transparent"}`;

  return (
    <div className="overflow-x-clip md:grid md:h-screen md:w-screen md:grid-cols-[1fr_2fr_1fr] md:overflow-hidden">
      <SideColumn side="left" edge={edge} below={leftBelow}>
        {left}
      </SideColumn>
      <main className="no-scrollbar md:h-full md:overflow-y-auto">
        <div className="p-6 md:pb-[40vh] md:pt-[40vh]">{middle}</div>
      </main>
      <SideColumn side="right" edge={edge}>
        {right}
      </SideColumn>
    </div>
  );
}
