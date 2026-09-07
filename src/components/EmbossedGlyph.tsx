import { useEffect, useId, useState } from "react";
import type { EmbossParams } from "@/presets/emboss";

interface EmbossedGlyphProps {
  glyph: string;
  params: EmbossParams;
  className?: string;
}

// Photoshop measures the global light angle counter-clockwise with 0° = right
// and 90° = light from above. SVG's feDistantLight azimuth is measured
// clockwise from +x in screen space (y points down). Negating maps one onto
// the other: A=90 (light from top) → azimuth 270°, so top edges catch light.
function toAzimuth(angle: number): number {
  return (((360 - angle) % 360) + 360) % 360;
}

// The glyph's allotted space; shared with the blank fallback so the rows below
// never move whether or not a candidate exists.
export const GLYPH_BOX_CLASS =
  "relative aspect-[4/5] w-full max-w-[280px] md:h-[min(350px,calc(60vh+1.5rem-15rem))] md:w-auto";

const HEADING_FONT = '"ABC Schengen A"';
// Measurement size in SVG user units; the viewBox rescales to the box anyway.
const EM = 100;

// A glyph value is either a single character or a path to an SVG under
// /public (e.g. "/assets/mark.svg"), which is embossed as a filled shape.
export function isSvgSource(glyph: string) {
  return glyph.startsWith("/") && glyph.toLowerCase().endsWith(".svg");
}

// Ink bounds of a text `glyph` (not font metrics), measured via canvas so any
// character, letter or symbol, can be pinned to the top-left of its box.
// SVG sources are not measured; their own viewBox decides.
function useInkBox(glyph: string) {
  const [box, setBox] = useState<string | null>(null);
  useEffect(() => {
    if (isSvgSource(glyph)) return;
    let cancelled = false;
    const measure = () => {
      const ctx = document.createElement("canvas").getContext("2d");
      if (!ctx) return;
      ctx.font = `${EM}px ${HEADING_FONT}`;
      const m = ctx.measureText(glyph);
      const w = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
      const h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
      if (!cancelled && w > 0 && h > 0) {
        // Text baseline sits at y = EM; the box starts at the ink's top edge.
        setBox(`${-m.actualBoundingBoxLeft} ${EM - m.actualBoundingBoxAscent} ${w} ${h}`);
      }
    };
    document.fonts.load(`${EM}px ${HEADING_FONT}`).then(measure, measure);
    return () => {
      cancelled = true;
    };
  }, [glyph]);
  return box;
}

