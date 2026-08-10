import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Accesibilidad } from "@/components/site/accesibilidad";
import { PageShell } from "@/components/site/page-shell";
import { locales, isLocale, pagePath } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/page-meta";
import { getCommon, getAccesibilidad } from "../dictionaries";

type LangParams = { params: Promise<{ lang: string }> };

// Slug único para ambos locales (`/accesibilidad`, `/en/accesibilidad`), como el
// resto de páginas propias (brand-kit, design-system, cookies): el segmento estático
// no se localiza. Sitio ES-first (D2), así que el slug va en español.
const SLUG = "accesibilidad";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LangParams): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const t = await getAccesibilidad(lang);
  return pageMetadata({ lang, slug: SLUG, meta: t.meta });
}

export default async function AccesibilidadPage({ params }: LangParams) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const [common, t] = await Promise.all([
    getCommon(lang),
    getAccesibilidad(lang),
  ]);

  return (
    <PageShell dict={common} lang={lang} crumb={t.crumb}>
      <Accesibilidad
        dict={t}
        related={common.related}
        breadcrumb={common.breadcrumb}
        homeHref={pagePath(lang)}
        lang={lang}
      />
    </PageShell>
  );
}
