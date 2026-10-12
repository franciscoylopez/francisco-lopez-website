import { type ReactNode } from "react";

import type { Dictionary } from "@/app/[lang]/dictionaries";
import { construirRecorrido } from "@/components/ui/section-index";
import type { Locale } from "@/lib/i18n/config";

import { type BreadcrumbDict } from "../breadcrumb";
import { PaginaDocumental } from "../pagina-documental";
import { type RelatedDict } from "../related-pages";
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

/**
 * LOS CUATRO BLOQUES, y esta lista es lo que hace VISIBLE una jerarquía que hasta
 * P70.47 solo existía en el comentario de abajo.
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
 * ───────────────────────────────────────────────────────────────────────────────
 * «FUNDAMENTOS» CAMBIA DE FONDO A MITAD, Y NO SE PARTE (P62.5, 2026-08-29).
 *
 * EL PROBLEMA. Sus cinco secciones dejaban **14,1 pantallas seguidas sin un solo
 * cambio de fondo** hasta la banda de «Piezas»: más que la página entera del
 * Brand Kit (15,4) y que Accesibilidad completa (13,4). El tramo más plano del
 * sitio medía lo que una hermana entera, que es el síntoma que D125 nació a
 * corregir.
 *
 * POR QUÉ NO UNA SEGUNDA BANDA, que fue mi primera versión y la descartó
 * Francisco viéndola: la banda significa «empieza otra familia», y aquí no
 * empieza ninguna. Una banda más habría comprado ritmo diciendo algo falso, y de
 * paso habría gastado la moneda: cinco bandas en una página hacen que ninguna
 * signifique gran cosa. El fondo cambia y la banda inicial conserva su valor.
 *
 * DÓNDE CAE EL CORTE LO DECIDIÓ LA MEDICIÓN, y la primera intuición falló. Por
 * familia —las tres decisiones de medida contra las dos que no se miden en
 * píxeles, o sea desde §04— el tramo malo se quedaba en **10,9**, porque el peso
 * no está repartido: §01 «Rejilla» mide ella sola **5,88 pantallas** y §03
 * «Tipografía» otras 3,99, contra 1,01 de §02 y 1,22 de §05. Cortando en §03
 * salen **6,89 y 6,82**, la única de las cuatro particiones posibles que deja las
 * dos mitades por debajo del techo y por encima del suelo.
 *
 * Y por eso el corte NO coincide con la frontera de familia: manda la aritmética,
 * porque el tinte no anuncia nada — no tiene titular que pudiera mentir.
 * ───────────────────────────────────────────────────────────────────────────────
 *
 * Y LO QUE ESTA LISTA NO PUEDE COSTAR: que el archivo deje de leerse de un
 * vistazo. Repartir las doce en cuatro familias es lo único que añade sobre
 * escribirlas seguidas; el orden de la página sigue viéndose entero aquí.
 *
 * ANTES DE AÑADIR UN QUINTO BLOQUE, la pregunta es la densidad, y ahora tiene DOS
 * mitades y DOS palancas: por arriba, más de un bloque cada ~6 pantallas se lee a
 * golpes; por abajo, un tramo de más de ~10 sin cambio de fondo pide romperse
 * —con banda si de verdad empieza otra familia, con `tinteDesde` si sigue la
 * misma—. El porqué medido, en `ui/block-opener.tsx`.
 */
const BLOQUES = [
  {
    id: "fundamentos",
    claves: ["rejilla", "ritmo", "tipografia", "claroscuro", "movimiento"],
    tinteDesde: "tipografia",
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

  // Las paradas y sus marcos, derivados del orden: el ordinal es la POSICIÓN y el
  // rótulo lo pone el copy. Nada de esto se escribe dos veces — ni aquí, ni en las
  // dos páginas hermanas: el cálculo vive en la capa desde P50.88.
  const { paradas, marcos } = construirRecorrido(ORDEN, t, t.indice);

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
    enlaces: (
      <Enlaces t={t.enlaces} marco={marcos.enlaces} demoSufijo={t.demoSufijo} />
    ),
    botones: (
      <Botones t={t.botones} marco={marcos.botones} demoSufijo={t.demoSufijo} />
    ),
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
    <PaginaDocumental
      hero={
        <Hero
          t={t.hero}
          crumb={t.crumb}
          breadcrumb={breadcrumb}
          homeHref={homeHref}
        />
      }
      t={t}
      paradas={paradas}
      bloques={BLOQUES}
      secciones={secciones}
      related={related}
      current="designSystem"
      lang={lang}
    />
  );
}
