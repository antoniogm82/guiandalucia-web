'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import schemaData from '@/content/add-schema.json';

type FieldDef = { k: string; n: string; l: string; r?: number; w?: number; o?: string[]; h?: string; max?: number; min?: number };
type TypeDef = { id: string; label: string; sub: string; icon: string };
const TYPES = schemaData.types as TypeDef[];
const SCHEMA = schemaData.schema as unknown as Record<string, { t: string; f: FieldDef[] }>;
const PH = schemaData.photos;

type Photo = { name: string; size: number; w: number; h: number; url: string };
const INPUT_TYPE: Record<string, string> = { t: 'text', e: 'email', p: 'tel', u: 'url', n: 'number' };

const Opt = () => <span className="af-opt">opcional</span>;

function Field({ f, counts, setCount }: { f: FieldDef; counts: Record<string, number>; setCount: (id: string, n: number) => void }) {
  const id = `af-${f.n}`;
  const hint = f.h ? <small id={`${id}-h`}>{f.h}</small> : null;
  const describe = f.h ? `${id}-h` : undefined;
  const wide = f.w ? { gridColumn: '1/-1' } : undefined;

  if (f.k === 'c') {
    return (
      <fieldset className="af-checks" style={wide}>
        <legend>{f.l}{!f.r && <> <Opt /></>}</legend>
        {f.o!.map((o) => (
          <label className="af-check" key={o}><input type="checkbox" name={f.n} value={o} required={!!f.r} /><span>{o}</span></label>
        ))}
      </fieldset>
    );
  }
  const label = <label htmlFor={id}>{f.l}{!f.r && <> <Opt /></>}</label>;
  let control: React.ReactNode;
  if (f.k === 's') {
    control = (
      <select id={id} name={f.n} required={!!f.r} aria-describedby={describe}>
        {f.r ? <option value="">Elige una opción</option> : null}
        {f.o!.map((o) => <option key={o}>{o}</option>)}
      </select>
    );
  } else if (f.k === 'a') {
    const max = f.max ?? 600;
    control = (
      <>
        <textarea id={id} name={f.n} required={!!f.r} aria-describedby={describe} maxLength={max} rows={5} onInput={(e) => setCount(id, e.currentTarget.value.length)} />
        <small className="af-cnt" aria-live="off">{counts[id] ?? 0} / {max}</small>
      </>
    );
  } else {
    control = (
      <input
        id={id} name={f.n} type={INPUT_TYPE[f.k]} required={!!f.r} aria-describedby={describe}
        {...(f.k === 'u' ? { placeholder: 'https://…', spellCheck: false, autoComplete: 'url' } : {})}
        {...(f.k === 'p' ? { autoComplete: 'tel', inputMode: 'tel' as const } : {})}
        {...(f.k === 'n' ? { inputMode: 'numeric' as const, min: f.min ?? 0 } : {})}
      />
    );
  }
  return <div className="af-f" style={wide}>{label}{control}{hint}</div>;
}

const readSize = (file: File) =>
  new Promise<{ w: number; h: number; url: string } | null>((res) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => res({ w: img.naturalWidth, h: img.naturalHeight, url });
    img.onerror = () => { URL.revokeObjectURL(url); res(null); };
    img.src = url;
  });

