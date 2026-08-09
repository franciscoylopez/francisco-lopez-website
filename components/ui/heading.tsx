import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

// Capa de CABECERA del sistema (P37.65). Fuente única del par eyebrow + título que
// abre toda página y toda sección.
//
// Por qué existe: es el mismo problema del botón una capa más arriba. Medido el
// 2026-08-09, el eyebrow estaba escrito CATORCE veces con las mismas clases y el
// título de sección SIETE, y había además tres copias privadas de la misma idea
// —`SectionHead` dentro de `design-system.tsx`, las constantes `NUM`/`H2`/`LEAD`
// dentro de `brand-kit.tsx` y el markup suelto de las secciones de la home—. La
// escalera del sistema es tokens → controles → BLOQUES DE PÁGINA → páginas, y este
// es el peldaño que faltaba: sin él, el deep-dive escribía la copia número quince.
//
// LOS TRES TAMAÑOS NO SON DRIFT, SON JERARQUÍA — al menos dos de ellos. Es la
// lección `CARD`/`PANEL` de D36: antes de unificar valores que se parecen, hay que
// mirar si significan cosas distintas. `section` (el título que abre una sección
// dentro de una página) es claramente otra cosa que `page` (el h1 que abre la
// página entera), y unificarlos rompería la jerarquía.
//
// `page-sm` es el que está en duda: lo usan Sobre mí y Cookies, mientras que
// Accesibilidad, Brand Kit y Design System usan `page`, y no hay razón registrada
// para la diferencia. Se conserva como variante con nombre en vez de unificarlo
// porque unificar cambiaría el hero de dos páginas publicadas, y esa es una
// decisión de diseño, no de refactor. Queda anotado en P37.65 hasta que se decida.
//
// EL HUECO ENTRE EYEBROW Y TÍTULO LO PONE EL TAMAÑO, no el call site. Antes había
// SEIS valores para la misma relación (`mb-3`, `mb-4`, `mb-5`, `mb-6`, `mb-[0.9rem]`
// y un clamp) repartidos por catorce archivos. Si el hueco entrara por prop no se
// habría factorizado nada: seguirían siendo seis decisiones sueltas y solo habría
// cambiado dónde se escriben. Se toma la moda de cada grupo, así que diez de los
// catorce usos no se mueven y los cuatro que sí lo hacen cambian 4px o menos.

/** Rótulo superior de una cabecera. `band` es para fondos que no son `--background` (D30). */
export const eyebrowVariants = cva(
  "m-0 text-[0.8125rem] font-semibold tracking-[0.09em] uppercase",
  {
    variants: {
      tone: {
        muted: "text-muted-foreground",
        band: "contact-dim",
      },
    },
    defaultVariants: { tone: "muted" },
  },
);

/**
 * Titular de cabecera. El `leading` va en la variante y no en el call site: `hero`
 * escribía `leading-none` y los demás `leading-[1.0]` —el mismo valor en dos
 * notaciones, que es lo que P37.5996 dejó prohibido.
 */
export const titleVariants = cva("font-display m-0 font-semibold", {
  variants: {
    size: {
      /** h1 de página: home, Accesibilidad, Brand Kit, Design System. */
      page: "text-[clamp(2.75rem,7vw,5rem)] leading-[1.0] tracking-[-0.025em]",
      /** h1 de página menor: Sobre mí y Cookies. Ver la nota de arriba. */
      "page-sm":
        "text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.05] tracking-[-0.025em]",
      /** h2 que abre una sección dentro de una página. */
      section:
        "text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02] tracking-[-0.022em]",
      /**
       * Sección de un índice largo: las once del Design System, que van numeradas.
       * Más pequeña que `section` a propósito —una página con once cabeceras del
       * tamaño de sección se lee como once portadas—, y por eso es una variante y
       * no un valor a corregir.
       */
      "section-sm":
        "text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] tracking-[-0.02em]",
    },
  },
  defaultVariants: { size: "section" },
});

/**
 * Hueco eyebrow→título, derivado del tamaño. Ver la nota de arriba. Se exporta
 * para que la sección que documenta esta capa en el Design System enseñe el
 * valor real y no una copia suya (P37.66).
 */
export const EYEBROW_GAP = {
  page: "mb-5",
  "page-sm": "mb-5",
  section: "mb-3",
  "section-sm": "mb-3",
} as const;

type Size = NonNullable<VariantProps<typeof titleVariants>["size"]>;
type Tone = NonNullable<VariantProps<typeof eyebrowVariants>["tone"]>;

export function SectionHeader({
  eyebrow,
  title,
  level = 2,
  size = "section",
  tone = "muted",
  reveal = false,
  titleClassName,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  /** `1` para el h1 de una página, `2` para el que abre una sección. */
  level?: 1 | 2;
  size?: Size;
  tone?: Tone;
  /**
   * Marca la cabecera como objetivo del island de motion. Va en los DOS elementos,
   * que es como lo escriben los cuatro heros que lo usan: el rótulo y el titular
   * entran por separado. Las páginas que revelan el `<header>` entero no lo pasan.
   */
  reveal?: boolean;
  /** Solo para lo que depende del contenido: `max-w-[14ch]`, `text-balance`. */
  titleClassName?: string;
  /** Entradilla u otro contenido bajo el titular. */
  children?: ReactNode;
}) {
  const Title = level === 1 ? "h1" : "h2";

  return (
    <>
      {eyebrow ? (
        <p
          {...(reveal ? { "data-reveal": true } : {})}
          className={cn(eyebrowVariants({ tone }), EYEBROW_GAP[size])}
        >
          {eyebrow}
        </p>
      ) : null}
      <Title
        {...(reveal ? { "data-reveal": true } : {})}
        className={cn(titleVariants({ size }), titleClassName)}
      >
        {title}
      </Title>
      {children}
    </>
  );
}
