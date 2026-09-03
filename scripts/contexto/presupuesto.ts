/**
 * Lo que comparten las cuatro mitades de `check:contexto`: cómo se cuenta una
 * palabra, y cómo un techo sale de su historial en vez de estar escrito a mano.
 */

/* ─────────────────────────────────────────────────────────────────────────────
 * MOVER UN TECHO TIENE QUE COSTAR ALGO (2026-08-28, P50.72 · D139).
 *
 * Los tres techos de este archivo se habían movido SIETE veces en nueve días, en
 * las dos direcciones, y el margen nunca pasó de 442 ni bajó de 5. La medición que
 * lo abrió es la que duele: el sprint «Home» retiró 651 palabras de verdad —la
 * primera reducción real desde el 22 de agosto— y el margen subió de 246 a 253,
 * porque el techo bajó 400 en el mismo commit. **Retirar 651 compró 7.**
 *
 * Un trinquete cuyo trinquete se mueve es un termómetro que se repinta. Es familia
 * propia en el catálogo de `method-review` —«el umbral que persigue al dato»— y se
 * distingue de «la cifra apuntada que caduca» POR EL REMEDIO: aquella envejece
 * porque nadie la toca, esta se actualiza *demasiado bien*.
 *
 * EL REMEDIO, en dos piezas que solo funcionan juntas:
 *
 * 1. **El techo se DERIVA de su historial**, que es un dato y no un comentario. No
 *    se puede mover sin añadir una entrada, y una entrada exige `motivo`: lo pide
 *    el tipo, así que no hay forma de subir un número en silencio. Y el historial
 *    deja de estar escrito dos veces —prosa arriba, valor abajo—, que es como una
 *    de las dos mitades acaba diciendo otra cosa.
 * 2. **Se cuentan los movimientos del ciclo en curso** y se publican en cada
 *    corrida: **verde 0 · ámbar 1** —el trinquete apretando, que es su trabajo— ·
 *    **rojo ≥ 2**, que ya no es apretar sino perseguir al dato.
 *
 * LO QUE NO PUEDE VER. Si el objetivo persigue al dato en vez del techo, esto no lo
 * mira: el objetivo no falla, solo tira, y un objetivo que se relaja se nota en que
 * la distancia no baja. Se vigila lo que muerde.
 * ───────────────────────────────────────────────────────────────────────────── */

/** Un movimiento de techo. `motivo` es obligatorio a propósito: es el coste. */
export type Movimiento = { fecha: string; valor: number; motivo: string };

/**
 * Desde cuándo se cuentan los movimientos. **Se actualiza al ABRIR una etapa**, que
 * es lo que hace de «ciclo» una unidad comprobable en vez de una intuición. Hoy:
 * apertura del sprint «Distribución».
 *
 * «Agentes» cerró con **1 de 3 techos movidos** —el de documentos, para bajar la tabla
 * de gates a `GATES.md`—, contra 0 en los dos anteriores. Uno es el trinquete
 * apretando; el segundo ya no.
 *
 * LO QUE ESTE CICLO ESTRENA, y por eso se anota aquí: `CLAUDE.md` gana la regla de la
 * **retirada en lote al abrir**, que es la receta que el noveno `method-review` dejó sin
 * construir. Su primera aplicación es esta apertura, y sale **a medias, dicho a
 * propósito**:
 *
 * · **`General`: retirado.** 20 → 18, al comprometer dos tareas en el sprint. Es la
 *   regla de movimiento del tablero haciendo de desagüe, que es justo lo que se pedía.
 * · **Documentos: NO retirado, y no por olvido.** Se buscó el duplicado que la regla
 *   manda buscar y **no lo hay**: el candidato obvio —los 9 puntos del checklist de
 *   accesibilidad, que el propio documento llama «los mismos que publica el Design
 *   System»— resultó ser el original y no la copia; la página del sitio los espeja a
 *   ellos. Son reglas operativas con valores (anillo de 2px, 44×44, `tabindex="-1"`).
 *
 * Y ESO ES EL HALLAZGO DEL CICLO, escrito por adelantado para el `method-review` que lo
 * cierre: **si no queda duplicado que retirar, la próxima retirada ya no es un traslado
 * — es decidir qué deja de ser regla.** Es un acto distinto y más caro, y el margen de
 * 17 palabras dice que toca pronto.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * CICLO «HIGIENE», abierto el 2026-09-02. La retirada SÍ se hizo, y esta vez el
 * duplicado apareció donde el ciclo anterior no lo buscó: **en el propio bloque que
 * escribió la regla**. Las 105 palabras de «ABRIR EMPIEZA RETIRANDO» duplicaban su
 * porqué y su medida con `CLAUDE-historical.md`, al que ya apuntaban; se dejó la regla
 * y se retiró la justificación. Con eso cupieron **dos reglas nuevas** —lo que el
 * cierre aprende va al histórico, y `/prototype` dispara ante cualquier pieza visual y
 * no solo un «componente»— y `CLAUDE.md` salió en **−4 palabras netas**.
 *
 * LA LECCIÓN, para el `method-review` que cierre este ciclo: el ciclo anterior buscó
 * duplicado y concluyó que no lo había mirando **el contenido viejo**. No miró lo que
 * él mismo acababa de escribir. Un cierre que documenta lo que aprendió es el sitio
 * más probable del próximo duplicado, no el menos.
 */
export const CICLO_ABIERTO = "2026-09-02";

/** El techo vigente es el último movimiento, nunca un número escrito aparte. */
export function vigente(historial: Movimiento[]): number {
  const ultimo = historial.at(-1);
  if (!ultimo) throw new Error("Un techo sin historial no se puede derivar.");
  return ultimo.valor;
}

/** Los de este ciclo. El de apertura cuenta: mover el techo el día que se abre la
 *  etapa es exactamente el reflejo que esto vigila. */
export function movimientosDelCiclo(historial: Movimiento[]): Movimiento[] {
  return historial.filter((m) => m.fecha >= CICLO_ABIERTO);
}

/** Palabras «de verdad»: sin bloques de código, que no son prosa que haya que leer. */
export function palabras(texto: string): number {
  const sinCodigo = texto.replace(/```[\s\S]*?```/g, " ");
  return sinCodigo.split(/\s+/).filter(Boolean).length;
}
