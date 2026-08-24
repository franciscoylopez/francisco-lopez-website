import type { Locale } from "@/lib/i18n/config";

import { DosLienzos, LBL, rlz } from "./shared";

/** 08 · Las cinco capas de verificación, cada una cubriendo más que la
 * anterior — el diagrama validado en el prototipo de P59, con tokens reales. */
export function CapasVerificacionDiagram({ lang }: { lang: Locale }) {
  const t = {
    es: {
      ariaLabel:
        "Cinco barras horizontales de longitud creciente: compilador, escáner automático, censo de contraste, lector de pantalla y persona. Solo la barra de la persona, la más larga, entra en la zona final marcada como «lo que ninguna regla prohíbe».",
      capas: [
        { label: "compilador", w: 150 },
        { label: "escáner automático", w: 240 },
        { label: "censo de contraste", w: 330 },
        { label: "lector de pantalla", w: 448 },
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
        { label: "automated scanner", w: 240 },
        { label: "contrast census", w: 330 },
        { label: "screen reader", w: 448 },
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
   * del ancho entero, y las barras conservan su proporción exacta (×260/448),
   * que es lo único que este diagrama afirma. */
  const escala = (w: number) => Math.round((w * 260) / 448);
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
