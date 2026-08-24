/**
 * Las reglas del tablero, sin nada de Notion dentro — `tests/tablero.test.ts`.
 *
 * POR QUÉ ESTÁ PARTIDO EN DOS. El tablero es la última fuente de verdad del
 * proyecto sin guardián (D38, D59, D60 y D72 quitaron las otras), y encima es
 * donde vive el orden en que se hace todo. Pero leerlo necesita el MCP de Notion,
 * que en un runner headless puede no estar autenticado, así que el comando que lo
 * lee corre FUERA de CI, como `censo` y `psi`.
 *
 * Eso dejaría las reglas sin red, que es justo lo que este archivo evita: aquí no
 * hay red ni credenciales, solo una función pura sobre una lista de tareas. Las
 * prueba `npm test` en CI con casos buenos y malos, y `scripts/check-tablero.ts`
 * les da de comer el volcado de verdad. La E/S fuera; el criterio, vigilado.
 *
 * LO QUE NO PUEDE VER, y conviene saberlo antes de creerse un verde: el
 * incumplimiento que abrió esta tarea —ejecutar P64.5 la séptima, después de
 * P68— no está en el tablero, está en el orden de los commits. Esto comprueba
 * que los números SEAN un orden total coherente, que es su condición previa, no
 * que alguien lo haya seguido.
 */

/** Una fila del tablero, con lo poco que hace falta para juzgarla. */
export type Tarea = {
  nombre: string;
  prioridad: number | null;
  etapa: string | null;
  area: string | null;
  estado: string;
  url?: string;
};

export type Hallazgo = {
  /** La regla que lo encuentra, para que el informe se lea sin abrir el código. */
  regla:
    | "prioridad-duplicada"
    | "sin-prioridad"
    | "sin-area"
    | "estado-fuera-del-sprint"
    | "orden-entre-sprints";
  mensaje: string;
  tareas: string[];
};

/**
 * Los tres estados que `CLAUDE.md` reserva al sprint activo. «Sin empezar» es
 * abierta pero no en ejecución, y es donde vive todo lo demás.
 */
export const EN_EJECUCION = ["To-Do", "En progreso", "Blocked"];

/** Abiertas = las que todavía cuentan para el orden. Listo/Archivado/Descartada, no. */
export const ABIERTAS = [...EN_EJECUCION, "Sin empezar"];

/**
 * El carril de contenido corre EN PARALELO y por delante del sprint de build, para
 * que un sprint no abra bloqueado por un texto que solo escribe Francisco. Así que
 * una tarea de `Contenido` en ejecución fuera del sprint activo NO es un
 * incumplimiento: es la regla funcionando. Sin esta excepción, el guardián saldría
 * rojo justo sobre lo que el tablero protege.
 */
const CARRIL_PARALELO = "Contenido";

/**
 * Cuál es el sprint activo. No se declara en ningún sitio —eso sería otra lista
 * que puede diferir—: se deriva de dónde están las tareas en ejecución, sin contar
 * el carril de contenido. Si hay empate, gana la de menor prioridad, que es el
 * criterio de `CLAUDE.md` («la etapa en curso es el sprint de menor Prioridad con
 * tareas abiertas»).
 */
export function sprintActivo(tareas: Tarea[]): string | null {
  const candidatas = tareas.filter(
    (t) =>
      EN_EJECUCION.includes(t.estado) && t.area !== CARRIL_PARALELO && t.etapa,
  );
  if (candidatas.length === 0) return null;

  const porEtapa = new Map<string, { n: number; min: number }>();
  for (const t of candidatas) {
    const etapa = t.etapa as string;
    const prev = porEtapa.get(etapa) ?? { n: 0, min: Infinity };
    porEtapa.set(etapa, {
      n: prev.n + 1,
      min: Math.min(prev.min, t.prioridad ?? Infinity),
    });
  }

  const ganadora = [...porEtapa.entries()].sort(
    (a, b) => b[1].n - a[1].n || a[1].min - b[1].min,
  )[0];
  return ganadora ? ganadora[0] : null;
}

/** `P68.655 — nombre` recortado, que es como se lee un hallazgo de un vistazo. */
function etiqueta(t: Tarea): string {
  const p = t.prioridad === null ? "sin prioridad" : `P${t.prioridad}`;
  return `${p} — ${t.nombre.length > 72 ? `${t.nombre.slice(0, 69)}…` : t.nombre}`;
}

