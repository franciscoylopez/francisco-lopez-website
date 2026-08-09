// Guardián de la paleta (P37.6605). Falla el build si `lib/design-values.ts` y
// `app/globals.css` dejan de decir lo mismo.
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

import {
  BRAND_PALETTE,
  oklchToHex,
  PALETTE,
  type Theme,
} from "../lib/design-values";

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
      problems.push(`${theme}: --${token}\n    módulo: ${value}\n    css:    ${css}`);
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
      problems.push(`${theme}: --${token}\n    módulo: ${value}\n    css:    ${css}`);
    }
  }
}

/**
 * 3) La conversión `oklch` → hex reproduce lo que pinta el navegador.
 *
 * Medido en Chrome el 2026-08-09 con el método de `BRAND.md` §Accesibilidad
 * —píxel de un `<canvas>`, ya recortado a sRGB— y validado antes contra los dos
 * anclajes de contraste (13,79 y 15,32, exactos). Sin este paso, la conversión
 * podría ser sistemáticamente falsa y los tres controles anteriores seguirían en
 * verde: es la costumbre de validar la herramienta antes de creerse el hallazgo.
 *
 * La tolerancia es de UN paso de 8 bits por canal, y no es laxitud: hay un valor
 * —`--muted-foreground` claro— cuyo canal rojo cae en 82,50, justo en el filo del
 * redondeo. Una divergencia real está a años luz de ahí: el cian superado se
 * separaba del vigente en 6 pasos.
 */
const PAINTED: Record<string, string> = {
  "oklch(0.9653 0.0102 81.8)": "#F7F3EC",
  "oklch(0.2657 0.0118 248.27)": "#21262B",
  "oklch(0.9855 0.0057 84.57)": "#FCFAF6",
  "oklch(0.901 0.0142 88.69)": "#E2DED4",
  "oklch(0.9316 0.0128 86.83)": "#ECE8DF",
  "oklch(0.4365 0.0064 95.19)": "#52524E",
  "oklch(0.41 0.0886 194.82)": "#005859",
  "oklch(0.2283 0.0098 248.26)": "#191D21",
  "oklch(0.3252 0.0157 248.31)": "#2E353C",
  "oklch(0.3063 0.0152 252.34)": "#2A3037",
  "oklch(0.7295 0.0116 95.22)": "#AAA8A0",
  "oklch(0.7626 0.1156 191.46)": "#3FC9C4",
  "oklch(0.7242 0.1208 194.82)": "#16BDBD",
  "oklch(0.6889 0.1581 289.96)": "#9B87F5",
  "oklch(0.8694 0.0592 192.12)": "#A7E1DE",
  "oklch(0.8151 0.0776 295.46)": "#C6B9F0",
};

const channels = (hex: string) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

for (const [css, painted] of Object.entries(PAINTED)) {
  const got = oklchToHex(css);
  const drift = Math.max(
    ...channels(got).map((v, i) => Math.abs(v - (channels(painted)[i] ?? 0))),
  );
  if (drift > 1) {
    problems.push(
      `conversión: ${css}\n    navegador: ${painted}\n    derivado:  ${got}`,
    );
  }
}

// 4) Todo valor de la paleta tiene que estar cubierto por la comprobación de
//    arriba. Si no, se podría añadir un token nuevo y su hex derivado no lo
//    verificaría nadie — el mismo agujero, una vuelta más tarde.
for (const source of [PALETTE.light, PALETTE.dark, BRAND_PALETTE]) {
  for (const value of Object.values(source)) {
    if (!(value in PAINTED)) {
      problems.push(
        `conversión: ${value} no está medido en el navegador — añádelo a PAINTED`,
      );
    }
  }
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
  `Paleta verificada: ${Object.keys(PALETTE.light).length * 2 + Object.keys(BRAND_PALETTE).length * 2} tokens contra globals.css, ${Object.keys(PAINTED).length} conversiones contra el navegador.`,
);
