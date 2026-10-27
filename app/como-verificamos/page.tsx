import type { Metadata } from 'next';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import InfoPage from '@/components/InfoPage';

export const metadata: Metadata = { title: 'Cómo verificamos', alternates: { canonical: '/como-verificamos' } };

const html = readFileSync(join(process.cwd(), 'content/metodo.html'), 'utf8');

export default function Page() {
  return (
    <InfoPage title="Cómo verificamos">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </InfoPage>
  );
}
