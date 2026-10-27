'use client';

import Link from 'next/link';
import { useState } from 'react';

// Suscripción al final de cada artículo. Demostración hasta conectar Brevo con doble confirmación.
export default function BlogNewsletter() {
  const [msg, setMsg] = useState<string | null>(null);
  const [bad, setBad] = useState(false);
  return (
    <section className="bnl" id="bnl">
      <div className="bnl-t">
        <i className="ph-light ph-envelope-simple" aria-hidden="true" />
        <p className="bnl-h">Una guía al mes en tu correo</p>
        <p>Planes, lugares y novedades de Andalucía. Sin relleno y sin spam.</p>
      </div>
      <form className="bnews" noValidate onSubmit={(e) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem('email') as HTMLInputElement;
        if (!input.checkValidity()) { setBad(true); setMsg('Escribe un correo válido.'); input.focus(); return; }
        setBad(false); setMsg('Gracias. En la web real recibirías un correo de confirmación.');
      }}>
        <label htmlFor="bnm">Tu correo electrónico</label>
        <input id="bnm" name="email" type="email" autoComplete="email" spellCheck={false} required placeholder="tu@correo.es" aria-invalid={bad || undefined} />
        <button className="btn" type="submit">Suscribirme</button>
        <p className="bnl-m" id="bnmsg" role="status">
          {msg ?? <>Al suscribirte aceptas la <Link className="link" href="/politica-de-privacidad">política de privacidad</Link>. Es una demostración: no se guarda ningún correo.</>}
        </p>
      </form>
    </section>
  );
}
