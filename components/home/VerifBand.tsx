import Link from 'next/link';
import StatusSymbol from '@/components/StatusSymbol';
import { STATUS, type Status } from '@/lib/data';

const ORDER: Status[] = ['pending', 'external', 'editorial', 'business'];

export default function VerifBand() {
  return (
    <section className="hv-sec">
      <div className="sec-head">
        <div><h2>Cuatro estados, uno por ficha</h2><p>Nunca mostramos una ficha sin decir en cuál está.</p></div>
        <Link className="link" href="/como-verificamos">Cómo verificamos</Link>
      </div>
      <ol className="vb2">
        {ORDER.map((k, i) => (
          <li className={`vs s-${k}`} key={k}>
            <div className="vs-top"><span className="vs-n">{i + 1}</span><StatusSymbol status={k} size={40} /></div>
            <h3>{STATUS[k].t}</h3>
            <p>{STATUS[k].d}</p>
            <span className="vs-f">{k === 'pending' ? 'No se indexa' : 'Se muestra con fecha y fuente'}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
