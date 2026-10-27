import type { NextConfig } from 'next';
import path from 'node:path';

// El noindex por cabecera y la contraseña los pone proxy.ts en cada petición (según SITE_ENV en tiempo de ejecución).
const config: NextConfig = {
  poweredByHeader: false,
  // Evita que Next tome un package-lock.json de una carpeta superior como raíz del proyecto.
  turbopack: { root: path.resolve(import.meta.dirname) },
};

export default config;
