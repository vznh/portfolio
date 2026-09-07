import { embossDefaults } from "@/presets/emboss";
import { profile } from "@/presets/profile";
import { EmbossedGlyph } from "../EmbossedGlyph";
import { EmbossDial } from "../EmbossDial";

// Left column cell: chooser between the static glyph and the dev-only DialKit calibration panel.
export function GlyphCell() {
  // Dev-only DialKit panel. In production builds NODE_ENV is folded to
  // "production" and this branch (and its dialkit dependency) is eliminated.
  if (process.env.NODE_ENV === "development") {
    return <EmbossDial />;
  }
  return <EmbossedGlyph glyph={profile.glyph} params={embossDefaults} />;
}
