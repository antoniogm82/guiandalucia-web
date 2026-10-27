'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { BlogPost } from '@/lib/data';

const STYLES: { name: string; tag: string; slugs: string[] }[] = [
  { name: 'Playas', tag: 'Costa', slugs: ['mejores-playas-de-cadiz', 'mejores-playas-de-granada', 'mejores-playas-de-huelva', 'mejores-playas-cabo-de-gata'] },
  { name: 'Ciudades', tag: 'Ciudad', slugs: ['que-ver-en-granada', 'que-ver-en-sevilla', 'que-ver-en-malaga', 'que-ver-en-jaen'] },
  { name: 'Pueblos y naturaleza', tag: 'Naturaleza', slugs: ['cazorla-jaen', 'frigiliana', 'la-alpujarra-granadina', 'sierra-de-los-filabres'] },
  { name: 'Patrimonio', tag: 'Patrimonio', slugs: ['guia-de-la-alhambra', 'la-mezquita-cordoba', 'que-ver-en-ubeda', 'que-ver-en-baeza'] },
];

export default function BlogStyles({ posts }: { posts: BlogPost[] }) {
  const [k, setK] = useState(0);
  const style = STYLES[k];
  const list = style.slugs.map((s) => posts.find((b) => b.slug === s)).filter((b): b is BlogPost => Boolean(b));
  return (
    <section className="hv-sec" id="hstyle">
      <div className="sec-head">
        <div><h2>Guías para cada estilo de viaje</h2><p>Del blog: ideas para elegir destino.</p></div>
        <Link className="link" href="/blog">Ver el blog</Link>
      </div>
      <div className="xtabs" role="group" aria-label="Estilo de viaje">
        {STYLES.map((s, i) => <button type="button" key={s.name} aria-pressed={i === k} onClick={() => setK(i)}>{s.name}</button>)}
      </div>
      <div className="xcards" id="xcards">
        {list.map((b) => (
          <article className="xcard" key={b.slug}>
            <div className="xci">
              {b.img && <img src={b.img} alt="" width={640} height={480} loading="lazy" decoding="async" />}
              <span className="xpill">{style.tag}</span>
            </div>
            <h3><Link className="stretch" href={`/blog/${b.slug}`}>{b.title}</Link></h3>
            <p className="muted">{b.mins} min de lectura</p>
          </article>
        ))}
      </div>
    </section>
  );
}
