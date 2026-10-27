import type { NextConfig } from 'next';
import path from 'node:path';
import redirects from './content/redirects.json';

// El noindex por cabecera y la contraseña los pone proxy.ts en cada petición (según SITE_ENV en tiempo de ejecución).
const config: NextConfig = {
  poweredByHeader: false,
  // 301 desde las direcciones antiguas de WordPress (se genera con scripts/redirecciones.mjs).
  // Se desactiva la redirección automática de la barra final para que las direcciones antiguas (que la llevan)
  // lleguen a su destino en un solo salto; la barra sobrante se quita en la última regla.
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      ...redirects.flatMap((r) => [
        { source: r.source, destination: r.destination, statusCode: 301 },
        { source: `${r.source}/`, destination: r.destination, statusCode: 301 },
      ]),
      { source: '/:path+/', destination: '/:path+', statusCode: 301 },
    ];
  },
  // Evita que Next tome un package-lock.json de una carpeta superior como raíz del proyecto.
  turbopack: { root: path.resolve(import.meta.dirname) },
};

export default config;
