import type { Metadata } from "next";

import { CookiesPolicy } from "@/components/site/cookies-policy";
import { PageShell } from "@/components/site/page-shell";
import { pagePath } from "@/lib/i18n/config";
import {
  cargaPagina,
  metadataDePagina,
  paramsPorLocale,
  type LangParams,
} from "@/lib/page-route";
import { getCommon, getCookies } from "../dictionaries";

const SLUG = "cookies";

export function generateStaticParams() {
  return paramsPorLocale();
}

export async function generateMetadata({
  params,
}: LangParams): Promise<Metadata> {
  return metadataDePagina(params, SLUG, getCookies);
}

export default async function CookiesPage({ params }: LangParams) {
  const { lang, common, t } = await cargaPagina(params, getCommon, getCookies);

  return (
    <PageShell dict={common} lang={lang} crumb={t.crumb}>
      <CookiesPolicy
        dict={t}
        breadcrumb={common.breadcrumb}
        homeHref={pagePath(lang)}
        lang={lang}
      />
    </PageShell>
  );
}
