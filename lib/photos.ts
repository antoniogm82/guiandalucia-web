import credits from '@/content/credits.json';
import { altFor, type Place } from '@/lib/data';

export type Photo = { src: string; alt: string; author?: string; license?: string; url?: string };

// Fotos de ejemplo (Wikimedia Commons). La principal va primero y el resto completa la galería.
const POOL = ['alhambra-san-nicolas', 'albaicin-calle-carmen-estrellas', 'sacromonte-museo-cuevas', 'capileira-alpujarra', 'guadix-panoramica', 'tapas-pulpo-seco-motril'];

export function photosFor(p: Place): Photo[] {
  const main = p.img ? p.img.replace(/^\/?img\//, '').replace('.webp', '') : POOL[0];
  return [main, ...POOL.filter((x) => x !== main)].map((name) => {
    const src = `/img/${name}.webp`;
    const c = credits.find((x) => x.file === `${name}.webp`);
    return { src, alt: altFor(src), author: c?.author, license: c?.license, url: c?.url };
  });
}
