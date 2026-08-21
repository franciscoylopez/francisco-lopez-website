import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

import { GITHUB_URL } from "@/lib/contact";
import type { ArticleBlock } from "@/lib/reading-time";
import { cn } from "@/lib/utils";

import { Rich } from "./rich";
import { chromeLinkVariants } from "./chrome";
import { eyebrowVariants, titleVariants } from "./heading";

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

/** Avatar + nombre + rol del autor, en la apertura del artículo. Sin foto
 * propia: iniciales sobre `--muted`, mismo tratamiento que un avatar sin
 * imagen en cualquier sistema — no es una foto de estudio, es una pieza
 * genérica. */
export function ByLine({ name, role }: { name: string; role: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="flex items-center gap-[0.85rem]">
      <span
        aria-hidden="true"
        className="bg-muted text-foreground flex size-11 shrink-0 items-center justify-center rounded-full text-[0.85rem] font-semibold"
      >
        {initials}
      </span>
      <div>
        <div className="text-[0.95rem] leading-[1.3] font-semibold">{name}</div>
        <div className="text-muted-foreground text-[0.85rem] leading-[1.3]">
          {role}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── ArticleIndex ───────────────────────── */

export type IndexItem = {
  id: string;
  ordinal: string;
  label: string;
  minutes: number;
};

/** El índice navegable de 11 paradas, con tiempo por sección (pintado en
 * servidor: no hace falta JS para verlo ni para saltar). Rejilla continua —
 * el ordinal grande sobre la etiqueta, sin caja propia por celda, con
 * hairlines de división y una pastilla de hover que ocupa la celda entera
 * (P60, feedback de diseño: «variante C»). */
export function ArticleIndex({
  kicker,
  timeLabel,
  ariaLabel,
  items,
}: {
  kicker: string;
  timeLabel: string;
  ariaLabel: string;
  items: IndexItem[];
}) {
  return (
    <nav aria-label={ariaLabel} data-reveal>
      <div className="border-border flex items-baseline justify-between gap-3 border-b px-1 pb-3">
        <p className={cn(eyebrowVariants(), "m-0")}>{kicker}</p>
        <span className="text-muted-foreground hidden text-[0.78rem] sm:inline">
          {timeLabel}
        </span>
      </div>
      <ol className="border-border m-0 grid list-none grid-cols-1 border-l p-0 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.id} className="border-border border-r border-b">
            <a
              href={`#${item.id}`}
              className="hover:bg-muted focus-visible:bg-muted flex min-h-[7.5rem] flex-col justify-center gap-1 px-5 py-4 no-underline transition-colors"
            >
              <span className="font-display text-[1.9rem] leading-none font-semibold">
                {item.ordinal}
              </span>
              <span className="text-foreground text-[0.95rem] font-medium">
                {item.label}
              </span>
              <span className="text-muted-foreground mt-1 font-mono text-[0.75rem]">
                ≈{item.minutes} min
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ───────────────────────── SectionCover ───────────────────────── */

/** La portada de una sección: una línea de meta («Capítulo 08 de 11 · 4 min
 * de lectura») + kicker + `h2` a la izquierda, y el ordinal ilustrado
 * (decorativo, `aria-hidden`) a la DERECHA — feedback de diseño de P60: en el
 * layout anterior el numeral grande y el ordinal del kicker quedaban pegados.
 *
 * El ordinal ya está dicho en texto accesible por el kicker, pero eso no
 * exime al numeral grande de WCAG 1.4.3: `aria-hidden` lo saca del árbol de
 * accesibilidad, no de la vista, y alguien con baja visión SÍ lo lee.
 * `brand-purple-soft` daba 1,63:1 en claro y prácticamente 0 en oscuro
 * (viewport-verifier, P60) — ni el umbral de texto grande (3:1). Un morado que
 * SÍ llegara ahí no existe sin inventar un token nuevo (BRAND.md §El morado
 * como gráfico: el decorativo no pasa 3:1 en claro), así que el numeral usa
 * `text-muted-foreground` con un marco (`border-muted-foreground`) — evoca el
 * numeral con contorno del prototipo de P59 sin depender de un color que no
 * pasa el umbral. */
export function SectionCover({
  ordinal,
  kicker,
  title,
  id,
  metaLine,
}: {
  ordinal: string;
  kicker: string;
  title: string;
  id: string;
  /** «Capítulo 08 de 11 · 4 min de lectura», ya compuesta por el llamador
   * (los tres fragmentos son copy, y el número de sección/minutos se calcula
   * en build — D60). */
  metaLine: string;
}) {
  return (
    <div className="mb-[clamp(2rem,4vw,3rem)] flex items-start justify-between gap-[clamp(1.5rem,4vw,3rem)]">
      <header className="min-w-0">
        <p className="text-muted-foreground m-0 mb-2 font-mono text-[0.7rem] tracking-[0.06em] uppercase">
          {metaLine}
        </p>
        <p className={cn(eyebrowVariants(), "mb-3")}>{kicker}</p>
        <h2
          id={id}
          className={cn(titleVariants({ size: "section-sm" }), "max-w-[24ch]")}
        >
          {title}
        </h2>
      </header>
      <span
        aria-hidden="true"
        className="text-muted-foreground border-muted-foreground/30 font-display hidden shrink-0 rounded-2xl border text-[clamp(2.5rem,5vw,4rem)] leading-none font-semibold sm:block"
        style={{ padding: "0.5em 0.65em" }}
      >
        {ordinal}
      </span>
    </div>
  );
}

/* ───────────────────────── Prosa ───────────────────────── */

/** El cuerpo de una sección: párrafos, `h3` de subapartado y listas, con
 * énfasis inline vía `Rich` (D23). Es el mismo tipo `ArticleBlock` que cuenta
 * `lib/reading-time.ts`, así que el diccionario no se recompone en dos sitios. */
export function ArticleProse({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="max-w-[var(--prose-w,78rem)] space-y-[1.15rem]">
      {blocks.map((block, i) => {
        if (block.type === "h3") {
          return (
            <h3
              key={i}
              className={cn(titleVariants({ size: "sub" }), "!mt-[2.5rem]")}
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
          return (
            <ul
              key={i}
              className="m-0 max-w-[var(--measure)] list-none space-y-[0.7rem] p-0"
            >
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-3 text-[1.02rem] leading-[1.7]">
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
            <Pullquote key={i} label={block.label ?? ""} side={block.side}>
              {block.text}
            </Pullquote>
          ) : (
            <Pull key={i} side={block.side}>
              {block.text}
            </Pull>
          );
        }
        return (
          <p key={i} className="m-0 text-[1.02rem] leading-[1.7] text-pretty">
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
 * solo. */
export function Pullquote({
  label,
  side = "right",
  children,
}: {
  label: string;
  side?: "left" | "right";
  children: ReactNode;
}) {
  return (
    <aside
      role="note"
      className={cn(
        "border-brand-purple/40 relative my-2 w-full max-w-[19rem] border-t-2 border-b-2 py-5 pl-[1.25rem] sm:w-[45%]",
        side === "right" ? "sm:float-right sm:ml-8" : "sm:float-left sm:mr-8",
      )}
    >
      <span
        aria-hidden="true"
        className="bg-brand-purple absolute top-0 bottom-0 left-0 w-[2px]"
      />
      <p className={cn(eyebrowVariants(), "mb-2 text-[0.7rem]")}>{label}</p>
      <blockquote className="font-display text-foreground m-0 text-[1.15rem] leading-[1.3] font-semibold text-balance">
        {children}
      </blockquote>
    </aside>
  );
}

/** Cita en el flujo: la cita menor, que no debe parar la lectura. Filete
 * morado pastel, flota al lado contrario que `Pullquote` cuando ambas caen en
 * la misma sección, para que el peso gráfico no se acumule en un solo borde. */
export function Pull({
  side = "left",
  children,
}: {
  side?: "left" | "right";
  children: ReactNode;
}) {
  return (
    <blockquote
      className={cn(
        "border-brand-purple-soft text-foreground my-2 w-full max-w-[17rem] border-l-2 pl-4 text-[1rem] leading-[1.45] font-medium sm:w-[38%]",
        side === "right" ? "sm:float-right sm:ml-8" : "sm:float-left sm:mr-8",
      )}
    >
      {children}
    </blockquote>
  );
}

/* ───────────────────────── LiveStat ───────────────────────── */

/** La regleta de un dato en vivo: no se escribe la cifra en el diccionario
 * (D60), se enlaza a la página que la publica de verdad. */
export function LiveStat({
  label,
  source,
  value,
  linkLabel,
  href,
}: {
  label: string;
  source: string;
  value: string;
  linkLabel: string;
  href: string;
}) {
  return (
    <aside className="border-border bg-card my-[2rem] max-w-[34rem] rounded-lg border">
      <div className="border-border flex flex-wrap items-baseline justify-between gap-2 border-b border-dashed px-5 pt-4 pb-3">
        <span className="text-foreground text-[0.72rem] font-semibold tracking-[0.05em] uppercase">
          {label}
        </span>
        <code className="text-muted-foreground font-mono text-[0.74rem]">
          {source}
        </code>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <p className="text-foreground m-0 text-[1.05rem] font-semibold">
          {value}
        </p>
        <a
          href={href}
          className="link-content link-content--underline text-[0.9rem] font-medium"
        >
          {linkLabel}
        </a>
      </div>
    </aside>
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
 * cubra la frase entera. */
export function RepoStrip({
  label,
  parts,
}: {
  label: string;
  parts: RepoStripPart[];
}) {
  return (
    <footer className="border-border mt-[2.5rem] flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t pt-5 text-[0.92rem]">
      <span className="text-muted-foreground shrink-0 font-semibold tracking-[0.04em] uppercase">
        {label}
      </span>
      <p className="m-0">
        {parts.map((part, i) => {
          if (typeof part === "string") return <span key={i}>{part}</span>;
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
              className="link-content link-content--underline"
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

/* ───────────────────────── ChapterNav ───────────────────────── */

/** La transición entre secciones: puntos de posición + vuelta al índice +
 * siguiente parada. Los puntos son decorativos —«N de M» ya lo dice en
 * texto—, así que no repiten la info por color (punto 6 del checklist). */
export function ChapterNav({
  position,
  total,
  indexLabel,
  indexHref,
  nextLabel,
  nextHref,
  positionLabel,
}: {
  position: number;
  total: number;
  indexLabel: string;
  indexHref: string;
  nextLabel: string;
  nextHref?: string;
  positionLabel: string;
}) {
  return (
    // El `aria-label` incluye la posición: axe marca `landmark-unique` si once
    // `<nav>` en la misma página comparten nombre accesible exacto, y aquí hay
    // uno por sección.
    <nav
      aria-label={`Entre secciones · ${positionLabel}`}
      className="border-border mt-[2.5rem] flex flex-wrap items-center gap-x-4 gap-y-3 border-t pt-5"
    >
      <p className="text-muted-foreground m-0 flex items-center gap-2 text-[0.85rem]">
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

/* ───────────────────────── Diagrama ───────────────────────── */

/** El marco de un diagrama propio: SVG inline con tokens (D54) + pie. El
 * dibujo lo aporta el llamador —es site-specific, vive en
 * `components/site/como-se-ha-creado-diagrams.tsx`—, esto solo pone la caja. */
export function DiagramPanel({
  children,
  caption,
}: {
  children: ReactNode;
  caption: ReactNode;
}) {
  return (
    // Ancho de media columna, no el del artículo: los diagramas se dibujan a
    // un tamaño legible (400-700px de viewBox) y dentro de una caja de
    // 1.248px dejaban la mitad en blanco a cada lado (feedback de diseño de
    // P60). El mismo ancho que las listas — `--measure` — mantiene la
    // columna de lectura coherente.
    <figure className="border-border bg-card my-[2rem] max-w-[var(--measure)] overflow-hidden rounded-xl border">
      <div className="flex items-center justify-center p-[clamp(1rem,2.5vw,1.5rem)]">
        {children}
      </div>
      <figcaption className="border-border text-muted-foreground border-t px-5 py-4 text-[0.85rem] leading-[1.6]">
        {caption}
      </figcaption>
    </figure>
  );
}
