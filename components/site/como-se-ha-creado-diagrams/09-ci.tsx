import {
  type CategoriaPaso,
  DIAGRAMA_CI,
  pasosDibujados,
} from "@/content/articulo/ci-steps";
import { cardinal } from "@/lib/design-values";
import type { Locale } from "@/lib/i18n/config";

import { LBL, rlz } from "./shared";

/** 09 · Los dieciséis pasos de CI, agrupados por rol (D79, prototipo de Tanda 3
 * · «Agrupado por rol», elegida sobre las otras dos que se compararon):
 * sustituye a los quince cuadraditos anónimos Y al dato en vivo «Quince
 * pasos en cada PR» —eran DOS piezas compitiendo por el mismo hueco (P60
 * tanda 3-bis, punto 11)— por un único diagrama con los QUINCE PASOS REALES
 * del workflow, en su orden real (un único job de GitHub Actions: se
 * ejecutan uno detrás de otro, nunca en paralelo). Busca-patrón /
 * busca-ausencia sale del propio texto de la sección, no de una etiqueta
 * inventada: los que buscan un patrón conocido son las herramientas de
 * fábrica (Format, Typecheck, Lint, Build); los que buscan la ausencia de
 * algo bueno son los guardianes propios de este repositorio.
 *
 * POR QUÉ «Tests» CUENTA COMO BUSCA-PATRÓN (2026-08-24, P68.494). Un test
 * falla cuando un caso ESCRITO deja de comportarse como debe; no sabe decir
 * qué lógica no cubre nadie, y esa es justo la propiedad que define a la otra
 * familia. Ponerlo con los guardianes haría falsa la frase de la sección.
 *
 * Y EL RECUENTO YA NO SE ESCRIBE (P68.495). Fue quince, luego dieciséis y ahora
 * diecisiete, tecleado cada vez en el texto alternativo, en las dos cifras de la
 * leyenda y en el pie del diccionario. Ahora sale de `.github/workflows/ci.yml`
 * y de contar las propias pastillas, y `check:articulo` comprueba que las dos
 * cuentas coincidan. */
export function CIDiagram({ lang }: { lang: Locale }) {
  // LOS PASOS VIENEN DE `content/articulo/ci-steps.ts` Y EL RECUENTO DEL
  // WORKFLOW (P68.495). Aquí no se escribe ninguna cifra: ni la del texto
  // alternativo, ni las dos de la leyenda. Las tres estaban tecleadas, y las
  // tres decían quince cuando ya eran dieciséis. `check:articulo` compara
  // además cuántas pastillas dibuja esto contra cuántos pasos tiene `ci.yml`.
  const t = DIAGRAMA_CI[lang];
  const pasos = pasosDibujados(lang);
  const cuenta = (cat: CategoriaPaso) =>
    t.groups.reduce(
      (n, g) => n + g.items.filter((it) => it.cat === cat).length,
      0,
    );
  const ariaLabel = t.ariaLabel.replace("{pasos}", cardinal(pasos, lang));
  const absence = t.absence.replace("{n}", String(cuenta("ausencia")));
  const pattern = t.pattern.replace("{n}", String(cuenta("patron")));

  const chipW = (label: string) =>
    Math.max(58, Math.round(label.length * 6.4) + 22);
  const GAP = 8;
  const ROW_H = 26;
  const GROUP_H = 56;
  const W = 760;
  const lastStep = t.groups.length - 1;
  const legendY = t.groups.length * GROUP_H;

  return (
    <svg
      viewBox={`0 0 ${W} ${legendY + 30}`}
      role="img"
      aria-label={ariaLabel}
      className="h-auto w-full max-w-[760px]"
    >
      {t.groups.map((g, gi) => {
        const y = gi * GROUP_H;
        let x = 10;
        return (
          <g key={g.label}>
            <text
              x="10"
              y={y + 12}
              {...rlz(
                gi,
                "fill-muted-foreground font-mono text-[10px] font-semibold uppercase tracking-[0.06em]",
              )}
            >
              {g.label}
            </text>
            {g.items.map((it) => {
              const w = chipW(it.n);
              const cx = x;
              x += w + GAP;
              return (
                <g key={it.n}>
                  <rect
                    x={cx}
                    y={y + 18}
                    width={w}
                    height={ROW_H}
                    rx="6"
                    {...rlz(
                      gi,
                      it.cat === "ausencia" ? "fill-primary/25" : "fill-muted",
                    )}
                  />
                  <text
                    x={cx + w / 2}
                    y={y + 18 + ROW_H / 2 + 3.5}
                    textAnchor="middle"
                    {...rlz(gi, "fill-foreground font-mono text-[9.5px]")}
                  >
                    {it.n}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
      <rect
        x="10"
        y={legendY + 8}
        width="14"
        height="14"
        rx="3"
        {...rlz(lastStep, "fill-primary/25")}
      />
      <text x="30" y={legendY + 19} {...rlz(lastStep, LBL)}>
        {absence}
      </text>
      <rect
        x="220"
        y={legendY + 8}
        width="14"
        height="14"
        rx="3"
        {...rlz(lastStep, "fill-muted")}
      />
      <text x="240" y={legendY + 19} {...rlz(lastStep, LBL)}>
        {pattern}
      </text>
    </svg>
  );
}
