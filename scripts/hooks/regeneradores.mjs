// Los gates que un hook puede correr, y cómo. Cuatro son de artefacto derivado;
// el quinto —el trinquete de deuda— no lo es, y entró en el `method-review` XIII
// por la cifra que hay en su propia entrada.
//
// Antes: Lo comparten el hook
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
  {
    // EL QUINTO, Y NO ES DE ARTEFACTO DERIVADO (method-review XIII, 2026-09-06).
    //
    // POR QUÉ ENTRA, con la cifra que lo decide. Medidos 80 runs de CI (3 → 5 de
    // septiembre), 14 en rojo, y el reparto por paso: «Markdown al día» 6 y
    // «Trinquete de deuda» **5**. Once de catorce son esos dos, y el trinquete es
    // el segundo paso más rojo del repo. La cabecera de `pre-push.mjs` lo dejaba
    // fuera con un argumento correcto que contesta otra pregunta —«el problema
    // nunca fue el listón»—: nadie discute el listón, se discute si el autor se
    // entera antes de empujar o diez minutos después.
    //
    // Y CUESTA 2,7 s en caliente (tres tomas: 17,5 s en frío, luego 2,7 y 2,7),
    // dentro de un `Promise.all` que ya espera a cuatro. El coste es de arranque
    // de la herramienta, no de análisis: 326 archivos en 1,2 s.
    script: "check:deuda",
    que: "el trinquete de deuda",
    arregla:
      "quitar la deuda que ha entrado; y si es esencial, npm run deuda:sellar con el motivo en el commit",
    // SOLO AL EMPUJAR, no en cada cierre de turno. Los otros cuatro miran
    // artefactos que se quedan viejos solos y cuestan milisegundos; este mide el
    // repo entero y una tanda tiene muchos más `Stop` que `push`. Pagarlo en cada
    // parada convertiría el hook en una espera y acabaría desactivado, que es
    // peor que no tenerlo.
    soloPush: true,
    // «No he podido medir» no bloquea un push: es la máquina, no el código. Lo
    // dice el código de salida de `check-deuda.ts` (CODIGO_SIN_HERRAMIENTA), que
    // es un contrato de una línea en vez de su mensaje escrito aquí otra vez. En
    // CI la acción de Qlty la instala, así que allí este caso no existe.
    tolera: 3,
    porQueTolera:
      "qlty no está instalado en esta máquina, así que la deuda no se ha medido. CI sí la mide",
  },
];

/**
 * La línea del guardián que nombra el problema, para no volcar su informe entero:
 * quien quiera el detalle relanza el comando.
 *
 * PREFIERE LA LÍNEA CON `✗`, y no es cosmético: `check:deuda` abre con el progreso
 * de qlty («[0/3] Analyzing all targets... 0.14s»), así que quedarse con la primera
 * línea útil daba un aviso que no decía nada del fallo. Todos los guardianes de
 * esta casa marcan el veredicto con `✗`; el resto es la red por si alguno no.
 */
const motivoDe = (salida) => {
  const lineas = salida
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((l) => !l.startsWith(">") && !l.startsWith("npm"));
  const veredicto = lineas.find((l) => l.includes("✗"));
  return (veredicto ?? lineas[0])?.replace(/[.·:\s]+$/, "");
};

/**
 * Qué decir de un carril, o `null` si no hay nada que decir. Vive fuera del bucle
 * para que la decisión de cada carril sea una función y no una rama más dentro de
 * otra: metida dentro, `check:deuda` la marcó como `function-complexity` en el
 * mismo commit que lo añadía al hook.
 */
async function avisoDe(carril, { codigo, salida }, regenera) {
  if (codigo === 0) return null;

  // El rojo que este hook no trata como rojo, y lo dice en vez de callárselo: un
  // guardián que no ha podido medir no aprueba, pero tampoco frena un push.
  if (codigo === carril.tolera) {
    console.log(`  · ${carril.que}: ${carril.porQueTolera}.`);
    return null;
  }

  if (regenera && carril.automatico) {
    const arreglo = await correr(carril.automatico);
    return arreglo.codigo === 0
      ? `${carril.que} estaban viejos y se han regenerado (npm run ${carril.automatico}).`
      : `${carril.que} están viejos y \`npm run ${carril.automatico}\` no ha podido arreglarlo.`;
  }

  const motivo = motivoDe(salida);
  return (
    `${carril.que} está en rojo${motivo ? `: ${motivo}` : ""}. ` +
    `Lo arregla \`${carril.arregla}\`` +
    (carril.automatico
      ? "."
      : ", y no lo hace este hook a propósito: sellar sin mirar congelaría el fallo.")
  );
}

/**
 * Corre los carriles en paralelo y devuelve un aviso por rojo.
 *
 * `regenera` distingue a los dos disparadores, y es la única diferencia entre
 * ellos: al PARAR, un índice viejo se regenera y ya está; al EMPUJAR no sirve de
 * nada, porque lo que viaja es el commit y el archivo regenerado se quedaría sin
 * commitear. Ahí se nombra igual que los otros.
 *
 * `incluyePush` añade los carriles caros que solo se pagan al empujar. Es un
 * parámetro propio y no `!regenera` a propósito: son dos preguntas distintas
 * —qué se puede arreglar solo, y qué merece la pena esperar— y atarlas haría que
 * cambiar una moviera la otra sin querer.
 */
export async function revisaCarriles({ regenera, incluyePush = false }) {
  const carriles = CARRILES.filter((c) => incluyePush || !c.soloPush);
  const resultados = await Promise.all(carriles.map((c) => correr(c.script)));

  const avisos = [];
  for (const [i, resultado] of resultados.entries()) {
    const aviso = await avisoDe(carriles[i], resultado, regenera);
    if (aviso) avisos.push(aviso);
  }

  return { avisos, mirados: carriles.length };
}
