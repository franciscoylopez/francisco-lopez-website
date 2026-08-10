import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { notFound } from "next/navigation";

import "../globals.css";

import { ConsentInit } from "@/components/analytics/consent-init";
import { GoogleTagManager } from "@/components/analytics/google-tag-manager";
import { ConsentBanner } from "@/components/site/consent-banner";
import { ThemeProvider } from "@/components/theme-provider";
import { paletteHex } from "@/lib/design-values";
import { locales, isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/page-meta";
import { GTM_ID, SITE_URL } from "@/lib/site";
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

// `themeColor` pinta la barra del navegador en móvil, y Next exige un color
// literal —no admite `var(--background)`—, así que la copia es inevitable. Lo que
// no lo era es escribirla a mano: se deriva de la paleta única (P37.659), igual
// que las imágenes OG. Antes eran dos hexes sueltos que `check:palette` no miraba.
export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: paletteHex("light").background,
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: paletteHex("dark").background,
    },
  ],
};

export async function generateMetadata({
  params,
}: LangParams): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  // La metadata de la home sale del MISMO helper que las cinco internas (D45):
  // sin slug —la home es la raíz del locale— y con la tarjeta OG `home`. Lo que
  // el helper no cubre y sí es del layout: `metadataBase` (contra el que resuelven
  // todas las URLs relativas de abajo) e `icons`, que se heredan en todo el sitio.
  return {
    ...pageMetadata({ lang, meta: dict.meta, ogCard: "home" }),
    metadataBase: new URL(SITE_URL),
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
