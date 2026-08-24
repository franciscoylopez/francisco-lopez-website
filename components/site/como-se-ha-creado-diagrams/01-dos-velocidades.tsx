import type { Locale } from "@/lib/i18n/config";

import { LBL, LBL_STRONG, rlz } from "./shared";

/** 01 · Dos lectores, dos velocidades: el mismo scroll, leído a dos ritmos. */
export function DosVelocidadesDiagram({ lang }: { lang: Locale }) {
  const t = {
    es: {
      ariaLabel:
        "Dos columnas iguales representan el mismo scroll de la página. La columna de la izquierda, marcada «selección, 5-10s», solo cubre el primer tramo, el above the fold. La columna de la derecha, marcada «CPO/VP Product, lectura profunda», cubre la columna entera hasta el final.",
      scan: "selección · 5-10s",
      deep: "scroll completo",
      deepReader: "CPO / VP Product",
    },
    en: {
      ariaLabel:
        "Two equal columns represent the same page scroll. The left column, marked “recruiter, 5-10s”, only covers the first stretch, the fold. The right column, marked “CPO/VP Product, deep read”, covers the whole column to the end.",
      scan: "recruiter · 5-10s",
      deep: "full scroll",
      deepReader: "CPO / VP Product",
    },
  }[lang];
  return (
    <svg
      viewBox="0 0 560 200"
      role="img"
      aria-label={t.ariaLabel}
      className="h-auto w-full max-w-[540px]"
    >
      <rect
        x="60"
        y="20"
        width="160"
        height="160"
        rx="6"
        {...rlz(1, "fill-muted")}
      />
      <rect
        x="60"
        y="20"
        width="160"
        height="42"
        rx="6"
        {...rlz(0, "fill-primary/70")}
      />
      <text x="140" y="45" textAnchor="middle" {...rlz(0, LBL_STRONG)}>
        above the fold
      </text>
      <text x="140" y="200" textAnchor="middle" {...rlz(4, LBL)}>
        {t.scan}
      </text>

      <rect
        x="340"
        y="20"
        width="160"
        height="160"
        rx="6"
        {...rlz(1, "fill-muted")}
      />
      <rect
        x="340"
        y="20"
        width="160"
        height="42"
        rx="6"
        {...rlz(0, "fill-primary/70")}
      />
      {/* La zona "reached beyond the fold" sigue en la familia del cian, no del
          morado (BRAND.md, «el morado decorativo no vale como elemento
          gráfico»): brand-purple-soft daba 1,74:1 contra el fondo en tema
          claro, por debajo del 3:1 que pide WCAG 1.4.11 para un relleno que
          transmite información (design-review P60). El relleno translúcido
          por sí solo tampoco llega (fill-primary/30 mide 1,66:1) — el borde
          en stroke-primary sí (7,93:1, mismo cian a plena intensidad que ya
          usa el header de arriba), y es el borde el que delimita la forma. */}
      <rect
        x="340"
        y="66"
        width="160"
        height="114"
        rx="4"
        strokeWidth="1.5"
        {...rlz(2, "fill-primary/30 stroke-primary")}
      />
      <text x="420" y="45" textAnchor="middle" {...rlz(0, LBL_STRONG)}>
        above the fold
      </text>
      <text x="420" y="125" textAnchor="middle" {...rlz(3, LBL_STRONG)}>
        {t.deep}
      </text>
      <text x="420" y="200" textAnchor="middle" {...rlz(4, LBL)}>
        {t.deepReader}
      </text>
    </svg>
  );
}
