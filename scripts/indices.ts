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
 * En los tres casos vale la misma regla: **si un título no basta para saber si
 * abrir esa sección, se arregla LA CABECERA, nunca el índice.** El índice no
 * tiene texto propio, y eso es lo que impide que los dos títulos divierjan.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

// --- El bloque, que es el mismo para los tres ---------------------------------

const ABRE =
  "<!-- ÍNDICE · lo genera `npm run indices`; no se edita a mano -->";
const CIERRA = "<!-- FIN ÍNDICE -->";

/** Las líneas de índice que hoy tiene un archivo en su cabecera, si tiene alguno. */
function bloqueActual(archivo: string, esEntrada: RegExp): string[] {
  const lineas = readFileSync(archivo, "utf8").split("\n");
  const ini = lineas.indexOf(ABRE);
  const fin = lineas.indexOf(CIERRA);
  if (ini < 0 || fin < 0 || fin < ini) return [];
  return lineas.slice(ini + 1, fin).filter((l) => esEntrada.test(l));
}

/**
 * Dónde se inserta: **después del último bloque de cita de la cabecera** y antes
 * de la primera sección. Los tres archivos abren con un `>` que explica qué son y
 * a dónde ir si buscas otra cosa; ese texto va primero porque orienta, y el índice
 * detrás porque enruta.
 */
