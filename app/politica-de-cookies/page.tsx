import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import { getLegalPage } from '@/lib/legal';

export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
  return { title: getLegalPage('politica-de-cookies')?.title, alternates: { canonical: '/politica-de-cookies' } };
}

export default function Page() {
  return <LegalPage slug="politica-de-cookies" />;
}
