// @pieza primitiva · pendiente · La tarjeta de nota: un título y su explicación, al margen del cuerpo.

import { CARD } from "./layout";
import { cn } from "@/lib/utils";

/**
 * Tarjeta de nota: un título y su explicación. Es la pieza con la que las páginas
 * de sistema —Design System y Accesibilidad— cuentan cosas al margen del cuerpo:
 * una medida, el resultado de una herramienta, una regla.
 *
 * Admite tres cuerpos y se pueden combinar: `body` (párrafo), `bullets` (lista) y
 * `foot` (el matiz que cierra, más pequeño). `mono` pone el título en monoespaciada,
 * para cuando el título es el nombre de una herramienta o de un token.
 *
 * Nació dos veces (P37.62). Había una copia en `design-system.tsx` y otra en
 * `accesibilidad.tsx`, casi iguales pero no del todo —solo una tenía `mono`, solo
 * una tenía `leading-[1.6]` en el cuerpo—, así que el mismo bloque se leía distinto
 * según la página. Y como ninguna de las dos aceptaba viñetas, las dos notas de
 * «Botones y acciones» estaban escritas a mano al lado de una pieza que existía
 * para justamente eso. Es el patrón del que avisa la Regla de construcción: cuando
 * la pieza no cubre el caso, lo que se escribe a mano es el caso — y luego diverge.
 */
export function InfoCard({
  title,
  body,
  bullets,
  foot,
  mono,
}: {
  title: string;
  body?: string;
  bullets?: readonly string[];
  foot?: string;
  mono?: boolean;
}) {
  return (
    <div className={cn(CARD, "p-5")}>
      <h3
        className={cn(
          "text-foreground m-0 mb-2 text-[1rem] font-semibold",
          mono ? "font-mono text-[0.95rem]" : "font-display",
        )}
      >
        {title}
      </h3>
      {body && (
        <p className="text-muted-foreground m-0 text-[0.88rem] leading-[1.6]">
          {body}
        </p>
      )}
      {bullets && (
        <ul className="text-muted-foreground m-0 flex list-disc flex-col gap-2 pl-[1.1rem] text-[0.88rem] leading-[1.6]">
          {bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
      {foot && (
        <p className="text-muted-foreground m-0 mt-[0.9rem] text-[0.85rem] leading-[1.6]">
          {foot}
        </p>
      )}
    </div>
  );
}
