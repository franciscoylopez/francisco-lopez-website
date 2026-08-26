import { titleVariants } from "@/components/ui/heading";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

// Lo único de esta página que se usa en MÁS DE UNA sección. Todo lo demás vive
// en el archivo de la suya: medido antes de partir, 9 de los 13 subcomponentes
// se usaban en una sola (P37.69).
//
// AQUÍ VIVÍA `SectionHead` (P37.695). Era una de las TRES copias privadas de la
// cabecera numerada —las otras dos en `accesibilidad.tsx` y en `brand-kit`— y
// las tres pintaban el ordinal en monoespaciada, que no es el rótulo de este
// sitio. Ahora las catorce secciones abren con `SectionHeader`, igual que la
// home y los cuatro heros: el ordinal va dentro del eyebrow.

/**
 * LA TARJETA ESPÉCIMEN de esta página: la demo real arriba, sobre el fondo de
 * página, y debajo su ficha sobre `--card` — rótulo, nombre de la pieza en
 * monoespaciada, qué resuelve, y la letra pequeña tras un filete discontinuo.
 *
 * Estaba escrita a mano en las secciones 08, 09 y 10, y la cuarta (15, la capa
 * de artículo) la habría copiado por cuarta vez. Sube aquí por lo que dice la
 * cabecera de este archivo: es lo que se usa en más de una sección. **Las tres
 * migraron el 2026-08-25 (P70.23)**, en su propia tarea y no de rebote: es un
 * refactor mecánico sobre secciones publicadas y su gate es un diff de HTML.
 *
 * LA (11) NO ENTRA, y la tarea decía que eran cuatro. Su tarjeta de tonos se
 * parece y no es esta: no tiene rótulo ni regla, su demo apila en columna en vez
 * de centrar en fila, y sobre todo **su SUPERFICIE cambia por espécimen** —es
 * literalmente lo que ese subapartado enseña, que el rótulo toma su gris del
 * fondo—. Migrarla pedía tres mandos nuevos (superficie, rótulo opcional, regla
 * opcional) para servir a un solo llamador cuyo asunto es justo que la superficie
 * varía, y eso es la regla 4 de `BRAND.md`: dos cosas que se parecen y significan
 * distinto no se unifican. Lo único que de verdad comparten es la FICHA de abajo,
 * y son dos apariciones.
 *
 * `wide` es el único eje real: las piezas pequeñas (una cita, una etiqueta) se
 * centran en su caja, y las que son una franja o una rejilla entera necesitan
 * el ancho completo y alineación normal de bloque. Sin `children` la tarjeta es
 * solo ficha, que es lo que necesitan las piezas cuya demo es compartida con
 * otras (las tres islas fijas se demuestran en una sola caja).
 */
export function SpecimenCard({
  kicker,
  cls,
  rule,
  note,
  wide,
  children,
}: {
  kicker: string;
  cls: string;
  rule: string;
  note?: string;
  wide?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="border-border flex flex-col overflow-hidden rounded-xl border">
      {children ? (
        <div
          // El simulador de foco de §09 necesita alcanzar los especímenes sin
          // que cada uno lleve una marca propia, y sus hijos DIRECTOS son
          // exactamente los controles de la demo. El atributo es inerte en las
          // otras secciones que usan esta tarjeta: solo lo mira la regla de
          // `globals.css`, y solo dentro del envoltorio que lo enciende.
          data-specimen-demo=""
          className={cn(
            "bg-background flex-1",
            wide
              ? "px-[clamp(1.25rem,3vw,2rem)] py-8"
              : "flex min-h-[7.5rem] flex-wrap items-center justify-center gap-2 px-5 py-7",
          )}
        >
          {children}
        </div>
      ) : null}
      <div
        className={cn(
          "bg-card px-5 pt-[1.1rem] pb-[1.35rem]",
          children && "border-border border-t",
        )}
      >
        <div className="mb-[0.7rem] flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <span className="text-foreground text-[0.72rem] font-semibold tracking-[0.05em] uppercase">
            {kicker}
          </span>
          <code className="text-muted-foreground font-mono text-[0.74rem]">
            {cls}
          </code>
        </div>
        <p className="text-foreground m-0 text-[0.88rem] leading-[1.6]">
          {rule}
        </p>
        {note ? (
          <p className="text-muted-foreground border-border m-0 mt-[0.8rem] border-t border-dashed pt-[0.8rem] text-[0.82rem] leading-[1.55]">
            {note}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/**
 * El par cabecera + entradilla de un SUBAPARTADO dentro de una sección. Mismo
 * markup que ya escriben a mano 08, 11 y 12; aquí lo usa 15, que tiene cinco y
 * copiarlo cinco veces en un archivo sería drift dentro del mismo archivo.
 */
export function GroupHead({
  title,
  lead,
  first,
}: {
  title: string;
  lead: string;
  /** El primero de la sección no necesita separarse de la entradilla de arriba. */
  first?: boolean;
}) {
  return (
    <>
      <h3
        className={cn(
          titleVariants({ size: "sub-sm" }),
          "mb-2",
          !first && "mt-12",
        )}
      >
        {title}
      </h3>
      <p className="text-muted-foreground m-0 mb-4 max-w-[var(--measure)] text-[0.9rem] leading-[1.55]">
        {lead}
      </p>
    </>
  );
}

export function TypeMeta({
  label,
  value,
  mono,
  muted,
}: {
  label: string;
  value: string;
  mono?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[0.15rem]">
      <span className="text-muted-foreground text-[0.68rem] tracking-[0.04em] uppercase">
        {label}
      </span>
      <span
        className={cn(
          "text-[0.82rem]",
          mono && "font-mono",
          muted && "text-muted-foreground",
        )}
      >
        {value}
      </span>
    </div>
  );
}
