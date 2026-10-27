'use client';

import { useState } from 'react';
import PlaceCard from '@/components/PlaceCard';
import type { Place } from '@/lib/data';

// Filtro por tema dentro de la página de una provincia.
export default function TopicChips({ places }: { places: Place[] }) {
  const topics = [...new Set(places.map((p) => p.sub))];
  const [sub, setSub] = useState('');
  const list = places.filter((p) => !sub || p.sub === sub);
  return (
    <>
      <div className="chips" id="hubchips" role="group" aria-label="Filtrar por tema">
        {[['', 'Todo'], ...topics.map((t) => [t, t])].map(([k, l]) => (
          <button key={k} type="button" className="chip" aria-pressed={sub === k} onClick={() => setSub(k)}>{l}</button>
        ))}
      </div>
      <div className="grid" id="hubgrid" style={{ padding: '20px 0 24px' }}>
        {list.length ? list.map((p) => <PlaceCard key={p.id} place={p} />) : (
          <div className="empty" style={{ gridColumn: '1/-1' }}><b>Aún no hay fichas en este tema.</b>Estamos ampliando la cobertura.</div>
        )}
      </div>
    </>
  );
}
