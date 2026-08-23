import type { MetadataRoute } from "next";

import { EXPERIENCES, type ExperienceSlug } from "@/content/experiences";
import { ARTICLE_UPDATED } from "@/lib/design-values";
import {
  STATIC_PAGE_SLUGS,
  type PageSlug,
  type StaticPageSlug,
} from "@/lib/routes";
import { locales, defaultLocale } from "@/lib/i18n/config";
import { pageUrl } from "@/lib/structured-data";

// /sitemap.xml — una entrada por página Y POR IDIOMA, cada una con el juego
// completo de alternates hreflang (D2). `priority` es una pista débil: home 1,
// páginas de sistema/contenido 0.8, legal 0.3.
//
// Los `slug` van SIN barra inicial porque es la forma que toma `pagePath`, que es
// de donde salen todas las rutas del sitio. Las URLs se derivan de ahí y no se
// escriben: eran la última copia del ternario `lang === "es" ? … : …` en una
// superficie de SEO, y una copia que diverge en el sitemap no la ve nadie —
// ningún tipo comprueba un string de URL.
//
// TRES COSAS CAMBIARON CON EL DEEP-DIVE (P50, 2026-08-18):
//
// 1 · LAS SEIS PÁGINAS DEL DEEP-DIVE NO SE ESCRIBEN. Salen de `EXPERIENCES`
//     filtrando `slug !== null`, la MISMA fuente de la que salen las páginas y
//     `generateStaticParams` (D44). Escribirlas habría sido el modo de fallo que
//     ese módulo existe para matar, y con la agravante de que aquí no lo detecta
//     nadie: la experiencia que se añadiera no entraría en el sitemap y no habría
//     error de compilación, ni test, ni `gate:html` que lo dijera. Y ya no es
//     hipotético — la lista acaba de cambiar de seis a cinco (PICKASO, D44).
//
// 2 · EL INGLÉS TIENE ENTRADAS PROPIAS. Antes `/en/...` solo existía como
//     `alternates.languages` de la entrada española. El hreflang funcionaba, pero
//     la recomendación de Google es que **cada versión de idioma sea su propia
//     `<url>` y liste todas las alternativas, incluida ella misma**. Se pasa de 6
//     a 24 entradas (12 páginas × 2 idiomas) sin coste ninguno.
//
// 3 · `lastModified` DEJA DE SER `new Date()`. Marcaba TODAS las páginas como
//     modificadas en cada despliegue, aunque el despliegue fuera de una coma en
//     otra página: Google dice explícitamente que ignora el `lastmod` cuando lo
//     detecta poco fiable, así que la señal no es que fuera ruidosa, es que se
//     estaba tirando. Ahora es una fecha declarada por página.
//
//     POR QUÉ DECLARADA Y NO DERIVADA DEL GIT, que sería lo obvio: Vercel clona
//     en superficial, así que `git log -1 -- <archivo>` devuelve vacío para todo
//     lo que no se haya tocado en los últimos commits. Una fecha derivada de un
//     historial que no está no es derivada: es un hueco.
//
//     Y EL RIESGO DE QUE SE QUEDEN VIEJAS SE ACOTA EN LAS DOCE: las fechas van
//     en dos `Record` completos —uno por `ExperienceSlug` y otro por
//     `StaticPageSlug`—, así que **una página nueva sin fecha rompe el
//     typecheck**. Hasta P54.98 las estáticas eran una lista fija escrita aquí,
//     que era además una de las tres copias de «qué páginas tiene el sitio» (D72).

/** Una página del sitio, con la fecha real de su último cambio de CONTENIDO. */
type Pagina = { slug: PageSlug; priority: number; lastModified: string };

/**
 * Lo ÚNICO que este archivo escribe de las páginas estáticas: su prioridad y su
 * fecha. Cuáles son y en qué orden lo pone `lib/routes.ts` (D72), y el `Record`
 * completo hace que una página nueva sin fecha no compile — el mismo guardián que
 * las cinco del deep-dive tenían desde D59.
 */
const ESTATICAS: Record<StaticPageSlug, Omit<Pagina, "slug">> = {
  "": { priority: 1, lastModified: "2026-08-17" },
  "sobre-mi": { priority: 0.8, lastModified: "2026-08-15" },
  trayectoria: { priority: 0.8, lastModified: "2026-08-18" },
  "brand-kit": { priority: 0.8, lastModified: "2026-08-10" },
  "design-system": { priority: 0.8, lastModified: "2026-08-10" },
  accesibilidad: { priority: 0.8, lastModified: "2026-08-10" },
  cookies: { priority: 0.3, lastModified: "2026-08-23" },
  contacto: { priority: 0.9, lastModified: "2026-08-23" },
  "como-se-ha-creado": { priority: 0.8, lastModified: ARTICLE_UPDATED },
};

const PAGES: Pagina[] = STATIC_PAGE_SLUGS.map((slug) => ({
  slug,
  ...ESTATICAS[slug],
}));

/**
 * La fecha de cada deep-dive. Es lo ÚNICO que se escribe a mano de esas cinco
 * páginas —la URL y la existencia salen del registro—, y el `Record` completo
 * hace que una experiencia nueva sin fecha no compile.
 */
const DEEP_DIVE_MODIFICADO: Record<ExperienceSlug, string> = {
  emendu: "2026-08-18",
  kuotip: "2026-08-17",
  indya: "2026-08-18",
  freepik: "2026-08-17",
  thetool: "2026-08-17",
};

const DEEP_DIVE: Pagina[] = EXPERIENCES.filter(
  (e): e is (typeof EXPERIENCES)[number] & { slug: ExperienceSlug } =>
    e.slug !== null,
).map(({ slug }) => ({
  slug: `trayectoria/${slug}` as const,
  priority: 0.8,
  lastModified: DEEP_DIVE_MODIFICADO[slug],
}));

export default function sitemap(): MetadataRoute.Sitemap {
  // Los alternates son los MISMOS para las dos entradas de una página: cada
  // versión se lista a sí misma y a la otra, más el `x-default`. Es el mismo
  // juego que emite `pageMetadata` en el `<head>` (D45) — que digan cosas
  // distintas es justo el fallo que ninguna herramienta del repo detecta.
  const alternatesDe = (slug: string) => ({
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, pageUrl(l, slug)])),
      "x-default": pageUrl(defaultLocale, slug),
    },
  });

  return [...PAGES, ...DEEP_DIVE].flatMap(({ slug, priority, lastModified }) =>
    locales.map((lang) => ({
      url: pageUrl(lang, slug),
      lastModified,
      changeFrequency: "monthly" as const,
      priority,
      alternates: alternatesDe(slug),
    })),
  );
}
