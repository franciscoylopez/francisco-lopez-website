/**
 * El barrido de copias de token por todo el repo — la quinta comprobación de la
 * paleta, sacada a módulo el 2026-08-28 (P50.83) por el mismo motivo que
 * `pintados.ts`: es un dominio entero con su propia pregunta, su propia lista de
 * permitidos y su propia guarda de cero.
 */
import { readdirSync, readFileSync } from "node:fs";

import { BRAND_PALETTE, oklchToHex, PALETTE } from "../../lib/design-values";

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
    "scripts/palette/pintados.ts",
    "es la tabla de referencia contra la que se compara la conversión",
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
    } else if (/\.(ts|tsx|mjs|cjs|js)$/.test(entry.name)) {
      yield full;
    }
  }
}

/**
 * AFIRMA CUÁNTO HA MIRADO, y por eso devuelve las dos cifras además de los
 * problemas. NO se pueden derivar de las claves del módulo: `PALETTE` tiene el
 * mismo tamaño aunque `sources()` no encuentre un solo archivo, así que contar
 * constantes daría una cifra tranquilizadora sobre cero trabajo. Es la quinta
 * aparición de «un metro que devuelve lista vacía parece un aprobado», y aquí se
 * cuentan los ARCHIVOS ABIERTOS y los hex leídos.
 */
export function barreCopias(): {
  problemas: string[];
  ficheros: number;
  hexes: number;
} {
  const problemas: string[] = [];
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
        problemas.push(
          `copia de token: ${file} escribe ${m[0]}, que es ${tokens.join(" / ")}\n` +
            `    derívalo de paletteHex()/brandHex() en vez de copiarlo`,
        );
      }
    }
  }

  return { problemas, ficheros, hexes };
}
