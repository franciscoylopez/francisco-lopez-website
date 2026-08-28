/**
 * EL SELLO del modo registro: qué se escribe en `content/psi/registro.json`, y —
 * sobre todo— **cuándo NO se escribe**.
 *
 * POR QUÉ ESTÁ APARTE (2026-08-28, P50.84). Cuarto dominio de `psi.ts`, y el que
 * qlty marcaba por partida triple: seis parámetros, complejidad 29 y control
 * anidado a cinco niveles. Los tres eran el mismo síntoma —una cadena de ternarios
 * decidiendo por qué no se sella— y se van juntos: el porqué es ahora una función
 * de retornos tempranos, que además se lee en el orden en que se comprueba.
 *
 * Deja escrito lo que se acaba de medir para que el artículo lo publique en vez de
 * teclearlo (P68.495, D102). Mismo mecanismo que el sello del censo: medir necesita
 * pintar y necesita producción, así que la cifra no puede derivarse al construir;
 * lo que sí puede es no envejecer en silencio.
 */
import { writeFileSync } from "node:fs";

import { PSI_REGISTRO } from "../../lib/figures";
import type { Estrategia, Medicion } from "./medicion";
import type { Consolidada } from "./muestreo";

/** El sitio que describe el sello. Medir otro no lo cambia. */
const PRODUCCION = "https://franciscolopez.es";

/** Lo que hace falta saber para decidir si esta pasada se puede publicar. */
export interface Pasada {
  consolidadas: Consolidada[];
  fallos: { ruta: string }[];
  estrategias: readonly Estrategia[];
  totalPaginas: number;
  base: string;
  tomas: number;
}

/**
 * POR QUÉ NO SE SELLA, o `null` si sí. En retornos tempranos y en el orden en que
 * se comprueban, que es lo que antes era una cadena de seis ternarios.
 *
 * NO SELLA UNA PASADA PARCIAL, y es la mitad importante de este módulo. Un rango
 * sacado de cuatro páginas, o de un Preview, publicado como si fuera el del sitio
 * es peor que no publicar nada: se lee igual y es falso.
 *
 * Y DESDE P50.78, TAMPOCO UNA DE UNA SOLA MUESTRA. Una pasada completa medida una
 * vez es tan parcial como una pasada a medias: el min/max publica los EXTREMOS, y
 * un extremo sacado de una toma es ruido con formato de dato. El barrido del
 * 2026-08-26 iba a sellar «76-100 escritorio» porque el 76 salió de una toma que
 * al repetirla dio 98 y 99.
 */
function porQueNo(p: Pasada): string | null {
  if (p.base !== PRODUCCION) {
    return `se ha medido ${p.base} y el sello solo describe producción`;
  }
  if (p.estrategias.length !== 2) return "falta una de las dos estrategias";
  if (p.fallos.length) return `${p.fallos.length} medición(es) fallaron`;

  const esperadas = p.totalPaginas * 2;
  if (p.consolidadas.length !== esperadas) {
    return `hay ${p.consolidadas.length} mediciones y se esperaban ${esperadas}`;
  }
  if (p.tomas < 2) {
    return "una sola toma por página, y cada extremo del rango saldría de una sola muestra";
  }

  // Y da igual pedir tres tomas si la API devolvió tres veces el mismo análisis
  // cacheado: lo que se exige no son llamadas, son ANÁLISIS distintos.
  const deUna = p.consolidadas.filter((c) => c.distintas < 2);
  if (deUna.length) {
    const cuales = deUna
      .slice(0, 3)
      .map((c) => c.medida.ruta)
      .join(", ");
    return (
      `${deUna.length} par(es) se quedaron en un solo análisis distinto ` +
      `(${cuales}${deUna.length > 3 ? "…" : ""}). ` +
      "La caché de la API expira: repítelo dentro de un rato"
    );
  }

  return null;
}

export function sella(p: Pasada): void {
  const motivo = porQueNo(p);
  if (motivo) {
    console.log(`\n  Sin sellar: ${motivo}.`);
    console.log(`  ${PSI_REGISTRO} se queda como estaba.`);
    return;
  }

  const medidas: Medicion[] = p.consolidadas.map((c) => c.medida);
  const rango = (e: Estrategia) => {
    const notas = medidas.filter((m) => m.estrategia === e).map((m) => m.nota);
    return { min: Math.min(...notas), max: Math.max(...notas) };
  };

  const registro = {
    fecha: new Date().toISOString().slice(0, 10),
    paginas: p.totalPaginas,
    // Cuántas tomas hay detrás de cada extremo. Va en el sello y no solo en la
    // consola porque es lo que separa este rango del de 2026-08-24, que salió de
    // una: sin el número, los dos archivos se leen igual.
    tomas: p.tomas,
    movil: rango("mobile"),
    escritorio: rango("desktop"),
  };

  writeFileSync(PSI_REGISTRO, `${JSON.stringify(registro, null, 2)}\n`);
  console.log(
    `\n  Sellado en ${PSI_REGISTRO} — ${registro.escritorio.min}-${registro.escritorio.max} escritorio · ` +
      `${registro.movil.min}-${registro.movil.max} móvil, ${p.totalPaginas} páginas, ` +
      `mediana de ${p.tomas} tomas, ${registro.fecha}.`,
  );
  console.log("  El artículo publica esa cifra con esa fecha (D102).");
}
