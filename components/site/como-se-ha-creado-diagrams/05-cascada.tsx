import type { Locale } from "@/lib/i18n/config";

import { DosLienzos, LBL, LBL_STRONG, rlz } from "./shared";

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

  const ROW_H = 72;
  const PAD = 14;

  /** El mismo escalón, a dos anchos. Lo único que cambia entre ellos es
   * cuánto puede sangrar cada paso: en 280 unidades, los 24 del lienzo ancho
   * se comerían la mitad del texto en el cuarto escalón. */
  const escalera = (
    W: number,
    step: number,
    padX: number,
    tick: number,
    cap: string,
  ) => (
    <svg
      viewBox={`0 0 ${W} ${PAD * 2 + t.steps.length * ROW_H}`}
      role="img"
      aria-label={t.ariaLabel}
      className={cap}
    >
      {t.steps.map((s, i) => {
        const y = PAD + i * ROW_H;
        const indent = i * step;
        const boxW = W - padX * 2 - indent * 2;
        const isFirst = i === 0;
        return (
          <g key={s.q}>
            <rect
              x={padX + indent}
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
            <text x={padX * 2 + indent} y={y + 25} {...rlz(i, LBL_STRONG)}>
              {i + 1}. {s.q}
            </text>
            <text
              x={padX * 2 + indent}
              y={y + 44}
              {...rlz(i, "fill-primary font-mono text-[11px] font-semibold")}
            >
              → {s.a}
            </text>
            {i < t.steps.length - 1 ? (
              <>
                <line
                  x1={padX + indent + tick}
                  y1={y + ROW_H - 14}
                  x2={padX + indent + tick}
                  y2={y + ROW_H - 2}
                  strokeWidth="2"
                  {...rlz(i, "stroke-border")}
                />
                {/* LBL —11px— y no los 9px que llevaba (P68.59): era el texto
                    más pequeño de la figura y no llegaba al suelo ni a 1536,
                    donde pintaba 9,0. Bajo el umbral hay un solo tamaño de
                    rótulo, y aquí resulta que arriba también debía haberlo. */}
                <text
                  x={padX + indent + tick + 10}
                  y={y + ROW_H - 3}
                  {...rlz(i, LBL)}
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

  /* EL LIENZO ANCHO BAJA DE 600 A 540 (P68.59). Esta figura va flotada a media
     columna, y media columna son ~550px de contenido incluso a 1536: con 600
     unidades no cabía en ningún viewport y se dibujaba SIEMPRE en su versión
     estrecha, pequeña dentro de una tarjeta del doble de ancho. Las 600 no
     eran una decisión de dibujo —son filas a ancho completo, el texto más
     largo ocupa 158 de las 404 disponibles en el escalón más sangrado—, así
     que estrecharlo no cuesta nada y lo devuelve a su sitio. */
  return (
    <DosLienzos
      umbral={545}
      ancho={escalera(540, 24, 20, 16, "h-auto w-full max-w-[540px]")}
      estrecho={escalera(280, 8, 12, 10, "h-auto w-full max-w-[300px]")}
    />
  );
}
