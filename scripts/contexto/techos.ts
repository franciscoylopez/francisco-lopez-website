import { CICLO_ABIERTO, movimientosDelCiclo } from "./presupuesto";
import { HISTORIAL_TECHO } from "./documentos";
import { HISTORIAL_TECHO_SKILL, HISTORIAL_TECHO_SUMA } from "./skills";
import { HISTORIAL_TECHO_VERIFICACION } from "./verificacion";

/* ─────────────────────────────────────────────────────────────────────────────
 * TERCERA MITAD: ¿SE HA MOVIDO ALGÚN TECHO EN ESTE CICLO? (2026-08-28, P50.72).
 *
 * Las dos de arriba vigilan el DATO contra el umbral. Esta vigila el UMBRAL, que
 * es lo que llevaba nueve días sin nadie apuntado: siete valores en las dos
 * direcciones, margen entre 5 y 442, y una retirada real de 651 palabras que
 * compró 7. Se publica siempre, y se cuenta por techo: dos movimientos del MISMO
 * en un ciclo es la firma de perseguir al dato, y dos de techos distintos puede
 * ser simplemente un ciclo que compactó en dos frentes.
 * ───────────────────────────────────────────────────────────────────────────── */

export function revisaTechos(): void {
  const TECHOS = [
    { nombre: "documentos", historial: HISTORIAL_TECHO },
    { nombre: "skill (entrada)", historial: HISTORIAL_TECHO_SKILL },
    { nombre: "skills (suma)", historial: HISTORIAL_TECHO_SUMA },
    // El cuarto desde el 2026-09-05 (P72.53). Entra aquí y no se vigila a sí
    // mismo por la razón de siempre: un techo cuyo movimiento solo mira su propio
    // archivo es un termómetro que se repinta.
    {
      nombre: "verificación ÷ producto",
      historial: HISTORIAL_TECHO_VERIFICACION,
    },
  ];

  const movidos = TECHOS.map((t) => ({
    ...t,
    ciclo: movimientosDelCiclo(t.historial),
  }));
  const totalMovimientos = movidos.reduce((n, t) => n + t.ciclo.length, 0);

  console.log(
    `\ncheck:contexto — techos movidos desde que abrió el ciclo (${CICLO_ABIERTO}): ` +
      `${totalMovimientos} de ${TECHOS.length} vigilados`,
  );
  for (const t of movidos) {
    for (const m of t.ciclo) {
      console.log(`  ${m.fecha}  ${t.nombre} → ${m.valor} · ${m.motivo}`);
    }
  }

  const perseguidos = movidos.filter((t) => t.ciclo.length >= 2);
  if (perseguidos.length > 0) {
    console.error(
      `\ncheck:contexto — UN TECHO PERSIGUIENDO AL DATO: ` +
        perseguidos
          .map((t) => `«${t.nombre}» se ha movido ${t.ciclo.length} veces`)
          .join(", ") +
        ` en este ciclo.\n\n` +
        "Un trinquete cuyo trinquete se mueve es un termómetro que se repinta. La\n" +
        "medición que abrió esta regla: retirar 651 palabras de verdad subió el margen\n" +
        "de 246 a 253, porque el techo bajó 400 en el mismo commit.\n\n" +
        "Lo que toca NO es un tercer movimiento con mejor motivo: es dejar el techo\n" +
        "quieto un ciclo entero y que el margen suba por trabajo del dato. Si la\n" +
        "conclusión razonada es que estaba mal calibrado desde el principio, vale —\n" +
        "pero entonces se escribe el porqué UNA vez y se deja de tocar.\n",
    );
    process.exit(1);
  }

  console.log(
    totalMovimientos === 0
      ? "✓ Ningún techo se ha movido en este ciclo: lo que suba el margen lo sube el dato."
      : "  ⚠ Un movimiento por techo es el trinquete apretando. El segundo ya no.",
  );
}