/**
 * Las cuatro reglas, sobre las tareas ABIERTAS. Devuelve hallazgos; no imprime ni
 * sale con código, que es lo que permite probarla.
 */
export function revisarTablero(todas: Tarea[]): Hallazgo[] {
  const abiertas = todas.filter((t) => ABIERTAS.includes(t.estado));
  const hallazgos: Hallazgo[] = [];
  const activo = sprintActivo(abiertas);

  // 1 · Prioridades únicas. Un número repetido no es un empate: es que el orden
  // dejó de ser un orden. Pasó con 69,93 y se detectó a mano.
  const porPrioridad = new Map<number, Tarea[]>();
  for (const t of abiertas) {
    if (t.prioridad === null) continue;
    porPrioridad.set(t.prioridad, [
      ...(porPrioridad.get(t.prioridad) ?? []),
      t,
    ]);
  }
  for (const [p, grupo] of [...porPrioridad.entries()].sort(
    (a, b) => a[0] - b[0],
  )) {
    if (grupo.length > 1) {
      hallazgos.push({
        regla: "prioridad-duplicada",
        mensaje: `${grupo.length} tareas abiertas comparten la prioridad ${p}.`,
        tareas: grupo.map(etiqueta),
      });
    }
  }

  // 2 · Ninguna abierta sin `Área`, ni sin `Prioridad` — que es peor, porque una
  // tarea sin número no está en ninguna parte del orden.
  const sinPrioridad = abiertas.filter((t) => t.prioridad === null);
  if (sinPrioridad.length > 0) {
    hallazgos.push({
      regla: "sin-prioridad",
      mensaje: `${sinPrioridad.length} tarea(s) abiertas sin Prioridad: no están en el orden.`,
      tareas: sinPrioridad.map(etiqueta),
    });
  }
  const sinArea = abiertas.filter((t) => !t.area);
  if (sinArea.length > 0) {
    hallazgos.push({
      regla: "sin-area",
      mensaje: `${sinArea.length} tarea(s) abiertas sin Área.`,
      tareas: sinArea.map(etiqueta),
    });
  }

  // 3 · Los tres estados de ejecución son del sprint activo, más el carril de
  // contenido. Es regla escrita en `CLAUDE.md` y no la miraba nadie.
  if (activo) {
    const fuera = abiertas.filter(
      (t) =>
        EN_EJECUCION.includes(t.estado) &&
        t.etapa !== activo &&
        t.area !== CARRIL_PARALELO,
    );
    if (fuera.length > 0) {
      hallazgos.push({
        regla: "estado-fuera-del-sprint",
        mensaje: `${fuera.length} tarea(s) en To-Do/En progreso/Blocked fuera de «${activo}», y no son del carril de contenido.`,
        tareas: fuera.map((t) => `${etiqueta(t)}  [${t.etapa ?? "sin etapa"}]`),
      });
    }

    // 4 · Coherencia sprint ↔ orden. Solo se compara contra otras etapas que
    // TAMBIÉN tienen tareas en ejecución: un bloque es un backlog temático, no
    // una cola, así que su numeración puede entrelazarse con la del sprint sin
    // que eso signifique nada. Entre dos sprints abiertos a la vez, sí.
    const etapasEnEjecucion = new Set(
      abiertas
        .filter(
          (t) =>
            EN_EJECUCION.includes(t.estado) && t.etapa && t.etapa !== activo,
        )
        .map((t) => t.etapa as string),
    );
    const tope = Math.max(
      ...abiertas
        .filter((t) => t.etapa === activo && t.prioridad !== null)
        .map((t) => t.prioridad as number),
      -Infinity,
    );
    const adelantadas = abiertas.filter(
      (t) =>
        t.etapa !== null &&
        etapasEnEjecucion.has(t.etapa) &&
        t.prioridad !== null &&
        t.prioridad < tope,
    );
    if (adelantadas.length > 0) {
      hallazgos.push({
        regla: "orden-entre-sprints",
        mensaje: `${adelantadas.length} tarea(s) de otro sprint abierto van por delante del final de «${activo}» (P${tope}).`,
        tareas: adelantadas.map((t) => `${etiqueta(t)}  [${t.etapa}]`),
      });
    }
  }

  return hallazgos;
}
