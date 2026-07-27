"use client";

import {
  MUTED_PALETTE,
  oldestFirstStory,
  type CoolStuffAccent,
} from "@/presets/coolStuff";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const isAccent = (part: string | CoolStuffAccent): part is CoolStuffAccent =>
  typeof part !== "string";

const CoolStuffSection = () => {
  const [colors, setColors] = useState<Record<string, string>>({});

  useEffect(() => {
    const next: Record<string, string> = {};

    oldestFirstStory.flat().filter(isAccent).forEach((part) => {
      next[part.text] = MUTED_PALETTE[Math.floor(Math.random() * MUTED_PALETTE.length)];
    });

    setColors(next);
  }, []);

  return (
    <div className="space-y-4">
      {oldestFirstStory.map((paragraph, paragraphIndex) => (
        <p
          key={paragraphIndex}
          className="font-plex text-xl tracking-tight text-justify text-[var(--text-color)]"
        >
          {paragraph.map((part, partIndex) => {
            if (!isAccent(part)) {
              return (
                <span key={partIndex} className="opacity-50">
                  {part}
                </span>
              );
            }

            const color = colors[part.text] ?? "var(--text-color)";
            const accentStyle = { color, textDecorationColor: color };

            if (!part.url) {
              return (
                <span
                  key={`${part.text}-${partIndex}`}
                  className="link"
                  style={{ ...accentStyle, cursor: "not-allowed" }}
                >
                  {part.text}
                </span>
              );
            }

            return (
              <Link
                key={`${part.text}-${partIndex}`}
                href={part.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link transition-colors duration-200"
                style={accentStyle}
              >
                {part.text}
              </Link>
            );
          })}
        </p>
      ))}
    </div>
  );
};

export default CoolStuffSection;
