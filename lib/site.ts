// SITE_ENV decide si la web es pública. Cualquier valor distinto de "production" cuenta como pruebas.
export const isProduction = process.env.SITE_ENV === 'production';
export const siteUrl = process.env.SITE_URL ?? 'https://guiandalucia.es';
