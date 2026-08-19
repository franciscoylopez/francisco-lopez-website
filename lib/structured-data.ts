// Constructores de datos estructurados JSON-LD (Schema.org), fuente única para todo
// el marcado del sitio. Criterio de cierre por página (CLAUDE.md, DECISIONS.md D14):
//   - Home: ProfilePage con mainEntity Person (no elegible para rich results → se
//     valida con el Schema Markup Validator).
//   - Páginas internas: BreadcrumbList (elegible → se valida con la Rich Results Test).
// URLs SIEMPRE absolutas vía SITE_URL (los rastreadores no resuelven relativas en JSON-LD).

import { EMAIL, LINKEDIN_URL, PHONE_TEL as TELEPHONE } from "@/lib/contact";
import { pagePath, type Locale } from "@/lib/i18n/config";
import { SITE_NAME, SITE_URL } from "@/lib/site";

// Especialidades declaradas en el PRD §10.
const KNOWS_ABOUT = [
  "Product Management",
  "Product Strategy",
  "UX",
  "Product Discovery",
  "Roadmapping",
  "SaaS Metrics",
  "Pricing",
  "Applied AI",
  "User Activation",
  "Churn",
  "MRR",
];

// URL absoluta de una página por locale (ES en la raíz, EN en /en — D2). La parte
// relativa sale de `pagePath`, la MISMA fuente que el canonical y los hreflang: si
// el JSON-LD derivara la ruta por su cuenta, un locale nuevo entraría en la
// metadata y no aquí, y nada lo detectaría — un string de URL no lo typechequea
// nadie.
export function pageUrl(lang: Locale, slug = ""): string {
  return `${SITE_URL}${pagePath(lang, slug)}`;
}

/** La home de un locale. Azúcar sobre `pageUrl`, que es lo que casi todo usa. */
export const homeUrl = (lang: Locale): string => pageUrl(lang);

// ProfilePage + Person: la entidad principal del sitio, en la home.
export function profilePageLd(lang: Locale, description: string) {
  const url = homeUrl(lang);
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url,
    inLanguage: lang,
    mainEntity: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: SITE_NAME,
      jobTitle: "Senior Product Manager",
      url: `${SITE_URL}/`,
      // La MISMA foto que pinta el hero. Es el tercer consumidor del archivo
      // —hero, tarjeta OG y esto—, y el único que no se ve al mirar la página:
      // al renombrar el asset, este apuntaba a un 404 sin que nada lo notara.
      image: `${SITE_URL}/img/francisco-hero-estudio-4x5.webp`,
      description,
      email: EMAIL,
      telephone: TELEPHONE,
      sameAs: [LINKEDIN_URL],
      knowsLanguage: ["es", "en"],
      knowsAbout: KNOWS_ABOUT,
      worksFor: { "@type": "Organization", name: "Emendu" },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Valencia",
        addressCountry: "ES",
      },
    },
  };
}

// BreadcrumbList para páginas internas. Los items intermedios llevan `item` (URL
// absoluta); el nivel actual (último) lo omite, como recomienda Google para la
// página en curso.
export function breadcrumbLd(items: { name: string; url?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      ...(it.url ? { item: it.url } : {}),
    })),
  };
}

/**
 * Página de una experiencia del deep-dive (P50).
 *
 * ES `WebPage` Y NO `Article`, decidido con Francisco el 2026-08-18. `Article`
 * daba campos y elegibilidad para rich results, pero marcar cinco páginas de
 * carrera como artículos le dice a un rastreador que esto es un blog — y el PRD
 * §9 es explícito en que no lo es (no hay índice de artículos ni feed). Además
 * pide `datePublished`, que aquí habría que inventar o mantener: una fecha de
 * publicación no significa nada en una página que cuenta cinco años de trabajo.
 *
 * LO QUE SÍ APORTA, que es lo que la tarea buscaba: ata cada página a la MISMA
 * persona y a su empresa. El `Person` no se repite —se **referencia** por
 * `@id`, el mismo `${SITE_URL}/#person` que declara `profilePageLd` en la home—,
 * que es lo que permite a Google unir las seis páginas en una sola entidad en vez
 * de leer seis personas que se llaman igual. Repetir el objeto entero habría
 * sido, además, la sexta copia de los mismos datos en un sitio que acaba de
 * retirar tres (D57/D58).
 *
 * `about` es la empresa y `mainEntity` la persona, y el orden importa: la página
 * VA SOBRE la experiencia en esa organización, pero de quien habla es de él.
 *
 * NO LLEVA `isPartOf`, y la ausencia es deliberada: el nodo `WebSite` del sitio
 * no existe todavía (está en el backlog de V3), así que apuntar a
 * `${SITE_URL}/#website` sería una referencia `@id` COLGANDO — un identificador
 * que ningún nodo declara. Valida igual, porque un validador de esquema no
 * resuelve referencias, y no significa nada. Se añade el día que exista el nodo,
 * no antes.
 */
export function experiencePageLd({
  lang,
  slug,
  name,
  description,
  company,
}: {
  lang: Locale;
  /** Slug de la experiencia, sin el segmento padre. */
  slug: string;
  /** El h1 de la página: la afirmación, no el nombre de la empresa. */
  name: string;
  description: string;
  company: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: pageUrl(lang, `trayectoria/${slug}`),
    name,
    description,
    inLanguage: lang,
    about: { "@type": "Organization", name: company },
    author: { "@id": `${SITE_URL}/#person` },
    mainEntity: { "@id": `${SITE_URL}/#person` },
  };
}
