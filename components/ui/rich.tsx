// @pieza primitiva · interna · El render de markup inline del copy del diccionario: negrita, cursiva y enlace.

// Mini-render de markup inline para el copy del diccionario: **negrita**, *cursiva*
// y [texto](url). Plano (sin anidamiento), suficiente para el énfasis editorial de
// las páginas de contenido, y mantiene el copy como strings en el diccionario
// (fuente de verdad ES→EN). Enlaces http(s) → target/rel de seguridad; enlaces de
// contenido con `.link-content` (reposo neutro subrayado, cian en hover — regla
// de BRAND.md matizada 2026-08-04 / P37.55). Ver D23.
//
// Y MARCA LOS NOMBRES PROPIOS al pasar (`marcarMarcas`), en las cuatro salidas y
// no solo en el texto llano: un «TheTool» en negrita o dentro de la etiqueta de
// un enlace es igual de traducible que uno suelto, y es justo el sitio donde se
// habría escapado. El copy del diccionario no sabe nada de esto — ver
// `components/ui/marcas.tsx`.
import { Fragment } from "react";

import { marcarMarcas } from "./marcas";

const RICH_TOKEN = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g;

export function Rich({ text }: { text: string }) {
  const parts = text.split(RICH_TOKEN).filter((p) => p !== "");
  return (
    <>
      {parts.map((part, i) => {
        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
        if (link) {
          const label = link[1] ?? "";
          const href = link[2] ?? "";
          const external = /^https?:\/\//.test(href);
          return (
            <a
              key={i}
              href={href}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="link-content"
            >
              {marcarMarcas(label)}
            </a>
          );
        }
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="text-foreground font-semibold">
              {marcarMarcas(part.slice(2, -2))}
            </strong>
          );
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={i}>{marcarMarcas(part.slice(1, -1))}</em>;
        }
        // FRAGMENT Y NO `<span>` (P68.8). El envoltorio existía solo para llevar
        // la `key` de React: sin clase, sin semántica y sin efecto visual. Pero
        // convertía CADA tramo de texto plano en un ELEMENTO, así que en prosa lo
        // normal pasaba a ser «elemento pegado a elemento» — que es justo la señal
        // con la que `scripts/md/convertir.ts` recupera una separación hecha por
        // CSS. Resultado: 391 « · » metidos en medio de frases del markdown que
        // leen los agentes, y su propio comentario diciendo que en prosa no se
        // disparaba. Con un fragmento, el texto plano vuelve a ser un nodo de
        // TEXTO y esa premisa vuelve a ser cierta.
        return <Fragment key={i}>{marcarMarcas(part)}</Fragment>;
      })}
    </>
  );
}
