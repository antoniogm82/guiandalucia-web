import { notFound } from 'next/navigation';
import InfoPage from '@/components/InfoPage';
import { getLegalPage } from '@/lib/legal';

// Los textos legales llevan datos del titular que se leen del entorno del servidor, por eso se generan en cada petición.
export default function LegalPage({ slug }: { slug: string }) {
  const page = getLegalPage(slug);
  if (!page) notFound();
  return (
    <InfoPage title={page.title}>
      <div dangerouslySetInnerHTML={{ __html: page.html }} />
    </InfoPage>
  );
}
