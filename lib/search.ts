import { CATS, PLACES, type Place, type Status } from '@/lib/data';

export type RawParams = Record<string, string | string[] | undefined>;
export type Filters = { cat: string; sub: string; mun: string; bar: string; q: string; ver: string; prov: string; ord: string };

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';

export function readFilters(raw: RawParams): Filters {
  return {
    cat: one(raw.cat), sub: one(raw.sub), mun: one(raw.mun), bar: one(raw.bar), q: one(raw.q).trim(),
    ver: one(raw.ver), prov: one(raw.prov), ord: one(raw.ord) || 'editorial',
  };
}

const RANK: Record<Status, number> = { business: 0, editorial: 1, external: 2, pending: 3 };

export function runSearch(f: Filters) {
  const base = PLACES.filter((p) => (!f.cat || p.cat === f.cat) && (!f.prov || p.prov === f.prov));
  const subs = [...new Set(base.map((p) => p.sub))];
  const muns = [...new Set(PLACES.filter((p) => !f.prov || p.prov === f.prov).map((p) => p.mun))];
  const list: Place[] = PLACES.filter(
    (p) =>
      (!f.cat || p.cat === f.cat) && (!f.prov || p.prov === f.prov) && (!f.sub || p.sub === f.sub) &&
      (!f.mun || p.mun === f.mun) && (!f.bar || p.bar === f.bar) &&
      (!f.ver || (f.ver === 'ok' ? p.status === 'business' || p.status === 'editorial' : p.status === f.ver)) &&
      (!f.q || `${p.name} ${p.sub} ${p.bar} ${p.mun}`.toLowerCase().includes(f.q.toLowerCase())),
  );
  if (f.ord === 'az') list.sort((a, b) => a.name.localeCompare(b.name, 'es'));
  else if (f.ord === 'ver') list.sort((a, b) => RANK[a.status] - RANK[b.status]);
  const title = f.cat ? CATS[f.cat]?.label ?? 'Todas las fichas' : 'Todas las fichas';
  const where = f.bar || f.mun || f.prov || 'Andalucía';
  return { list, subs, muns, title, where };
}
