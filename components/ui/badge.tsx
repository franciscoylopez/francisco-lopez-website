// @pieza núcleo · design-system/08-etiquetas.tsx · El rótulo que NO se pulsa, en dos ejes: `tone` × `kind`.

import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

// Capa de ETIQUETA del sistema (P37.655). Fuente única del rótulo pequeño no
// interactivo: la pastilla que acompaña a un título, a una fila de tabla o a un
// dato. Es la tercera capa que faltaba, después de la de acción (`action.tsx`,
// todo lo pulsable) y la de cabecera (`heading.tsx`, el par eyebrow + título).
//
// Por qué existe: es el problema del botón otra vez, una capa más abajo. Medido en
// pantalla el 2026-08-08 y recontado en código el 2026-08-09, había OCHO
// definiciones en seis archivos —cinco paddings laterales, tres cuerpos, cuatro
// alturas, dos pesos— y TRES de ellas convivían en la misma página (Brand Kit),
// que es exactamente el patrón del chip de SVG con icono y los de PNG sin él.
//
// LA ETIQUETA NO ES UNA ACCIÓN Y POR ESO NO ESTÁ EN `action.tsx`. No se pulsa, no
// tiene estados, no necesita suelo táctil de 44px ni anillo de foco: es un rótulo.
// Meterla allí habría obligado a que la mitad de las variantes ignorasen la mitad
// de la base. Es un archivo hermano, no una variante más.
//
// ───────────────────────────────────────────────────────────────────────────────
// EL TEXTO DE UNA PASTILLA TEÑIDA ES SIEMPRE `--foreground`. El velo es la señal;
// el texto solo tiene que leerse.
//
// No es una preferencia estética: es lo único que llega a AAA. Al medir las ocho
// definiciones salieron dos incumplimientos reales, los dos preexistentes:
//
//   1. `neutral` era `bg-muted text-muted-foreground` y daba **6,44 claro / 5,56
//      oscuro** — el caso exacto que D30 prohíbe (un atenuado calibrado contra
//      `--background`, usado sobre una superficie que no es `--background`). La
//      solución es la de D30, literalmente la misma fórmula que `--contact-dim`:
//      mezclar el texto un 85% hacia el propio fondo de la pastilla. **8,15 / 9,16.**
//
//   2. `cyan` llevaba `text-primary` sobre un velo del propio cian: **6,07 claro /
//      5,46 oscuro** sobre `--card`. Y no hay alfa que lo arregle, porque es el
//      techo asintótico de D30 —pintar cian sobre cian no puede subir el contraste
//      del cian—: el mejor caso posible, velo al 10% con el texto mezclado un 12%
//      hacia `--foreground`, se queda en 7,30 claro pero **6,62 en oscuro**. Con
//      `--foreground` el mismo velo al 16% da **10,66–11,27 / 10,00–11,19** según
//      la superficie de debajo. Ahí se acabó la discusión.
//
//   La pastilla que el Design System usaba para marcar «AAA» era, ella misma, la
//   peor medida de las ocho. Llevaba desde su publicación contradiciendo la frase
//   que ilustra —y ni axe ni el typecheck pueden ver eso, porque el fallo está en
//   una composición de dos `color-mix` que solo existe al pintarse.
//
// LOS DOS TEÑIDOS SE LLAMAN POR SU COLOR, no `primary`/`accent`. Son la SEGUNDA
// capa de BRAND.md —tokens decorativos, `brand-cyan` y `brand-purple`—, y llamarlos
// con nombres de la capa semántica es justo la mezcla que ese documento prohíbe.
// El velo usa `--brand-cyan` y no `--primary` por lo mismo: pintan idéntico (es
// deliberado, ver `globals.css`), pero aquí el cian es relleno decorativo, no el
// color de acción. Una pastilla no se pulsa.
// ───────────────────────────────────────────────────────────────────────────────
//
// LOS TRES `kind` SON EL EJE QUE SÍ SIGNIFICA ALGO, y por eso son variantes en vez
// de valores a unificar (lección `CARD`/`PANEL` de D36). La pastilla o rotula un
// estado —`label`, en versalitas, como «EXIT» o «PRÓXIMAMENTE»— o transporta un
// dato: en prosa (`value`: «AAA», «Split», «conmuta») o técnico (`code`, en mono:
// «13,79:1», «height:40px → 23px»). El `kind` se lleva también la familia
// tipográfica, que era la única pieza que un call site aún tenía que acordarse de
// escribir: la pastilla de contraste vive dentro de una celda `font-mono` y
// heredaba el mono sin quererlo, así que tenía un `font-sans` suelto para
// desactivarlo.
//
// Lo mecánico —padding, radio, cuerpo, peso, altura— se unifica sin más: ninguna de
// las cinco variaciones medidas significaba nada. Se toma la moda de cada grupo
// (`px-2`, 0,7rem, 600), así que ninguna pastilla del sitio se mueve más de 1px.

export const badgeVariants = cva(
  // `align-middle` en la base y no en el call site: la pastilla puede caer en
  // medio de una línea de texto (el chip «Exit» de Hitos) y sin él arrastra la
  // línea base del párrafo. `shrink-0` porque varias viven en filas flex.
  "inline-flex shrink-0 items-center rounded-full px-2 py-[0.15rem] align-middle text-[0.7rem] leading-[1.35] font-semibold",
  {
    variants: {
      tone: {
        /**
         * Sin carga: lo que no destaca. El texto sale de `text-muted-foreground`
         * y no de un `color-mix` propio porque desde P37.6565 la utilidad YA es
         * sensible a la superficie: dentro de `bg-muted` resuelve al mismo color
         * que esta pastilla escribía a mano. Mismo píxel, un sitio menos donde
         * mantener la fórmula.
         */
        neutral: "bg-muted text-muted-foreground",
        /** Teñida de cian. Hoy: «AAA», «conmuta», la cifra del hero de Accesibilidad. */
        cyan: "bg-[color-mix(in_oklch,var(--brand-cyan),transparent_84%)] text-foreground",
        /** Teñida de morado. Hoy: «Exit», «Split», la métrica del logo. */
        purple:
          "bg-[color-mix(in_oklch,var(--brand-purple),transparent_82%)] text-foreground",
      },
      kind: {
        /** Rótulo de estado, en versalitas: EXIT, PRÓXIMAMENTE. */
        label: "font-sans tracking-[0.05em] uppercase",
        /** Dato en prosa, con su caja tal cual: AAA, Split, conmuta. */
        value: "font-sans",
        /** Valor técnico, en mono: 13,79:1, height:40px → 23px. */
        code: "font-mono",
      },
    },
    defaultVariants: { tone: "neutral", kind: "value" },
  },
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;

/**
 * A diferencia de `actionVariants`, que se exporta solo como `cva` porque sus call
 * sites se reparten entre `<a>` y `<button>`, aquí las ocho pastillas del sitio son
 * un `<span>`. Así que el componente sí quita trabajo, y `className` queda para lo
 * único que de verdad depende del sitio: el margen respecto a su vecino.
 */
export function Badge({
  tone,
  kind,
  className,
  children,
}: BadgeVariants & { className?: string; children: ReactNode }) {
  return (
    <span className={cn(badgeVariants({ tone, kind }), className)}>
      {children}
    </span>
  );
}
