// Qué páginas tiene este sitio — la única lista (D72).
//
// POR QUÉ EXISTE. El mismo dato estaba escrito A MANO en tres sitios: el sitemap,
// el gate de HTML y `/llms.txt`. D59 (2026-08-18) nombró el problema y arregló la
// mitad fácil —las páginas del deep-dive se derivan de `EXPERIENCES`—, pero las
// estáticas seguían copiadas en las tres listas. Y ninguna falla de forma visible
// si se olvida una: la página no existe para Google, el gate deja de cubrirla en
// silencio, y no aparece en el índice para modelos. «Una lista incompleta no es un
// error de compilación» son las palabras de D59 sobre la mitad que no arregló.
//
// LO QUE ESTE MÓDULO SÍ PUEDE GARANTIZAR, Y LO QUE NO. Ninguna de las tres
// consumidoras puede leer el sistema de archivos —dos corren dentro del bundle—,
// así que la lista de páginas estáticas sigue siendo una constante escrita a mano.
// Lo que cambia es que ahora es UNA, y que tiene dos guardianes encima:
//
//   · `npm run check:rutas` la contrasta contra `app/[lang]/**/page.tsx`, que es
//     el único sitio donde una página existe DE VERDAD, y comprueba que las tres
//     consumidoras siguen leyendo de aquí en vez de reescribir su lista.
//   · `PageSlug` es la unión de sus literales, y `pageMetadata` lo pide: una
//     página cuya carpeta existe pero que nadie registró aquí NO COMPILA.
//
// Las del deep-dive no se escriben en ninguno de los dos sitios: salen de
// `EXPERIENCES`, la misma fuente de `generateStaticParams` (D44).

import { EXPERIENCES, type ExperienceSlug } from "@/content/experiences";

/**
 * Las páginas estáticas, en el orden en que se publican. El slug es el segmento
 * que va DESPUÉS del locale, sin barras; la home es la cadena vacía. Se
 * corresponden 1:1 con las carpetas de `app/[lang]/` que tienen `page.tsx`.
 */
export const STATIC_PAGE_SLUGS = [
  "",
  "sobre-mi",
  "trayectoria",
  "brand-kit",
  "design-system",
  "accesibilidad",
  "cookies",
  "contacto",
  "como-se-ha-creado",
] as const;

/** Una página estática, como unión de literales. */
export type StaticPageSlug = (typeof STATIC_PAGE_SLUGS)[number];

/** Una página de deep-dive: `trayectoria/<slug>` de una experiencia con página. */
export type DeepDiveSlug = `trayectoria/${ExperienceSlug}`;

/** Cualquier página del sitio. Es lo que acepta `pageMetadata`. */
export type PageSlug = StaticPageSlug | DeepDiveSlug;

/**
 * Los deep-dive, derivados del registro y no escritos: `slug !== null` es lo que
 * decide que una experiencia tenga página, aquí y en `generateStaticParams`.
 */
export const DEEP_DIVE_SLUGS: readonly DeepDiveSlug[] = EXPERIENCES.flatMap(
  (e) => (e.slug === null ? [] : [`trayectoria/${e.slug}` as DeepDiveSlug]),
);

/** Las páginas del sitio, por idioma. El recuento lo publica `PAGE_COUNT`. */
export const PAGE_SLUGS: readonly PageSlug[] = [
  ...STATIC_PAGE_SLUGS,
  ...DEEP_DIVE_SLUGS,
];
