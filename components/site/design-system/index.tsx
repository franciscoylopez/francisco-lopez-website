import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { Locale } from "@/lib/i18n/config";

import { type BreadcrumbDict } from "../breadcrumb";
import { RelatedPages, type RelatedDict } from "../related-pages";
import { Hero } from "./hero";
import { Rejilla } from "./01-rejilla";
import { Ritmo } from "./02-ritmo";
import { Tipografia } from "./03-tipografia";
import { Claroscuro } from "./04-claroscuro";
import { Movimiento } from "./05-movimiento";
import { Enlaces } from "./06-enlaces";
import { Botones } from "./07-botones";
import { Etiquetas } from "./08-etiquetas";
import { Formulario } from "./09-formulario";
import { Composicion } from "./10-composicion";
import { Accesibilidad } from "./11-accesibilidad";
import { ArticuloLargo } from "./12-articulo";

type DesignSystemDict = Dictionary["designSystem"];

// Página Design System (PRD §20). Traducida del mockup de Claude Design (D1).
// Server Component salvo tres islas interactivas (design-system-islands.tsx):
// toggle de rejilla, demo de reveal y tabs de dispositivo. La sección de
// Accesibilidad es la checklist de cierre de todo el sitio (§20).
//
// DOCE SECCIONES, Y EL ORDEN ES UNA JERARQUÍA (P70.34): fundamentos → piezas →
// composición → excepción. Antes eran dieciocho y su orden era CRONOLÓGICO —cada
// capa nueva se añadía al final—, y por eso el vídeo y los bloques de página
// acabaron debajo de la capa de artículo, que es la excepción del sistema y
// debería cerrar. Con la jerarquía, «nada debajo del artículo» sale solo, y
// además queda dicho dónde va lo que se añada en el futuro.
//
// UN ARCHIVO POR SECCIÓN (P37.69). Antes esto era una función de 1.100 líneas
// dentro de un archivo de 1.512, y el dato que decidió el corte es que la
// sección YA era la unidad natural: 9 de los 13 subcomponentes auxiliares se
// usaban en UNA sola. Ahora cada uno vive con la suya y en `shared.tsx` queda
// solo lo que de verdad cruza. Este archivo es lo que dice ser: el orden de la
// página, legible de un vistazo.
//
// Cada sección recibe SU rebanada del diccionario, no el diccionario entero, de
// modo que el tipo de cada archivo declara qué consume.

export function DesignSystem({
  dict,
  related,
  breadcrumb,
  homeHref,
  lang,
}: {
  dict: DesignSystemDict;
  related: RelatedDict;
  breadcrumb: BreadcrumbDict;
  homeHref: string;
  lang: Locale;
}) {
  const t = dict;

  return (
    <>
      <Hero
        t={t.hero}
        crumb={t.crumb}
        breadcrumb={breadcrumb}
        homeHref={homeHref}
      />
      <Rejilla t={t.rejilla} />
      <Ritmo t={t.ritmo} />
      <Tipografia t={t.tipografia} />
      <Claroscuro t={t.claroscuro} />
      <Movimiento t={t.movimiento} />
      <Enlaces t={t.enlaces} />
      <Botones t={t.botones} />
      <Etiquetas t={t.etiquetas} lang={lang} />
      <Formulario t={t.formulario} />
      <Composicion t={t.composicion} lang={lang} />
      <Accesibilidad t={t.accesibilidad} lang={lang} />
      <ArticuloLargo t={t.articulo} lang={lang} />

      <RelatedPages dict={related} current="designSystem" lang={lang} />
    </>
  );
}
