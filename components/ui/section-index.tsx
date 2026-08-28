// @pieza primitiva · design-system/10-composicion.tsx · La navegación de una página con paradas: el índice y el cierre de bloque.

import { cva } from "class-variance-authority";
import { Fragment, type ReactNode } from "react";

import { cn } from "@/lib/utils";

import { chromeLinkVariants } from "./chrome";
import { SECTION, WRAP } from "./layout";
import { eyebrowVariants, LEADING } from "./heading";

// LA NAVEGACIÓN DE UNA PÁGINA CON PARADAS (P70.38, 2026-08-26).
//
// NACIÓ EN LA CAPA DE ARTÍCULO Y SE FUE DE ELLA, y eso corrige la premisa de una
// decisión, no un descuido. D76 dejó `ui/article.tsx` fuera del núcleo con este
// argumento textual: «resuelve un FORMATO, el de texto largo con paradas, que hoy
// solo tiene UNA página». En cuanto el índice entra también en Design System,
// Brand Kit y Accesibilidad, esa frase deja de ser cierta para estas tres piezas
// —el índice, el riel y el cierre de bloque— y sigue siéndolo para el resto de la
// capa, que sí es de texto largo: portada de capítulo, cita, firma, prosa.
//
// Es exactamente el movimiento que D113 hizo con `LiveStat` cuando `/accesibilidad`
// quiso publicar una cifra derivada. Segunda vez, mismo mecanismo: la premisa de
// D76 no se rompe de golpe, se rompe pieza a pieza.
//
// POR QUÉ `primitiva` Y NO `núcleo`. El núcleo de D36 es lo que usa TODO el sitio
// —un botón, un enlace de nav, una etiqueta—; esto lo usan cuatro páginas de
// catorce. Su hermana exacta ya está en `primitiva`: `page-closer.tsx` es el
// cierre común de una página, y esto es su índice. Mismo peldaño.
//
// POR QUÉ SE LLAMAN `Section*` Y NO `Article*`. Una sección del Design System no
// es un capítulo, y llamarla así obligaba a leer «artículo» en cuatro páginas que
// no lo son. El nombre es la mitad de lo que hace reutilizable una pieza.
//
// QUÉ NO SE VINO. `ReadingProgress` se queda en `article-islands.tsx`: mide cuánto
// texto queda por LEER, y en una página de consulta —a la que se llega buscando una
// sección concreta— esa cifra no significa nada. Que dos piezas vecinas se muevan
// no arrastra a la tercera.

/* ───────────────────────── El marco de una parada ───────────────────────── */

/**
 * LO QUE UNA SECCIÓN NECESITA SABER DE SU SITIO EN EL RECORRIDO, y que por
 * definición no puede saber ella (P70.39).
 *
 * Las tres cosas de aquí dependen del ORDEN de la página, no del contenido de la
 * sección: su ancla, el ordinal que abre su cabecera y el cierre de bloque que
 * dice «7 de 12». Ese orden vive en un solo sitio —el `index.tsx` de cada página—,
 * que es lo que impide que el índice diga «07» y la cabecera «08».
 *
 * Vive AQUÍ y no en el `shared.tsx` de una página porque lo usan tres: Design
 * System, Brand Kit y Accesibilidad. Es el tipo compañero de estas piezas.
 *
 * Y es UN prop y no tres: una sección no compone su marco, lo recibe entero.
 */
export type SeccionMarco = {
  /** `s01`…`sNN`. Idéntico en `es/` y `en/` porque lo deriva el orden, no el copy. */
  id: string;
  /** El eyebrow ya compuesto: «01 — Rejilla y medidas» (D43). */
  kicker: string;
  /** El `SectionCloser` ya montado, con su posición y su siguiente parada. */
  closer: ReactNode;
};

/* ───────────────────────── La celda pulsable ───────────────────────── */

