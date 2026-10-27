'use client';

import { useEffect } from 'react';
import type { TocItem } from '@/lib/blog';

const headerHeight = () => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hh')) || 84;

// Va hasta el título pulsado y reajusta mientras cargan las imágenes diferidas, hasta que la altura se asienta
// o la persona mueve el scroll.
function jump(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const calm = matchMedia('(prefers-reduced-motion:reduce)').matches;
  el.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' });
  let stop = false, n = 0;
  const off = () => { stop = true; removeEventListener('wheel', off); removeEventListener('touchstart', off); removeEventListener('keydown', off); };
  addEventListener('wheel', off, { passive: true, once: true });
  addEventListener('touchstart', off, { passive: true, once: true });
  addEventListener('keydown', off, { once: true });
  const fix = () => {
    if (stop || ++n > 10) return off();
    const d = el.getBoundingClientRect().top - (headerHeight() + 24);
    if (Math.abs(d) > 8 && n > 2) scrollBy({ top: d, behavior: 'auto' });
    setTimeout(fix, 150);
  };
  setTimeout(fix, calm ? 50 : 550);
  el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

function List({ items }: { items: TocItem[] }) {
  return (
    <>
      {items.map((it) => (
        <li key={it.id} className={it.sub ? 'sub' : undefined}>
          <a href={`#${it.id}`} data-s={it.id} onClick={(e) => { e.preventDefault(); jump(it.id); (e.currentTarget.closest('details') as HTMLDetailsElement | null)?.removeAttribute('open'); }}>{it.text}</a>
        </li>
      ))}
    </>
  );
}

// Índice lateral con el apartado actual marcado mientras se lee.
export function TocSide({ items }: { items: TocItem[] }) {
  useEffect(() => {
    const links = [...document.querySelectorAll<HTMLAnchorElement>('a[data-s]')];
    let raf = 0;
    const spy = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = headerHeight() + 40;
        let cur = items[0].id;
        for (const it of items) { if ((document.getElementById(it.id)?.getBoundingClientRect().top ?? 1e9) <= y) cur = it.id; else break; }
        links.forEach((a) => (a.dataset.s === cur ? a.setAttribute('aria-current', 'location') : a.removeAttribute('aria-current')));
        const act = document.querySelector<HTMLElement>('.btoc a[aria-current]');
        const box = act?.closest('.btoc') as HTMLElement | null;
        if (act && box) {
          const r = act.getBoundingClientRect(), q = box.getBoundingClientRect();
          if (r.top < q.top || r.bottom > q.bottom) box.scrollTop += r.top - q.top - 40;
        }
      });
    };
    addEventListener('scroll', spy, { passive: true });
    spy();
    return () => { removeEventListener('scroll', spy); cancelAnimationFrame(raf); };
  }, [items]);
  return (
    <aside className="btoc" id="btoc" aria-label="Contenido del artículo">
      <p className="btoc-t">En este artículo</p>
      <ol id="btoc-l"><List items={items} /></ol>
    </aside>
  );
}

// Índice plegable para pantallas estrechas.
export function TocInline({ items }: { items: TocItem[] }) {
  return (
    <details className="btoc-m" id="btocm">
      <summary>En este artículo</summary>
      <ol id="btoc-lm"><List items={items} /></ol>
    </details>
  );
}
