import type { Metadata } from 'next';
import Link from 'next/link';
import InfoPage from '@/components/InfoPage';
import RequestForm from '@/components/RequestForm';

export const metadata: Metadata = {
  title: 'Reclamar o corregir una ficha',
  description: 'Si eres el titular de un negocio, reclama tu ficha en Guía Andalucía, corrige un dato o pide que se retire.',
  alternates: { canonical: '/reclamar' },
};

export default function Page() {
  return (
    <InfoPage title="Reclamar o corregir una ficha">
      <p>Si eres el titular de un negocio o lo representas, puedes reclamar su ficha, corregir un dato o pedir que se retire. También puedes avisarnos si ves algo desactualizado en una ficha ajena: preferimos que nos lo digas a que alguien planifique su viaje con un dato erróneo.</p>
      <h2>Cómo funciona</h2>
      <ul>
        <li>Confirmas tu correo con un enlace de un solo uso. No hay contraseñas ni cuenta que recordar.</li>
        <li>Comprobamos que eres el titular o lo representas, con fuentes oficiales y contigo.</li>
        <li>Hasta entonces la ficha no cambia. Cuando se verifica, pasa a «Verificada por el negocio».</li>
      </ul>
      <p>¿Tu negocio todavía no tiene ficha? <Link className="link" href="/anadir">Añádelo aquí</Link>.</p>
      <h2>Tu solicitud</h2>
      <RequestForm kind="reclamar" />
    </InfoPage>
  );
}
