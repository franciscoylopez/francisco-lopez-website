import { notFound } from "next/navigation";

import { Hero } from "@/components/site/hero";
import { Hitos } from "@/components/site/hitos";
import { Nav } from "@/components/site/nav";
import { RevealRoot } from "@/components/site/reveal-root";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "./dictionaries";

type LangParams = { params: Promise<{ lang: string }> };

// CV de lanzamiento: por ahora el PDF en español para ambos locales (la versión EN
// llega en V2, PRD §22). El wiring del botón apunta ya al asset real.
const CV_HREF = "/cv/francisco-lopez-cv-es.pdf";

// Home. Nav + Hero + Hitos (primer bloque del build; el resto de secciones llega
// en los siguientes sub-pasos, traducidas desde design/web-personal.dc.html).
export default async function Home({ params }: LangParams) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <>
      <Nav dict={dict.nav} cvHref={CV_HREF} />
      <RevealRoot>
        <main>
          <Hero dict={dict.hero} />
          <Hitos dict={dict.hitos} />
        </main>
      </RevealRoot>
    </>
  );
}
