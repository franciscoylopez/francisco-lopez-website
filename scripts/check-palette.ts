// Guardián de la paleta (P37.6605). Mira DOS cosas, y conviene saberlo antes de
// tocarlo:
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

import { readdirSync, readFileSync } from "node:fs";

import {
  BRAND_PALETTE,
  oklchToHex,
  PALETTE,
  type Theme,
} from "../lib/design-values";
import { revisaSello } from "./censo/huella";

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
  // Los dos valores del acento morado, que conmuta desde P37.657 (D41). Medidos
  // en Chrome con el mismo método: píxel de un `<canvas>`, ya recortado a sRGB.
  "oklch(0.78 0.16 290)": "#B7A3FF",
  "oklch(0.45 0.16 290)": "#583DA6",
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

/**
 * 5) NO QUEDA NINGUNA COPIA DE UN VALOR DE TOKEN FUERA DE SU FUENTE (P37.659).
 *
 * Los cuatro controles de arriba verifican que las copias CONOCIDAS coinciden.
 * No verifican que no aparezcan copias NUEVAS — y aparecieron dos que nadie
 * miraba: el `themeColor` de `app/[lang]/layout.tsx` y el plato mono del Brand
 * Kit, los dos con `--background` escrito a mano. Sobrevivieron porque el
 * guardián solo comparaba `PALETTE` contra `globals.css`.
 *
 * POR QUÉ SE BUSCAN VALORES Y NO HEXES A SECAS. Un grep de `#rrggbb` con lista
 * de excepciones habría marcado tres colores que DEBEN estar escritos a mano y
 * no son tokens: el blanco y el negro puros del logo mono, y —sobre todo—
 * `#CFEFEE` / `#E6E0FB`, que son los «colores desviados» que el Brand Kit
 * enseña a propósito como ejemplo de lo que NO hay que hacer. Marcarlos
 * obligaría a mantener una lista de excepciones que crece con cada ilustración,
 * y una lista que se mantiene a mano acaba con un `// eslint-disable` de facto.
 *
 * Así que la pregunta que se hace es la exacta: **¿este literal vale lo mismo
 * que un token?** Si vale, es una copia, se llame como se llame el archivo. Si
 * no vale, no es asunto de este guardián. La lista de archivos permitidos queda
 * en dos, y cada uno con su motivo escrito.
 */
const ALLOWED = new Map<string, string>([
  [
    "scripts/check-palette.ts",
    "es la tabla de referencia de este mismo guardián",
  ],
  [
    "lib/design-values.ts",
    "publica los hexes como TEXTO en la tabla del Design System y el Brand Kit",
  ],
]);

/**
 * Los hexes que valen los tokens, en mayúsculas. Un mismo hex puede ser VARIOS
 * tokens —`#21262B` es `--foreground` en claro y `--card` en oscuro— y se
 * acumulan todos: quedarse con el último haría que el aviso señalara un token
 * plausible pero equivocado, que es la peor clase de mensaje de error.
 */
const TOKEN_HEXES = new Map<string, string[]>();
const note = (hex: string, name: string) => {
  const key = hex.toUpperCase();
  const names = TOKEN_HEXES.get(key) ?? [];
  if (!names.includes(name)) names.push(name);
  TOKEN_HEXES.set(key, names);
};
for (const theme of ["light", "dark"] as const) {
  for (const [token, value] of Object.entries(PALETTE[theme])) {
    note(oklchToHex(value), `--${token} (${theme})`);
  }
}
for (const [token, value] of Object.entries(BRAND_PALETTE)) {
  note(oklchToHex(value), `--${token}`);
}

/** Comentarios fuera: un hex citado en una explicación no es una copia viva. */
const stripComments = (src: string) =>
  src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");

function* sources(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = `${dir}/${entry.name}`;
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      yield* sources(full);
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      yield full;
    }
  }
}

// Cuánto ha mirado el barrido de verdad. NO se puede derivar de las claves del
// módulo: `PALETTE` tiene el mismo tamaño aunque `sources()` no encuentre un solo
// archivo, así que contar constantes daría una cifra tranquilizadora sobre cero
// trabajo. Es la quinta aparición de «un metro que devuelve lista vacía parece un
// aprobado» y aquí se cuentan los ARCHIVOS ABIERTOS y los hex leídos.
let ficheros = 0;
let hexes = 0;

for (const dir of ["app", "components", "lib", "scripts"]) {
  for (const file of sources(dir)) {
    if (ALLOWED.has(file)) continue;
    ficheros++;
    const body = stripComments(readFileSync(file, "utf8"));
    for (const m of body.matchAll(/#[0-9A-Fa-f]{6}\b/g)) {
      hexes++;
      const tokens = TOKEN_HEXES.get(m[0].toUpperCase());
      if (!tokens) continue;
      problems.push(
        `copia de token: ${file} escribe ${m[0]}, que es ${tokens.join(" / ")}\n` +
          `    derívalo de paletteHex()/brandHex() en vez de copiarlo`,
      );
    }
  }
}

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
