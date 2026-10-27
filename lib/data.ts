import data from '@/content/data.json';
import blog from '@/content/blog.json';

export type Status = 'business' | 'editorial' | 'external' | 'pending';
export type Place = {
  id: string; cat: string; sub: string; mun: string; bar: string; prov: string; img: string; name: string;
  lat: number; lng: number; status: Status; checked: string; src: string; sponsored: boolean; ad: boolean;
  blurb: string; facts: [string, string][];
};
export type BlogPost = { slug: string; title: string; date: string; cat: string; img: string; excerpt: string; mins: number; author: string };

export const PLACES = data.PLACES as Place[];
export const STATUS = data.STATUS as Record<Status, { t: string; d: string }>;
export const CATS = data.CATS as Record<string, { label: string; one: string }>;
export const DEST = data.DEST as unknown as { n: string; t: string; q: Record<string, string> }[];
export const BLOG = blog as BlogPost[];

export const okPlaces = () => PLACES.filter((p) => p.status !== 'pending');
export const placeById = (id: string) => PLACES.find((p) => p.id === id);

export const slugOf = (name: string) => name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const IMG_ALT: Record<string, string> = {
  'alhambra-san-nicolas': 'La Alhambra vista desde el Albaicín, con Sierra Nevada al fondo',
  'albaicin-calle-carmen-estrellas': 'Calle empedrada y encalada del Albaicín, con la torre de una iglesia al fondo',
  'capileira-alpujarra': 'Chimeneas blancas tradicionales de Capileira, en la Alpujarra',
  'guadix-panoramica': 'Vista de Guadix con sus chimeneas de casas cueva',
  'sacromonte-museo-cuevas': 'Cuevas blancas del Sacromonte, en Granada',
  'tapas-pulpo-seco-motril': 'Caña de cerveza y tapa de pulpo seco sobre una barra de madera',
};
export const altFor = (src: string) => IMG_ALT[(src || '').split('/').pop()?.replace('.webp', '') ?? ''] ?? '';
export const imgSrc = (src: string) => (src.startsWith('/') || src.startsWith('http') ? src : `/${src}`);
