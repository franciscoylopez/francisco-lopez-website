import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageShell } from "@/components/site/page-shell";
import { SobreMi } from "@/components/site/sobre-mi";
import { locales, isLocale, cvPath, pagePath } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/page-meta";
import { getCommon, getSobreMi } from "../dictionaries";

type LangParams = { params: Promise<{ lang: string }> };

// Slug único para ambos locales (`/sobre-mi`, `/en/sobre-mi`), como el resto de
// páginas propias del sitio (brand-kit, design-system, cookies): el segmento
// estático no se localiza. Sitio ES-first (D2), así que el slug va en español.
const SLUG = "sobre-mi";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LangParams): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const t = await getSobreMi(lang);
  // La única página con `og:type` propio: es un perfil, no un documento.
  return pageMetadata({
    lang,
    slug: SLUG,
    meta: t.meta,
    ogType: "profile",
  });
}

export default async function SobreMiPage({ params }: LangParams) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const [common, t] = await Promise.all([getCommon(lang), getSobreMi(lang)]);

  return (
    <PageShell dict={common} lang={lang} crumb={t.crumb}>
      <SobreMi
        dict={t}
        contacto={common.contacto}
        breadcrumb={common.breadcrumb}
        homeHref={pagePath(lang)}
        cvHref={cvPath(lang)}
        contactoHref={pagePath(lang, "contacto")}
      />
    </PageShell>
  );
}
