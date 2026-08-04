import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { notFound } from "next/navigation";

import "../globals.css";

import { ConsentInit } from "@/components/analytics/consent-init";
import { GoogleTagManager } from "@/components/analytics/google-tag-manager";
import { ConsentBanner } from "@/components/site/consent-banner";
import { ThemeProvider } from "@/components/theme-provider";
import { locales, isLocale } from "@/lib/i18n/config";
import { GTM_ID, SITE_NAME, SITE_URL } from "@/lib/site";
import { getDictionary } from "./dictionaries";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  // 600 para titulares (BRAND.md); 400 solo para la línea de cierre de "Más allá
  // del PM", que el diseño validado (§8.3) compone en Bricolage ligera.
  weight: ["400", "600"],
});

type LangParams = { params: Promise<{ lang: string }> };

// Genera estáticamente ambos locales (D2). El rewrite del proxy sirve `/es` en la raíz.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F3EC" },
    { media: "(prefers-color-scheme: dark)", color: "#191D21" },
  ],
};

export async function generateMetadata({
  params,
}: LangParams): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const canonical = lang === "es" ? "/" : "/en";

  return {
    metadataBase: new URL(SITE_URL),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical,
      // hreflang emparejando / <-> /en (D2), con x-default al español.
      languages: {
        es: "/",
        en: "/en",
        "x-default": "/",
      },
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url: canonical,
      siteName: SITE_NAME,
      locale: lang === "es" ? "es_ES" : "en_US",
      type: "website",
      images: [
        {
          url: `/api/og?card=home&lang=${lang}`,
          width: 1200,
          height: 630,
          alt: dict.meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: [`/api/og?card=home&lang=${lang}`],
    },
    icons: {
      icon: [
        {
          url: "/favicon-claro-16.png",
          sizes: "16x16",
          type: "image/png",
          media: "(prefers-color-scheme: light)",
        },
        {
          url: "/favicon-claro-32.png",
          sizes: "32x32",
          type: "image/png",
          media: "(prefers-color-scheme: light)",
        },
        {
          url: "/favicon-claro-48.png",
          sizes: "48x48",
          type: "image/png",
          media: "(prefers-color-scheme: light)",
        },
        {
          url: "/favicon-oscuro-16.png",
          sizes: "16x16",
          type: "image/png",
          media: "(prefers-color-scheme: dark)",
        },
        {
          url: "/favicon-oscuro-32.png",
          sizes: "32x32",
          type: "image/png",
          media: "(prefers-color-scheme: dark)",
        },
        {
          url: "/favicon-oscuro-48.png",
          sizes: "48x48",
          type: "image/png",
          media: "(prefers-color-scheme: dark)",
        },
      ],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: LangParams & { children: React.ReactNode }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${inter.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Analítica solo en producción (D13). ConsentInit va antes que GTM
            (beforeInteractive) para fijar el default denegado; sin contenedor que
            lo lea no tiene nada que hacer, así que comparte gate con él. */}
        {GTM_ID && (
          <>
            <ConsentInit />
            <GoogleTagManager gtmId={GTM_ID} />
          </>
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        {/* La UI de consentimiento se monta en TODOS los entornos (P37.5975). No
            comparte gate con la analítica: no envía nada a ningún sitio, y colgarla
            de `GTM_ID` dejaba un modal con cuatro botones y un switch que solo
            existía en producción — imposible de revisar antes de publicarlo. */}
        <ConsentBanner dict={dict.consent} lang={lang} />
      </body>
    </html>
  );
}
