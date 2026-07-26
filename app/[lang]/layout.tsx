import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { notFound } from "next/navigation";

import "../globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { locales, isLocale } from "@/lib/i18n/config";
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

// El dominio propio llega en el sprint de lanzamiento (D9). Hasta entonces,
// override por env para que OG/canonical funcionen en los previews de Vercel.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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
      siteName: "Francisco López",
      locale: lang === "es" ? "es_ES" : "en_US",
      type: "website",
      images: [
        {
          url: "/og/og-home-1200x630.jpg",
          width: 1200,
          height: 630,
          alt: dict.meta.title,
        },
      ],
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

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${inter.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
