import type { Metadata } from "next";

import { DesignSystem } from "@/components/site/design-system";
import { PageShell } from "@/components/site/page-shell";
import { pagePath } from "@/lib/i18n/config";
import {
  cargaPagina,
  metadataDePagina,
  paramsPorLocale,
  type LangParams,
} from "@/lib/page-route";
import { getCommon, getDesignSystem } from "../dictionaries";

const SLUG = "design-system";

export function generateStaticParams() {
  return paramsPorLocale();
}

export async function generateMetadata({
  params,
}: LangParams): Promise<Metadata> {
  return metadataDePagina(params, SLUG, getDesignSystem);
}

export default async function DesignSystemPage({ params }: LangParams) {
  const { lang, common, t } = await cargaPagina(
    params,
    getCommon,
    getDesignSystem,
  );

  return (
    <PageShell dict={common} lang={lang} crumb={t.crumb}>
      <DesignSystem
        dict={t}
        related={common.related}
        breadcrumb={common.breadcrumb}
        homeHref={pagePath(lang)}
        lang={lang}
      />
    </PageShell>
  );
}
