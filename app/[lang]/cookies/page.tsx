import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CookiesPolicy } from "@/components/site/cookies-policy";
import { Footer } from "@/components/site/footer";
import { JsonLd } from "@/components/site/json-ld";
import { Nav } from "@/components/site/nav";
import { RevealRoot } from "@/components/site/reveal-root";
import { locales, isLocale } from "@/lib/i18n/config";
import { cvPath } from "@/lib/site";
import { breadcrumbLd, homeUrl } from "@/lib/structured-data";
import { getDictionary } from "../dictionaries";

type LangParams = { params: Promise<{ lang: string }> };


export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LangParams): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const path = lang === "es" ? "/cookies" : "/en/cookies";

  return {
    title: dict.cookies.meta.title,
    description: dict.cookies.meta.description,
    alternates: {
      canonical: path,
      languages: {
        es: "/cookies",
        en: "/en/cookies",
        "x-default": "/cookies",
      },
    },
    openGraph: {
      title: dict.cookies.meta.title,
      description: dict.cookies.meta.description,
      url: path,
      siteName: "Francisco López",
      locale: lang === "es" ? "es_ES" : "en_US",
      type: "website",
      images: [
        {
          url: `/api/og?card=cookies&lang=${lang}`,
          width: 1200,
          height: 630,
          alt: dict.cookies.meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.cookies.meta.title,
      description: dict.cookies.meta.description,
      images: [`/api/og?card=cookies&lang=${lang}`],
    },
  };
}

export default async function CookiesPage({ params }: LangParams) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const homeHref = lang === "es" ? "/" : `/${lang}`;

  const breadcrumbData = breadcrumbLd([
    { name: dict.breadcrumb.home, url: homeUrl(lang) },
    { name: dict.cookies.crumb },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbData} />
      <Nav dict={dict.nav} cvHref={cvPath(lang)} homeHref={homeHref} lang={lang} />
      <RevealRoot>
        <CookiesPolicy
          dict={dict.cookies}
          breadcrumb={dict.breadcrumb}
          homeHref={homeHref}
        />
      </RevealRoot>
      <Footer dict={dict.footer} lang={lang} />
    </>
  );
}
