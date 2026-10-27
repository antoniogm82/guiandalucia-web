import type { MetadataRoute } from 'next';
import { isProduction, siteUrl } from '@/lib/site';

export const dynamic = 'force-dynamic'; // se decide en cada petición, no al compilar

// Capa 2 de noindex: robots.txt que bloquea todo mientras no sea producción.
export default function robots(): MetadataRoute.Robots {
  return isProduction
    ? { rules: { userAgent: '*', allow: '/' }, sitemap: `${siteUrl}/sitemap.xml` }
    : { rules: { userAgent: '*', disallow: '/' } };
}
