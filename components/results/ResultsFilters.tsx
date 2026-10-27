'use client';

import { useRouter } from 'next/navigation';
import { CATS } from '@/lib/data';
import { PROVINCES } from '@/lib/nav';
import type { Filters } from '@/lib/search';

// Filtros del listado: cada cambio actualiza la dirección y el servidor devuelve la lista nueva.
export default function ResultsFilters({ f, subs, muns }: { f: Filters; subs: string[]; muns: string[] }) {
  const router = useRouter();
  const go = (key: keyof Filters, value: string) => {
    const next: Partial<Record<keyof Filters, string>> = { ...f, [key]: value };
    if (key === 'cat') next.sub = '';
    if (next.ord === 'editorial') next.ord = '';
    const p = new URLSearchParams();
    (Object.keys(next) as (keyof Filters)[]).forEach((k) => next[k] && p.set(k, next[k] as string));
    const qs = p.toString();
    router.push(qs ? `/buscar?${qs}` : '/buscar');
  };
  return (
    <div className="filters">
      <div className="fscroll" role="group" aria-label="Filtros">
        <div className="sel"><label className="sr" htmlFor="fprov">Provincia</label>
          <select id="fprov" value={f.prov} onChange={(e) => go('prov', e.target.value)}>
            <option value="">Todas las provincias</option>
            {PROVINCES.map((p) => <option key={p.slug}>{p.name}</option>)}
          </select></div>
        <div className="sel"><label className="sr" htmlFor="fcat">Categoría</label>
          <select id="fcat" value={f.cat} onChange={(e) => go('cat', e.target.value)}>
            <option value="">Todas las categorías</option>
            {Object.entries(CATS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select></div>
        <div className="sel"><label className="sr" htmlFor="fsub">Subcategoría</label>
          <select id="fsub" value={f.sub} onChange={(e) => go('sub', e.target.value)}>
            <option value="">Todas las subcategorías</option>
            {subs.map((s) => <option key={s}>{s}</option>)}
          </select></div>
        <div className="sel"><label className="sr" htmlFor="fmun">Municipio</label>
          <select id="fmun" value={f.mun} onChange={(e) => go('mun', e.target.value)}>
            <option value="">Todos los municipios</option>
            {muns.map((s) => <option key={s}>{s}</option>)}
          </select></div>
        <button type="button" className="chip" id="fver" aria-pressed={f.ver === 'ok'} onClick={() => go('ver', f.ver === 'ok' ? '' : 'ok')}>Solo verificadas o comprobadas</button>
        <div className="sel fsort"><label className="sr" htmlFor="ford">Ordenar por</label>
          <select id="ford" value={f.ord} onChange={(e) => go('ord', e.target.value)}>
            <option value="editorial">Selección de la redacción</option>
            <option value="ver">Más verificadas primero</option>
            <option value="az">Nombre (A–Z)</option>
          </select></div>
      </div>
    </div>
  );
}
