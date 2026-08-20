import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CookiesPolicy } from "@/components/site/cookies-policy";
import { PageShell } from "@/components/site/page-shell";
import { locales, isLocale, pagePath } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/page-meta";
import { getCommon, getCookies } from "../dictionaries";

type LangParams = { params: Promise<{ lang: string }> };

const SLUG = "cookies";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LangParams): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const t = await getCookies(lang);
  return pageMetadata({ lang, slug: SLUG, meta: t.meta });
}

export default async function CookiesPage({ params }: LangParams) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const [common, t] = await Promise.all([getCommon(lang), getCookies(lang)]);

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
