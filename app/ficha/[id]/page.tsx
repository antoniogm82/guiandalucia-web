import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AnchorNav from '@/components/ficha/AnchorNav';
import ClaimForm from '@/components/ficha/ClaimForm';
import ContactPanel from '@/components/ficha/ContactPanel';
import Gallery from '@/components/ficha/Gallery';
import RecentTracker from '@/components/ficha/RecentTracker';
import Crumbs from '@/components/Crumbs';
import PlaceCard from '@/components/PlaceCard';
import StatusLabel from '@/components/StatusLabel';
import { CATS, PLACES, placeById, slugOf, STATUS } from '@/lib/data';
import { photosFor } from '@/lib/photos';

export const dynamicParams = false;
export const generateStaticParams = () => PLACES.map((p) => ({ id: p.id }));

const fmtDate = (s: string) => new Intl.DateTimeFormat('es', { month: 'long', year: 'numeric' }).format(new Date(`${s}-01T12:00:00`));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const p = placeById((await params).id);
  if (!p) return {};
  return {
    title: p.name,
    description: `${p.name}: ${p.sub} en ${p.bar}, ${p.mun}. Ficha con estado de verificación, datos prácticos y la fuente de cada dato.`,
    alternates: { canonical: `/ficha/${p.id}` },
  };
}

export default async function FichaPage({ params }: { params: Promise<{ id: string }> }) {
  const p = placeById((await params).id);
  if (!p) notFound();
  const sim = PLACES.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);
  const prov = encodeURIComponent(p.prov);
  return (
    <div className="wrap">
      <RecentTracker id={p.id} />
      <div className="fhead">
        <Crumbs items={[
          ['Inicio', '/'], ['Andalucía', '/buscar'], [p.prov, `/${slugOf(p.prov)}`],
          [CATS[p.cat].label, `/buscar?cat=${p.cat}&prov=${prov}`],
          [p.sub, `/buscar?cat=${p.cat}&sub=${encodeURIComponent(p.sub)}&prov=${prov}`],
          [p.name],
        ]} />
        <h1>{p.name}</h1>
        <div className="sub">
          <span>{p.bar}, {p.mun}{p.mun === p.prov ? '' : ` (${p.prov})`}</span>
          <StatusLabel status={p.status} />
          {p.ad && <span className="tag ad">Patrocinado</span>}
          <span className="tag demo">Demo</span>
        </div>
      </div>
      {p.img ? <Gallery photos={photosFor(p)} /> : (
        <div className="gallery" aria-label="Fotos">
          <div className="gnp" role="img" aria-label={`Foto pendiente de ${p.name}`}><b>{p.prov}</b><span>Foto pendiente</span></div>
        </div>
      )}
      <div className="fgrid">
        <div>
          <AnchorNav />
          <div className="fsec" id="sec-resumen"><h2>Sobre este sitio</h2><p>{p.blurb}</p></div>
          <div className="fsec" id="sec-datos"><h2>Datos prácticos</h2>
            <dl className="facts">{p.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          </div>
          <div className="fsec" id="sec-verif"><h2>De dónde sale esta información</h2>
            <div className="trust">
              <StatusLabel status={p.status} />
              <p className="muted">{STATUS[p.status].d}</p>
              <p className="muted mono">Fuente: {p.src} · Comprobada: {fmtDate(p.checked)}</p>
            </div>
          </div>
          <div className="fsec" id="sec-ubic"><h2>Cómo llegar</h2>
            <div className="ph" style={{ aspectRatio: '16/7', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}><span>Mapa en la versión real</span></div>
          </div>
          <div className="fsec" id="sec-claim"><ClaimForm /></div>
        </div>
        <aside className="side"><ContactPanel id={p.id} /></aside>
      </div>
      <section className="block" style={{ border: 0, paddingTop: 0 }}>
        <div className="sec-head"><h2>Más como esta</h2></div>
        <div className="grid">{sim.map((x) => <PlaceCard key={x.id} place={x} />)}</div>
      </section>
    </div>
  );
}
