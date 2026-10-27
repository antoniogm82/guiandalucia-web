'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type Pin = { id: string; name: string; sub: string; lat: number; lng: number };

// Mapa de resultados (Leaflet + OpenStreetMap). Los pines se numeran como las filas del listado.
export default function ResultsMap({ pins }: { pins: Pin[] }) {
  const router = useRouter();
  const el = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let map: import('leaflet').Map | undefined;
    let disposed = false;
    const cleanups: (() => void)[] = [];
    (async () => {
      try {
        const L = (await import('leaflet')).default;
        if (disposed || !el.current) return;
        map = L.map(el.current, { scrollWheelZoom: true, zoomControl: true }).setView([37.18, -3.6], 9);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);
        const hl = (id: string, on: boolean) => {
          document.getElementById(`pin-${id}`)?.classList.toggle('on', on);
          document.querySelector(`.row[data-id="${id}"]`)?.classList.toggle('hl', on);
        };
        const pts: [number, number][] = [];
        pins.forEach((p, i) => {
          const m = L.marker([p.lat, p.lng], {
            icon: L.divIcon({ className: '', html: `<div class="pin" id="pin-${p.id}">${i + 1}</div>`, iconSize: [30, 30], iconAnchor: [15, 15] }),
            keyboard: true, title: p.name,
          }).addTo(map!);
          const pop = document.createElement('div');
          pop.innerHTML = '<b></b><br><span></span><br><a>Ver ficha</a>';
          pop.querySelector('b')!.textContent = p.name;
          pop.querySelector('span')!.textContent = p.sub;
          const a = pop.querySelector('a')!;
          a.setAttribute('href', `/ficha/${p.id}`);
          a.addEventListener('click', (e) => { e.preventDefault(); router.push(`/ficha/${p.id}`); });
          m.bindPopup(pop);
          m.on('mouseover', () => hl(p.id, true));
          m.on('mouseout', () => hl(p.id, false));
          m.on('click', () => document.querySelector(`.row[data-id="${p.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
          pts.push([p.lat, p.lng]);
        });
        if (pts.length) map.fitBounds(pts, { padding: [40, 40], maxZoom: 13 });
        document.querySelectorAll<HTMLElement>('.row').forEach((r) => {
          const id = r.dataset.id!;
          const on = () => hl(id, true), off = () => hl(id, false);
          r.addEventListener('mouseenter', on); r.addEventListener('mouseleave', off);
          r.addEventListener('focusin', on); r.addEventListener('focusout', off);
          cleanups.push(() => { r.removeEventListener('mouseenter', on); r.removeEventListener('mouseleave', off); r.removeEventListener('focusin', on); r.removeEventListener('focusout', off); });
        });
      } catch {
        setFailed(true);
      }
    })();
    return () => { disposed = true; cleanups.forEach((c) => c()); map?.remove(); };
  }, [pins, router]);

  return (
    <div id="map" aria-label="Mapa de resultados" ref={el}>
      {failed && <div className="map-fallback">El mapa no se ha podido cargar.<br />La lista sigue funcionando.</div>}
    </div>
  );
}
