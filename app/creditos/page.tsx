import type { Metadata } from 'next';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import InfoPage from '@/components/InfoPage';

export const metadata: Metadata = { title: 'Créditos de las fotos', alternates: { canonical: '/creditos' } };

type Credit = { file: string; title: string; author: string; license: string; url: string };
const credits: Credit[] = JSON.parse(readFileSync(join(process.cwd(), 'content/credits.json'), 'utf8'));

export default function Page() {
  return (
    <InfoPage title="Créditos de las fotos">
      <p>Las fotos de ejemplo proceden de Wikimedia Commons con licencias libres. No muestran los negocios de las fichas.</p>
      <h2>Fotografías</h2>
      <ul style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12, listStyle: 'none', padding: 0 }}>
        {credits.map((c) => (
          <li key={c.file}>
            <a className="link" href={c.url} target="_blank" rel="noopener">{c.title}</a>
            <br />
            <span className="muted">{c.author} · {c.license}</span>
          </li>
        ))}
      </ul>
    </InfoPage>
  );
}
