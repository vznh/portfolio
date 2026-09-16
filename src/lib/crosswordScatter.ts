import type { CrosswordAppearance } from "../presets/crosswordAppearance";

type Scatter = CrosswordAppearance["stroke"]["scatter"];
const tips: Record<Scatter["tip"], { count: number; radius: number; aspect: number; opacity: number }> = {
  mist: { count: 28, radius: 0.11, aspect: 1, opacity: 0.5 },
  spray: { count: 34, radius: 0.17, aspect: 0.8, opacity: 0.9 },
  flecks: { count: 12, radius: 0.22, aspect: 0.45, opacity: 1 },
  grit: { count: 9, radius: 0.3, aspect: 0.85, opacity: 1 },
  bristle: { count: 18, radius: 0.24, aspect: 0.2, opacity: 1 },
  blot: { count: 4, radius: 0.7, aspect: 0.7, opacity: 1 },
  charcoal: { count: 38, radius: 0.19, aspect: 0.55, opacity: 0.65 },
  dust: { count: 10, radius: 0.09, aspect: 0.8, opacity: 0.65 },
  stipple: { count: 16, radius: 0.12, aspect: 1, opacity: 0.85 },
  airbrush: { count: 48, radius: 0.18, aspect: 1, opacity: 0.5 },
};

export function createScatterTile(scatter: Scatter, seed: number) {
  const tip = tips[scatter.tip];
  const size = Math.max(0.5, scatter.size);
  const gap = Math.max(0.25, scatter.gap);
  const tileSize = size * gap * 8;
  let state = seed >>> 0;
  const random = () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const marks: string[] = [];
  const n = (value: number) => value.toFixed(3);
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const cx = ((col + 0.5) * tileSize) / 4 + (random() - 0.5) * scatter.wiggle * size;
      const cy = ((row + 0.5) * tileSize) / 4 + (random() - 0.5) * scatter.wiggle * size;
      const jitter = Math.max(0.1, 1 + (random() - 0.5) * scatter.sizeJitter);
      const angle = ((scatter.rotation + (random() - 0.5) * 2 * scatter.angularJitter) * Math.PI) / 180;
      for (let dot = 0; dot < tip.count; dot++) {
        const theta = random() * Math.PI * 2;
        const distance = Math.sqrt(random()) * size * jitter;
        const dx = Math.cos(theta) * distance;
        const dy = Math.sin(theta) * distance;
        const x = (((cx + dx * Math.cos(angle) - dy * Math.sin(angle)) % tileSize) + tileSize) % tileSize;
        const y = (((cy + dx * Math.sin(angle) + dy * Math.cos(angle)) % tileSize) + tileSize) % tileSize;
        const radius = tip.radius * size * jitter * (0.5 + random());
        const offsetsX = [
          0,
          ...(x < radius ? [tileSize] : []),
          ...(x + radius > tileSize ? [-tileSize] : []),
        ];
        const offsetsY = [
          0,
          ...(y < radius ? [tileSize] : []),
          ...(y + radius > tileSize ? [-tileSize] : []),
        ];
        for (const ox of offsetsX)
          for (const oy of offsetsY) {
            marks.push(
              `<ellipse cx="${n(x + ox)}" cy="${n(y + oy)}" rx="${n(radius)}" ry="${n(radius * tip.aspect)}" opacity="${tip.opacity}" transform="rotate(${n((angle * 180) / Math.PI)} ${n(x + ox)} ${n(y + oy)})"/>`,
            );
          }
      }
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${tileSize}" height="${tileSize}" viewBox="0 0 ${tileSize} ${tileSize}"><g fill="white">${marks.join("")}</g></svg>`;
  return { size: tileSize, uri: `data:image/svg+xml,${encodeURIComponent(svg)}` };
}
