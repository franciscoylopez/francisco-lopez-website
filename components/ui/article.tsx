// @pieza artículo · design-system/12-articulo.tsx · Los bloques del texto largo: firma, portada de capítulo, cita, franja de repo y diagrama.

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { ComponentType, ReactNode } from "react";

import { GITHUB_URL } from "@/lib/contact";
import type { ArticleBlock } from "@/lib/reading-time";
import { cn } from "@/lib/utils";

import { Rich } from "./rich";
import { chromeLinkVariants } from "./chrome";
import {
  eyebrowVariants,
  LEADING,
  TitleOrdinal,
  titleVariants,
} from "./heading";
import { LiveStat } from "./live-stat";

// Capa de ARTÍCULO LARGO del sistema (P60). Ninguna de estas piezas sabe nada de
// ESTE sitio —reciben texto y hrefs, no copy propio ni rutas— así que viven en
// `ui/`, no en `site/` (frontera de D36/CLAUDE.md «Regla de construcción»). Es
// el mismo peldaño que `heading.tsx`/`badge.tsx`, una capa arriba: el sistema
// no tenía todavía una forma para "texto largo con paradas", y «Cómo se ha
// creado esta página» es la primera que lo necesita.
//
// Todas se publican en el Design System (sección 15) antes de dar la tarea por
// hecha, como pide la Regla de construcción.

/* ───────────────────────── ByLine ───────────────────────── */

/** Avatar + nombre + rol del autor, en la apertura del artículo. Con
 * `photoSrc`, la foto real recortada 1:1; sin ella, iniciales sobre
 * `--muted` (mismo tratamiento que un avatar sin imagen en cualquier
 * sistema), que sigue siendo el valor por defecto de la pieza. */
