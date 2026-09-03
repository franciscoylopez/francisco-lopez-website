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
import { revisaBullets } from "./experiencias/bullets";
import { revisaCampos } from "./experiencias/campos";
import type { PorIdioma } from "./experiencias/tipos";

const problemas: string[] = [];
const fallo = (msg: string) => problemas.push(msg);

let nExperiencias = 0;
let nBullets = 0;
let nComparaciones = 0;

// LAS DOS PREGUNTAS SON DOS MÓDULOS (D148/D187): que no falte nada en un idioma,
// y que las tres longitudes se correspondan entre sí. Aquí queda el recorrido y
// el veredicto, que es lo que hace de esto un guardián.
for (const { company, slug } of EXPERIENCES) {
  const key = company as Company;
  nExperiencias++;

  const porIdioma = Object.fromEntries(
    locales.map((l) => [l, experienceCopy(l as Locale)[key]]),
  ) as PorIdioma;

  for (const p of revisaCampos(key, slug, porIdioma)) fallo(p);

  if (locales.some((l) => !porIdioma[l as Locale])) continue;

  const r = revisaBullets(key, slug, porIdioma);
  for (const p of r.problemas) fallo(p);
  nBullets += r.bullets;
  nComparaciones += r.comparaciones;
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
