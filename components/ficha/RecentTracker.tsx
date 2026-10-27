'use client';

import { useEffect } from 'react';
import { pushRecent } from '@/lib/saved';

// Anota la ficha en «Tu actividad reciente» (solo en este navegador).
export default function RecentTracker({ id }: { id: string }) {
  useEffect(() => pushRecent(id), [id]);
  return null;
}
