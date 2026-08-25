import type { Locale } from "@/lib/i18n/config";

import { DosLienzos, LBL, rlz } from "./shared";

/** 08 · Las cinco capas de verificación, cada una cubriendo más que la
 * anterior — el diagrama validado en el prototipo de P59, con tokens reales.
 *
 * LOS ANCHOS SE CORRIGIERON EL 2026-08-25 (P68.594) porque el dibujo decía lo
 * contrario que su propio texto alternativo, que es el peor sitio donde puede
 * fallar un diagrama: quien lo ve y quien lo oye recibían cosas distintas.
 *
 * El alt afirma dos cosas —que la barra de la persona es LA MÁS LARGA y que es
 * LA ÚNICA que entra en la zona final—, y las dos eran falsas. `lector de
 * pantalla` medía 448 contra los 420 de la persona, así que rompía la escalera
 * justo en el escalón que sostiene la tesis del capítulo; y acababa en 578,
 * o sea que no solo cruzaba la frontera de la zona (466): se salía de ella por
 * la derecha, 28 unidades más allá de donde el rectángulo punteado termina.
 *
 * SE ARREGLA EL DIBUJO Y NO EL ALT, y esa es la decisión: el alt describe lo que
 * el capítulo quiere decir —solo una persona encuentra lo que no incumple
 * ninguna regla—, así que lo que estaba mal era el dibujo. Un lector de pantalla
 * no encuentra nada por sí solo; lo encuentra quien lo maneja, y ese es el
 * escalón siguiente.
 *
 * La escalera nueva es 150 · 220 · 285 · 325 y luego 420: el salto más grande
 * (95) es el último, que es exactamente lo que el diagrama afirma. El lector
 * acaba en 455, once unidades antes de la frontera, así que se acerca sin
 * cruzarla. */
