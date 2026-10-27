import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Crumbs from '@/components/Crumbs';
import PlaceCard from '@/components/PlaceCard';
import SaveDestination from '@/components/SaveDestination';
import TopicChips from '@/components/TopicChips';
import { CATS, PLACES } from '@/lib/data';
import { PROVINCES } from '@/lib/nav';

export const dynamicParams = false;
export const generateStaticParams = () => PROVINCES.map((p) => ({ provincia: p.slug }));

const SEE_ALL: Record<string, string> = { alojamientos: 'Ver todos los alojamientos', restaurantes: 'Ver todos los restaurantes', actividades: 'Ver todas las actividades' };
const H2 = { fontFamily: 'var(--display)', fontWeight: 600, letterSpacing: '-.02em' } as const;

const find = async (params: Promise<{ provincia: string }>) => {
  const { provincia } = await params;
  return PROVINCES.find((p) => p.slug === provincia);
};

export async function generateMetadata({ params }: { params: Promise<{ provincia: string }> }): Promise<Metadata> {
  const prov = await find(params);
  if (!prov) return {};
  return {
    title: `Descubre ${prov.name}`,
    description: `Dónde dormir, dónde comer y qué hacer en ${prov.name}, con fichas comprobadas y la fuente de cada dato.`,
    alternates: { canonical: `/${prov.slug}` },
  };
}

export default async function ProvincePage({ params }: { params: Promise<{ provincia: string }> }) {
  const prov = await find(params);
  if (!prov) notFound();
  const name = prov.name;
  const places = PLACES.filter((p) => p.prov === name);
  const granada = name === 'Granada';
  return (
    <div className="wrap">
      <div style={{ paddingTop: 16 }}><Crumbs items={[['Inicio', '/'], ['Andalucía', '/buscar'], [name]]} /></div>
      <div className="hubhero">
        {granada ? (
          <div className="ph"><img src="/img/hero-alhambra-panorama.webp" alt="Panorámica de la Alhambra con Sierra Nevada al fondo" width={1920} height={399} fetchPriority="high" style={{ objectPosition: '50% 40%' }} /><span>Adam Jones · CC BY-SA 3.0</span></div>
        ) : (
          <div className="ph" role="img" aria-label={`Sin foto de ejemplo para ${name}`} style={{ background: 'color-mix(in oklab,var(--mint) 35%,var(--soft))', display: 'grid', placeItems: 'center', fontFamily: 'var(--display)', fontSize: 'clamp(2rem,6vw,4rem)', fontWeight: 700, letterSpacing: '.02em', textTransform: 'uppercase', color: 'var(--fg)' }}>{name}</div>
        )}
        <span className="tag demo" style={{ position: 'absolute', top: 14, left: 14, background: 'var(--card)' }}>Fichas de ejemplo</span>
      </div>
      <div className="hubtxt">
        <div>
          <h1>Descubre {name}</h1>
          <p className="muted" id="hubp" style={{ maxWidth: '70ch', marginTop: 10 }}>Texto de demostración. Aquí irá una introducción propia a la provincia, escrita por la redacción, con lo esencial para decidir qué ver y dónde alojarse.</p>
          <details style={{ marginTop: 6 }}>
            <summary className="link" style={{ cursor: 'pointer', display: 'inline-block', listStyle: 'none' }}>Leer más</summary>
            <p className="muted" style={{ maxWidth: '70ch', marginTop: 8 }}>Segundo párrafo de demostración con datos prácticos de llegada, mejores épocas y zonas.</p>
          </details>
        </div>
        <SaveDestination />
      </div>
      <section style={{ padding: '28px 0 8px' }}>
        <h2 style={{ ...H2, fontSize: '1.4rem' }}>Imprescindibles en {name}</h2>
        <p className="muted" style={{ margin: '2px 0 14px' }}>Elige un tema para filtrar las fichas.</p>
        <TopicChips places={places} />
      </section>
      {Object.entries(CATS).map(([k, v]) => {
        const list = places.filter((p) => p.cat === k);
        return (
          <section style={{ padding: '24px 0 8px' }} key={k}>
            <div className="sec-head" style={{ marginBottom: 14 }}>
              <h2 style={{ ...H2, fontSize: '1.3rem' }}>{v.label} en {name}</h2>
              <Link className="link" href={`/buscar?cat=${k}&prov=${encodeURIComponent(name)}`}>{SEE_ALL[k]}</Link>
            </div>
            {list.length ? <div className="rail">{list.map((p) => <PlaceCard key={p.id} place={p} />)}</div> : <p className="muted">Aún no hay fichas de ejemplo en esta categoría.</p>}
          </section>
        );
      })}
      <div style={{ height: 60 }} />
    </div>
  );
}
