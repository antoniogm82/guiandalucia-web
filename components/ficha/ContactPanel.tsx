'use client';

import { toggleSaved, useSaved } from '@/lib/saved';
import { toast } from '@/lib/toast';

export default function ContactPanel({ id }: { id: string }) {
  const saved = useSaved().includes(id);
  const demo = () => toast('Demostración: sin datos reales');
  return (
    <div className="panel">
      <h2 className="side-h">Contacto</h2>
      <button type="button" className="btn primary" onClick={demo}>Llamar</button>
      <button type="button" className="btn" onClick={demo}>Visitar su web</button>
      <button type="button" className="btn" onClick={demo}>Cómo llegar</button>
      <button type="button" className="btn" id="fsave" aria-pressed={saved} onClick={() => toggleSaved(id)}>{saved ? 'Guardada' : 'Guardar ficha'}</button>
      <p className="muted" style={{ fontSize: '.82rem' }}>En la versión real, estos botones usan los datos confirmados del negocio.</p>
    </div>
  );
}
