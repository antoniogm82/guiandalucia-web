import 'server-only';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type LegalPage = { title: string; html: string };
const legal: Record<string, LegalPage> = JSON.parse(readFileSync(join(process.cwd(), 'content/legal.json'), 'utf8'));

export const legalSlugs = Object.keys(legal);

// Los datos privados del titular se leen del entorno del servidor. Lo que falte se queda entre corchetes.
function titular() {
  const e = process.env;
  const name = e.LEGAL_NAME || '[Nombre o razón social]';
  const nif = e.LEGAL_NIF || '[NIF/CIF]';
  const address = [e.LEGAL_ADDRESS, e.LEGAL_LOCALITY].filter(Boolean).join(', ') || '[Domicilio]';
  const mail = e.LEGAL_EMAIL || '[Correo de contacto]';
  return { name, nif, address, mail };
}

export function getLegalPage(slug: string): LegalPage | null {
  const page = legal[slug];
  if (!page) return null;
  const t = titular();
  const html = page.html
    .replace('[Nombre o razón social] · [NIF/CIF] · [Domicilio] · [Correo de contacto]', `${t.name} · ${t.nif} · ${t.address} · ${t.mail}`)
    .replace('[correo de contacto]', t.mail);
  return { title: page.title, html };
}
