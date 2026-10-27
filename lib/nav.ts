// Datos del menú principal y de las provincias.
export const PROVINCES = [
  { name: 'Almería', slug: 'almeria' },
  { name: 'Cádiz', slug: 'cadiz' },
  { name: 'Córdoba', slug: 'cordoba' },
  { name: 'Granada', slug: 'granada' },
  { name: 'Huelva', slug: 'huelva' },
  { name: 'Jaén', slug: 'jaen' },
  { name: 'Málaga', slug: 'malaga' },
  { name: 'Sevilla', slug: 'sevilla' },
] as const;

export type NavItem = { title: string; sub: string; href: string };
export type NavEntry = { id: string; label: string; href: string; all?: string; items?: NavItem[] };

const q = (cat: string, sub: string) => `/buscar?cat=${cat}&sub=${encodeURIComponent(sub)}`;

export const NAV: NavEntry[] = [
  {
    id: 'provincias', label: 'Provincias', href: '/buscar', all: 'Ver todas las fichas',
    items: PROVINCES.map((p) => ({ title: p.name, sub: `Fichas y guías de ${p.name}`, href: `/${p.slug}` })),
  },
  {
    id: 'alojamientos', label: 'Dónde dormir', href: '/buscar?cat=alojamientos', all: 'Ver todos los alojamientos',
    items: [
      { title: 'Con encanto y vistas', sub: 'Albaicín y vistas a la Alhambra', href: q('alojamientos', 'Con encanto y vistas') },
      { title: 'Casas cueva', sub: 'Guadix y el Altiplano', href: q('alojamientos', 'Casas cueva') },
      { title: 'Rural en la Alpujarra', sub: 'Casas y hoteles rurales', href: q('alojamientos', 'Rural en la Alpujarra') },
    ],
  },
  {
    id: 'restaurantes', label: 'Dónde comer', href: '/buscar?cat=restaurantes', all: 'Ver todos los restaurantes',
    items: [
      { title: 'Tapas', sub: 'Realejo, centro y Campo del Príncipe', href: q('restaurantes', 'Tapas') },
      { title: 'Vistas a la Alhambra', sub: 'Terrazas y miradores', href: q('restaurantes', 'Vistas a la Alhambra') },
      { title: 'Cocina tradicional', sub: 'Los platos de siempre', href: q('restaurantes', 'Cocina tradicional') },
    ],
  },
  {
    id: 'actividades', label: 'Qué hacer', href: '/buscar?cat=actividades', all: 'Ver todas las actividades',
    items: [
      { title: 'Visitas guiadas', sub: 'Albaicín, Sacromonte y flamenco', href: q('actividades', 'Visitas guiadas') },
      { title: 'Excursiones y Sierra Nevada', sub: 'Alpujarra, Guadix y montaña', href: q('actividades', 'Excursiones y Sierra Nevada') },
      { title: 'Con niños', sub: 'Planes en familia', href: q('actividades', 'Con niños') },
    ],
  },
  { id: 'blog', label: 'Blog', href: '/blog' },
];

export const NAV_ICONS: Record<string, string> = {
  provincias: 'M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11z',
  alojamientos: 'M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 15h18M7 9V7a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2',
  restaurantes: 'M7 3v8a2 2 0 0 0 2 2v8M7 3v5M11 3v5M17 3c-2 2-2.5 5-2 8h2v10',
  actividades: 'm15.5 8.5-2 5-5 2 2-5z',
};
