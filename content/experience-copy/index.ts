// Punto de entrada del registro de copy por experiencia (P48.5).
//
// Las tres superficies leen de aquí y ninguna guarda su propia copia:
//
//   home (Trayectoria) → `shortOf`      · una frase
//   CV en PDF          → `cvBullets`    · un bullet por hecho
//   deep-dive          → `deepBullets`  · su gemelo largo
//
// El porqué está en `./types.ts`. Lo que el build comprueba, en
// `scripts/check-experience-copy.ts` (`npm run check:experiencias`, en CI).

import type { Locale } from "@/lib/i18n/config";

import { EXPERIENCES } from "../experiences";
import { copy as es } from "./es";
import { copy as en } from "./en";
import type { Company, ExperienceCopy, ExperienceCopyMap } from "./types";

export type { Company, ExperienceCopy, ExperienceCopyMap } from "./types";

const REGISTRY: Record<Locale, ExperienceCopyMap> = { es, en };

/** Todo el copy de un idioma. Para el guardián y para el generador del CV. */
export function experienceCopy(lang: Locale): ExperienceCopyMap {
  return REGISTRY[lang];
}

/**
 * El copy de una experiencia, buscándola **por prefijo** — la misma unión que
 * `experienceOf` y que `matchFact` del CV, y por la misma razón: el diccionario
 * lleva el nombre en su forma de display («Ontecnia (Malavida, Lecturalia,
 * BonViveur…)») y el registro la forma corta.
 *
 * LANZA si no hay match, igual que D44. Una experiencia nueva sin copy tiene que
 * romper ruidosamente, no servir la frase de otra empresa — que es exactamente el
 * fallo silencioso que el mapeo por índice de los logos producía.
 */
export function copyOf(lang: Locale, company: string): ExperienceCopy {
  // Por longitud descendente y no en orden de array: con `startsWith` y el primer
  // match, registrar «Emendu» y más tarde «Emendu Health» haría que la segunda
  // resolviera en silencio a la primera. Misma cautela que `experienceOf`.
  const key = [...EXPERIENCES]
    .map((e) => e.company as Company)
    .sort((a, b) => b.length - a.length)
    .find((c) => company === c || company.startsWith(c));

  if (!key) {
    throw new Error(
      `Copy de experiencia: no encuentro "${company}" en content/experience-copy/. ` +
        `¿Se añadió una fila al diccionario sin darle copy? Registradas: ${EXPERIENCES.map(
          (e) => e.company,
        ).join(" · ")}`,
    );
  }
  return REGISTRY[lang][key];
}

/** La frase de la fila de Trayectoria. */
export function shortOf(lang: Locale, company: string): string {
  return copyOf(lang, company).short;
}

/** Los bullets del CV, en el orden del deep-dive. */
export function cvBullets(lang: Locale, company: string): string[] {
  return copyOf(lang, company).bullets.map((b) => b.cv);
}

/**
 * Los bullets de «En un minuto», buscados por el SLUG de la página — que es lo
 * que una página de deep-dive tiene a mano, no el nombre de la empresa. Lanza si
 * el slug no está registrado, por la misma razón que `experienceOf`.
 */
export function deepBulletsOfSlug(lang: Locale, slug: string): string[] {
  const hit = EXPERIENCES.find((e) => e.slug === slug);
  if (!hit) {
    throw new Error(
      `Copy de experiencia: el slug "${slug}" no está en content/experiences.ts. ` +
        `Con página: ${EXPERIENCES.filter((e) => e.slug)
          .map((e) => e.slug)
          .join(" · ")}`,
    );
  }
  return deepBullets(lang, hit.company);
}

/**
 * Los bullets de «En un minuto». Solo tienen sentido en una experiencia CON
 * página, así que lanza si alguno no tiene gemelo: es el mismo descuadre que el
 * guardián caza en CI, cazado también en runtime por si alguien edita el
 * registro sin pasar por el script.
 */
export function deepBullets(lang: Locale, company: string): string[] {
  return copyOf(lang, company).bullets.map((b, i) => {
    if (b.deep === undefined) {
      throw new Error(
        `Copy de experiencia: "${company}" tiene página de deep-dive pero su bullet ${i + 1} no tiene versión larga (\`deep\`).`,
      );
    }
    return b.deep;
  });
}
