import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { CrosswordAppearance } from "@/presets/crosswordAppearance";
import { getBrushFrequency } from "@/lib/crosswordAppearance";
import { createScatterTile } from "@/lib/crosswordScatter";
import styles from "@/styles/crossword.module.css";

interface Props {
  id: string;
  appearance: CrosswordAppearance;
}

export function CrosswordStrokeFilter({
  id,
  appearance: { stroke },
  shape = false,
}: Props & { shape?: boolean }) {
  const weight = stroke.enabled ? Math.max(0, stroke.weight) : 0;
  const outer = stroke.position === "inside" ? 0 : stroke.position === "center" ? weight / 2 : weight;
  const inner = stroke.position === "outside" ? 0 : stroke.position === "center" ? weight / 2 : weight;
  const textured = stroke.style !== "solid";
  const inkWear = stroke.enabled && textured ? Math.min(1, Math.max(0, stroke.inkWear)) : 0;
  const frequency = getBrushFrequency(stroke).join(" ");
  const scatterTile = useMemo(
    () => (stroke.style === "scatter" ? createScatterTile(stroke.scatter, stroke.brush.seed) : null),
    [stroke.style, stroke.scatter, stroke.brush.seed],
  );
  const strokeInput = scatterTile ? "scattered-outline" : textured ? "brush-outline" : "outline";

  return (
    <svg className={styles.filterDefinitions} width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <filter id={id} x="-150%" y="-100%" width="400%" height="300%" colorInterpolationFilters="sRGB">
          {shape ? (
            <>
              <feOffset in="SourceAlpha" dx="0" dy="0" result="glyph-alpha" />
              <feMorphology in="SourceAlpha" operator="dilate" radius={outer} result="outer" />
              <feMorphology in="SourceAlpha" operator="erode" radius={inner} result="inner" />
              <feComposite in="outer" in2="inner" operator="out" result="outline" />
            </>
          ) : (
            <>
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0"
                result="fill-channel"
              />
              <feComposite in="fill-channel" in2="SourceAlpha" operator="in" result="glyph-alpha" />
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 1 0 0"
                result="stroke-channel"
              />
              <feComposite in="stroke-channel" in2="SourceAlpha" operator="in" result="outline" />
            </>
          )}
          <feFlood floodColor="#000000" result="fill-color" />
          <feComposite in="fill-color" in2="glyph-alpha" operator="in" result="source-fill" />
          {textured && (
            <>
              <feTurbulence
                type="fractalNoise"
                baseFrequency={frequency}
                numOctaves="3"
                seed={stroke.brush.seed}
                result="noise"
              />
              <feDisplacementMap
                in="outline"
                in2="noise"
                scale={stroke.brush.roughness}
                xChannelSelector="R"
                yChannelSelector="G"
                result="rough-outline"
              />
              <feColorMatrix in="noise" type="luminanceToAlpha" result="grain" />
              <feComponentTransfer in="grain" result="bristles">
                <feFuncA type="linear" slope="6" intercept={1 - stroke.brush.dryness * 6} />
              </feComponentTransfer>
              <feComposite in="rough-outline" in2="bristles" operator="in" result="brush-outline" />
            </>
          )}
          {scatterTile && (
            <>
              <feImage
                href={scatterTile.uri}
                x="0"
                y="0"
                width={scatterTile.size}
                height={scatterTile.size}
                result="stamp-tile"
              />
              <feTile in="stamp-tile" x="-150%" y="-100%" width="400%" height="300%" result="stamps" />
              <feComposite in="brush-outline" in2="stamps" operator="in" result="scattered-outline" />
            </>
          )}
          {stroke.position === "center" ? (
            <feOffset in={strokeInput} dx="0" dy="0" result="stroke-mask" />
          ) : (
            <feComposite
              in={strokeInput}
              in2="glyph-alpha"
              operator={stroke.position === "inside" ? "in" : "out"}
              result="stroke-mask"
            />
          )}
          <feFlood floodColor={stroke.color} floodOpacity={stroke.opacity} result="stroke-color" />
          <feComposite in="stroke-color" in2="stroke-mask" operator="in" result="stroke" />
          {inkWear > 0 && (
            <>
              <feComponentTransfer in="grain" result="ink-grain">
                <feFuncA type="linear" slope="8" intercept="-3" />
              </feComponentTransfer>
              <feComponentTransfer in={scatterTile ? "stamps" : "ink-grain"} result="ink-coverage">
                <feFuncA type="linear" slope={inkWear} intercept={1 - inkWear} />
              </feComponentTransfer>
              <feComposite in="source-fill" in2="ink-coverage" operator="in" result="worn-fill" />
            </>
          )}
          <feComponentTransfer in={inkWear > 0 ? "worn-fill" : "source-fill"} result="fill">
            <feFuncA type="linear" slope={stroke.fillOpacity} />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="fill" />
            <feMergeNode in="stroke" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

export function CrosswordHalftone({
  appearance: { halftone },
  freeform,
}: Omit<Props, "id"> & { freeform: boolean }) {
  const overlay = useRef<HTMLDivElement>(null);
  const [mask, setMask] = useState<string>();
  const visible = halftone.enabled && halftone.opacity > 0;

  useEffect(() => {
    const element = overlay.current;
    const grid = element?.parentElement;
    if (!visible || !element || !grid) return;

    const measure = () => {
      const bounds = element.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const edges = Array.from(grid.querySelectorAll("[data-crossword-cell]"), (cell) => {
        const rect = cell.getBoundingClientRect();
        return `<rect x="${rect.left - bounds.left - 0.5}" y="${rect.top - bounds.top - 0.5}" width="${rect.width + 1}" height="${rect.height + 1}"/>`;
      }).join("");
      const frame = freeform
        ? ""
        : `<rect x="1" y="1" width="${bounds.width - 2}" height="${bounds.height - 2}" stroke-width="2"/>`;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${bounds.width}" height="${bounds.height}" viewBox="0 0 ${bounds.width} ${bounds.height}" fill="none" stroke="white" stroke-width="1">${edges}${frame}</svg>`;
      setMask(`url("data:image/svg+xml,${encodeURIComponent(svg)}")`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    return () => observer.disconnect();
  }, [visible, freeform]);

  if (!halftone.enabled || halftone.opacity === 0) return null;
  const style = {
    opacity: halftone.opacity,
    mixBlendMode: halftone.blend,
    maskImage: mask,
    WebkitMaskImage: mask,
    visibility: mask ? "visible" : "hidden",
    "--halftone-scale": `${1843 * halftone.scale}px`,
    "--halftone-rotation": `${halftone.rotation}deg`,
    "--halftone-contrast": halftone.contrast,
    "--halftone-x": `${halftone.offsetX}px`,
    "--halftone-y": `${halftone.offsetY}px`,
  } as CSSProperties;

  return <div ref={overlay} className={styles.halftone} style={style} aria-hidden="true" />;
}
