import type { Dictionary } from "@/app/[lang]/dictionaries";
import { SECTION, WRAP } from "@/components/ui/layout";
import { SectionCloser, SectionIndex } from "@/components/ui/section-index";
import { SectionRail } from "@/components/ui/section-index-islands";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

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
import type { SeccionMarco } from "./shared";

type DesignSystemDict = Dictionary["designSystem"];

/**
 * LAS DOCE PARADAS, EN ORDEN — y esta lista es la ÚNICA fuente del recorrido
 * (P70.39).
 *
 * De aquí salen tres cosas que antes no existían o vivían escritas a mano: el
 * ancla de cada sección (`s01`…`s12`), su ordinal, y la posición que el cierre de
 * bloque anuncia («7 de 12»). El ordinal ya NO se escribe en el diccionario: el
 * copy aporta el rótulo corto y el número lo pone la posición, así que reordenar
 * la página no puede dejar el índice diciendo «07» donde la cabecera dice «08».
 * Es la misma puerta que D72 cerró con la lista de páginas.
 *
 * Y por eso los `id` son idénticos en ES y EN sin que nadie lo vigile: no están en
 * dos JSON que puedan divergir, están aquí, derivados de la posición.
 */
const ORDEN = [
  "rejilla",
  "ritmo",
  "tipografia",
  "claroscuro",
  "movimiento",
  "enlaces",
  "botones",
  "etiquetas",
  "formulario",
  "composicion",
  "accesibilidad",
  "articulo",
] as const;

/** El ancla del índice. Misma convención que el artículo, que ya la estrenó. */
const ANCLA_INDICE = "indice";

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

  // Las paradas, derivadas del orden: el ordinal es la POSICIÓN y el rótulo lo
  // pone el copy. Nada de esto se escribe dos veces.
  const paradas = ORDEN.map((clave, i) => {
    const ordinal = String(i + 1).padStart(2, "0");
    return { clave, id: `s${ordinal}`, ordinal, label: t[clave].indexLabel };
  });

  /**
   * El marco de cada parada, INDEXADO POR SU CLAVE y no por su posición: en el
   * JSX se lee `marco={marcos.botones}`, que no puede desalinearse al insertar una
   * sección en medio como sí haría un `marco(6)`.
   *
   * El eyebrow se compone con una PLANTILLA y no con dos nodos JSX a propósito:
   * React separa nodos de texto adyacentes con `<!-- -->`, y el rótulo que hoy
   * sirve el sitio es una sola cadena. Así el HTML de las doce cabeceras no
   * cambia ni un byte al mover el ordinal del diccionario al código.
   */
  const marcos = Object.fromEntries(
    paradas.map((parada, i) => {
      const siguiente = paradas[i + 1];
      const marco: SeccionMarco = {
        id: parada.id,
        kicker: `${parada.ordinal} — ${parada.label}`,
        closer: (
          <SectionCloser
            position={i + 1}
            total={paradas.length}
            indexLabel={t.indice.closerLabel}
            indexHref={`#${ANCLA_INDICE}`}
            nextLabel={
              siguiente
                ? `${t.indice.nextLabel} ${siguiente.ordinal} · ${siguiente.label}`
                : undefined
            }
            nextHref={siguiente ? `#${siguiente.id}` : undefined}
            positionLabel={`${i + 1} ${t.indice.of} ${paradas.length}`}
          />
        ),
      };
      return [parada.clave, marco] as const;
    }),
  ) as Record<(typeof ORDEN)[number], SeccionMarco>;

  return (
    <>
      <Hero
        t={t.hero}
        crumb={t.crumb}
        breadcrumb={breadcrumb}
        homeHref={homeHref}
      />

      {/* El riel va DESPUÉS del hero en el DOM, y eso no es cosmética: es `fixed`,
          así que su sitio en pantalla no depende de dónde se escriba, pero su
          sitio en el ORDEN DE TABULACIÓN sí. En el artículo precedía al `h1` y
          metía trece enlaces por delante del título de la página (design-review
          P60). Aquí nace ya detrás. */}
      <SectionRail items={paradas} ariaLabel={t.indice.railAriaLabel} />

      {/* `scroll-mt-[5rem]`: el nav es sticky y sin margen de scroll el ancla deja
          la sección arrancando por debajo de él. Es la misma distancia que usa
          el riel para librarlo (`top-[5rem]`), así que si el nav cambia de alto se
          mueven los dos juntos. */}
      <section id={ANCLA_INDICE} className={cn(SECTION, "scroll-mt-[5rem]")}>
        <div className={WRAP}>
          {/* Sin `meta` por celda: en el artículo esa línea es el tiempo de lectura,
              y aquí no hay prosa que cronometrar. Publicar un tiempo calculado
              sobre especímenes sería inventarse una cifra, que es contra lo que
              existe D38 — por eso `meta` es opcional desde P70.38. */}
          <SectionIndex
            kicker={t.indice.kicker}
            ariaLabel={t.indice.ariaLabel}
            items={paradas}
          />
        </div>
      </section>

      <Rejilla t={t.rejilla} marco={marcos.rejilla} />
      <Ritmo t={t.ritmo} marco={marcos.ritmo} />
      <Tipografia t={t.tipografia} marco={marcos.tipografia} />
      <Claroscuro t={t.claroscuro} marco={marcos.claroscuro} />
      <Movimiento t={t.movimiento} marco={marcos.movimiento} />
      <Enlaces t={t.enlaces} marco={marcos.enlaces} />
      <Botones t={t.botones} marco={marcos.botones} />
      <Etiquetas t={t.etiquetas} marco={marcos.etiquetas} lang={lang} />
      <Formulario t={t.formulario} marco={marcos.formulario} />
      <Composicion
        t={t.composicion}
        marco={marcos.composicion}
        paradas={paradas}
        lang={lang}
      />
      <Accesibilidad
        t={t.accesibilidad}
        marco={marcos.accesibilidad}
        lang={lang}
      />
      <ArticuloLargo t={t.articulo} marco={marcos.articulo} lang={lang} />

      <RelatedPages dict={related} current="designSystem" lang={lang} />
    </>
  );
}
