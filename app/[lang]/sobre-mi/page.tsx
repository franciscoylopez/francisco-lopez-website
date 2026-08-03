import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Footer } from "@/components/site/footer";
import { JsonLd } from "@/components/site/json-ld";
import { Nav } from "@/components/site/nav";
import { RevealRoot } from "@/components/site/reveal-root";
import { SobreMi } from "@/components/site/sobre-mi";
import { locales, isLocale, cvPath } from "@/lib/i18n/config";
import { breadcrumbLd, homeUrl } from "@/lib/structured-data";
import { getDictionary } from "../dictionaries";

type LangParams = { params: Promise<{ lang: string }> };

// Slug único para ambos locales (`/sobre-mi`, `/en/sobre-mi`), como el resto de
// páginas propias del sitio (brand-kit, design-system, cookies): el segmento
// estático no se localiza. Sitio ES-first (D2), así que el slug va en español.

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LangParams): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const path = lang === "es" ? "/sobre-mi" : "/en/sobre-mi";

  return {
    title: dict.sobreMi.meta.title,
    description: dict.sobreMi.meta.description,
    alternates: {
      canonical: path,
      languages: {
        es: "/sobre-mi",
        en: "/en/sobre-mi",
        "x-default": "/sobre-mi",
      },
    },
    openGraph: {
      title: dict.sobreMi.meta.title,
      description: dict.sobreMi.meta.description,
      url: path,
      siteName: "Francisco López",
      locale: lang === "es" ? "es_ES" : "en_US",
      type: "profile",
      images: [
        {
          url: `/api/og?card=sobre-mi&lang=${lang}`,
          width: 1200,
          height: 630,
          alt: dict.sobreMi.meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.sobreMi.meta.title,
      description: dict.sobreMi.meta.description,
      images: [`/api/og?card=sobre-mi&lang=${lang}`],
    },
  };
}

export default async function SobreMiPage({ params }: LangParams) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const homeHref = lang === "es" ? "/" : `/${lang}`;

  const breadcrumbData = breadcrumbLd([
    { name: dict.breadcrumb.home, url: homeUrl(lang) },
    { name: dict.sobreMi.crumb },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbData} />
      <Nav dict={dict.nav} homeHref={homeHref} lang={lang} />
      <RevealRoot>
        <SobreMi
          dict={dict.sobreMi}
          contacto={dict.contacto}
          breadcrumb={dict.breadcrumb}
          homeHref={homeHref}
          cvHref={cvPath(lang)}
        />
      </RevealRoot>
      <Footer dict={dict.footer} lang={lang} />
    </>
  );
}
