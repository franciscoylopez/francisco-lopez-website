import type { Locale } from "@/lib/i18n/config";

import { LBL, rlz } from "./shared";

/** 03 · Las cuatro píldoras del color de marca: el mismo gesto rotado que
 * abre la portada del Brand Kit en `/api/og`, extendido de su par decorativo
 * (cian suave + morado suave) a las cuatro — sumando el cian y el morado
 * estándar — para que el diagrama enseñe el token completo, no solo la
 * mitad que usaba la OG (P60, tercera tanda). Agrupadas por tono: el par
 * cian primero, el par morado después. */
export function CapasColorDiagram({ lang }: { lang: Locale }) {
  const t = {
    es: {
      ariaLabel:
        "Cuatro píldoras rotadas, agrupadas por tono: cian estándar y cian suave, morado estándar y morado suave. Los cuatro colores del sistema de marca.",
      cyan: "cian",
      cyanSoft: "cian suave",
      purple: "morado",
      purpleSoft: "morado suave",
    },
    en: {
      ariaLabel:
        "Four rotated pills, grouped by hue: standard cyan and soft cyan, standard purple and soft purple. The four colors of the brand system.",
      cyan: "cyan",
      cyanSoft: "soft cyan",
      purple: "purple",
      purpleSoft: "soft purple",
    },
  }[lang];
  return (
    <svg
      viewBox="0 0 480 280"
      role="img"
      aria-label={t.ariaLabel}
      className="h-auto w-full max-w-[470px]"
    >
      <rect
        x="25"
        y="15"
        width="90"
        height="220"
        rx="20"
        transform="rotate(-8 70 125)"
        {...rlz(0, "fill-brand-cyan")}
      />
      <rect
        x="129"
        y="15"
        width="90"
        height="220"
        rx="20"
        transform="rotate(8 174 125)"
        {...rlz(1, "fill-brand-cyan-soft")}
      />
      <rect
        x="253"
        y="15"
        width="90"
        height="220"
        rx="20"
        transform="rotate(-8 298 125)"
        {...rlz(2, "fill-brand-purple")}
      />
      <rect
        x="357"
        y="15"
        width="90"
        height="220"
        rx="20"
        transform="rotate(8 402 125)"
        {...rlz(3, "fill-brand-purple-soft")}
      />
      <text x="70" y="258" textAnchor="middle" {...rlz(4, LBL)}>
        {t.cyan}
      </text>
      <text x="174" y="258" textAnchor="middle" {...rlz(4, LBL)}>
        {t.cyanSoft}
      </text>
      <text x="298" y="258" textAnchor="middle" {...rlz(4, LBL)}>
        {t.purple}
      </text>
      <text x="402" y="258" textAnchor="middle" {...rlz(4, LBL)}>
        {t.purpleSoft}
      </text>
    </svg>
  );
}
