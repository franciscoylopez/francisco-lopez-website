/**
 * ¿Sigue siendo cierta `/accesibilidad`? — `npm run check:accesibilidad`, en CI.
 * Con `--seal` (`npm run accesibilidad:sellar`), sella en vez de juzgar.
 *
 * EL PORQUÉ, en `content/accesibilidad/dependencias.ts`. EL MÉTODO, en
 * `scripts/dependencias/huella.ts`. Aquí, el veredicto y sus tres comprobaciones:
 *
 *   1. **Las cifras del arnés cuadran.** `GUARDIAN_COUNT` y `GUARDIAN_CASE_COUNT`
 *      de `lib/design-values.ts` —las dos que la página escribe en prosa— tienen
 *      que ser las que hay en `scripts/guardianes/casos.ts`. Es la comprobación
 *      que nació con la tarea: decían **catorce y veintitrés** habiendo **quince y
 *      veintisiete**, y nadie las movió al añadir un caso porque nada las ataba.
 *   2. **Todo bloque verificable declara dependencias**, y las declaradas
 *      resuelven. Un bloque nuevo sin declarar nace fuera del guardián, en
 *      silencio, que es el modo de fallo que esto viene a cerrar.
 *   3. **El sello cuadra.** Si una fuente cambió, sale rojo NOMBRANDO el bloque.
 *      No dice que el texto sea falso: dice que hay que mirarlo.
 *
 * POR QUÉ ES OTRO GUARDIÁN Y NO UNA FILA DE `check:articulo`. Porque son dos
 * documentos con dos ritmos: el artículo describe cómo se construyó el sitio y se
 * mueve cuando se mueve la arquitectura; esta página describe lo que el sitio
 * CUMPLE hoy y se mueve cuando se mueve una medición. Un solo sello mezclaría los
 * dos y haría que retocar el artículo pidiera releer los límites. El aparato sí es
 * el mismo, y por eso vive aparte y lo comparten (P50.73).
 *
 * Y AFIRMA CUÁNTO HA MIRADO: bloques, dependencias y cifras comprobadas. Un metro
 * que devuelve lista vacía parece un aprobado, y este repo se lo ha encontrado
 * cinco veces.
 *
 * LO QUE NO COMPRUEBA, dicho para que no se dé por cubierto: las cifras que no
 * tienen fuente en el repo —«tres páginas se desbordan por debajo de 320»,
 * «dieciséis pares sobre fotografía»— son mediciones, no archivos, y no hay nada
 * que sellar debajo. Y que el párrafo diga la verdad lo decide una persona; esto
 * existe para que sepa cuándo mirar.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";

import {
  BLOQUES,
  DEPENDENCIAS,
  type BloqueId,
} from "../content/accesibilidad/dependencias";
import esAcc from "../app/[lang]/dictionaries/es/accesibilidad.json";
import { GUARDIAN_CASE_COUNT, GUARDIAN_COUNT } from "../lib/design-values";
import { huellaPorBloque } from "./dependencias/huella";
import { CASOS } from "./guardianes/casos";

/** Dónde vive el sello, junto a la declaración que describe. */
const HUELLA_PATH = "content/accesibilidad/accesibilidad.huella";

const sellar = process.argv.includes("--seal");
const fallos: string[] = [];

/* 1 · LAS CIFRAS DEL ARNÉS ────────────────────────────────────────────────── */

const guardianesReales = new Set(CASOS.map((c) => c.guardian)).size;
const casosReales = CASOS.length;

const cifras: { nombre: string; publicado: number; real: number }[] = [
  {
    nombre: "GUARDIAN_COUNT",
    publicado: GUARDIAN_COUNT,
    real: guardianesReales,
  },
  {
    nombre: "GUARDIAN_CASE_COUNT",
    publicado: GUARDIAN_CASE_COUNT,
    real: casosReales,
  },
];

for (const c of cifras) {
  if (c.publicado !== c.real) {
    fallos.push(
      `${c.nombre} dice ${c.publicado} y en \`scripts/guardianes/casos.ts\` hay ${c.real}. ` +
        "Es la cifra que `/accesibilidad` publica en prosa: corrígela en `lib/design-values.ts`.",
    );
  }
}

/* 2 · TODO BLOQUE VERIFICABLE DECLARA ─────────────────────────────────────── */

