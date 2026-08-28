// Guardián de la paleta (P37.6605). Es el VEREDICTO: llama a las comprobaciones,
// junta lo que devuelven y decide. Cada una vive donde su dominio —la tabla del
// navegador en `palette/pintados.ts`, el barrido del repo en `palette/copias.ts`,
// el sello del censo en `censo/huella.ts`— desde 2026-08-28 (P50.83), porque
// escritas en línea eran cinco dominios en un archivo y qlty lo marcaba por
// complejidad total. **Anidarlas no habría servido**: qlty suma las funciones
// anidadas al padre, así que lo que parte el conteo es el módulo (P50.84).
//
// Mira DOS cosas, y conviene saberlo antes de tocarlo:
//
//   1. Que `lib/design-values.ts` y `app/globals.css` digan lo mismo, y que no
//      quede ninguna copia de un valor de token fuera de su fuente.
//   2. Que no haya aparecido ningún token de color, superficie o animación que
//      el censo de contraste NO haya visto (D90). Eso vive en
//      `scripts/censo/huella.ts`, con los datos que mira; aquí solo el veredicto.
//
// Las dos son la misma pregunta —¿la paleta dice hoy lo que creemos?— hecha a dos
// distancias: contra el CSS, y contra la última vez que alguien la midió pintada.
//
// EXISTE PORQUE NINGUNA OTRA COSA QUE CORREMOS PUEDE VERLO. El mock de tema del
// Design System pintó durante días el cian ANTERIOR a la corrección de P37.598, y
// las imágenes OG un atenuado y un borde de una generación previa de la paleta.
// axe pasaba —en el mock el cian es fondo de botón, no texto, así que el par daba
// AAA igual—, el typecheck veía cadenas válidas y el ojo no distingue #005E5F de
// #005859. Solo se detecta comparando valor contra valor, que es lo que hace esto.
//
// Es la contramedida que pide D37: que algo mire el invariante DONDE OCURRE, en
// vez de confiar en que alguien se acuerde de propagar.
//
// Se ejecuta con `npm run check:palette` y en CI, antes del build.

import { readFileSync } from "node:fs";

import { BRAND_PALETTE, PALETTE, type Theme } from "../lib/design-values";
import { revisaSello } from "./censo/huella";
import { barreCopias } from "./palette/copias";
import { PAINTED, revisaConversion } from "./palette/pintados";

const CSS = readFileSync("app/globals.css", "utf8");

/**
 * Un valor de color, con los espacios normalizados. Prettier parte en varias
 * líneas los que llevan comentario al final —`oklch(\n  0.4365 …\n)`—, así que
 * comparar el texto en crudo daría falsos positivos por el formateo.
 */
const normalize = (value: string) =>
  value
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .trim();

/** Los custom properties de un bloque de `globals.css`. */
function readBlock(selector: string): Map<string, string> {
  const start = CSS.indexOf(selector);
  if (start === -1) throw new Error(`No encuentro el bloque ${selector}`);
  const open = CSS.indexOf("{", start);
  const end = CSS.indexOf("\n}", open);
  const body = CSS.slice(open + 1, end);

  const out = new Map<string, string>();
  for (const m of body.matchAll(/--([\w-]+):\s*([^;]+);/g)) {
    const name = m[1];
    const raw = m[2];
    if (!name || !raw) continue;
    out.set(name, normalize(raw));
  }
  return out;
}

const BLOCK: Record<Theme, Map<string, string>> = {
  light: readBlock(":root {"),
  dark: readBlock(".dark {"),
};

const problems: string[] = [];

// 1) Cada token del módulo dice exactamente lo que dice el CSS.
for (const theme of ["light", "dark"] as const) {
  for (const [token, value] of Object.entries(PALETTE[theme])) {
    const css = BLOCK[theme].get(token);
    if (css === undefined) {
      problems.push(`${theme}: --${token} no existe en globals.css`);
    } else if (css !== value) {
      problems.push(
        `${theme}: --${token}\n    módulo: ${value}\n    css:    ${css}`,
      );
    }
  }
}

// 2) Los tokens de marca valen lo mismo en los dos bloques, que es lo que el
//    módulo afirma al no darles tema.
for (const [token, value] of Object.entries(BRAND_PALETTE)) {
  for (const theme of ["light", "dark"] as const) {
    const css = BLOCK[theme].get(token);
    if (css === undefined) {
      problems.push(`${theme}: --${token} no existe en globals.css`);
    } else if (css !== value) {
      problems.push(
        `${theme}: --${token}\n    módulo: ${value}\n    css:    ${css}`,
      );
    }
  }
}

// 3 y 4) La conversión `oklch` → hex reproduce lo que pinta el navegador, y toda
//    la paleta está cubierta por esa tabla. En `scripts/palette/pintados.ts`.
problems.push(...revisaConversion());

// 5) No queda ninguna copia de un valor de token fuera de su fuente, barriendo el
//    repo entero. En `scripts/palette/copias.ts`.
const { problemas: copias, ficheros, hexes } = barreCopias();
problems.push(...copias);

// 6) ¿Ha aparecido algo que el censo no ha visto? El porqué y el método están en
//    `scripts/censo/huella.ts`, con los datos que mira; aquí solo el veredicto.
const censo = revisaSello();
problems.push(...censo.problemas);

if (censo.senales === 0) {
  console.error(
    "\ncheck:palette — NO HA MIRADO NADA del censo (0 tokens de color, 0 superficies\n" +
      "y 0 animaciones). Con cero señales esa mitad aprobaría siempre, así que falla\n" +
      "a propósito. ¿Ha cambiado el formato de `app/globals.css`?\n",
  );
  process.exit(1);
}

if (ficheros === 0 || hexes === 0) {
  console.error(
    `\ncheck:palette — NO HA MIRADO NADA (${ficheros} archivos, ${hexes} hex leídos).\n` +
      "Con cero entradas la mitad de este check —la que busca copias de token fuera\n" +
      "de su fuente— aprobaría siempre, así que falla a propósito.\n" +
      "¿Se han movido app/, components/, lib/ o scripts/, o ha cambiado la extensión?\n",
  );
  process.exit(1);
}

if (problems.length > 0) {
  console.error(
    `\nLa paleta del módulo y la de globals.css no dicen lo mismo (${problems.length}):\n`,
  );
  for (const p of problems) console.error(`  · ${p}`);
  console.error(
    "\nArregla el que esté mal. Si el token cambió a propósito, el módulo va detrás del CSS.\n",
  );
  process.exit(1);
}

console.log(
  `Paleta verificada: ${Object.keys(PALETTE.light).length * 2 + Object.keys(BRAND_PALETTE).length * 2} tokens contra globals.css, ${Object.keys(PAINTED).length} conversiones contra el navegador, ` +
    `${ficheros} archivos recorridos y ${hexes} hex leídos en busca de copias.`,
);
console.log(
  `  y el censo ha visto lo que hay: ${censo.resumen}, selladas el ` +
    `${censo.fecha ?? "—"}.`,
);
