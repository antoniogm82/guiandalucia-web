import type { Metadata, Viewport } from 'next';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { isProduction, siteUrl } from '@/lib/site';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import ChromeEffects from '@/components/ChromeEffects';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: '¿Qué hacer en Andalucía? | Guía Andalucía', template: '%s | Guía Andalucía' },
  description: 'Guía independiente de Andalucía: fichas comprobadas de alojamientos, restaurantes y actividades, con la fecha y la fuente de cada dato.',
  icons: { icon: '/img/favicon.png' },
  // Capa 3 de noindex: meta robots mientras no sea producción (se fija al compilar).
  robots: isProduction ? { index: true, follow: true } : { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = { themeColor: '#fafafa', colorScheme: 'light', viewportFit: 'cover' };

const liquidFilter = readFileSync(join(process.cwd(), 'content/liquid-filter.html'), 'utf8');

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://unpkg.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Barlow+Condensed:wght@600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/light/style.css" />
      </head>
      <body>
        <a className="skip" href="#app">Saltar al contenido</a>
        {!isProduction && (
          <div className="demo-bar"><b>Web de pruebas.</b> Todo el contenido es de demostración: ninguna ficha ni dato es real, y las fotos son de ejemplo: no corresponden a los negocios.</div>
        )}
        <div dangerouslySetInnerHTML={{ __html: liquidFilter }} />
        <SiteHeader />
        <main id="app" tabIndex={-1}>{children}</main>
        <SiteFooter />
        <div className="toast" id="toast" role="status" aria-live="polite" />
        <ChromeEffects />
      </body>
    </html>
  );
}
