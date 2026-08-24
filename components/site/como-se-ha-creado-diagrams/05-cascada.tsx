import type { Locale } from "@/lib/i18n/config";

import { LBL_STRONG, rlz } from "./shared";

/** 05 · La cascada de construcción, en escalera descendente (D79, prototipo
 * de Tanda 3 · «Escalera descendente», elegida sobre las otras dos que se
 * compararon): el indentado decreciente enseña lo que el texto ya dice —la
 * mayoría de casos se resuelven en la primera pregunta—, cosa que la fila
 * horizontal anterior no comunicaba en ningún sitio. */
export function CascadaDiagram({ lang }: { lang: Locale }) {
  const t = {
    es: {
      ariaLabel:
        "Cuatro preguntas en cascada descendente, cada una más corta que la anterior: ¿Existe la pieza? → se usa. Si no, ¿es del sistema? → se crea la variante. Si no, ¿es estado, foco o portal? → se trae de shadcn. Si no, ¿nada de lo anterior? → se decide y se documenta. La mayoría de casos se resuelven en la primera pregunta.",
      steps: [
        { q: "¿Existe la pieza?", a: "Se usa" },
        { q: "¿Es del sistema?", a: "Se crea la variante" },
        { q: "¿Estado, foco o portal?", a: "Se trae de shadcn" },
        { q: "¿Nada de lo anterior?", a: "Se decide y se documenta" },
      ],
      sino: "si no",
    },
    en: {
      ariaLabel:
        "Four questions in a descending cascade, each shorter than the last: Does the piece exist? → use it. If not, is it the system's? → create the variant. If not, is it state, focus or a portal? → pull it from shadcn. If not, none of the above? → decide and document it. Most cases resolve at the first question.",
      steps: [
        { q: "Does it exist?", a: "Use it" },
        { q: "Is it the system's?", a: "Create the variant" },
        { q: "State, focus or portal?", a: "Pull it from shadcn" },
        { q: "None of the above?", a: "Decide and document" },
      ],
      sino: "if not",
    },
  }[lang];
  const W = 600;
  const ROW_H = 72;
  const PAD = 14;
  return (
    <svg
      viewBox={`0 0 ${W} ${PAD * 2 + t.steps.length * ROW_H}`}
      role="img"
      aria-label={t.ariaLabel}
      className="h-auto w-full max-w-[600px]"
    >
      {t.steps.map((s, i) => {
        const y = PAD + i * ROW_H;
        const indent = i * 24;
        const boxW = W - 40 - indent * 2;
        const isFirst = i === 0;
        return (
          <g key={s.q}>
            <rect
              x={20 + indent}
              y={y}
              width={boxW}
              height={ROW_H - 14}
              rx="8"
              strokeWidth={isFirst ? 1.5 : 1}
              {...rlz(
                i,
                isFirst ? "fill-primary/12 stroke-primary" : "fill-muted",
              )}
            />
            <text x={40 + indent} y={y + 25} {...rlz(i, LBL_STRONG)}>
              {i + 1}. {s.q}
            </text>
            <text
              x={40 + indent}
              y={y + 44}
              {...rlz(i, "fill-primary font-mono text-[11px] font-semibold")}
            >
              → {s.a}
            </text>
            {i < t.steps.length - 1 ? (
              <>
                <line
                  x1={20 + indent + 16}
                  y1={y + ROW_H - 14}
                  x2={20 + indent + 16}
                  y2={y + ROW_H - 2}
                  strokeWidth="2"
                  {...rlz(i, "stroke-border")}
                />
                <text
                  x={20 + indent + 26}
                  y={y + ROW_H - 3}
                  {...rlz(i, "fill-muted-foreground font-mono text-[9px]")}
                >
                  {t.sino}
                </text>
              </>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
