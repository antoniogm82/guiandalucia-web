'use client';

import { useSaved } from '@/lib/saved';

export default function SavedCount() {
  const saved = useSaved();
  return <span className="count" id="savedCount">{saved.length}</span>;
}
