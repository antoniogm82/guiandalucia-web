import type { Metadata } from 'next';
import Link from 'next/link';
import Crumbs, { type Crumb } from '@/components/Crumbs';
import PlaceRow from '@/components/PlaceRow';
import MapToggle from '@/components/results/MapToggle';
import ResultsFilters from '@/components/results/ResultsFilters';
import ResultsMap from '@/components/results/ResultsMap';
import { slugOf } from '@/lib/data';
import { readFilters, runSearch, type RawParams } from '@/lib/search';

type Props = { searchParams: Promise<RawParams> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const raw = await searchParams;
  const f = readFilters(raw);
  const { title, where } = runSearch(f);
  const filtered = Object.values(raw).some(Boolean);
  return {
    title: `${title} en ${where}`,
    description: `${title} en ${where}: fichas con estado de verificación, fecha de comprobación y mapa.`,
    alternates: { canonical: '/buscar' },
    // Las búsquedas con filtros no se indexan: las portadas de provincia y de categoría cubren esas consultas.
    robots: filtered ? { index: false, follow: true } : undefined,
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const f = readFilters(await searchParams);
  const { list, subs, muns, title, where } = runSearch(f);
  const crumbs: Crumb[] = [['Inicio', '/']];
  if (f.prov) crumbs.push(['Andalucía', '/buscar'], [f.prov, `/${slugOf(f.prov)}`]);
  else if (f.cat) crumbs.push(['Andalucía', '/buscar']);
  crumbs.push([title]);
  const order = f.ord === 'az' ? 'nombre' : f.ord === 'ver' ? 'estado de verificación' : 'selección de la redacción';
  return (
    <>
      <div className="wrap">
        <div className="rhead">
          <Crumbs items={crumbs} />
          <h1>{title} en {where}{f.q ? ` · “${f.q}”` : ''}</h1>
        </div>
      </div>
      <ResultsFilters f={f} subs={subs} muns={muns} />
      <div className="wrap">
        <div className="results">
          <div>
            <h2 className="rcount">{list.length} {list.length === 1 ? 'ficha' : 'fichas'} en {where}</h2>
            <p className="muted" style={{ marginBottom: 4 }} aria-live="polite">Ordenadas por {order}</p>
            <div className="list" id="list">
              {list.length ? list.map((p, i) => <PlaceRow key={p.id} place={p} index={i} />) : (
                <div className="empty">
                  <b>No hay fichas con estos filtros.</b>Quita algún filtro o prueba con una de estas búsquedas:
                  <div className="chips" style={{ justifyContent: 'center', marginTop: 14 }}>
                    <Link className="chip" href="/buscar?cat=restaurantes&sub=Tapas">Tapas</Link>
                    <Link className="chip" href="/buscar?cat=alojamientos&sub=Casas%20cueva">Casas cueva</Link>
                    <Link className="chip" href="/buscar?cat=alojamientos&sub=Con%20encanto%20y%20vistas">Dormir con vistas</Link>
                    <Link className="chip" href="/buscar?cat=actividades&sub=Visitas%20guiadas">Visitas guiadas</Link>
                  </div>
                  <p style={{ marginTop: 14 }}>También puedes leer las <Link className="link" href="/blog">guías del blog</Link> o <Link className="link" href="/anadir">proponer un lugar</Link>.</p>
                </div>
              )}
            </div>
          </div>
          <ResultsMap pins={list.map((p) => ({ id: p.id, name: p.name, sub: p.sub, lat: p.lat, lng: p.lng }))} />
        </div>
      </div>
      <MapToggle />
    </>
  );
}
