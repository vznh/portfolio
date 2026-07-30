import type { ProvenanceAccent } from "@/presets/provenance";
import { m } from "framer-motion";
import Image from "next/image";
import React from "react";

import { FRAME_ROWS, LINE_HEIGHT_REM } from "./constants";

export type FrameSpec = {
  key: string;
  paragraphIndex: number;
  partIndex: number;
  splitOffset: number;
  state: "open" | "closing";
};

const IMAGE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "/images/provenance/business-card-opennode.png": { width: 1612, height: 998 },
  "/images/provenance/campus-map-laptop.jpg": { width: 376, height: 360 },
  "/images/provenance/campus-map-phone.jpg": { width: 376, height: 360 },
  "/images/provenance/cowork-baskin.png": { width: 360, height: 360 },
  "/images/provenance/cowork-hacknight.png": { width: 360, height: 360 },
  "/images/provenance/cowork-mchenry-1.png": { width: 360, height: 360 },
  "/images/provenance/cowork-mchenry-2.png": { width: 360, height: 360 },
  "/images/provenance/devour-components.gif": { width: 800, height: 318 },
  "/images/provenance/healthclub-footer.jpg": { width: 433, height: 360 },
  "/images/provenance/healthclub-hero.jpg": { width: 433, height: 360 },
  "/images/provenance/healthclub-letter.jpg": { width: 433, height: 360 },
  "/images/provenance/healthclub-mission.jpg": { width: 433, height: 360 },
  "/images/provenance/jukebox.jpg": { width: 700, height: 525 },
  "/images/provenance/madyolks.jpg": { width: 750, height: 360 },
  "/images/provenance/old-portfolio.jpg": { width: 758, height: 360 },
  "/images/provenance/performativeness-test.png": { width: 900, height: 438 },
  "/images/provenance/polyglot-logos.png": { width: 554, height: 360 },
  "/images/provenance/polyglot-stanford.jpg": { width: 482, height: 360 },
  "/images/provenance/polyglot-team.jpg": { width: 546, height: 360 },
  "/images/provenance/polyglot-wireframe-1.png": { width: 278, height: 360 },
  "/images/provenance/polyglot-wireframe-2.png": { width: 277, height: 360 },
  "/images/provenance/roblox-hack.png": { width: 480, height: 479 },
  "/images/provenance/splat.png": { width: 900, height: 358 },
  "/images/provenance/spotify-overlap.jpg": { width: 900, height: 612 },
  "/images/provenance/spotify-ui-mockup.jpg": { width: 900, height: 555 },
  "/images/provenance/steam-vac-ban.png": { width: 472, height: 196 },
  "/images/provenance/tokn.png": { width: 500, height: 500 },
  "/images/provenance/transmute-metadata.png": { width: 1152, height: 976 },
  "/images/provenance/transmute-terminal.png": { width: 904, height: 334 },
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
  const [expanded, setExpanded] = React.useState(false);
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

  React.useEffect(() => {
    if (!open) {
      setExpanded(false);
      return;
    }

    // Commit the collapsed frame first so Motion can measure both layouts.
    const animationFrame = window.requestAnimationFrame(() => setExpanded(true));
    return () => window.cancelAnimationFrame(animationFrame);
  }, [open]);

  const frameStyle = {
    height: expanded ? `${frameHeightRem}rem` : 0,
    "--provenance-filmstrip-columns": filmstripColumns,
    "--provenance-filmstrip-rows": filmstripRows,
  } as React.CSSProperties;

  return (
    <m.span
      layout
      className="provenance-frame"
      data-provenance-frame={frame.key}
      style={frameStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: expanded ? 1 : 0 }}
      transition={{
        duration: reducedMotion ? 0 : 0.55,
        ease: [0.22, 0.61, 0.36, 1],
        layout: {
          duration: reducedMotion ? 0 : 0.55,
          ease: [0.22, 0.61, 0.36, 1],
        },
      }}
      onAnimationComplete={() => {
        if (!open && !expanded) onClosed(frame.key);
      }}
    >
      <m.span
        layout
        className={`provenance-frame__inner${
          mediaList.length > 1 ? " provenance-frame__inner--filmstrip" : ""
        }`}
        style={{ height: `${frameHeightRem}rem` }}
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
              <Image
                key={media.src}
                className="provenance-frame__media"
                src={media.src}
                alt={accent?.text ?? ""}
                width={IMAGE_DIMENSIONS[media.src]?.width ?? 1200}
                height={IMAGE_DIMENSIONS[media.src]?.height ?? 675}
                sizes="(max-width: 767px) 90vw, 55vw"
              />
            ),
          )
        ) : (
          <span className="provenance-frame__placeholder">
            {accent?.url ? hostnameOf(accent.url) : ""}
          </span>
        )}
      </m.span>
    </m.span>
  );
};

export default ProvenanceFrame;
