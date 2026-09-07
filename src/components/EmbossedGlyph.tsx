import { useId } from "react";
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

export function EmbossedGlyph({ glyph, params, className }: EmbossedGlyphProps) {
  const id = useId();
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
      className={`flex aspect-[4/5] w-full max-w-[280px] items-center justify-center ${className ?? ""}`}
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
      {/* 120cqw ≈ fills the 4/5 box height (100cqw = 80% of height). The box
          does not clip, so wide glyphs spill over the grid lines by design;
          the Shell root clips at the viewport so nothing scrolls. */}
      <span
        className="font-heading select-none"
        style={{ lineHeight: 1, fontSize: "120cqw", color: fill, filter: `url(#${id})` }}
      >
        {glyph}
      </span>
    </div>
  );
}
