import { useRef, useState } from "react";
import { ReadingGuide } from "./ReadingGuide";
import Image from "next/image";
import { createPortal } from "react-dom";
import type { Record } from "@/presets/content";
import { useRecordsScrollSpace } from "@/hooks/useRecordsScrollSpace";

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
        <a
          href={record.url}
          target="_blank"
          rel="noreferrer"
          className={`${className} cursor-pointer`}
          onPointerEnter={hover}
        >
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
  const listRef = useRef<HTMLUListElement>(null);
  useRecordsScrollSpace(listRef);
  const [line, setLine] = useState<{ y: number; key: number } | null>(null);
  const [hovered, setHovered] = useState<Record | null>(null);
  const [readingIndex, setReadingIndex] = useState<number | null>(null);
  const active = readingIndex !== null ? records[readingIndex] : hovered;
  return (
    <>
      <ul
        ref={listRef}
        className="flex max-w-[52ch] flex-col"
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") setHovered(null);
        }}
      >
        {records.map((record) => (
          <RecordRow
            key={`${record.date} ${record.title}`}
            record={record}
            dimmed={active !== null && active !== record}
            onHover={(y) => {
              setHovered(record);
              if (READING_LINE) setLine((prev) => ({ y, key: (prev?.key ?? 0) + 1 }));
            }}
          />
        ))}
      </ul>
      <ReadingGuide listRef={listRef} onActiveRowChange={setReadingIndex} />
      {active?.image &&
        createPortal(
          <div
            aria-hidden
            className="pointer-events-none fixed bottom-[8dvh] left-1/2 z-0 -translate-x-1/2 md:bottom-auto md:top-1/2 md:-translate-y-1/2"
          >
            <Image
              src={active.image.src}
              alt=""
              width={active.image.width}
              height={active.image.height}
              sizes="(max-width: 767px) 78vw, 47.5vw"
              className="h-auto max-h-[36dvh] w-auto max-w-[78vw] object-contain md:max-h-[42.8vh] md:max-w-[47.5vw]"
            />
          </div>,
          document.body,
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
