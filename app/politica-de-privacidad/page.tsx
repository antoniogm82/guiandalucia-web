import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import { getLegalPage } from '@/lib/legal';

export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
  return { title: getLegalPage('politica-de-privacidad')?.title, alternates: { canonical: '/politica-de-privacidad' } };
}

export default function Page() {
  return <LegalPage slug="politica-de-privacidad" />;
}