export function ByLine({
  name,
  role,
  photoSrc,
  photoAlt,
}: {
  name: string;
  role: string;
  photoSrc?: string;
  photoAlt?: string;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="flex items-center gap-[0.85rem]">
      {photoSrc ? (
        <span className="relative size-11 shrink-0 overflow-hidden rounded-full">
          <Image
            src={photoSrc}
            alt={photoAlt ?? ""}
            fill
            sizes="44px"
            className="object-cover"
          />
        </span>
      ) : (
        <span
          aria-hidden="true"
          className="bg-muted text-foreground flex size-11 shrink-0 items-center justify-center rounded-full text-[0.85rem] font-semibold"
        >
          {initials}
        </span>
      )}
      <div>
        <div className={cn("text-[0.95rem] font-semibold", LEADING.meta)}>
          {name}
        </div>
        <div
          className={cn("text-muted-foreground text-[0.85rem]", LEADING.meta)}
        >
          {role}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── SectionCover ───────────────────────── */

/** La portada de una sección: kicker + titular a la izquierda, y a la DERECHA
 * el ordinal ilustrado con la línea de meta («8 de 11 · 4 min») debajo —
 * feedback de diseño de P60 tanda 2: con la meta-línea
 * pegada a la cabecera y el numeral grande al otro lado, la apertura de
 * sección apelotonaba tres piezas de información en el mismo golpe de vista.
 * La meta-línea se duplica con visibilidad responsive (una copia junto al
 * kicker en móvil, donde el numeral se oculta; otra bajo el numeral desde
 * `sm:`) en vez de reordenarla con flex, para no perder la información en
 * pantallas pequeñas.
 *
 * El ordinal ya está dicho en texto accesible por el kicker, pero eso no
 * exime al numeral grande de WCAG 1.4.3: `aria-hidden` lo saca del árbol de
 * accesibilidad, no de la vista, y alguien con baja visión SÍ lo lee. Antes
 * era `text-muted-foreground` porque ningún morado pasaba 3:1 sobre
 * `--background` en claro (BRAND.md §El morado como gráfico) — pero el
 * numeral vive directamente sobre `--background`, la misma superficie para la
 * que ya existe `--progress-ink` (calibrado 0.45 claro / 0.78 oscuro contra
 * ELLA, no contra una media de dos fondos). Reutilizarlo aquí generaliza su
 * alcance más allá de la barra de lectura — BRAND.md actualizado. */
export function SectionCover({
  ordinal,
  kicker,
  title,
  id,
  metaLine,
  level = 2,
}: {
  ordinal: string;
  kicker: string;
  title: string;
  id: string;
  /** «8 de 11 · 4 min», ya compuesta por el llamador (los tres fragmentos son
   * copy, y el número de sección/minutos se calcula en build — D60). */
  metaLine: string;
  /**
   * El nivel del titular. `2` en la página real, donde la portada de sección
   * ES una sección de la página. El espécimen del Design System la anida bajo
   * el `h2` de «15 — Artículo largo» y el `h3` de su subapartado, así que ahí
   * tiene que ser `4`: mismo criterio que `SectionHeader.level`, la semántica
   * del DOM no la decide cuánto mide el texto (punto 4 del checklist).
   */
  level?: 2 | 3 | 4;
}) {
  const Title = `h${level}` as const;
  const metaLineText = (
    <p
      className={cn(
        "text-muted-foreground m-0 font-mono text-[0.7rem] tracking-[0.06em] uppercase",
        LEADING.meta,
      )}
    >
      {metaLine}
    </p>
  );
  return (
    <div className="mb-[clamp(2rem,4vw,3rem)] flex items-start justify-between gap-[clamp(1.5rem,4vw,3rem)]">
      <header className="min-w-0">
        <div className="mb-2 sm:hidden">{metaLineText}</div>
        <p className={cn(eyebrowVariants(), "mb-3")}>{kicker}</p>
        {/* El ordinal entra en el nombre accesible del titular (P70.10). Aquí
            no se deriva del kicker: esta portada YA lo recibe suelto, que es la
            misma información sin el rodeo. El numeral grande de la derecha
            sigue `aria-hidden`, así que no se dice dos veces. */}
        <Title
          id={id}
          className={cn(titleVariants({ size: "section-sm" }), "max-w-[24ch]")}
        >
          <TitleOrdinal ordinal={ordinal} />
          {title}
        </Title>
      </header>
      {/* `items-center` (P60 tanda 3-bis, punto 2): con `items-end` la
          meta-línea quedaba pegada al borde derecho del numeral en vez de
          centrada bajo su caja — el ancho de la caja del numeral y el del
          texto no coinciden, así que alinear a la derecha desalinea el
          centro visual. */}
      <div className="hidden shrink-0 flex-col items-center gap-2 sm:flex">
        <span
          aria-hidden="true"
          className="text-progress-ink border-progress-ink/30 font-display rounded-2xl border text-[clamp(2.5rem,5vw,4rem)] leading-none font-semibold"
          style={{ padding: "0.5em 0.65em" }}
        >
          {ordinal}
        </span>
        <div className="text-center">{metaLineText}</div>
      </div>
    </div>
  );
}

/* ───────────────────────── Prosa ───────────────────────── */

/** El cuerpo de una sección: párrafos, `h3` de subapartado, listas, citas y
 * diagramas, con énfasis inline vía `Rich` (D23). Es el mismo tipo
 * `ArticleBlock` que cuenta `lib/reading-time.ts`, así que el diccionario no
 * se recompone en dos sitios. */
export function ArticleProse({
  blocks,
  diagrams,
  resolveLiveStatHref,
  liveStatExtras,
}: {
  blocks: ArticleBlock[];
  /** Registro site-specific id→componente de los diagramas citados en
   * `blocks` (`type: "diagram"`). Vive en el llamador (`como-se-ha-creado.tsx`,
   * frontera de D36): esta pieza no sabe dibujar nada, solo resolverlo y
   * flotarlo en el punto exacto del cuerpo donde el diccionario lo ancló. */
  diagrams?: Record<string, ComponentType>;
  /** El `href` de un `{ type: "livestat" }` es un slug relativo
   * («design-system») o el literal «github»; resolverlo a una URL de verdad
   * depende del locale y de `GITHUB_URL`, que son cosas del sitio, no de esta
   * pieza (D36) — el llamador decide cómo. */
  resolveLiveStatHref?: (href: string) => string;
  /** Registro site-specific id→ejemplo real (P60 tanda 2, punto 17): el
   * `LiveStat` de una sección puede mostrar una pieza real del sitio, no solo
   * el dato en texto. */
  liveStatExtras?: Record<string, ReactNode>;
}) {
  return (
    // `flow-root`: crea un contexto de bloque que CONTIENE los floats propios
    // de `Pullquote`/`Pull`/`DiagramPanel`. Sin esto, una cita o un diagrama
    // flotado cerca del final de la prosa se colaba visualmente sobre
    // `RepoStrip`/`SectionCloser` —hermanos fuera de este contenedor, en normal
    // flow— en vez de quedar contenido dentro de su propia sección (feedback
    // de P60 tanda 2, punto 12: «eso no tiene sentido, nunca debería ocurrir»).
    // El espaciado entre bloques sube de 1.15rem a 1.75rem por la misma tanda
    // (punto 7): a 1.15rem el salto de párrafo a lista apenas se distinguía
    // del propio interlineado (1.7) del párrafo — el aire se gana ENTRE
    // bloques, nunca recortando el interlineado, que es legibilidad.
    <div className="flow-root max-w-[var(--prose-w,78rem)] space-y-[1.75rem]">
      {blocks.map((block, i) => {
        if (block.type === "h3") {
          return (
            <h3
              key={i}
              // `clear-both` (P60 tanda 3-bis, punto 7): `ArticleProse` es UN
              // `flow-root` para toda la sección, no uno por subapartado —
              // así que un diagrama o cita flotados bajo un `h3` podían seguir
              // cayendo, sin cortarse, sobre el `h3` SIGUIENTE y su texto, y
              // visualmente parecía que el gráfico pertenecía al subapartado
              // equivocado aunque el dato estuviera en el bloque correcto.
              // Cada cabecera de subapartado cierra ahora los flotantes de su
              // predecesora antes de empezar la suya.
              className={cn(
                titleVariants({ size: "sub" }),
                "clear-both !mt-[2.5rem]",
              )}
            >
              {block.text}
            </h3>
          );
        }
        if (block.type === "ul") {
          // Ancho de MEDIA COLUMNA (`--measure`, ~42rem) y no el del contenedor
          // del artículo: a ancho completo la viñeta y el final de línea quedan
          // a medio metro uno del otro y la lista deja de leerse como lista —
          // mismo motivo y mismo ancho que las listas del deep-dive. La marca es
          // cuadrada (no el punto redondo de antes): feedback de diseño de P60.
          //
          // `!my-[2.25rem]` (P60 tanda 3-bis, punto 3): los márgenes de
          // bloques hermanos COLAPSAN al máximo, no se suman, así que subir
          // el propio margen de la lista por encima del `space-y-[1.75rem]`
          // del contenedor separa la lista del texto de alrededor sin tocar
          // el espaciado párrafo-a-párrafo. Sin esto, el hueco ENTRE viñetas
          // (0,7rem + el interlineado de cada una) se leía más grande que el
          // hueco entre la lista entera y el texto que la rodea.
          return (
            <ul
              key={i}
              className="m-0 !my-[2.25rem] max-w-[var(--measure)] list-none space-y-[0.7rem] p-0"
            >
              {block.items.map((item, j) => (
                <li
                  key={j}
                  className={cn("flex gap-3 text-[1.02rem]", LEADING.prose)}
                >
                  <span
                    aria-hidden="true"
                    className="bg-primary mt-[0.65em] size-[6px] shrink-0"
                  />
                  <span>
                    <Rich text={item} />
                  </span>
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "quote") {
          return block.style === "pullquote" ? (
            <Pullquote key={i} side={block.side}>
              {block.text}
            </Pullquote>
          ) : (
            <Pull key={i} side={block.side}>
              {block.text}
            </Pull>
          );
        }
        if (block.type === "diagram") {
          const Diagram = diagrams?.[block.id];
          if (!Diagram) return null;
          return (
            <DiagramPanel key={i} caption={block.caption} side={block.side}>
              <Diagram />
            </DiagramPanel>
          );
        }
        if (block.type === "image") {
          // El artefacto REAL de un tercero (D54), no una recreación con
          // tokens: mismo marco que `DiagramPanel` —misma caja, mismo
          // pie—, pero dentro va la captura tal cual, con su ancho y alto
          // reales para que `next/image` le reserve el hueco sin salto de
          // layout.
          return (
            <DiagramPanel key={i} caption={block.caption} side={block.side}>
              <Image
                src={block.src}
                alt={block.alt}
                width={block.width}
                height={block.height}
                className="h-auto w-full rounded-md"
              />
            </DiagramPanel>
          );
        }
        if (block.type === "livestat") {
          return (
            <LiveStat
              key={i}
              label={block.label}
              source={block.source}
              value={block.value}
              linkLabel={block.linkLabel}
              href={resolveLiveStatHref?.(block.href) ?? block.href}
              example={liveStatExtras?.[block.id]}
            />
          );
        }
        return (
          // EL ESPACIO ENTRE PÁRRAFOS VA AQUÍ Y NO EN EL `space-y` DE ARRIBA,
          // y es un arreglo, no una preferencia (P68.493, 2026-08-24). El
          // contenedor pide `space-y-[1.75rem]` desde P60 y ese margen NUNCA
          // se ha pintado entre dos párrafos: Tailwind v4 compila `space-y-*`
          // envuelto en `:where(…)`, que tiene especificidad CERO, y el `m-0`
          // de esta misma línea (0-1-0) lo gana siempre, da igual el orden.
          // En v3 el selector era `> :not([hidden]) ~ :not([hidden])` y ganaba
          // él; al estrenar v4 dejó de ser cierto sin que nada fallara. Es la
          // tercera sorpresa de la misma familia que cuenta el artículo, con
          // su misma firma: el error no da la cara.
          //
          // POR QUÉ SOLO SE VEÍA EN EL CIERRE. Los demás bloques traen margen
          // propio y con `!` —`h3` su `!mt-[2.5rem]`, `ul` su `!my-[2.25rem]`,
          // el diagrama el suyo—, así que ganan al `:where()` y su ritmo sí
          // se pinta. El párrafo era el único que dependía del `space-y`, y el
          // cierre, la única sección hecha solo de párrafos: siete seguidos y
          // pegados. En el resto lo tapaban los subtítulos y las listas.
          //
          // Y SE ARREGLA ENTRE PÁRRAFOS, no quitando el `m-0`: el `space-y`
          // SÍ funciona para los hijos que no llevan `m-0` (el marco de un
          // diagrama recibe de él su margen inferior), así que quitarlo o
          // desactivarlo rompería ese ritmo para arreglar este.
          <p
            key={i}
            className={cn(
              "m-0 text-[1.02rem] [&+p]:mt-[1.75rem]",
              LEADING.prose,
            )}
          >
            <Rich text={block.text} />
          </p>
        );
      })}
    </div>
  );
}

/* ───────────────────────── Citas ───────────────────────── */

/** Cita destacada: integrada en el flujo de lectura como una cita de revista,
 * flotando a un lado (`side`) mientras el texto sigue alrededor — no un
 * bloque que interrumpe la columna entera (feedback de diseño de P60). Marcas
 * de esquina en morado: el único uso "gráfico" del morado que no necesita 3:1
 * porque no transporta información, es ornamento sobre un texto que ya se lee
 * solo. Sin rótulo «LA FRASE DE LA SECCIÓN» (P60 tanda 2, punto 8): era un
 * marcador de autoría de las seis apariciones, literalmente el mismo texto
 * las seis veces, no copy para quien lee.
 *
 * `leading-[1.3]`: a propósito FUERA de la escala `LEADING` de cuerpo/meta —
 * una cita destacada no es prosa que se lee seguida ni un metadato, es texto
 * grande y en negrita pensado para leerse como un titular corto. Más apretado
 * a más tamaño es la misma convención que ya usa `titleVariants`. */
export function Pullquote({
  side = "right",
  children,
}: {
  side?: "left" | "right";
  children: ReactNode;
}) {
  return (
    <aside
      role="note"
      data-reveal
      className={cn(
        "border-brand-purple/40 relative my-2 w-full max-w-[19rem] border-t-2 border-b-2 py-5 pl-[1.25rem] sm:w-[45%]",
        side === "right" ? "sm:float-right sm:ml-8" : "sm:float-left sm:mr-8",
      )}
    >
      <span
        aria-hidden="true"
        className="bg-brand-purple absolute top-0 bottom-0 left-0 w-[2px]"
      />
      {/* `text-balance` SE QUEDA, y aquí ya está donde tiene que estar (P50.90):
          la capa da `pretty` a un `<blockquote>`, y una cita destacada se lee
          como titular. Es la tercera y última no redundante del sitio, y la
          única que sirve a SEIS apariciones —las cinco citas del artículo más su
          espécimen del Design System— desde un solo sitio. */}
      <blockquote className="font-display text-foreground m-0 text-[1.15rem] leading-[1.3] font-semibold text-balance">
        {children}
      </blockquote>
    </aside>
  );
}

/** Cita en el flujo: la cita menor, que no debe parar la lectura. Filete
 * morado pastel, flota al lado contrario que `Pullquote` cuando ambas caen en
 * la misma sección, para que el peso gráfico no se acumule en un solo borde.
 *
 * `leading-[1.45]`: mismo criterio que `Pullquote` (fuera de `LEADING`, es
 * cita y no cuerpo/meta), pero más suelto que su 1,3 — a menor tamaño de
 * letra, la misma proporción se lee más apretada, así que necesita algo más
 * de aire para no sentirse comprimida. */
export function Pull({
  side = "left",
  children,
}: {
  side?: "left" | "right";
  children: ReactNode;
}) {
  return (
    <blockquote
      data-reveal
      className={cn(
        "border-brand-purple-soft text-foreground my-2 w-full max-w-[17rem] border-l-2 pl-4 text-[1rem] leading-[1.45] font-medium sm:w-[38%]",
        side === "right" ? "sm:float-right sm:ml-8" : "sm:float-left sm:mr-8",
      )}
    >
      {children}
    </blockquote>
  );
}

/* ───────────────────────── RepoStrip ───────────────────────── */

/** Un tramo de texto llano, o un enlace a un archivo del repo (con `line`
 * opcional para un permalink a la línea exacta — más fiable que adivinar el
 * anchor que GitHub genera del titular) o a una URL externa (herramientas
 * citadas, D60/D67: se enlazan, no se citan a pelo). */
export type RepoStripPart =
  | string
  | { label: string; path: string; line?: number }
  | { label: string; external: string };

/** La franja «ENLACE ·» que cierra cada sección: cada afirmación apunta al
 * código que la sostiene (regla transversal del artículo), y CADA elemento
 * citado —cada decisión, cada archivo— es su propio enlace, no uno solo que
 * cubra la frase entera.
 *
 * `tone: "chrome"` por defecto, en TODAS sus apariciones (P60 tanda 3, punto
 * 5): la franja no vive nunca en medio de un párrafo, siempre ocupa la MISMA
 * posición, justo encima de `SectionCloser` (o de `ContactActions` en el
 * cierre) — es chrome de pie de sección, no contenido. La primera versión
 * (D76/P60 tanda 2) le daba tono de contenido en las diez secciones normales
 * y solo chrome en el cierre, así que dentro de un mismo pie convivían dos
 * estilos de enlace distintos («ENLACE ·» subrayado, «Índice · Siguiente»
 * en pastilla) — la inconsistencia que este cambio unifica. `tone: "content"`
 * se queda disponible por si algún día la franja SÍ cae en medio de un
 * párrafo, caso que hoy no existe. */
export function RepoStrip({
  label,
  parts,
  tone = "chrome",
}: {
  label: string;
  parts: RepoStripPart[];
  tone?: "content" | "chrome";
}) {
  return (
    <footer
      className={cn(
        "border-border mt-[2.5rem] flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t pt-5 text-[0.92rem]",
        LEADING.meta,
      )}
    >
      <span className="text-muted-foreground shrink-0 font-semibold tracking-[0.04em] uppercase">
        {label}
      </span>
      <p className="m-0">
        {parts.map((part, i) => {
          if (typeof part === "string") return <span key={i}>{part}</span>;
          // Las dos formas de `part` resuelven a un destino fuera del sitio
          // (github.com, o una URL externa citada) — siempre `target="_blank"`.
          const href =
            "external" in part
              ? part.external
              : `${GITHUB_URL}/blob/main/${part.path}${part.line ? `#L${part.line}` : ""}`;
          return (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={
                tone === "chrome"
                  ? chromeLinkVariants({ shape: "inline", tone: "muted" })
                  : "link-content"
              }
            >
              {part.label}
            </a>
          );
        })}
        <ArrowUpRight
          aria-hidden="true"
          className="ml-1 inline size-[15px] shrink-0 align-text-bottom"
        />
      </p>
    </footer>
  );
}

/* ───────────────────────── Diagrama ───────────────────────── */

/** El marco de un diagrama propio: SVG inline con tokens (D54) + pie. El
 * dibujo lo aporta el llamador —es site-specific, vive en
 * `components/site/como-se-ha-creado-diagrams/`—, esto solo pone la caja.
 *
 * Con `side`, flota junto al párrafo al que pertenece (mismo mecanismo que
 * `Pullquote`) en vez de vivir suelto al final de toda la prosa de la sección
 * — el diagrama de «Qué decidieron esas dos velocidades» aparecía después de
 * los cuatro bloques siguientes en vez de al lado del texto que lo explica
 * (P60 tanda 2, puntos 10 y 20). Sin `side` (el espécimen de Design System),
 * se queda centrado a ancho de media columna, como antes. */
export function DiagramPanel({
  children,
  caption,
  side,
}: {
  children: ReactNode;
  caption: ReactNode;
  side?: "left" | "right" | "center";
}) {
  return (
    // Flotado, al 50% real del contenedor (P60 tanda 3, punto 3): el primer
    // intento capaba a `max-w-[24rem]` (384px) sobre el 54% pedido, así que
    // en cualquier viewport de escritorio ganaba siempre el tope fijo y el
    // diagrama se veía diminuto, casi ilegible.
    //
    // Sin flotar, ANCHO COMPLETO de la columna de prosa (P60 tanda 3-bis,
    // punto 10) y no `max-w-[var(--measure)]`: ese tope de media columna
    // dejaba el marco más ESTRECHO que el párrafo que lo precede —el
    // borde izquierdo coincidía, el derecho se quedaba corto—, y por eso se
    // leía descuadrado respecto al texto en vez de leerse como su misma
    // columna. `--measure` sigue siendo el ancho correcto para una LISTA
    // (línea de lectura), pero un panel no es prosa: se cuadra con el ancho
    // real del bloque, no con el de una línea cómoda de leer.
    // `diagram-realce` (D79, prototipo de Tanda 3): el marco entra con el
    // mismo fade-up que cualquier `data-reveal`, y sus piezas internas
    // —cada una marcada `.rlz` con su propio `--i`, en `como-se-ha-creado-
    // diagrams.tsx`— entran atenuadas y un barrido secuencial las lleva a
    // opacidad plena. Es LA regla para los diagramas de nodos/líneas del
    // artículo, no una animación por diagrama.
    <figure
      data-reveal
      className={cn(
        "diagram-realce border-border bg-card mb-[1.5rem] overflow-hidden rounded-xl border",
        side === "left" || side === "right"
          ? // Sin `mt`: un flotado ya hereda el hueco vertical del ritmo del
            // párrafo (`space-y` del contenedor de `ArticleProse`), así que
            // sumarle encima `my-[1.5rem]` lo dejaba empezando más abajo que
            // el texto con el que corre en paralelo — desalineado por arriba
            // Y, como efecto de cascada, sobresaliendo más por abajo (P60,
            // feedback sobre el diagrama del stack en s04).
            cn(
              "w-full sm:w-1/2",
              side === "right"
                ? "sm:float-right sm:ml-8"
                : "sm:float-left sm:mr-8",
            )
          : side === "center"
            ? "mx-auto mt-[1.5rem] w-full sm:w-[70%]"
            : "mt-[1.5rem] w-full",
      )}
    >
      {/* `@container` (P68.59): los diagramas cambian de disposición según el
          ancho del PANEL, no el de la ventana — media columna a 1024 y columna
          entera a 360 son el mismo hueco. Va en este div y no en el `<figure>`
          a propósito: `container-type: inline-size` implica contención, y el
          `<figure>` es quien flota. Aquí dentro no hay geometría que romper. */}
      <div className="@container flex items-center justify-center p-[clamp(1rem,2.5vw,1.5rem)]">
        {children}
      </div>
      <figcaption
        className={cn(
          "border-border text-muted-foreground border-t px-5 py-4 text-[0.85rem]",
          LEADING.lead,
        )}
      >
        {caption}
      </figcaption>
    </figure>
  );
}
