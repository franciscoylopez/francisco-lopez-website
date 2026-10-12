/**
 * El `sizes` de las capturas del artículo, probado contra la geometría real.
 *
 * `panelSizes` declara, tramo a tramo, el ancho al que se va a pintar una imagen
 * dentro de `DiagramPanel`. Si esa declaración se separa de la geometría de
 * verdad, el fallo es MUDO: el navegador sigue eligiendo un candidato, solo que
 * el equivocado — y ese es literalmente el bug que abrió P50.94, donde no había
 * `sizes` en absoluto y las dos capturas bajaban 1920w para pintarse a 826.
 *
 * Así que aquí se reproduce la geometría (los tokens de `globals.css` y las
 * fracciones de `DiagramPanel`), se recorren todos los anchos de viewport y se
 * exige que el candidato de `deviceSizes` que elige el ancho DECLARADO sea el
 * mismo que elegiría el ancho REAL. Es lo que hace que este bloque no caduque en
 * silencio el día que alguien toque `--prose-w`, `--page-x` o el 70% del panel.
 */
import { describe, expect, it } from "vitest";

import { panelSizes } from "@/components/ui/article";

/** `images.deviceSizes` + `images.imageSizes` de `next.config.ts`, que es de
 *  donde next/image saca los candidatos cuando hay `sizes`. */
const CANDIDATOS = [
  32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840,
];

const clamp = (lo: number, v: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

/* ── La geometría de verdad, leída de globals.css y de DiagramPanel ── */
const PAGE_X = (vw: number) => clamp(20, 0.05 * vw, 40); // clamp(1.25rem,5vw,2.5rem)
const PADDING = (vw: number) => clamp(16, 0.025 * vw, 24); // clamp(1rem,2.5vw,1.5rem)
const CONTAINER = 1360;
const PROSE_W = 1248; // 78rem
/** Ancho de la columna de prosa. */
const columna = (vw: number) =>
  Math.min(Math.min(CONTAINER, vw) - 2 * PAGE_X(vw), PROSE_W);
/** Ancho pintado de la imagen, para una fracción de columna `f`. Por debajo de
 *  `sm` el panel es `w-full` pase lo que pase, así que ahí `f` no interviene. */
const anchoReal = (f: number, vw: number) =>
  (vw < 640 ? 1 : f) * columna(vw) - 2 * PADDING(vw);

/* ── Y el otro lado: resolver el `sizes` declarado a un ancho ── */
/** Evalúa la cadena de `sizes` como lo haría el navegador: primer tramo cuya
 *  media query casa, y dentro `NNvw` o `calc(NNvw - NNpx)`. */
function anchoDeclarado(sizes: string, vw: number): number {
  for (const tramo of sizes.split(", ")) {
    const mq = tramo.match(/^\(min-width: (\d+)px\) (.+)$/);
    const valor = mq?.[2] ?? tramo;
    if (mq && vw < Number(mq[1])) continue;
    const px = valor.match(/^(\d+(?:\.\d+)?)px$/);
    if (px) return Number(px[1]);
    const vwSolo = valor.match(/^(\d+(?:\.\d+)?)vw$/);
    if (vwSolo) return (Number(vwSolo[1]) / 100) * vw;
    const calc = valor.match(/^calc\((\d+(?:\.\d+)?)vw - (\d+(?:\.\d+)?)px\)$/);
    if (calc) return (Number(calc[1]) / 100) * vw - Number(calc[2]);
    throw new Error(`tramo de sizes que este test no sabe leer: ${valor}`);
  }
  throw new Error(`ningún tramo casó a ${vw}px`);
}

/** El candidato que elige el navegador: el menor que cubre lo que necesita. */
const candidato = (ancho: number) =>
  CANDIDATOS.find((c) => c >= ancho) ?? CANDIDATOS[CANDIDATOS.length - 1];

const SIDES: [string, number][] = [
  ["flotado (left/right)", 0.5],
  ["centrado", 0.7],
  ["a columna completa", 1],
];
const ANCHOS = Array.from({ length: 2241 }, (_, i) => 320 + i);
const DPRS = [1, 2, 3];

describe("panelSizes declara el ancho que el panel pinta de verdad", () => {
  for (const [nombre, f] of SIDES) {
    it(`${nombre}: mismo candidato que el ancho real en todo el rango`, () => {
      const sizes = panelSizes(f);
      const discrepancias: string[] = [];
      for (const vw of ANCHOS) {
        for (const dpr of DPRS) {
          const real = candidato(anchoReal(f, vw) * dpr);
          const decl = candidato(anchoDeclarado(sizes, vw) * dpr);
          if (real !== decl)
            discrepancias.push(`vw=${vw} dpr=${dpr}: ${decl}w ≠ ${real}w`);
        }
      }
      expect(
        discrepancias.slice(0, 10),
        `${discrepancias.length} de ${ANCHOS.length * DPRS.length}`,
      ).toEqual([]);
    });

    it(`${nombre}: nunca declara MENOS de lo que pinta (eso sirve borroso)`, () => {
      const sizes = panelSizes(f);
      const cortos = ANCHOS.filter(
        (vw) => anchoDeclarado(sizes, vw) < anchoReal(f, vw) - 0.5,
      );
      expect(cortos.slice(0, 10)).toEqual([]);
    });
  }

  it("el tramo ancho es constante: por encima de 1328 manda --prose-w", () => {
    // Si esto deja de ser cierto, el `826px` del primer tramo es una mentira
    // fija y el barrido de arriba dejaría de cazarlo por el otro lado.
    expect(anchoReal(0.7, 1328)).toBeCloseTo(anchoReal(0.7, 2560), 5);
  });
});
