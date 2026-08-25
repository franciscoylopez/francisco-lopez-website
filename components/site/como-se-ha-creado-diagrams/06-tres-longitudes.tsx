import type { Locale } from "@/lib/i18n/config";

import { DosLienzos, LBL, LBL_STRONG, rlz } from "../diagrams/shared";

/**
 * 06 · Un hecho, tres longitudes, tres destinos. Elegido con `/prototype`
 * (2026-08-24) entre tres direcciones —abanico radial, regleta comparativa y
 * esta, el flujo con bifurcación tardía—: es la única que enseña QUÉ es cada
 * destino en vez de rotularlo, y el párrafo que tiene al lado ya explica lo
 * que las otras dos ilustraban.
 *
 * LOS RELLENOS DE CIAN NO DELIMITAN NADA, lo hace el borde. Misma regla que el
 * diagrama de los dos lectores: un `fill-primary` translúcido no llega al 3:1
 * que WCAG 1.4.11 pide a un relleno que transmite información, así que la caja
 * del origen se lee por su `stroke-primary` y el velo es solo énfasis.
 *
 * Y LAS BARRITAS DE DENTRO DE CADA ARTEFACTO SON DIBUJO, no información: son
 * texto simulado a escala, del mismo modo que el navegador de mentira del
 * Brand Kit. Por eso van en `fill-muted` sin borde y no se miden.
 *
 * LOS SUBRÓTULOS SUBEN DE 9 A 11 (P68.59). Eran el texto más pequeño de la
 * figura y no llegaban al suelo de 11px pintados en ningún viewport: a 1536
 * daban 9,0. Caben sin tocar el dibujo — el más largo, «el caso entero», ocupa
 * 92 unidades de las 136 de su artefacto.
 */
