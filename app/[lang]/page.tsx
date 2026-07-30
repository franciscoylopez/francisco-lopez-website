import { notFound } from "next/navigation";

import { ComoTrabajo } from "@/components/site/como-trabajo";
import { Contacto } from "@/components/site/contacto";
import { Footer } from "@/components/site/footer";
import { Formacion } from "@/components/site/formacion";
import { Hero } from "@/components/site/hero";
import { Hitos } from "@/components/site/hitos";
import { MasAlla } from "@/components/site/mas-alla";
import { Nav } from "@/components/site/nav";
import { JsonLd } from "@/components/site/json-ld";
import { RevealRoot } from "@/components/site/reveal-root";
import { Toolkit } from "@/components/site/toolkit";
import { Trayectoria } from "@/components/site/trayectoria";
import { isLocale, cvPath } from "@/lib/i18n/config";
import { profilePageLd } from "@/lib/structured-data";
import { getDictionary } from "./dictionaries";

type LangParams = { params: Promise<{ lang: string }> };

// Home completa. Traducida desde design/web-personal.dc.html (D1).
export default async function Home({ params }: LangParams) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  // El Nav deriva su propio enlace del CV; aquí solo se necesita para los otros
  // dos puntos del home (CTA de Trayectoria y Contacto).
  const cvHref = cvPath(lang);

  // JSON-LD ProfilePage + Person (SEO técnico, D14): entidad principal del sitio.
  return (
    <>
      <JsonLd data={profilePageLd(lang, dict.meta.description)} />
      <Nav dict={dict.nav} lang={lang} />
      <RevealRoot>
        <main>
          <Hero dict={dict.hero} />
          <Hitos dict={dict.hitos} />
          <ComoTrabajo dict={dict.proceso} />
          <MasAlla dict={dict.masAlla} />
          <Trayectoria dict={dict.trayectoria} cvHref={cvHref} />
          <Toolkit dict={dict.toolkit} />
          <Formacion dict={dict.formacion} />
          <Contacto dict={dict.contacto} cvHref={cvHref} />
        </main>
      </RevealRoot>
      <Footer dict={dict.footer} lang={lang} />
    </>
  );
}
