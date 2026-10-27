import type { MetadataRoute } from 'next';
import { BLOG } from '@/lib/data';
import { PROVINCES } from '@/lib/nav';
import { siteUrl } from '@/lib/site';

// Las fichas de ejemplo no se incluyen: entrarán cuando haya datos reales.
export default function sitemap(): MetadataRoute.Sitemap {
  const fixed = ['', '/blog', '/quienes-somos', '/contacto', '/como-verificamos', '/aviso-legal', '/politica-de-privacidad', '/politica-de-cookies', '/mapa-del-sitio', '/creditos'];
  return [
    ...fixed.map((p) => ({ url: `${siteUrl}${p}` })),
    ...PROVINCES.map((p) => ({ url: `${siteUrl}/${p.slug}` })),
    ...BLOG.map((b) => ({ url: `${siteUrl}/blog/${b.slug}`, lastModified: b.date })),
  ];
}
