/**
 * Dónde deja el build lo que este guardián muerde, y qué forma tienen las URLs
 * que promete.
 *
 * Las dos mitades están juntas porque las dos son la MISMA regla: la 1 de
 * `BRAND.md` §Cómo se escribe una regla —la condición se comprueba donde la cosa
 * ocurre—. De ahí que los bloques miren artefactos del build y no el código que
 * los genera, y que ninguno componga una URL a mano: la silueta sale de aquí, que
 * es lo que mantiene diciendo lo mismo al guardián, al proxy y a `npm run md`.
 */
import { join } from "node:path";

import { defaultLocale, type Locale } from "../../lib/i18n/config";
import { type PageSlug, publicSlug } from "../../lib/routes";
import { SITE_URL } from "../../lib/site";

/** Dónde deja Next el cuerpo de una ruta estática de texto. Ver `check:marco`. */
export const LLMS_TXT = join(".next", "server", "app", "llms.txt.body");

/** Dónde vive el markdown commiteado, con la silueta que escribe `npm run md`. */
export const MD_RAIZ = join("public", "md");

/**
 * La URL pública de una página, en un idioma. No se compone a mano en ningún
 * bloque de este guardián: sale de aquí, y es la misma forma que usa la ruta.
 */
export function urlDe(lang: Locale, slug: PageSlug): string {
  const path = slug ? `/${slug}` : "";
  if (lang === defaultLocale) return `${SITE_URL}${path || "/"}`;
  return `${SITE_URL}/${lang}${path}`;
}

/**
 * La silueta del markdown de una variante, la misma que `rutaMarkdown` del proxy
 * y que `npm run md`: la home es `<locale>.md` y no `<locale>/index.md`.
 *
 * Y POR EL SLUG PÚBLICO desde P72.56: el espejo de `/en/about` es
 * `/md/en/about.md`, porque lo que `es/llms.json` promete es «la misma ruta que
 * la página». Se escribe aquí otra vez a propósito, igual que `ADIVINADAS`: este
 * guardián no importa la implementación que vigila — comparar el código consigo
 * mismo aprobaría siempre.
 */
export function rutaMd(lang: Locale, slug: PageSlug): string {
  const publico = publicSlug(lang, slug);
  return `/md/${lang}${publico ? `/${publico}` : ""}.md`;
}
