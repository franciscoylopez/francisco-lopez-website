import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { headers } from "next/headers";

import "./globals.css";

import { SystemMessage, SYSTEM_BTN_PRIMARY } from "@/components/site/system-message";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import { getSystemMessages } from "@/lib/i18n/system-messages";

// 404 global (tarea 30.2). El root layout de este sitio es un segmento dinámico de
// nivel superior (app/[lang]/layout.tsx), caso en el que la doc de Next descarta
// componer el 404 con layout+not-found anidados y recomienda `global-not-found`
// (activado con experimental.globalNotFound). Al saltarse el render normal, esta
// página debe traer sus propias dependencias globales: fuentes, estilos y tema.

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  // Next inyecta <meta name="robots" content="noindex"> en respuestas 404.
  title: "404 — Francisco López",
};

// Fija la clase `.dark` antes de pintar según la preferencia guardada (next-themes,
// storageKey "theme") o el esquema del sistema, para que el 404 respete el tema sin
// flash. Réplica mínima del script que inyecta el ThemeProvider en el layout normal,
// que aquí no se ejecuta.
const themeInit = `(function(){try{var e=localStorage.getItem('theme');if(e==='dark'||((e===null||e==='system')&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark');}catch(e){}})()`;

export default async function GlobalNotFound() {
  const header = (await headers()).get("x-locale") ?? "";
  const lang = isLocale(header) ? header : defaultLocale;
  const t = getSystemMessages(lang);
  const homeHref = lang === "es" ? "/" : `/${lang}`;

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${inter.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <SystemMessage
          homeHref={homeHref}
          homeAria={t.homeAria}
          eyebrow={t.notFound.code}
          title={t.notFound.title}
          body={t.notFound.body}
        >
          <a href={homeHref} className={SYSTEM_BTN_PRIMARY}>
            {t.home}
          </a>
        </SystemMessage>
      </body>
    </html>
  );
}
