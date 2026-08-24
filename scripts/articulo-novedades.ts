/**
 * ¿QUÉ ha cambiado desde el último sello? — `npm run articulo:novedades`.
 *
 * POR QUÉ EXISTE, y por qué no es lo que parecía. `check:articulo` (D84) sale
 * rojo nombrando la sección cuando una fuente se mueve, y hasta aquí funciona:
 * es lo que impide que el artículo describa un proyecto que ya no existe. Lo que
 * no hace es decir **qué** se movió, así que cada rojo obliga a abrir el archivo,
 * buscar el cambio y decidir. Siete disparos medidos, siete veces «sellar».
 *
 * LA HIPÓTESIS ERA OTRA, Y LOS NÚMEROS LA TIRARON (2026-08-24, P68.5). La tarea
 * daba por hecho que el ruido venía de que **la dependencia declarada es más
 * gruesa que la afirmación que protege**, y proponía afinarla. Medido sobre los
 * 60 últimos commits: 31 encienden algo, 57 secciones se encienden, y **53 de
 * los 57 cambios son SUSTANTIVOS**. Solo el 14% era ruido mecánico. Afinar la
 * granularidad no era donde estaba el coste.
 *
 * Y de las dos causas mecánicas solo una era artefacto puro: el **borde del
 * recorte** —una entrada de `DECISIONS.md` deja de ser la última del archivo y
 * su recorte se lleva el separador de la siguiente—, 3 casos, los 3 sin señal.
 * Ya está corregido en `huella.ts`. La otra, los **comentarios**, NO se ignora:
 * en este repo el comentario es donde vive el porqué, y el artículo describe
 * justo eso. Los comentarios de `ci.yml` son documentación, no ruido.
 *
 * ASÍ QUE EL COSTE REAL NO ERAN LOS FALSOS POSITIVOS: era tener que ir a leer.
 * Esto no reduce los disparos, los hace baratos. Por cada sección movida dice
 * qué dependencias cambiaron y **qué líneas**, comparando contra el contenido
 * que tenían en el commit donde se escribió el sello vigente.
 *
 * FUERA DE CI, como `psi` y el censo: necesita historia de git y su salida es
 * para una persona. Se invoca PORQUE `check:articulo` está en rojo, y ese rojo
 * lo nombra.
 */
import { execFileSync } from "node:child_process";

import { DEPENDENCIAS, SECCIONES } from "../content/articulo/dependencias";
import {
  DEL_DISCO,
  HUELLA_PATH,
  type Fuente,
  contenidoDesde,
  huellaDelArticulo,
  leerSello,
} from "./articulo/huella";

/** Cuántas líneas de cada lado se enseñan antes de resumir el resto. */
const TOPE = 12;

