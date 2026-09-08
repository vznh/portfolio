import { useEffect, useState } from "react";
import { embossVersions } from "@/presets/emboss";
import { EmbossedGlyph, GLYPH_BOX_CLASS } from "../EmbossedGlyph";
import { EmbossDial } from "../EmbossDial";

function RandomVersionGlyph() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    setIndex(Math.floor(Math.random() * embossVersions.length));
  }, []);
  const version = embossVersions[index];
  if (!version) return <div className={GLYPH_BOX_CLASS} aria-hidden />;
  const { glyph, ...params } = version;
  return <EmbossedGlyph glyph={glyph} params={params} />;
}

export function GlyphCell() {
  if (process.env.NODE_ENV === "development") {
    return <EmbossDial />;
  }
  return <RandomVersionGlyph />;
}
