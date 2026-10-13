// @pieza primitiva · design-system/05-movimiento.tsx · La línea que se escribe dentro de una ficha del pliegue, con su cursor.

import { type CSSProperties, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * LA LÍNEA QUE SE ESCRIBE (2026-10-13). Es la única pieza de la construcción de
 * una ficha que necesita markup propio; las otras dos —`construye-pieza` y
 * `construye-barra`— son una clase y un `--i` sobre el elemento que ya había.
 * El mecanismo entero y su porqué, en `globals.css` §La ficha que se construye.
 *
 * POR QUÉ HACE FALTA UN ENVOLTORIO: la línea se revela con `clip-path`, y el
 * `clip-path` recorta también los pseudoelementos del propio elemento. El cursor
 * vive en el `::after` del envoltorio, que no está recortado, y la línea es su
 * hijo. Sin eso el cursor desaparecería justo donde tiene que verse.
 *
 * POR QUÉ EL ANCHO VA EN EL ENVOLTORIO y no en la línea: el cursor recorre el
 * envoltorio de punta a punta, así que el envoltorio tiene que medir lo que mide
 * la línea. Con el ancho dentro, el cursor seguiría hasta el borde de la ficha.
 *
 * `className` y `style` son de la LÍNEA (color, alto, radio, opacidad); `caja`
 * y `ancho` son del envoltorio (el hueco que ocupa en la ficha). `children`
 * sirve para escribir un texto de verdad en vez de una línea esquemática.
 */
export function LineaEscrita({
  i,
  ancho,
  caja,
  className,
  style,
  children,
}: {
  /** Su turno en la cascada de la ficha. */
  i: number;
  ancho?: string;
  caja?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <span
      className={cn("construye-linea", caja)}
      style={{ "--i": i, width: ancho } as CSSProperties}
    >
      <span className={cn("block", className)} style={style}>
        {children}
      </span>
    </span>
  );
}

/** El turno de una pieza que no es línea (icono, marca, barra): solo el índice. */
export const turno = (i: number) => ({ "--i": i }) as CSSProperties;
