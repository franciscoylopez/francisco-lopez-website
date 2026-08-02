// Inyector de datos estructurados JSON-LD (Schema.org). Un <script type="application/ld+json">
// por bloque, serializado desde un objeto tipado. Server Component: no lleva estado ni
// interactividad, solo emite el marcado en el HTML para los rastreadores.

// Escapa los caracteres que romperían el <script> al incrustar JSON en HTML. El esencial es
// "<": neutraliza un "</script>" (o "<!--") incrustado en los datos, que cerraría la etiqueta
// antes de tiempo. ">" y "&" completan el set estándar (--> / ]]>) sin coste. Hoy los datos son
// estáticos y de confianza (vienen del diccionario), así que es defensa en profundidad.
function safeJsonLd(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}
