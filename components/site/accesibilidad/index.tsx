import { type ReactNode } from "react";

import type { Dictionary } from "@/app/[lang]/dictionaries";
import { SectionBlocks } from "@/components/ui/block-opener";
import {
  construirRecorrido,
  SectionIndexBlock,
} from "@/components/ui/section-index";
import { GUARDIAN_CASE_COUNT, GUARDIAN_COUNT } from "@/lib/design-values";
import type { Locale } from "@/lib/i18n/config";

import { type BreadcrumbDict } from "../breadcrumb";
import { RelatedPages, type RelatedDict } from "../related-pages";
import { Hero } from "./hero";
import { Conformance } from "./01-conformance";
import { Measures } from "./02-measures";
import { Inheritance } from "./03-inheritance";
import { Verify } from "./04-verify";
import { Blindspot } from "./05-blindspot";
import { Limits } from "./06-limits";
import { Term } from "./07-term";
import { Report } from "./08-report";
import { hacerFillCounts } from "./shared";

type AccesibilidadDict = Dictionary["accesibilidad"];

/**
 * LAS OCHO PARADAS, EN ORDEN — única fuente del recorrido (P70.41). El ordinal
 * lo pone la POSICIÓN y el copy solo aporta el rótulo corto, así que reordenar
 * la página no puede dejar el índice diciendo «07» donde la cabecera dice «08».
 *
 * Y AQUÍ ESO NO ES HIGIENE, ES COHERENCIA: esta es la página que publica el
 * checklist de nueve puntos, así que un índice o un riel mal hechos no serían un
 * defecto sino la página contradiciéndose.
 */
const ORDEN = [
  "conformance",
  "measures",
  "inheritance",
  "verify",
  "blindspot",
  "limits",
  "term",
  "report",
] as const;

const ANCLA_INDICE = "indice";

/**
 * LOS DOS BLOQUES (P70.47). El corte cae donde la página CAMBIA DE ARGUMENTO:
 * primero declara lo que cumple y cómo lo prueba (01-04); después, dónde no llega
 * y cómo avisarlo (05-08).
 *
 * Aquí van las CLAVES y nada más: el título y la entradilla son copy y viven en
 * el diccionario, y los ordinales de la banda salen de `paradas`.
 *
 * ANTES ERAN DOS `<BlockOpener>` INSERTADOS A MANO en mitad del JSX, con un
 * comentario que lo justificaba: «esta página NO está partida en un archivo por
 * sección como sus dos hermanas». Eso es lo que arregla P50.89 — el comentario
 * ya no hace falta porque el hecho que describía dejó de ser cierto.
 */
const BLOQUES = [
  {
    id: "cumple",
    claves: ["conformance", "measures", "inheritance", "verify"],
  },
  { id: "limites", claves: ["blindspot", "limits", "term", "report"] },
] as const;

// Página de Accesibilidad (PRD §9, V2). Hermana de Brand Kit / Design System (D21):
// mismo lenguaje visual —hero con composición a la derecha + fila de datos, secciones
// numeradas con `SectionHeader`, encabezado grande a la izquierda y contenido a ancho
// completo—, breadcrumb, RelatedPages y JSON-LD BreadcrumbList. Es la declaración
// PÚBLICA de conformidad (el nivel WCAG que cumple el sitio y cómo reportar una
// barrera), contrapunto del criterio interno de la sección 08 del Design System.
//
// El contenido está medido y verificado (axe 0 violaciones en claro/oscuro,
// Lighthouse a11y 100). La cifra de conformidad y la fecha de
// `conformance.updated` se revisan tras cada QA de accesibilidad del build, no se
// declaran de memoria.
//
// UN ARCHIVO POR SECCIÓN (P50.89), y aquí el criterio NO fue el tamaño: con 870
// líneas no disparaba el que partió a sus dos hermanas (1.512 y 1.280), y tampoco
// tenía auxiliares pegados cada uno a su sección esperando a irse con ella. El eje
// es otro: la COMPONIBILIDAD DESDE FUERA. Sus ocho secciones eran JSX dentro de un
// solo `return`, así que un cambio de nivel de página no podía envolverlas ni
// intercalarlas — y eso ya había costado tres veces: el índice y el cierre de
// bloque hubo que enhebrarlos a mano, el prototipo de ritmo tuvo que montarse por
// CSS y `order` de flexbox encima de la página real, y `BlockOpener` entró aquí
// escrito dos veces a mano mientras en las hermanas salía de un bucle. Esa tercera
// es la que lo paga.
//
// Este archivo es lo que dice ser: el orden de la página, legible de un vistazo.

export function Accesibilidad({
  dict,
  related,
  breadcrumb,
  homeHref,
  lang,
}: {
  dict: AccesibilidadDict;
  related: RelatedDict;
  breadcrumb: BreadcrumbDict;
  homeHref: string;
  lang: Locale;
}) {
  const t = dict;

  /** El recorrido lo deriva la capa desde P50.88, igual que en sus dos hermanas.
   *  El porqué y lo que se comprobó antes de unificar, en `ui/section-index.tsx`. */
  const { paradas, marcos } = construirRecorrido(
    ORDEN,
    t,
    t.indice,
    ANCLA_INDICE,
  );

  // Los recuentos del checklist, derivados una vez donde está su fuente y bajados
  // a las dos secciones que los pintan. El porqué de cada cifra, en `shared.tsx`.
  const fillCounts = hacerFillCounts(t.measures.items, lang, {
    comprobaciones: GUARDIAN_COUNT,
    fingidos: GUARDIAN_CASE_COUNT,
  });

  /** Cada sección con su rebanada, indexada por clave: las reparte el bucle de
   *  `BLOQUES`, y un mapa por clave no se desalinea al insertar una en medio. */
  const secciones: Record<(typeof ORDEN)[number], ReactNode> = {
    conformance: (
      <Conformance t={t.conformance} marco={marcos.conformance} lang={lang} />
    ),
    measures: (
      <Measures
        t={t.measures}
        marco={marcos.measures}
        fillCounts={fillCounts}
      />
    ),
    inheritance: (
      <Inheritance t={t.inheritance} marco={marcos.inheritance} lang={lang} />
    ),
    verify: (
      <Verify
        t={t.verify}
        marco={marcos.verify}
        fillCounts={fillCounts}
        lang={lang}
      />
    ),
    blindspot: (
      <Blindspot t={t.blindspot} marco={marcos.blindspot} lang={lang} />
    ),
    limits: <Limits t={t.limits} marco={marcos.limits} />,
    term: <Term t={t.term} marco={marcos.term} />,
    report: <Report t={t.report} marco={marcos.report} />,
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

      <SectionBlocks
        bloques={BLOQUES}
        copy={t.bloques}
        paradas={paradas}
        secciones={secciones}
      />

      <RelatedPages dict={related} current="accesibilidad" lang={lang} />
    </>
  );
}
