import { notFound } from "next/navigation";

import { ComoTrabajo } from "@/components/site/como-trabajo";
import { Contacto } from "@/components/site/contacto";
import { Footer } from "@/components/site/footer";
import { Formacion } from "@/components/site/formacion";
import { Hero } from "@/components/site/hero";
import { Hitos } from "@/components/site/hitos";
import { MasAlla } from "@/components/site/mas-alla";
import { Nav } from "@/components/site/nav";
import { RevealRoot } from "@/components/site/reveal-root";
import { Toolkit } from "@/components/site/toolkit";
import { Trayectoria } from "@/components/site/trayectoria";
import { isLocale } from "@/lib/i18n/config";
import { LINKEDIN_URL, SITE_NAME, SITE_URL } from "@/lib/site";
import { getDictionary } from "./dictionaries";

type LangParams = { params: Promise<{ lang: string }> };

// CV de lanzamiento: por ahora el PDF en español para ambos locales (la versión EN
// llega en V2, PRD §22). El wiring del botón apunta ya al asset real.
const CV_HREF = "/cv/francisco-lopez-cv-es.pdf";

// Home completa. Traducida desde design/web-personal.dc.html (D1).
export default async function Home({ params }: LangParams) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  // JSON-LD Person (SEO técnico, P15): entidad principal del sitio, en la home.
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    jobTitle: "Senior Product Manager",
    url: `${SITE_URL}${lang === "es" ? "/" : "/en"}`,
    image: `${SITE_URL}/img/francisco-hero-4x5.webp`,
    description: dict.meta.description,
    sameAs: [LINKEDIN_URL],
    knowsLanguage: ["es", "en"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Valencia",
      addressCountry: "ES",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
      <Nav dict={dict.nav} cvHref={CV_HREF} lang={lang} />
      <RevealRoot>
        <main>
          <Hero dict={dict.hero} />
          <Hitos dict={dict.hitos} />
          <ComoTrabajo dict={dict.proceso} />
          <MasAlla dict={dict.masAlla} />
          <Trayectoria dict={dict.trayectoria} cvHref={CV_HREF} />
          <Toolkit dict={dict.toolkit} />
          <Formacion dict={dict.formacion} />
          <Contacto dict={dict.contacto} cvHref={CV_HREF} />
        </main>
      </RevealRoot>
      <Footer dict={dict.footer} lang={lang} />
    </>
  );
}
