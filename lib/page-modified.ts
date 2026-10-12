// Cuándo cambió por última vez el CONTENIDO de cada página. Fuente única.
//
// POR QUÉ SALE DEL SITEMAP Y NO ES UN DATO NUEVO *(P68.746, 2026-08-31)*. Estas
// fechas vivían dentro de `app/sitemap.ts` como dos constantes privadas, y son
// exactamente la respuesta a la pregunta que ahora hace también el markdown para
// agentes: «¿de cuándo es esto?». Escribir una segunda tabla habría sido la
// familia D60 en su forma más tonta — dos verdades sobre lo mismo, divergiendo en
// silencio, y ninguna herramienta capaz de compararlas.
//
// Y NO SE DERIVAN DEL GIT, que sería lo obvio. Son dos motivos, y los dos están
// medidos: Vercel clona en superficial, así que `git log -1 -- <archivo>` devuelve
// vacío para lo que no se tocó en los últimos commits (la razón original, en
// `app/sitemap.ts`); y una fecha de commit metida en un artefacto commiteado es
// una carrera contra sí misma — el `.md` se genera ANTES del commit que lo movió,
// así que `md:verificar` recalcularía una fecha distinta a la guardada y CI se
// quedaría rojo en cada PR de contenido. Es la trampa que la ficha de P68.746
// nombró y por eso no se pisó.
//
// LO QUE GARANTIZA EL TIPO: los dos `Record` son completos, así que **una página
// nueva sin fecha no compila**. Es el mismo guardián que tenían aquí desde D59, y
// se conserva entero al mudarse.

import { EXPERIENCES, type ExperienceSlug } from "@/content/experiences";
import { ARTICLE_UPDATED } from "@/lib/design-values";
import {
  type DeepDiveSlug,
  type PageSlug,
  type StaticPageSlug,
} from "@/lib/routes";

/** Las estáticas. `como-se-ha-creado` la sella su propio guardián (D84). */
const ESTATICAS: Record<StaticPageSlug, string> = {
  "": "2026-08-17",
  "sobre-mi": "2026-08-15",
  trayectoria: "2026-08-18",
  "brand-kit": "2026-08-10",
  "design-system": "2026-08-10",
  accesibilidad: "2026-08-10",
  cookies: "2026-08-23",
  contacto: "2026-08-23",
  "como-se-ha-creado": ARTICLE_UPDATED,
};

/** Las cinco del deep-dive. La lista de cuáles son sale de `EXPERIENCES` (D44). */
const DEEP_DIVE: Record<ExperienceSlug, string> = {
  emendu: "2026-08-18",
  kuotip: "2026-08-17",
  indya: "2026-08-18",
  freepik: "2026-08-17",
  thetool: "2026-08-17",
};

/**
 * La tabla que consumen el sitemap y el markdown. Se compone de las dos de
 * arriba en vez de escribirse: las claves del deep-dive son las de `EXPERIENCES`
 * con su prefijo, y derivarlas es lo que impide que esta tabla y el registro de
 * páginas opinen distinto sobre qué experiencias tienen página.
 */
export const PAGE_MODIFIED: Record<PageSlug, string> = {
  ...ESTATICAS,
  ...(Object.fromEntries(
    EXPERIENCES.flatMap((e) =>
      e.slug === null ? [] : [[`trayectoria/${e.slug}`, DEEP_DIVE[e.slug]]],
    ),
  ) as Record<DeepDiveSlug, string>),
};
