import type { Dictionary } from "@/app/[lang]/dictionaries";
import type { Locale } from "@/lib/i18n/config";

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

  return (
    <main id="top">
      <Hero
        t={t.hero}
        crumb={t.crumb}
        breadcrumb={breadcrumb}
        homeHref={homeHref}
      />
      <Concepto t={t.concepto} />
      <Logotipo t={t.logotipo} />
      <Color t={t.color} lang={lang} />
      <Tipografia t={t.tipografia} />
      <Aplicaciones t={t.aplicaciones} lang={lang} />
      <Uso t={t.uso} />

      <RelatedPages dict={related} current="brandKit" lang={lang} />
    </main>
  );
}