/**
 * EL CASO «CELDA PULSABLE», que a la capa le faltaba.
 *
 * Era una de las cuatro excepciones vivas de `BRAND.md` §Ningún control se escribe
 * a mano, con su condición de salida escrita: «sale cuando la capa tenga el caso
 * celda pulsable». Aquí está, y la excepción se retira.
 *
 * NO ES `actionVariants({ variant: "card" })`, y por el motivo que ya decía la
 * excepción: una tarjeta dibuja su PROPIA caja —borde y radio— y esto vive dentro
 * de una cuadrícula que ya cierra sus filetes con el `<li>`. Darle caja propia
 * pintaría un borde encima de otro. Lo que comparte con la tarjeta es lo que
 * importa —pastilla `muted` en hover, el mismo estado en `focus-visible`, y el
 * objetivo táctil por altura— y eso es justo lo que ahora sale de un sitio.
 *
 * `focus-visible:bg-muted` además de `hover:` porque un objetivo que solo responde
 * al cursor no existe para el teclado; sus dos hermanas salieron a la variante
 * `card` en P70.15 y esta se quedó fuera por no tener dónde ir.
 */
export const indexCellVariants = cva(
  "hover:bg-muted focus-visible:bg-muted flex min-h-[7.5rem] flex-col justify-center gap-1 px-5 py-4 no-underline transition-colors",
);

/* ───────────────────────── SectionIndex ───────────────────────── */

export type IndexItem = {
  /** El ancla de la sección. Estable entre locales: `s01`…`sNN` en ES y en EN. */
  id: string;
  ordinal: string;
  label: string;
  /**
   * La tercera línea de la celda, opcional y LIBRE.
   *
   * ERA `minutes: number` y pintaba «≈4 min». Eso solo es verdad donde la sección
   * es prosa: en el Design System, el Brand Kit y Accesibilidad no hay nada que
   * cronometrar, y publicar un tiempo de lectura calculado sobre especímenes sería
   * inventarse una cifra — que es justo lo que D38 existe para impedir.
   *
   * Como slot, cada página decide qué pone o si no pone nada: el artículo le pasa
   * su tiempo por sección; una hermana puede pasar un recuento, un estado, o
   * dejarlo vacío. La pieza deja de saber qué significa el dato, que es lo que la
   * vuelve reutilizable.
   */
  meta?: ReactNode;
};

/**
 * El índice navegable de una página con paradas, pintado en SERVIDOR: no hace
 * falta JS para verlo ni para saltar. Rejilla continua —el ordinal grande sobre la
 * etiqueta, sin caja propia por celda, con filetes de división y una pastilla de
 * hover que ocupa la celda entera (P60, feedback de diseño: «variante C»).
 *
 * `intro` es un slot opcional entre el eyebrow y la rejilla — en el artículo lleva
 * el recuento de palabras y la nota de lectura, que vivían ANTES del eyebrow
 * «ÍNDICE»: dos elementos con la misma función, uno encima del otro (feedback de
 * P60 tanda 2). Aquí quedan bajo su propio rótulo.
 */
