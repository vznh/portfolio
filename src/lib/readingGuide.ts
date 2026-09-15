interface RowBounds {
  top: number;
  bottom: number;
  height: number;
}

export function getReadingGuide(rows: RowBounds[], viewportHeight: number, viewportTop = 0) {
  const top = viewportTop + viewportHeight * 0.25;
  const height = rows[0]?.height ?? 0;
  const midpoint = top + height / 2;
  const index = rows.findIndex((row) => row.top <= midpoint && midpoint < row.bottom);

  return { top, height, index: index === -1 ? null : index };
}
