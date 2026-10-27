import type { NextConfig } from 'next';

// El noindex por cabecera y la contraseña los pone proxy.ts en cada petición (según SITE_ENV en tiempo de ejecución).
const config: NextConfig = {
  poweredByHeader: false,
};

export default config;
