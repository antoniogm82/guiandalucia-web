'use client';

import { toast } from '@/lib/toast';

// Reclamar o corregir una ficha. Demostración hasta conectar el correo.
export default function ClaimForm() {
  return (
    <details className="claim">
      <summary>¿Eres el negocio? Reclama o corrige esta ficha</summary>
      <form className="form" id="claim" onSubmit={(e) => { e.preventDefault(); toast('Solicitud de demostración recibida'); }}>
        <div><label htmlFor="c1">Tu nombre</label><input id="c1" name="nombre" autoComplete="name" required /></div>
        <div><label htmlFor="c2">Correo del negocio</label><input id="c2" name="email" type="email" autoComplete="email" spellCheck={false} required /></div>
        <div><label htmlFor="c3">Qué quieres hacer</label><select id="c3"><option>Reclamar la ficha</option><option>Corregir un dato</option><option>Pedir que se retire</option></select></div>
        <div><label htmlFor="c4">Detalles</label><textarea id="c4" /></div>
        <button className="btn primary" type="submit">Enviar solicitud</button>
        <p className="muted" style={{ fontSize: '.85rem' }}>Es una demostración: el formulario no envía nada.</p>
      </form>
    </details>
  );
}
