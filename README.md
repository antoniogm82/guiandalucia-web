# Guía Andalucía: web (Next.js)

Next.js 16 (App Router, TypeScript). Se ejecuta en Plesk con Node.js.

## Cómo funciona el noindex (`SITE_ENV`)

| Capa | Dónde | Cuándo se decide |
|---|---|---|
| Cabecera `X-Robots-Tag` | `proxy.ts` | En cada petición |
| `robots.txt` (`Disallow: /`) | `app/robots.ts` | En cada petición |
| Usuario y contraseña | `proxy.ts` (si existen `STAGING_USER` y `STAGING_PASS`) | En cada petición |
| `<meta name="robots">` | `app/layout.tsx` | **Al compilar** |

La meta se fija al compilar, así que **para publicar hay que cambiar `SITE_ENV=production` y volver a compilar** (`npm run build`). Si se olvida recompilar, la web queda en noindex (el fallo es seguro).

## Primer despliegue en Plesk

1. Plesk → Node.js: raíz de la aplicación `/expe.guiandalucia.es`, raíz del documento `/expe.guiandalucia.es/public`, archivo de inicio `app.js`.
2. Variables de entorno personalizadas: copia las de `.env.example` y rellénalas (`SITE_ENV=staging`, `STAGING_USER`, `STAGING_PASS`, `SITE_URL`).
3. Plesk → Git: trae el repositorio a `/expe.guiandalucia.es`.
4. Pestaña «Ejecutar comandos Node.js»: `npm install`, luego `npm run build`.
5. Reiniciar app. La web pedirá usuario y contraseña. Comprobación sin contraseña: `/api/health`.

## Cada actualización
Git → Pull, luego `npm install` (si cambió `package.json`), `npm run build` y Reiniciar app.

## Local
```bash
npm install
SITE_ENV=staging npm run dev
```
