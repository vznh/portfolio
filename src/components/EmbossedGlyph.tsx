import { useEffect, useId, useRef, useState } from "react";
import type { EmbossParams } from "@/presets/emboss";

interface EmbossedGlyphProps {
  glyph: string;
  params: EmbossParams;
  className?: string;
}

function toAzimuth(angle: number): number {
  return (((360 - angle) % 360) + 360) % 360;
}

export const GLYPH_BOX_CLASS =
  "relative aspect-[4/5] w-full max-w-[32px] md:h-[min(350px,calc(60vh+1.5rem-15rem))] md:w-auto md:max-w-[280px]";

const HEADING_FONT = '"ABC Schengen A"';

const EM = 100;

export function isSvgSource(glyph: string) {
  return glyph.startsWith("/") && glyph.toLowerCase().endsWith(".svg");
}

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

const CALIBRATION_WIDTH = 280;

function useBoxScale() {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(el.getBoundingClientRect().width / CALIBRATION_WIDTH);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, scale };
}

export function EmbossedGlyph({ glyph, params, className }: EmbossedGlyphProps) {
  const id = useId();
  const inkBox = useInkBox(glyph);
  const { ref, scale } = useBoxScale();
  const { style, technique, depth, direction, angle, altitude, highlight, shadow, fill } = params;
  const size = params.size * scale;
  const soften = params.soften * scale;

  const blur =
    technique === "smooth" ? size : technique === "chisel-soft" ? size * 0.35 : Math.max(0.01, size * 0.1);

  const surfaceScale = (depth / 100) * size * (direction === "up" ? 1 : -1);
  const azimuth = toAzimuth(angle);

  const flat = Math.min(0.999, Math.max(0.001, Math.sin((altitude * Math.PI) / 180)));
  const lightSplit = (light: string, prefix: string) => (
    <>
      <feColorMatrix in={light} type="luminanceToAlpha" result={`${prefix}-lum`} />
      <feComponentTransfer in={`${prefix}-lum`} result={`${prefix}-hl-mask`}>

        <feFuncA type="linear" slope={1 / (1 - flat)} intercept={-flat / (1 - flat)} />
      </feComponentTransfer>
      <feComponentTransfer in={`${prefix}-lum`} result={`${prefix}-sh-mask`}>

        <feFuncA type="linear" slope={-1 / flat} intercept={1} />
      </feComponentTransfer>
      <feFlood floodColor={highlight.color} floodOpacity={highlight.opacity} result={`${prefix}-hl-fill`} />
      <feComposite in={`${prefix}-hl-fill`} in2={`${prefix}-hl-mask`} operator="in" result={`${prefix}-hl`} />
      <feFlood floodColor={shadow.color} floodOpacity={shadow.opacity} result={`${prefix}-sh-fill`} />
      <feComposite in={`${prefix}-sh-fill`} in2={`${prefix}-sh-mask`} operator="in" result={`${prefix}-sh`} />
    </>
  );

  const needsFlipped = style === "pillow-emboss";
  const clipped = style === "inner-bevel" || style === "outer-bevel" || needsFlipped;
  const shadowSource = clipped ? "shadow" : "n-sh";
  const highlightSource = clipped ? "highlight" : "n-hl";

  return (
    <div
      ref={ref}
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

            <feGaussianBlur in="SourceAlpha" stdDeviation={blur} result="height" />

            <feDiffuseLighting
              in="height"
              surfaceScale={surfaceScale}
              lightingColor="#ffffff"
              result="light"
            >
              <feDistantLight azimuth={azimuth} elevation={altitude} />
            </feDiffuseLighting>
            {needsFlipped && (

              <feDiffuseLighting
                in="height"
                surfaceScale={surfaceScale}
                lightingColor="#ffffff"
                result="light-flipped"
              >
                <feDistantLight azimuth={(azimuth + 180) % 360} elevation={altitude} />
              </feDiffuseLighting>
            )}

            {lightSplit("light", "n")}
            {needsFlipped && lightSplit("light-flipped", "f")}

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

            {soften > 0 && (
              <>
                <feGaussianBlur in={shadowSource} stdDeviation={soften} result="shadow-soft" />
                <feGaussianBlur in={highlightSource} stdDeviation={soften} result="highlight-soft" />
              </>
            )}

            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in={soften > 0 ? "shadow-soft" : shadowSource} />
              <feMergeNode in={soften > 0 ? "highlight-soft" : highlightSource} />
            </feMerge>
          </filter>
        </defs>
      </svg>
      {isSvgSource(glyph) ? (

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
