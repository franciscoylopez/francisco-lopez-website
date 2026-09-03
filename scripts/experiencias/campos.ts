/**
 * Lo que cada idioma tiene que traer de una experiencia — la mitad de
 * `check:experiencias` que mira UN idioma a la vez.
 *
 * Está aparte de `bullets.ts` porque son dos preguntas distintas: aquí, que no
 * falte nada; allí, que las tres longitudes se correspondan entre sí.
 */
import type { Company } from "../../content/experience-copy/types";
import { locales, type Locale } from "../../lib/i18n/config";
import type { CopyDeExperiencia, PorIdioma } from "./tipos";

/** Lo que se le pide a UN idioma. Aparte porque es donde vive el criterio. */
function revisaUnIdioma(
  company: Company,
  slug: string | null,
  lang: Locale,
  copy: CopyDeExperiencia,
): string[] {
  const problemas: string[] = [];

  if (!copy.short?.trim()) {
    problemas.push(
      `[${company}/${lang}] la frase de Trayectoria (\`short\`) está vacía.`,
    );
  }
  if (copy.bullets.length === 0) {
    problemas.push(`[${company}/${lang}] no tiene ningún bullet.`);
  }
  // Los hechos que se pintan en más de una superficie (P48.55). `sector` puede
  // ser vacío —Havas Media no tiene—, los otros dos no.
  for (const campo of ["role", "period"] as const) {
    if (!copy[campo]?.trim()) {
      problemas.push(`[${company}/${lang}] le falta \`${campo}\`.`);
    }
  }
  // El reporting sigue la misma regla que la versión larga de un bullet: lo
  // lleva quien tiene página, porque es quien pinta los Datos.
  const rep = copy.reporting;
  if (slug !== null && !rep?.deep?.trim()) {
    problemas.push(
      `[${company}/${lang}] tiene página (/trayectoria/${slug}) pero no tiene \`reporting.deep\`, que es lo que pintan sus Datos.`,
    );
  }
  if (slug === null && rep !== undefined) {
    problemas.push(
      `[${company}/${lang}] tiene \`reporting\` pero no tiene página de deep-dive ni lo lleva en el CV. Ese texto no lo renderiza nadie.`,
    );
  }

  return problemas;
}

export function revisaCampos(
  company: Company,
  slug: string | null,
  porIdioma: PorIdioma,
): string[] {
  const problemas: string[] = [];

  for (const lang of locales) {
    const copy = porIdioma[lang];
    if (!copy) {
      problemas.push(`[${company}] no tiene copy en «${lang}».`);
      continue;
    }
    problemas.push(...revisaUnIdioma(company, slug, lang, copy));
  }

  return problemas;
}
