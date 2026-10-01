import { useEffect, useRef, useState } from "react";
import { ReadingGuide } from "./ReadingGuide";
import Image from "next/image";
import { createPortal } from "react-dom";
import type { Record } from "@/presets/content";
import { useRecordsScrollSpace } from "@/hooks/useRecordsScrollSpace";

const ROW_CLASS =
  "grid grid-cols-[9ch_1fr_auto] text-[13px] leading-relaxed tracking-[-0.0125em] text-black transition-opacity";

function RecordRow({
  record,
  dimmed,
  showName,
  onHover,
}: {
  record: Record;
  dimmed: boolean;
  showName: boolean;
  onHover: () => void;
}) {
  const cells = (
    <>
      <span className="tabular-nums">{record.date}</span>
      <span>{showName ? (record.name ?? record.title) : record.title}</span>
      <span className="text-right opacity-[0.55]">{record.category}</span>
    </>
  );
  const className = `${ROW_CLASS} ${dimmed ? "opacity-40" : ""}`;
  const hover = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    onHover();
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
  const imaged = records.flatMap((record) => (record.image ? [{ record, image: record.image }] : []));
  return (
    <>
      <ul
        ref={listRef}
        className="flex max-w-[52ch] flex-col"
        onPointerEnter={() => setPreload(true)}
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
            onHover={() => setHovered(record)}
          />
        ))}
      </ul>
      <ReadingGuide listRef={listRef} onActiveRowChange={setReadingIndex} />
      {(preload || active?.image) &&
        createPortal(
          imaged.map(({ record, image }) => (
            <div
              key={image.src}
              aria-hidden
              className={`pointer-events-none fixed bottom-[8dvh] left-1/2 z-0 -translate-x-1/2 md:bottom-auto md:top-1/2 md:-translate-y-1/2 ${record === active ? "" : "invisible"}`}
            >
              <Image
                src={image.src}
                alt=""
                width={image.width}
                height={image.height}
                loading="eager"
                sizes="(max-width: 767px) 78vw, 47.5vw"
                className="h-auto max-h-[36dvh] w-auto max-w-[78vw] object-contain md:max-h-[42.8vh] md:max-w-[47.5vw]"
              />
            </div>
          )),
          listRef.current?.closest("#content") ?? document.body,
        )}
    </>
  );
}
