// Plantilla de las páginas de texto: título y contenido con el estilo de la maqueta.
export default function InfoPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="wrap">
      <div className="rhead"><h1>{title}</h1></div>
      <div className="fsec prose" style={{ border: 0, maxWidth: '66ch', paddingBottom: 80 }}>{children}</div>
    </div>
  );
}