function git(args: string[]): string | undefined {
  try {
    return execFileSync("git", args, {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return undefined;
  }
}

/** El repo tal y como estaba en un commit. */
const enCommit = (sha: string): Fuente => ({
  leer: (ruta) => git(["show", `${sha}:${ruta}`]),
  listar: (dir) =>
    git(["ls-tree", "--name-only", `${sha}:${dir}`])
      ?.trim()
      .split("\n")
      .filter(Boolean)
      .sort(),
});

/**
 * El tramo que cambia: se recorta el prefijo y el sufijo comunes y se enseña lo
 * de en medio. NO es un diff completo, y se dice: con ediciones dispersas el
 * tramo sale más ancho de lo necesario. Para el caso real —un cambio en un
 * sitio— da exactamente las líneas que hay que leer, y para el resto el tope
 * evita volcar el archivo entero en la terminal.
 */
function tramo(antes: string, ahora: string) {
  const a = antes.split("\n");
  const b = ahora.split("\n");

  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  let j = 0;
  while (
    j < a.length - i &&
    j < b.length - i &&
    a[a.length - 1 - j] === b[b.length - 1 - j]
  )
    j++;

  return {
    linea: i + 1,
    quitadas: a.slice(i, a.length - j),
    puestas: b.slice(i, b.length - j),
  };
}

const esComentario = (linea: string, ruta: string) => {
  const t = linea.trim();
  if (!t) return true;
  if (/\.(ts|tsx|js|mjs|cjs)$/.test(ruta))
    return t.startsWith("//") || t.startsWith("*") || t.startsWith("/*");
  if (/\.ya?ml$/.test(ruta)) return t.startsWith("#");
  return false;
};

/**
 * Una pista, no un veredicto. «Solo comentarios» casi siempre acaba en sellar,
 * pero en este repo el comentario ES la documentación, así que la decisión sigue
 * siendo de quien lee.
 */
function pista(dep: string, antes: string, ahora: string): string {
  const [ruta = ""] = dep.split("#");
  const sustancia = (t: string) =>
    t
      .split("\n")
      .filter((l) => !esComentario(l, ruta))
      .join("\n");
  return sustancia(antes) === sustancia(ahora)
    ? "solo comentarios"
    : "sustantivo";
}

function bloque(titulo: string, lineas: string[], marca: string) {
  if (!lineas.length) return;
  console.log(`        ${titulo}`);
  for (const l of lineas.slice(0, TOPE))
    console.log(`        ${marca} ${l.slice(0, 100)}`);
  if (lineas.length > TOPE)
    console.log(`        ${marca} … y ${lineas.length - TOPE} líneas más`);
}

// ── El informe ───────────────────────────────────────────────────────────────

const { sellos } = huellaDelArticulo();
const sellado = leerSello();

if (sellado.size === 0) {
  console.log(
    `\narticulo:novedades — no hay sello en ${HUELLA_PATH}, así que no hay contra qué comparar.` +
      `\nSella con \`npm run articulo:sellar\`.\n`,
  );
  process.exit(0);
}

const movidas = SECCIONES.filter((s) => sellado.get(s) !== sellos.get(s));

if (!movidas.length) {
  console.log(
    `\narticulo:novedades — nada que contar: las ${SECCIONES.length} secciones ` +
      `cuadran con su sello.\n`,
  );
  process.exit(0);
}

// El sello vigente se escribió en algún commit; ese es el «desde cuándo».
const base = git(["log", "-1", "--format=%H", "--", HUELLA_PATH])?.trim();

if (!base) {
  console.error(
    `\narticulo:novedades — ${HUELLA_PATH} no tiene historia en git todavía, ` +
      `así que no se puede decir qué cambió desde el último sello.\n`,
  );
  process.exit(1);
}

const antesDe = enCommit(base);
const asunto = git(["log", "-1", "--format=%s", base])?.trim() ?? "";

console.log(
  `\narticulo:novedades — ${movidas.length} de ${SECCIONES.length} secciones se han movido ` +
    `desde el sello.\n  Sello vigente: ${base.slice(0, 7)} «${asunto.slice(0, 62)}»\n`,
);

let dependenciasMovidas = 0;
let soloComentarios = 0;

for (const seccion of movidas) {
  console.log(`  §${seccion}`);
  for (const dep of DEPENDENCIAS[seccion]) {
    const ahora = contenidoDesde(dep, DEL_DISCO);
    const antes = contenidoDesde(dep, antesDe);

    if (antes === ahora) continue;
    dependenciasMovidas++;

    if (antes === undefined || ahora === undefined) {
      console.log(
        `      ${dep}  [${antes === undefined ? "no existía en el sello" : "ya no resuelve"}]`,
      );
      continue;
    }

    const clase = pista(dep, antes, ahora);
    if (clase === "solo comentarios") soloComentarios++;
    const { linea, quitadas, puestas } = tramo(antes, ahora);

    console.log(
      `      ${dep}  [${clase}]  desde la línea ${linea} del recorte`,
    );
    bloque(`${quitadas.length} línea(s) fuera:`, quitadas, "-");
    bloque(`${puestas.length} línea(s) dentro:`, puestas, "+");
    console.log("");
  }
}

// AFIRMA CUÁNTO HA MIRADO, como el resto de la casa: un informe que sale vacío
// porque no ha comparado nada se lee igual que uno que no tenía nada que contar.
console.log(
  `  ─── ${dependenciasMovidas} dependencia(s) movida(s) en ${movidas.length} sección(es) · ` +
    `${soloComentarios} solo comentarios ───\n` +
    `  Sigue siendo cierto → \`npm run articulo:sellar\`\n` +
    `  Ya no lo es         → corrige el copy ES y EN (D20) y sella después.\n`,
);

if (dependenciasMovidas === 0)
  console.error(
    `  AVISO: el sello no cuadra y ninguna dependencia parece haber cambiado. ` +
      `Eso pasa cuando el propio método de sellado cambió (\`scripts/articulo/huella.ts\`): ` +
      `revisa el diff de ese archivo antes de sellar a ciegas.\n`,
  );
