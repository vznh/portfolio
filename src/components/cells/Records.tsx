import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ReadingGuide } from "./ReadingGuide";
import Image from "next/image";
import { createPortal } from "react-dom";
import type { Record } from "@/presets/content";
import { useRecordsScrollSpace } from "@/hooks/useRecordsScrollSpace";

const ROW_CLASS =
  "grid grid-cols-[9ch_1fr_auto] text-[13px] leading-relaxed tracking-[-0.0125em] text-black transition-opacity";

function LockIcon() {
  return (
    <svg
      width="12.75"
      height="12.75"
      viewBox="0 0 15 15"
      fill="none"
      role="img"
      aria-label="Details unavailable"
    >
      <path
        d="M4.5 6.5V4.75a3 3 0 0 1 6 0V6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="2.5" y="6" width="10" height="7.5" rx="1.75" fill="currentColor" />
    </svg>
  );
}

function RecordRow({ record, dimmed }: { record: Record; dimmed: boolean }) {
  const cells = (
    <>
      <span className="tabular-nums">{record.date}</span>
      <span>{record.title}</span>
      <span className="flex items-center justify-end pl-3 opacity-[0.55]">
        {!record.url && !record.image && <LockIcon />}
      </span>
    </>
  );
  const cursorClass = record.url || record.image ? "cursor-pointer" : "cursor-not-allowed";
  const className = `${ROW_CLASS} ${cursorClass} ${dimmed ? "opacity-40" : ""}`;
  if (record.url) {
    return (
      <li>
        <a href={record.url} target="_blank" rel="noreferrer" className={className}>
          {cells}
        </a>
      </li>
    );
  }
  return <li className={className}>{cells}</li>;
}

function RecordPreview({ record }: { record: Record }) {
  const [loaded, setLoaded] = useState(false);
  if (!record.image) return null;
  return (
    <Image
      src={record.image.src}
      alt=""
      width={record.image.width}
      height={record.image.height}
      loading="eager"
      onLoad={() => setLoaded(true)}
      onError={() => setLoaded(false)}
      sizes="(max-width: 767px) 78vw, 47.5vw"
      className={`h-auto max-h-[36dvh] w-auto max-w-[78vw] object-contain md:max-h-[42.8vh] md:max-w-[47.5vw] ${loaded ? "" : "hidden"}`}
    />
  );
}

export function Records({ records }: { records: Record[] }) {
  const listRef = useRef<HTMLUListElement>(null);
  useRecordsScrollSpace(listRef);
  const [hovered, setHovered] = useState<Record | null>(null);
  const [readingIndex, setReadingIndex] = useState<number | null>(null);
  const active = readingIndex !== null ? records[readingIndex] : hovered;
  // Mount every hover image once the page is idle so hovering only toggles visibility.
  const [preload, setPreload] = useState(false);
  useEffect(() => {
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setPreload(true), { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setPreload(true), 1000);
    return () => window.clearTimeout(id);
  }, []);
  const handlePointer = (event: PointerEvent<HTMLUListElement>) => {
    if (event.pointerType !== "mouse") return;
    setPreload(true);
    const rows = Array.from(event.currentTarget.children);
    const index = rows.findIndex((row) => event.clientY < row.getBoundingClientRect().bottom);
    setHovered(records[index === -1 ? records.length - 1 : index] ?? null);
  };
  return (
    <>
      <ul
        id="work-list"
        ref={listRef}
        className="flex max-w-[52ch] cursor-pointer flex-col"
        onPointerEnter={handlePointer}
        onPointerMove={handlePointer}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") setHovered(null);
        }}
      >
        {records.map((record) => (
          <RecordRow
            key={`${record.date} ${record.title}`}
            record={record}
            dimmed={active !== null && active !== record}
          />
        ))}
      </ul>
      <ReadingGuide listRef={listRef} onActiveRowChange={setReadingIndex} />
      {(preload || active) &&
        createPortal(
          records
            .filter((record) => record.image)
            .map((record) => (
              <div
                key={`${record.date} ${record.title}`}
                aria-hidden
                className={`pointer-events-none fixed bottom-[8dvh] left-1/2 z-0 -translate-x-1/2 md:bottom-auto md:top-1/2 md:-translate-y-1/2 ${record === active ? "" : "invisible"}`}
              >
                <RecordPreview record={record} />
              </div>
            )),
          listRef.current?.closest("#content") ?? document.body,
        )}
    </>
  );
}
