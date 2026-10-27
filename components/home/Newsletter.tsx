'use client';

import { useState } from 'react';
import Link from 'next/link';

// Suscripción a la newsletter. Demostración hasta conectar Brevo con doble confirmación.
export default function Newsletter() {
  const [done, setDone] = useState(false);
  return (
    <section className="hv-sec">
      <div className="xnews">
        <div>
          <i className="ph-light ph-envelope-simple" aria-hidden="true" />
          <h2>Una guía al mes</h2>
          <p>Planes, lugares y novedades de Andalucía. Sin relleno.</p>
        </div>
        <div>
          <form className="news" id="news" onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
            <label className="sr" htmlFor="mail">Correo electrónico</label>
            <input id="mail" name="email" type="email" autoComplete="email" spellCheck={false} required placeholder="tu@correo.es" />
            <button className="btn primary" type="submit">Suscribirme</button>
          </form>
          <p className="news-msg" id="newsMsg">
            {done
              ? 'Gracias. En la web real recibirías un correo de confirmación.'
              : <>Al suscribirte aceptas la <Link className="link" href="/politica-de-privacidad">política de privacidad</Link>. Es una demostración: no se guarda ningún correo.</>}
          </p>
        </div>
      </div>
    </section>
  );
}
