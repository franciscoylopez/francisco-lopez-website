// Hook PostToolUse: formatea con Prettier el archivo que Claude acaba de escribir.
//
// POR QUÉ EXISTE. `format:check` es gate de CI desde P37.5991, y su historia es
// justo la de un check que se pone rojo por ruido (57 falsos positivos por CRLF).
// Formatear en el momento de escribir elimina esa clase entera de rojo en PR sin
// que nadie tenga que acordarse — es la regla 2 de `BRAND.md` aplicada al formato:
// lo que impide el drift es atarlo a un evento, no la disciplina.
//
// POR QUÉ EL BINARIO Y NO LA API. Se invoca el MISMO `prettier` que corre en CI,
// con el mismo cwd, para que `.prettierrc.json` (con el plugin de Tailwind, que
// ordena clases) y `.prettierignore` se resuelvan exactamente igual. Usar la API
// de Node sería una segunda fuente del comportamiento de formateo — D38 en
// pequeño. Se llama al bin local directamente, no vía `npx`, para ahorrar la
// resolución de paquete en cada edición.
//
// NO BLOQUEA NUNCA. Un fallo de formato no debe cortar el trabajo: si Prettier
// peta, sale 0 en silencio y CI lo cazará igual.

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
const file = event?.tool_input?.file_path;
if (!file) process.exit(0);

// Solo lo que la app escribe. `scripts/`, `design/` y los `.md` ya están fuera
// por `.prettierignore`, pero filtrar aquí evita arrancar un proceso para nada.
if (!/\.(ts|tsx|css|json|mjs)$/i.test(file)) process.exit(0);

// `--ignore-unknown` para que un parser desconocido no sea un error, y el cwd
// fijado a la raíz para que `.prettierignore` sea el del proyecto.
spawnSync(process.execPath, [PRETTIER, "--write", "--ignore-unknown", file], {
  cwd: ROOT,
  stdio: "ignore",
});

process.exit(0);
