/**
 * El inventario de `components/ui/` y la POLÍTICA de qué se publica.
 *
 * POR QUÉ NO ESTÁ EN `indices.ts` (2026-08-28, P50.82). Estuvo, y ahí mezclaba
 * tres dominios: los índices de markdown derivados de cabeceras, el inventario de
 * una carpeta de CÓDIGO —que no lee cabeceras de markdown sino la primera línea de
 * cada `.ts`/`.tsx`— y, el tercero, **una decisión de diseño de sistema viviendo
 * dentro de un generador**: `SIN_PUBLICAR` e `INTERNAS`, la lista de piezas que
 * pueden no tener sección, con su motivo escrito. Eso no es un índice.
 *
 * El coste era de ORIENTACIÓN: quien busque «dónde se decide qué piezas pueden
 * estar sin publicar» no va a mirar en un archivo llamado `indices`. Se dejó
 * escrito el disparador —**un cuarto índice, o una segunda lista de excusas**— y
 * saltaron los dos: `CLAUDE-historical.md` entró en los históricos, e `INTERNAS`
 * apareció el 2026-08-25 al lado de `SIN_PUBLICAR`.
 *
 * QUÉ SE QUEDA FUERA, y es la otra mitad de la decisión: **la verificación sigue
 * en `check-indices.ts`**, con los índices de markdown, y no se ha abierto un paso
 * de CI aparte. El argumento de entonces —«para no mover la cifra de pasos de CI
 * que publican el artículo, el PRD y el README»— sí ha caducado, porque esa cifra
 * la deriva `pasosDeCI()` desde el 2026-08-25. El que queda es mejor: los dos
 * lados contestan **una sola pregunta** —«¿lo derivado cuadra con el disco?»— y
 * partir el veredicto en dos pasos daría dos rojos donde hay un problema.
 *
 *   npm run indices        escribe este inventario y los índices de markdown
 *   npm run check:indices  comprueba los dos (en CI)
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

import { ABRE, bloqueActual, CIERRA } from "./indices/bloque";

/**
 * EL ÍNDICE QUE NO INDEXA PROSA: indexa una CARPETA.
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
 *
 * LA PUBLICACIÓN TIENE TRES VALORES, NO DOS (2026-08-25). Con dos —una ruta o
 * `pendiente`— no había forma de decir «esta pieza NO se publica, y este es el
 * motivo»: `rich.tsx` iba a salir como deuda para siempre, o había que publicar
 * una sección que no enseña nada solo para que el contador quedara a cero, que es
 * el metro mandando sobre el criterio en vez de al revés. El tercer valor es
 * `interna`, y el recuento las separa: «N publicadas · N internas · N
 * pendientes». Así `pendiente` vuelve a significar UNA sola cosa: deuda.
 *
 * GRUPO Y SECCIÓN SON EJES INDEPENDIENTES, y queda dicho a propósito. El grupo
 * dice de qué capa es la pieza; la publicación, dónde se la ve funcionando. Que
 * `live-stat.tsx` sea una PRIMITIVA y se demuestre dentro de §15 «Artículo
 * largo» no es una incoherencia que haya que corregir: su espécimen vive donde
 * la pieza se usa, que es lo que hace que la demo sea real. Forzarlos a
 * concordar movería especímenes buenos a secciones donde no ilustran nada.
 */
export const PIEZAS_DIR = "components/ui";
export const INVENTARIO = "components/ui/README.md";

export type Pieza = {
  archivo: string;
  grupo: string;
  /** Ruta bajo `components/site/`, o `pendiente`, o `interna`. */
  publica: string;
  frase: string;
};

const GRUPOS = ["núcleo", "artículo", "primitiva"] as const;

