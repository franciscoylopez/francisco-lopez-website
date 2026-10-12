import type { Metadata } from "next";

import { ComoSeHaCreado } from "@/components/site/como-se-ha-creado";
import { PageShell } from "@/components/site/page-shell";
import { pagePath } from "@/lib/i18n/config";
import {
  cargaPagina,
  metadataDePagina,
  paramsPorLocale,
  type LangParams,
} from "@/lib/page-route";
import { techArticleLd } from "@/lib/structured-data";
import { getCommon, getComoSeHaCreado } from "../dictionaries";

// EL SLUG INTERNO, QUE ES EL DE LA CARPETA y va en español porque el sitio es
// ES-first (D2). No es la ruta pública en inglés: desde P72.56 esta misma
// página se sirve en `/en/how-it-was-built`, y quien traduce es `SLUGS_EN` de
// `lib/routes.ts`. Escribir aquí la ruta sería la segunda copia de ese mapa.
const SLUG = "como-se-ha-creado";

export function generateStaticParams() {
  return paramsPorLocale();
}

export async function generateMetadata({
  params,
}: LangParams): Promise<Metadata> {
  // Única página del sitio con `og:type: "article"` y JSON-LD `TechArticle`
  // (P60): es la única que cuenta un proceso con fecha de publicación real.
  return metadataDePagina(params, SLUG, getComoSeHaCreado, {
    ogType: "article",
  });
}

export default async function ComoSeHaCreadoPage({ params }: LangParams) {
  const { lang, common, t } = await cargaPagina(
    params,
    getCommon,
    getComoSeHaCreado,
  );

  return (
    <PageShell
      dict={common}
      lang={lang}
      crumb={t.crumb}
      article
      extraLd={techArticleLd({
        lang,
        headline: t.hero.title,
        description: t.meta.description,
      })}
    >
      <ComoSeHaCreado
        dict={t}
        lang={lang}
        breadcrumb={common.breadcrumb}
        homeHref={pagePath(lang)}
      />
    </PageShell>
  );
}
