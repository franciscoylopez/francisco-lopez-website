/**
 * Guardián del registro de copy por experiencia (P48.5) — `npm run check:experiencias`.
 *
 * QUÉ PROTEGE. De una experiencia se cuenta lo mismo en tres longitudes (la frase
 * de Trayectoria, el bullet del CV y su gemelo de «En un minuto»). Colocarlas en
 * el mismo objeto (`content/experience-copy/`) hace que el emparejamiento 1:1 sea
 * estructural, pero hay tres cosas que la ESTRUCTURA no puede garantizar y el
 * TIPO tampoco:
 *
 *   1. que ES y EN tengan el MISMO número de bullets;
 *   2. que tenga versión larga exactamente quien tiene página de deep-dive;
 *   3. que una cifra no viva en una longitud y falte en la otra.
 *
 * La 3 es la que ya había fallado siete veces: `+13% de conversión`, `75%`,
 * `23% → 90%`… existían solo en el deep-dive, y el `38%` del hub de Emendu solo
 * en el CV. Es el mismo olor que D38 (un valor fuera de su fuente) y el mismo
 * giro: se busca la AUSENCIA, no el patrón.
 *
 * DOS COSAS QUE NO COMPRUEBA, dichas para que no se den por cubiertas:
 *
 * - **Que el texto diga lo mismo.** «construí el MVP» y «definí el MVP junto al
 *   product designer» tienen las mismas cifras (ninguna) y afirman cosas
 *   distintas. Eso lo ve una persona, y por eso las dos versiones se editan una
 *   al lado de la otra.
 * - **`datos.rol` / `datos.periodo` / `datos.sector` / `datos.reporting`** del
 *   deep-dive, que siguen siendo copias a mano de hechos del diccionario y del
 *   CV. Tienen cuatro divergencias detectadas y sin resolver (P48.55).
 *
 * Y AFIRMA CUÁNTO HA MIRADO. Un metro que devuelve una lista vacía parece un
 * aprobado — ya ha pasado tres veces en este repo (el medidor de contraste fuera
 * de gamut, el umbral por tamaño de texto, y las reglas `:hover` del censo). Así
 * que este script imprime los recuentos y **falla si alguno es cero**.
 */
import { EXPERIENCES } from "../content/experiences";
import { experienceCopy } from "../content/experience-copy";
import type { Company } from "../content/experience-copy/types";
import { locales, type Locale } from "../lib/i18n/config";

const problemas: string[] = [];
const fallo = (msg: string) => problemas.push(msg);

/**
 * Las cifras con FORMA DE MÉTRICA: porcentajes y magnitudes con sufijo. No todo
 * número — el bullet largo lleva legítimamente números que el corto no («fase 1»,
 * «empresas de 20 a 150 empleados»), y compararlos todos convertiría el guardián
 * en ruido. Lo que no puede diferir es la MEDICIÓN.
 */
function metricas(texto: string): string[] {
  const limpio = texto
    .replace(/\*\*/g, "")
    .replace(/[−–—]/g, "-")
    .replace(/(\d)\s+%/g, "$1%");
  const found = limpio.match(/[+-]?\d+(?:[.,]\d+)?\s*(?:%|[MK]\b)/g) ?? [];
  return [...new Set(found.map((m) => m.replace(/\s+/g, "")))].sort();
}

let nExperiencias = 0;
let nBullets = 0;
let nComparaciones = 0;

