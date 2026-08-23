// Hook Stop: pasa Prettier por el árbol al terminar el turno.
//
// POR QUÉ EXISTE. El `PostToolUse` de al lado casa `Edit|Write|MultiEdit`, y esa
// es toda su cobertura: el modo automático del harness edita con `sed` y
// heredocs vía Bash, y los generadores (`npm run cv`, `indices`, `artefacto`)
// escriben por Node. Ninguna de las dos vías casa, así que el hook no falla: no
// se le llama, y no deja rastro. Es la familia del metro que aprueba sobre lista
// vacía con piel nueva — los seis casos anteriores devolvían una lista vacía;
// este ni siquiera corría, así que no había salida que mirar.
//
// Medido el 2026-08-23: de los 30 runs más recientes, 2 en rojo. Uno era
// `check:articulo` haciendo su trabajo (D84); el otro fue `Format` con tres
// `.tsx` corrientes, que es la clase entera de rojo que el hook de formato
// existe para eliminar.
//
// POR QUÉ AL CIERRE Y NO EN CADA ESCRITURA. Este mira el RESULTADO y no la
// procedencia, así que cubre Bash, los generadores y cualquier cuarta vía que
// aparezca sin tener que enumerarlas. El `PostToolUse` se queda: formatear en el
// momento sigue siendo mejor que al final, y además deja a este casi siempre sin
// trabajo. Criterio D51: se dispara en un evento y no pide criterio, luego es
// automático y no una skill.
//
// POR QUÉ EL BINARIO Y NO `npm run format`. Mismo argumento que en `format.mjs`:
// el mismo `prettier` que corre en CI, mismo cwd, y por tanto el mismo
// `.prettierrc.json` (con el plugin de Tailwind) y el mismo `.prettierignore`.
// Se le añade `--cache`, que baja la pasada del árbol entero de 2,5 s a 0,7 s
// cuando no ha cambiado nada, que es el caso normal al cerrar un turno.
//
// DEJA RASTRO. `--list-different` hace que Prettier nombre solo lo que ha
// reescrito, y eso sale por `systemMessage`. Un hook mudo es justo el modo de
// fallo que este arregla: si vuelve a haber tres archivos por turno llegando sin
// formatear, se ve en el momento en vez de en el PR.
//
// NO BLOQUEA NUNCA. Sale 0 pase lo que pase; si Prettier peta, `format:check` lo
// cazará igual en CI.

import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const PRETTIER = resolve(
  ROOT,
  "node_modules",
  "prettier",
  "bin",
  "prettier.cjs",
);

/** Lee el JSON del evento por stdin. Sin entrada válida, no hay nada que hacer. */
const readEvent = async () => {
  try {
    const chunks = [];
    for await (const chunk of process.stdin) chunks.push(chunk);
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return null;
  }
};

const event = await readEvent();

// Si el turno se reanudó por un hook de Stop, este ya corrió: salir evita la
// única forma que tiene un hook de cierre de llamarse a sí mismo.
if (event?.stop_hook_active) process.exit(0);

const run = spawnSync(
  process.execPath,
  [PRETTIER, "--write", "--list-different", "--cache", "."],
  { cwd: ROOT, encoding: "utf8" },
);

const reescritos = (run.stdout ?? "")
  .split(/\r?\n/)
  .map((linea) => linea.trim())
  .filter(Boolean);

if (reescritos.length > 0) {
  const cuantos =
    reescritos.length === 1
      ? "1 archivo que no pasó"
      : `${reescritos.length} archivos que no pasaron`;
  console.log(
    JSON.stringify({
      systemMessage:
        `Formato al cierre: Prettier ha reescrito ${cuantos} por Edit/Write ` +
        `(${reescritos.join(", ")}).`,
    }),
  );
}

process.exit(0);
