import type { Metadata } from 'next';
import Link from 'next/link';
import InfoPage from '@/components/InfoPage';
import RequestForm from '@/components/RequestForm';

export const metadata: Metadata = {
  title: 'Destacar tu ficha',
  description: 'Destacar tu ficha en Guía Andalucía es opcional y siempre aparece marcado como patrocinado.',
  alternates: { canonical: '/destacar' },
};

export default function Page() {
  return (
    <InfoPage title="Destacar tu ficha">
      <p>Publicar una ficha es gratis. Destacarla es opcional y de pago: tu ficha aparece en espacios visibles de la web, siempre con la etiqueta <b>«Patrocinado»</b>.</p>
      <h2>Lo que no cambia</h2>
      <ul>
        <li>El estado de verificación sigue siendo el que corresponde a los datos. Pagar no hace que una ficha esté «verificada».</li>
        <li>Las fichas patrocinadas no forman parte de ninguna clasificación independiente y el orden de las demás no cambia.</li>
        <li>Las reseñas no existen en esta web, así que no se pueden comprar ni retirar.</li>
      </ul>
      <p>Para destacar una ficha, primero tiene que estar publicada. Si aún no lo está, <Link className="link" href="/anadir">añádela aquí</Link>. Más información en <Link className="link" href="/como-verificamos">cómo verificamos</Link>.</p>
      <h2>Pide información</h2>
      <p>Cuéntanos qué te gustaría destacar y te escribimos con las condiciones.</p>
      <RequestForm kind="destacar" />
    </InfoPage>
  );
}
