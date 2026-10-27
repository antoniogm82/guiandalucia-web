'use client';

import { toggleSaved, useSaved } from '@/lib/saved';

const HEART = 'M12 21C12 21 3 15.5 3 9.2 3 6.3 5.2 4.5 7.5 4.5c1.9 0 3.5 1 4.5 2.7 1-1.7 2.6-2.7 4.5-2.7 2.3 0 4.5 1.8 4.5 4.7C21 15.5 12 21 12 21z';

export default function SaveButton({ id, name }: { id: string; name: string }) {
  const saved = useSaved().includes(id);
  return (
    <button
      className="save"
      type="button"
      aria-pressed={saved}
      aria-label={`Guardar ${name}`}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSaved(id); }}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d={HEART} /></svg>
    </button>
  );
}
