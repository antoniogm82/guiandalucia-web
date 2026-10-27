import Link from 'next/link';
import { NAV, NAV_ICONS } from '@/lib/nav';

function Icon({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {id === 'actividades' && <circle cx="12" cy="12" r="9" />}
      {id === 'provincias' && <circle cx="12" cy="10" r="2.5" />}
      <path d={NAV_ICONS[id]} />
    </svg>
  );
}

const Chev = () => (
  <svg className="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
);
const Arrow = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
);

export default function SiteHeader() {
  return (
    <header className="top">
      <div className="capsule glass" id="capsule">
        <Link className="logo" href="/" aria-label="Guía Andalucía, inicio">
          <img src="/img/logo-guiandalucia.svg" alt="Guía Andalucía" width={143} height={40} translate="no" />
        </Link>
        <nav className="main" id="nav" aria-label="Principal">
          <span className="blob" aria-hidden="true" />
          {NAV.map((n) =>
            n.items ? (
              <div className="dd" key={n.id}>
                <button type="button" className="ddbtn" data-nav={n.id} aria-expanded="false" aria-controls={`dd-${n.id}`}>
                  {n.label}
                  <Chev />
                </button>
                <div className="ddpanel" id={`dd-${n.id}`} hidden>
                  <ul>
                    {n.items.map((i) => (
                      <li key={i.href}>
                        <Link className="ddi" href={i.href}>
                          <span className="ic"><Icon id={n.id} /></span>
                          <span><b>{i.title}</b><small>{i.sub}</small></span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link className="ddall" href={n.href}>{n.all}<Arrow /></Link>
                </div>
              </div>
            ) : (
              <Link href={n.href} data-nav={n.id} key={n.id}>{n.label}</Link>
            ),
          )}
        </nav>
        <div className="actions">
          <Link className="icon-btn" href="/buscar" aria-label="Buscar">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          </Link>
          <Link className="icon-btn" href="/guardados" aria-label="Fichas guardadas">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21C12 21 3 15.5 3 9.2 3 6.3 5.2 4.5 7.5 4.5c1.9 0 3.5 1 4.5 2.7 1-1.7 2.6-2.7 4.5-2.7 2.3 0 4.5 1.8 4.5 4.7C21 15.5 12 21 12 21z" />
            </svg>
            <span className="count" id="savedCount">0</span>
          </Link>
          <Link className="btn sm dark" href="/anadir" aria-label="Añadir un lugar, plan o negocio">Añadir</Link>
          <button type="button" className="menu-btn" id="menu" aria-label="Abrir menú" aria-expanded="false" aria-controls="mpanel">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16M4 16h16" /></svg>
          </button>
        </div>
        <div className="mpanel" id="mpanel" hidden>
          {NAV.map((n) =>
            n.items ? (
              <details className="mgrp" key={n.id}>
                <summary>{n.label}<Chev /></summary>
                <ul>
                  {n.items.map((i) => (<li key={i.href}><Link href={i.href}>{i.title}</Link></li>))}
                  <li><Link href={n.href}>{n.all}</Link></li>
                </ul>
              </details>
            ) : (
              <Link className="mlink" href={n.href} key={n.id}>{n.label}</Link>
            ),
          )}
          <Link className="mlink" href="/guardados">Fichas guardadas</Link>
          <Link className="btn dark" href="/anadir" aria-label="Añadir un lugar, plan o negocio">Añadir</Link>
        </div>
      </div>
    </header>
  );
}
