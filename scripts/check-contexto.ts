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
 * Y POR QUÉ EL TECHO NO ES EL OBJETIVO. El objetivo declarado son 12.000
 * palabras; hoy son ~15.500 y el techo está en 16.000. Un gate que nace en rojo
 * se acaba subiendo hasta que no significa nada, así que este nace en verde y
 * actúa de trinquete: impide crecer y deja ver cuánto falta para el objetivo.
 * Al bajar de 12.000, BAJAR EL TECHO — está para apretarse, no para vivir suelto.
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
 */
const TECHO = 13_500;

/** A dónde se quiere llegar. No falla; solo se publica la distancia. */
const OBJETIVO = 12_000;

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
