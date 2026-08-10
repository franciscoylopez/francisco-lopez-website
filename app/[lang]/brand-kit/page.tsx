import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BrandKit } from "@/components/site/brand-kit";
import { PageShell } from "@/components/site/page-shell";
import { locales, isLocale, pagePath } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/page-meta";
import { getCommon, getBrandKit } from "../dictionaries";

type LangParams = { params: Promise<{ lang: string }> };

const SLUG = "brand-kit";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LangParams): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const t = await getBrandKit(lang);
  return pageMetadata({ lang, slug: SLUG, meta: t.meta });
}

export default async function BrandKitPage({ params }: LangParams) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const [common, t] = await Promise.all([getCommon(lang), getBrandKit(lang)]);

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
