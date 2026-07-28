// Inyector de datos estructurados JSON-LD (Schema.org). Un <script type="application/ld+json">
// por bloque, serializado desde un objeto tipado. Server Component: no lleva estado ni
// interactividad, solo emite el marcado en el HTML para los rastreadores.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
