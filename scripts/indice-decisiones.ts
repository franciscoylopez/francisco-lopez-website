/**
 * El índice de decisiones de `CLAUDE.md`, DERIVADO de `DECISIONS.md`.
 *
 *   npm run indice          escribe el índice en CLAUDE.md
 *   npm run check:decisiones comprueba que coincide (en CI)
 *
 * POR QUÉ SE DERIVA Y YA NO SE ESCRIBE. `DECISIONS.md` son ~42.000 palabras que a
 * propósito NO se `@`-importan (D28); su índice sí, y por tanto es coste fijo de
 * cada sesión. El 2026-08-19 pesaba **3.610 palabras**, casi la mitad de
 * `CLAUDE.md` y un cuarto del presupuesto entero, porque había derivado a cuatro
 * formatos distintos: 18 entradas eran un título de 7-12 palabras y **17 pasaban
 * de 71**, con D54 en 226 — un resumen de una entrada de 2.080. Y no al azar: las
 * más largas eran las más nuevas. El mismo «añadir sin compactar» de siempre,
 * aplicado al índice.
 *
 * LA PREGUNTA QUE LO DECIDIÓ no fue cuánto pesa, sino QUÉ TRABAJO HACE. El índice
 * contesta «¿cuál necesito?», y para eso basta el título: el porqué se lee en
 * `DECISIONS.md`, que para eso está a demanda. La prueba de que enrutar es lo que
 * de verdad ocurre: **42 de los 68 D-números están citados desde el propio
 * código**, así que quien te lleva a D54 es el comentario del archivo en el que
 * estás, no el índice.
 *
 * Decidido por Francisco el 2026-08-19, viendo el antes y el después.
 *
 * CONSECUENCIA DE MÉTODO, y es la que importa: el título del índice y el de la
 * entrada ya no pueden divergir, porque son el mismo. Si un título no basta para
 * enrutar, **se arregla la cabecera de `DECISIONS.md`**, nunca el índice. Mismo
 * movimiento que D59 hizo con el sitemap, `llms.txt` y las tarjetas OG: tres
 * listas escritas a mano que pasaron a derivarse del registro. Este era el último
 * índice a mano que quedaba.
 *
 * Y por eso el ESTADO de una decisión vive en su cabecera («(superado en V2+)» en
 * D1): es routing —te dice que no la abras— y tiene que sobrevivir al derivado.
 */
import { readFileSync, writeFileSync } from "node:fs";

export const DECISIONES = "DECISIONS.md";
export const INDICE = "CLAUDE.md";

/** Dónde empieza y acaba el bloque del índice dentro de `CLAUDE.md`. */
const PRIMERA = /^- D1 ·/m;
const CIERRE = /^\*\(Al añadir una decisión nueva/m;

export type Entrada = { n: number; linea: string };

/**
 * Las entradas, leídas de las cabeceras `## D42 · Título — 2026-08-17`.
 * Se recorta la fecha final y todo lo que la acompañe (alguna lleva «reescrita
 * …» detrás), que es metadato de la entrada y no ayuda a elegirla.
 */
export function entradas(): Entrada[] {
  const texto = readFileSync(DECISIONES, "utf8");
  return [...texto.matchAll(/^## (D(\d+)) · (.+)$/gm)].map((m) => {
    const titulo = (m[3] ?? "")
      .replace(/\s+—\s+\d{4}-\d{2}-\d{2}.*$/, "")
      .trim();
    return { n: Number(m[2]), linea: `- ${m[1]} · ${titulo}` };
  });
}

/** El bloque completo, ordenado por número. */
export function indice(): string[] {
  return entradas()
    .sort((a, b) => a.n - b.n)
    .map((e) => e.linea);
}

/** Las líneas del índice tal y como están hoy en `CLAUDE.md`. */
export function indiceActual(): string[] {
  const lineas = readFileSync(INDICE, "utf8").split("\n");
  const ini = lineas.findIndex((l) => PRIMERA.test(l));
  const fin = lineas.findIndex((l) => CIERRE.test(l));
  if (ini < 0 || fin < 0 || fin < ini) return [];
  return lineas.slice(ini, fin).filter((l) => /^- D\d+ ·/.test(l));
}

if (process.argv.includes("--escribir")) {
  const lineas = readFileSync(INDICE, "utf8").split("\n");
  const ini = lineas.findIndex((l) => PRIMERA.test(l));
  const fin = lineas.findIndex((l) => CIERRE.test(l));
  if (ini < 0 || fin < 0) {
    console.error(
      `No encuentro el bloque del índice en ${INDICE}. Esperaba una línea que ` +
        "empiece por «- D1 ·» y, más abajo, la que empieza por «*(Al añadir una " +
        "decisión nueva».",
    );
    process.exit(1);
  }
  const antes = lineas
    .slice(ini, fin)
    .join("\n")
    .split(/\s+/)
    .filter(Boolean).length;
  const nuevo = indice();
  const salida = [...lineas.slice(0, ini), ...nuevo, "", ...lineas.slice(fin)];
  writeFileSync(INDICE, salida.join("\n"), "utf8");
  const despues = nuevo.join("\n").split(/\s+/).filter(Boolean).length;
  console.log(
    `Índice escrito en ${INDICE}: ${nuevo.length} entradas · ` +
      `${antes} → ${despues} palabras`,
  );
}
