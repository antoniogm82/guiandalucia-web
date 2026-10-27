import mapa from '@/content/mapa.json';
import { PLACES, slugOf } from '@/lib/data';

type Pt = [number, number];
export type MapProvince = {
  name: string; slug: string; d: string; count: number;
  /** Categorías con fichas, ya redactadas («Alojamientos, restaurantes y actividades»). */
  summary: string;
  photo?: { src: string; alt: string; credit: string };
};
export type MapLabel = { name: string; x: number; y: number; size: number };
export type MapData = {
  w: number; h: number;
  provinces: MapProvince[];
  /** Posición de cada ficha, agrupada por provincia. */
  points: Record<string, Pt[]>;
  labels: MapLabel[];
};

const [lon0, lat1, k, S, pad] = mapa.o as number[];
const px = (l: number) => Math.round(((l - lon0) * k * S + pad) * 10) / 10;
const py = (l: number) => Math.round(((lat1 - l) * S + pad) * 10) / 10;

const inside = (x: number, y: number, r: Pt[]) => {
  let c = false;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const a = r[i], b = r[j];
    if (a[1] > y !== b[1] > y && x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]) c = !c;
  }
  return c;
};

// Coloca cada nombre en un hueco dentro de su provincia, sin pisar puntos ni otras etiquetas.
function placeLabels(provs: { n: string; d: string; c: Pt }[], dots: Pt[]): MapLabel[] {
  const placed: number[][] = [];
  return provs.map((q) => {
    const rings = q.d.split('Z').filter(Boolean).map((s) => s.replace(/^M/, '').split('L').map((t) => t.split(' ').map(Number) as Pt));
    const R = rings.reduce((a, b) => (b.length > a.length ? b : a));
    const xs = R.map((p) => p[0]), ys = R.map((p) => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    let best: number[] | null = null;
    let fs = 34;
    for (const f of [34, 30, 27, 24]) {
      fs = f;
      const w = q.n.length * 0.58 * f + 10, h = 0.72 * f + 10;
      let bd = 1e9;
      for (let y = y0 + h; y <= y1; y += 8) {
        for (let x = x0 + w / 2; x <= x1 - w / 2; x += 8) {
          if (!inside(x, y - h / 2, R)) continue;
          const bx0 = x - w / 2, bx1 = x + w / 2, by0 = y - h + 4, by1 = y + 4;
          if (![[bx0, by0], [bx1, by0], [bx0, by1], [bx1, by1], [x, by0], [x, by1]].every((p) => inside(p[0], p[1], R))) continue;
          if (dots.some((d) => d[0] > bx0 - 9 && d[0] < bx1 + 9 && d[1] > by0 - 9 && d[1] < by1 + 9)) continue;
          if (placed.some((p) => bx0 < p[1] && bx1 > p[0] && by0 < p[3] && by1 > p[2])) continue;
          const dd = Math.hypot(x - q.c[0], y - h / 2 - q.c[1]);
          if (dd < bd) { bd = dd; best = [x, y, bx0, bx1, by0, by1]; }
        }
      }
      if (best) break;
    }
    if (!best) { best = [q.c[0], q.c[1], q.c[0] - 40, q.c[0] + 40, q.c[1] - 18, q.c[1] + 4]; fs = 21; }
    placed.push([best[2], best[3], best[4], best[5]]);
    return { name: q.n, x: best[0], y: best[1], size: fs };
  });
}

const CAT_NAMES: Record<string, string> = { alojamientos: 'alojamientos', restaurantes: 'restaurantes', actividades: 'actividades' };
const PHOTOS: Record<string, { src: string; alt: string; credit: string }> = {
  Granada: { src: '/img/hero-alhambra-panorama.webp', alt: 'Panorámica de la Alhambra con Sierra Nevada al fondo', credit: 'Adam Jones · CC BY-SA 3.0' },
};

function summaryOf(name: string) {
  const cats = ['alojamientos', 'restaurantes', 'actividades'].filter((c) => PLACES.some((p) => p.prov === name && p.cat === c)).map((c) => CAT_NAMES[c]);
  const text = cats.length > 1 ? `${cats.slice(0, -1).join(', ')} y ${cats[cats.length - 1]}` : cats[0] ?? '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function buildMapData(): MapData {
  const provs = mapa.provs as { n: string; d: string; c: Pt }[];
  const all = PLACES.map((p): Pt => [px(p.lng), py(p.lat)]);
  const points: Record<string, Pt[]> = {};
  for (const q of provs) points[q.n] = PLACES.filter((p) => p.prov === q.n).map((p): Pt => [px(p.lng), py(p.lat)]);
  return {
    w: mapa.w, h: mapa.h,
    provinces: provs.map((q) => ({
      name: q.n, slug: slugOf(q.n), d: q.d, count: PLACES.filter((p) => p.prov === q.n).length, summary: summaryOf(q.n), photo: PHOTOS[q.n],
    })),
    points,
    labels: placeLabels(provs, all),
  };
}
