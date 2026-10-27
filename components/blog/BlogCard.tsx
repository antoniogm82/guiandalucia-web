import Link from 'next/link';
import { fmtDay } from '@/lib/format';
import type { BlogPost } from '@/lib/data';

export default function BlogCard({ post: b }: { post: BlogPost }) {
  return (
    <article className="bcard">
      <div className="bph">{b.img && <img src={b.img} alt="" width={640} height={400} loading="lazy" decoding="async" />}</div>
      <div className="bt">
        {b.cat && <span className="tag">{b.cat}</span>}
        <h2><Link className="stretch" href={`/blog/${b.slug}`}>{b.title}</Link></h2>
        <p className="bex">{b.excerpt}</p>
        <small className="muted">{fmtDay(b.date)} · {b.mins} min de lectura</small>
      </div>
    </article>
  );
}
