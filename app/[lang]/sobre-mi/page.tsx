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

// Slug único para ambos locales (`/sobre-mi`, `/en/sobre-mi`), como el resto de
// páginas propias del sitio (brand-kit, design-system, cookies): el segmento
// estático no se localiza. Sitio ES-first (D2), así que el slug va en español.
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
