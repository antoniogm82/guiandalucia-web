import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import { getLegalPage } from '@/lib/legal';

export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
  return { title: getLegalPage('quienes-somos')?.title, alternates: { canonical: '/quienes-somos' } };
}

export default function Page() {
  return <LegalPage slug="quienes-somos" />;
}
