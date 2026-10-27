// Genera content/redirects.json a partir de los sitemaps de WordPress: una redirección 301 por dirección antigua.
// Uso: node scripts/redirecciones.mjs   (necesita conexión a internet)
import { writeFileSync, readFileSync } from 'node:fs';

const WP = 'https://guiandalucia.es';
const locs = async (file) => [...(await (await fetch(`${WP}/${file}`)).text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);

const blog = JSON.parse(readFileSync(new URL('../content/blog.json', import.meta.url), 'utf8'));
const slugs = new Set(blog.map((b) => b.slug));
const provinces = ['almeria', 'cadiz', 'cordoba', 'granada', 'huelva', 'jaen', 'malaga', 'sevilla'];

const rules = [];
const missing = [];
for (const path of await locs('post-sitemap.xml')) {
  if (path === '/') continue;
  const slug = path.replace(/\/$/, '').split('/').pop();
  if (slugs.has(slug)) rules.push({ source: path.replace(/\/$/, ''), destination: `/blog/${slug}` });
  else missing.push(path);
}
for (const path of await locs('category-sitemap.xml')) {
  const clean = path.replace(/\/$/, '');
  const last = clean.split('/').pop();
  rules.push({ source: clean, destination: provinces.includes(last) ? `/${last}` : '/blog' });
}
// Páginas que cambian de dirección o de formato.
rules.push({ source: '/feed', destination: '/blog' }, { source: '/tag/:slug*', destination: '/blog' });

writeFileSync(new URL('../content/redirects.json', import.meta.url), JSON.stringify(rules, null, 1));
console.log(`${rules.length} redirecciones. Sin equivalente en el blog: ${missing.length}`, missing);
