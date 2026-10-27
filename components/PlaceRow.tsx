import Link from 'next/link';
import { altFor, imgSrc, type Place } from '@/lib/data';
import SaveButton from '@/components/SaveButton';
import StatusLabel from '@/components/StatusLabel';

const fmtDate = (s: string) => new Intl.DateTimeFormat('es', { month: 'long', year: 'numeric' }).format(new Date(`${s}-01T12:00:00`));

export default function PlaceRow({ place: p, index }: { place: Place; index: number }) {
  return (
    <article className="row" data-id={p.id}>
      <div className="ph">
        {p.img ? (<><img src={imgSrc(p.img)} alt={altFor(p.img)} width={1280} height={960} loading="lazy" decoding="async" /><span>Foto de ejemplo</span></>) : <span>Foto pendiente</span>}
        <SaveButton id={p.id} name={p.name} />
      </div>
      <div className="body">
        <div className="tags">{p.ad && <span className="tag ad">Patrocinado</span>}<span className="tag">{p.sub}</span><span className="tag demo">Demo</span></div>
        <h3><Link className="stretch" href={`/ficha/${p.id}`}>{index + 1}. {p.name}</Link></h3>
        <div className="meta muted">{p.bar}, {p.mun}</div>
        <div><StatusLabel status={p.status} /> <span className="muted mono" style={{ marginLeft: 8 }}>{fmtDate(p.checked)}</span></div>
        <p>{p.blurb}</p>
      </div>
    </article>
  );
}
