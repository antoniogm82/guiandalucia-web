'use client';

import { useEffect, useRef, useState } from 'react';
import type { Photo } from '@/lib/photos';

const Ic = ({ d }: { d: React.ReactNode }) => <svg viewBox="0 0 24 24" aria-hidden="true">{d}</svg>;

// Galería de la ficha: tres fotos, botón «Ver todas» y visor a pantalla completa con miniaturas, zoom y gestos.
export default function Gallery({ photos }: { photos: Photo[] }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState(false);
  const x0 = useRef<number | null>(null);
  const n = photos.length;
  const go = (k: number) => { setI((v) => (v + k + n) % n); setZoom(false); };

  const open = (idx: number, el: HTMLElement) => {
    opener.current = el; setI(idx); setZoom(false);
    document.body.style.overflow = 'hidden';
    dlg.current?.showModal();
  };

  // Al cerrar el visor (botón, Escape o clic fuera): se libera el scroll de la página y el foco vuelve al botón que lo abrió.
  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    const onClose = () => { document.body.style.overflow = ''; setZoom(false); opener.current?.focus(); opener.current = null; };
    d.addEventListener('close', onClose);
    return () => { d.removeEventListener('close', onClose); document.body.style.overflow = ''; };
  }, []);

  useEffect(() => { if (!zoom) stage.current?.scrollTo(0, 0); }, [zoom]);
  useEffect(() => { // precarga las vecinas
    [1, -1].forEach((k) => { const im = new Image(); im.src = photos[(i + k + n) % n].src; });
  }, [i, n, photos]);

  const cur = photos[i];
  return (
    <>
      <div className="gallery" aria-label="Fotos">
        {photos.slice(0, 3).map((p, k) => (
          <button type="button" className="ph gimg" key={p.src} aria-label={`Ampliar foto ${k + 1} de ${n}`} onClick={(e) => open(k, e.currentTarget)}>
            <img src={p.src} alt={p.alt} width={1280} height={960} decoding="async" /><span>Foto de ejemplo</span>
          </button>
        ))}
        <button type="button" className="gall-all" onClick={(e) => open(0, e.currentTarget)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
          Ver las {n} fotos
        </button>
      </div>
      <dialog
        ref={dlg} id="lb" className="lb" aria-label="Visor de fotos"
        onClick={(e) => { if (e.target === dlg.current) dlg.current?.close(); }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
          else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
          else if (e.key === 'Home') { e.preventDefault(); setI(0); }
          else if (e.key === 'End') { e.preventDefault(); setI(n - 1); }
        }}
      >
        <div className="lb-top">
          <span className="lb-count" id="lbcount" role="status" aria-live="polite">Foto {i + 1} de {n}</span>
          <div className="lb-tools">
            <button type="button" className="lb-btn" id="lbzoom" aria-pressed={zoom} aria-label={zoom ? 'Ajustar a la pantalla' : 'Ampliar al tamaño real'} onClick={() => setZoom((z) => !z)}>
              <Ic d={<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5M11 8v6M8 11h6" /></>} />
            </button>
            <button type="button" className="lb-btn" id="lbclose" aria-label="Cerrar visor" autoFocus onClick={() => dlg.current?.close()}><Ic d={<path d="M6 6l12 12M18 6 6 18" />} /></button>
          </div>
        </div>
        <div
          className={`lb-stage${zoom ? ' zoomed' : ''}`} id="lbstage" ref={stage}
          onClick={(e) => { if ((e.target as HTMLElement).id === 'lbstage') dlg.current?.close(); }}
          onPointerDown={(e) => { x0.current = e.pointerType === 'mouse' || zoom ? null : e.clientX; }}
          onPointerUp={(e) => { if (x0.current === null) return; const dx = e.clientX - x0.current; x0.current = null; if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1); }}
        >
          <button type="button" className="lb-nav prev" id="lbprev" aria-label="Foto anterior" onClick={() => go(-1)}><Ic d={<path d="m15 6-6 6 6 6" />} /></button>
          <figure>
            <img id="lbimg" key={cur.src} className="in" src={cur.src} alt={cur.alt} onClick={() => setZoom((z) => !z)} />
            <figcaption id="lbcap">
              Foto de ejemplo{cur.author && <> · {cur.author} · {cur.license} · <a href={cur.url} target="_blank" rel="noopener">Ver origen</a></>}
            </figcaption>
          </figure>
          <button type="button" className="lb-nav next" id="lbnext" aria-label="Foto siguiente" onClick={() => go(1)}><Ic d={<path d="m9 6 6 6-6 6" />} /></button>
        </div>
        <div className="lb-thumbs" id="lbthumbs">
          {photos.map((p, k) => (
            <button type="button" className="lb-th" key={p.src} aria-label={`Ver foto ${k + 1}`} aria-current={k === i} onClick={() => { setI(k); setZoom(false); }}>
              <img src={p.src} alt="" width={72} height={54} loading="lazy" />
            </button>
          ))}
        </div>
      </dialog>
    </>
  );
}
