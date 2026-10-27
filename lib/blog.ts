import 'server-only';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export type TocItem = { id: string; text: string; sub: boolean };
export type PostBody = { html: string; tags: string[]; mod: string; desc: string; toc: TocItem[] | null };

const stripTags = (s: string) => s.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&#8217;|&rsquo;/g, '’').replace(/\s+/g, ' ').trim();

// Lee el cuerpo de una entrada, pone identificador a los títulos y construye el índice del artículo.
export function getPostBody(slug: string): PostBody | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  let raw: { html: string; tags?: string[]; mod?: string; desc?: string };
  try { raw = JSON.parse(readFileSync(join(process.cwd(), 'content/blog', `${slug}.json`), 'utf8')); } catch { return null; }

  const used = new Set<string>();
  const toc: TocItem[] = [];
  const html = raw.html.replace(/<(h[23])([^>]*)>([\s\S]*?)<\/\1>/g, (_m, tag: string, attrs: string, inner: string) => {
    const text = stripTags(inner);
    const base = 's-' + text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
    let id = base, k = 2;
    while (used.has(id)) id = `${base}-${k++}`;
    used.add(id);
    toc.push({ id, text, sub: tag === 'h3' });
    return `<${tag}${attrs.replace(/\sid="[^"]*"/, '')} id="${id}">${inner}</${tag}>`;
  });
  return { html, tags: raw.tags ?? [], mod: raw.mod ?? '', desc: raw.desc ?? '', toc: toc.length >= 3 ? toc : null };
}