export function SectionIndex({
  kicker,
  aside,
  ariaLabel,
  intro,
  items,
}: {
  kicker: string;
  /** La nota a la derecha del eyebrow. El artículo pone ahí su tiempo total. */
  aside?: string;
  ariaLabel: string;
  intro?: ReactNode;
  items: IndexItem[];
}) {
  return (
    <nav aria-label={ariaLabel} data-reveal>
      <div className="border-border flex items-baseline justify-between gap-3 border-b px-1 pb-3">
        <p className={cn(eyebrowVariants(), "m-0")}>{kicker}</p>
        {aside ? (
          <span
            className={cn(
              "text-muted-foreground hidden text-[0.78rem] sm:inline",
              LEADING.meta,
            )}
          >
            {aside}
          </span>
        ) : null}
      </div>
      {intro ? <div className="px-1 pt-4 pb-1">{intro}</div> : null}
      {/* `border-t` además de `border-l` (P60 tanda 3-bis, punto 1): sin ella
          la rejilla se leía cortada por arriba, como una tabla sin cabecera —
          las celdas ya cierran su propio borde inferior y derecho, pero nada
          dibujaba el de arriba. */}
      <ol className="border-border m-0 mt-3 grid list-none grid-cols-1 border-t border-l p-0 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.id} className="border-border border-r border-b">
            <a href={`#${item.id}`} className={indexCellVariants()}>
              <span className="font-display text-[1.9rem] leading-none font-semibold">
                {item.ordinal}
              </span>
              <span
                className={cn(
                  "text-foreground text-[0.95rem] font-medium",
                  LEADING.meta,
                )}
              >
                {item.label}
              </span>
              {item.meta ? (
                <span
                  className={cn(
                    "text-muted-foreground mt-1 font-mono text-[0.75rem]",
                    LEADING.meta,
                  )}
                >
                  {item.meta}
                </span>
              ) : null}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ───────────────────────── La nota del índice ───────────────────────── */

/**
 * LA FRASE QUE ORIENTA AL LECTOR, bajo el eyebrow del índice y sobre la rejilla.
 *
 * Vivía escrita a mano en el artículo y las tres páginas del sistema la querían
 * igual (P70.41): cuatro copias de la misma cadena de clases es justo lo que la
 * Regla de construcción manda subir a la capa.
 *
 * `figuras` es una lista y no un par de campos porque el artículo publica DOS
 * —palabras y secciones— y las páginas de consulta solo una. El separador `·`
 * lo pone la pieza entre figuras, nunca el copy.
 *
 * Los valores llegan YA FORMATEADOS: el artículo agrupa millares y eso depende
 * del locale (`5.900` en español es `5,900` en inglés), así que quien sabe hacerlo
 * es el llamador, que tiene el `lang`.
 */
export function IndexNote({
  note,
  figures,
}: {
  note: string;
  figures: { value: string; suffix: string }[];
}) {
  return (
    <p
      data-reveal
      className={cn(
        "text-muted-foreground m-0 max-w-[var(--measure)] text-[0.9rem]",
        LEADING.lead,
      )}
    >
      {note}{" "}
      {figures.map((f, i) => (
        <Fragment key={f.suffix}>
          {i > 0 ? <span className="mx-[0.5em]">·</span> : null}
          <b className="text-foreground font-medium">{f.value}</b> {f.suffix}
        </Fragment>
      ))}
    </p>
  );
}

/* ───────────────────────── SectionCloser ───────────────────────── */

/** La transición entre secciones: puntos de posición + vuelta al índice +
 * siguiente parada. Los puntos son decorativos —«N de M» ya lo dice en
 * texto—, así que no repiten la info por color (punto 6 del checklist).
 *
 * Se llamaba `ChapterNav`. Es el «cierre de bloque», y su hermana de nombre es
 * `PageCloser`: una cierra la página, esta cierra una sección. */
export function SectionCloser({
  position,
  total,
  indexLabel,
  indexHref,
  nextLabel,
  nextHref,
  positionLabel,
  ariaLabel,
}: {
  position: number;
  total: number;
  indexLabel: string;
  indexHref: string;
  /** Sin `nextHref` (el cierre, que no tiene «siguiente»), no se lee. */
  nextLabel?: string;
  nextHref?: string;
  positionLabel: string;
  /**
   * EL NOMBRE ACCESIBLE, que llevaba «Entre secciones» LITERAL en el componente
   * (P70.40). En `/en/*` los seis cierres anunciaban «Entre secciones · 1 of 6»:
   * mitad en español, mitad en inglés. Mismo defecto que acababa de arreglarse en
   * `SectionRail`, en su pieza hermana y a tres metros — por eso se busca en las
   * DOS al arreglar una.
   *
   * Sigue llevando la posición dentro: axe marca `landmark-unique` si N `<nav>` de
   * la misma página comparten nombre exacto, y aquí hay uno por sección.
   */
  ariaLabel: string;
}) {
  return (
    // El `aria-label` lo compone el llamador con su copy, más la posición: axe
    // marca `landmark-unique` si N `<nav>` de la misma página comparten nombre
    // accesible exacto, y aquí hay uno por sección.
    <nav
      aria-label={`${ariaLabel} · ${positionLabel}`}
      className="border-border mt-[2.5rem] flex flex-wrap items-center gap-x-4 gap-y-3 border-t pt-5"
    >
      <p
        className={cn(
          "text-muted-foreground m-0 flex items-center gap-2 text-[0.85rem]",
          LEADING.meta,
        )}
      >
        {/* Vistas en negro, pendientes en gris, y la ACTUAL en morado — el eje
            que faltaba (feedback de diseño de P60): antes «vista» y «actual»
            se confundían en el mismo negro. */}
        <span aria-hidden="true" className="flex gap-[3px]">
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              className={cn(
                "size-[6px] rounded-full",
                i === position - 1
                  ? "bg-brand-purple"
                  : i < position - 1
                    ? "bg-foreground"
                    : "bg-border",
              )}
            />
          ))}
        </span>
        {positionLabel}
      </p>
      <span className="flex-1" />
      <a
        href={indexHref}
        className={chromeLinkVariants({ shape: "inline", tone: "muted" })}
      >
        {indexLabel}
      </a>
      {nextHref ? (
        <a
          href={nextHref}
          className={chromeLinkVariants({ shape: "inline", tone: "default" })}
        >
          {nextLabel}
        </a>
      ) : null}
    </nav>
  );
}

