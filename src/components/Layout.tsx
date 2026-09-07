import type { ReactNode } from "react";
import { useHeldKey } from "@/hooks/useHeldKey";

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
 *
 * Easter egg: holding Cmd for 350ms reveals the grid: the column edges plus
 * the top and bottom of each side column's content row. Fades out on release.
 */
function SideColumn({
  side,
  edge,
  children,
}: {
  side: "left" | "right";
  edge: string;
  children: ReactNode;
}) {
  // Desktop: three rows [40vh spacer | content | remainder]. The content row is
  // the column's dedicated space; its top and bottom edges are part of the grid
  // reveal. Mobile: plain padded block.
  return (
    <aside
      className={`md:grid md:h-full md:grid-rows-[40vh_auto_1fr] md:overflow-hidden ${
        side === "left" ? "md:border-r" : "md:border-l"
      } ${edge}`}
    >
      <div className="hidden md:block" />
      <div className={`p-6 md:border-y md:pt-0 ${edge}`}>{children}</div>
      <div className="hidden md:block" />
    </aside>
  );
}

export function Shell({ left, middle, right }: ShellProps) {
  const revealed = useHeldKey("Meta", 350);
  // Borders are always present (transparent) so revealing them never shifts layout.
  const edge = `transition-colors duration-300 ease-out ${revealed ? "md:border-gray-200" : "md:border-transparent"}`;

  return (
    <div className="md:grid md:h-screen md:w-screen md:grid-cols-[1fr_2fr_1fr] md:overflow-hidden">
      <SideColumn side="left" edge={edge}>
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
