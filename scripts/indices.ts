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
 * DÓNDE VA CADA UNO, y no es la misma respuesta para los tres:
 *
 * · `DECISIONS.md` → su índice vive en `CLAUDE.md`, o sea EN CONTEXTO. Se lo gana:
 *   42 de sus 68 entradas están citadas desde el propio código, así que se
 *   consulta constantemente mientras se escribe.
 * · `PRD-Historical.md` y `BRAND-historical.md` → índice EN CABECERA DEL PROPIO
 *   ARCHIVO. Se consultan rara vez y a propósito, así que no se gana costar en
 *   cada arranque: metidos en `CLAUDE.md` serían ~900 palabras y reventarían el
 *   techo de `check:contexto`. En cabecera cuestan cero y se leen con un `Read`
 *   limitado a las primeras líneas.
 *
 * En los tres casos vale la misma regla: **si un título no basta para saber si
 * abrir esa sección, se arregla LA CABECERA, nunca el índice.** El índice no
 * tiene texto propio, y eso es lo que impide que los dos títulos divierjan.
 */
import { readFileSync, writeFileSync } from "node:fs";

// --- El índice de decisiones, que vive en CLAUDE.md ---------------------------

export const DECISIONES = "DECISIONS.md";
export const INDICE_DECISIONES = "CLAUDE.md";

// D1 abre el bloque, y lleva estado —«(superado en V2+)»—, así que el hueco del
// estado tiene que estar aquí también. Sin él, el bloque entero se lee como
// inexistente y el check dice «no hay índice» en vez de «difiere».
const PRIMERA = /^- D1( \([^)]+\))? ·/m;
const CIERRE = /^\*\(Al añadir una decisión nueva/m;

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
  const lineas = readFileSync(INDICE_DECISIONES, "utf8").split("\n");
  const ini = lineas.findIndex((l) => PRIMERA.test(l));
  const fin = lineas.findIndex((l) => CIERRE.test(l));
  if (ini < 0 || fin < 0 || fin < ini) return [];
  // El `( (…))?` es el hueco del estado: sin él, una entrada marcada se leería como
  // «no es una línea del índice» y el check diría que falta en vez de que difiere.
  return lineas.slice(ini, fin).filter((l) => /^- D\d+( \([^)]+\))? ·/.test(l));
}

// --- Los índices en cabecera de los históricos --------------------------------

export const HISTORICOS = ["PRD-Historical.md", "BRAND-historical.md"] as const;

const ABRE =
  "<!-- ÍNDICE · lo genera `npm run indices`; no se edita a mano -->";
const CIERRA = "<!-- FIN ÍNDICE -->";

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
  const lineas = readFileSync(archivo, "utf8").split("\n");
  const ini = lineas.indexOf(ABRE);
  const fin = lineas.indexOf(CIERRA);
  if (ini < 0 || fin < 0 || fin < ini) return [];
  return lineas.slice(ini + 1, fin).filter((l) => l.startsWith("- ["));
}

/**
 * Dónde se inserta el bloque: **después del último bloque de cita de la cabecera**
 * y antes de la primera sección. Los dos archivos abren con un `>` que explica qué
 * son y a dónde ir si buscas otra cosa; ese texto va primero porque orienta, y el
 * índice detrás porque enruta.
 */
function escribeHistorico(archivo: string): { antes: number; despues: number } {
  const lineas = readFileSync(archivo, "utf8").split("\n");
  const iniViejo = lineas.indexOf(ABRE);
  const finViejo = lineas.indexOf(CIERRA);
  const sinIndice =
    iniViejo >= 0 && finViejo > iniViejo
      ? [...lineas.slice(0, iniViejo), ...lineas.slice(finViejo + 1)]
      : lineas;

  const antes = iniViejo >= 0 ? finViejo - iniViejo - 1 : 0;
  const primeraSeccion = sinIndice.findIndex((l) => /^## /.test(l));
  if (primeraSeccion < 0) {
    throw new Error(`${archivo} no tiene ninguna cabecera de nivel 2.`);
  }

  const bloque = [ABRE, ...historico(archivo), CIERRA, ""];
  const salida = [
    ...sinIndice.slice(0, primeraSeccion),
    ...bloque,
    ...sinIndice.slice(primeraSeccion),
  ];
  writeFileSync(archivo, salida.join("\n").replace(/\n{3,}/g, "\n\n"), "utf8");
  return { antes, despues: bloque.length - 3 };
}

// --- Escritura ----------------------------------------------------------------

if (process.argv.includes("--escribir")) {
  // 1. El índice de decisiones, dentro de CLAUDE.md.
  const lineas = readFileSync(INDICE_DECISIONES, "utf8").split("\n");
  const ini = lineas.findIndex((l) => PRIMERA.test(l));
  const fin = lineas.findIndex((l) => CIERRE.test(l));
  if (ini < 0 || fin < 0) {
    console.error(
      `No encuentro el bloque del índice en ${INDICE_DECISIONES}. Esperaba una ` +
        "línea que empiece por «- D1 ·» y, más abajo, la que empieza por «*(Al " +
        "añadir una decisión nueva».",
    );
    process.exit(1);
  }
  const nuevo = decisiones();
  writeFileSync(
    INDICE_DECISIONES,
    [...lineas.slice(0, ini), ...nuevo, "", ...lineas.slice(fin)].join("\n"),
    "utf8",
  );
  console.log(
    `${INDICE_DECISIONES} · índice de decisiones: ${nuevo.length} entradas`,
  );

  // 2. Los índices en cabecera de los históricos.
  for (const archivo of HISTORICOS) {
    const { despues } = escribeHistorico(archivo);
    console.log(`${archivo} · índice en cabecera: ${despues} secciones`);
  }
}
