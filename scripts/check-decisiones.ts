/**
 * ¿El índice de decisiones cubre y ordena lo que hay? — `npm run check:decisiones`, en CI.
 *
 * POR QUÉ EXISTE. `DECISIONS.md` son ~42.000 palabras y, por diseño (D28), NO se
 * `@`-importa: se consulta a demanda. Su única puerta de entrada es el índice de
 * `CLAUDE.md`, que sí va en contexto. O sea que el índice no es una comodidad:
 * es el mecanismo entero del régimen de contexto. Si miente, la consulta dirigida
 * —que es lo que hace barato no cargar el archivo— se vuelve cara.
 *
 * Y SE MANTENÍA A MANO, con la regla escrita en un paréntesis al final del propio
 * índice: «(Al añadir una decisión nueva a DECISIONS.md, añade también su línea
 * aquí.)». El 2026-08-19 estaban las 68 entradas pero DESORDENADAS a partir de
 * D40 (D43 → D42 → D49 → D48 → D47 → D46 → D45 → D44 → D50 → D41), y nadie lo
 * había visto. Es el mismo patrón que D59 ya eliminó tres veces —el sitemap,
 * `llms.txt` y la tabla de tarjetas OG estaban escritos a mano— aplicado al
 * único índice que queda.
 *
 * QUÉ COMPRUEBA, y por qué no genera el texto. Comprueba COBERTURA (que estén
 * todas y ninguna de más) y ORDEN. No regenera el índice porque cada línea lleva
 * una GLOSA escrita a mano que no está en la cabecera de `DECISIONS.md` —es un
 * resumen editorial, no el título— y generarla la perdería. Se verifica lo que se
 * puede verificar sin adivinar; la glosa la sigue escribiendo quien decide.
 *
 * Y AFIRMA CUÁNTO HA MIRADO, con su guarda de cero.
 */
import { readFileSync } from "node:fs";

const DECISIONES = "DECISIONS.md";
const INDICE = "CLAUDE.md";

const numeros = (texto: string, patron: RegExp): number[] =>
  [...texto.matchAll(patron)].flatMap((m) => (m[1] ? [Number(m[1])] : []));

/** `## D42 · …` en DECISIONS.md */
const declaradas = numeros(readFileSync(DECISIONES, "utf8"), /^#+ *D(\d+) ·/gm);
/** `- D42 · …` en el índice de CLAUDE.md */
const indexadas = numeros(readFileSync(INDICE, "utf8"), /^- D(\d+) ·/gm);

if (declaradas.length === 0 || indexadas.length === 0) {
  console.error(
    `\ncheck:decisiones — NO HA MIRADO NADA (${declaradas.length} en ${DECISIONES}, ` +
      `${indexadas.length} en ${INDICE}).\n` +
      "Con cero entradas este check aprobaría siempre, así que falla a propósito.\n" +
      "¿Ha cambiado el formato de las cabeceras o el de las líneas del índice?\n",
  );
  process.exit(1);
}

// El metro afirma cuánto ha mirado (y no al revés).
console.log(
  `check:decisiones — ${declaradas.length} decisiones en ${DECISIONES} · ` +
    `${indexadas.length} líneas en el índice de ${INDICE}`,
);

const problemas: string[] = [];

const enIndice = new Set(indexadas);
const faltan = declaradas.filter((d) => !enIndice.has(d));
if (faltan.length) {
  problemas.push(
    `sin línea en el índice: ${faltan.map((d) => `D${d}`).join(", ")}\n` +
      `    añádela en ${INDICE}, en su sitio por número`,
  );
}

const enDecisiones = new Set(declaradas);
const sobran = indexadas.filter((d) => !enDecisiones.has(d));
if (sobran.length) {
  problemas.push(
    `en el índice pero no en ${DECISIONES}: ${sobran.map((d) => `D${d}`).join(", ")}\n` +
      `    ¿se renombró la decisión, o la línea del índice se quedó huérfana?`,
  );
}

const repetidas = indexadas.filter((d, i) => indexadas.indexOf(d) !== i);
if (repetidas.length) {
  problemas.push(
    `repetidas en el índice: ${[...new Set(repetidas)].map((d) => `D${d}`).join(", ")}`,
  );
}

// El orden. Se señala el primer salto y no la lista entera: con el índice
// desordenado a partir de D40, enumerar cada par produciría treinta líneas de
// ruido para un solo arreglo.
const desorden = indexadas.findIndex(
  (d, i) => i > 0 && d < (indexadas[i - 1] as number),
);
if (desorden > 0) {
  problemas.push(
    `el índice deja de ir en orden en D${indexadas[desorden]}, que va detrás de ` +
      `D${indexadas[desorden - 1]}\n` +
      `    ordénalo por número: es la única navegación a ${DECISIONES}`,
  );
}

if (problemas.length) {
  console.error(
    `\ncheck:decisiones — EL ÍNDICE NO CUADRA (${problemas.length}):\n`,
  );
  for (const p of problemas) console.error(`  · ${p}\n`);
  console.error(
    `El índice de ${INDICE} es la única puerta a ${DECISIONES}, que no se\n` +
      "`@`-importa a propósito (D28). Un índice que miente encarece justo la\n" +
      "consulta dirigida que hace barato no cargar el archivo.",
  );
  process.exit(1);
}

console.log("✓ El índice cubre todas las decisiones y va en orden.");
