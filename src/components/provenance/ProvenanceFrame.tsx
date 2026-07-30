import type { ProvenanceAccent } from "@/presets/provenance";
import { m } from "framer-motion";
import React from "react";

import { FRAME_ROWS, LINE_HEIGHT_REM } from "./constants";

export type FrameSpec = {
  key: string;
  paragraphIndex: number;
  partIndex: number;
  splitOffset: number;
  state: "open" | "closing";
};

const hostnameOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "view";
  }
};

const ProvenanceFrame = ({
  frame,
  accent,
  reducedMotion,
  onClosed,
}: {
  frame: FrameSpec;
  accent: ProvenanceAccent | null;
  reducedMotion: boolean;
  onClosed: (key: string) => void;
}) => {
  const open = frame.state === "open";
  const frameHeightRem = LINE_HEIGHT_REM * (accent?.frameRows ?? FRAME_ROWS);
  const mediaList = accent?.media
    ? Array.isArray(accent.media)
      ? accent.media
      : [accent.media]
    : [];
  const filmstripColumns = mediaList.length <= 2
    ? mediaList.length
    : Math.ceil(mediaList.length / 2);
  const filmstripRows = filmstripColumns > 0
    ? Math.ceil(mediaList.length / filmstripColumns)
    : 1;
  const frameInnerStyle = {
    height: `${frameHeightRem}rem`,
    "--provenance-filmstrip-columns": filmstripColumns,
    "--provenance-filmstrip-rows": filmstripRows,
  } as React.CSSProperties;

  return (
    <m.span
      className="provenance-frame"
      data-provenance-frame={frame.key}
      initial={{ height: 0, opacity: 0 }}
      animate={{
        height: open ? `${frameHeightRem}rem` : 0,
        opacity: open ? 1 : 0,
      }}
      transition={{
        duration: reducedMotion ? 0 : 0.55,
        ease: [0.22, 0.61, 0.36, 1],
      }}
      onAnimationComplete={() => {
        if (!open) onClosed(frame.key);
      }}
    >
      <span
        className={`provenance-frame__inner${
          mediaList.length > 1 ? " provenance-frame__inner--filmstrip" : ""
        }`}
        style={frameInnerStyle}
      >
        {mediaList.length > 0 ? (
          mediaList.map((media) =>
            media.type === "video" ? (
              <video
                key={media.src}
                className="provenance-frame__media"
                src={media.src}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={media.src}
                className="provenance-frame__media"
                src={media.src}
                alt={accent?.text ?? ""}
              />
            ),
          )
        ) : (
          <span className="provenance-frame__placeholder">
            {accent?.url ? hostnameOf(accent.url) : ""}
          </span>
        )}
      </span>
    </m.span>
  );
};

export default ProvenanceFrame;
