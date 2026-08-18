import type { MetadataRoute } from "next";

import { EXPERIENCES, type ExperienceSlug } from "@/content/experiences";
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
//     Y EL RIESGO DE QUE SE QUEDEN VIEJAS SE ACOTA DONDE SE PUEDE: las del
//     deep-dive van en un `Record<ExperienceSlug, …>`, así que **añadir una
//     experiencia sin darle fecha rompe el typecheck**. Las seis de arriba no
//     tienen ese guardián — son una lista fija y no derivada de nada, así que ahí
//     sí hay que acordarse al cambiar el contenido de una página.

/** Una página del sitio, con la fecha real de su último cambio de CONTENIDO. */
type Pagina = { slug: string; priority: number; lastModified: string };

const PAGES: Pagina[] = [
  { slug: "", priority: 1, lastModified: "2026-08-17" },
  { slug: "sobre-mi", priority: 0.8, lastModified: "2026-08-15" },
  { slug: "trayectoria", priority: 0.8, lastModified: "2026-08-18" },
  { slug: "brand-kit", priority: 0.8, lastModified: "2026-08-10" },
  { slug: "design-system", priority: 0.8, lastModified: "2026-08-10" },
  { slug: "accesibilidad", priority: 0.8, lastModified: "2026-08-10" },
  { slug: "cookies", priority: 0.3, lastModified: "2026-08-17" },
];

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
  slug: `trayectoria/${slug}`,
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
