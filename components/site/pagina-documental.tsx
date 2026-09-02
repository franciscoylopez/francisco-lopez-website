import type { ReactNode } from "react";

import { SectionBlocks } from "@/components/ui/block-opener";
import {
  ANCLA_INDICE,
  SectionIndexBlock,
  type IndiceDict,
} from "@/components/ui/section-index";
import type { Locale } from "@/lib/i18n/config";

import { RelatedPages, type RelatedDict } from "./related-pages";

// LA ESPINA DE UNA PÁGINA DOCUMENTAL, UNA SOLA VEZ (P72.19, 2026-09-02).
//
// Brand Kit, Design System y Accesibilidad terminan exactamente igual: hero, el
// bloque de índice con las paradas, las secciones repartidas en sus bloques, y las
// páginas relacionadas. Eran las mismas catorce líneas escritas tres veces —Qlty
// solo marcaba dos de los tres pares (mass 79), porque el tercero difería en un
// comentario—, más un `ANCLA_INDICE = "indice"` declarado por triplicado.
//
// ES LA OTRA MITAD DE P50.88. Aquella factorizó el CÁLCULO del recorrido en
// `construirRecorrido` y dejó sin tocar su MONTAJE, que es esto. La primera mitad
// llevaba ahí desde entonces, y una página nueva seguía copiando la segunda.
//
// LO QUE NO ENTRA: el hero. Cada una tiene el suyo, con su propio módulo y su
// propio dibujo, y unificarlos sería lo que BRAND.md prohíbe en su regla 4 —juntar
// dos cosas que se parecen y significan distinto—. Entra ya renderizado.

export function PaginaDocumental<K extends string, B extends string>({
  hero,
  t,
  paradas,
  bloques,
  secciones,
  related,
  current,
  lang,
}: {
  hero: ReactNode;
  /** La rama de la página: de aquí salen el copy del índice y el de los bloques. */
  t: {
    indice: IndiceDict;
    bloques: Record<B, { title: string; lead: string }>;
  };
  paradas: readonly { clave: K; ordinal: string; label: string; id: string }[];
  bloques: readonly { id: B; claves: readonly K[]; tinteDesde?: K }[];
  secciones: Record<K, ReactNode>;
  related: RelatedDict;
  /** Cuál de las páginas relacionadas es esta, para que no se enlace a sí misma. */
  current: React.ComponentProps<typeof RelatedPages>["current"];
  lang: Locale;
}) {
  return (
    <>
      {hero}

      <SectionIndexBlock id={ANCLA_INDICE} t={t.indice} items={[...paradas]} />

      <SectionBlocks
        bloques={[...bloques]}
        copy={t.bloques}
        paradas={paradas}
        secciones={secciones}
      />

      <RelatedPages dict={related} current={current} lang={lang} />
    </>
  );
}
