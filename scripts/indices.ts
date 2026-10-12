/**
 * Los índices de los documentos que NO se `@`-importan, derivados de sus cabeceras.
 *
 *   npm run indices        los escribe
 *   npm run check:indices  comprueba que coinciden (en CI)
 *
 * POR QUÉ EXISTEN. D28 partió la documentación en dos: las reglas se `@`-importan,
 * la historia y el detalle se consultan a demanda. Esa segunda mitad son ~97.000
 * palabras, y «a demanda» solo funciona si sabes QUÉ HAY dentro sin cargarlo.
 * `DECISIONS.md` lo tenía; `PRD-Historical.md` eran 46.000 palabras y 52 secciones
 * **sin índice de ninguna clase**, así que consultarlo significaba grepear a
 * ciegas o cargar el archivo entero — es decir, la mitad barata del régimen de
 * contexto no lo era.
 *
 * Y EL CONTROL CORRECTO PARA UN ARCHIVO NO ES UN TECHO, ES UN ÍNDICE. Un archivo
 * debe crecer: para eso es un archivo, y ponerle límite solo conseguiría que se
 * deje de escribir el porqué, que es lo que hace bueno a este proyecto. 46.000
 * palabras sin índice son inservibles; 200.000 con un índice bueno están bien.
 *
 * DÓNDE VA CADA UNO: los tres en la CABECERA DEL PROPIO ARCHIVO, y se leen con un
 * `Read` limitado a sus primeras líneas. Ahí cuestan cero por sesión.
 *
 * EL DE DECISIONES VIVÍA EN `CLAUDE.md`, o sea en contexto, y se lo ganaba: buena
 * parte de sus entradas se citan desde el propio código, así que se consulta
 * constantemente mientras se escribe. **Eso justifica TENER el índice; no
 * justifica PRECARGARLO en cada arranque.** Bajó a la cabecera el 2026-08-22
 * (D88): pesaba 1.296 palabras —el 9,6 % del presupuesto entero— y crecía a ~42
 * palabras diarias **por construcción**, así que era el único componente del
 * contexto de arranque que se alimentaba solo. Un techo no se defiende de eso.
 *
 * En los cuatro casos vale la misma regla: **si un título no basta para saber si
 * abrir esa sección, se arregla LA CABECERA, nunca el índice.** El índice no
 * tiene texto propio, y eso es lo que impide que los dos títulos divierjan.
 *
 * AQUÍ SOLO HAY PROSA (2026-08-28, P50.82). El inventario de `components/ui/` se
 * generaba también desde aquí y se ha ido a `scripts/inventario.ts`: no indexa
 * cabeceras de markdown sino la primera línea de archivos de código, y arrastraba
 * consigo un tercer inquilino que no era un índice en absoluto —la POLÍTICA de qué
 * piezas pueden estar sin publicar—. Lo que los dos siguen compartiendo, el bloque
 * delimitado, vive en `scripts/indices/bloque.ts`.
 */
import { readFileSync } from "node:fs";

import { bloqueActual, escribeIndice } from "./indices/bloque";

// --- El índice de decisiones, en la cabecera de DECISIONS.md ------------------

export const DECISIONES = "DECISIONS.md";

// El hueco del estado —«(superado en V2+)»— tiene que estar en el reconocedor.
// Sin él, una entrada marcada se leería como «no es una línea del índice» y el
// check diría que falta en vez de que difiere.
const ES_DECISION = /^- D\d+( \([^)]+\))? ·/;

/**
 * Las entradas, leídas de las cabeceras `## D42 · Título — 2026-08-17`. Se recorta
 * la fecha final y lo que la acompañe (alguna lleva «reescrita …» detrás), que es
 * metadato de la entrada y no ayuda a elegirla.
 */
/**
 * Las cabeceras que EMPIEZAN por `## Dnn`, sin exigirles el resto del formato.
 * Existe para poder comparar contra las que sí lo cumplen: una cabecera mal
 * formada —un guion donde va el `·`, por ejemplo— sería invisible para el
 * generador **y** para el check, así que el índice saldría sin ella y el
 * veredicto sería ✓. El metro aprobando porque no ha mirado, otra vez.
 */
export function decisionesDeclaradas(): number[] {
  const texto = readFileSync(DECISIONES, "utf8");
  return [...texto.matchAll(/^## D(\d+)\b/gm)].map((m) => Number(m[1]));
}

export function decisiones(): string[] {
  const texto = readFileSync(DECISIONES, "utf8");
  return [...texto.matchAll(/^## (D(\d+))( \([^)]+\))? · (.+)$/gm)]
    .map((m) => ({
      n: Number(m[2]),
      // El grupo 3 es el ESTADO de la decisión —«(superado en V2+)», «(generalizada
      // por D39)»— y viaja al índice a propósito: es lo único que te dice que NO
      // abras una entrada, así que dejarlo dentro del cuerpo lo vuelve inútil. Es
      // lo que le pasó a D30, marcada el 2026-08-09 sin que se enterara nadie.
      linea: `- ${m[1]}${m[3] ?? ""} · ${(m[4] ?? "").replace(/\s+—\s+\d{4}-\d{2}-\d{2}.*$/, "").trim()}`,
    }))
    .sort((a, b) => a.n - b.n)
    .map((e) => e.linea);
}

export function decisionesActual(): string[] {
  return bloqueActual(DECISIONES, ES_DECISION);
}

// --- Los índices de los históricos --------------------------------------------

export const HISTORICOS = [
  "PRD-Historical.md",
  "BRAND-historical.md",
  "CLAUDE-historical.md",
] as const;

/**
 * El ancla que GitHub genera para una cabecera: minúsculas, fuera la puntuación
 * que no sea guion, y los espacios a guiones. Los acentos se conservan, que es lo
 * que GitHub hace de verdad (y por lo que no vale un `normalize` agresivo aquí).
 */
function ancla(titulo: string): string {
  return (
    titulo
      .toLowerCase()
      .replace(/[`*_[\]()«».,:;¿?¡!—·'"’]/g, "")
      .trim()
      // CADA espacio pasa a guion, y NO se colapsan. Es lo que GitHub hace de
      // verdad, y la diferencia importa justo donde este proyecto escribe: al
      // quitar un « · » o un « — » quedan DOS espacios, que GitHub convierte en
      // dos guiones. Con `\s+` el ancla salía con uno y el enlace no resolvía —
      // pasaba en 2 de las 68 secciones, y en GitHub, que desde que el repo es
      // público y no hay espejo es donde de verdad se navegan estos archivos.
      .replace(/ /g, "-")
  );
}

/** Las líneas del índice de un histórico, de sus cabeceras de nivel 2. */
export function historico(archivo: string): string[] {
  const texto = readFileSync(archivo, "utf8");
  return [...texto.matchAll(/^## (.+)$/gm)].map((m) => {
    const titulo = (m[1] ?? "").trim();
    return `- [${titulo}](#${ancla(titulo)})`;
  });
}

/** El índice que hoy tiene el archivo, si tiene alguno. */
export function historicoActual(archivo: string): string[] {
  return bloqueActual(archivo, /^- \[/);
}

// --- Escritura ----------------------------------------------------------------

if (process.argv.includes("--escribir")) {
  const escritos: Array<[string, number]> = [
    [DECISIONES, escribeIndice(DECISIONES, decisiones())],
    ...HISTORICOS.map((archivo): [string, number] => [
      archivo,
      escribeIndice(archivo, historico(archivo)),
    ]),
  ];
  for (const [archivo, n] of escritos) {
    console.log(`${archivo} · ${n} entradas`);
  }
}
