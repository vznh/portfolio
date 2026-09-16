import { useEffect, useState } from "react";
import { embossVersions, type EmbossVersion } from "@/presets/emboss";
import { GLYPH_BOX_CLASS } from "@/lib/glyph";
import { pickVisitGlyph } from "@/lib/glyphVisit";
import { EmbossedGlyph } from "../EmbossedGlyph";
import { EmbossDial } from "../EmbossDial";
import { useContentView } from "@/hooks/useContentView";

export function GlyphCell() {
  const contentView = useContentView();
  const [version, setVersion] = useState<EmbossVersion | null>(null);
  useEffect(() => {
    if (!embossVersions.length) return;
    let storage: Storage | undefined;
    try {
      storage = window.sessionStorage;
    } catch {
      // Browser storage is optional.
    }
    setVersion(embossVersions[pickVisitGlyph(embossVersions.length, storage)]);
  }, []);
  if (!version) return <div className={GLYPH_BOX_CLASS} aria-hidden />;
  const { glyph, ...params } = version;
  return (
    <>
      <EmbossedGlyph glyph={glyph} params={params} />
      {process.env.NODE_ENV === "development" && contentView && (
        <EmbossDial initialVersion={version} onChange={setVersion} />
      )}
    </>
  );
}
