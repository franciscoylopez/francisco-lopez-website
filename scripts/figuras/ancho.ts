/**
 * Acotar el peor caso — la única parte de `check:figuras` con criterio, y por eso
 * está sola.
 *
 * - Un lienzo detrás de `contents @max-[N]:hidden` es el ANCHO de un par: solo
 *   se dibuja cuando el contenedor pasa de N, así que su peor caso es `N` —o el
 *   tope, si el tope es menor.
 * - Un lienzo detrás de `hidden @max-[N]:contents` es el ESTRECHO: se dibuja de
 *   N para abajo, sin suelo, así que su peor caso es el hueco más estrecho del
 *   sitio, `ANCHO_MINIMO`.
 * - Un lienzo suelto, sin pareja, puede caer en cualquier hueco: mismo trato que
 *   el estrecho.
 */
import { px } from "./rotulos";

/**
 * El ancho, en píxeles, del hueco más estrecho donde el sitio dibuja una figura:
 * el contenido del panel de un diagrama a 360.
 *
 *     360 − 42 (padding de página) − 2 (borde del panel) − 32 (padding del panel) = 284
 *
 * Medido en el navegador además de calculado, que no es lo mismo (P68.59): a 360
 * el `getBoundingClientRect()` del panel da 318 y el de su contenido, 284.
 *
 * SI ESTA CIFRA SE QUEDA VIEJA, el gate afloja en silencio — es su único punto
 * ciego. Por eso el informe la publica en cada corrida junto a los px que
 * predice: comparar contra un navegador a 360 es entonces mirar dos números.
 */
export const ANCHO_MINIMO = 284;

/**
 * El ancho mínimo en px que un ancestro le imponga al lienzo, si lo hay. Cubre
 * tanto `min-w-[46rem]` puesto sobre el propio SVG como la forma que usa el
 * artefacto, `[&>svg]:min-w-[46rem]` en su envoltorio.
 */
function sueloPorDesplazamiento(svg: Element): number | null {
  for (let n: Element | null = svg; n; n = n.parentElement) {
    const clases = n.getAttribute("class") ?? "";
    const rem = clases.match(/min-w-\[([\d.]+)rem\]/);
    if (rem?.[1]) return Math.round(Number(rem[1]) * 16);
    const enPx = clases.match(/min-w-\[(\d+)px\]/);
    if (enPx?.[1]) return Number(enPx[1]);
  }
  return null;
}

/**
 * El ancho pintado más estrecho al que este lienzo puede llegar a dibujarse.
 * Devuelve también de dónde sale, porque un informe que da una cifra sin decir
 * de qué regla viene no se puede auditar.
 */
export function peorAncho(svg: Element): {
  ancho: number;
  motivo: string;
  seDesplaza: boolean;
} {
  const tope = px(svg.getAttribute("class") ?? "", /max-w-\[(\d+)px\]/);
  const clasesPadre = svg.parentElement?.getAttribute("class") ?? "";
  const umbralAncho = px(clasesPadre, /@max-\[(\d+)px\]:hidden/);

  // UN LIENZO QUE SE DESPLAZA NO SE ENCOGE. Si un ancestro le fija un ancho
  // mínimo —`min-w-[46rem]` dentro de un `overflow-x-auto`, que es lo que hace
  // el artefacto de Emendu—, su ancho pintado no depende del hueco: es ese
  // mínimo. Modelarlo importa porque si no se juzgaría por el hueco más
  // estrecho del sitio y saldría un número peor que el real.
  const suelo = sueloPorDesplazamiento(svg);
  if (suelo !== null) {
    return {
      ancho: suelo,
      motivo: `mínimo de ${suelo}px, se desplaza`,
      seDesplaza: true,
    };
  }

  if (umbralAncho !== null) {
    // Lienzo ANCHO: solo se dibuja por encima del umbral.
    const ancho = tope === null ? umbralAncho : Math.min(umbralAncho, tope);
    return {
      ancho,
      motivo:
        tope !== null && tope < umbralAncho
          ? `tope ${tope}px`
          : `umbral ${umbralAncho}px`,
      seDesplaza: false,
    };
  }

  // Lienzo ESTRECHO (o suelto): puede caer en el hueco más angosto del sitio.
  const ancho = tope === null ? ANCHO_MINIMO : Math.min(ANCHO_MINIMO, tope);
  return {
    ancho,
    motivo: tope !== null && tope < ANCHO_MINIMO ? `tope ${tope}px` : "a 360",
    seDesplaza: false,
  };
}
