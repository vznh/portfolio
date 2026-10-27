export const GLYPH_BOX_CLASS =
  "relative aspect-[4/5] w-full max-w-[32px] md:h-[min(350px,calc(60vh+1.5rem-15rem))] md:w-auto md:max-w-[280px]";

export function isImageSource(glyph: string) {
  return glyph.startsWith("/") && /\.(svg|png)$/i.test(glyph);
}
