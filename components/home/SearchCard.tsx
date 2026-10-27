'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import search from '@/content/search.json';
import { DEST } from '@/lib/data';

type Field = { type: string; name: string; label: string; icon: string; options?: string[]; placeholder?: string };
const TABS = search.tabs as { cat: string; sub: string; icon: string; label: string }[];
const FIELDS = search.fields as Record<string, Field[]>;

export default function SearchCard() {
  const router = useRouter();
  const uid = useId();
  const boxRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState(0);
  const [dest, setDest] = useState('');
  const [chosen, setChosen] = useState<(typeof DEST)[number] | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const [sel, setSel] = useState(-1);
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [maxH, setMaxH] = useState(300);

  const q = dest.trim().toLowerCase();
  const items = DEST.filter((d) => !q || d.n.toLowerCase().includes(q));

  const fit = () => {
    const f = destRef.current?.closest('.field')?.getBoundingClientRect();
    if (f) setMaxH(Math.max(180, innerHeight - f.bottom - 24));
  };
  useEffect(() => {
    if (!open) return;
    fit();
    addEventListener('scroll', fit, { passive: true });
    addEventListener('resize', fit);
    return () => { removeEventListener('scroll', fit); removeEventListener('resize', fit); };
  }, [open]);

  const pick = (d: (typeof DEST)[number]) => {
    setChosen(d); setDest(d.n); setListOpen(false);
    (boxRef.current?.querySelector('.xmore :is(input,select)') as HTMLElement | null)?.focus();
  };

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const match = chosen ?? DEST.find((d) => d.n.toLowerCase() === dest.trim().toLowerCase()) ?? null;
    const p = new URLSearchParams();
    const t = TABS[tab];
    if (t.cat) p.set('cat', t.cat);
    if (t.sub) p.set('sub', t.sub);
    if (match) Object.entries(match.q).forEach(([k, v]) => v && p.set(k, v));
    for (const f of FIELDS[tab]) {
      const v = (values[`${tab}.${f.name}`] ?? '').trim();
      if (!v) continue;
      p.set(f.type === 't' ? 'q' : f.name, v);
    }
    (document.activeElement as HTMLElement | null)?.blur();
    setOpen(false);
    router.push(`/buscar?${p.toString()}`);
  }

  return (
    <>
      <div className={`xs search${open ? ' open' : ''}`} id="search" ref={boxRef}>
        <div className="tabs" role="group" aria-label="Qué buscas">
          {TABS.map((t, i) => (
            <button key={t.label} type="button" className="tab" aria-pressed={i === tab} onClick={() => setTab(i)}>
              <i className={`ph-light ${t.icon}`} aria-hidden="true" />{t.label}
            </button>
          ))}
        </div>
        <form
          className="bar" id="sform" role="search" autoComplete="off" onSubmit={onSubmit}
          onFocus={() => { if (!open) { setOpen(true); if ((boxRef.current?.getBoundingClientRect().top ?? 0) > 150) boxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }}
          onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false); }}
        >
          <div className="field">
            <i className="ph-light ph-map-pin" aria-hidden="true" /><label htmlFor={`${uid}-dest`}>Dónde</label>
            <input
              id={`${uid}-dest`} ref={destRef} type="text" role="combobox" aria-expanded={listOpen} aria-controls={`${uid}-sugg`}
              aria-autocomplete="list" aria-activedescendant={sel > -1 ? `${uid}-opt-${sel}` : undefined} placeholder="Municipio o zona" value={dest}
              onFocus={() => { setListOpen(true); setSel(-1); }}
              onChange={(e) => { setDest(e.target.value); setChosen(null); setListOpen(true); setSel(-1); }}
              onBlur={() => setTimeout(() => setListOpen(false), 120)}
              onKeyDown={(e) => {
                if (!listOpen || !items.length) return;
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => (s + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length); }
                else if (e.key === 'Enter' && sel > -1) { e.preventDefault(); pick(items[sel]); }
                else if (e.key === 'Escape') { setListOpen(false); destRef.current?.blur(); }
              }}
            />
            <ul className="sugg" id={`${uid}-sugg`} role="listbox" hidden={!listOpen} style={{ maxHeight: maxH }}>
              {items.length ? (
                <>
                  <li className="head">{q ? 'Destinos' : 'Destinos frecuentes'}</li>
                  {items.map((d, i) => (
                    <li key={d.n} role="presentation">
                      <button type="button" role="option" id={`${uid}-opt-${i}`} aria-selected={i === sel} onMouseDown={(e) => { e.preventDefault(); pick(d); }}>
                        {d.n}<small>{d.t}</small>
                      </button>
                    </li>
                  ))}
                </>
              ) : (
                <li className="head">Aún no tenemos “{dest}”. Prueba con una provincia, un municipio o un barrio.</li>
              )}
            </ul>
          </div>
          <div className="xmore" id="xmore">
            {FIELDS[tab].map((f) => {
              const id = `${uid}-${tab}-${f.name}`;
              const key = `${tab}.${f.name}`;
              const val = values[key] ?? '';
              const set = (v: string) => setValues((s) => ({ ...s, [key]: v }));
              return (
                <div className="field" key={key}>
                  <i className={`ph-light ${f.icon}`} aria-hidden="true" /><label htmlFor={id}>{f.label}</label>
                  {f.type === 't' && <input id={id} type="text" placeholder={f.placeholder} value={val} onChange={(e) => set(e.target.value)} />}
                  {f.type === 'd' && <input id={id} type="date" value={val} onChange={(e) => set(e.target.value)} />}
                  {f.type === 's' && (
                    <select id={id} value={val} onChange={(e) => set(e.target.value)}>
                      {f.options!.map((o) => <option key={o} value={o === 'Cualquiera' ? '' : o}>{o}</option>)}
                    </select>
                  )}
                </div>
              );
            })}
          </div>
          <button className="go" type="submit">Buscar</button>
        </form>
      </div>
      <div className={`scrim${open ? ' on' : ''}`} onClick={() => { (document.activeElement as HTMLElement | null)?.blur(); setOpen(false); }} />
    </>
  );
}
