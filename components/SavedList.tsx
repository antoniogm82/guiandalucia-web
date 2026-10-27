'use client';

import { useEffect, useState } from 'react';
import PlaceCard from '@/components/PlaceCard';
import { PLACES } from '@/lib/data';
import { useSaved } from '@/lib/saved';

export default function SavedList() {
  const saved = useSaved();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const list = PLACES.filter((p) => saved.includes(p.id));
  return list.length ? (
    <>
      <h2 className="rcount" style={{ paddingBottom: 14 }}>{list.length} {list.length === 1 ? 'ficha guardada' : 'fichas guardadas'}</h2>
      <div className="grid" style={{ paddingBottom: 60 }}>{list.map((p) => <PlaceCard key={p.id} place={p} />)}</div>
    </>
  ) : (
    <div className="empty" style={{ margin: '20px 0 60px' }}>
      <b>Aún no has guardado nada.</b>Pulsa el corazón de una ficha para verla aquí. Se guarda solo en este navegador.
    </div>
  );
}
