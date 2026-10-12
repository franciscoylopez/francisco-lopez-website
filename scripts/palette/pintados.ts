/**
 * La tabla de lo que el NAVEGADOR pinta, y las dos comprobaciones que la usan.
 *
 * POR QUÉ ESTÁ APARTE (2026-08-28, P50.83). `check-palette.ts` hacía cinco cosas
 * en línea y qlty lo marcaba por complejidad total desde antes de Método II. La
 * lección de su hermana (P50.84) es que **anidar no sirve** —qlty suma las
 * funciones anidadas al padre—: lo que parte el conteo es sacar un dominio a un
 * MÓDULO. Y esto es un dominio: una tabla de referencia medida a mano en un
 * navegador, con dos preguntas que solo tienen sentido sobre ella.
 */
import { BRAND_PALETTE, oklchToHex, PALETTE } from "../../lib/design-values";

/**
 * LA TABLA: cada `oklch` con el hex que Chrome pinta de verdad.
 *
 * Medido en Chrome el 2026-08-09 con el método de `BRAND.md` §Accesibilidad
 * —píxel de un `<canvas>`, ya recortado a sRGB— y validado antes contra los dos
 * anclajes de contraste (13,79 y 15,32, exactos). Sin este paso, la conversión
 * podría ser sistemáticamente falsa y los tres controles anteriores seguirían en
 * verde: es la costumbre de validar la herramienta antes de creerse el hallazgo.
 *
 * La tolerancia es de UN paso de 8 bits por canal, y no es laxitud: hay un valor
 * —`--muted-foreground` claro— cuyo canal rojo cae en 82,50, justo en el filo del
 * redondeo. Una divergencia real está a años luz de ahí: el cian superado se
 * separaba del vigente en 6 pasos.
 */
export const PAINTED: Record<string, string> = {
  "oklch(0.9653 0.0102 81.8)": "#F7F3EC",
  "oklch(0.2657 0.0118 248.27)": "#21262B",
  "oklch(0.9855 0.0057 84.57)": "#FCFAF6",
  "oklch(0.901 0.0142 88.69)": "#E2DED4",
  "oklch(0.9316 0.0128 86.83)": "#ECE8DF",
  "oklch(0.4365 0.0064 95.19)": "#52524E",
  "oklch(0.41 0.0886 194.82)": "#005859",
  "oklch(0.2283 0.0098 248.26)": "#191D21",
  "oklch(0.3252 0.0157 248.31)": "#2E353C",
  "oklch(0.3063 0.0152 252.34)": "#2A3037",
  "oklch(0.7295 0.0116 95.22)": "#AAA8A0",
  "oklch(0.7626 0.1156 191.46)": "#3FC9C4",
  "oklch(0.7242 0.1208 194.82)": "#16BDBD",
  "oklch(0.6889 0.1581 289.96)": "#9B87F5",
  "oklch(0.8694 0.0592 192.12)": "#A7E1DE",
  "oklch(0.8151 0.0776 295.46)": "#C6B9F0",
  // Los dos valores del acento morado, que conmuta desde P37.657 (D41). Medidos
  // en Chrome con el mismo método: píxel de un `<canvas>`, ya recortado a sRGB.
  "oklch(0.78 0.16 290)": "#B7A3FF",
  "oklch(0.45 0.16 290)": "#583DA6",
};

const channels = (hex: string) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

/**
 * Las dos preguntas de la tabla, en una sola pasada:
 *
 *   3) La conversión `oklch` → hex reproduce lo que pinta el navegador.
 *   4) Y todo valor de la paleta está cubierto por esa comprobación. Si no, se
 *      podría añadir un token nuevo y su hex derivado no lo verificaría nadie —
 *      el mismo agujero, una vuelta más tarde.
 *
 * Van juntas porque la segunda es la guarda de cobertura de la primera: separarlas
 * dejaría una lista de excepciones sin quien la vigile.
 */
export function revisaConversion(): string[] {
  const problemas: string[] = [];

  for (const [css, painted] of Object.entries(PAINTED)) {
    const got = oklchToHex(css);
    const drift = Math.max(
      ...channels(got).map((v, i) => Math.abs(v - (channels(painted)[i] ?? 0))),
    );
    if (drift > 1) {
      problemas.push(
        `conversión: ${css}\n    navegador: ${painted}\n    derivado:  ${got}`,
      );
    }
  }

  for (const source of [PALETTE.light, PALETTE.dark, BRAND_PALETTE]) {
    for (const value of Object.values(source)) {
      if (!(value in PAINTED)) {
        problemas.push(
          `conversión: ${value} no está medido en el navegador — añádelo a PAINTED`,
        );
      }
    }
  }

  return problemas;
}
