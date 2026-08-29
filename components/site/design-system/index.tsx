import { type ReactNode } from "react";

import type { Dictionary } from "@/app/[lang]/dictionaries";
import { SectionBlocks } from "@/components/ui/block-opener";
import {
  construirRecorrido,
  SectionIndexBlock,
} from "@/components/ui/section-index";
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
 * LOS CINCO BLOQUES, y esta lista es lo que hace VISIBLE una jerarquía que hasta
 * P70.47 solo existía en el comentario de abajo (P70.47).
 *
 * El orden de las doce dejó de ser cronológico en P70.34 y pasó a ser
 * `espacio → materia → piezas → composición → excepción`. Estaba escrito, estaba bien
 * pensado, y en pantalla no se veía: doce secciones seguidas, todas separadas por
 * el mismo filete, no dicen dónde acaba una familia y empieza otra.
 *
 * Aquí van las CLAVES y nada más. El título y la entradilla de cada bloque son
 * copy y viven en el diccionario; los ordinales de la banda salen de `paradas`,
 * no se escriben. Así reordenar la página no puede dejar una banda anunciando
 * secciones que ya no están debajo.
 *
 * SON CINCO Y NO CUATRO DESDE P62.5 (2026-08-29), y el que se partió es el
 * primero. «Fundamentos» agrupaba las cinco secciones de apertura y eso dejaba
 * **14,1 pantallas seguidas sin un solo cambio de fondo** entre su banda y la de
 * «Piezas»: más que la página entera del Brand Kit (15,4) y que Accesibilidad
 * completa (13,4). El tramo más plano del sitio medía lo que una hermana entera,
 * que es exactamente el síntoma que D125 nació a corregir.
 *
 * DÓNDE CAE EL CORTE LO DECIDIÓ LA MEDICIÓN, y la primera intuición falló. Por
 * familia —las tres de medida y las dos que no se miden en píxeles— el tramo
 * malo se quedaba en **10,9**, porque el peso no está repartido: §01 «Rejilla»
 * mide ella sola **5,88 pantallas** y §03 «Tipografía» otras 3,99, contra 1,01
 * de §02 y 1,22 de §05. Cortando tras §02 salen **6,89 y 6,82**, que es la única
 * partición de las cuatro posibles que deja las dos mitades por debajo del techo
 * y por encima del suelo.
 *
 * Y EL NOMBRE SIGUE AL CORTE, no al revés: «Fundamentos» no describía dos
 * mitades, así que desaparece como rótulo de bloque y las dos se llaman por lo
 * que agrupan —«El espacio» dónde cae el contenido y cada cuánto respira, «La
 * materia» de qué está hecho lo que se coloca—. Las cinco siguen siendo los
 * fundamentos; lo que deja de existir es una banda que anunciaba una familia y
 * enseñaba dos.
 *
 * ANTES DE AÑADIR UN SEXTO, la pregunta es la densidad, y tiene DOS mitades: por
 * arriba, más de un bloque cada ~6 pantallas se lee a golpes; por abajo, un tramo
 * de más de ~10 sin banda es el defecto que acaba de corregirse. El porqué
 * medido, en `ui/block-opener.tsx`.
 */
const BLOQUES = [
  { id: "espacio", claves: ["rejilla", "ritmo"] },
  { id: "materia", claves: ["tipografia", "claroscuro", "movimiento"] },
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
// DOCE SECCIONES, Y EL ORDEN ES UNA JERARQUÍA (P70.34, en cinco bloques desde
// P62.5): espacio → materia → piezas → composición → excepción. Antes eran
// dieciocho y su orden era CRONOLÓGICO —cada capa nueva se añadía al final—, y
// por eso el vídeo y los bloques de página
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

  // Las paradas y sus marcos, derivados del orden: el ordinal es la POSICIÓN y el
  // rótulo lo pone el copy. Nada de esto se escribe dos veces — ni aquí, ni en las
  // dos páginas hermanas: el cálculo vive en la capa desde P50.88.
  const { paradas, marcos } = construirRecorrido(
    ORDEN,
    t,
    t.indice,
    ANCLA_INDICE,
  );

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

      <SectionIndexBlock id={ANCLA_INDICE} t={t.indice} items={paradas} />

      {/* LAS DOCE, REPARTIDAS EN SUS CINCO BLOQUES. La lista de secciones sigue
          leyéndose de un vistazo, que es lo que este archivo tiene que ser; lo
          único que cambia es que ahora se ve dónde empieza cada familia. */}
      <SectionBlocks
        bloques={BLOQUES}
        copy={t.bloques}
        paradas={paradas}
        secciones={secciones}
      />

      <RelatedPages dict={related} current="designSystem" lang={lang} />
    </>
  );
}