export function TresLongitudesDiagram({ lang }: { lang: Locale }) {
  const t = {
    es: {
      ariaLabel:
        "Un flujo vertical. Arriba, una caja con el hecho escrito una sola vez, en español e inglés. De ella baja una línea que se bifurca en tres carriles. Cada carril termina en un artefacto dibujado a escala: una ventana de navegador rotulada «Trayectoria», que recibe la frase; una hoja rotulada «CV en PDF», que recibe el bullet; y una página larga rotulada «Deep-dive», que recibe el caso entero. Al pie, una línea indica que un guardián comprueba que ninguna cifra falte en una de las tres.",
      hecho: "TheTool · cofundador",
      once: "una sola vez · ES + EN",
      web: "Trayectoria",
      webLen: "la frase",
      pdf: "CV en PDF",
      pdfLen: "el bullet",
      deep: "Deep-dive",
      deepLen: "el caso entero",
      guard: "un guardián comprueba que ninguna cifra falte en una de las tres",
      guardWrap: [
        "un guardián comprueba que ninguna",
        "cifra falte en una de las tres",
      ],
    },
    en: {
      ariaLabel:
        "A vertical flow. At the top, a box with the fact written once, in Spanish and English. A line drops from it and splits into three lanes. Each lane ends in an artifact drawn to scale: a browser window labelled “Track record”, which gets the short line; a sheet labelled “CV in PDF”, which gets the bullet; and a long page labelled “Deep-dive”, which gets the whole case. At the foot, a line notes that a guardian checks no figure is missing from any of the three.",
      hecho: "TheTool · co-founder",
      once: "written once · ES + EN",
      web: "Track record",
      webLen: "the short line",
      pdf: "CV in PDF",
      pdfLen: "the bullet",
      deep: "Deep-dive",
      deepLen: "the whole case",
      guard: "a guardian checks no figure is missing from any of the three",
      guardWrap: [
        "a guardian checks no figure is",
        "missing from any of the three",
      ],
    },
  }[lang];

  /** Las tres barritas de texto simulado de cada artefacto, a su escala. */
  const lineas = (x: number, y: number, anchos: number[], i: number) =>
    anchos.map((w, k) => (
      <rect
        key={k}
        x={x}
        y={y + k * 10}
        width={w}
        height={k === 0 ? 5 : 4}
        rx={k === 0 ? 2.5 : 2}
        {...rlz(i, k === 0 ? "fill-primary" : "fill-muted")}
      />
    ));

  const ancho = (
    <>
      <rect
        x="196"
        y="12"
        width="208"
        height="50"
        rx="8"
        strokeWidth="1.5"
        {...rlz(0, "fill-primary/12 stroke-primary")}
      />
      <text x="300" y="30" textAnchor="middle" {...rlz(0, LBL_STRONG)}>
        {t.hecho}
      </text>
      <text x="300" y="50" textAnchor="middle" {...rlz(0, LBL)}>
        {t.once}
      </text>

      <path
        d="M300 62 L300 94 M116 94 L484 94 M116 94 L116 126 M300 94 L300 126 M484 94 L484 126"
        fill="none"
        strokeWidth="1.25"
        {...rlz(1, "stroke-primary")}
      />

      {/* Navegador: la frase corta. */}
      <rect
        x="48"
        y="126"
        width="136"
        height="86"
        rx="7"
        strokeWidth="1"
        {...rlz(2, "fill-card stroke-border")}
      />
      <path
        d="M48 146 L184 146"
        fill="none"
        strokeWidth="1"
        {...rlz(2, "stroke-border")}
      />
      <circle cx="60" cy="136" r="2.5" {...rlz(2, "fill-muted-foreground")} />
      <circle cx="70" cy="136" r="2.5" {...rlz(2, "fill-muted-foreground")} />
      {lineas(60, 160, [86, 112, 96], 2)}
      <text x="116" y="234" textAnchor="middle" {...rlz(2, LBL_STRONG)}>
        {t.web}
      </text>
      <text x="116" y="252" textAnchor="middle" {...rlz(2, LBL)}>
        {t.webLen}
      </text>

      {/* Hoja: el bullet. */}
      <rect
        x="248"
        y="126"
        width="104"
        height="86"
        rx="4"
        strokeWidth="1"
        {...rlz(3, "fill-card stroke-border")}
      />
      {lineas(262, 142, [58, 76, 76], 3)}
      {lineas(262, 180, [64, 70], 3)}
      <text x="300" y="234" textAnchor="middle" {...rlz(3, LBL_STRONG)}>
        {t.pdf}
      </text>
      <text x="300" y="252" textAnchor="middle" {...rlz(3, LBL)}>
        {t.pdfLen}
      </text>

      {/* Página larga: el caso entero. */}
      <rect
        x="416"
        y="126"
        width="136"
        height="86"
        rx="7"
        strokeWidth="1"
        {...rlz(4, "fill-card stroke-border")}
      />
      {lineas(430, 140, [72, 108, 108], 4)}
      {lineas(430, 174, [96, 108, 82], 4)}
      <text x="484" y="234" textAnchor="middle" {...rlz(4, LBL_STRONG)}>
        {t.deep}
      </text>
      <text x="484" y="252" textAnchor="middle" {...rlz(4, LBL)}>
        {t.deepLen}
      </text>

      <path
        d="M48 274 L552 274"
        fill="none"
        strokeWidth="1"
        strokeDasharray="3 3"
        {...rlz(5, "stroke-border")}
      />
      <text x="300" y="292" textAnchor="middle" {...rlz(5, LBL)}>
        {t.guard}
      </text>
    </>
  );

  /** El mismo flujo girado: la bifurcación en tres carriles pasa a ser un
   * espinazo vertical con tres derivaciones, y cada artefacto se lee con su
   * rótulo al lado en vez de debajo. La línea del guardián se parte en dos
   * porque a 11 unidades ocupa 422 y el lienzo tiene 280. */
  const estrecho = (
    <>
      <rect
        x="36"
        y="12"
        width="208"
        height="52"
        rx="8"
        strokeWidth="1.5"
        {...rlz(0, "fill-primary/12 stroke-primary")}
      />
      <text x="140" y="34" textAnchor="middle" {...rlz(0, LBL_STRONG)}>
        {t.hecho}
      </text>
      <text x="140" y="53" textAnchor="middle" {...rlz(0, LBL)}>
        {t.once}
      </text>

      <path
        d="M140 64 L140 84 M28 84 L140 84 M28 84 L28 398 M28 138 L52 138 M28 268 L52 268 M28 398 L52 398"
        fill="none"
        strokeWidth="1.25"
        {...rlz(1, "stroke-primary")}
      />

      {/* Navegador: la frase corta. */}
      <rect
        x="52"
        y="96"
        width="104"
        height="84"
        rx="7"
        strokeWidth="1"
        {...rlz(2, "fill-card stroke-border")}
      />
      <path
        d="M52 116 L156 116"
        fill="none"
        strokeWidth="1"
        {...rlz(2, "stroke-border")}
      />
      <circle cx="63" cy="106" r="2.5" {...rlz(2, "fill-muted-foreground")} />
      <circle cx="73" cy="106" r="2.5" {...rlz(2, "fill-muted-foreground")} />
      {lineas(64, 130, [66, 86, 74], 2)}
      <text x="168" y="134" {...rlz(2, LBL_STRONG)}>
        {t.web}
      </text>
      <text x="168" y="152" {...rlz(2, LBL)}>
        {t.webLen}
      </text>

      {/* Hoja: el bullet. */}
      <rect
        x="52"
        y="226"
        width="104"
        height="84"
        rx="4"
        strokeWidth="1"
        {...rlz(3, "fill-card stroke-border")}
      />
      {lineas(64, 242, [46, 60, 60], 3)}
      {lineas(64, 276, [50, 56], 3)}
      <text x="168" y="264" {...rlz(3, LBL_STRONG)}>
        {t.pdf}
      </text>
      <text x="168" y="282" {...rlz(3, LBL)}>
        {t.pdfLen}
      </text>

      {/* Página larga: el caso entero. */}
      <rect
        x="52"
        y="356"
        width="104"
        height="84"
        rx="7"
        strokeWidth="1"
        {...rlz(4, "fill-card stroke-border")}
      />
      {lineas(64, 370, [56, 84, 84], 4)}
      {lineas(64, 404, [74, 84, 64], 4)}
      <text x="168" y="394" {...rlz(4, LBL_STRONG)}>
        {t.deep}
      </text>
      <text x="168" y="412" {...rlz(4, LBL)}>
        {t.deepLen}
      </text>

      <path
        d="M20 476 L260 476"
        fill="none"
        strokeWidth="1"
        strokeDasharray="3 3"
        {...rlz(5, "stroke-border")}
      />
      <text x="140" y="500" textAnchor="middle" {...rlz(5, LBL)}>
        {t.guardWrap.map((linea, k) => (
          <tspan key={linea} x="140" dy={k === 0 ? 0 : 17}>
            {linea}
          </tspan>
        ))}
      </text>
    </>
  );

  return (
    <DosLienzos
      ariaLabel={t.ariaLabel}
      ancho={{ w: 600, h: 300, children: ancho }}
      estrecho={{ h: 546, children: estrecho }}
    />
  );
}
