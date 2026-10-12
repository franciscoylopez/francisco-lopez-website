import { readFileSync } from "node:fs";

/**
 * Dónde está cada decisión dentro de `DECISIONS.md` — el ancla `#L…` de los
 * permalinks que publica «Cómo se ha creado esta página».
 *
 * POR QUÉ EXISTE. Cada sección del artículo cierra con la franja `ENLACE ·`, y
 * cada decisión citada es un permalink a la línea exacta de su cabecera (más
 * fiable que adivinar el anchor que GitHub genera del titular). Esa línea estaba
 * **escrita a mano en el diccionario**, que es una segunda verdad sobre un hecho
 * que ya vive en `DECISIONS.md`: la familia de D38 y D60.
 *
 * Y divergió, en silencio, como divergen las segundas verdades. El commit
 * `b1fd354` (2026-08-22) insertó diez líneas dentro de D26 —el addendum que dice
 * que la cifra A+ de securityheaders ya no era cierta— y con eso **27 de las 38
 * citas del artículo publicado pasaron a apuntar diez líneas por encima de su
 * destino**, las 24 decisiones de D27 en adelante. Nada se rompió: el enlace
 * sigue abriendo el archivo, solo que en el párrafo equivocado. Ningún check de
 * CI podía verlo, porque no había nada que comparar.
 *
 * Ahora la línea NO SE GUARDA: se deriva de la cabecera al construir. El
 * diccionario cita `{ label: "D29", path: "DECISIONS.md" }` y el ancla la pone
 * `components/site/como-se-ha-creado.tsx` al pasar las `parts` a `RepoStrip`.
 * `components/ui/article.tsx` no se entera —sigue recibiendo un `line` opcional y
 * sin saber nada de este sitio (D36)—, y la clase de deriva desaparece en vez de
 * quedar vigilada.
 *
 * SE LEE EN BUILD. Las trece páginas se prerenderizan por locale (D48), así que
 * esto corre en `next build` y nunca en petición. El módulo no se importa desde
 * ninguna isla de cliente.
 *
 * LO QUE NO CUBRE. Que la decisión citada sea la ADECUADA para lo que afirma el
 * párrafo. Eso lo ve una persona. Aquí solo se garantiza que el enlace aterriza
 * donde dice su etiqueta — y que si la etiqueta no existe, el guardián lo dice
 * (`npm run check:articulo`) en vez de publicar un permalink a ninguna parte.
 */

/** El archivo, en la misma constante que usa `scripts/indices.ts`. */
export const DECISIONES_PATH = "DECISIONS.md";

/**
 * `D29 → 854`, la línea (1-indexada) de la cabecera de cada decisión.
 *
 * Misma cabecera que indexa `scripts/indices.ts` —`## D42 · Título — fecha`—
 * pero exigiendo solo el prefijo: aquí interesa DÓNDE está la entrada, no si su
 * titular está bien formado, que es lo que ya vigila `check:indices`.
 */
export function lineasDeDecision(): Map<string, number> {
  const lineas = readFileSync(DECISIONES_PATH, "utf8").split("\n");
  const mapa = new Map<string, number>();
  lineas.forEach((linea, i) => {
    const etiqueta = /^## (D\d+)\b/.exec(linea)?.[1];
    // La primera gana: si alguna vez hubiera dos cabeceras con el mismo número,
    // el enlace apunta a la de arriba y `check:indices` es quien lo denuncia.
    if (etiqueta && !mapa.has(etiqueta)) mapa.set(etiqueta, i + 1);
  });
  return mapa;
}

/** Una etiqueta de decisión: `D1`, `D83`. Lo que NO lo es, se deja como está. */
export const ES_DECISION = /^D\d+$/;
