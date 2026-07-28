// Constructores de datos estructurados JSON-LD (Schema.org), fuente única para todo
// el marcado del sitio. Criterio de cierre por página (CLAUDE.md, DECISIONS.md D14):
//   - Home: ProfilePage con mainEntity Person (no elegible para rich results → se
//     valida con el Schema Markup Validator).
//   - Páginas internas: BreadcrumbList (elegible → se valida con la Rich Results Test).
// URLs SIEMPRE absolutas vía SITE_URL (los rastreadores no resuelven relativas en JSON-LD).

import type { Locale } from "@/lib/i18n/config";
import { LINKEDIN_URL, SITE_NAME, SITE_URL } from "@/lib/site";

// Datos del candidato (PRD §10) — canal público, ya visibles en Contacto.
const EMAIL = "franciscojavier.lopezmartinez@gmail.com";
const TELEPHONE = "+34629832720";

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

// URL absoluta de la home por locale (ES en la raíz, EN en /en — D2).
export function homeUrl(lang: Locale): string {
  return `${SITE_URL}${lang === "es" ? "/" : `/${lang}`}`;
}

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
