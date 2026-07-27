import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BrandKit } from "@/components/site/brand-kit";
import { Footer } from "@/components/site/footer";
import { Nav } from "@/components/site/nav";
import { RevealRoot } from "@/components/site/reveal-root";
import { locales, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "../dictionaries";

type LangParams = { params: Promise<{ lang: string }> };

const CV_HREF = "/cv/francisco-lopez-cv-es.pdf";

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
  const path = lang === "es" ? "/brand-kit" : "/en/brand-kit";

  return {
    title: dict.brandKit.meta.title,
    description: dict.brandKit.meta.description,
    alternates: {
      canonical: path,
      languages: {
        es: "/brand-kit",
        en: "/en/brand-kit",
        "x-default": "/brand-kit",
      },
    },
    openGraph: {
      title: dict.brandKit.meta.title,
      description: dict.brandKit.meta.description,
      url: path,
      siteName: "Francisco López",
      locale: lang === "es" ? "es_ES" : "en_US",
      type: "website",
      // OG por página se genera en P16; hasta entonces, la imagen de la home.
      images: [
        {
          url: "/og/og-home-1200x630.jpg",
          width: 1200,
          height: 630,
          alt: dict.brandKit.meta.title,
        },
      ],
    },
  };
}

export default async function BrandKitPage({ params }: LangParams) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const homeHref = lang === "es" ? "/" : `/${lang}`;

  return (
    <>
      <Nav dict={dict.nav} cvHref={CV_HREF} homeHref={homeHref} lang={lang} />
      <RevealRoot>
        <BrandKit
          dict={dict.brandKit}
          breadcrumb={dict.breadcrumb}
          homeHref={homeHref}
        />
      </RevealRoot>
      <Footer dict={dict.footer} lang={lang} />
    </>
  );
}
