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

// Slug único para ambos locales (`/accesibilidad`, `/en/accesibilidad`), como el
// resto de páginas propias (brand-kit, design-system, cookies): el segmento estático
// no se localiza. Sitio ES-first (D2), así que el slug va en español.
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
