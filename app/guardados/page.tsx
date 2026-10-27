import type { Metadata } from 'next';
import SavedList from '@/components/SavedList';

// Las fichas guardadas son personales (viven en el navegador), por eso la página no se indexa.
export const metadata: Metadata = { title: 'Fichas guardadas', robots: { index: false, follow: true } };

export default function Page() {
  return (
    <div className="wrap">
      <div className="rhead"><h1>Fichas guardadas</h1></div>
      <SavedList />
    </div>
  );
}
