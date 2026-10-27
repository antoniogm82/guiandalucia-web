'use client';

import { useEffect } from 'react';

// Marca el <body> con una clase mientras la página está visible (la portada usa «is-home»).
export default function BodyClass({ name }: { name: string }) {
  useEffect(() => {
    document.body.classList.add(name);
    return () => document.body.classList.remove(name);
  }, [name]);
  return null;
}
