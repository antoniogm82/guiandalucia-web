'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { MapData } from '@/lib/map';

// Orden en que el verde recorre las provincias.
const ORDER = ['Granada', 'Almería', 'Málaga', 'Cádiz', 'Huelva', 'Sevilla', 'Córdoba', 'Jaén'];
const EVERY_MS = 2800;

export default function ProvinceMap({ map }: { map: MapData }) {
  const [active, setActive] = useState('Granada');
  const hovering = useRef(false);
  const index = useRef(0);

  // El verde cambia solo; se pausa con ratón o foco, con la pestaña oculta o si se pide reducir movimiento.
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const t = setInterval(() => {
      if (hovering.current || document.hidden) return;
      index.current = (index.current + 1) % ORDER.length;
      setActive(ORDER[index.current]);
    }, EVERY_MS);
    return () => clearInterval(t);
  }, []);

  const point = (name: string) => { hovering.current = true; index.current = ORDER.indexOf(name); setActive(name); };
  const route = map.routes[active] ?? [];

  return (
    <svg
      viewBox={`0 0 ${map.w} ${map.h}`} role="img" aria-labelledby="mt md"
      onMouseLeave={() => { hovering.current = false; }}
      onFocus={() => { hovering.current = true; }} onBlur={() => { hovering.current = false; }}
    >
      <title id="mt">Mapa de las ocho provincias de Andalucía</title>
      <desc id="md">Las ocho provincias de Andalucía tienen fichas de ejemplo.</desc>
      {map.lon.map(([v, x]) => (
        <g key={`lon${v}`}>
          <line x1={x} y1={10} x2={x} y2={map.h - 10} className="gr" />
          <text x={x} y={map.h - 14} className="tick" textAnchor="middle" aria-hidden="true">{Math.abs(v)}° O</text>
        </g>
      ))}
      {map.lat.map(([v, y]) => (
        <g key={`lat${v}`}>
          <line x1={10} y1={y} x2={map.w - 10} y2={y} className="gr" />
          <text x={14} y={y - 6} className="tick" aria-hidden="true">{v}° N</text>
        </g>
      ))}
      {map.provinces.map((p) => {
        const label = `${p.name}: ${p.count} ${p.count === 1 ? 'ficha' : 'fichas'} de ejemplo`;
        return (
          <Link key={p.slug} href={`/${p.slug}`} className="pv-a" aria-label={label} onMouseEnter={() => point(p.name)}>
            <title>{label}</title>
            <path d={p.d} className={`pv pv-on${active === p.name ? ' pv-def' : ''}`} />
          </Link>
        );
      })}
      <g id="mroute">
        {route.length === 1 && <circle key={active} className="mring" cx={route[0][0]} cy={route[0][1]} r={8} />}
        {route.length > 1 && <path key={active} className="mroute" pathLength={1} d={`M${route.map((q) => q.join(' ')).join('L')}`} />}
      </g>
      {map.dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={5} className="dt" />)}
      {map.labels.map((l) => (
        <text key={l.name} x={l.x} y={l.y} className="pl pl-on" style={{ fontSize: l.size }} textAnchor="middle" aria-hidden="true">{l.name}</text>
      ))}
    </svg>
  );
}
