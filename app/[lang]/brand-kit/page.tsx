import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BrandKit } from "@/components/site/brand-kit";
import { PageShell } from "@/components/site/page-shell";
import { locales, isLocale, pagePath } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/page-meta";
import { getDictionary } from "../dictionaries";

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

  const dict = await getDictionary(lang);
  return pageMetadata({ lang, slug: SLUG, meta: dict.brandKit.meta });
}

export default async function BrandKitPage({ params }: LangParams) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <PageShell dict={dict} lang={lang} crumb={dict.brandKit.crumb}>
      <BrandKit
        dict={dict.brandKit}
        related={dict.related}
        breadcrumb={dict.breadcrumb}
        homeHref={pagePath(lang)}
        lang={lang}
      />
    </PageShell>
  );
}
