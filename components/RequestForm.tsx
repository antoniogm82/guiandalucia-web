'use client';

import Link from 'next/link';
import { useState } from 'react';

type Kind = 'reclamar' | 'destacar';

const COPY: Record<Kind, { actions?: string[]; detailLabel: string; submit: string; steps: string[] }> = {
  reclamar: {
    actions: ['Reclamar la ficha', 'Corregir un dato', 'Pedir que se retire'],
    detailLabel: 'Detalles',
    submit: 'Enviar solicitud',
    steps: ['Confirma tu correo con un enlace de un solo uso.', 'Comprobamos que eres el titular o lo representas, con fuentes oficiales y contigo.', 'Aplicamos el cambio o te escribimos si necesitamos más información.'],
  },
  destacar: {
    detailLabel: 'Qué te gustaría destacar',
    submit: 'Pedir información',
    steps: ['Confirma tu correo con un enlace de un solo uso.', 'Te escribimos con las condiciones y la disponibilidad.', 'Si aceptas, tu ficha se muestra con la etiqueta «Patrocinado», sin cambiar su estado de verificación.'],
  },
};

// Formulario de reclamar/corregir una ficha o de pedir información para destacarla. De momento no envía nada.
export default function RequestForm({ kind }: { kind: Kind }) {
  const copy = COPY[kind];
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const bad = [...e.currentTarget.querySelectorAll<HTMLElement>(':invalid')];
    if (bad.length) {
      setError('Revisa los campos obligatorios.');
      bad.forEach((x) => x.setAttribute('aria-invalid', 'true'));
      bad[0].focus();
      return;
    }
    setError('');
    setDone(true);
    window.scrollTo(0, 0);
  }

  if (done) {
    return (
      <section className="af-done" tabIndex={-1}>
        <i className="ph-light ph-envelope-simple-open" aria-hidden="true" />
        <h2>Revisa tu correo (demostración)</h2>
        <p>En la web real, esto es lo que pasaría ahora:</p>
        <ol>{copy.steps.map((s) => <li key={s}>{s}</li>)}</ol>
        <Link className="btn" href="/">Volver al inicio</Link>
      </section>
    );
  }

  return (
    <form className="form" noValidate onSubmit={onSubmit} onInput={(e) => { const t = e.target as HTMLInputElement; if (t.matches('[aria-invalid]') && t.checkValidity()) t.removeAttribute('aria-invalid'); }}>
      <div><label htmlFor="rq-n">Tu nombre</label><input id="rq-n" name="nombre" autoComplete="name" required /></div>
      <div><label htmlFor="rq-e">Correo del negocio</label><input id="rq-e" name="email" type="email" autoComplete="email" spellCheck={false} required /></div>
      <div><label htmlFor="rq-f">Ficha o dirección de la ficha</label><input id="rq-f" name="ficha" placeholder="Por ejemplo: https://…/ficha/demo-1" /></div>
      {copy.actions && (
        <div><label htmlFor="rq-a">Qué quieres hacer</label><select id="rq-a" name="accion">{copy.actions.map((a) => <option key={a}>{a}</option>)}</select></div>
      )}
      <div><label htmlFor="rq-d">{copy.detailLabel}</label><textarea id="rq-d" name="detalles" rows={5} /></div>
      <label className="af-check"><input type="checkbox" name="privacidad" required /><span>He leído la <Link className="link" href="/politica-de-privacidad" target="_blank" rel="noopener">política de privacidad</Link> y acepto que Guía Andalucía trate estos datos para atender mi solicitud.</span></label>
      {error && <p role="alert" style={{ color: '#b3261e' }}>{error}</p>}
      <button className="btn primary" type="submit">{copy.submit}</button>
      <p className="muted" style={{ fontSize: '.85rem' }}>Es una demostración: el formulario no envía nada.</p>
    </form>
  );
}
