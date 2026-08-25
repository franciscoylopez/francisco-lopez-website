// @pieza primitiva · design-system/15-articulo.tsx · La regleta de un dato en vivo: la cifra no se escribe, se enlaza a quien la publica.

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { LEADING } from "./heading";

// SALIÓ DE `ui/article.tsx` EL 2026-08-25 (P70.102), y no por tamaño.
//
// D76 dejó la capa de artículo FUERA del núcleo con un argumento concreto: que
// resolvía «un FORMATO, el de texto largo con paradas, que hoy solo tiene una
// página». Esa premisa dejó de ser cierta el día que `/accesibilidad` quiso
// publicar cuántas piezas tiene el sistema sin escribir la cifra a mano. Eso no
// es texto largo: es D38 —el valor lo tiene UN sitio— con forma de bloque.
//
// SUBE SOLA Y LAS OTRAS SIETE SE QUEDAN, que es la parte que conserva D76 en
// pie. Portada de capítulo, cita, índice con tiempo por sección o transición
// entre paradas siguen siendo del formato; esto no lo era y estaba ahí por
// vecindad.
//
// Y NO ES PIEZA DE NÚCLEO, aunque la tarea lo dijera antes de leer el
// vocabulario: el núcleo son los ocho EJES del sistema (el control, el enlace de
// nav, la etiqueta, la cabecera, el campo, la tabla, la fila de cifras y las
// cajas). Esto es un bloque suelto, del mismo grupo que `info-card.tsx`. Lo que
// cambia con la mudanza no es su rango, es de qué depende: antes, de que la
// página fuera un artículo.

/** La regleta de un dato en vivo: no se escribe la cifra en el diccionario
 * (D60), se enlaza a la página que la publica de verdad. `example` es un slot
 * opcional para mostrar la pieza real en vez de solo describirla en texto
 * (P60 tanda 2, punto 17): el llamador pasa componentes reales importados de
 * `components/ui/` —el mismo artefacto que renderiza el sitio, no una
 * recreación— sobre una franja propia, con su propia superficie declarada
 * (`data-surface="card"`, D30/D39) para que el atenuado de dentro se
 * recalcule contra ELLA. */
export function LiveStat({
  label,
  source,
  value,
  linkLabel,
  href,
  example,
}: {
  label: string;
  source: string;
  value: string;
  linkLabel: string;
  href: string;
  example?: ReactNode;
}) {
  // ¿destino fuera del sitio? (design-review P60, F2): a diferencia de
  // `RepoStrip`, que SIEMPRE resuelve a github.com o a una URL externa, este
  // `href` también recibe anclas internas (el espécimen del Design System usa
  // "#ds-articulo-cover"), así que la comprobación es explícita en vez de un
  // `target="_blank"` fijo.
  const isExternal = /^https?:\/\//.test(href);
  return (
    <aside className="border-border bg-card my-[2rem] max-w-[34rem] rounded-lg border">
      <div className="border-border flex flex-wrap items-baseline justify-between gap-2 border-b border-dashed px-5 pt-4 pb-3">
        <span
          className={cn(
            "text-foreground text-[0.72rem] font-semibold tracking-[0.05em] uppercase",
            LEADING.meta,
          )}
        >
          {label}
        </span>
        <code
          className={cn(
            "text-muted-foreground font-mono text-[0.74rem]",
            LEADING.meta,
          )}
        >
          {source}
        </code>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <p
          className={cn(
            "text-foreground m-0 text-[1.05rem] font-semibold",
            LEADING.meta,
          )}
        >
          {value}
        </p>
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className={cn("link-content text-[0.9rem] font-medium", LEADING.meta)}
        >
          {linkLabel}
        </a>
      </div>
      {example ? (
        <div
          data-surface="card"
          className="border-border flex flex-wrap items-center gap-2 border-t px-5 py-4"
        >
          {example}
        </div>
      ) : null}
    </aside>
  );
}
