import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { Locale } from "@/lib/i18n/config";

import { type BreadcrumbDict } from "../breadcrumb";
import { RelatedPages, type RelatedDict } from "../related-pages";
import { Hero } from "./hero";
import { Rejilla } from "./01-rejilla";
import { Tokens } from "./02-tokens";
import { Breakpoints } from "./03-breakpoints";
import { Ritmo } from "./04-ritmo";
import { Tipografia } from "./05-tipografia";
import { Claroscuro } from "./06-claroscuro";
import { Movimiento } from "./07-movimiento";
import { Enlaces } from "./08-enlaces";
import { Botones } from "./09-botones";
import { Etiquetas } from "./10-etiquetas";
import { Cabeceras } from "./11-cabeceras";
import { Tablas } from "./12-tablas";
import { Accesibilidad } from "./13-accesibilidad";
import { Esqueleto } from "./14-esqueleto";
import { ArticuloLargo } from "./15-articulo";

type DesignSystemDict = Dictionary["designSystem"];

// Página Design System (PRD §20). Traducida de design/web-personal.dc.html (D1).
// Server Component salvo tres islas interactivas (design-system-islands.tsx):
// toggle de rejilla, demo de reveal y tabs de dispositivo. La sección de
// Accesibilidad es la checklist de cierre de todo el sitio (§20).
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
      <Tokens t={t.tokens} />
      <Breakpoints t={t.breakpoints} />
      <Ritmo t={t.ritmo} />
      <Tipografia t={t.tipografia} />
      <Claroscuro t={t.claroscuro} />
      <Movimiento t={t.movimiento} />
      <Enlaces t={t.enlaces} />
      <Botones t={t.botones} />
      <Etiquetas t={t.etiquetas} lang={lang} />
      <Cabeceras t={t.cabeceras} />
      <Tablas t={t.tablas} />
      <Accesibilidad t={t.accesibilidad} lang={lang} />
      <Esqueleto t={t.esqueleto} />
      <ArticuloLargo t={t.articulo} lang={lang} />

      <RelatedPages dict={related} current="designSystem" lang={lang} />
    </>
  );
}