export function CapasVerificacionDiagram({ lang }: { lang: Locale }) {
  const t = {
    es: {
      ariaLabel:
        "Cinco barras horizontales de longitud creciente: compilador, escáner automático, censo de contraste, lector de pantalla y persona. Solo la barra de la persona, la más larga, entra en la zona final marcada como «lo que ninguna regla prohíbe».",
      capas: [
        { label: "compilador", w: 150 },
        { label: "escáner automático", w: 220 },
        { label: "censo de contraste", w: 285 },
        { label: "lector de pantalla", w: 325 },
      ],
      persona: "persona",
      coveredLine1: "lo que cubre",
      coveredLine2: "una regla escrita",
      uncoveredLine1: "lo que ninguna",
      uncoveredLine2: "regla prohíbe",
    },
    en: {
      ariaLabel:
        "Five horizontal bars of increasing length: compiler, automated scanner, contrast census, screen reader and person. Only the person's bar, the longest, reaches into the final zone marked “what no rule forbids”.",
      capas: [
        { label: "compiler", w: 150 },
        { label: "automated scanner", w: 220 },
        { label: "contrast census", w: 285 },
        { label: "screen reader", w: 325 },
      ],
      persona: "person",
      coveredLine1: "what a written",
      coveredLine2: "rule covers",
      uncoveredLine1: "what no rule",
      uncoveredLine2: "forbids",
    },
  }[lang];

  const ancho = (
    <svg
      viewBox="0 0 620 300"
      role="img"
      aria-label={t.ariaLabel}
      /* 620 y no 600 (P68.59): el tope era más estrecho que el lienzo, así que
         el rótulo se quedaba en 10,6 incluso a pantalla completa. */
      className="h-auto w-full max-w-[620px]"
    >
      <line
        x1="130"
        y1="10"
        x2="130"
        y2="220"
        strokeDasharray="3 3"
        {...rlz(5, "stroke-border")}
      />
      <line
        x1="466"
        y1="10"
        x2="466"
        y2="220"
        strokeDasharray="3 3"
        {...rlz(5, "stroke-border")}
      />
      {/* Mismo ajuste que la zona "scroll completo" de arriba: fill-brand-purple-soft/50
          + stroke-brand-purple daban 1,30:1 y 2,81:1 en tema claro (design-review
          P60) — el cian lleva la información también aquí. */}
      <rect
        x="466"
        y="10"
        width="84"
        height="210"
        rx="4"
        strokeDasharray="4 3"
        {...rlz(5, "fill-primary/15 stroke-primary")}
      />
      {t.capas.map((c, i) => (
        <g key={c.label}>
          <text x="118" y={10 + i * 42 + 26} textAnchor="end" {...rlz(i, LBL)}>
            {c.label}
          </text>
          <rect
            x="130"
            y={10 + i * 42 + 8}
            width={c.w}
            height="24"
            rx="4"
            {...rlz(i, "fill-muted")}
          />
        </g>
      ))}
      <text x="118" y="196" textAnchor="end" {...rlz(4, LBL)}>
        {t.persona}
      </text>
      <rect
        x="130"
        y="178"
        width="420"
        height="24"
        rx="4"
        {...rlz(4, "fill-foreground")}
      />
      {/* Las dos etiquetas de cierre, en DOS líneas y separadas por el ancho
          de las zonas que describen (0-466 y 466-550): a una sola línea
          colisionaban a mitad de camino (11 caracteres de margen, con texto
          de 27-28). */}
      <text x="230" y="250" textAnchor="middle" {...rlz(5, LBL)}>
        <tspan x="230" dy="0">
          {t.coveredLine1}
        </tspan>
        <tspan x="230" dy="16">
          {t.coveredLine2}
        </tspan>
      </text>
      <text x="560" y="250" textAnchor="middle" {...rlz(5, LBL)}>
        <tspan x="560" dy="0">
          {t.uncoveredLine1}
        </tspan>
        <tspan x="560" dy="16">
          {t.uncoveredLine2}
        </tspan>
      </text>
    </svg>
  );

  /** Las mismas cinco barras, con el rótulo ENCIMA en vez de en un canalón a
   * la izquierda. El canalón era lo que obligaba a un lienzo de 620: reservaba
   * 118 unidades para un texto que necesita 119. Arriba, cada rótulo dispone
   * del ancho entero, y las barras conservan su proporción exacta, que es lo
   * único que este diagrama afirma.
   *
   * EL DIVISOR ES LA BARRA DE LA PERSONA, no la más larga de las herramientas
   * (P68.594). Antes era `×260/448`, o sea el ancho del lector de pantalla, que
   * era entonces la barra más larga del dibujo y no debería haberlo sido nunca.
   * Al corregirlo, ese 448 dejó de existir y el divisor se habría quedado
   * apuntando a una cifra que ya no es de nadie. La persona es la referencia
   * correcta porque su extremo está ANCLADO en los dos lienzos: acaba justo en
   * el borde derecho de la zona (550 en el ancho, 254 en el estrecho), así que
   * normalizar por ella hace que los dos dibujos digan lo mismo por
   * construcción. */
  const escala = (w: number) => Math.round((w * 244) / 420);
  const estrecho = (
    <svg
      viewBox="0 0 280 312"
      role="img"
      aria-label={t.ariaLabel}
      className="h-auto w-full max-w-[300px]"
    >
      <line
        x1="10"
        y1="8"
        x2="10"
        y2="254"
        strokeDasharray="3 3"
        {...rlz(5, "stroke-border")}
      />
      <line
        x1="205"
        y1="8"
        x2="205"
        y2="254"
        strokeDasharray="3 3"
        {...rlz(5, "stroke-border")}
      />
      <rect
        x="205"
        y="8"
        width="49"
        height="246"
        rx="4"
        strokeDasharray="4 3"
        {...rlz(5, "fill-primary/15 stroke-primary")}
      />
      {t.capas.map((c, i) => (
        <g key={c.label}>
          <text x="10" y={14 + i * 48} {...rlz(i, LBL)}>
            {c.label}
          </text>
          <rect
            x="10"
            y={14 + i * 48 + 6}
            width={escala(c.w)}
            height="22"
            rx="4"
            {...rlz(i, "fill-muted")}
          />
        </g>
      ))}
      <text x="10" y="206" {...rlz(4, LBL)}>
        {t.persona}
      </text>
      <rect
        x="10"
        y="212"
        width={escala(420)}
        height="22"
        rx="4"
        {...rlz(4, "fill-foreground")}
      />
      <text x="10" y="282" {...rlz(5, LBL)}>
        <tspan x="10" dy="0">
          {t.coveredLine1}
        </tspan>
        <tspan x="10" dy="16">
          {t.coveredLine2}
        </tspan>
      </text>
      <text x="270" y="282" textAnchor="end" {...rlz(5, LBL)}>
        <tspan x="270" dy="0">
          {t.uncoveredLine1}
        </tspan>
        <tspan x="270" dy="16">
          {t.uncoveredLine2}
        </tspan>
      </text>
    </svg>
  );

  return <DosLienzos umbral={630} ancho={ancho} estrecho={estrecho} />;
}
