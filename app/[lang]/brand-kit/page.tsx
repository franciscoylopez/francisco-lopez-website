import type { Metadata } from "next";

import { BrandKit } from "@/components/site/brand-kit";
import { PageShell } from "@/components/site/page-shell";
import { pagePath } from "@/lib/i18n/config";
import {
  cargaPagina,
  metadataDePagina,
  paramsPorLocale,
  type LangParams,
} from "@/lib/page-route";
import { getCommon, getBrandKit } from "../dictionaries";

const SLUG = "brand-kit";

export function generateStaticParams() {
  return paramsPorLocale();
}

export async function generateMetadata({
  params,
}: LangParams): Promise<Metadata> {
  return metadataDePagina(params, SLUG, getBrandKit);
}

export default async function BrandKitPage({ params }: LangParams) {
  const { lang, common, t } = await cargaPagina(params, getCommon, getBrandKit);

  return (
    <PageShell dict={common} lang={lang} crumb={t.crumb}>
      <BrandKit
        dict={t}
        related={common.related}
        breadcrumb={common.breadcrumb}
        homeHref={pagePath(lang)}
        lang={lang}
      />
    </PageShell>
  );
}
