import type { MetadataRoute } from "next";

import { EXPERIENCES, type ExperienceSlug } from "@/content/experiences";
import { PAGE_MODIFIED } from "@/lib/page-modified";
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
//     ESAS FECHAS YA NO VIVEN AQUÍ (P68.746, 2026-08-31): están en
//     `lib/page-modified.ts`, con el porqué de que no salgan del git y el
//     `Record` completo que hace que una página nueva sin fecha no compile. Se
//     mudaron el día que el markdown para agentes empezó a publicar la misma
//     fecha en su frontmatter, para que no hubiera dos tablas (D60).

/** Una página del sitio, con la fecha real de su último cambio de CONTENIDO. */
type Pagina = { slug: PageSlug; priority: number; lastModified: string };

/**
 * Lo ÚNICO que este archivo escribe de las páginas estáticas: su prioridad.
 * Cuáles son y en qué orden lo pone `lib/routes.ts` (D72), y el `Record` completo
 * hace que una página nueva sin prioridad no compile — el mismo guardián que las
 * cinco del deep-dive tenían desde D59.
 *
 * LAS FECHAS SE MUDARON A `lib/page-modified.ts` *(P68.746, 2026-08-31)*, y no
 * por orden: el markdown para agentes publica ahora la misma respuesta a la misma
 * pregunta —«¿de cuándo es esto?»— en su frontmatter, y dos tablas de fechas
 * habrían sido dos verdades divergiendo en silencio (D60). El `Record` completo y
 * el porqué de que no salgan del git viajan con ellas.
 */
const PRIORIDAD: Record<StaticPageSlug, number> = {
  "": 1,
  "sobre-mi": 0.8,
  trayectoria: 0.8,
  "brand-kit": 0.8,
  "design-system": 0.8,
  accesibilidad: 0.8,
  cookies: 0.3,
  contacto: 0.9,
  "como-se-ha-creado": 0.8,
};

const PAGES: Pagina[] = STATIC_PAGE_SLUGS.map((slug) => ({
  slug,
  priority: PRIORIDAD[slug],
  lastModified: PAGE_MODIFIED[slug],
}));

const DEEP_DIVE: Pagina[] = EXPERIENCES.filter(
  (e): e is (typeof EXPERIENCES)[number] & { slug: ExperienceSlug } =>
    e.slug !== null,
).map(({ slug }) => ({
  slug: `trayectoria/${slug}` as const,
  priority: 0.8,
  lastModified: PAGE_MODIFIED[`trayectoria/${slug}`],
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
