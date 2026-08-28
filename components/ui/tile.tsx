// @pieza primitiva · design-system/10-composicion.tsx · La casilla cuadrada que sostiene una marca: un logo, un ordinal o un glifo.

import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Nació de un ruido que Francisco vio antes que nadie: «veo muchas variantes».
 * Y no eran variantes, era la MISMA caja a tres tallas y con dos reglas de
 * relleno (P83.5). El logo de marca iba a 2,1rem sin relleno; el mismo logo en
 * Formación a 2,5rem porque el punto de uso le pasaba un `h-10 w-10`; y el
 * ordinal de «Cómo trabajo» a 2,5rem con `bg-card`. Mismo radio y mismo borde en
 * los tres, así que se leían como una pieza que se comporta de tres maneras.
 *
 * LO QUE LO CAUSABA NO ERA EL TAMAÑO: era que la caja no estaba en la capa. Sin
 * pieza no hay dónde escribir la regla, y sin regla cada call site decide. Por
 * eso el arreglo no es igualar los números a mano, sino que exista esto.
 *
 * DOS DECISIONES, LAS DOS DE FRANCISCO:
 *
 * · **Relleno `card`, no transparente.** Sin relleno, la caja cambiaba de color
 *   según la sección donde cayera; el ordinal no cambiaba nunca. Ahora ninguna.
 *   El criterio fue «el mismo relleno que el toggle de tema o los iconos de
 *   LinkedIn y GitHub», que es `--card` (ver `.icon-chrome` en `globals.css`).
 *   Si algún día una casilla cae sobre un `card`, necesitará el mismo trato
 *   sensible a la superficie que `.icon-chrome` recibió, y por el mismo motivo.
 *
 * · **Una sola talla, 2,5rem.** La misma del ordinal, así que la casilla del
 *   logo y la del número dejan de parecerse: son la misma. El tamaño vive aquí
 *   y no se pasa por prop — que se pudiera pasar es lo que abrió la grieta.
 */
export function Tile({
  children,
  className,
  decorative = false,
}: {
  children: ReactNode;
  /** Solo para el CONTENIDO (tipografía, color del glifo). La caja no se toca. */
  className?: string;
  /**
   * La casilla no aporta nada que leer y su contenido tampoco: un logo de marca
   * es adorno. El ordinal de una etapa NO lo es, así que por defecto se anuncia.
   */
  decorative?: boolean;
}) {
  return (
    <span
      aria-hidden={decorative || undefined}
      className={cn(
        "border-border bg-card relative flex h-10 w-10 flex-none items-center justify-center overflow-hidden rounded-md border",
        className,
      )}
    >
      {children}
    </span>
  );
}
