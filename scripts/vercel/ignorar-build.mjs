// Qué commit NO merece un despliegue. Es el `ignoreCommand` de `vercel.json`:
// Vercel lo corre después de clonar y ANTES de instalar, y lee su código de
// salida al revés de lo habitual — **0 = no construyas, 1 = construye**.
//
// POR QUÉ EXISTE (2026-09-06, P72.595). El Deployment Storage del equipo llegó al
// 100 %. No es caudal ni son los assets (`public/` entero son 3 MB): es el NÚMERO
// de despliegues conservados, ~26 al día. El proyecto ya retiene y borra solo
// (preview 7 días · producción 30 · cancelados 1 · errores 7 · `deploymentsToKeep`
// 10), así que el embalse está en régimen permanente. Esto baja el caudal.
//
// Y AQUÍ PONÍA QUE TAMBIÉN SE PODÍA BAJAR BORRANDO. **Medido el 2026-09-08
// (P72.625, D212): no.** Se purgaron 409 preview y el nivel pasó de 11,12 GB con
// 752 despliegues a 11,51 GB con 319. Subió. Por qué borrar no libera sigue
// abierto, pero la consecuencia para este archivo ya no lo está: **generar menos
// es la única palanca comprobada.**
//
// CORRE ANTES DE `npm install`, así que aquí no hay `tsx`, ni dependencias, ni
// TypeScript: node pelado y `.mjs`. Por eso las reglas se prueban desde vitest
// (`tests/ignorar-build.test.ts`) importando la función pura de abajo, y no
// ejecutando el script.
//
// LA REGLA ES DENEGAR POR DEFECTO: se salta el build solo si TODAS las rutas
// tocadas están en la lista de lo que nadie sirve. Cualquier ruta que no
// reconozca —una carpeta nueva, un archivo raro— construye. El riesgo de este
// filtro no es construir de más, es dejar de desplegar un cambio real EN
// SILENCIO, y esa asimetría es la que fija el sentido de la lista.
//
// LO QUE PARECÍA IGNORABLE Y NO LO ES, que es la razón de que la lista tenga
// excepciones en vez de ser cuatro prefijos. El sitio LEE del disco al construir,
// y no solo de `app/`:
//
//   · `DECISIONS.md`               → `lib/decisions.ts` (la página del artículo)
//   · `.github/workflows/ci.yml`   → `lib/figures.ts` (la figura de los gates)
//   · `content/**`                 → registros de psi, agentes, md y artefactos
//   · `assets/fonts`, `public/**`  → `app/api/og`, `app/api/kit.zip`
//
// Los dos primeros son la trampa: viven dentro de sitios que sí son ignorables
// enteros, así que van nombrados uno a uno. **Si mañana una página lee otro
// archivo de fuera de `app/`, esta lista se queda corta sin avisar** — el sitio
// donde mirar es `grep -rn "readFileSync\|readdirSync" lib app`.

import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

/**
 * Lo que nadie sirve: método, andamiaje y documentación del repo.
 * @type {RegExp[]}
 */
export const IGNORABLES = [
  /^\.claude\//, // skills y config del agente
  /^\.githooks\//, // los hooks de git
  /^\.github\//, // CI y plantillas (menos `ci.yml`, ver EXCEPCIONES)
  /^\.qlty\//, // config del analizador
  /^scripts\//, // gates, generadores y sellos: corren fuera del build
  /^tests\//, // vitest
  /^[^/]+\.md$/, // los `.md` de la raíz (menos `DECISIONS.md`)
  // Los sellos de `content/`: los escriben y los leen los guardianes, y ninguna
  // página los abre. Importa porque **un commit de documentación arrastra uno**
  // —tocar `GATES.md` mueve el de `/accesibilidad`— y sin esta línea ese commit
  // construiría por un archivo que nadie sirve. `public/cv/cv.huella` se queda
  // FUERA a propósito: lo de `public/` se copia tal cual al CDN, y ahí saltarse
  // el build sí deja servido un archivo viejo.
  /^content\/.*\.huella$/,
  /^\.gitignore$/,
  /^\.gitattributes$/,
  /^\.prettierignore$/,
  /^\.prettierrc\.json$/,
  /^vitest\.config\.mts$/,
  /^LICENSE$/,
];

/**
 * Las que caen dentro de un prefijo ignorable y aun así las lee el build.
 * @type {string[]}
 */
export const EXCEPCIONES = ["DECISIONS.md", ".github/workflows/ci.yml"];

/**
 * ¿Esta ruta suelta la sirve el sitio?
 * @param {string} ruta ruta relativa a la raíz del repo, con `/` como separador
 * @returns {boolean}
 */
export function laSirveElSitio(ruta) {
  if (EXCEPCIONES.includes(ruta)) return true;
  return !IGNORABLES.some((patron) => patron.test(ruta));
}

/**
 * La decisión: ¿hay que construir?
 *
 * Una lista VACÍA construye. No es un descuido: si el diff no devuelve nada, lo
 * que ha fallado es la medición, no el commit, y el lado seguro es construir.
 *
 * @param {string[]} rutas rutas tocadas desde el último despliegue con éxito
 * @returns {boolean} true = construye · false = sáltatelo
 */
export function hayQueConstruir(rutas) {
  if (rutas.length === 0) return true;
  return rutas.some(laSirveElSitio);
}

/**
 * Las rutas tocadas desde el último despliegue con éxito, o `null` si no se
 * pueden saber — y no saberlas es motivo suficiente para construir.
 *
 * `VERCEL_GIT_PREVIOUS_SHA` solo existe cuando hay un Ignored Build Step
 * configurado, y falta en el primer despliegue de una rama. El clon de Vercel
 * además es superficial, así que el SHA puede no estar: si `git diff` falla, se
 * construye.
 *
 * @returns {string[] | null}
 */
export function rutasTocadas() {
  const base = process.env.VERCEL_GIT_PREVIOUS_SHA;
  if (!base) return null;
  const salida = spawnSync("git", ["diff", "--name-only", base, "HEAD"], {
    encoding: "utf8",
  });
  if (salida.status !== 0) return null;
  return salida.stdout
    .split("\n")
    .map((linea) => linea.trim())
    .filter(Boolean);
}

// El script solo decide cuando se ejecuta; importado desde el test, no hace nada.
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const rutas = rutasTocadas();
  if (rutas === null) {
    console.log(
      "[ignoreCommand] sin diff fiable (falta VERCEL_GIT_PREVIOUS_SHA o el SHA no está en el clon): se construye.",
    );
    process.exit(1);
  }
  const construir = hayQueConstruir(rutas);
  const motivo = construir
    ? rutas.filter(laSirveElSitio).slice(0, 5).join(", ")
    : rutas.slice(0, 5).join(", ");
  console.log(
    `[ignoreCommand] ${rutas.length} ruta(s) tocada(s) · ${
      construir ? "SE CONSTRUYE" : "SE SALTA"
    } · ${motivo}${rutas.length > 5 ? " …" : ""}`,
  );
  process.exit(construir ? 1 : 0);
}
