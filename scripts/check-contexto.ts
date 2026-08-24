/**
 * ¿Cabe el contexto de arranque? — `npm run check:contexto`, en CI.
 *
 * POR QUÉ EXISTE. D28 escribió el régimen de contexto —solo las reglas activas se
 * `@`-importan; la historia y el detalle van a demanda— y no le puso NI CIFRA NI
 * GUARDIÁN. Así que se cumplió exactamente cuatro días. Medido el 2026-08-19:
 *
 *     09-ago   9.275 palabras   ← el día del corte de BRAND.md (P37.685)
 *     10-ago  12.116
 *     16-ago  13.521
 *     18-ago  18.098
 *     19-ago  19.805            ← +113% en diez días
 *
 * El corte de `BRAND.md` compró 2.400 palabras y el crecimiento se las comió en
 * cuatro días. Es «una regla que hay que recordar es una regla que se incumple»
 * aplicada a la regla que gobierna las reglas.
 *
 * POR QUÉ UN TECHO Y NO UN AVISO. Porque un aviso es lo que ya había: la regla
 * estaba escrita en `CLAUDE.md` y en `DECISIONS.md`, y las dos veces en prosa. Lo
 * que convierte una intención en una restricción es que falle el build.
 *
 * Y POR QUÉ EL TECHO NO ES EL OBJETIVO. Un gate que nace en rojo se acaba
 * subiendo hasta que no significa nada, así que este nació en verde y actúa de
 * trinquete: impide crecer y deja ver cuánto falta para el objetivo. **Se aprieta
 * conforme se compacta, nunca se afloja.**
 *
 * EL OBJETIVO SE ALCANZÓ EL 2026-08-22 (11.976), así que a partir de aquí deja de
 * ser una distancia y pasa a ser una línea que hay que sostener. El techo queda
 * por encima con holgura de trabajo —una sesión normal escribe y borra párrafos—.
 *
 * Y ESA HOLGURA ES LA MAGNITUD QUE HAY QUE SOSTENER, no el techo (2026-08-24,
 * P68.675). Aquí estaba escrito que el próximo apretón era a 12.000, y NO se hizo:
 * con 11.957 medidos habría dejado 43 palabras de margen, que es justo el estado
 * que originó esta tarea. El 2026-08-23 quedaron 17, y el 2026-08-24 una regla
 * nueva de tres líneas no cupo y hubo que retirar antes para pagarla. Un techo que
 * no deja escribir no produce compactación: produce el reflejo de subirlo, que es
 * lo único que este gate no puede permitirse. Se aprieta el techo hasta dejar unas
 * 240 palabras —cinco o seis reglas— y se baja el objetivo, que es quien lleva la
 * ambición.
 */
import { readFileSync } from "node:fs";

/** Lo que se `@`-importa en cada arranque de sesión, vía `CLAUDE.md`. */
const IMPORTADOS = ["CLAUDE.md", "AGENTS.md", "BRAND.md", "PRD-Live.md"];

/**
 * Falla por encima de aquí. **Se aprieta conforme se compacta, nunca se afloja.**
 *
 * Historial del techo, que es la prueba de que el trinquete funciona:
 *   16.000  al crearlo (2026-08-19), con 15.466 medidos tras compactar PRD-Live
 *   13.500  el mismo día, al derivar el índice de decisiones (3.610 → 924)
 *   12.500  el 2026-08-22, al BAJAR ese índice a la cabecera de `DECISIONS.md`
 *           (13.494 → 12.224). D88: era el único componente del presupuesto que
 *           crecía por construcción, y contra eso un techo no defiende.
 *   12.400  el mismo día, tras la pasada de retirada sobre `BRAND.md` (12.224 →
 *           11.976, la primera vez que el arranque cabe en el objetivo)
 *   12.200  el 2026-08-24 (12.397 → 11.957), retirando historia fechada y tres
 *           duplicaciones: el inventario de verificación estaba escrito en
 *           `CLAUDE.md`, en la DoD y en `PRD-Live`, y las dos «excepciones vivas»
 *           de `BRAND.md` repetían justificación y condición de salida palabra
 *           por palabra. Ninguna regla se retiró; solo su historia y sus copias.
 */
const TECHO = 12_200;

/**
 * A dónde se quiere llegar. No falla; solo se publica la distancia. Necesita número
 * nuevo cada vez que se alcanza, porque un objetivo ya cumplido deja de tirar.
 *   12.000  alcanzado el 2026-08-22 y sostenido desde entonces
 *   11.800  desde el 2026-08-24
 */
const OBJETIVO = 11_800;

/** Palabras «de verdad»: sin bloques de código, que no son prosa que haya que leer. */
function palabras(texto: string): number {
  const sinCodigo = texto.replace(/```[\s\S]*?```/g, " ");
  return sinCodigo.split(/\s+/).filter(Boolean).length;
}

const medidas = IMPORTADOS.map((archivo) => ({
  archivo,
  palabras: palabras(readFileSync(archivo, "utf8")),
}));

const total = medidas.reduce((n, m) => n + m.palabras, 0);

if (medidas.length === 0 || total === 0) {
  console.error(
    "\ncheck:contexto — NO HA MIRADO NADA. Con cero entradas este check aprobaría\n" +
      "siempre, así que falla a propósito. ¿Se ha renombrado alguno de los\n" +
      `@-importados? Esperaba: ${IMPORTADOS.join(", ")}\n`,
  );
  process.exit(1);
}

// El metro afirma cuánto ha mirado (y no al revés).
console.log(`check:contexto — ${medidas.length} archivos @-importados:`);
for (const m of [...medidas].sort((a, b) => b.palabras - a.palabras)) {
  console.log(`  ${String(m.palabras).padStart(6)}  ${m.archivo}`);
}
console.log(
  `  ${String(total).padStart(6)}  TOTAL · techo ${TECHO} · objetivo ${OBJETIVO}`,
);

if (total > TECHO) {
  console.error(
    `\ncheck:contexto — EL CONTEXTO DE ARRANQUE NO CABE: ${total} palabras, ` +
      `techo ${TECHO}.\n\n` +
      "Esto es coste fijo de CADA sesión, antes de escribir nada. Lo que toca no es\n" +
      "subir el techo: es la operación que a este método le falta por defecto,\n" +
      "RETIRAR. Tres preguntas, en este orden:\n\n" +
      "  1. ¿Hay párrafos FECHADOS en `PRD-Live.md` o `BRAND.md`? Son historia y su\n" +
      "     sitio es `PRD-Historical.md` / `BRAND-historical.md`, que van a demanda.\n" +
      "  2. ¿Algo de lo último escrito SUSTITUYE a un párrafo que ya estaba, en vez\n" +
      "     de haberse añadido al lado?\n" +
      "  3. ¿Alguna regla está escrita en DOS de estos archivos? La misma decisión en\n" +
      "     dos sitios acaba diciendo dos cosas (BRAND.md §Cómo se escribe una regla).\n",
  );
  process.exit(1);
}

if (total > OBJETIVO) {
  console.log(
    `  ⚠ ${total - OBJETIVO} palabras por encima del objetivo de ${OBJETIVO}. ` +
      "No falla, pero es la deuda que queda.",
  );
} else {
  console.log("✓ El contexto de arranque cabe en el objetivo. Baja el techo.");
}
