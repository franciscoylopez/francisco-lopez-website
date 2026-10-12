import { type ReactNode } from "react";

import type { Dictionary } from "@/app/[lang]/dictionaries";
import { construirRecorrido } from "@/components/ui/section-index";
import type { Locale } from "@/lib/i18n/config";

import { type BreadcrumbDict } from "../breadcrumb";
import { PaginaDocumental } from "../pagina-documental";
import { type RelatedDict } from "../related-pages";
import { Hero } from "./hero";
import { Concepto } from "./01-concepto";
import { Logotipo } from "./02-logotipo";
import { Color } from "./03-color";
import { Tipografia } from "./04-tipografia";
import { Aplicaciones } from "./05-aplicaciones";
import { Uso } from "./06-uso";

type BrandKitDict = Dictionary["brandKit"];

/**
 * LAS SEIS PARADAS, EN ORDEN — única fuente del recorrido, igual que en el
 * Design System (P70.40). De aquí salen el ancla, el ordinal y la posición que
 * anuncia el cierre; el copy solo aporta el rótulo corto.
 *
 * SEIS PARADAS ERAN LA DUDA de esta tarea, y la rejilla las trata mejor que a
 * doce: `sm:grid-cols-2 lg:grid-cols-3` deja exactamente DOS FILAS LLENAS, sin
 * huecos. La que se ve rala sería una de cinco o de siete, no esta.
 */
const ORDEN = [
  "concepto",
  "logotipo",
  "color",
  "tipografia",
  "aplicaciones",
  "uso",
] as const;

/**
 * LOS DOS BLOQUES (P70.47). Aquí van las CLAVES y nada más: el título y la
 * entradilla son copy y viven en el diccionario, y los ordinales de la banda
 * salen de `paradas`. Reordenar la página no puede dejar una banda anunciando
 * secciones que ya no están debajo.
 *
 * DOS Y NO TRES, y no es estético: lo que fija cada cuánto aparece una banda es el
 * número de BLOQUES, no el de secciones. Con tres caería una cada 4,6 pantallas en
 * una página de 13,9 y se leería a golpes; con dos cae cada 7,4, que es el terreno
 * del Design System. El porqué medido, en `ui/block-opener.tsx`.
 */
const BLOQUES = [
  { id: "hecha", claves: ["concepto", "logotipo", "color", "tipografia"] },
  { id: "uso", claves: ["aplicaciones", "uso"] },
] as const;

// Página Brand Kit (PRD §21). Server Component completo — no tiene islas.
//
// UN ARCHIVO POR SECCIÓN (P37.69), igual que el Design System. Aquí el monolito
// eran 1.280 líneas con una sola sección —la del logotipo— que se llevaba 299 y
// cuatro subcomponentes para ella sola. Este archivo es el orden de la página;
// `shared.tsx` guarda lo poco que de verdad cruza secciones.

export function BrandKit({
  dict,
  related,
  breadcrumb,
  homeHref,
  lang,
}: {
  dict: BrandKitDict;
  related: RelatedDict;
  breadcrumb: BreadcrumbDict;
  homeHref: string;
  lang: Locale;
}) {
  const t = dict;

  /** El recorrido lo deriva la capa desde P50.88: las mismas 26 líneas estaban
   *  escritas aquí, en el Design System y en Accesibilidad. El porqué y lo que se
   *  comprobó antes de unificar, en `ui/section-index.tsx`. */
  const { paradas, marcos } = construirRecorrido(ORDEN, t, t.indice);

  /** Cada sección con su rebanada, indexada por clave: las reparte el bucle de
   *  `BLOQUES`, y un mapa por clave no se desalinea al insertar una en medio. */
  const secciones: Record<(typeof ORDEN)[number], ReactNode> = {
    concepto: <Concepto t={t.concepto} marco={marcos.concepto} />,
    logotipo: <Logotipo t={t.logotipo} marco={marcos.logotipo} />,
    color: <Color t={t.color} marco={marcos.color} lang={lang} />,
    tipografia: <Tipografia t={t.tipografia} marco={marcos.tipografia} />,
    aplicaciones: (
      <Aplicaciones
        t={t.aplicaciones}
        marco={marcos.aplicaciones}
        tKit={t.logotipo.enElKit}
        lang={lang}
      />
    ),
    uso: <Uso t={t.uso} marco={marcos.uso} />,
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
      current="brandKit"
      lang={lang}
    />
  );
}
