import { Fragment, type ReactNode } from "react";

import type { Dictionary } from "@/app/[lang]/dictionaries";
import { BlockOpener } from "@/components/ui/block-opener";
import { SECTION, WRAP } from "@/components/ui/layout";
import {
  IndexNote,
  SectionCloser,
  SectionIndex,
} from "@/components/ui/section-index";
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

/**
 * LOS CUATRO BLOQUES, y esta lista es lo que hace VISIBLE una jerarquía que hasta
 * hoy solo existía en el comentario de abajo (P70.47).
 *
 * El orden de las doce dejó de ser cronológico en P70.34 y pasó a ser
 * `fundamentos → piezas → composición → excepción`. Estaba escrito, estaba bien
 * pensado, y en pantalla no se veía: doce secciones seguidas, todas separadas por
 * el mismo filete, no dicen dónde acaba una familia y empieza otra.
 *
 * Aquí van las CLAVES y nada más. El título y la entradilla de cada bloque son
 * copy y viven en el diccionario; los ordinales de la banda salen de `paradas`,
 * no se escriben. Así reordenar la página no puede dejar una banda anunciando
 * secciones que ya no están debajo.
 *
 * SI HAY QUE AÑADIR UN QUINTO BLOQUE, la pregunta antes es la densidad: la banda
 * cae hoy cada 8,9 pantallas y por debajo de ~6 la página se lee a golpes. El
 * porqué medido, en `ui/block-opener.tsx`.
 */
const BLOQUES = [
  {
    id: "fundamentos",
    claves: ["rejilla", "ritmo", "tipografia", "claroscuro", "movimiento"],
  },
  { id: "piezas", claves: ["enlaces", "botones", "etiquetas", "formulario"] },
  { id: "composicion", claves: ["composicion", "accesibilidad"] },
  { id: "excepcion", claves: ["articulo"] },
] as const;

// Página Design System (PRD §20). Traducida del mockup de Claude Design (D1).
// Server Component salvo las islas interactivas, que viven juntas en
// `design-system-islands.tsx` y NO en su sección: la frontera `"use client"` se
// paga por archivo, así que repartirlas convertiría varias secciones enteras en
// Client Components. El porqué largo, en D42 §La excepción. La sección de
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
            ariaLabel={t.indice.closerAriaLabel}
            positionLabel={`${i + 1} ${t.indice.of} ${paradas.length}`}
          />
        ),
      };
      return [parada.clave, marco] as const;
    }),
  ) as Record<(typeof ORDEN)[number], SeccionMarco>;

  /**
   * Cada sección con SU rebanada del diccionario, indexada por su clave. Existe
   * porque las doce ya no se escriben una debajo de otra: las reparte el bucle de
   * `BLOQUES`, y un mapa por clave no puede desalinearse al insertar una sección
   * en medio como sí haría una lista por posición.
   */
  const secciones: Record<(typeof ORDEN)[number], ReactNode> = {
    rejilla: <Rejilla t={t.rejilla} marco={marcos.rejilla} />,
    ritmo: <Ritmo t={t.ritmo} marco={marcos.ritmo} />,
    tipografia: <Tipografia t={t.tipografia} marco={marcos.tipografia} />,
    claroscuro: <Claroscuro t={t.claroscuro} marco={marcos.claroscuro} />,
    movimiento: <Movimiento t={t.movimiento} marco={marcos.movimiento} />,
    enlaces: <Enlaces t={t.enlaces} marco={marcos.enlaces} />,
    botones: <Botones t={t.botones} marco={marcos.botones} />,
    etiquetas: (
      <Etiquetas t={t.etiquetas} marco={marcos.etiquetas} lang={lang} />
    ),
    formulario: <Formulario t={t.formulario} marco={marcos.formulario} />,
    composicion: (
      <Composicion
        t={t.composicion}
        marco={marcos.composicion}
        paradas={paradas}
        // El espécimen de `BlockOpener` es LA BANDA DEL BLOQUE «Piezas» de esta
        // misma página, no una maqueta: mismo copy y mismas cuatro paradas.
        bloqueDemo={{
          title: t.bloques.piezas.title,
          lead: t.bloques.piezas.lead,
          items: paradas.filter((p) =>
            (
              BLOQUES.find((b) => b.id === "piezas")
                ?.claves as readonly string[]
            ).includes(p.clave),
          ),
        }}
        lang={lang}
      />
    ),
    accesibilidad: (
      <Accesibilidad
        t={t.accesibilidad}
        marco={marcos.accesibilidad}
        lang={lang}
      />
    ),
    articulo: (
      <ArticuloLargo t={t.articulo} marco={marcos.articulo} lang={lang} />
    ),
  };

  return (
    <>
      <Hero
        t={t.hero}
        crumb={t.crumb}
        breadcrumb={breadcrumb}
        homeHref={homeHref}
      />

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
            intro={
              <IndexNote
                note={t.indice.note}
                figures={[
                  {
                    value: String(paradas.length),
                    suffix: t.indice.sectionsSuffix,
                  },
                ]}
              />
            }
          />
        </div>
      </section>

      {/* LAS DOCE, REPARTIDAS EN SUS CUATRO BLOQUES. La lista de secciones sigue
          leyéndose de un vistazo, que es lo que este archivo tiene que ser; lo
          único que cambia es que ahora se ve dónde empieza cada familia. */}
      {BLOQUES.map((bloque) => (
        <Fragment key={bloque.id}>
          <BlockOpener
            title={t.bloques[bloque.id].title}
            lead={t.bloques[bloque.id].lead}
            items={paradas.filter((p) =>
              (bloque.claves as readonly string[]).includes(p.clave),
            )}
          />
          {bloque.claves.map((clave) => (
            <Fragment key={clave}>{secciones[clave]}</Fragment>
          ))}
        </Fragment>
      ))}

      <RelatedPages dict={related} current="designSystem" lang={lang} />
    </>
  );
}