/* ─────────────────── El recorrido, construido una sola vez ─────────────────── */

/**
 * UNA PARADA YA DERIVADA. Es un `IndexItem` con su clave: lo que la página
 * necesita para indexar por nombre (`marcos.botones`) sin dejar de servir tal
 * cual como `items` del índice y de la banda de bloque.
 */
export type Parada<K extends string = string> = {
  clave: K;
  id: string;
  ordinal: string;
  label: string;
};

/**
 * El copy del bloque de índice ENTERO: lo que el recorrido necesita (arriba) más
 * lo que rotula la rejilla. Es la rama `indice` del diccionario de las tres
 * páginas del sistema, tal cual.
 */
export type IndiceDict = RecorridoDict & {
  kicker: string;
  ariaLabel: string;
  note: string;
  sectionsSuffix: string;
};

/** El copy que el recorrido necesita, y que la pieza no puede inventarse. */
export type RecorridoDict = {
  closerLabel: string;
  nextLabel: string;
  of: string;
  closerAriaLabel: string;
};

/**
 * EL RECORRIDO DE UNA PÁGINA CON PARADAS, DERIVADO DE SU ORDEN (P50.88).
 *
 * Estaban las mismas 26 líneas escritas TRES VECES —Design System, Brand Kit y
 * Accesibilidad—, y `qlty` las medía como duplicación idéntica (mass 163). Es la
 * Regla de construcción de `CLAUDE.md` aplicada a la capa de página en vez de a un
 * control: si un caso se repite, sube a la capa. El modo de fallo no es estético
 * y está escrito en `BRAND.md` §Cómo se escribe una regla (5): lo que hoy es
 * idéntico deja de serlo al primer retoque, y entonces hay que acordarse de tres
 * sitios.
 *
 * EL CUARTO CONSUMIDOR NO ENTRA, y se comprobó antes de unificar (regla 4 de
 * `BRAND.md`): las paradas del artículo salen de un array del diccionario con
 * `id` y `ordinal` propios —más un `meta` con su tiempo de lectura— y su cierre
 * se monta por sección dentro del bucle. No es el mismo cálculo, así que el
 * constructor sirve a tres y no a cuatro. No hay que forzarlo.
 *
 * Devuelve el `Record` INDEXADO POR CLAVE y no por posición: en el JSX se lee
 * `marcos.botones`, que no puede desalinearse al insertar una sección en medio
 * como sí haría un `marco(6)`.
 *
 * El eyebrow se compone con una PLANTILLA y no con dos nodos JSX a propósito:
 * React separa nodos de texto adyacentes con `<!-- -->`, y el rótulo que hoy
 * sirve el sitio es una sola cadena.
 */
