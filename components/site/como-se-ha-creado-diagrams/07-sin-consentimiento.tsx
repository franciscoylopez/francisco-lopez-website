import { Fragment } from "react";

import type { Locale } from "@/lib/i18n/config";

import { DosLienzos, LBL, LBL_STRONG, rlz } from "../diagrams/shared";

/** 07 · Qué sale de la página antes de un clic: nada, hasta que alguien pulsa. */
export function SinConsentimientoDiagram({ lang }: { lang: Locale }) {
  const t = {
    es: {
      ariaLabel:
        "Dos filas. Sin consentimiento y antes del clic en el vídeo, la fila de peticiones de red está vacía. Después del consentimiento y del clic, la fila muestra tres peticiones: analítica, mapa de calor y el vídeo.",
      before: "Sin consentimiento · sin clic en el vídeo",
      beforeWrap: ["Sin consentimiento ·", "sin clic en el vídeo"],
      empty: "(ninguna petición)",
      after: "Con consentimiento y clic",
      analytics: "analítica",
      heatmap: "mapa de calor",
      video: "vídeo",
    },
    en: {
      ariaLabel:
        "Two rows. Without consent and before a click on the video, the row of network requests is empty. After consent and a click, the row shows three requests: analytics, heatmap and the video.",
      before: "No consent · no click on the video",
      beforeWrap: ["No consent ·", "no click on the video"],
      empty: "(no requests)",
      after: "With consent and a click",
      analytics: "analytics",
      heatmap: "heatmap",
      video: "video",
    },
  }[lang];

  /**
   * UNA FIGURA, DOS DISPOSICIONES — el patrón de `04-stack.tsx`, que resuelve lo
   * mismo al lado (P72.19). Hasta hoy este archivo dibujaba las dos filas DOS
   * VECES, una por lienzo, y las dos copias solo se diferenciaban en coordenadas:
   * 36 líneas repetidas que Qlty marcaba como el bloque duplicado más grande de
   * `components/` (mass 179). Lo que cambia entre lienzos es la geometría, así que
   * la geometría es el parámetro y el dibujo es uno.
   *
   * LO QUE NO SE PARAMETRIZA, porque no es geometría: las tres peticiones van en
   * HILERA en el lienzo ancho y APILADAS en el estrecho. Eso no es una variante del
   * mismo reparto, sale de sus `x`/`y`, y por eso las tres cajas se declaran una a
   * una en vez de calcularse con un paso.
   *
   * LAS LÍNEAS BASE DE TEXTO SE DERIVAN, y cada forma tiene su regla: `-12` desde
   * el pie de la caja vacía, `-10` desde el de una petición. Son dos constantes y
   * no una porque los dos rectángulos tienen alturas distintas en cada lienzo y
   * este es el único par que reproduce las ocho posiciones EXACTAS que había
   * escritas — dentro de un dibujo a escala una coordenada no se redondea a lo que
   * quede bonito (BRAND.md §Tokens, excepción de ilustraciones).
   */
  type Caja = { x: number; y: number; w: number; h: number };
  type Layout = {
    /** Rótulo de la fila vacía. `partido` lo pone solo el estrecho: a 11 unidades
     *  el rótulo entero ocupa 271 de los 280 que hay. */
    antes: { y: number; partido: boolean };
    vacia: Caja;
    /** Rótulo de la fila con peticiones. */
    despues: { y: number };
    peticiones: [Caja, Caja, Caja];
  };

  const X = 10;
  const centro = (c: Caja) => c.x + c.w / 2;

  const fila = (L: Layout) => (
    <>
      <text x={X} y={L.antes.y} {...rlz(0, LBL)}>
        {L.antes.partido
          ? t.beforeWrap.map((linea, k) => (
              <tspan key={linea} x={X} dy={k === 0 ? 0 : 16}>
                {linea}
              </tspan>
            ))
          : t.before}
      </text>
      <rect
        x={L.vacia.x}
        y={L.vacia.y}
        width={L.vacia.w}
        height={L.vacia.h}
        rx="6"
        strokeDasharray="4 4"
        {...rlz(0, "fill-muted")}
      />
      <text
        x={centro(L.vacia)}
        y={L.vacia.y + L.vacia.h - 12}
        textAnchor="middle"
        {...rlz(0, LBL)}
      >
        {t.empty}
      </text>

      <text x={X} y={L.despues.y} {...rlz(1, LBL)}>
        {t.after}
      </text>
      <g>
        {L.peticiones.map((caja, i) => {
          const etiqueta = [t.analytics, t.heatmap, t.video][i];
          // `Fragment` y no un `<g>`: agrupar en el DOM añadiría un elemento que no
          // pinta nada y aun así cambiaría el HTML servido, y este refactor tiene
          // que salir byte a byte igual por `gate:html`.
          return (
            <Fragment key={etiqueta}>
              <rect
                x={caja.x}
                y={caja.y}
                width={caja.w}
                height={caja.h}
                rx="5"
                {...rlz(i + 2, "fill-primary/25")}
              />
              <text
                x={centro(caja)}
                y={caja.y + caja.h - 10}
                textAnchor="middle"
                {...rlz(i + 2, LBL_STRONG)}
              >
                {etiqueta}
              </text>
            </Fragment>
          );
        })}
      </g>
    </>
  );

  /** Ancho: las tres peticiones en hilera. */
  const ancho: Layout = {
    antes: { y: 30, partido: false },
    vacia: { x: X, y: 42, w: 540, h: 34 },
    despues: { y: 108 },
    peticiones: [
      { x: 10, y: 118, w: 170, h: 28 },
      { x: 195, y: 118, w: 170, h: 28 },
      { x: 380, y: 118, w: 170, h: 28 },
    ],
  };

  /** Estrecho: las mismas dos filas con las tres peticiones apiladas. Lo que el
   *  diagrama compara es «fila vacía» contra «fila con cosas», y eso se lee igual
   *  de bien en columna. */
  const estrecho: Layout = {
    antes: { y: 22, partido: true },
    vacia: { x: X, y: 48, w: 260, h: 34 },
    despues: { y: 114 },
    peticiones: [
      { x: 10, y: 126, w: 260, h: 30 },
      { x: 10, y: 162, w: 260, h: 30 },
      { x: 10, y: 198, w: 260, h: 30 },
    ],
  };

  return (
    <DosLienzos
      ariaLabel={t.ariaLabel}
      ancho={{ w: 560, h: 150, children: fila(ancho) }}
      estrecho={{ h: 240, children: fila(estrecho) }}
    />
  );
}
