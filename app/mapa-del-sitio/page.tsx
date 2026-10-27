import type { Metadata } from 'next';
import Link from 'next/link';
import InfoPage from '@/components/InfoPage';
import { PROVINCES } from '@/lib/nav';

export const metadata: Metadata = { title: 'Mapa del sitio', alternates: { canonical: '/mapa-del-sitio' } };

export default function Page() {
  return (
    <InfoPage title="Mapa del sitio">
      <h2>Explorar</h2>
      <ul>
        <li><Link className="link" href="/">Inicio</Link></li>
        <li><Link className="link" href="/buscar">Todas las fichas de Andalucía</Link></li>
        <li><Link className="link" href="/buscar?cat=alojamientos">Dónde dormir</Link></li>
        <li><Link className="link" href="/buscar?cat=restaurantes">Dónde comer</Link></li>
        <li><Link className="link" href="/buscar?cat=actividades">Qué hacer</Link></li>
        <li><Link className="link" href="/guardados">Fichas guardadas</Link></li>
      </ul>
      <h2>Provincias</h2>
      <ul>{PROVINCES.map((p) => (<li key={p.slug}><Link className="link" href={`/${p.slug}`}>{p.name}</Link></li>))}</ul>
      <h2>Confianza y negocios</h2>
      <ul>
        <li><Link className="link" href="/como-verificamos">Cómo verificamos</Link></li>
        <li><Link className="link" href="/anadir">Añadir una ficha</Link></li>
        <li><Link className="link" href="/reclamar">Reclamar o corregir una ficha</Link></li>
        <li><Link className="link" href="/destacar">Destacar tu ficha</Link></li>
        <li><Link className="link" href="/creditos">Créditos de las fotos</Link></li>
      </ul>
      <h2>La web</h2>
      <ul>
        <li><Link className="link" href="/quienes-somos">Quiénes somos</Link></li>
        <li><Link className="link" href="/contacto">Contacto</Link></li>
        <li><Link className="link" href="/aviso-legal">Aviso legal</Link></li>
        <li><Link className="link" href="/politica-de-privacidad">Política de privacidad</Link></li>
        <li><Link className="link" href="/politica-de-cookies">Política de cookies</Link></li>
      </ul>
      <h2>Blog</h2>
      <ul><li><Link className="link" href="/blog">Todas las guías del blog</Link></li></ul>
    </InfoPage>
  );
}
