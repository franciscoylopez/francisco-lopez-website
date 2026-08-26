import type { Dictionary } from "@/app/[lang]/dictionaries";
import { SECTION, WRAP } from "@/components/ui/layout";
import {
  SectionCloser,
  SectionIndex,
  type SeccionMarco,
} from "@/components/ui/section-index";
import { SectionRail } from "@/components/ui/section-index-islands";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

import { type BreadcrumbDict } from "../breadcrumb";
import { RelatedPages, type RelatedDict } from "../related-pages";
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

/** El ancla del índice. Misma convención que sus hermanas. */
const ANCLA_INDICE = "indice";

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

  const paradas = ORDEN.map((clave, i) => {
    const ordinal = String(i + 1).padStart(2, "0");
    return { clave, id: `s${ordinal}`, ordinal, label: t[clave].indexLabel };
  });

  /** Indexado por clave, no por posición: `marcos.color` no se desalinea al
   *  insertar una sección en medio. El eyebrow se compone con una PLANTILLA para
   *  que salga como un solo nodo de texto —React separa los adyacentes con
   *  `<!-- -->`— y las seis cabeceras no cambien ni un byte. */
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

  return (
    <>
      <Hero
        t={t.hero}
        crumb={t.crumb}
        breadcrumb={breadcrumb}
        homeHref={homeHref}
      />

      {/* Después del hero, o sea después del `h1`: el riel es `fixed`, así que
          moverlo no cambia nada en pantalla pero sí el orden de tabulación. */}
      <SectionRail items={paradas} ariaLabel={t.indice.railAriaLabel} />

      <section id={ANCLA_INDICE} className={cn(SECTION, "scroll-mt-[5rem]")}>
        <div className={WRAP}>
          {/* Sin `meta` por celda: aquí no hay prosa que cronometrar. */}
          <SectionIndex
            kicker={t.indice.kicker}
            ariaLabel={t.indice.ariaLabel}
            items={paradas}
          />
        </div>
      </section>

      <Concepto t={t.concepto} marco={marcos.concepto} />
      <Logotipo t={t.logotipo} marco={marcos.logotipo} />
      <Color t={t.color} marco={marcos.color} lang={lang} />
      <Tipografia t={t.tipografia} marco={marcos.tipografia} />
      <Aplicaciones
        t={t.aplicaciones}
        marco={marcos.aplicaciones}
        tKit={t.logotipo.enElKit}
        lang={lang}
      />
      <Uso t={t.uso} marco={marcos.uso} />

      <RelatedPages dict={related} current="brandKit" lang={lang} />
    </>
  );
}
