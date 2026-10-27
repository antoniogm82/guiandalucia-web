import type { Metadata } from 'next';
import InfoPage from '@/components/InfoPage';
import ContactForm from '@/components/ContactForm';
import { getLegalPage } from '@/lib/legal';

export const metadata: Metadata = { title: 'Contacto', alternates: { canonical: '/contacto' } };

export default function Page() {
  const intro = getLegalPage('contacto')?.html.split('<form')[0] ?? '';
  return (
    <InfoPage title="Contacto">
      <div dangerouslySetInnerHTML={{ __html: intro }} />
      <ContactForm />
    </InfoPage>
  );
}
