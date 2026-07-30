import {
  oldestFirstStory,
  type ProvenanceAccent,
  type ProvenanceStoryPart,
} from "@/presets/provenance";
import { m } from "framer-motion";
import Link from "next/link";
import React from "react";

import ProvenanceFrame, { type FrameSpec } from "./ProvenanceFrame";

const isAccent = (
  part: string | ProvenanceAccent,
): part is ProvenanceAccent => typeof part !== "string";

const accentKeyOf = (paragraphIndex: number, partIndex: number) =>
  `${paragraphIndex}:${partIndex}`;

const renderRange = ({
  paragraph,
  paragraphIndex,
  from,
  to,
  activeKey,
  colors,
}: {
  paragraph: ProvenanceStoryPart[];
  paragraphIndex: number;
  from: number;
  to: number;
  activeKey: string | null;
  colors: Record<string, string>;
}) => {
  const elements: React.ReactNode[] = [];
  let cursor = 0;

  paragraph.forEach((part, partIndex) => {
    const text = isAccent(part) ? part.text : part;
    const start = cursor;
    const end = cursor + text.length;
    cursor = end;
    if (end <= from || start >= to) return;

    const slice = text.slice(
      Math.max(start, from) - start,
      Math.min(end, to) - start,
    );
    if (!slice) return;
    const key = `${partIndex}-${Math.max(start, from)}`;

    if (!isAccent(part)) {
      elements.push(
        <span key={key} className="opacity-50">
          {slice}
        </span>,
      );
      return;
    }

    const accentKey = accentKeyOf(paragraphIndex, partIndex);
    const isActive = activeKey === accentKey;
    const color = isActive
      ? colors[part.text] ?? "var(--text-color)"
      : "var(--text-color)";
    const accentStyle = {
      color,
      textDecorationColor: isActive ? color : "transparent",
    };
    const accentClassName = `link provenance-accent${
      isActive ? " provenance-accent--active" : ""
    }`;

    if (!part.url) {
      elements.push(
        <span
          key={key}
          data-accent-key={accentKey}
          className={accentClassName}
          style={{ ...accentStyle, cursor: "not-allowed" }}
        >
          {slice}
        </span>,
      );
      return;
    }

    elements.push(
      <Link
        key={key}
        data-accent-key={accentKey}
        href={part.url}
        target="_blank"
        rel="noopener noreferrer"
        className={accentClassName}
        style={accentStyle}
      >
        {slice}
      </Link>,
    );
  });

  return elements;
};

const ProvenanceStory = ({
  story,
  frames,
  activeKey,
  colors,
  reducedMotion,
  onFrameClosed,
}: {
  story: ProvenanceStoryPart[][];
  frames: FrameSpec[];
  activeKey: string | null;
  colors: Record<string, string>;
  reducedMotion: boolean;
  onFrameClosed: (key: string) => void;
}) => {
  const paragraphClassName =
    "font-plex text-xl leading-7 tracking-tight text-justify text-[var(--text-color)]";

  return story.map((paragraph, paragraphIndex) => {
    const paragraphFrames: FrameSpec[] = [];
    for (const frame of frames) {
      if (frame.paragraphIndex === paragraphIndex) {
        paragraphFrames.push(frame);
      }
    }
    paragraphFrames.sort(
      (left, right) => left.splitOffset - right.splitOffset,
    );

    if (paragraphFrames.length === 0) {
      return (
        <m.p
          layout
          key={paragraphIndex}
          data-provenance-paragraph={paragraphIndex}
          className={paragraphClassName}
        >
          {renderRange({
            paragraph,
            paragraphIndex,
            from: 0,
            to: Number.POSITIVE_INFINITY,
            activeKey,
            colors,
          })}
        </m.p>
      );
    }

    const totalLength = paragraph.reduce(
      (sum, part) => sum + (isAccent(part) ? part.text : part).length,
      0,
    );
    const chunks: React.ReactNode[] = [];
    let from = 0;

    for (const frame of paragraphFrames) {
      if (frame.splitOffset > from) {
        chunks.push(
          <m.span
            layout
            key={`segment-${from}`}
            style={{
              display: "block",
              textAlignLast:
                frame.splitOffset < totalLength ? "justify" : undefined,
            }}
          >
            {renderRange({
              paragraph,
              paragraphIndex,
              from,
              to: frame.splitOffset,
              activeKey,
              colors,
            })}
          </m.span>,
        );
      }
      const accent = oldestFirstStory[paragraphIndex]?.[frame.partIndex];
      chunks.push(
        <ProvenanceFrame
          key={frame.key}
          frame={frame}
          accent={accent && isAccent(accent) ? accent : null}
          reducedMotion={reducedMotion}
          onClosed={onFrameClosed}
        />,
      );
      from = Math.max(from, frame.splitOffset);
    }

    if (from < totalLength) {
      chunks.push(
        <m.span
          layout
          key={`segment-${from}`}
          style={{ display: "block" }}
        >
          {renderRange({
            paragraph,
            paragraphIndex,
            from,
            to: Number.POSITIVE_INFINITY,
            activeKey,
            colors,
          })}
        </m.span>,
      );
    }

    return (
      <m.p
        layout
        key={paragraphIndex}
        data-provenance-paragraph={paragraphIndex}
        className={paragraphClassName}
      >
        {chunks}
      </m.p>
    );
  });
};

export default ProvenanceStory;
