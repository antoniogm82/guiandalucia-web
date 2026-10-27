import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Capas 1 y 4 de noindex, en cada petición y solo si SITE_ENV no es "production":
// cabecera X-Robots-Tag y, si existen STAGING_USER y STAGING_PASS, usuario y contraseña.
export function proxy(request: NextRequest) {
  if (process.env.SITE_ENV === 'production') return NextResponse.next();

  const user = process.env.STAGING_USER;
  const pass = process.env.STAGING_PASS;
  if (user && pass) {
    const auth = request.headers.get('authorization');
    let ok = false;
    if (auth?.startsWith('Basic ')) {
      const [u, ...rest] = atob(auth.slice(6)).split(':');
      ok = u === user && rest.join(':') === pass;
    }
    if (!ok) {
      return new NextResponse('Acceso restringido', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Guía Andalucía (pruebas)"', 'X-Robots-Tag': 'noindex, nofollow' },
      });
    }
  }
  const res = NextResponse.next();
  res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  return res;
}

export const config = {
  // La comprobación de salud y los archivos estáticos no pasan por aquí.
  matcher: ['/((?!api/health|_next/static|_next/image|favicon.ico).*)'],
};
