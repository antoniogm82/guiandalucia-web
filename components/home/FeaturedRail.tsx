'use client';

import Link from 'next/link';
import { useRef } from 'react';
import SaveButton from '@/components/SaveButton';
import StatusLabel from '@/components/StatusLabel';
import StatusSymbol from '@/components/StatusSymbol';
import { altFor, imgSrc, STATUS, type Place } from '@/lib/data';

// Carrusel de destacados: tarjetas grandes con foto y sello del estado de verificación.
export default function FeaturedRail({ places }: { places: Place[] }) {
  const rail = useRef<HTMLDivElement>(null);
  return (
    <div className="fx-wrap">
      <div className="rail fx-rail" id="featRail" ref={rail}>
        {places.map((p) => (
          <article className="fcard" data-id={p.id} key={p.id}>
            <div className="fph">
              {p.img ? <img src={imgSrc(p.img)} alt={altFor(p.img)} width={1280} height={960} loading="lazy" decoding="async" /> : <div className="fnp" aria-hidden="true">{p.prov}</div>}
              <SaveButton id={p.id} name={p.name} />
              <span className="fbadge" title={STATUS[p.status].t}><StatusSymbol status={p.status} /></span>
            </div>
            <span className="fprov">{p.prov}</span>
            <h3><Link className="stretch" href={`/ficha/${p.id}`}>{p.name}</Link></h3>
            <p className="meta">{p.sub} · {p.bar}, {p.mun}</p>
            <div className="fst"><StatusLabel status={p.status} /><span className="tag demo">Demo</span></div>
          </article>
        ))}
      </div>
      <button type="button" className="rail-next" id="featNext" aria-label="Ver más destacados"
        onClick={() => rail.current?.scrollBy({ left: rail.current.clientWidth * 0.8, behavior: 'smooth' })}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
      </button>
    </div>
  );
}
