import type { ReactNode } from "react";
import { useHeldKey } from "@/hooks/useHeldKey";

interface ColumnCells {
  content: ReactNode;

  below?: ReactNode[];
}

interface ShellProps {
  left: ColumnCells;
  middle: ReactNode;
  right: ColumnCells;
}

function Cell({ edge, className, children }: { edge: string; className?: string; children: ReactNode }) {
  return <div className={`p-6 ${className ?? ""} ${edge}`}>{children}</div>;
}

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
  const remainder = Math.max(1, below.length);
  const rows = `calc(40vh - 1.5rem) auto ${"minmax(0, 1fr) ".repeat(remainder).trim()}`;
  return (
    <aside
      className={`md:grid md:h-full md:overflow-visible ${
        side === "left" ? "md:border-r" : "md:border-l"
      } ${edge}`}
      style={{ gridTemplateRows: rows }}
    >
      <div className="hidden md:block" />
      <Cell edge={edge} className={`md:border-y ${below.length > 0 ? "pb-3 md:pb-6" : ""}`}>
        {children}
      </Cell>
      {below.length === 0 ? (
        <div className="hidden md:block" />
      ) : (
        below.map((row, i) =>
          row == null ? (
            <div key={i} className={`hidden p-6 md:block ${i < below.length - 1 ? "md:border-b" : ""} ${edge}`} />
          ) : (
            <Cell
              key={i}
              edge={edge}
              className={`${i < below.length - 1 ? "md:border-b" : ""} ${i === 0 ? "pt-0 md:pt-6" : ""}`}
            >
              {row}
            </Cell>
          ),
        )
      )}
    </aside>
  );
}

export function Shell({ left, middle, right }: ShellProps) {
  const revealed = useHeldKey("Meta", 350);

  const edge = `transition-colors duration-300 ease-out ${revealed ? "md:border-gray-200" : "md:border-transparent"}`;

  return (
    <div className="overflow-x-clip md:grid md:h-screen md:w-screen md:grid-cols-[1fr_2fr_1fr] md:overflow-hidden">
      <SideColumn side="left" edge={edge} below={left.below}>
        {left.content}
      </SideColumn>
      <main className="no-scrollbar md:h-full md:overflow-y-auto">
        <div className="p-6 md:pb-[40vh] md:pt-[40vh]">{middle}</div>
      </main>
      <SideColumn side="right" edge={edge} below={right.below}>
        {right.content}
      </SideColumn>
    </div>
  );
}
