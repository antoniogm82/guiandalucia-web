import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BlogCard from '@/components/blog/BlogCard';
import BlogNewsletter from '@/components/blog/BlogNewsletter';
import BlogShare from '@/components/blog/BlogShare';
import { TocInline, TocSide } from '@/components/blog/BlogToc';
import Crumbs from '@/components/Crumbs';
import { getPostBody } from '@/lib/blog';
import { BLOG } from '@/lib/data';
import { fmtDay } from '@/lib/format';
import { siteUrl } from '@/lib/site';

export const dynamicParams = false;
export const generateStaticParams = () => BLOG.map((b) => ({ slug: b.slug }));

type Props = { params: Promise<{ slug: string }> };
const AUTHOR = 'Redacción de Guía Andalucía';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const b = BLOG.find((x) => x.slug === slug);
  if (!b) return {};
  const body = getPostBody(slug);
  const description = body?.desc || b.excerpt;
  return {
    title: b.title,
    description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { type: 'article', title: b.title, description, publishedTime: b.date, modifiedTime: body?.mod || b.date, images: b.img ? [b.img] : undefined },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const b = BLOG.find((x) => x.slug === slug);
  const body = getPostBody(slug);
  if (!b || !body) notFound();
  const author = b.author && b.author !== 'GUIANDALUCIA' ? b.author : AUTHOR;
  const rel = BLOG.filter((x) => x.slug !== b.slug && x.cat === b.cat).slice(0, 3);
  const modified = body.mod && body.mod !== b.date ? body.mod : '';
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Article', headline: b.title, description: body.desc || b.excerpt,
    datePublished: b.date, dateModified: modified || b.date, image: b.img || undefined,
    author: { '@type': 'Organization', name: 'Guía Andalucía' }, mainEntityOfPage: `${siteUrl}/blog/${slug}`,
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <div className="wrap" style={{ paddingTop: 16 }}><Crumbs items={[['Inicio', '/'], ['Blog', '/blog'], [b.title]]} /></div>
      <article className="wrap bpost" style={{ paddingTop: 0 }}>
        <div className={`bl${body.toc ? '' : ' notoc'}`} id="bl">
          <div className="bpre">
            <header className="bhead">
              <h1>{b.title}</h1>
              <p className="muted"><span className="bby">Por {author} · </span>{b.cat ? `${b.cat} · ` : ''}{fmtDay(b.date)} · {b.mins} min de lectura</p>
              <BlogShare title={b.title} />
            </header>
            {b.img && <div className="bhero"><img src={b.img} alt="" width={1200} height={675} fetchPriority="high" /></div>}
          </div>
          {body.toc && <TocSide items={body.toc} />}
          <div className="bmain">
            {body.toc && <TocInline items={body.toc} />}
            <div className="bbody" id="bbody" dangerouslySetInnerHTML={{ __html: body.html }} />
            <div id="bmeta">
              {body.tags.length > 0 && <p className="btags">{body.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</p>}
              {modified && <p className="muted" style={{ fontSize: '.875rem' }}>Actualizado el {fmtDay(modified)}.</p>}
            </div>
            <div className="bend" id="bend"><BlogShare title={b.title} /></div>
          </div>
          <aside className="bside" aria-label="Sobre este artículo">
            <div className="bav" aria-hidden="true">GA</div>
            <p><small>De:</small><b>{author}</b></p>
            <p><small>Publicado:</small><time dateTime={b.date}>{fmtDay(b.date)}</time></p>
            {modified && <p><small>Actualizado:</small><time dateTime={modified}>{fmtDay(modified)}</time></p>}
            <p><small>Lectura:</small>{b.mins} min</p>
          </aside>
        </div>
        <BlogNewsletter />
      </article>
      {rel.length > 0 ? (
        <section className="wrap" style={{ paddingBlock: '40px 80px' }}>
          <div className="sec-head"><div><h2>Seguir leyendo</h2></div><Link className="link" href="/blog">Ver todo el blog</Link></div>
          <div className="bgrid">{rel.map((x) => <BlogCard key={x.slug} post={x} />)}</div>
        </section>
      ) : <div style={{ height: 80 }} />}
    </>
  );
}