for (const { company, slug } of EXPERIENCES) {
  const key = company as Company;
  nExperiencias++;

  const porIdioma = Object.fromEntries(
    locales.map((l) => [l, experienceCopy(l as Locale)[key]]),
  ) as Record<Locale, ReturnType<typeof experienceCopy>[Company]>;

  for (const lang of locales) {
    if (!porIdioma[lang]) {
      fallo(`[${company}] no tiene copy en «${lang}».`);
      continue;
    }
    if (!porIdioma[lang].short?.trim()) {
      fallo(
        `[${company}/${lang}] la frase de Trayectoria (\`short\`) está vacía.`,
      );
    }
    if (porIdioma[lang].bullets.length === 0) {
      fallo(`[${company}/${lang}] no tiene ningún bullet.`);
    }
    // Los hechos que se pintan en más de una superficie (P48.55). `sector` puede
    // ser vacío —Havas Media no tiene—, los otros dos no.
    for (const campo of ["role", "period"] as const) {
      if (!porIdioma[lang][campo]?.trim()) {
        fallo(`[${company}/${lang}] le falta \`${campo}\`.`);
      }
    }
    // El reporting sigue la misma regla que la versión larga de un bullet: lo
    // lleva quien tiene página, porque es quien pinta los Datos.
    const rep = porIdioma[lang].reporting;
    if (slug !== null && !rep?.deep?.trim()) {
      fallo(
        `[${company}/${lang}] tiene página (/trayectoria/${slug}) pero no tiene \`reporting.deep\`, que es lo que pintan sus Datos.`,
      );
    }
    if (slug === null && rep !== undefined) {
      fallo(
        `[${company}/${lang}] tiene \`reporting\` pero no tiene página de deep-dive ni lo lleva en el CV. Ese texto no lo renderiza nadie.`,
      );
    }
  }
  if (locales.some((l) => !porIdioma[l as Locale])) continue;

  // 0 · El rol NO se traduce en este sitio («Product Manager», «Cofounder &
  // Product»), así que si ES y EN divergen es una errata, no una traducción. El
  // periodo SÍ se traduce («Actualidad»/«Present»), así que ese no se compara.
  const [a0, b0] = locales as unknown as [Locale, Locale];
  if (
    porIdioma[a0] &&
    porIdioma[b0] &&
    porIdioma[a0].role !== porIdioma[b0].role
  ) {
    fallo(
      `[${company}] el rol difiere entre idiomas: ${a0}="${porIdioma[a0].role}" y ${b0}="${porIdioma[b0].role}". ` +
        `Los roles de este sitio no se traducen.`,
    );
  }

  // 1 · Cobertura entre idiomas.
  const [a, b] = locales as unknown as [Locale, Locale];
  if (porIdioma[a].bullets.length !== porIdioma[b].bullets.length) {
    fallo(
      `[${company}] descuadre de cobertura: ${a} tiene ${porIdioma[a].bullets.length} bullets y ${b} tiene ${porIdioma[b].bullets.length}. ` +
        `Un bullet que existe en un idioma y no en el otro es contenido perdido, no una traducción más corta.`,
    );
  }

  for (const lang of locales as unknown as Locale[]) {
    porIdioma[lang].bullets.forEach((bullet, i) => {
      nBullets++;
      const n = i + 1;

      // 2 · Versión larga ⟺ tiene página de deep-dive.
      if (slug !== null && bullet.deep === undefined) {
        fallo(
          `[${company}/${lang}] el bullet ${n} no tiene versión larga (\`deep\`), pero la experiencia SÍ tiene página (/trayectoria/${slug}). ` +
            `La regla 1 del formato pide un bullet de «En un minuto» por bullet del CV.`,
        );
      }
      if (slug === null && bullet.deep !== undefined) {
        fallo(
          `[${company}/${lang}] el bullet ${n} tiene versión larga (\`deep\`) pero la experiencia NO tiene página de deep-dive. ` +
            `Ese texto no lo renderiza nadie.`,
        );
      }

      // 3 · Las cifras no pueden vivir en una longitud y faltar en la otra.
      if (bullet.deep === undefined) return;
      nComparaciones++;
      const enCv = metricas(bullet.cv);
      const enDeep = metricas(bullet.deep);
      const soloCv = enCv.filter((m) => !enDeep.includes(m));
      const soloDeep = enDeep.filter((m) => !enCv.includes(m));
      if (soloCv.length) {
        fallo(
          `[${company}/${lang}] bullet ${n}: ${soloCv.join(", ")} está en el CV y no en el deep-dive. ` +
            `Si la cifra es buena, el deep-dive la adopta.`,
        );
      }
      if (soloDeep.length) {
        fallo(
          `[${company}/${lang}] bullet ${n}: ${soloDeep.join(", ")} está en el deep-dive y no en el CV. ` +
            `Si la cifra es buena, el CV la adopta.`,
        );
      }
    });

    // 4 · La frase de Trayectoria no puede inventarse una cifra.
    const delShort = metricas(porIdioma[lang].short);
    const delResto = new Set(
      porIdioma[lang].bullets.flatMap((x) => [
        ...metricas(x.cv),
        ...(x.deep ? metricas(x.deep) : []),
      ]),
    );
    const huerfanas = delShort.filter((m) => !delResto.has(m));
    if (huerfanas.length) {
      fallo(
        `[${company}/${lang}] la frase de Trayectoria cita ${huerfanas.join(", ")}, que no aparece en ningún bullet. ` +
          `Una cifra que solo vive en la home no la respalda nada.`,
      );
    }
  }
}

// El metro afirma cuánto ha mirado (y no al revés).
console.log(
  `check:experiencias — ${nExperiencias} experiencias · ${nBullets} bullets · ${nComparaciones} pares de cifras comparados`,
);

if (nExperiencias === 0 || nBullets === 0 || nComparaciones === 0) {
  console.error(
    "\n✗ El guardián no ha mirado nada. Una lista de problemas vacía no es un aprobado: " +
      "revisa que el registro se esté cargando (content/experience-copy/).",
  );
  process.exit(1);
}

if (problemas.length) {
  console.error(`\n✗ ${problemas.length} problema(s):\n`);
  for (const p of problemas) console.error(`  · ${p}`);
  process.exit(1);
}

console.log("✓ Las tres longitudes de cada experiencia cuadran.");
