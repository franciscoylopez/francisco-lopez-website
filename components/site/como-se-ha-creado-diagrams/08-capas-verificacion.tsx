import type { Locale } from "@/lib/i18n/config";

import { LBL, rlz } from "./shared";

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
  return (
    <svg
      viewBox="0 0 620 300"
      role="img"
      aria-label={t.ariaLabel}
      className="h-auto w-full max-w-[600px]"
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
}