// Formulario para añadir una ficha: los campos cambian según lo que se sube. De momento no envía nada.
export default function AddForm() {
  const form = useRef<HTMLFormElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const typesBox = useRef<HTMLFieldSetElement>(null);
  const doneBox = useRef<HTMLElement>(null);
  const [tipo, setTipo] = useState('');
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoErrors, setPhotoErrors] = useState<string[]>([]);
  const [over, setOver] = useState(false);
  const [summary, setSummary] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [wantsNews, setWantsNews] = useState(false);
  const calm = () => matchMedia('(prefers-reduced-motion:reduce)').matches;

  useEffect(() => () => photos.forEach((p) => URL.revokeObjectURL(p.url)), []); // eslint-disable-line react-hooks/exhaustive-deps

  function choose(id: string) {
    setTipo(id);
    setCounts({});
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      form.current?.scrollIntoView({ behavior: calm() ? 'auto' : 'smooth', block: 'start' });
    });
  }

  async function addFiles(list: File[]) {
    const msgs: string[] = [];
    const next = [...photos];
    for (const f of list) {
      if (!PH.types.includes(f.type)) { msgs.push(`${f.name}: formato no admitido. Usa JPG, PNG o WebP.`); continue; }
      if (f.size > PH.mb * 1048576) { msgs.push(`${f.name}: pesa ${(f.size / 1048576).toFixed(1)} MB y el máximo es ${PH.mb} MB.`); continue; }
      if (next.length >= PH.max) { msgs.push(`${f.name}: ya has añadido ${PH.max} fotos, que es el máximo.`); continue; }
      const d = await readSize(f);
      if (!d) { msgs.push(`${f.name}: no se ha podido leer la imagen.`); continue; }
      if (d.w < PH.minW || d.h < PH.minH) { URL.revokeObjectURL(d.url); msgs.push(`${f.name}: mide ${d.w} × ${d.h} px y el mínimo es ${PH.minW} × ${PH.minH} px.`); continue; }
      next.push({ name: f.name, size: f.size, w: d.w, h: d.h, url: d.url });
    }
    setPhotoErrors(msgs);
    setPhotos(next);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const bad = [...f.querySelectorAll<HTMLElement>(':invalid')].filter((x) => x.tagName !== 'FIELDSET');
    if (bad.length) {
      setSummary(`Faltan ${bad.length} ${bad.length === 1 ? 'dato obligatorio' : 'datos obligatorios'} o hay datos que corregir. Revisa los campos marcados.`);
      bad.forEach((x) => x.setAttribute('aria-invalid', 'true'));
      requestAnimationFrame(() => {
        document.getElementById('aferr')?.focus();
        bad[0].scrollIntoView({ behavior: calm() ? 'auto' : 'smooth', block: 'center' });
        setTimeout(() => bad[0].focus({ preventScroll: true }), 350);
      });
      return;
    }
    setSummary('');
    if (sending) return;
    setSending(true);
    setTimeout(() => {
      setDone(true);
      setSending(false);
      requestAnimationFrame(() => { doneBox.current?.focus(); window.scrollTo(0, 0); });
    }, calm() ? 200 : 900);
  }

  if (done) {
    return (
      <section className="af-done" id="afdone" ref={doneBox} tabIndex={-1}>
        <i className="ph-light ph-envelope-simple-open" aria-hidden="true" />
        <h2>Revisa tu correo (demostración)</h2>
        <p>En la web real, esto es lo que pasaría ahora:</p>
        <ol>
          <li><b>Confirma tu correo.</b> Te enviamos un enlace de un solo uso. Hasta que lo abras, la solicitud no entra en revisión. Caduca en 24 horas.</li>
          {wantsNews && <li>Si has marcado la newsletter, recibirás un segundo correo para confirmarla. Sin esa confirmación no te escribimos.</li>}
          <li>Un editor revisa lo que has enviado.</li>
          <li>Comprobamos los datos con fuentes oficiales y contigo.</li>
          <li>Te escribimos al correo que has indicado, con la decisión o con preguntas.</li>
        </ol>
        <p className="muted">Recuerda: la publicación no está garantizada.</p>
        <Link className="btn" href="/">Volver al inicio</Link>
      </section>
    );
  }

  const current = tipo ? SCHEMA[tipo] : null;
  return (
    <>
      <div className="af-notice" role="note">
        <i className="ph-light ph-seal-check" aria-hidden="true" />
        <div><b>Enviar no garantiza que se publique.</b> Revisamos cada solicitud a mano: comprobamos los datos con fuentes oficiales y con el propio solicitante, y podemos pedirte más información. No todo lo que se envía se publica.</div>
      </div>
      <fieldset className="af-types" id="aftypes" ref={typesBox}>
        <legend><h2>¿Qué quieres añadir?</h2></legend>
        <div className="af-grid">
          {TYPES.map((t, i) => (
            <label className="af-type" key={t.id}>
              <input type="radio" name="tipo" value={t.id} required={i === 0} checked={tipo === t.id} onChange={() => choose(t.id)} />
              <span className="af-card"><i className={`ph-light ${t.icon}`} aria-hidden="true" /><b>{t.label}</b><small>{t.sub}</small></span>
            </label>
          ))}
        </div>
      </fieldset>

      {current && (
        <form className="af-form" id="addf" noValidate ref={form} aria-busy={sending || undefined} data-tipo={tipo} onSubmit={onSubmit}
          onInput={(e) => { const t = e.target as HTMLInputElement; if (t.matches('[aria-invalid]') && t.checkValidity()) t.removeAttribute('aria-invalid'); }}>
          <div className="af-head">
            <h2 id="afh" ref={heading} tabIndex={-1}>Cuéntanos sobre {current.t}</h2>
            <button type="button" className="link" id="afchg" onClick={() => { (document.querySelector('input[name=tipo]:checked') as HTMLElement | null)?.focus(); typesBox.current?.scrollIntoView({ behavior: calm() ? 'auto' : 'smooth', block: 'center' }); }}>Cambiar tipo</button>
          </div>

          <fieldset className="af-sec" key={tipo}>
            <legend>Datos de la ficha <span className="af-pill pub">Se publicarán si se aprueba</span></legend>
            <div className="af-cols" id="afspec">
              {current.f.map((f) => <Field key={f.n} f={f} counts={counts} setCount={(id, n) => setCounts((c) => ({ ...c, [id]: n }))} />)}
            </div>
          </fieldset>

          <fieldset className="af-sec">
            <legend>Fotos <span className="af-pill pub">Se publicarán si se aprueba</span></legend>
            <p className="af-lead">Solo fotos reales y propias, o con permiso para publicarlas. Sin marcas de agua ni texto superpuesto, y sin personas reconocibles sin su consentimiento.</p>
            <ul className="af-rules"><li>Hasta {PH.max} fotos</li><li>JPG, PNG o WebP</li><li>Máximo {PH.mb} MB cada una</li><li>Mínimo {PH.minW} × {PH.minH} px</li></ul>
            <div
              className={`af-drop${over ? ' over' : ''}`} id="afdrop"
              onDragEnter={(e) => { e.preventDefault(); setOver(true); }} onDragOver={(e) => { e.preventDefault(); setOver(true); }}
              onDragLeave={(e) => { e.preventDefault(); setOver(false); }}
              onDrop={(e) => { e.preventDefault(); setOver(false); addFiles([...e.dataTransfer.files]); }}
            >
              <input id="affiles" type="file" accept="image/jpeg,image/png,image/webp" multiple aria-describedby="afph-h" onChange={(e) => { addFiles([...(e.target.files ?? [])]); e.target.value = ''; }} />
              <label htmlFor="affiles"><i className="ph-light ph-image" aria-hidden="true" /><b>Elige fotos o suéltalas aquí</b><small id="afph-h">Una foto de calidad vale más que seis flojas.</small></label>
            </div>
            <ul className="af-errs" id="afperr" role="alert">{photoErrors.map((m) => <li key={m}>{m}</li>)}</ul>
            <ul className="af-thumbs" id="afthumbs">
              {photos.map((p, i) => (
                <li key={p.url}>
                  <img src={p.url} alt="" />
                  <div>
                    <b>{p.name}</b><small>{p.w} × {p.h} px · {(p.size / 1048576).toFixed(1)} MB</small>
                    <label className="sr" htmlFor={`afc${i}`}>Descripción de la foto {i + 1}</label>
                    <input id={`afc${i}`} className="af-cap" type="text" placeholder="Descripción de la foto (opcional)" maxLength={140} />
                  </div>
                  <button type="button" className="af-del" aria-label={`Quitar ${p.name}`}
                    onClick={() => { URL.revokeObjectURL(p.url); setPhotos((l) => l.filter((x) => x !== p)); document.getElementById('affiles')?.focus(); }}>
                    <i className="ph-light ph-x" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </fieldset>

          <fieldset className="af-sec">
            <legend>Tus datos de contacto <span className="af-pill priv">Privados: no se publican</span></legend>
            <p className="af-lead">Solo los usamos para escribirte sobre esta solicitud. Para confirmar que el correo es tuyo te enviaremos un enlace, sin contraseñas ni cuenta que recordar.</p>
            <div className="af-cols">
              <div className="af-f"><label htmlFor="afn">Tu nombre</label><input id="afn" name="contacto" autoComplete="name" required /></div>
              <div className="af-f"><label htmlFor="afe">Tu correo</label><input id="afe" name="email" type="email" autoComplete="email" spellCheck={false} required /></div>
              <div className="af-f"><label htmlFor="aft">Tu teléfono <Opt /></label><input id="aft" name="tel" type="tel" autoComplete="tel" inputMode="tel" /></div>
              <div className="af-f"><label htmlFor="afr">Tu relación con esto</label>
                <select id="afr" name="relacion" required defaultValue="">
                  <option value="">Elige una opción</option><option>Soy titular</option><option>Gestiono o represento</option><option>Colaboro o soy residente</option><option>Otra</option>
                </select></div>
            </div>
          </fieldset>

          <fieldset className="af-sec af-consent">
            <legend>Antes de enviar</legend>
            <label className="af-check"><input type="checkbox" name="privacidad" required /><span>He leído la <Link className="link" href="/politica-de-privacidad" target="_blank" rel="noopener">política de privacidad</Link> y acepto que Guía Andalucía trate estos datos, incluidos los de contacto, para revisar mi solicitud.</span></label>
            <label className="af-check"><input type="checkbox" name="derechos" required /><span>Confirmo que puedo compartir esta información y estas fotos, y que son reales.</span></label>
            <label className="af-check"><input type="checkbox" name="revision" required /><span>Entiendo que enviar la solicitud no garantiza su publicación y que debe pasar una verificación manual.</span></label>
            <label className="af-check"><input type="checkbox" name="novedades" id="afnews" checked={wantsNews} onChange={(e) => setWantsNews(e.target.checked)} /><span>Quiero recibir la newsletter de Guía Andalucía con novedades y planes. <Opt /> Te pediremos confirmarlo en un segundo correo y puedes darte de baja cuando quieras. No es necesario para enviar la solicitud.</span></label>
          </fieldset>

          <p className="af-errsum" id="aferr" role="alert" tabIndex={-1} hidden={!summary}>{summary}</p>
          <div className="af-actions">
            <button className="btn primary" type="submit" disabled={sending}>{sending ? <><span className="spin" aria-hidden="true" />Enviando…</> : 'Enviar y confirmar por correo'}</button>
            <p className="muted" style={{ fontSize: '.85rem' }}>Es una demostración: no se envía ni se guarda nada, y las fotos no salen de tu navegador.</p>
          </div>
        </form>
      )}
    </>
  );
}
