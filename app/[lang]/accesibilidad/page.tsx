import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Accesibilidad } from "@/components/site/accesibilidad";
import { Footer } from "@/components/site/footer";
import { JsonLd } from "@/components/site/json-ld";
import { Nav } from "@/components/site/nav";
import { RevealRoot } from "@/components/site/reveal-root";
import { locales, isLocale } from "@/lib/i18n/config";
import { breadcrumbLd, homeUrl } from "@/lib/structured-data";
import { getDictionary } from "../dictionaries";

type LangParams = { params: Promise<{ lang: string }> };

// Slug único para ambos locales (`/accesibilidad`, `/en/accesibilidad`), como el
// resto de páginas propias (brand-kit, design-system, cookies): el segmento estático
// no se localiza. Sitio ES-first (D2), así que el slug va en español.

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LangParams): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const path = lang === "es" ? "/accesibilidad" : "/en/accesibilidad";

  return {
    title: dict.accesibilidad.meta.title,
    description: dict.accesibilidad.meta.description,
    alternates: {
      canonical: path,
      languages: {
        es: "/accesibilidad",
        en: "/en/accesibilidad",
        "x-default": "/accesibilidad",
      },
    },
    openGraph: {
      title: dict.accesibilidad.meta.title,
      description: dict.accesibilidad.meta.description,
      url: path,
      siteName: "Francisco López",
      locale: lang === "es" ? "es_ES" : "en_US",
      type: "website",
      images: [
        {
          url: `/api/og?card=accesibilidad&lang=${lang}`,
          width: 1200,
          height: 630,
          alt: dict.accesibilidad.meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.accesibilidad.meta.title,
      description: dict.accesibilidad.meta.description,
      images: [`/api/og?card=accesibilidad&lang=${lang}`],
    },
  };
}

export default async function AccesibilidadPage({ params }: LangParams) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const homeHref = lang === "es" ? "/" : `/${lang}`;

  const breadcrumbData = breadcrumbLd([
    { name: dict.breadcrumb.home, url: homeUrl(lang) },
    { name: dict.accesibilidad.crumb },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbData} />
      <Nav dict={dict.nav} homeHref={homeHref} lang={lang} />
      <RevealRoot>
        <Accesibilidad
          dict={dict.accesibilidad}
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
