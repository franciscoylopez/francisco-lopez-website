/**
 * LA PRESENTACIÓN: cómo se lee un informe de PageSpeed. Nada de aquí llama a la
 * API ni decide nada; recibe mediciones y las escribe.
 *
 * POR QUÉ ESTÁ APARTE (2026-08-28, P50.84). Tercer dominio de `psi.ts`, y el que
 * más bulto hacía: entre el detalle de una url, el agregado de avisos y el
 * resumen con su guarda de cero, la mitad del archivo era formato. Misma lección
 * que en sus hermanas: lo que parte el conteo de qlty es el MÓDULO, no anidar.
 */
import {
  type Aviso,
  type Estrategia,
  type Fallo,
  type Medicion,
  ms,
} from "./medicion";

/** El nombre de una estrategia, en castellano, para los mensajes. */
export const enCastellano = (e: Estrategia) =>
  e === "mobile" ? "móvil" : "escritorio";

/** Un aviso en una línea, sin dejar colgando el guion cuando no hay ahorro. */
export const enLinea = (av: Aviso) =>
  `[${av.gravedad.padEnd(7)}] ${av.titulo}${av.ahorro ? ` — ${av.ahorro}` : ""}`;

/** El informe de UNA url, con el mismo formato que desde P46.5. */
export function imprimeDetalle(m: Medicion) {
  console.log(
    `\n─── ${enCastellano(m.estrategia).toUpperCase()} ───────────────────────────────`,
  );
  console.log(`  Rendimiento: ${m.nota}/100   (medido ${m.medido})`);
  for (const { etiqueta, valor } of m.metricas) {
    console.log(`  ${etiqueta.padEnd(12)} ${valor}`);
  }

  if (m.fases) {
    const total = m.fases.reduce(
      (s, f) => s + (f.duration ?? f.timing ?? 0),
      0,
    );
    console.log("  Desglose del LCP:");
    for (const f of m.fases) {
      const t = f.duration ?? f.timing ?? 0;
      const pct = total ? Math.round((t / total) * 100) : 0;
      console.log(
        `    ${(f.label ?? f.phase ?? "").padEnd(24)} ${ms(t).padStart(9)}   ${String(pct).padStart(3)}%`,
      );
    }
  } else {
    console.log(
      "  Desglose del LCP: NO DISPONIBLE — ¿cambió otra vez el id de la auditoría?",
    );
  }

  console.log(
    m.avisos.length
      ? `  Avisos que no pasan (${m.avisos.length}):\n` +
          m.avisos.map((av) => `    · ${enLinea(av)}`).join("\n")
      : "  Sin avisos: todas las auditorías de rendimiento pasan.",
  );
}

/**
 * EL AGREGADO ES EL ENTREGABLE: un aviso en doce páginas se arregla una vez en la
 * capa; el mismo aviso en una es pulido de esa página. Sin esta tabla hay que leer
 * catorce informes y hacer la cuenta a ojo, que es como se acaba tratando como
 * puntual algo que era transversal.
 */
export function imprimeAgregado(medidas: Medicion[], totalPaginas: number) {
  const porAviso = new Map<
    string,
    { titulo: string; paginas: Set<string>; rojo: boolean }
  >();
  for (const m of medidas) {
    for (const av of m.avisos) {
      const entrada = porAviso.get(av.id) ?? {
        titulo: av.titulo,
        paginas: new Set<string>(),
        rojo: false,
      };
      entrada.paginas.add(m.ruta);
      entrada.rojo ||= av.gravedad === "rojo";
      porAviso.set(av.id, entrada);
    }
  }

  console.log(
    "\n─── Qué aviso se repite, y en cuántas páginas ───────────────",
  );
  if (porAviso.size === 0) {
    console.log("  Ninguno: todas las auditorías de rendimiento pasan.");
    return;
  }
  const filas = [...porAviso.values()].sort(
    (x, y) =>
      y.paginas.size - x.paginas.size ||
      Number(y.rojo) - Number(x.rojo) ||
      x.titulo.localeCompare(y.titulo, "es"),
  );
  for (const f of filas) {
    console.log(
      `  ${`${f.paginas.size}/${totalPaginas}`.padStart(6)} páginas · ` +
        `[${(f.rojo ? "rojo" : "naranja").padEnd(7)}] ${f.titulo}`,
    );
  }
}

/**
 * AFIRMA CUÁNTO HA MIRADO, que es la regla de este repo para cualquier metro: una
 * tabla vacía puede ser un aprobado o una pasada que no midió nada, y desde fuera
 * se leen igual (D38/D57/D60/D63).
 */
export function imprimeResumen(
  medidas: Medicion[],
  fallos: Fallo[],
  estrategias: readonly Estrategia[],
  totalPaginas: number,
  tomas = 1,
) {
  const llamadas = totalPaginas * estrategias.length;
  const resumen = estrategias.map((estrategia) => {
    const suyas = medidas.filter((m) => m.estrategia === estrategia);
    if (!suyas.length) return `${enCastellano(estrategia)}: sin medir`;
    const peor = suyas.reduce((p, m) => (m.nota < p.nota ? m : p));
    const mejor = suyas.reduce((p, m) => (m.nota > p.nota ? m : p));
    return `${enCastellano(estrategia)} ${peor.nota}-${mejor.nota} (peor: ${peor.ruta})`;
  });

  console.log(
    `\npsi ${fallos.length ? "✗" : "✓"} — ${medidas.length}/${llamadas} pares medidos ` +
      `(${totalPaginas} páginas × ${estrategias.length} estrategia(s)` +
      `${tomas > 1 ? `, mediana de ${tomas} tomas` : ""}), ` +
      `${fallos.length} llamada(s) fallida(s) · ${resumen.join(" · ")}\n`,
  );

  if (!fallos.length) return;
  for (const f of fallos) {
    console.error(`  ✗ ${f.ruta} (${enCastellano(f.estrategia)}): ${f.error}`);
  }
  console.error(
    "\n  Una pasada incompleta NO es una pasada limpia: repite las que fallaron\n" +
      "  antes de sacar conclusiones de la tabla de arriba.\n",
  );
  process.exitCode = 1;
}
