// Archivo de inicio para Plesk (Passenger). Arranca Next.js en modo producción.
// Escucha enseguida y, si Next falla al arrancar, lo anota en startup.log y (fuera de producción)
// lo muestra en pantalla, para poder diagnosticar sin acceso al registro del servidor.
const http = require('http');
const fs = require('fs');
const path = require('path');

const isProduction = process.env.SITE_ENV === 'production';
const log = (msg) => {
  const line = `${new Date().toISOString()} ${msg}`;
  console.log(line);
  try { fs.appendFileSync(path.join(__dirname, 'startup.log'), line + '\n'); } catch (e) { /* sin permiso de escritura */ }
};

let handler = null;
let failure = null;

const server = http.createServer((req, res) => {
  if (handler) return handler(req, res);
  res.statusCode = 503;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('X-Robots-Tag', 'noindex');
  res.end(failure ? (isProduction ? 'Servicio no disponible.' : `Error al arrancar la aplicación:\n\n${failure}`) : 'Arrancando…');
});
server.listen(process.env.PORT || 3000);

log(`Arrancando. Node ${process.version}, SITE_ENV=${process.env.SITE_ENV || '(sin definir)'}, carpeta ${__dirname}`);

process.on('unhandledRejection', (e) => log(`unhandledRejection: ${e && e.stack ? e.stack : e}`));
process.on('uncaughtException', (e) => { failure = String(e && e.stack ? e.stack : e); log(`uncaughtException: ${failure}`); });

try {
  const next = require('next');
  const app = next({ dev: false, dir: __dirname });
  const handle = app.getRequestHandler();
  app.prepare()
    .then(() => { handler = handle; log('Next.js listo.'); })
    .catch((e) => { failure = String(e && e.stack ? e.stack : e); log(`Fallo al preparar Next.js: ${failure}`); });
} catch (e) {
  failure = String(e && e.stack ? e.stack : e);
  log(`Fallo al cargar Next.js: ${failure}`);
}
