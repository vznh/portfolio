import { useEffect, useState } from "react";
import { embossVersions } from "@/presets/emboss";
import { profile } from "@/presets/profile";
import { EmbossedGlyph } from "../EmbossedGlyph";
import { EmbossDial } from "../EmbossDial";

// Static glyph with a random calibrated version. The server renders version 0;
// the client picks at random once mounted so server and client markup match.
function RandomVersionGlyph() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    setIndex(Math.floor(Math.random() * embossVersions.length));
  }, []);
  return <EmbossedGlyph glyph={profile.glyph} params={embossVersions[index]} />;
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
