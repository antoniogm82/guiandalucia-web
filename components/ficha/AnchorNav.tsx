'use client';

const ITEMS: [string, string][] = [['sec-resumen', 'Resumen'], ['sec-datos', 'Datos prácticos'], ['sec-verif', 'Verificación'], ['sec-ubic', 'Ubicación'], ['sec-claim', 'Reclamar']];

// Pestañas de la ficha: desplazamiento suave hasta cada sección.
export default function AnchorNav() {
  return (
    <nav className="anchors" aria-label="En esta ficha">
      {ITEMS.map(([id, label]) => (
        <a key={id} href={`#${id}`} data-a={id} onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>{label}</a>
      ))}
    </nav>
  );
}
