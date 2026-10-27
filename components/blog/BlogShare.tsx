'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { toast } from '@/lib/toast';

// Botones para compartir un artículo. La dirección se toma de la página actual.
export default function BlogShare({ title }: { title: string }) {
  const pathname = usePathname();
  const [origin, setOrigin] = useState('');
  const [canShare, setCanShare] = useState(false);
  useEffect(() => { setOrigin(window.location.origin); setCanShare(typeof navigator.share === 'function'); }, []);

  const url = `${origin}${pathname}`;
  const u = encodeURIComponent(url), t = encodeURIComponent(title);
  const links: [string, string, string][] = [
    ['WhatsApp', 'ph-whatsapp-logo', `https://wa.me/?text=${t}%20${u}`],
    ['X', 'ph-x-logo', `https://twitter.com/intent/tweet?url=${u}&text=${t}`],
    ['Facebook', 'ph-facebook-logo', `https://www.facebook.com/sharer/sharer.php?u=${u}`],
    ['LinkedIn', 'ph-linkedin-logo', `https://www.linkedin.com/sharing/share-offsite/?url=${u}`],
    ['Correo', 'ph-envelope-simple', `mailto:?subject=${t}&body=${u}`],
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      toast('Enlace copiado');
    } catch {
      // Sin permiso del portapapeles (por ejemplo, sin https): se copia con un campo temporal.
      const box = document.createElement('textarea');
      box.value = url;
      document.body.appendChild(box);
      box.select();
      try { document.execCommand('copy'); toast('Enlace copiado'); } catch { toast('No se ha podido copiar el enlace'); }
      box.remove();
    }
  }

  return (
    <div className="bshare" role="group" aria-label="Compartir este artículo">
      <span className="bshare-l">Compartir</span>
      {links.map(([name, icon, href]) => (
        <a key={name} className="bshare-b" href={href} {...(href.startsWith('mailto') ? {} : { target: '_blank', rel: 'noopener' })} aria-label={`Compartir en ${name}`}>
          <i className={`ph-light ${icon}`} aria-hidden="true" />
        </a>
      ))}
      <button type="button" className="bshare-b" aria-label="Copiar enlace" onClick={copy}><i className="ph-light ph-link" aria-hidden="true" /></button>
      {canShare && <button type="button" className="bshare-b" aria-label="Compartir con otras aplicaciones" onClick={() => navigator.share({ title, url }).catch(() => {})}><i className="ph-light ph-share-network" aria-hidden="true" /></button>}
    </div>
  );
}
