import Link from 'next/link';
import { altFor, imgSrc, type Place } from '@/lib/data';
import SaveButton from '@/components/SaveButton';
import StatusLabel from '@/components/StatusLabel';

export default function PlaceCard({ place: p }: { place: Place }) {
  return (
    <article className="card" data-id={p.id}>
      <div className="ph">
        {p.img ? (<><img src={imgSrc(p.img)} alt={altFor(p.img)} width={1280} height={960} loading="lazy" decoding="async" /><span>Foto de ejemplo</span></>) : <span>Foto pendiente</span>}
        <SaveButton id={p.id} name={p.name} />
      </div>
      <div>
        <h3><Link className="stretch" href={`/ficha/${p.id}`}>{p.name}</Link></h3>
        <p className="meta">{p.sub} · {p.bar}, {p.mun}</p>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <StatusLabel status={p.status} />
        {p.ad && <span className="tag ad">Patrocinado</span>}
        <span className="tag demo">Demo</span>
      </div>
    </article>
  );
}
