"use client";

import { Bricolage_Grotesque, Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import "./globals.css";

import {
  SystemMessage,
  SYSTEM_BTN_OUTLINE,
  SYSTEM_BTN_PRIMARY,
} from "@/components/site/system-message";
import { getSystemMessages } from "@/lib/i18n/system-messages";

// Error boundary global (tarea 30.2). El root layout de este sitio es un segmento
// dinámico (app/[lang]/layout.tsx), así que un error del layout —o cualquiera que
// el error.tsx anidado no capture en SSR— cae aquí. global-error REEMPLAZA al root
// layout cuando se activa, por lo que trae sus propias dependencias globales
// (fuentes, estilos, tema) y define su <html>/<body>. Debe ser client component
// (contrato de Next): el locale se deduce de la URL con usePathname.

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "600"],
});

// Aplica la preferencia de tema (next-themes, storageKey "theme") o el esquema del
// sistema antes de pintar, ya que aquí no corre el ThemeProvider del layout normal.
const themeInit = `(function(){try{var e=localStorage.getItem('theme');if(e==='dark'||((e===null||e==='system')&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark');}catch{}})()`;

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const pathname = usePathname() || "/";
  const lang = pathname === "/en" || pathname.startsWith("/en/") ? "en" : "es";
  const t = getSystemMessages(lang);
  const homeHref = lang === "es" ? "/" : "/en";

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${inter.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col">
        {/* metadata/generateMetadata no están soportados en global-error; el título
            se fija con el componente <title> de React (doc error.md). */}
        <title>Error — Francisco López</title>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <SystemMessage
          homeHref={homeHref}
          homeAria={t.homeAria}
          title={t.error.title}
          body={t.error.body}
        >
          <button
            type="button"
            onClick={() => unstable_retry()}
            className={SYSTEM_BTN_PRIMARY}
          >
            {t.error.retry}
          </button>
          <a href={homeHref} className={SYSTEM_BTN_OUTLINE}>
            {t.home}
          </a>
        </SystemMessage>
      </body>
    </html>
  );
}
