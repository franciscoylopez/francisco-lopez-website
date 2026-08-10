import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CookiesPolicy } from "@/components/site/cookies-policy";
import { PageShell } from "@/components/site/page-shell";
import { locales, isLocale, pagePath } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/page-meta";
import { getDictionary } from "../dictionaries";

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

  const dict = await getDictionary(lang);
  return pageMetadata({ lang, slug: SLUG, meta: dict.cookies.meta });
}

export default async function CookiesPage({ params }: LangParams) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <PageShell dict={dict} lang={lang} crumb={dict.cookies.crumb}>
      <CookiesPolicy
        dict={dict.cookies}
        breadcrumb={dict.breadcrumb}
        homeHref={pagePath(lang)}
      />
    </PageShell>
  );
}
