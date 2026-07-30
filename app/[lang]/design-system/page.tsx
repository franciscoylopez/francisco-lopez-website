import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DesignSystem } from "@/components/site/design-system";
import { Footer } from "@/components/site/footer";
import { JsonLd } from "@/components/site/json-ld";
import { Nav } from "@/components/site/nav";
import { RevealRoot } from "@/components/site/reveal-root";
import { locales, isLocale } from "@/lib/i18n/config";
import { cvPath } from "@/lib/site";
import { breadcrumbLd, homeUrl } from "@/lib/structured-data";
import { getDictionary } from "../dictionaries";

type LangParams = { params: Promise<{ lang: string }> };


// metadataBase, icons y viewport los aporta el layout de [lang]; aquí solo van los
// campos propios de la página (title, description, alternates, OG). Las URLs
// relativas de canonical/OG resuelven contra ese metadataBase heredado.

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LangParams): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const path = lang === "es" ? "/design-system" : "/en/design-system";

  return {
    title: dict.designSystem.meta.title,
    description: dict.designSystem.meta.description,
    alternates: {
      canonical: path,
      languages: {
        es: "/design-system",
        en: "/en/design-system",
        "x-default": "/design-system",
      },
    },
    openGraph: {
      title: dict.designSystem.meta.title,
      description: dict.designSystem.meta.description,
      url: path,
      siteName: "Francisco López",
      locale: lang === "es" ? "es_ES" : "en_US",
      type: "website",
      images: [
        {
          url: `/api/og?card=design-system&lang=${lang}`,
          width: 1200,
          height: 630,
          alt: dict.designSystem.meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.designSystem.meta.title,
      description: dict.designSystem.meta.description,
      images: [`/api/og?card=design-system&lang=${lang}`],
    },
  };
}

export default async function DesignSystemPage({ params }: LangParams) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const homeHref = lang === "es" ? "/" : `/${lang}`;

  // BreadcrumbList: mismo camino que el breadcrumb visible (Inicio › Design System).
  const breadcrumbData = breadcrumbLd([
    { name: dict.breadcrumb.home, url: homeUrl(lang) },
    { name: dict.designSystem.crumb },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbData} />
      <Nav dict={dict.nav} cvHref={cvPath(lang)} homeHref={homeHref} lang={lang} />
      <RevealRoot>
        <DesignSystem
          dict={dict.designSystem}
          related={dict.related}
          breadcrumb={dict.breadcrumb}
          homeHref={homeHref}
          lang={lang}
        />
      </RevealRoot>
      <Footer dict={dict.footer} lang={lang} />
    </>
  );
}
