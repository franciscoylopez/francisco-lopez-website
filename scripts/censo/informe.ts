/**
 * El veredicto del pase sobre imagen, y la memoria que lo alimenta.
 *
 * ESTÁ APARTE POR LO MISMO QUE EN LOS DEMÁS GUARDIANES DE ESTE REPO: el recorrido
 * —abrir la página, desplazarse, disparar— y el veredicto son dos cosas, y la
 * segunda es la que hay que poder leer entera para saber qué se está afirmando.
 *
 * Y `vistos` es el suelo del metro: cero pares hallados NO es un aprobado, porque
 * el censo manda 16 a `sinMedir`. Si aquí salen cero, lo que falla es el detector
 * *(P72.195, 2026-09-02)*.
 */
import { type Medida } from "./tipos";

export const medidas: Medida[] = [];
export const problemas: string[] = [];

/** Lo que la pasada ha visto de verdad. Ninguno puede quedarse en cero. */
export const vistos = {
  hallados: 0,
  fotografiados: 0,
  sinFotografiar: 0,
  anclasOk: 0,
};

/**
 * Publica lo medido y decide. `corridas` es cuántas páginas × temas se han
 * recorrido de verdad, que con `--pagina=` no son las catorce.
 */
export function informe(corridas: number, filtro?: string): void {
  if (vistos.hallados === 0) {
    console.error(
      "censo:imagen — CERO pares hallados, y eso NO es un aprobado: el censo\n" +
        "  manda 16 a `sinMedir`. Si aquí salen cero, lo que falla es el detector.\n",
    );
    process.exit(1);
  }

  const ordenadas = [...medidas].sort(
    (a, b) => a.peor - a.umbralAAA - (b.peor - b.umbralAAA),
  );

  for (const m of ordenadas) {
    const nivel =
      m.peor >= m.umbralAAA ? "AAA" : m.peor >= m.umbralAA ? "AA" : "FALLA AA";
    console.log(
      `  ${nivel.padEnd(9)} ${m.peor.toFixed(2)}:1  (AAA ${m.umbralAAA})  ` +
        `${m.px}px  ${m.pagina} · ${m.tema}  ${m.ejemplo}  ← peor en ${m.donde}, píxel rgb(${m.pixel.join(",")})`,
    );
  }

  const bajoAA = medidas.filter((m) => m.peor < m.umbralAA);
  const bajoAAA = medidas.filter(
    (m) => m.peor >= m.umbralAA && m.peor < m.umbralAAA,
  );

  console.log(
    `\ncenso:imagen — ${vistos.hallados} pares hallados · ${vistos.fotografiados} medidos sobre el píxel pintado · ` +
      `${vistos.sinFotografiar} sin fotografiar\n` +
      `  ${bajoAA.length} por debajo de AA · ${bajoAAA.length} entre AA y AAA.\n` +
      `  Metro validado contra el ancla en ${vistos.anclasOk} de las ` +
      `${corridas} corridas` +
      (filtro
        ? `, PASADA PARCIAL (--pagina=${filtro}): esto no es un veredicto.`
        : "."),
  );

  for (const p of problemas) console.error(`  · ${p}`);

  if (bajoAA.length) process.exit(1);
}
