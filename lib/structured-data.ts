// Constructores de datos estructurados JSON-LD (Schema.org), fuente única para todo
// el marcado del sitio. Criterio de cierre por página (CLAUDE.md, DECISIONS.md D14):
//   - Home: ProfilePage con mainEntity Person (no elegible para rich results → se
//     valida con el Schema Markup Validator).
//   - Páginas internas: BreadcrumbList (elegible → se valida con la Rich Results Test).
// URLs SIEMPRE absolutas vía SITE_URL (los rastreadores no resuelven relativas en JSON-LD).

import {
  EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  PHONE_TEL as TELEPHONE,
} from "@/lib/contact";
import { pagePath, type Locale } from "@/lib/i18n/config";
import { ARTICLE_PUBLISHED, ARTICLE_UPDATED } from "@/lib/design-values";
import { ogImagePath } from "@/lib/page-meta";
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
      // `sameAs` es el campo de «los otros perfiles de esta persona», así que el
      // repo entra aquí en cuanto es público: es el consumidor que no se ve mirando
      // la página, igual que el `image` del JSON-LD en D66.
      sameAs: [LINKEDIN_URL, GITHUB_URL],
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

/** El único artículo del sitio. Escrito una vez: lo usan su URL y su tarjeta OG. */
const ARTICLE_SLUG = "como-se-ha-creado";

/**
 * La hora nominal de publicación y la zona de la que sale el desfase. La hora NO
 * se guarda junto a la fecha en `lib/design-values.ts` a propósito: la MISMA
 * constante alimenta el copy que lee una persona, formateado con `Intl`, y ahí
 * una hora inventada se vería. Se compone aquí, al emitir el JSON-LD, y solo aquí.
 */
const ARTICLE_HOUR = "10:00";
const TIME_ZONE = "Europe/Madrid";

/**
 * ISO 8601 COMPLETO a partir de la fecha corta. La Rich Results Test avisa DOS
 * veces por cada fecha de un `Article` cuando le llega solo el día —«el valor de
 * fecha y hora no es válido» y «falta la zona horaria»—, así que los cuatro
 * avisos de fecha son en realidad este único hueco.
 *
 * EL DESFASE SE DERIVA DE LA ZONA, NO SE ESCRIBE. `+02:00` es correcto en agosto
 * y falso en enero: un literal convertiría la primera fecha de invierno en un
 * dato mal por una hora, y nadie lo miraría. `longOffset` da `GMT+02:00`, y
 * `GMT` a secas cuando el desfase es cero (que en Madrid no ocurre, pero el
 * formato lo contempla).
 */
function isoConHora(iso: string): string {
  const desfase =
    new Intl.DateTimeFormat("en-US", {
      timeZone: TIME_ZONE,
      timeZoneName: "longOffset",
    })
      .formatToParts(new Date(`${iso}T${ARTICLE_HOUR}:00Z`))
      .find((p) => p.type === "timeZoneName")
      ?.value.replace("GMT", "") || "Z";
  return `${iso}T${ARTICLE_HOUR}:00${desfase}`;
}

/**
 * `TechArticle` de «Cómo se ha creado esta página» (P60). Es la ÚNICA página
 * del sitio marcada como artículo — el deep-dive deliberadamente NO lo es (ver
 * la nota de `experiencePageLd` arriba): esta sí cuenta un proceso con fecha de
 * publicación real, y el PRD la trata como pieza propia, no como el primer post
 * de un blog que no existe.
 *
 * `author` REFERENCIA al `Person` de la home por `@id` en vez de repetirlo,
 * mismo patrón que `experiencePageLd`: es la misma persona en las dos páginas,
 * no dos entidades que se llaman igual. Las fechas salen de
 * `lib/design-values.ts` (`ARTICLE_PUBLISHED`/`ARTICLE_UPDATED`) y no de un
 * literal aquí, por la misma razón que el resto de cifras publicadas: una sola
 * fuente que actualizar, no un string que se queda atrás (D60).
 *
 * PERO EL `@id` SOLO NO LE BASTA A GOOGLE, y aquí sí importa. La Rich Results
 * Test evalúa una página AISLADA: ve una referencia colgando, la degrada a
 * `Thing` anónimo y avisa de que al autor le faltan `name` y `url`. Que
 * `npm run check:marco` dé verde sobre lo mismo no es una contradicción —resuelve
 * los `@id` contra TODO el sitio, que es justo lo que ningún validador externo
 * hace (D75)—: miden cosas distintas. La salida no es repetir el `Person` entero
 * (esa copia se evitó a propósito), sino darle al `author` los dos campos que
 * Google necesita para pintarlo, con el `@id` haciendo su trabajo al lado.
 *
 * SOLO AQUÍ. `experiencePageLd` usa la misma referencia, pero es `WebPage`, que
 * no es elegible para rich results: allí no cuesta nada y se queda como está.
 */
export function techArticleLd({
  lang,
  headline,
  description,
}: {
  lang: Locale;
  /** El h1 de la página. */
  headline: string;
  description: string;
}) {
  const url = pageUrl(lang, ARTICLE_SLUG);
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline,
    description,
    inLanguage: lang,
    // La MISMA tarjeta que sirve el OG de la página, no un asset nuevo: sin
    // `image` el resultado de Google sale sin miniatura.
    image: `${SITE_URL}${ogImagePath(ARTICLE_SLUG, lang)}`,
    datePublished: isoConHora(ARTICLE_PUBLISHED),
    dateModified: isoConHora(ARTICLE_UPDATED),
    author: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
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
