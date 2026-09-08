import { useState } from "react";
import type { Record } from "@/presets/content";

const ROW_CLASS =
  "grid grid-cols-[auto_1fr_auto] text-[13px] leading-relaxed tracking-[-0.0125em] text-black";

function RecordRow({ record, onHover }: { record: Record; onHover: (y: number) => void }) {
  const cells = (
    <>
      <span className="tabular-nums">{record.date}</span>
      <span className="ml-[2ch]">{record.title}</span>
      <span className="text-right opacity-[0.55]">{record.category}</span>
    </>
  );
  const hover = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    onHover(r.top + r.height / 2);
  };
  if (record.url) {
    return (
      <li>
        <a href={record.url} target="_blank" rel="noreferrer" className={ROW_CLASS} onPointerEnter={hover}>
          {cells}
        </a>
      </li>
    );
  }
  return (
    <li className={ROW_CLASS} onPointerEnter={hover}>
      {cells}
    </li>
  );
}

export function Records({ records }: { records: Record[] }) {
  const [line, setLine] = useState<{ y: number; key: number } | null>(null);
  return (
    <>
      <ul className="flex max-w-[52ch] flex-col">
        {records.map((record) => (
          <RecordRow
            key={`${record.date} ${record.title}`}
            record={record}
            onHover={(y) => setLine((prev) => ({ y, key: (prev?.key ?? 0) + 1 }))}
          />
        ))}
      </ul>
      {line && (
        <div
          key={line.key}
          aria-hidden
          className="pointer-events-none fixed left-[25%] h-px w-[50%] animate-reading-line bg-[#002fa7] md:left-[6.25vw] md:w-[75vw]"
          style={{ top: line.y }}
          onAnimationEnd={() => setLine(null)}
        />
      )}
    </>
  );
}