export function EmbossedGlyph({ glyph, params, className }: EmbossedGlyphProps) {
  const id = useId();
  const inkBox = useInkBox(glyph);
  const { style, technique, depth, direction, size, soften, angle, altitude, highlight, shadow, fill } = params;

  // a. Height map — "Technique": how steep the bump-map edge is. Chisel
  //    techniques use a much sharper (less blurred) height field.
  const blur =
    technique === "smooth" ? size : technique === "chisel-soft" ? size * 0.35 : Math.max(0.01, size * 0.1);

  // b. Lighting — "Depth" scales the perceived height; "Direction: Down"
  //    inverts the relief by negating the surface scale.
  const surfaceScale = (depth / 100) * size * (direction === "up" ? 1 : -1);
  const azimuth = toAzimuth(angle);

  // c. "Highlight Mode"/"Shadow Mode". A flat surface lights to exactly
  //    sin(altitude) (N·L with N straight up), so that value is the neutral
  //    point: brighter than it is highlight, darker is shadow. Each mask is
  //    normalized so it runs 0 at the neutral point to 1 at full white/black.
  const flat = Math.min(0.999, Math.max(0.001, Math.sin((altitude * Math.PI) / 180)));
  const lightSplit = (light: string, prefix: string) => (
    <>
      <feColorMatrix in={light} type="luminanceToAlpha" result={`${prefix}-lum`} />
      <feComponentTransfer in={`${prefix}-lum`} result={`${prefix}-hl-mask`}>
        {/* alpha = clamp((lum - flat) / (1 - flat)) */}
        <feFuncA type="linear" slope={1 / (1 - flat)} intercept={-flat / (1 - flat)} />
      </feComponentTransfer>
      <feComponentTransfer in={`${prefix}-lum`} result={`${prefix}-sh-mask`}>
        {/* alpha = clamp((flat - lum) / flat) */}
        <feFuncA type="linear" slope={-1 / flat} intercept={1} />
      </feComponentTransfer>
      <feFlood floodColor={highlight.color} floodOpacity={highlight.opacity} result={`${prefix}-hl-fill`} />
      <feComposite in={`${prefix}-hl-fill`} in2={`${prefix}-hl-mask`} operator="in" result={`${prefix}-hl`} />
      <feFlood floodColor={shadow.color} floodOpacity={shadow.opacity} result={`${prefix}-sh-fill`} />
      <feComposite in={`${prefix}-sh-fill`} in2={`${prefix}-sh-mask`} operator="in" result={`${prefix}-sh`} />
    </>
  );

  // d. Style — decides which side of the shape's silhouette receives the bevel.
  //    'emboss' keeps the raw layers (no clipping around SourceAlpha); the
  //    clipped styles produce "shadow"/"highlight" results instead.
  const needsFlipped = style === "pillow-emboss";
  const clipped = style === "inner-bevel" || style === "outer-bevel" || needsFlipped;
  const shadowSource = clipped ? "shadow" : "n-sh";
  const highlightSource = clipped ? "highlight" : "n-hl";

  return (
    <div
      // The box is the glyph's allotted space: fixed by viewport math, never by
      // the glyph itself, so swapping the character cannot shift the rows below.
      // Desktop: it gives up height on short viewports so the two rows under it
      // always keep at least 6rem each (60vh + 1.5rem remain under the 40vh
      // line; minus 2 x 6rem rows and 3rem of cell padding). Width follows the
      // 4/5 aspect. Mobile: full width, height from the aspect.
      className={`${GLYPH_BOX_CLASS} ${className ?? ""}`}
      style={{ containerType: "inline-size" }}
    >
      <svg width={0} height={0} aria-hidden style={{ position: "absolute" }}>
        <defs>
          <filter
            id={id}
            colorInterpolationFilters="sRGB"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            {/* a. Height map — blur of the alpha channel forms the bump map. */}
            <feGaussianBlur in="SourceAlpha" stdDeviation={blur} result="height" />

            {/* b. Lighting — "Angle" and "Altitude" via a distant light. */}
            <feDiffuseLighting
              in="height"
              surfaceScale={surfaceScale}
              lightingColor="#ffffff"
              result="light"
            >
              <feDistantLight azimuth={azimuth} elevation={altitude} />
            </feDiffuseLighting>
            {needsFlipped && (
              // pillow-emboss inner pass uses the light flipped 180°.
              <feDiffuseLighting
                in="height"
                surfaceScale={surfaceScale}
                lightingColor="#ffffff"
                result="light-flipped"
              >
                <feDistantLight azimuth={(azimuth + 180) % 360} elevation={altitude} />
              </feDiffuseLighting>
            )}

            {/* c. Highlight/shadow split. "n" = normal light, "f" = flipped. */}
            {lightSplit("light", "n")}
            {needsFlipped && lightSplit("light-flipped", "f")}

            {/* d. Style — clip the bevel layers to the right silhouette side. */}
            {style === "inner-bevel" && (
              <>
                <feComposite in="n-sh" in2="SourceAlpha" operator="in" result="shadow" />
                <feComposite in="n-hl" in2="SourceAlpha" operator="in" result="highlight" />
              </>
            )}
            {style === "outer-bevel" && (
              <>
                <feComposite in="n-sh" in2="SourceAlpha" operator="out" result="shadow" />
                <feComposite in="n-hl" in2="SourceAlpha" operator="out" result="highlight" />
              </>
            )}
            {needsFlipped && (
              <>
                {/* inside: flipped light, clipped in; outside: normal light, clipped out */}
                <feComposite in="f-sh" in2="SourceAlpha" operator="in" result="f-sh-in" />
                <feComposite in="f-hl" in2="SourceAlpha" operator="in" result="f-hl-in" />
                <feComposite in="n-sh" in2="SourceAlpha" operator="out" result="n-sh-out" />
                <feComposite in="n-hl" in2="SourceAlpha" operator="out" result="n-hl-out" />
                <feMerge result="shadow">
                  <feMergeNode in="f-sh-in" />
                  <feMergeNode in="n-sh-out" />
                </feMerge>
                <feMerge result="highlight">
                  <feMergeNode in="f-hl-in" />
                  <feMergeNode in="n-hl-out" />
                </feMerge>
              </>
            )}

            {/* e. Soften — blurs only the bevel layers, never the glyph itself. */}
            {soften > 0 && (
              <>
                <feGaussianBlur in={shadowSource} stdDeviation={soften} result="shadow-soft" />
                <feGaussianBlur in={highlightSource} stdDeviation={soften} result="highlight-soft" />
              </>
            )}

            {/* Final composite: fill first, then shadow, then highlight on top. */}
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in={soften > 0 ? "shadow-soft" : shadowSource} />
              <feMergeNode in={soften > 0 ? "highlight-soft" : highlightSource} />
            </feMerge>
          </filter>
        </defs>
      </svg>
      {isSvgSource(glyph) ? (
        /* SVG source: the file is a mask over a fill-colored box, so the same
           fill/emboss semantics apply as for text. The filter sits on the
           parent because CSS applies filter before mask on a single element,
           which would emboss the box's rectangle instead of the shape.
           Contained and anchored top-left like the text glyph. */
        <div className="absolute inset-0" style={{ filter: `url(#${id})` }} role="img" aria-label="">
          <div
            className="h-full w-full"
            style={{
              backgroundColor: fill,
              maskImage: `url(${glyph})`,
              maskSize: "contain",
              maskPosition: "top left",
              maskRepeat: "no-repeat",
              WebkitMaskImage: `url(${glyph})`,
              WebkitMaskSize: "contain",
              WebkitMaskPosition: "top left",
              WebkitMaskRepeat: "no-repeat",
            }}
          />
        </div>
      ) : (
        /* Text glyph: SVG text whose viewBox is its own ink bounds, so its top
           edge always meets the box's top edge and it scales to fit the box
           (xMinYMin: top-left aligned). Hidden until measured to avoid a jump. */
        <svg
          className="absolute inset-0 h-full w-full select-none"
          viewBox={inkBox ?? `0 0 ${EM} ${EM}`}
          preserveAspectRatio="xMinYMin meet"
          style={{ filter: `url(#${id})`, opacity: inkBox ? 1 : 0 }}
          aria-label={glyph}
          role="img"
        >
          <text x={0} y={EM} fontSize={EM} fill={fill} className="font-heading">
            {glyph}
          </text>
        </svg>
      )}
    </div>
  );
}
