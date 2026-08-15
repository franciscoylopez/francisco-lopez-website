// Hook PostToolUse: dispara `check:palette` cuando una edición PUEDE haber roto
// el invariante, y solo entonces.
//
// POR QUÉ EXISTE. El guardián de la paleta es el gate que caza lo que nada más
// puede ver (D38): el mock de tema del Design System pintó durante días el cian
// anterior a P37.598 y las imágenes OG un atenuado de otra generación, con axe en
// verde, el typecheck en verde y el ojo sin distinguir #005E5F de #005859. Hasta
// ahora se disparaba porque alguien se acordaba — que es la regla 2 de `BRAND.md`
// y lo que D51 nombró como el trabajo abierto al adoptar `claude-code-setup`.
//
// EL DISPARADOR MIRA DONDE OCURRE LA COSA (regla 1 de `BRAND.md` §Cómo se escribe
// una regla). El guardián comprueba DOS invariantes, así que el hook tiene dos
// condiciones y no una:
//
//   1. Que `lib/design-values.ts` y `app/globals.css` digan lo mismo
//      → se dispara al tocar cualquiera de los dos.
//   2. Que no quede ninguna COPIA de un valor de token fuera de su fuente,
//      buscando valores y no patrones (D38, ampliado en P37.659)
//      → se dispara cuando la edición escribe un hex de seis dígitos.
//
// Vigilar solo los dos archivos de la condición 1 dejaría la 2 sin puerta;
// vigilar todo el árbol cobraría 1,5 s a cada edición de la app para no mirar
// nada el 95% de las veces. El hex en el payload es la señal exacta.
//
// SÍ BLOQUEA. Sale 2, que devuelve stderr al modelo: el fallo vuelve a quien
// puede corregirlo en el momento, en vez de esperar al rojo de CI.

import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

/** Las dos fuentes que el guardián compara entre sí. */
const SOURCES_OF_TRUTH = ["app/globals.css", "lib/design-values.ts"];

/** Dónde busca copias de token el guardián (mismos directorios que él). */
const SCANNED = /^(app|components|lib|scripts)\//;

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
const input = event?.tool_input;
const file = input?.file_path;
if (!file) process.exit(0);

// Ruta relativa a la raíz y con separadores POSIX, para comparar igual en Windows.
const rel = resolve(file).slice(ROOT.length + 1).replace(/\\/g, "/");

const touchesSourceOfTruth = SOURCES_OF_TRUTH.includes(rel);

// Un hex en cualquier parte del payload (`content`, `new_string`, `edits[]`)
// basta como señal: en el peor caso corre el guardián de más, que es barato.
const writesHex =
  SCANNED.test(rel) &&
  /\.(ts|tsx|css)$/i.test(rel) &&
  /#[0-9A-Fa-f]{6}\b/.test(JSON.stringify(input));

if (!touchesSourceOfTruth && !writesHex) process.exit(0);

const run = spawnSync("npm", ["run", "check:palette", "--silent"], {
  cwd: ROOT,
  encoding: "utf8",
  shell: true,
});

if (run.status !== 0) {
  const output = `${run.stdout ?? ""}${run.stderr ?? ""}`.trim();
  console.error(
    `check:palette ha fallado tras editar ${rel}. Arréglalo antes de seguir ` +
      `(si el token cambió a propósito, lib/design-values.ts va detrás del CSS):\n\n${output}`,
  );
  process.exit(2);
}

process.exit(0);