function escribeIndice(archivo: string, entradas: string[]): number {
  const lineas = readFileSync(archivo, "utf8").split("\n");
  const iniViejo = lineas.indexOf(ABRE);
  const finViejo = lineas.indexOf(CIERRA);
  const sinIndice =
    iniViejo >= 0 && finViejo > iniViejo
      ? [...lineas.slice(0, iniViejo), ...lineas.slice(finViejo + 1)]
      : lineas;

  const primeraSeccion = sinIndice.findIndex((l) => /^## /.test(l));
  if (primeraSeccion < 0) {
    throw new Error(`${archivo} no tiene ninguna cabecera de nivel 2.`);
  }

  // El blanco se normaliza SOLO en la costura, nunca en todo el archivo. Con un
  // `replace(/\n{3,}/g)` global el generador reescribía párrafos que no son
  // suyos: al bajar aquí el índice de decisiones se comió tres líneas en blanco
  // repartidas por `DECISIONS.md` y dejó en rojo a `check:articulo`, que vigila
  // justo esas entradas. Un guardián que salta por un blanco ajeno es un
  // guardián que se acaba ignorando.
  const cabecera = sinIndice.slice(0, primeraSeccion);
  while (cabecera.at(-1)?.trim() === "") cabecera.pop();

  const salida = [
    ...cabecera,
    "",
    ABRE,
    ...entradas,
    CIERRA,
    "",
    ...sinIndice.slice(primeraSeccion),
  ];
  writeFileSync(archivo, salida.join("\n"), "utf8");
  return entradas.length;
}

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

export const HISTORICOS = ["PRD-Historical.md", "BRAND-historical.md"] as const;

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

// --- El inventario de `components/ui/` ----------------------------------------

/**
 * EL CUARTO ÍNDICE, y el único que no indexa prosa: indexa una CARPETA.
 *
 * El paso 1 de la «Regla de construcción» de `CLAUDE.md` es «¿existe ya la
 * pieza?», y se contesta leyendo una lista. Esa lista estaba escrita a mano en
 * CINCO sitios y ninguno acertaba: `design-review` decía cinco capas, `PRD-Live`
 * y `README` siete piezas, `CLAUDE.md` nombraba diez, y en disco había quince.
 * Dos piezas —`page-closer` y `video-embed`— no salían en ningún inventario, así
 * que la regla que gobierna todo lo que se construye mandaba mirar donde no
 * estaban. Es la regla 1 de `BRAND.md` aplicada a sí misma.
 *
 * LAS TRES CIFRAS NO ERAN LA MISMA MAL CONTADA, y por eso no se unifican (regla 4
 * de `BRAND.md`): siete es el **núcleo** del sistema, dos son la **capa de
 * artículo** que D76 dejó explícitamente fuera del núcleo, y el resto son
 * **primitivas**. Lo que faltaba no era un número común: era el nombre de cada
 * grupo, y que el recuento saliera del disco.
 *
 * CADA PIEZA APORTA SU PROPIA LÍNEA, en la primera línea del archivo:
 *
 *     // @pieza <grupo> · <publicación> · <una frase>
 *
 * Misma regla que los otros tres índices: el índice no tiene texto propio, así
 * que si una frase no basta para saber si esa es la pieza, se arregla LA LÍNEA.
 */
export const PIEZAS_DIR = "components/ui";
export const INVENTARIO = "components/ui/README.md";

export type Pieza = {
  archivo: string;
  grupo: string;
  /** Ruta bajo `components/site/`, o `pendiente`. */
  publica: string;
  frase: string;
};

const GRUPOS = ["núcleo", "artículo", "primitiva"] as const;

/**
 * Las piezas que hoy pueden estar SIN publicar, con el motivo. Es la lista que
 * hace que un archivo NUEVO sin sección salga en rojo: si no está aquí y declara
 * `pendiente`, falla. Añadir una línea es un acto visible en el diff, que es
 * justo lo que no era «se me olvidó publicarla».
 *
 *   info-card   la tarjeta con la que las páginas de sistema cuentan cosas al
 *               margen; se usa en siete secciones y no se documenta en ninguna.
 *   rich        render de markup del diccionario (D23): no tiene aspecto propio
 *               que enseñar, lo que enseña es el enlace de contenido (§08).
 *   page-closer el cierre de las trece páginas.
 *   video-embed la facade de vídeo (D55), que solo aparece en los deep-dive.
 */
export const SIN_PUBLICAR = [
  // `stat-row.tsx` salió de aquí el 2026-08-22: era la única pieza del NÚCLEO
  // sin sección, y fue el primer disparo de la skill `publicar-en-design-system`
  // (§11, «Debajo del titular, la fila de cifras»).
  // `field.tsx` nace sin sección A PROPÓSITO y con fecha de caducidad: P67.2 es
  // la tarea que publica en el Design System las piezas que estrena el
  // formulario, y va inmediatamente detrás de P67. Se anota aquí en vez de
  // dejarla «pendiente» porque esa es la diferencia entre una deuda declarada y
  // un olvido (2026-08-23).
  "field.tsx",
  "info-card.tsx",
  "rich.tsx",
  "page-closer.tsx",
  "video-embed.tsx",
];

/** Los archivos de la carpeta, sin el README generado. */
export function archivosDePiezas(): string[] {
  return readdirSync(PIEZAS_DIR)
    .filter((f: string) => /\.tsx?$/.test(f))
    .sort();
}

/** La declaración de una pieza, o `undefined` si no la lleva. */
export function pieza(archivo: string): Pieza | undefined {
  const texto = readFileSync(`${PIEZAS_DIR}/${archivo}`, "utf8");
  const m = /^\/\/ @pieza ([^·]+) · ([^·]+) · (.+)$/m.exec(texto);
  if (!m) return undefined;
  return {
    archivo,
    grupo: (m[1] ?? "").trim(),
    publica: (m[2] ?? "").trim(),
    frase: (m[3] ?? "").trim(),
  };
}

/** Las líneas del inventario, agrupadas y derivadas de las declaraciones. */
export function inventario(): string[] {
  const piezas = archivosDePiezas()
    .map(pieza)
    .filter((p): p is Pieza => p !== undefined);

  const lineas: string[] = [];
  for (const grupo of GRUPOS) {
    const delGrupo = piezas.filter((p) => p.grupo === grupo);
    if (!delGrupo.length) continue;
    lineas.push(`### ${grupo} · ${delGrupo.length}`);
    for (const p of delGrupo) {
      const donde =
        p.publica === "pendiente"
          ? "sin publicar"
          : `[${p.publica.replace(/\.tsx?$/, "")}](../site/${p.publica})`;
      lineas.push(`- **\`${p.archivo}\`** — ${p.frase} *(${donde})*`);
    }
  }
  return lineas;
}

/** El inventario que hoy tiene el README, si tiene alguno. */
export function inventarioActual(): string[] {
  return bloqueActual(INVENTARIO, /^(### |- \*\*`)/);
}

/**
 * El README del inventario se genera ENTERO: no tiene parte escrita a mano que
 * preservar, y así no hay dónde escribir una línea que el disco no respalde.
 */
function escribeInventario(): number {
  const lineas = inventario();
  const salida = [
    "# `components/ui/` — el inventario de piezas",
    "",
    "> **Derivado, no escrito.** Lo genera `npm run indices` leyendo la primera",
    "> línea de cada archivo (`// @pieza grupo · publicación · frase`) y lo",
    "> comprueba `npm run check:indices` en cada PR. Para cambiar una frase se",
    "> edita el archivo, nunca este README.",
    ">",
    "> **Es la lista que contesta el paso 1 de la «Regla de construcción»**",
    "> (`CLAUDE.md`): ¿existe ya la pieza? Los tres grupos no son la misma cifra",
    "> mal contada: el **núcleo** es el sistema, la capa de **artículo** quedó",
    "> fuera de él a propósito (D76) y las **primitivas** son piezas sueltas.",
    "",
    ABRE,
    ...lineas,
    CIERRA,
    "",
  ];
  writeFileSync(INVENTARIO, salida.join("\n"), "utf8");
  return lineas.filter((l) => l.startsWith("- ")).length;
}

// --- Escritura ----------------------------------------------------------------

if (process.argv.includes("--escribir")) {
  const escritos: Array<[string, number]> = [
    [INVENTARIO, escribeInventario()],
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
