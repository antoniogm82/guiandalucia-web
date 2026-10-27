import Link from 'next/link';
import BodyClass from '@/components/home/BodyClass';
import BlogStyles from '@/components/home/BlogStyles';
import FeaturedRail from '@/components/home/FeaturedRail';
import Newsletter from '@/components/home/Newsletter';
import ProvinceMap from '@/components/home/ProvinceMap';
import RecentActivity from '@/components/home/RecentActivity';
import SearchCard from '@/components/home/SearchCard';
import VerifBand from '@/components/home/VerifBand';
import PlaceCard from '@/components/PlaceCard';
import { BLOG, okPlaces, PLACES } from '@/lib/data';
import { buildMapData } from '@/lib/map';

const TILES: [string, string, string, string][] = [
  ['albaicin-calle-carmen-estrellas', 'Calle del Albaicín con la Alhambra al fondo', 'Dormir con vistas', '/buscar?cat=alojamientos&sub=Con%20encanto%20y%20vistas'],
  ['guadix-panoramica', 'Panorámica de Guadix con sus casas cueva', 'Casas cueva', '/buscar?cat=alojamientos&sub=Casas%20cueva'],
  ['capileira-alpujarra', 'Capileira, pueblo blanco de la Alpujarra', 'Rural en la Alpujarra', '/buscar?cat=alojamientos&sub=Rural%20en%20la%20Alpujarra'],
  ['tapas-pulpo-seco-motril', 'Tapa de pulpo seco', 'Tapas', '/buscar?cat=restaurantes&sub=Tapas'],
  ['sacromonte-museo-cuevas', 'Casas cueva del Sacromonte', 'Visitas guiadas', '/buscar?cat=actividades&sub=Visitas%20guiadas'],
];

// Destacados: primero las fichas verificadas con foto propia (sin repetir foto) y después una por provincia.
function featured() {
  const ok = PLACES.filter((p) => p.status === 'business' || p.status === 'editorial');
  const photos = new Set<string>();
  const withPhoto = ok.filter((p) => p.img && !photos.has(p.img) && photos.add(p.img));
  const provinces = new Set<string>();
  const without = ok.filter((p) => !p.img && !provinces.has(p.prov) && provinces.add(p.prov));
  return [...withPhoto, ...without].slice(0, 10);
}

const FAQ: [string, string][] = [
  ['¿Qué significa que una ficha esté verificada?', 'Que hemos confirmado el nombre, la dirección y el contacto con el negocio o con fuentes oficiales, y que mostramos la fecha de la última comprobación.'],
  ['¿Hay reseñas o estrellas?', 'No. Cada ficha muestra su estado de verificación, la fecha y la fuente de sus datos.'],
  ['¿Qué provincias cubrís?', 'Las ocho de Andalucía: Almería, Cádiz, Córdoba, Granada, Huelva, Jaén, Málaga y Sevilla.'],
  ['¿Cuesta publicar mi negocio?', 'Publicar es gratis y revisamos la ficha antes de publicarla. Destacar es opcional, de pago y siempre aparece marcado como patrocinado.'],
];

export default function Home() {
  const map = buildMapData();
  return (
    <div className="wrap">
      <BodyClass name="is-home" />
      <section className="xhero">
        <h1>¿Qué hacer en Andalucía?</h1>
        <SearchCard />
      </section>

      <section className="hv-sec mapa-top">
        <div className="mapa-wrap">
          <div className="mapa-svg" id="msvg"><ProvinceMap map={map} /></div>
          <div className="mapa-side">
            <h2>Elige destino</h2>
            <p>Elige una provincia para ver sus planes. Todas tienen fichas de ejemplo para que veas cómo queda la guía.</p>
            <ul className="mapa-leg" aria-label="Leyenda del mapa">
              <li><span className="sw sw-d" aria-hidden="true" />Provincia seleccionada · cambia al pasar el ratón</li>
              <li><span className="dt-sw" aria-hidden="true" />Cada punto es una ficha de ejemplo</li>
            </ul>
            <Link className="link" href="/buscar">Ver todas las fichas</Link>
            <p className="hs-cr">Contornos © colaboradores de OpenStreetMap (ODbL). Los puntos son fichas de ejemplo.</p>
          </div>
        </div>
      </section>

      <RecentActivity />

      <section className="hv-sec">
        <div className="sec-head">
          <div><h2>Selección de la redacción</h2><p>Fichas de toda Andalucía revisadas por nosotros. El orden no es una clasificación.</p></div>
          <Link className="link" href="/buscar">Ver todas</Link>
        </div>
        <div className="rail">{okPlaces().slice(0, 8).map((p) => <PlaceCard key={p.id} place={p} />)}</div>
      </section>

      <section className="hv-sec">
        <div className="sec-head"><div><h2>Busca según lo que te apetece</h2><p>Atajos a las búsquedas que más se repiten.</p></div></div>
        <div className="xtiles">
          {TILES.map(([img, alt, label, href]) => (
            <Link className="xtile" href={href} key={img}>
              <img src={`/img/${img}.webp`} alt={alt} width={640} height={800} loading="lazy" /><span>{label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="hv-sec">
        <div className="sec-head">
          <div><h2>Destacados de la redacción</h2><p>Alojamientos, bares y planes que merece la pena mirar. El orden no es una clasificación.</p></div>
          <Link className="link" href="/buscar">Ver todas</Link>
        </div>
        <FeaturedRail places={featured()} />
      </section>

      <BlogStyles posts={BLOG} />
      <Newsletter />
      <VerifBand />

      <section className="hv-sec">
        <div className="sec-head"><div><h2>Preguntas frecuentes</h2></div></div>
        <div className="xfaq">
          {FAQ.map(([q, a]) => (<details key={q}><summary>{q}</summary><p>{a}</p></details>))}
        </div>
      </section>
    </div>
  );
}