export function construirRecorrido<K extends string>(
  orden: readonly K[],
  labels: Record<K, { indexLabel: string }>,
  indice: RecorridoDict,
  anclaIndice: string,
): { paradas: Parada<K>[]; marcos: Record<K, SeccionMarco> } {
  const paradas: Parada<K>[] = orden.map((clave, i) => {
    const ordinal = String(i + 1).padStart(2, "0");
    return {
      clave,
      id: `s${ordinal}`,
      ordinal,
      label: labels[clave].indexLabel,
    };
  });

  const marcos = Object.fromEntries(
    paradas.map((parada, i) => {
      const siguiente = paradas[i + 1];
      const marco: SeccionMarco = {
        id: parada.id,
        kicker: `${parada.ordinal} — ${parada.label}`,
        closer: (
          <SectionCloser
            position={i + 1}
            total={paradas.length}
            indexLabel={indice.closerLabel}
            indexHref={`#${anclaIndice}`}
            nextLabel={
              siguiente
                ? `${indice.nextLabel} ${siguiente.ordinal} · ${siguiente.label}`
                : undefined
            }
            nextHref={siguiente ? `#${siguiente.id}` : undefined}
            ariaLabel={indice.closerAriaLabel}
            positionLabel={`${i + 1} ${indice.of} ${paradas.length}`}
          />
        ),
      };
      return [parada.clave, marco] as const;
    }),
  ) as Record<K, SeccionMarco>;

  return { paradas, marcos };
}

/**
 * EL BLOQUE DE ÍNDICE DE UNA PÁGINA CON PARADAS — la sección entera, con su ancla
 * y su nota (P50.88, tercera familia).
 *
 * `qlty` la medía como 23 líneas similares en dos sitios (mass 84), y en realidad
 * eran TRES con las hermanas: mismo `<section>`, mismo `WRAP`, mismo `SectionIndex`
 * y misma `IndexNote` con la única figura que estas páginas publican, el recuento
 * de secciones — que además sale de `items.length`, así que nadie lo escribe.
 *
 * `scroll-mt-[5rem]`: el nav es sticky y sin margen de scroll el ancla deja la
 * sección arrancando por debajo de él. Es la misma distancia que usa el riel para
 * librarlo (`top-[5rem]`), así que si el nav cambia de alto se mueven los dos
 * juntos.
 *
 * SIN `meta` POR CELDA, y no es un olvido: en el artículo esa línea es el tiempo
 * de lectura, y en las tres páginas del sistema no hay prosa que cronometrar.
 * Publicar un tiempo calculado sobre especímenes sería inventarse una cifra, que
 * es contra lo que existe D38 — por eso `meta` es opcional desde P70.38. El
 * artículo, que sí lo publica, monta su índice a mano: no pasa por aquí.
 */
export function SectionIndexBlock({
  id,
  t,
  items,
}: {
  id: string;
  t: IndiceDict;
  items: IndexItem[];
}) {
  return (
    <section id={id} className={cn(SECTION, "scroll-mt-[5rem]")}>
      <div className={WRAP}>
        <SectionIndex
          kicker={t.kicker}
          ariaLabel={t.ariaLabel}
          items={items}
          intro={
            <IndexNote
              note={t.note}
              figures={[
                { value: String(items.length), suffix: t.sectionsSuffix },
              ]}
            />
          }
        />
      </div>
    </section>
  );
}
