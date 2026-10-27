import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import { getLegalPage } from '@/lib/legal';

export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
  return { title: getLegalPage('aviso-legal')?.title, alternates: { canonical: '/aviso-legal' } };
}

export default function Page() {
  return <LegalPage slug="aviso-legal" />;
}
