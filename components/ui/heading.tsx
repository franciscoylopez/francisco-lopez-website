// @pieza núcleo · design-system/11-cabeceras.tsx · El par eyebrow + titular con el que abren página y sección.

import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { marcarMarcas } from "./marcas";

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
 * Y EL OTRO RÓTULO EN VERSALITAS, que no es el eyebrow ni una variante suya.
 *
 * El eyebrow ABRE una sección, emparejado con un titular y con el hueco entre los
 * dos puesto por el `size`. Este ROTULA UN DATO dentro del contenido: la etiqueta
 * de una ficha del deep-dive, la cabecera de la fila de hitos, el «Producto» que
 * separa los dos bloques de Trayectoria. No tiene titular al lado ni hueco que
 * derivar, y va un punto más pequeño y menos abierto a propósito, porque compite
 * con el dato que rotula y no con el cuerpo de la página.
 *
 * Es la regla 4 de `BRAND.md` aplicada antes de unificar: se parecen y significan
 * cosas distintas, así que lo que faltaba no era una corrección sino UN NOMBRE.
 * Mismo diagnóstico y mismo conteo que creó `eyebrowVariants`, que estaba escrito
 * catorce veces antes de existir.
 *
 * EL CONTEO (design-review 2026-08-18, reverificado el 2026-08-25 sobre el disco):
 * la cadena completa estaba escrita a mano SIETE veces —`deep-dive` ×3,
 * `formacion`, `hitos`, `trayectoria` ×2— y otras DOS llamaban a `eyebrowVariants`
 * y le pisaban el tamaño con `text-[0.7rem]`, que es la señal de que la variante
 * que usaban no era la suya. Esas dos se mueven DOS veces, y conviene decirlo
 * entero: el tamaño sube de 0,7 a 0,72rem —un tercio de píxel— y el tracking baja
 * de 0,09 a 0,08em, porque lo heredaban del eyebrow y nadie lo había elegido. Lo
 * que se gana es que dejan de pisar nada.
 *
 * LO QUE NO ENTRA, y no por descuido: el rótulo de la ficha del Design System
 * (0,72rem pero en `--foreground` y a 0,05em) es otra familia —va sobre la
 * superficie de tarjeta y no atenuado—, y lo factoriza `SpecimenCard`. Y los
 * sueltos con tracking propio (la banda de manifiesto a 0,11em, el mensaje de
 * sistema a 0,12em) son decisiones de su bloque, no copias de esta.
 *
 * El margen se queda en el call site, igual que en `eyebrowVariants` fuera de
 * `SectionHeader`: aquí no hay un `size` del que derivarlo.
 */
export const dataLabelVariants = cva(
  "text-muted-foreground m-0 text-[0.72rem] font-semibold tracking-[0.08em] uppercase",
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
      /**
       * El escalón por debajo de `sub`: el titular de un bloque de apoyo dentro
       * de una sección — el «antes / después» de una demo, la nota que acompaña a
       * un espécimen, el rótulo de una lista larga.
       *
       * NACE DE UN CONTEO, no de una intuición (design-review 2026-08-23): la
       * cadena `font-display m-0 text-[1rem] font-semibold` estaba escrita a mano
       * **ocho veces**, idéntica, en siete archivos del Design System — la página
       * que existe precisamente para que nada del sistema se escriba dos veces.
       *
       * NO LLEVA `clamp` a propósito, y no es un descuido de forma: a 1rem no hay
       * nada que escalar. Los tamaños de arriba crecen porque un titular de página
       * a 2,75rem en móvil y 5rem en escritorio son dos decisiones distintas; este
       * es texto de apoyo y su tamaño es el mismo en los dos sitios.
       */
      "sub-sm": "text-[1rem] leading-[1.5]",
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
  "sub-sm": "mb-2",
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
  "sub-sm": "mb-3",
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

/**
 * EL ORDINAL, DICHO EN EL NOMBRE ACCESIBLE DEL TITULAR (P70.10, pasada con NVDA).
 *
 * D43 fija que el ordinal va DENTRO del eyebrow, y el eyebrow es un `<p>`
 * ANTERIOR al titular. Navegar con H —que es como se recorre una página larga con
 * lector— salta de encabezado en encabezado y se lleva SOLO el titular: se oye
 * «WCAG 2.2 AA cumplido, con el contraste medido» y el «01» no suena nunca.
 *
 * NO ES UN DEFECTO, y por eso el arreglo es este y no otro: el titular solo es una
 * afirmación completa, que es justamente la intención de D43. La pregunta era si
 * el ordinal es decoración visual o información de orientación, y quien lo ha oído
 * dice que orienta. Así que entra en el NOMBRE, no en la pantalla: D43 sigue en
 * pie y el ordinal no se pinta dos veces.
 *
 * SIN LA RAYA, y no por la regla del copy —que mira el texto que se sirve— sino
 * porque aquí se OYE: `01 — Conformidad` tiene un signo cuyo anuncio depende del
 * nivel de puntuación del lector. El punto es un signo que ningún lector pronuncia
 * y que sí produce la pausa que separa el ordinal del titular.
 */
export function TitleOrdinal({ ordinal }: { ordinal: string }) {
  return <span className="sr-only">{`${ordinal}. `}</span>;
}

/**
 * El ordinal de un eyebrow numerado, o `null`. Se DERIVA en vez de pedirse por
 * prop porque el formato ya existe y es uno solo —`NN — Etiqueta`, la convención
 * de D43— en las tres familias numeradas del sitio: las dieciséis secciones del
 * Design System, las seis del Brand Kit y las ocho de Accesibilidad. Pedirlo por
 * prop obligaría a escribir el número otra vez en cada uno de esos call sites, que
 * es exactamente la copia que la capa de cabecera existe para evitar.
 *
 * Los eyebrows que no empiezan por número —los kickers de los heros— no casan y no
 * cambian.
 */
const ORDINAL = /^(\d{1,2})\s*—/;

export function ordinalDeEyebrow(eyebrow: ReactNode): string | null {
  return typeof eyebrow === "string"
    ? (ORDINAL.exec(eyebrow)?.[1] ?? null)
    : null;
}

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
  const ordinal = ordinalDeEyebrow(eyebrow);

  // LOS NOMBRES PROPIOS, MARCADOS AQUÍ Y NO EN CADA CABECERA. Toda cabecera del
  // sitio pasa por este componente (D43), así que es el sitio donde «TheTool» y
  // «Emendu» dejan de ser traducibles de una vez para las 28 variantes en lugar
  // de una por titular. Solo cuando llegan como cadena: un `ReactNode` ya trae su
  // markup y no es nuestro para reescribir. Ver `components/ui/marcas.tsx`.
  const rotulo = typeof eyebrow === "string" ? marcarMarcas(eyebrow) : eyebrow;
  const titular = typeof title === "string" ? marcarMarcas(title) : title;

  return (
    <>
      {eyebrow ? (
        <p
          {...(reveal ? { "data-reveal": true } : {})}
          className={cn(eyebrowVariants(), EYEBROW_GAP[size])}
        >
          {rotulo}
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
        {ordinal ? <TitleOrdinal ordinal={ordinal} /> : null}
        {titular}
      </Title>
      {children}
    </>
  );
}
