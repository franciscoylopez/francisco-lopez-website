/**
 * Que las tres longitudes se correspondan — la mitad de `check:experiencias` que
 * compara idiomas entre sí y bullets contra su versión larga.
 *
 * Es donde vive la comprobación que ya había fallado siete veces: una cifra que
 * existe en una longitud y falta en la otra. Se busca la AUSENCIA, no el patrón.
 */
import type { Company } from "../../content/experience-copy/types";
import { locales, type Locale } from "../../lib/i18n/config";
import { metricas } from "./metricas";
import type { PorIdioma } from "./tipos";

/** 2 y 3 · Versión larga ⟺ página, y las cifras del par CV ↔ deep-dive. */
function revisaUnBullet(
  company: Company,
  lang: Locale,
  slug: string | null,
  bullet: PorIdioma[Locale]["bullets"][number],
  n: number,
): { problemas: string[]; comparado: boolean } {
  const problemas: string[] = [];

  // 2 · Versión larga ⟺ tiene página de deep-dive.
  if (slug !== null && bullet.deep === undefined) {
    problemas.push(
      `[${company}/${lang}] el bullet ${n} no tiene versión larga (\`deep\`), pero la experiencia SÍ tiene página (/trayectoria/${slug}). ` +
        `La regla 1 del formato pide un bullet de «En un minuto» por bullet del CV.`,
    );
  }
  if (slug === null && bullet.deep !== undefined) {
    problemas.push(
      `[${company}/${lang}] el bullet ${n} tiene versión larga (\`deep\`) pero la experiencia NO tiene página de deep-dive. ` +
        `Ese texto no lo renderiza nadie.`,
    );
  }

  // 3 · Las cifras no pueden vivir en una longitud y faltar en la otra.
  if (bullet.deep === undefined) return { problemas, comparado: false };

  const enCv = metricas(bullet.cv);
  const enDeep = metricas(bullet.deep);
  const soloCv = enCv.filter((m) => !enDeep.includes(m));
  const soloDeep = enDeep.filter((m) => !enCv.includes(m));
  if (soloCv.length) {
    problemas.push(
      `[${company}/${lang}] bullet ${n}: ${soloCv.join(", ")} está en el CV y no en el deep-dive. ` +
        `Si la cifra es buena, el deep-dive la adopta.`,
    );
  }
  if (soloDeep.length) {
    problemas.push(
      `[${company}/${lang}] bullet ${n}: ${soloDeep.join(", ")} está en el deep-dive y no en el CV. ` +
        `Si la cifra es buena, el CV la adopta.`,
    );
  }

  return { problemas, comparado: true };
}

/** 4 · La frase de Trayectoria no puede inventarse una cifra. */
function revisaFraseCorta(
  company: Company,
  lang: Locale,
  copy: PorIdioma[Locale],
): string[] {
  const delShort = metricas(copy.short);
  const delResto = new Set(
    copy.bullets.flatMap((x) => [
      ...metricas(x.cv),
      ...(x.deep ? metricas(x.deep) : []),
    ]),
  );
  const huerfanas = delShort.filter((m) => !delResto.has(m));
  return huerfanas.length
    ? [
        `[${company}/${lang}] la frase de Trayectoria cita ${huerfanas.join(", ")}, que no aparece en ningún bullet. ` +
          `Una cifra que solo vive en la home no la respalda nada.`,
      ]
    : [];
}

/** 0 y 1 · Lo que se compara ENTRE idiomas, que es rol y cobertura. */
function revisaEntreIdiomas(company: Company, porIdioma: PorIdioma): string[] {
  const problemas: string[] = [];

  // 0 · El rol NO se traduce en este sitio («Product Manager», «Cofounder &
  // Product»), así que si ES y EN divergen es una errata, no una traducción. El
  // periodo SÍ se traduce («Actualidad»/«Present»), así que ese no se compara.
  const [a0, b0] = locales as unknown as [Locale, Locale];
  if (
    porIdioma[a0] &&
    porIdioma[b0] &&
    porIdioma[a0].role !== porIdioma[b0].role
  ) {
    problemas.push(
      `[${company}] el rol difiere entre idiomas: ${a0}="${porIdioma[a0].role}" y ${b0}="${porIdioma[b0].role}". ` +
        `Los roles de este sitio no se traducen.`,
    );
  }

  // 1 · Cobertura entre idiomas.
  const [a, b] = locales as unknown as [Locale, Locale];
  if (porIdioma[a].bullets.length !== porIdioma[b].bullets.length) {
    problemas.push(
      `[${company}] descuadre de cobertura: ${a} tiene ${porIdioma[a].bullets.length} bullets y ${b} tiene ${porIdioma[b].bullets.length}. ` +
        `Un bullet que existe en un idioma y no en el otro es contenido perdido, no una traducción más corta.`,
    );
  }

  return problemas;
}

export function revisaBullets(
  company: Company,
  slug: string | null,
  porIdioma: PorIdioma,
): { problemas: string[]; bullets: number; comparaciones: number } {
  const problemas = revisaEntreIdiomas(company, porIdioma);
  let bullets = 0;
  let comparaciones = 0;

  for (const lang of locales as unknown as Locale[]) {
    porIdioma[lang].bullets.forEach((bullet, i) => {
      bullets++;
      const r = revisaUnBullet(company, lang, slug, bullet, i + 1);
      problemas.push(...r.problemas);
      if (r.comparado) comparaciones++;
    });

    problemas.push(...revisaFraseCorta(company, lang, porIdioma[lang]));
  }

  return { problemas, bullets, comparaciones };
}