/**
 * Las piezas que hoy declaran `pendiente`, con el motivo. Es la lista que hace
 * que un archivo NUEVO sin sección salga en rojo: si no está aquí y declara
 * `pendiente`, falla. Añadir una línea es un acto visible en el diff, que es
 * justo lo que no era «se me olvidó publicarla».
 *
 * EL MOTIVO ES UN DATO, NO UN COMENTARIO (2026-08-25): la lista y sus motivos
 * estaban escritos dos veces —el array, y el bloque de arriba que lo describía—,
 * que es la trampa de la regla 5 de `BRAND.md`. Ahora el motivo se DERIVA al
 * inventario, así que quien contesta el paso 1 de la «Regla de construcción» lee
 * por qué esa pieza no tiene sección sin abrir este archivo.
 *
 * ESTÁ VACÍA, y eso es el estado bueno, no un metro roto: la guarda de cero de
 * `check:indices` mira los ARCHIVOS de la carpeta, que nunca son cero. Que aquí
 * no haya nadie significa que ninguna pieza del sistema está sin documentar.
 * `stat-row.tsx` salió el 2026-08-22 (§11); `info-card`, `page-closer` y
 * `video-embed`, el 2026-08-25, ya con sección propia.
 */
export const SIN_PUBLICAR: Record<string, string> = {};

/**
 * Y las piezas que NO se publican, con el motivo. Es el tercer valor del
 * vocabulario, y lo que lo separa del de arriba es el tiempo verbal: `pendiente`
 * es deuda —se va a publicar y todavía no—, `interna` es una DECISIÓN tomada.
 * Con dos valores las dos se contaban juntas, así que una pieza que no se puede
 * publicar salía como deuda para siempre.
 *
 * La condición es la del Design System entero: la página enseña LAS PIEZAS
 * REALES como demo. Una pieza que no pinta nada no tiene demo posible, así que
 * publicarla sería escribir una sección falsa para bajar un contador.
 */
export const INTERNAS: Record<string, string> = {
  "marcas.tsx":
    "no pinta nada: envuelve los nombres propios en un atributo invisible, y " +
    "una sección que la enseñara mostraría un texto idéntico al de al lado. La " +
    "vigila `npm run check:marcas` sobre las 28 variantes",
  "rich.tsx":
    "no tiene aspecto propio que enseñar: es infraestructura de texto (D23), y " +
    "lo que de ella sí se ve —el enlace de contenido— se publica en §08",
};

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
      // Los tres valores del vocabulario, y los dos que no son una ruta LLEVAN
      // SU MOTIVO al inventario: «sin publicar» a secas no dice si es deuda o
      // criterio, que es justo la distinción que el tercer valor vino a hacer.
      const donde =
        p.publica === "pendiente"
          ? `sin publicar — ${SIN_PUBLICAR[p.archivo] ?? "sin motivo declarado"}`
          : p.publica === "interna"
            ? `interna — ${INTERNAS[p.archivo] ?? "sin motivo declarado"}`
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
  // EL BLANCO ANTES DE CADA GRUPO LO PONE QUIEN PRESENTA, NUNCA `inventario()`.
  // Esas líneas son la UNIDAD DE COMPARACIÓN de `check:indices`: metiéndole
  // cadenas vacías, `bloqueActual` las filtraría al leer y el check diría que el
  // índice no coincide consigo mismo. El blanco es presentación —CommonMark deja
  // que un encabezado corte una lista, así que renderiza igual—, y es solo que
  // pegado al último ítem del grupo anterior se lee apretado en GitHub, que desde
  // D68 es donde de verdad se navegan estos documentos.
  const conAire = lineas.flatMap((l, i) =>
    l.startsWith("### ") && i > 0 ? ["", l] : [l],
  );
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
    ...conAire,
    CIERRA,
    "",
  ];
  writeFileSync(INVENTARIO, salida.join("\n"), "utf8");
  return lineas.filter((l) => l.startsWith("- ")).length;
}

// --- Escritura ----------------------------------------------------------------

if (process.argv.includes("--escribir")) {
  console.log(`${INVENTARIO} · ${escribeInventario()} entradas`);
}
