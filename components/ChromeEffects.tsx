'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initCursorFx, initNav } from '@/lib/effects';

// Activa el menú desplegable, el indicador deslizante, el puntero en cinta y las frases del clic derecho.
export default function ChromeEffects() {
  const pathname = usePathname();

  useEffect(() => {
    initNav();
    initCursorFx();
  }, []);

  // En cada cambio de página: cierra los menús y marca el enlace actual.
  useEffect(() => {
    const w = window as unknown as { __closeNav?: () => void; __blob?: () => void };
    w.__closeNav?.();
    document.querySelectorAll('#nav [data-nav]').forEach((a) => a.removeAttribute('aria-current'));
    const cat = new URLSearchParams(window.location.search).get('cat');
    const first = pathname.split('/')[1] ?? '';
    const id = pathname === '/blog' || pathname.startsWith('/blog/') ? 'blog'
      : pathname.startsWith('/buscar') ? (cat ?? null)
      : ['almeria', 'cadiz', 'cordoba', 'granada', 'huelva', 'jaen', 'malaga', 'sevilla'].includes(first) ? 'provincias'
      : null;
    if (id) document.querySelector(`#nav [data-nav="${id}"]`)?.setAttribute('aria-current', 'page');
    w.__blob?.();
  }, [pathname]);

  return null;
}
