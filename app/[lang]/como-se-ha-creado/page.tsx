import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ComoSeHaCreado } from "@/components/site/como-se-ha-creado";
import { PageShell } from "@/components/site/page-shell";
import { locales, isLocale, pagePath } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/page-meta";
import { techArticleLd } from "@/lib/structured-data";
import { getCommon, getComoSeHaCreado } from "../dictionaries";

type LangParams = { params: Promise<{ lang: string }> };

// Slug único para los dos locales, como el resto de páginas propias del sitio
// (D2: sitio ES-first, el segmento no se traduce).
const SLUG = "como-se-ha-creado";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LangParams): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const t = await getComoSeHaCreado(lang);
  // Única página del sitio con `og:type: "article"` y JSON-LD `TechArticle`
  // (P60): es la única que cuenta un proceso con fecha de publicación real.
  return pageMetadata({ lang, slug: SLUG, meta: t.meta, ogType: "article" });
}

export default async function ComoSeHaCreadoPage({ params }: LangParams) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const [common, t] = await Promise.all([
    getCommon(lang),
    getComoSeHaCreado(lang),
  ]);

  return (
    <PageShell
      dict={common}
      lang={lang}
      crumb={t.crumb}
      article
      extraLd={techArticleLd({
        lang,
        headline: t.hero.title,
        description: t.meta.description,
      })}
    >
      <ComoSeHaCreado
        dict={t}
        lang={lang}
        breadcrumb={common.breadcrumb}
        homeHref={pagePath(lang)}
      />
    </PageShell>
  );
}
