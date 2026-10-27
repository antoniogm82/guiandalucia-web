'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { MapData } from '@/lib/map';

// Orden en que el verde recorre las provincias y tiempo entre cambios.
const ORDER = ['Granada', 'Almería', 'Málaga', 'Cádiz', 'Huelva', 'Sevilla', 'Córdoba', 'Jaén'];
const EVERY_MS = 2800;
const GROUP_DISTANCE = 60; // fichas más cerca que esto (en unidades del mapa) se agrupan en un solo marcador

type Pt = [number, number];
type Marker = { x: number; y: number; n: number };

// Agrupa las fichas cercanas: un marcador con número si hay varias, un punto si es una sola.
function group(points: Pt[]): Marker[] {
  const groups: { sx: number; sy: number; n: number }[] = [];
  for (const [x, y] of points) {
    const g = groups.find((c) => Math.hypot(c.sx / c.n - x, c.sy / c.n - y) < GROUP_DISTANCE);
    if (g) { g.sx += x; g.sy += y; g.n += 1; } else groups.push({ sx: x, sy: y, n: 1 });
  }
  return groups.map((g) => ({ x: g.sx / g.n, y: g.sy / g.n, n: g.n }));
}

const Pin = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.800 7 12 7 12zm0-9a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" /></svg>
);

// Mapa de las ocho provincias con una tarjeta que sigue a la provincia activa. Cambia solo y también con el ratón.
export default function ProvinceExplorer({ map }: { map: MapData }) {
  const [active, setActive] = useState('Granada');
  const hovering = useRef(false);
  const index = useRef(0);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const t = setInterval(() => {
      if (hovering.current || document.hidden) return;
      index.current = (index.current + 1) % ORDER.length;
      setActive(ORDER[index.current]);
    }, EVERY_MS);
    return () => clearInterval(t);
  }, []);

  const pick = (name: string) => { index.current = ORDER.indexOf(name); setActive(name); };
  const markers = useMemo(() => group(map.points[active] ?? []), [map, active]);
  const cur = map.provinces.find((p) => p.name === active)!;

  return (
    <div
      className="mx"
      onMouseEnter={() => { hovering.current = true; }} onMouseLeave={() => { hovering.current = false; }}
      onFocus={() => { hovering.current = true; }} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) hovering.current = false; }}
    >
      <div className="mapa-svg" id="msvg">
        <svg viewBox={`0 0 ${map.w} ${map.h}`} role="img" aria-labelledby="mt md">
          <title id="mt">Mapa de las ocho provincias de Andalucía</title>
          <desc id="md">Las ocho provincias de Andalucía tienen fichas de ejemplo.</desc>
          {map.provinces.map((p) => {
            const label = `${p.name}: ${p.count} ${p.count === 1 ? 'ficha' : 'fichas'} de ejemplo`;
            return (
              <Link key={p.slug} href={`/${p.slug}`} className="pv-a" aria-label={label} onMouseEnter={() => pick(p.name)} onFocus={() => pick(p.name)}>
                <title>{label}</title>
                <path d={p.d} className={`pv pv-on${active === p.name ? ' pv-def' : ''}`} />
              </Link>
            );
          })}
          {Object.entries(map.points).filter(([n]) => n !== active).flatMap(([n, pts]) => pts.map(([x, y], i) => <circle key={`${n}${i}`} cx={x} cy={y} r={6} className="dt" />))}
          <g key={active} className="mk-g" aria-hidden="true">
            {markers.map((m, i) => (
              <g key={i} className="mk" transform={`translate(${m.x} ${m.y})`}>
                <circle className="mk-ring" r={m.n > 1 ? 36 : 22} />
                <circle className="mk-dot" r={m.n > 1 ? 27 : 14} />
                {m.n > 1 && <text className="mk-num" y={1}>{m.n}</text>}
              </g>
            ))}
          </g>
          {map.labels.map((l) => (
            <text key={l.name} x={l.x} y={l.y} className="pl pl-on" style={{ fontSize: l.size }} textAnchor="middle" aria-hidden="true">{l.name}</text>
          ))}
        </svg>
        <p className="mx-cr">Contornos © colaboradores de OpenStreetMap (ODbL).</p>
      </div>

      <aside className="mx-card" aria-live="polite" aria-label="Provincia seleccionada">
        <div key={active} className="mx-in">
          <div className="mx-ph">
            {cur.photo
              ? <><img src={cur.photo.src} alt={cur.photo.alt} width={1920} height={399} /><span>{cur.photo.credit}</span></>
              : <div className="fnp" aria-hidden="true">{cur.name}</div>}
          </div>
          <h3>{cur.name}</h3>
          <p className="mx-count"><Pin />{cur.count} {cur.count === 1 ? 'ficha' : 'fichas'} de ejemplo</p>
          <p className="mx-sub">{cur.summary}</p>
          <Link className="mx-go" href={`/${cur.slug}`}>
            Explorar {cur.name}
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
          </Link>
        </div>
        <ul className="mx-legend" aria-label="Leyenda del mapa">
          <li><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="none" stroke="#1c7c5b" strokeOpacity=".35" strokeWidth="2" /><circle cx="12" cy="12" r="7" fill="#1c7c5b" /></svg>Grupo de fichas</li>
          <li><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="12" cy="12" r="5" fill="#1c7c5b" stroke="#fff" strokeWidth="2" /></svg>Ficha individual</li>
          <li><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="#fff" stroke="#1d2a35" strokeWidth="1.5" /></svg>Otras provincias</li>
        </ul>
      </aside>
    </div>
  );
}
