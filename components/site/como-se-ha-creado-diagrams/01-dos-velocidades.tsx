import type { Locale } from "@/lib/i18n/config";

import { DosLienzos, LBL, LBL_STRONG, rlz } from "./shared";

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
  const ancho = (
    <svg
      viewBox="0 0 540 200"
      role="img"
      aria-label={t.ariaLabel}
      /* 540 (P68.59), y el tope IGUAL al lienzo. Antes eran 560 unidades de
         dibujo dentro de un tope de 540px: un tope por debajo del propio
         `viewBox` es una escala <1 permanente, y dejaba el rótulo en 10,6 ni
         con toda la pantalla. Se igualan en 540 —la segunda columna se acerca
         20 unidades— porque esta figura va flotada, y media columna son
         ~550px de contenido hasta 1536. */
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
        x="320"
        y="20"
        width="160"
        height="160"
        rx="6"
        {...rlz(1, "fill-muted")}
      />
      <rect
        x="320"
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
        x="320"
        y="66"
        width="160"
        height="114"
        rx="4"
        strokeWidth="1.5"
        {...rlz(2, "fill-primary/30 stroke-primary")}
      />
      <text x="400" y="45" textAnchor="middle" {...rlz(0, LBL_STRONG)}>
        above the fold
      </text>
      <text x="400" y="125" textAnchor="middle" {...rlz(3, LBL_STRONG)}>
        {t.deep}
      </text>
      <text x="400" y="200" textAnchor="middle" {...rlz(4, LBL)}>
        {t.deepReader}
      </text>
    </svg>
  );

  /** La misma comparación en un hueco estrecho: las dos columnas siguen lado
   * a lado —apilarlas destruiría la comparación, que es lo que el diagrama
   * cuenta— y lo que se estrecha es cada una. */
  const estrecho = (
    <svg
      viewBox="0 0 280 208"
      role="img"
      aria-label={t.ariaLabel}
      className="h-auto w-full max-w-[300px]"
    >
      <rect
        x="8"
        y="18"
        width="124"
        height="150"
        rx="6"
        {...rlz(1, "fill-muted")}
      />
      <rect
        x="8"
        y="18"
        width="124"
        height="40"
        rx="6"
        {...rlz(0, "fill-primary/70")}
      />
      <text x="70" y="43" textAnchor="middle" {...rlz(0, LBL_STRONG)}>
        above the fold
      </text>
      <text x="70" y="192" textAnchor="middle" {...rlz(4, LBL)}>
        {t.scan}
      </text>

      <rect
        x="148"
        y="18"
        width="124"
        height="150"
        rx="6"
        {...rlz(1, "fill-muted")}
      />
      <rect
        x="148"
        y="18"
        width="124"
        height="40"
        rx="6"
        {...rlz(0, "fill-primary/70")}
      />
      <rect
        x="148"
        y="62"
        width="124"
        height="106"
        rx="4"
        strokeWidth="1.5"
        {...rlz(2, "fill-primary/30 stroke-primary")}
      />
      <text x="210" y="43" textAnchor="middle" {...rlz(0, LBL_STRONG)}>
        above the fold
      </text>
      <text x="210" y="118" textAnchor="middle" {...rlz(3, LBL_STRONG)}>
        {t.deep}
      </text>
      <text x="210" y="192" textAnchor="middle" {...rlz(4, LBL)}>
        {t.deepReader}
      </text>
    </svg>
  );

  return <DosLienzos umbral={545} ancho={ancho} estrecho={estrecho} />;
}
