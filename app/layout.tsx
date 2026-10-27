import type { Metadata } from 'next';
import { isProduction, siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: '¿Qué hacer en Andalucía? | Guía Andalucía', template: '%s | Guía Andalucía' },
  description: 'Guía independiente de Andalucía: fichas comprobadas de alojamientos, restaurantes y actividades, con la fecha y la fuente de cada dato.',
  // Capa 3 de noindex: meta robots mientras no sea producción.
  robots: isProduction ? { index: true, follow: true } : { index: false, follow: false, nocache: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
