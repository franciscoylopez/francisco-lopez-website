import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { notFound } from "next/navigation";

import "../globals.css";

import { ConsentInit } from "@/components/analytics/consent-init";
import { GoogleTagManager } from "@/components/analytics/google-tag-manager";
import { ConsentBanner } from "@/components/site/consent-banner";
import { SkipLink } from "@/components/site/skip-link";
import { ThemeProvider } from "@/components/theme-provider";
import { ARD_URL } from "@/lib/ard";
import { paletteHex } from "@/lib/design-values";
import { locales, isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/page-meta";
import { GTM_ID, SITE_URL } from "@/lib/site";
import { getCommon } from "./dictionaries";

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

  const dict = await getCommon(lang);

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

  const dict = await getCommon(lang);

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${inter.variable} ${bricolage.variable} h-full antialiased`}
    >
      {/* EL ENLACE AL CATÁLOGO DE AGENTES (2026-08-31). ARD v0.91 §5.1 pide dos
          cosas a un consumidor: pedir `/.well-known/ard.json` y **honrar un
          `rel="ard"`**. Lo primero funciona sin nosotros; lo segundo hay que
          emitirlo, y es lo que hace que un agente que ya tiene el HTML en la mano
          no necesite una petición a ciegas para saber si existe catálogo.

          VA AQUÍ Y NO EN `pageMetadata`, que es donde vive todo lo demás del
          `<head>`: la Metadata API de Next no sabe emitir un `rel` arbitrario
          —`alternates` solo genera `rel="alternate"`—, así que un `<link>` en el
          árbol es la vía, y React lo iza al `<head>` él solo. Que llegue de
          verdad no se supone: lo comprueba `check:marco` sobre las 28 variantes.

          Y SOLO ESTE `rel`. El heredado `ai-catalog` no se emite aunque sí
          sirvamos su ruta: la relación normativa hoy es esta, apunta al mismo
          documento, y un segundo `<link>` en veintiocho páginas no lo consulta
          nadie que no encuentre ya el well-known. El porqué de las dos rutas,
          en `lib/ard.ts`. */}
      <link rel="ard" href={ARD_URL} />
      <body className="flex min-h-full flex-col">
        {/* Primer hijo del <body>, por delante del bloque de GTM: es lo primero
            que tiene que recibir el foco al tabular (WCAG 2.4.1, nivel A). */}
        <SkipLink label={dict.nav.skipToContent} />
        {/* EL AVISO DE CONSENTIMIENTO VA AQUÍ, NO AL FINAL DEL `<body>` (P70.08).
            Estaba detrás del pie, así que su region salía DESPUÉS de
            `contentinfo`: quien ve se lo encuentra encima del contenido nada más
            cargar y quien usa lector recorría la página entera antes de llegar a
            él. Aquí el orden del documento dice lo mismo que la prominencia
            visual, que es lo que /accesibilidad §02 afirma del sitio entero.

            DETRÁS DEL ENLACE DE SALTO Y NO DELANTE: la vía de escape del teclado
            tiene que seguir siendo el primer elemento focalizable (WCAG 2.4.1).
            Con el aviso abierto, el segundo es su primer botón, que es justo lo
            que ve quien mira la pantalla.

            Y se monta en TODOS los entornos (P37.5975): no comparte gate con la
            analítica —no envía nada a ningún sitio— y colgarla de `GTM_ID` dejaba
            un modal con cuatro botones y un switch que solo existía en
            producción, imposible de revisar antes de publicarlo. */}
        <ConsentBanner dict={dict.consent} lang={lang} />
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
      </body>
    </html>
  );
}
