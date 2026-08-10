import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Accesibilidad } from "@/components/site/accesibilidad";
import { PageShell } from "@/components/site/page-shell";
import { locales, isLocale, pagePath } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/page-meta";
import { getDictionary } from "../dictionaries";

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

  const dict = await getDictionary(lang);
  return pageMetadata({ lang, slug: SLUG, meta: dict.accesibilidad.meta });
}

export default async function AccesibilidadPage({ params }: LangParams) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <PageShell dict={dict} lang={lang} crumb={dict.accesibilidad.crumb}>
      <Accesibilidad
        dict={dict.accesibilidad}
        related={dict.related}
        breadcrumb={dict.breadcrumb}
        homeHref={pagePath(lang)}
        lang={lang}
      />
    </PageShell>
  );
}
