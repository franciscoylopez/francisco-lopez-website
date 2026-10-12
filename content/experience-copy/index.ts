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

import { EXPERIENCES, experienceOf } from "../experiences";
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

/**
 * Los hechos de una experiencia que se pintan en más de una superficie. Los tres
 * consumidores —la fila de Trayectoria, los Datos del deep-dive y el CV— leen de
 * aquí, así que **no pueden decir cosas distintas**. Mientras cada uno guardaba
 * su copia, KUOTIP terminaba en noviembre en la home y en diciembre en su página
 * (P48.55).
 */
export function factsOf(
  lang: Locale,
  company: string,
): { role: string; period: string; sector: string } {
  const { role, period, sector } = copyOf(lang, company);
  return { role, period, sector };
}

/**
 * EL SEPARADOR DE UN RANGO DE FECHAS, que no es una elección de este archivo:
 * lo fija `CLAUDE.md` §copy —guion con espacios en un rango, porque el «·» ya es
 * el separador de campos— y lo vigila `check:raya`. Por eso partir por aquí es
 * fiable en los dos idiomas y en las ocho experiencias.
 */
const SEPARADOR = " - ";

/**
 * El periodo partido en sus dos extremos, cada uno con su texto y su ISO, para
 * que la página pueda pintar un `<time datetime>` por extremo (P67.6). `<time>`
 * no sabe expresar un rango, así que un periodo son dos elementos, que es lo que
 * hace todo CV marcado en condiciones.
 *
 * EL TEXTO SALE DEL COPY Y EL ISO DEL REGISTRO, así que la pareja puede
 * divergir. Se comprueba en vez de confiarse: el año del ISO tiene que aparecer
 * en su mitad del texto. Corre en build —las 28 variantes se prerenderizan—, o
 * sea que una fecha cambiada en un sitio y no en el otro rompe la build en vez
 * de servir dos verdades. Es el mismo modo de fallo que P48.55 encontró en este
 * campo, con la diferencia de que aquí las dos copias son de tipos distintos y
 * ninguna revisión visual las habría cruzado.
 */
export function periodPartsOf(
  lang: Locale,
  company: string,
): { texto: string; iso: string | null }[] {
  const { period } = factsOf(lang, company);
  const { desde, hasta } = experienceOf(company);

  const partes = period.split(SEPARADOR);
  if (partes.length !== 2) {
    throw new Error(
      `Periodo de "${company}" (${lang}): «${period}» no se parte en dos por «${SEPARADOR}». ` +
        "Un rango de fechas lleva guion con espacios (CLAUDE.md §copy); si esta " +
        "experiencia de verdad no es un rango, el sitio de arreglarlo es el copy.",
    );
  }

  const extremos = [
    { texto: partes[0]!, iso: desde },
    { texto: partes[1]!, iso: hasta },
  ];

  for (const { texto, iso } of extremos) {
    if (iso && !texto.includes(iso.slice(0, 4))) {
      throw new Error(
        `Periodo de "${company}" (${lang}): el copy dice «${texto}» y el registro «${iso}». ` +
          "Las dos mitades tienen que decir lo mismo: o se corrige el `period` de " +
          "content/experience-copy/, o se corrigen `desde`/`hasta` de content/experiences.ts.",
      );
    }
  }

  return extremos;
}

/** El separador, para que la página lo pinte entre los dos extremos. */
export const PERIOD_SEPARATOR = SEPARADOR;

/**
 * El reporting en la longitud que toca. `"deep"` es la corta de los Datos y
 * `"cv"` la larga del papel; `undefined` donde no aplica (PICKASO y las dos de
 * Marketing & Growth).
 */
export function reportingOf(
  lang: Locale,
  company: string,
  donde: "deep" | "cv",
): string | undefined {
  return copyOf(lang, company).reporting?.[donde];
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
  return deepBullets(lang, companyOfSlug(slug));
}

/**
 * La empresa a la que pertenece un slug. Lanza si no está registrado — una página
 * de deep-dive sin experiencia detrás no es un caso que deba servirse a medias.
 */
export function companyOfSlug(slug: string): Company {
  const hit = EXPERIENCES.find((e) => e.slug === slug);
  if (!hit) {
    throw new Error(
      `Copy de experiencia: el slug "${slug}" no está en content/experiences.ts. ` +
        `Con página: ${EXPERIENCES.filter((e) => e.slug)
          .map((e) => e.slug)
          .join(" · ")}`,
    );
  }
  return hit.company;
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

/**
 * El rótulo de apertura de un deep-dive y de su tarjeta OG: **empresa · sector**,
 * buscado por SLUG (que es lo que conocen la ruta y `/api/og`).
 *
 * POR QUÉ SE COMPONE Y NO SE ESCRIBE (P50.36b). Era una cadena literal en cada uno
 * de los diez diccionarios —cinco experiencias × dos idiomas— que repetía dos datos
 * que ya viven en su fuente: el nombre en `content/experiences.ts` y el sector aquí.
 * O sea, la sexta copia del sector después de que D58 lo subiera al registro.
 *
 * Y no fue teórico: el de KUOTIP se quedó en «KUOTIP · Customer Reviews», sin el
 * tipo de negocio que llevan las otras cuatro. Salía así en la página y en su
 * tarjeta OG, mientras el índice de `/trayectoria` —que ya componía este mismo
 * rótulo desde el registro— decía otra cosa. **Dos superficies leyendo el mismo
 * hecho de dos sitios distintos es la definición del problema que D57/D58
 * resuelven**, y aquí había sobrevivido escondido dentro de una cadena de display.
 *
 * LANZA con un slug desconocido, igual que `companyOfSlug` —del que se apoya— y que
 * `deepBulletsOfSlug`: aquí un slug que no existe solo puede venir de nuestro propio
 * código, porque las dos llamadas reales ya han comprobado antes que la experiencia
 * tiene diccionario. Mejor romper la build que servir el rótulo de otra empresa.
 */
export function eyebrowOf(lang: Locale, slug: string): string {
  const company = companyOfSlug(slug);
  return `${company} · ${factsOf(lang, company).sector}`;
}
