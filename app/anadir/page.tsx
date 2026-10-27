import type { Metadata } from 'next';
import AddForm from '@/components/anadir/AddForm';

export const metadata: Metadata = {
  title: 'Añadir un lugar, plan o negocio',
  description: 'Añade tu alojamiento, restaurante, actividad o plan a Guía Andalucía. Publicar es gratis y revisamos cada solicitud antes de publicarla.',
  alternates: { canonical: '/anadir' },
};

export default function Page() {
  return (
    <div className="wrap af">
      <div className="rhead">
        <h1>Añadir</h1>
        <p className="muted" style={{ maxWidth: '62ch', marginTop: 8 }}>Cuéntanos qué quieres añadir y te pediremos solo lo que hace falta para ese tipo de ficha. Publicar es gratis. Destacar es opcional, de pago y siempre aparece marcado como patrocinado.</p>
      </div>
      <AddForm />
    </div>
  );
}
