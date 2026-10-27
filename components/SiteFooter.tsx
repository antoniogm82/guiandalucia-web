import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer>
      <div className="wrap cols">
        <div>
          <div className="logo" style={{ marginBottom: 12 }}>
            <img src="/img/logo-guiandalucia.svg" alt="Guía Andalucía" width={107} height={30} translate="no" />
          </div>
          <p style={{ maxWidth: '34ch' }}>Guía independiente para encontrar qué hacer, dónde dormir y dónde comer en Andalucía.</p>
        </div>
        <div>
          <h2 className="fh">Explorar</h2>
          <Link href="/buscar?cat=alojamientos">Dónde dormir</Link>
          <Link href="/buscar?cat=restaurantes">Dónde comer</Link>
          <Link href="/buscar?cat=actividades">Qué hacer</Link>
          <Link href="/blog">Blog</Link>
        </div>
        <div>
          <h2 className="fh">Confianza</h2>
          <Link href="/como-verificamos">Cómo verificamos</Link>
          <Link href="/como-verificamos">Publicidad y patrocinios</Link>
          <Link href="/reclamar">Corregir una ficha</Link>
          <Link href="/creditos">Créditos de las fotos</Link>
        </div>
        <div>
          <h2 className="fh">Negocios</h2>
          <Link href="/anadir">Añadir tu negocio</Link>
          <Link href="/reclamar">Reclamar una ficha</Link>
          <Link href="/destacar">Destacar tu ficha</Link>
        </div>
      </div>
      <div className="wrap fine">
        <p>Contrastamos los datos con el Registro de Turismo de Andalucía, OpenStreetMap y la web de cada negocio.</p>
        <nav aria-label="Información legal">
          <Link href="/aviso-legal">Aviso legal</Link>
          <Link href="/politica-de-privacidad">Política de privacidad</Link>
          <Link href="/politica-de-cookies">Política de cookies</Link>
          <Link href="/quienes-somos">Quiénes somos</Link>
          <Link href="/contacto">Contacto</Link>
          <Link href="/mapa-del-sitio">Mapa del sitio</Link>
          <Link href="/creditos">Créditos de las fotos</Link>
        </nav>
      </div>
    </footer>
  );
}
