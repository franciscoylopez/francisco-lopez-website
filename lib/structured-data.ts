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
      image: `${SITE_URL}/img/francisco-hero-4x5.webp`,
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
