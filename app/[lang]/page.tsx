import { notFound } from "next/navigation";

import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "./dictionaries";

type LangParams = { params: Promise<{ lang: string }> };

// Placeholder de la home: prueba el cableado i18n + los tokens de layout. El Hero
// real (foto 4:5, motion) y el resto de secciones llegan en los siguientes
// sub-pasos de esta misma tarea, traducidos desde `Web personal.dc.html`.
export default async function Home({ params }: LangParams) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-[var(--container)] flex-col justify-center px-[var(--page-x)] py-[var(--section-y)]">
      <p className="text-muted-foreground text-sm">{dict.hero.kicker}</p>
      <h1 className="mt-4 text-4xl tracking-tight sm:text-5xl">
        {dict.hero.headline}
      </h1>
      <p className="text-muted-foreground mt-4 max-w-[var(--measure)] text-lg">
        {dict.hero.subheadline}
      </p>
    </main>
  );
}
