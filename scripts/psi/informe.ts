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
  MAQUINA_DE_REFERENCIA,
  type Medicion,
  ms,
} from "./medicion";

/** El nombre de una estrategia, en castellano, para los mensajes. */
export const enCastellano = (e: Estrategia) =>
  e === "mobile" ? "móvil" : "escritorio";

/**
 * La velocidad del runner, y CUÁNTAS VECES más lento que la máquina de
 * referencia — que es la mitad que hace legible el número. `bi 324` no dice nada
 * a quien lo lee por primera vez; «×9,6 más lento» sí, y es la diferencia entre
 * leer una nota baja y abrir una tarea de investigación por ella (ver
 * `medicion.ts` §MAQUINA_DE_REFERENCIA).
 */
export function laMaquina(bi: number | null): string {
  if (bi === null) return "máquina: no informada";
  const veces = MAQUINA_DE_REFERENCIA / bi;
  return `máquina ${bi} (×${veces.toFixed(1)} más lenta que la de referencia)`;
}

/** Un aviso en una línea, sin dejar colgando el guion cuando no hay ahorro. */
export const enLinea = (av: Aviso) =>
  `[${av.gravedad.padEnd(7)}] ${av.titulo}${av.ahorro ? ` — ${av.ahorro}` : ""}`;

/** El informe de UNA url, con el mismo formato que desde P46.5. */
export function imprimeDetalle(m: Medicion) {
  console.log(
    `\n─── ${enCastellano(m.estrategia).toUpperCase()} ───────────────────────────────`,
  );
  console.log(`  Rendimiento: ${m.nota}/100   (medido ${m.medido})`);
  console.log(`  ${laMaquina(m.maquina)}`);
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
/**
 * EN QUÉ MÁQUINAS SE MIDIÓ LA PASADA ENTERA, que es lo que dice si un rango bajo
 * es del sitio o del día *(P72.6)*. Va después del veredicto y no antes: no
 * cambia si se sella, informa de con qué se selló.
 *
 * Y publica CUÁNTAS traen el dato, por la regla de la casa: un metro que devuelve
 * una lista vacía parece un aprobado, así que decir «0 de 84 informaron» es una
 * salida válida y «no salió nada» no lo es.
 */
function imprimeMaquinas(medidas: Medicion[]) {
  const bis = medidas
    .map((m) => m.maquina)
    .filter((b): b is number => b !== null);
  if (!bis.length) {
    console.log(
      `  Máquinas: 0 de ${medidas.length} mediciones traen benchmarkIndex.\n`,
    );
    return;
  }
  const min = Math.min(...bis);
  const max = Math.max(...bis);
  const media = Math.round(bis.reduce((a, b) => a + b, 0) / bis.length);
  console.log(
    `  Máquinas que midieron: ${min}-${max} (media ${media}) en ${bis.length} de ${medidas.length} mediciones.\n` +
      `  Referencia ${MAQUINA_DE_REFERENCIA}: la media de esta pasada es ×${(MAQUINA_DE_REFERENCIA / media).toFixed(1)} más lenta.\n`,
  );
}

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

  imprimeMaquinas(medidas);

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
