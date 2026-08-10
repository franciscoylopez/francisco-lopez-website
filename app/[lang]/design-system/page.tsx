import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DesignSystem } from "@/components/site/design-system";
import { PageShell } from "@/components/site/page-shell";
import { locales, isLocale, pagePath } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/page-meta";
import { getDictionary } from "../dictionaries";

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

  const dict = await getDictionary(lang);
  return pageMetadata({ lang, slug: SLUG, meta: dict.designSystem.meta });
}

export default async function DesignSystemPage({ params }: LangParams) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <PageShell dict={dict} lang={lang} crumb={dict.designSystem.crumb}>
      <DesignSystem
        dict={dict.designSystem}
        related={dict.related}
        breadcrumb={dict.breadcrumb}
        homeHref={pagePath(lang)}
        lang={lang}
      />
    </PageShell>
  );
}
