import { ComoTrabajo } from "@/components/site/como-trabajo";
import { Contacto } from "@/components/site/contacto";
import { Formacion, alumniOf } from "@/components/site/formacion";
import { Hero } from "@/components/site/hero";
import { Hitos, awardsOf } from "@/components/site/hitos";
import { MasAlla } from "@/components/site/mas-alla";
import { PageShell } from "@/components/site/page-shell";
import { Toolkit } from "@/components/site/toolkit";
import { Trayectoria } from "@/components/site/trayectoria";
import { cvPath, pagePath } from "@/lib/i18n/config";
import { cargaPagina, type LangParams } from "@/lib/page-route";
import { profilePageLd } from "@/lib/structured-data";
import { getCommon, getHome } from "./dictionaries";

// Home completa. Traducida del mockup de Claude Design (D1). Su metadata la
// aporta el layout de [lang] —la home ES la raíz del locale—, así que aquí no hay
// generateMetadata; el resto del andamiaje sale de PageShell (D45).
export default async function Home({ params }: LangParams) {
  const { lang, common, t } = await cargaPagina(params, getCommon, getHome);

  // El Nav deriva su propio enlace del CV; aquí solo se necesita para los otros
  // dos puntos del home (CTA de Trayectoria y Contacto).
  const cvHref = cvPath(lang);

  // JSON-LD ProfilePage + Person (SEO técnico, D14): entidad principal del sitio.
  // Los reconocimientos y las instituciones los componen las secciones que los
  // pintan, no este archivo ni el marcado: así el JSON-LD no puede decir algo
  // distinto de lo que se lee en la página (P82).
  return (
    <PageShell
      dict={common}
      lang={lang}
      jsonLd={profilePageLd({
        lang,
        description: common.meta.description,
        awards: awardsOf(t.hitos),
        alumni: alumniOf(t.formacion),
      })}
    >
      <>
        <Hero dict={t.hero} />
        <Hitos dict={t.hitos} />
        <ComoTrabajo dict={t.proceso} />
        <MasAlla dict={t.masAlla} />
        <Trayectoria dict={t.trayectoria} cvHref={cvHref} lang={lang} />
        <Toolkit dict={t.toolkit} />
        <Formacion dict={t.formacion} />
        <Contacto
          dict={common.contacto}
          contactoHref={pagePath(lang, "contacto")}
        />
      </>
    </PageShell>
  );
}
