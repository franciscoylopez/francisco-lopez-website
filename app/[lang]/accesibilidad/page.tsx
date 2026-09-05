import type { Metadata } from "next";

import { Accesibilidad } from "@/components/site/accesibilidad";
import { PageShell } from "@/components/site/page-shell";
import { pagePath } from "@/lib/i18n/config";
import {
  cargaPagina,
  metadataDePagina,
  paramsPorLocale,
  type LangParams,
} from "@/lib/page-route";
import { getCommon, getAccesibilidad } from "../dictionaries";

// EL SLUG INTERNO, QUE ES EL DE LA CARPETA y va en español porque el sitio es
// ES-first (D2). No es la ruta pública en inglés: desde P72.56 esta misma
// página se sirve en `/en/accessibility`, y quien traduce es `SLUGS_EN` de
// `lib/routes.ts`. Escribir aquí la ruta sería la segunda copia de ese mapa.
const SLUG = "accesibilidad";

export function generateStaticParams() {
  return paramsPorLocale();
}

export async function generateMetadata({
  params,
}: LangParams): Promise<Metadata> {
  return metadataDePagina(params, SLUG, getAccesibilidad);
}

export default async function AccesibilidadPage({ params }: LangParams) {
  const { lang, common, t } = await cargaPagina(
    params,
    getCommon,
    getAccesibilidad,
  );

  return (
    <PageShell dict={common} lang={lang} crumb={t.crumb}>
      <Accesibilidad
        dict={t}
        related={common.related}
        breadcrumb={common.breadcrumb}
        homeHref={pagePath(lang)}
        lang={lang}
      />
    </PageShell>
  );
}
