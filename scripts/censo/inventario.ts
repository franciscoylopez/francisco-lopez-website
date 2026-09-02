/**
 * DE QUÉ CONJUNTO HABLA EL CENSO — el inventario, no el total.
 *
 * EL HECHO QUE LO ESCRIBIÓ (P72.15, 2026-09-02). D127 dejó anotado el 2026-08-27
 * que «tras el arreglo el censo pasó de 408 a 414 pares». Al correrlo al día
 * siguiente, **sobre el mismo contenido**, dio **391**. La atribución costó dos
 * builds y descartó las dos hipótesis obvias: ninguno de los tres commits de la
 * tanda lo causaba, y dentro de una misma sesión el número era estable.
 *
 * POR QUÉ NO ES COSMÉTICO. El censo sostiene la afirmación publicada de
 * `PRD-Live` §5 —«cero pares bajo AAA en las catorce × 2 temas»—. Si el conjunto
 * que mide varía un 6 % entre sesiones sin que el sitio cambie, el veredicto es
 * sobre un conjunto que no sabemos cuál es. **Un par que hoy no está en la lista
 * no está aprobado: está sin mirar.** Es la familia de D38, D57, D60 y D63.
 *
 * LA CAUSA, y por eso este archivo viene con un arreglo al lado. El diálogo de
 * consentimiento aporta pares y **su estado dependía del `localStorage` del
 * navegador que conducía la pasada**: si en esa sesión alguien ya había aceptado,
 * el diálogo no se pintaba y sus pares desaparecían de las catorce páginas a la
 * vez. El censo ahora lo DECIDE en vez de heredarlo (`censo.ts`: se limpia el
 * almacenamiento y se recarga antes de medir), así que el diálogo entra siempre.
 *
 * QUÉ HACE ESTE MÓDULO, que es la otra mitad: guarda la lista de claves de cada
 * corrida y la compara con la anterior. Dos corridas del mismo contenido tienen
 * que dar el mismo conjunto; si no, el diff dice **qué par entró o salió**, que
 * es lo que el 2026-08-27 no se pudo decir.
 *
 * Y LA ASIMETRÍA DEL VEREDICTO. Un par que APARECE es cobertura nueva y puede
 * venir de un cambio de contenido legítimo: se informa. Un par que DESAPARECE con
 * la huella intacta es el metro viendo menos, que es el modo de fallo de la casa:
 * eso sí suspende. Un guardián que da falsas alarmas es un guardián que se
 * ignora, así que solo salta en la dirección peligrosa.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";

export const INVENTARIO_PATH = "scripts/censo/inventario.json";

export interface Corrida {
  pagina: string;
  tema: string;
  claves: string[];
}

export interface Inventario {
  fecha: string;
  /** La huella de tokens/superficies/animaciones cuando se tomó. */
  huella: string;
  total: number;
  corridas: Corrida[];
}

export function leeInventario(): Inventario | null {
  if (!existsSync(INVENTARIO_PATH)) return null;
  return JSON.parse(readFileSync(INVENTARIO_PATH, "utf8")) as Inventario;
}

export function escribeInventario(inv: Inventario): void {
  writeFileSync(INVENTARIO_PATH, `${JSON.stringify(inv, null, 2)}\n`);
}

export interface Diferencia {
  corrida: string;
  entraron: string[];
  salieron: string[];
}

/** Qué cambió entre dos inventarios, corrida a corrida. */
export function compara(antes: Inventario, ahora: Inventario): Diferencia[] {
  const clave = (c: Corrida) => `${c.pagina} · ${c.tema}`;
  const previas = new Map(
    antes.corridas.map((c) => [clave(c), new Set(c.claves)]),
  );

  const diffs: Diferencia[] = [];
  for (const c of ahora.corridas) {
    const previa = previas.get(clave(c));
    if (!previa) continue;
    const actual = new Set(c.claves);
    const entraron = [...actual].filter((k) => !previa.has(k));
    const salieron = [...previa].filter((k) => !actual.has(k));
    if (entraron.length || salieron.length) {
      diffs.push({ corrida: clave(c), entraron, salieron });
    }
  }
  return diffs;
}
