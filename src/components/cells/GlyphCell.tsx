import { useEffect, useState } from "react";
import { embossVersions } from "@/presets/emboss";
import { EmbossedGlyph, GLYPH_BOX_CLASS } from "../EmbossedGlyph";
import { EmbossDial } from "../EmbossDial";

// Static glyph from a random saved version. The server renders version 0;
// the client picks at random once mounted so server and client markup match.
// With no versions the allotted box renders blank.
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

// Left column cell: chooser between the static glyph and the dev-only DialKit calibration panel.
export function GlyphCell() {
  // Dev-only DialKit panel. In production builds NODE_ENV is folded to
  // "production" and this branch (and its dialkit dependency) is eliminated.
  if (process.env.NODE_ENV === "development") {
    return <EmbossDial />;
  }
  return <RandomVersionGlyph />;
}
