import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ReadingGuide } from "./ReadingGuide";
import Image from "next/image";
import { createPortal } from "react-dom";
import type { Record } from "@/presets/content";
import { useRecordsScrollSpace } from "@/hooks/useRecordsScrollSpace";

const ROW_CLASS =
  "grid cursor-pointer grid-cols-[9ch_1fr_auto] text-[13px] leading-relaxed tracking-[-0.0125em] text-black transition-opacity";

function RecordRow({ record, dimmed, showName }: { record: Record; dimmed: boolean; showName: boolean }) {
  const cells = (
    <>
      <span className="tabular-nums">{record.date}</span>
      <span>{showName ? (record.name ?? record.title) : record.title}</span>
      <span className="text-right opacity-[0.55]">{record.category}</span>
    </>
  );
  const className = `${ROW_CLASS} ${dimmed ? "opacity-40" : ""}`;
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
  return (
    <>
      {record.image && (
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
      )}
      {(!record.image || !loaded) && (
        <div className="flex max-h-[36dvh] w-[78vw] max-w-sm flex-col items-center justify-center gap-4 bg-neutral-100 px-8 py-10 text-center text-black md:max-h-[42.8vh] md:py-16">
          <p className="text-3xl leading-tight">{record.name ?? record.title}</p>
          {record.name && <p className="text-[13px] opacity-60">{record.title}</p>}
          <p className="text-[13px] opacity-40">
            {record.category} · {record.date}
          </p>
        </div>
      )}
    </>
  );
}

export function Records({ records, showNames }: { records: Record[]; showNames: boolean }) {
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
            showName={showNames}
          />
        ))}
      </ul>
      <ReadingGuide listRef={listRef} onActiveRowChange={setReadingIndex} />
      {(preload || active) &&
        createPortal(
          records.map((record) => (
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
