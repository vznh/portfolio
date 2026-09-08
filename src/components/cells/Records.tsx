import { useState } from "react";
import Image from "next/image";
import type { Record } from "@/presets/content";

const READING_LINE = false;

const ROW_CLASS =
  "grid grid-cols-[9ch_1fr_auto] text-[13px] leading-relaxed tracking-[-0.0125em] text-black transition-opacity";

function RecordRow({
  record,
  dimmed,
  onHover,
}: {
  record: Record;
  dimmed: boolean;
  onHover: (y: number) => void;
}) {
  const cells = (
    <>
      <span className="tabular-nums">{record.date}</span>
      <span>{record.title}</span>
      <span className="text-right opacity-[0.55]">{record.category}</span>
    </>
  );
  const className = `${ROW_CLASS} ${dimmed ? "opacity-40" : ""}`;
  const hover = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    onHover(r.top + r.height / 2);
  };
  if (record.url) {
    return (
      <li>
        <a href={record.url} target="_blank" rel="noreferrer" className={className} onPointerEnter={hover}>
          {cells}
        </a>
      </li>
    );
  }
  return (
    <li className={className} onPointerEnter={hover}>
      {cells}
    </li>
  );
}

export function Records({ records }: { records: Record[] }) {
  const [line, setLine] = useState<{ y: number; key: number } | null>(null);
  const [active, setActive] = useState<Record | null>(null);
  return (
    <>
      <ul
        className="flex max-w-[52ch] flex-col"
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") setActive(null);
        }}
      >
        {records.map((record) => (
          <RecordRow
            key={`${record.date} ${record.title}`}
            record={record}
            dimmed={active !== null && active !== record}
            onHover={(y) => {
              setActive(record);
              if (READING_LINE) setLine((prev) => ({ y, key: (prev?.key ?? 0) + 1 }));
            }}
          />
        ))}
      </ul>
      {active?.image && (
        <div
          aria-hidden
          className="pointer-events-none fixed left-1/2 top-1/2 z-0 hidden -translate-x-1/2 -translate-y-1/2 md:block"
        >
          <Image
            src={active.image.src}
            alt=""
            width={active.image.width}
            height={active.image.height}
            sizes="47.5vw"
            className="h-auto max-h-[42.8vh] w-auto max-w-[47.5vw] object-contain"
          />
        </div>
      )}
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
