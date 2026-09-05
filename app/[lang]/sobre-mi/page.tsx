import type { Metadata } from "next";

import { PageShell } from "@/components/site/page-shell";
import { SobreMi } from "@/components/site/sobre-mi";
import { pagePath } from "@/lib/i18n/config";
import {
  cargaPagina,
  metadataDePagina,
  paramsPorLocale,
  type LangParams,
} from "@/lib/page-route";
import { getCommon, getSobreMi } from "../dictionaries";

// EL SLUG INTERNO, QUE ES EL DE LA CARPETA y va en español porque el sitio es
// ES-first (D2). No es la ruta pública en inglés: desde P72.56 esta misma
// página se sirve en `/en/about`, y quien traduce es `SLUGS_EN` de
// `lib/routes.ts`. Escribir aquí la ruta sería la segunda copia de ese mapa.
const SLUG = "sobre-mi";

export function generateStaticParams() {
  return paramsPorLocale();
}

export async function generateMetadata({
  params,
}: LangParams): Promise<Metadata> {
  // La única página con `og:type` propio: es un perfil, no un documento.
  return metadataDePagina(params, SLUG, getSobreMi, { ogType: "profile" });
}

export default async function SobreMiPage({ params }: LangParams) {
  const { lang, common, t } = await cargaPagina(params, getCommon, getSobreMi);

  return (
    <PageShell dict={common} lang={lang} crumb={t.crumb}>
      <SobreMi
        dict={t}
        contacto={common.contacto}
        breadcrumb={common.breadcrumb}
        homeHref={pagePath(lang)}
        contactoHref={pagePath(lang, "contacto")}
      />
    </PageShell>
  );
}
