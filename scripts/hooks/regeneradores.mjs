// Los cuatro gates de artefacto derivado, y cómo se corren. Lo comparten el hook
// de Stop y el de pre-push.
//
// POR QUÉ ESTÁ APARTE (2026-09-05, P72.52). Los dos disparadores miran el mismo
// conjunto y solo se diferencian en QUÉ pueden hacer con un rojo, así que la lista
// no puede vivir en uno de los dos: escrita dos veces, acabaría diciendo dos cosas
// —`BRAND.md` §Cómo se escribe una regla, regla 5— y el disparador que se quedara
// corto sería justo el que bloquea el push.
//
// LA PARTICIÓN DE LOS CARRILES, medida el 2026-09-02 y sin cambios: el DERIVADO
// PURO (`indices`) se puede regenerar solo; los SELLOS (`articulo`,
// `accesibilidad`) piden criterio y aquí solo se nombran; `md` entero no cabe en
// un hook y corre su caso dominante (`md:anclas`). El porqué largo de cada uno
// sigue en la cabecera de `regeneradores-stop.mjs`, que es donde nació.

import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
);

/**
 * Se lanza por `npm run <script>` y no por el binario de `tsx`: el nombre del
 * script ES la config —`package.json` ya dice qué archivo y con qué banderas—,
 * así que resolverlo a mano sería la segunda fuente de verdad.
 */
// Comando entero en una cadena y no `(binario, args[])`: con `shell: true`, pasar
// args por separado saca un DeprecationWarning de Node (DEP0190). Aquí no hay nada
// que escapar —los nombres salen de `CARRILES`— pero el aviso sería ruido.
export const correr = (script) =>
  new Promise((cumplir) => {
    const proc = spawn(`npm run --silent ${script}`, {
      cwd: ROOT,
      shell: true,
      windowsHide: true,
    });
    let salida = "";
    proc.stdout.on("data", (d) => (salida += d));
    proc.stderr.on("data", (d) => (salida += d));
    proc.on("error", () => cumplir({ script, codigo: null, salida }));
    proc.on("close", (codigo) => cumplir({ script, codigo, salida }));
  });

/**
 * Qué hacer con cada rojo. `arregla` es el comando que lo resuelve; `automatico`
 * dice si un hook puede lanzarlo por su cuenta, que es la partición de arriba:
 * solo el derivado puro puede.
 */
export const CARRILES = [
  {
    script: "check:indices",
    automatico: "indices",
    que: "los índices derivados de las cabeceras",
    arregla: "npm run indices (y commitear lo que regenere)",
  },
  {
    script: "check:articulo",
    arregla: "npm run articulo:novedades (y después articulo:sellar)",
    que: "el sello de «Cómo se ha creado esta página»",
  },
  {
    script: "check:accesibilidad",
    arregla: "npm run accesibilidad:sellar, tras comprobar el bloque",
    que: "el sello de /accesibilidad",
  },
  {
    script: "md:anclas",
    arregla: "npm run build && npm run md",
    que: "las anclas de decisión del markdown",
  },
];

/** La primera línea del guardián que nombra el problema, para no volcar su informe
 *  entero: quien quiera el detalle relanza el comando. */
const motivoDe = (salida) =>
  salida
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .find((l) => !l.startsWith(">") && !l.startsWith("npm"))
    ?.replace(/[.·:\s]+$/, "");

/**
 * Corre los cuatro en paralelo y devuelve un aviso por rojo.
 *
 * `regenera` distingue a los dos disparadores, y es la única diferencia entre
 * ellos: al PARAR, un índice viejo se regenera y ya está; al EMPUJAR no sirve de
 * nada, porque lo que viaja es el commit y el archivo regenerado se quedaría sin
 * commitear. Ahí se nombra igual que los otros tres.
 */
export async function revisaCarriles({ regenera }) {
  const resultados = await Promise.all(CARRILES.map((c) => correr(c.script)));
  const avisos = [];

  for (const [i, { codigo, salida }] of resultados.entries()) {
    const carril = CARRILES[i];
    if (codigo === 0) continue;

    if (regenera && carril.automatico) {
      const arreglo = await correr(carril.automatico);
      avisos.push(
        arreglo.codigo === 0
          ? `${carril.que} estaban viejos y se han regenerado (npm run ${carril.automatico}).`
          : `${carril.que} están viejos y \`npm run ${carril.automatico}\` no ha podido arreglarlo.`,
      );
      continue;
    }

    const motivo = motivoDe(salida);
    avisos.push(
      `${carril.que} está en rojo${motivo ? `: ${motivo}` : ""}. ` +
        `Lo arregla \`${carril.arregla}\`` +
        (carril.automatico
          ? "."
          : ", y no lo hace este hook a propósito: sellar sin mirar congelaría el fallo."),
    );
  }

  return avisos;
}
