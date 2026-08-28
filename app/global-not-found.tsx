import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { headers } from "next/headers";

import "./globals.css";

import { getCommon } from "@/app/[lang]/dictionaries";
import { Footer } from "@/components/site/footer";
import { Nav } from "@/components/site/nav";
import { SkipLink, MAIN_ID } from "@/components/site/skip-link";
import { Split404 } from "@/components/site/split-404";
import { SYSTEM_BTN_PRIMARY } from "@/components/site/system-message";
import { ThemeProvider } from "@/components/theme-provider";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { getSystemMessages } from "@/lib/i18n/system-messages";
import { WRAP } from "@/components/ui/layout";
import { cn } from "@/lib/utils";

// 404 global (tarea 30.2). El root layout de este sitio es un segmento dinámico de
// nivel superior (app/[lang]/layout.tsx), caso en el que la doc de Next descarta
// componer el 404 con layout+not-found anidados y recomienda `global-not-found`
// (activado con experimental.globalNotFound). Al saltarse el render normal, esta
// página trae sus propias dependencias globales: fuentes, estilos y ThemeProvider.
//
// A diferencia de la pantalla de error (minimalista, autónoma), el 404 es una página
// SANA —no ha fallado nada, el usuario erró la URL—, así que lleva Nav + Footer
// (salidas reales, toggle de tema e idioma) y un hero con el split de marca: un
// momento para que la firma respire.

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  // Next inyecta <meta name="robots" content="noindex"> en respuestas 404.
  title: "404 · Francisco López",
};

export default async function GlobalNotFound() {
  const header = (await headers()).get("x-locale") ?? "";
  const lang = isLocale(header) ? header : defaultLocale;
  const dict = await getCommon(lang);
  const t = getSystemMessages(lang);
  const homeHref = lang === "es" ? "/" : `/${lang}`;

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${inter.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col">
        {/* Esta página se salta el layout de [lang], así que trae su propio
            enlace de salto: monta el Nav entero, o sea que tiene el mismo bloque
            repetido que bypasear. No estaba en la lista de la tarea. */}
        <SkipLink label={dict.nav.skipToContent} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Nav dict={dict.nav} homeHref={homeHref} lang={lang} />
          <main
            id={MAIN_ID}
            tabIndex={-1}
            className={cn(
              WRAP,
              "flex w-full flex-1 flex-col items-center justify-center gap-7 py-20 text-center",
            )}
          >
            {/* Hero: el "404" como pieza central, con el "0" convertido en el círculo
                con split que florece en la carga (Split404 · .split-zero, globals.css). */}
            <Split404 className="text-[clamp(4.5rem,17vw,10rem)]" />
            {/* Con movimiento reducido se queda el fundido y se va el deslizamiento
                (P74.36): `slide-in-from-bottom-0` neutraliza el recorrido sin
                apagar la animacion entera, que es lo que hacia `animate-none`. */}
            <div className="animate-in fade-in slide-in-from-bottom-3 motion-reduce:slide-in-from-bottom-0 flex flex-col items-center gap-3 duration-700">
              <h1 className="font-display text-[clamp(1.35rem,3.4vw,1.9rem)] font-semibold tracking-[-0.01em]">
                {t.notFound.title}
              </h1>
              <p className="text-muted-foreground max-w-[42ch] text-[1.02rem]">
                {t.notFound.body}
              </p>
            </div>
            <a
              href={homeHref}
              // Fundido puro: no hay nada que retirar con movimiento reducido.
              className={`${SYSTEM_BTN_PRIMARY} animate-in fade-in duration-700`}
            >
              {t.home}
            </a>
          </main>
          <Footer dict={dict.footer} lang={lang} />
        </ThemeProvider>
      </body>
    </html>
  );
}
