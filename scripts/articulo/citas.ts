/**
 * Comprobaciones 1 y 2 de `check:articulo` — las citas resuelven, y ninguna
 * guarda su línea.
 *
 *   1. Toda decisión citada (`D29`) existe en `DECISIONS.md`, y todo archivo
 *      citado sigue en disco. Sin esto, la franja `ENLACE ·` publica permalinks
 *      a ninguna parte.
 *   2. La línea no ha vuelto al diccionario. Es la regresión de la capa 1: el
 *      ancla se DERIVA de la cabecera; volver a escribirla a mano reintroduce la
 *      segunda verdad que ya desincronizó 27 de 38 citas.
 */
import { existsSync } from "node:fs";

import { ES_DECISION, lineasDeDecision } from "../../lib/decisions";
import { DICCIONARIOS } from "./diccionarios";

type Cita = { label: string; path?: string; line?: number; external?: string };

/** Recoge toda cita del diccionario, viva donde viva dentro del árbol. */
function citas(nodo: unknown, acc: Cita[] = []): Cita[] {
  if (Array.isArray(nodo)) {
    for (const hijo of nodo) citas(hijo, acc);
    return acc;
  }
  if (nodo && typeof nodo === "object") {
    const o = nodo as Record<string, unknown>;
    if (typeof o.label === "string" && (o.path !== undefined || o.external))
      acc.push(o as Cita);
    for (const k of Object.keys(o)) citas(o[k], acc);
  }
  return acc;
}

/** Lo que se le pide a UNA cita. Aparte porque es donde vive el criterio. */
function revisaUnaCita(
  cita: Cita,
  ruta: string,
  lineas: ReturnType<typeof lineasDeDecision>,
): string[] {
  if (cita.external) return [];
  const destino = cita.path;
  if (!destino) return [];

  const problemas: string[] = [];

  if (!existsSync(destino))
    problemas.push(
      `${ruta}: la cita «${cita.label}» apunta a \`${destino}\`, que ya no existe en el repo.`,
    );

  if (ES_DECISION.test(cita.label) && !lineas.has(cita.label))
    problemas.push(
      `${ruta}: se cita ${cita.label}, que no tiene cabecera en DECISIONS.md.`,
    );

  if (cita.line !== undefined)
    problemas.push(
      `${ruta}: la cita «${cita.label}» vuelve a guardar \`line\` a mano. El ancla la ` +
        `deriva \`lib/decisions.ts\` de la cabecera real — una línea escrita es una ` +
        `segunda verdad, y ya desincronizó 27 de 38 citas (el addendum de D26, 2026-08-22).`,
    );

  return problemas;
}

/** Los problemas, y cuántas citas se han mirado para encontrarlos. */
export function revisaCitas(): { problemas: string[]; vistas: number } {
  const problemas: string[] = [];
  const lineas = lineasDeDecision();
  let vistas = 0;

  for (const { dict, ruta } of DICCIONARIOS) {
    const todas = citas(dict);
    vistas += todas.length;
    for (const cita of todas)
      problemas.push(...revisaUnaCita(cita, ruta, lineas));
  }

  return { problemas, vistas };
}
