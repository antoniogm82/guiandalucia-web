'use client';

import { useEffect, useState } from 'react';

// Botón «Ver mapa / Ver lista» para pantallas estrechas.
export default function MapToggle() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    document.body.classList.toggle('map-on', on);
    const t = setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
    return () => clearTimeout(t);
  }, [on]);
  useEffect(() => () => document.body.classList.remove('map-on'), []);
  return <button type="button" className="btn mapbtn" id="mapbtn" onClick={() => setOn((v) => !v)}>{on ? 'Ver lista' : 'Ver mapa'}</button>;
}