// Del DICCIONARIO, no de una lista escrita al lado: si un bloque se renombra o
// desaparece, esto lo dice en vez de sellar un hueco.
const enDiccionario = new Set(Object.keys(esAcc));
const sinBloque = BLOQUES.filter((b) => !enDiccionario.has(b));
if (sinBloque.length > 0) {
  fallos.push(
    `Bloques declarados que ya no están en el diccionario: ${sinBloque.join(", ")}.`,
  );
}

// Y la comprobación de que la prosa sigue teniendo dónde interpolar: un token mal
// escrito se publica con las llaves puestas, que es un fallo que se ve en pantalla
// y no en el código (P68.495).
const TOKENS = ["{comprobaciones}", "{fingidos}"];
for (const token of TOKENS) {
  if (!esAcc.verify.note.includes(token)) {
    fallos.push(
      `La nota de «Verificación» ya no interpola ${token}: o la cifra volvió a estar ` +
        "escrita a mano, o el token se renombró sin tocar el componente.",
    );
  }
}

const { sellos, rotas, dependencias } = huellaPorBloque<BloqueId>(
  BLOQUES,
  DEPENDENCIAS,
);

for (const r of rotas) {
  fallos.push(`§${r.seccion} depende de \`${r.dep}\`, y ${r.motivo}.`);
}

/* EL METRO AFIRMA CUÁNTO HA MIRADO ────────────────────────────────────────── */

console.log(
  `\ncheck:accesibilidad — ${BLOQUES.length} bloque(s) verificable(s) · ` +
    `${dependencias} dependencia(s) · ${cifras.length} cifra(s) del arnés` +
    (sellar ? " · sellando" : ""),
);

if (dependencias === 0) {
  console.error(
    "\ncheck:accesibilidad — NO HA MIRADO NADA. Con cero dependencias esto\n" +
      "aprobaría siempre, así que falla a propósito.\n",
  );
  process.exit(1);
}

/* 3 · EL SELLO ────────────────────────────────────────────────────────────── */

function leerSello(): Map<string, string> {
  if (!existsSync(HUELLA_PATH)) return new Map();
  return new Map(
    readFileSync(HUELLA_PATH, "utf8")
      .split("\n")
      .filter((l) => l.trim() && !l.startsWith("#"))
      .map((l) => l.split(/\s+/) as [string, string]),
  );
}

if (sellar) {
  // Sellar sobre una declaración rota congelaría el fallo y lo volvería
  // invisible: las dos comprobaciones de arriba son PRECONDICIÓN, igual que en
  // `check:articulo`.
  if (fallos.length > 0) {
    console.error("\nNo se sella con la declaración rota:\n");
    for (const f of fallos) console.error(`  · ${f}`);
    console.error("");
    process.exit(1);
  }
  const cuerpo =
    "# Sello de /accesibilidad — lo escribe `npm run accesibilidad:sellar`.\n" +
    "# El porqué, en `content/accesibilidad/dependencias.ts`.\n" +
    [...sellos].map(([k, v]) => `${k} ${v}`).join("\n") +
    "\n";
  writeFileSync(HUELLA_PATH, cuerpo, "utf8");
  console.log(`✓ Sellados ${sellos.size} bloques en ${HUELLA_PATH}.\n`);
  process.exit(0);
}

const previo = leerSello();
const movidos: BloqueId[] = [];
for (const [bloque, hash] of sellos) {
  const antes = previo.get(bloque);
  if (antes === undefined || antes !== hash) movidos.push(bloque);
}

if (fallos.length === 0 && movidos.length === 0) {
  console.log(
    "✓ Las cifras del arnés cuadran, todo bloque declara, y ninguna fuente se ha movido.\n",
  );
  process.exit(0);
}

console.error(
  "\ncheck:accesibilidad — la página puede haber dejado de ser cierta.\n",
);

for (const f of fallos) console.error(`  · ${f}\n`);

if (movidos.length > 0) {
  console.error(
    `  · HAN CAMBIADO LAS FUENTES DE ${movidos.length} BLOQUE(S):\n`,
  );
  for (const b of movidos) {
    console.error(`      §${b} — depende de:`);
    for (const dep of DEPENDENCIAS[b]) console.error(`        · ${dep}`);
  }
  console.error(
    "\n    Con eso delante: si el texto sigue siendo cierto,\n" +
      "    `npm run accesibilidad:sellar`; si no, se corrige el copy ES y EN\n" +
      "    (D20: el ES es la fuente) y se sella después.\n",
  );
}

process.exit(1);
