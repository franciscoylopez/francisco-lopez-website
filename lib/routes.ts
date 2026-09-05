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

import { EXPERIENCES, type ExperienceSlug } from "../content/experiences";

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

/**
 * EL SLUG PÚBLICO EN INGLÉS, que desde P72.56 ya no es el interno.
 *
 * POR QUÉ EXISTE. Hasta hoy `/en/sobre-mi` servía la página inglesa con una ruta
 * española, y eso no estaba decidido: se decidió para el deep-dive —los slugs son
 * NOMBRES DE EMPRESA, neutros al idioma (`PRD-Historical.md` §1297)— y se heredó
 * para todo lo demás sin que nadie pesara `/en/contacto` contra `/en/contact`. El
 * coste ya se había pagado una vez sin subirlo a decisión: D166 parcheó con diez
 * alias que `/about`, `/privacy` y `/contact` dieran 404.
 *
 * EN EL APP ROUTER LA CARPETA ES EL SLUG, así que la ruta pública deja de ser la
 * interna y hace falta esta indirección: `app/[lang]/sobre-mi/` sigue siendo la
 * carpeta, y `proxy.ts` reescribe `/en/about` hacia ella.
 *
 * ES TOTAL Y NO PARCIAL A PROPÓSITO. Con `Partial` una página nueva heredaría el
 * slug español en silencio, que es exactamente el fallo que esto viene a cerrar:
 * el tipo obliga a DECIDIR, aunque la decisión sea «se llama igual». Los tres que
 * repiten valor no son descuidos —`brand-kit` y `design-system` se llaman así
 * también en español, y `cookies` es legible en inglés—; su porqué está en la
 * ficha y en `DECISIONS.md`.
 *
 * EL ESPAÑOL NO TIENE MAPA: es la fuente de verdad y su slug público ES el
 * interno. Un `Record` de identidad solo daría dos sitios donde escribir lo mismo.
 */
const SLUGS_EN: Record<StaticPageSlug, string> = {
  "": "",
  "sobre-mi": "about",
  trayectoria: "career",
  "brand-kit": "brand-kit",
  "design-system": "design-system",
  accesibilidad: "accessibility",
  cookies: "cookies",
  contacto: "contact",
  "como-se-ha-creado": "how-it-was-built",
};

/** El camino de vuelta. Los slugs que no se traducen se mapean a sí mismos. */
const INTERNOS_EN = new Map(
  Object.entries(SLUGS_EN).map(([interno, publico]) => [publico, interno]),
);

/**
 * SOLO SE TRADUCE EL PRIMER SEGMENTO, y es la regla entera: en
 * `trayectoria/emendu` el padre se muda a `career` y el nombre de la empresa no
 * se toca nunca. Es lo que §1297 decidió y sigue siendo cierto — traducir
 * «Emendu» no significaría nada.
 */
function traduce(slug: string, tabla: (cabeza: string) => string): string {
  if (!slug) return slug;
  const [cabeza = "", ...resto] = slug.split("/");
  return [tabla(cabeza), ...resto].join("/");
}

/** El slug interno (el de la carpeta) visto desde fuera, en el idioma que toca. */
export function publicSlug(lang: string, slug: string): string {
  if (lang !== "en") return slug;
  return traduce(slug, (c) => SLUGS_EN[c as StaticPageSlug] ?? c);
}

/**
 * El camino inverso: de la ruta que pide el navegador a la carpeta que la sirve.
 *
 * ACEPTA LAS DOS FORMAS, Y NO ES LAXITUD. `usePathname()` devuelve la ruta
 * INTERNA en el prerender —donde la página se generó como `/en/sobre-mi`— y la
 * PÚBLICA en runtime, después del rewrite. El nav compara con esto en los dos
 * momentos, así que un mapa que solo entendiera la pública apagaría el estado
 * «estás aquí» justo en las páginas traducidas. Un slug que no está en la tabla
 * se devuelve tal cual: ya era interno.
 */
export function internalSlug(lang: string, slug: string): string {
  if (lang !== "en") return slug;
  return traduce(slug, (c) => INTERNOS_EN.get(c) ?? c);
}

/**
 * Las tarjetas OG que `/api/og` sabe pintar: `home` más toda página estática que
 * no sea la propia home ni el índice de `/trayectoria` (ese y sus cinco
 * experiencias los resuelve `deepDiveCopy` antes de llegar al despacho).
 *
 * POR QUÉ EXISTE. D72 derivó el TIPO de tarjeta de este registro y dejó el
 * DESPACHO escrito a mano: una cadena de seis `cardParam === "…"` en
 * `app/api/og/route.tsx`. Cuando entró `/contacto` en el sprint 3, el compilador
 * exigió su entrada en la tabla de copy —eso sí lo cerraba el tipo— y nadie tocó
 * el `if`, así que la página del embudo publicó la tarjeta de la home durante un
 * sprint entero. Es el modo de fallo de D72 otra vez, en la mitad que D72 no
 * cerró: compila, pasa `check:rutas`, y solo lo ve quien comparte el enlace.
 *
 * Con la lista aquí, el despacho no es una copia de esta lista: ES esta lista.
 */
export type OgCard = "home" | Exclude<StaticPageSlug, "" | "trayectoria">;

export const OG_CARDS: readonly OgCard[] = [
  "home",
  ...STATIC_PAGE_SLUGS.filter(
    (s): s is Exclude<StaticPageSlug, "" | "trayectoria"> =>
      s !== "" && s !== "trayectoria",
  ),
];

/**
 * El despacho de `?card=`, con su caída a `home` para cualquier cosa que no
 * exista: el parámetro viene de una URL, así que puede traer lo que sea.
 *
 * Lo llaman DOS, y que sea el mismo es la mitad que faltaba del recorrido: el
 * route handler, que pinta la tarjeta, y `check:marco`, que comprueba sobre el
 * HTML servido que la que pide cada página resuelve a la suya. Un guardián que
 * reimplementara este despacho podría opinar distinto que el código, que es
 * justo el fallo que se está cerrando.
 */
export function resolveOgCard(cardParam: string): OgCard {
  return (OG_CARDS as readonly string[]).includes(cardParam)
    ? (cardParam as OgCard)
    : "home";
}

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
