'use client';

import { useSyncExternalStore } from 'react';

// Fichas guardadas y actividad reciente: viven solo en el navegador (localStorage), sin cuenta ni servidor.
const listeners = new Set<() => void>();
const read = (key: string): string[] => {
  try { return JSON.parse(localStorage.getItem(key) ?? '[]'); } catch { return []; }
};
const write = (key: string, v: string[]) => {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* sin almacenamiento */ }
  listeners.forEach((l) => l());
};
const subscribe = (cb: () => void) => { listeners.add(cb); window.addEventListener('storage', cb); return () => { listeners.delete(cb); window.removeEventListener('storage', cb); }; };

const cache: Record<string, { raw: string | null; val: string[] }> = {};
function snapshot(key: string): string[] {
  const raw = localStorage.getItem(key);
  if (cache[key]?.raw !== raw) cache[key] = { raw, val: read(key) };
  return cache[key].val;
}
const empty: string[] = [];

export const useSaved = () => useSyncExternalStore(subscribe, () => snapshot('ga_saved'), () => empty);
export const useRecent = () => useSyncExternalStore(subscribe, () => snapshot('ga_recent'), () => empty);

export function toggleSaved(id: string) {
  const cur = read('ga_saved');
  write('ga_saved', cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]);
}
export function pushRecent(id: string) {
  write('ga_recent', [id, ...read('ga_recent').filter((x) => x !== id)].slice(0, 8));
}
export const clearRecent = () => write('ga_recent', []);
