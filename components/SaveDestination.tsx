'use client';

import { toast } from '@/lib/toast';

export default function SaveDestination() {
  return <button type="button" className="btn" id="hubsave" onClick={() => toast('Destino guardado (demostración)')}>Guardar destino</button>;
}
