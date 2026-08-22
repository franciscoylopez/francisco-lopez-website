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

/**
 * Rótulo superior de una cabecera.
 *
 * TENÍA UN EJE `tone` con dos valores —`muted` para `--background` y `band` para
 * la franja de contacto— y P37.6565 se lo llevó por delante: el atenuado ya no se
 * elige, se deriva de la superficie donde cae el rótulo (`--surface-dim` en
 * `globals.css`). Las dos variantes pasaron a pintar el mismo color y dejar dos
 * nombres para una sola cosa es exactamente cómo empieza el drift. El caso sigue
 * existiendo y la página que lo documenta lo enseña mejor que antes: el mismo
 * rótulo, sin prop, sobre dos fondos distintos.
 */
export const eyebrowVariants = cva(
  "text-muted-foreground m-0 text-[0.8125rem] font-semibold tracking-[0.09em] uppercase",
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
      /**
       * h3: el subapartado DENTRO de una sección. Nace con «La historia» del
       * deep-dive (P48), que es la primera sección del sitio con jerarquía de tres
       * niveles: sus subapartados son libres y cambian de una experiencia a otra
       * (PRD-Historical §42), así que no podían ser `section-sm` —que abre una
       * sección— ni un `<p>` en negrita, que no es un encabezado y rompería la
       * jerarquía del punto 4 del checklist.
       */
      sub: "text-[clamp(1.35rem,2.2vw,1.75rem)] leading-[1.25] tracking-[-0.015em]",
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
  sub: "mb-2",
} as const;

/**
 * Hueco título→entradilla, el peldaño de abajo del anterior y por el mismo
 * argumento: lo pone el TAMAÑO, no el call site (P45). Lo llevaba el punto de
 * uso —28 `mt-*` escritos a mano— desde que P37.695 mató a `SectionHead` y se
 * llevó con él el `mb-4` de su envoltorio.
 *
 * AL MEDIRLOS APARECIÓ QUE NO ERAN 32 DECISIONES, SINO CUATRO — y que el hueco
 * YA SEGUÍA AL TAMAÑO, sin que nadie se hubiera dado cuenta:
 *
 *   · `page` → 24px en los tres heros.
 *   · `page-sm` → 16px en Cookies.
 *   · `section` → **22,4px (`1.4rem`) en los diez sitios que lo usan**: las seis
 *     secciones del Brand Kit y las cuatro de la home.
 *   · `section-sm` → 16px en las dieciocho del Design System y Accesibilidad.
 *
 * El `1.4rem` parecía el drift más evidente —un valor a mano entre un montón de
 * `mt-4`— y era justo lo contrario: el valor correcto de OTRO tamaño. Es la
 * lección `CARD`/`PANEL` de D36 por tercera vez, y aquí el que significaba otra
 * cosa era el que más pinta de error tenía.
 *
 * **Por eso no se normaliza a `mb-5`, que era la tentación.** No es un paso de la
 * escala de Tailwind, pero es la moda de su grupo —diez de diez— y bajarlo a
 * 20px movería diez sitios publicados para ganar una cifra redonda. Lo que esta
 * tarea arregla es que estuviera escrito diez veces, no cuánto mide; centralizado
 * aquí, cambiarlo es una línea el día que sea una decisión de diseño y no un
 * refactor. Ningún píxel se mueve.
 *
 * Va como margen INFERIOR del titular y no como superior de la entradilla: así
 * cada elemento de la cabecera carga el hueco hacia el de abajo, igual que
 * `EYEBROW_GAP`, y el slot `children` no necesita envoltorio — o sea, ni un nodo
 * nuevo en el DOM de las páginas que ya están publicadas.
 */
export const LEAD_GAP = {
  page: "mb-6",
  "page-sm": "mb-4",
  section: "mb-[1.4rem]",
  "section-sm": "mb-4",
  sub: "mb-3",
} as const;

/**
 * Interlineado del texto de CUERPO (no titulares, que ya tienen el suyo dentro
 * de `titleVariants`). Nace de una auditoría sobre «Cómo se ha creado esta
 * página» (P60): la mitad de sus elementos de texto llevaban un valor elegido
 * a mano sin relación entre sí, y la otra mitad no declaraba ninguno, así que
 * heredaba el `1.5` del preflight de Tailwind por accidente — un valor que
 * nadie había decidido, no una elección.
 *
 * Tres familias, no un solo número:
 * - **`prose` (1,7)** — el único texto pensado para leerse seguido, párrafo
 *   tras párrafo: el cuerpo de una sección larga.
 * - **`lead` (1,6)** — texto de apoyo más corto, que se escanea más que se
 *   lee: la entradilla de una apertura, una nota de orientación, el pie de un
 *   diagrama o una imagen. Ya era el valor que más se repetía antes de
 *   nombrarlo.
 * - **`meta` (1,3)** — etiquetas y metadatos cortos, casi siempre de una
 *   línea: autoría, datos en vivo, migas de posición. Verificado en pantalla
 *   a ancho de móvil real (clonando el DOM servido, no solo mirando el
 *   número) en los dos casos que sí podían envolver a varias líneas —el pie
 *   de `RepoStrip` con muchas decisiones citadas, la celda más larga del
 *   índice—: en ninguno de los dos se lee apretado.
 *
 * Las citas (`Pullquote`, `Pull`) se quedan FUERA de esta escala a propósito:
 * son un registro visual distinto, no cuerpo ni metadato, y su interlineado
 * más ajustado es una convención tipográfica real (texto grande, pensado
 * para leerse como un titular corto), documentada en su propio componente.
 */
export const LEADING = {
  prose: "leading-[1.7]",
  lead: "leading-[1.6]",
  meta: "leading-[1.3]",
} as const;

type Size = NonNullable<VariantProps<typeof titleVariants>["size"]>;

export function SectionHeader({
  eyebrow,
  title,
  level = 2,
  size = "section",
  reveal = false,
  titleClassName,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  /**
   * `1` para el h1 de una página, `2` para el que abre una sección, `3` para el
   * subapartado dentro de ella. El nivel es SEMÁNTICA y `size` es aspecto: van
   * juntos casi siempre, pero separarlos es lo que permite que la jerarquía del
   * DOM no dependa de cuánto mide el texto (punto 4 del checklist).
   */
  level?: 1 | 2 | 3;
  size?: Size;
  /**
   * Marca la cabecera como objetivo del island de motion. Va en los DOS elementos,
   * que es como lo escriben los cuatro heros que lo usan: el rótulo y el titular
   * entran por separado. Las páginas que revelan el `<header>` entero no lo pasan.
   */
  reveal?: boolean;
  /** Solo para lo que depende del contenido: `max-w-[14ch]`, `text-balance`. */
  titleClassName?: string;
  /**
   * Entradilla u otro contenido bajo el titular. El hueco que la separa del
   * titular lo pone `LEAD_GAP` según el `size`: en el call site no se escribe.
   */
  children?: ReactNode;
}) {
  const Title = `h${level}` as const;

  return (
    <>
      {eyebrow ? (
        <p
          {...(reveal ? { "data-reveal": true } : {})}
          className={cn(eyebrowVariants(), EYEBROW_GAP[size])}
        >
          {eyebrow}
        </p>
      ) : null}
      <Title
        {...(reveal ? { "data-reveal": true } : {})}
        className={cn(
          titleVariants({ size }),
          children ? LEAD_GAP[size] : null,
          titleClassName,
        )}
      >
        {title}
      </Title>
      {children}
    </>
  );
}
