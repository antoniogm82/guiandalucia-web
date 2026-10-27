'use client';

import { useEffect, useState } from 'react';
import PlaceCard from '@/components/PlaceCard';
import { placeById, type Place } from '@/lib/data';
import { clearRecent, useRecent } from '@/lib/saved';

// «Tu actividad reciente»: solo aparece cuando la persona ya ha visto alguna ficha.
export default function RecentActivity() {
  const recent = useRecent();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const places = recent.map(placeById).filter((p): p is Place => Boolean(p));
  if (!mounted || !places.length) return null;
  return (
    <section className="hv-sec" id="recent">
      <div className="sec-head">
        <div><h2>Tu actividad reciente</h2><p>Lo último que has visto en este dispositivo.</p></div>
        <button type="button" className="link" onClick={clearRecent}>Borrar actividad</button>
      </div>
      <div className="rail">{places.map((p) => <PlaceCard key={p.id} place={p} />)}</div>
    </section>
  );
}
