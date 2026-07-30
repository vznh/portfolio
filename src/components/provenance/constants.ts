export const COLLAPSED_PREVIEW_HEIGHT_REM = 10.5;
export const COLLAPSED_FADE_DISTANCE_REM = 3.5;
export const EXPANSION_SCROLL_DURATION = 3000;
export const MASK_CLEAR_DURATION = 4000;
export const MASK_CLEAR_START_MS = 1750;
export const MASK_CLEAR_END_MS = MASK_CLEAR_START_MS + MASK_CLEAR_DURATION;

// Typography shared by every block of provenance prose — the intro line and
// each story paragraph. The measurements below mirror it for line-break math.
export const PARAGRAPH_CLASS =
  "font-plex text-xl leading-7 tracking-tight text-justify text-[var(--text-color)]";

// These values mirror the provenance paragraph typography in globals.css.
export const BAR_VIEWPORT_RATIO = 0.45;
export const LINE_HEIGHT_REM = 1.75;
export const FONT_SIZE_REM = 1.25;
export const TRACKING_EM = -0.025;
export const CANVAS_FONT_FAMILY = '"IBM Plex Sans"';
export const FRAME_ROWS = 6;
export const BAR_OVERLAP_THRESHOLD = 0.5;
