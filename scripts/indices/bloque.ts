/**
 * El bloque delimitado que envuelve TODO índice derivado de este repo.
 *
 * POR QUÉ ESTÁ APARTE (2026-08-28, P50.82). Lo escribió `indices.ts` para los
 * índices de markdown y lo reusaba el inventario de `components/ui/`. Al partir
 * los dos dominios en dos archivos, esto es lo único que de verdad comparten: el
 * par de marcas, cómo se lee lo que hay hoy entre ellas y cómo se sustituye sin
 * tocar el resto del archivo. Copiarlo habría dejado dos formatos de bloque que
 * divergen el día que uno cambie de marca.
 */
import { readFileSync, writeFileSync } from "node:fs";

export const ABRE =
  "<!-- ÍNDICE · lo genera `npm run indices`; no se edita a mano -->";
export const CIERRA = "<!-- FIN ÍNDICE -->";

/** Las líneas de índice que hoy tiene un archivo en su cabecera, si tiene alguno. */
export function bloqueActual(archivo: string, esEntrada: RegExp): string[] {
  const lineas = readFileSync(archivo, "utf8").split("\n");
  const ini = lineas.indexOf(ABRE);
  const fin = lineas.indexOf(CIERRA);
  if (ini < 0 || fin < 0 || fin < ini) return [];
  return lineas.slice(ini + 1, fin).filter((l) => esEntrada.test(l));
}

/**
 * Dónde se inserta: **después del último bloque de cita de la cabecera** y antes
 * de la primera sección. Los archivos abren con un `>` que explica qué son y a
 * dónde ir si buscas otra cosa; ese texto va primero porque orienta, y el índice
 * detrás porque enruta.
 */
export function escribeIndice(archivo: string, entradas: string[]): number {
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
