import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";

import "../globals.css";

import { ThemeProvider } from "@/components/theme-provider";

// SUPERFICIE DE PROTOTIPO — no es parte del sitio. La crea la skill `/prototype`
// y se borra al promover el ganador (Hard Rule 5). Nada de producción importa de
// aquí; aquí sí se importa de producción, que es lo que hace que las variantes se
// vean como se verían el día que se construyan.
//
// POR QUÉ VIVE FUERA DE `app/[lang]/`: ese árbol lo vigila `npm run check:rutas`
// contra el registro de `lib/routes.ts`, y `pageMetadata` exige un `PageSlug`
// registrado. Una ruta de prototipo ahí no compilaría. Como el proyecto no tiene
// `app/layout.tsx` (el root layout es un segmento dinámico de nivel superior,
// D25), este archivo es un SEGUNDO root layout y por eso declara `<html>`/`<body>`
// y trae sus propias fuentes — mismo patrón que `app/global-not-found.tsx`.

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Prototipos",
  robots: { index: false, follow: false },
};

export default function PrototiposLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${inter.variable} ${bricolage.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground min-h-full">
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
