/**
 * EL MUESTREO del modo registro: N tomas por página×estrategia, reducidas a una.
 *
 * POR QUÉ ESTÁ APARTE (2026-08-28, P50.84). Esto es justo lo que subió `psi.ts` de
 * 77 a 122 de complejidad de archivo al escribirse (P50.78), y la lección de sus
 * dos hermanas es la misma: **anidar no sirve** —qlty suma las funciones anidadas
 * al padre—, lo que parte el conteo es el MÓDULO. Y además es un dominio de
 * verdad: decidir qué nota representa a N tomas no tiene nada que ver con hablar
 * con la API ni con imprimir un informe.
 */
import type { Estrategia, Medicion } from "./medicion";

/** El nombre de una estrategia, en castellano, para los mensajes. */
const enCastellano = (e: Estrategia) =>
  e === "mobile" ? "móvil" : "escritorio";

/**
 * Cuántas veces se mide cada página×estrategia en modo registro (P50.78).
 *
 * POR QUÉ NO ES UNA. El barrido tomaba UNA muestra y publicaba el min/max, así que
 * la peor toma mandaba sobre el rango entero — y ese rango lo publica el artículo
 * (D102). Medido el mismo día contra producción y sin tocar nada entre medias:
 * `/design-system` 76 y luego 98 y 99; `/como-se-ha-creado` 81 y luego 89 y 99. El
 * barrido iba a sellar «76-100 escritorio» cuando el criterio de aceptación del
 * PRD dice «>90 en las catorce». El sitio habría publicado un número que
 * contradice su propio criterio, por ruido.
 */
export const TOMAS_POR_DEFECTO = 3;

/**
 * La mediana, no la media: el ruido de PSI es ASIMÉTRICO hacia abajo —una toma
 * mala hunde la media y no mueve la mediana—, y la media de 76, 98 y 99 da 91,
 * que no es ninguna de las tres.
 *
 * Con un número PAR de valores se queda con el bajo de los dos centrales en vez de
 * promediarlos. Es deliberado: promediar inventaría una nota que la página no ha
 * sacado nunca, y en un sello que se publica es peor pasarse de optimista.
 */
const mediana = (notas: number[]): number => {
  const orden = [...notas].sort((a, b) => a - b);
  return orden[Math.floor((orden.length - 1) / 2)]!;
};

/** Cuánto se movió un par entre tomas, en puntos. */
const dispersion = (c: Consolidada) => c.notas.at(-1)! - c.notas[0]!;

/** Las tomas de UNA página×estrategia, reducidas a la medición que las representa. */
export interface Consolidada {
  /** La corrida cuya nota es la mediana. Se guarda la MEDICIÓN, no la cifra: sus
   *  avisos y su desglose tienen que venir de la misma corrida que la nota. */
  medida: Medicion;
  /** Cuántas llamadas se hicieron. */
  tomas: number;
  /** Cuántos ANÁLISIS distintos devolvieron esas llamadas. */
  distintas: number;
  /** Las notas distintas, ordenadas, para poder enseñar la dispersión. */
  notas: number[];
}

/**
 * Reduce las N tomas de cada página×estrategia a una sola medición.
 *
 * DEDUPLICA POR EL SELLO DEL ANÁLISIS, no por el de la llamada, y es la mitad
 * importante (D108): la API devuelve resultado cacheado, y seis corridas seguidas
 * pueden ser la misma respuesta byte a byte. Una n alta sobre filas repetidas da
 * la apariencia de rigor y el veredicto contrario.
 */
export function consolida(brutas: Medicion[]): Consolidada[] {
  const grupos = new Map<string, Medicion[]>();
  for (const m of brutas) {
    const clave = `${m.ruta}|${m.estrategia}`;
    grupos.set(clave, [...(grupos.get(clave) ?? []), m]);
  }

  return [...grupos.values()].map((tomas) => {
    const unicas = [...new Map(tomas.map((m) => [m.medido, m])).values()];
    const objetivo = mediana(unicas.map((m) => m.nota));
    return {
      medida: unicas.find((m) => m.nota === objetivo)!,
      tomas: tomas.length,
      distintas: unicas.length,
      notas: unicas.map((m) => m.nota).sort((a, b) => a - b),
    };
  });
}

/**
 * AFIRMA CUÁNTO HA MUESTREADO, que es lo que separa una mediana de tres análisis
 * de una mediana de tres copias del mismo. Y enseña la dispersión, que es la
 * evidencia de por qué esto existe: si el peor par se mueve 23 puntos entre tomas,
 * sellar la peor habría sido publicar ruido.
 */
export function imprimeMuestreo(consolidadas: Consolidada[], tomas: number) {
  const llamadas = consolidadas.reduce((s, c) => s + c.tomas, 0);
  const analisis = consolidadas.reduce((s, c) => s + c.distintas, 0);
  const cacheadas = consolidadas.filter((c) => c.distintas < 2);

  console.log(
    "\n─── Qué se muestreó, y cuánto se movió ──────────────────────",
  );
  console.log(
    `  ${tomas} tomas × ${consolidadas.length} pares · ${llamadas} llamadas · ` +
      `${analisis} análisis distintos (${Math.round((analisis / llamadas) * 100)}%)`,
  );

  const dispersas = [...consolidadas]
    .filter((c) => c.notas.length > 1)
    .sort((x, y) => dispersion(y) - dispersion(x))
    .slice(0, 3);
  for (const c of dispersas) {
    console.log(
      `  ${c.medida.ruta.padEnd(28)} ${enCastellano(c.medida.estrategia).padEnd(10)} ` +
        `${c.notas.join("·")}  → mediana ${c.medida.nota} ` +
        `(${dispersion(c)} puntos de diferencia)`,
    );
  }
  if (!dispersas.length) console.log("  Ningún par se movió entre tomas.");

  if (cacheadas.length) {
    console.log(
      `\n  ${cacheadas.length} par(es) con UN SOLO análisis distinto — la API los ` +
        `devolvió cacheados:\n` +
        cacheadas
          .map(
            (c) =>
              `      ${c.medida.ruta} (${enCastellano(c.medida.estrategia)})`,
          )
          .join("\n"),
    );
  }
}
