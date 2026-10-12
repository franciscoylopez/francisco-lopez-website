"use client";

import { Bricolage_Grotesque, Inter } from "next/font/google";
import { usePathname } from "next/navigation";

import "./globals.css";

import { ErrorBoundaryBody, errorLang } from "@/components/site/error-boundary";

// Error boundary global (tarea 30.2). El root layout de este sitio es un segmento
// dinámico (app/[lang]/layout.tsx), así que un error del layout —o cualquiera que
// el error.tsx anidado no capture en SSR— cae aquí. global-error REEMPLAZA al root
// layout cuando se activa, por lo que trae sus propias dependencias globales
// (fuentes, estilos, tema) y define su <html>/<body>. Debe ser client component
// (contrato de Next): el locale se deduce de la URL con usePathname.
//
// ESO —EL MARCO— ES LO ÚNICO QUE ESTE ARCHIVO TIENE DE PROPIO (P72.19). La pantalla
// es la misma que la del boundary anidado y sale de `ErrorBoundaryBody`. Estaba
// escrita dos veces, y la copia era de las peligrosas: esta mitad solo se ve si se
// cae el layout raíz, así que un cambio hecho a medias no se nota mirando el sitio.

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
  return (
    <html
      lang={errorLang(usePathname())}
      suppressHydrationWarning
      className={`${inter.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col">
        {/* metadata/generateMetadata no están soportados en global-error; el título
            se fija con el componente <title> de React (doc error.md). */}
        <title>Error — Francisco López</title>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <ErrorBoundaryBody error={error} onRetry={unstable_retry} />
      </body>
    </html>
  );
}
