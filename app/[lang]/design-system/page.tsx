import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DesignSystem } from "@/components/site/design-system";
import { PageShell } from "@/components/site/page-shell";
import { locales, isLocale, pagePath } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/page-meta";
import { getCommon, getDesignSystem } from "../dictionaries";

type LangParams = { params: Promise<{ lang: string }> };

const SLUG = "design-system";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LangParams): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const t = await getDesignSystem(lang);
  return pageMetadata({ lang, slug: SLUG, meta: t.meta });
}

export default async function DesignSystemPage({ params }: LangParams) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const [common, t] = await Promise.all([
    getCommon(lang),
    getDesignSystem(lang),
  ]);

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
