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
 * servidor: no hace falta JS para verlo ni para saltar). */
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
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <p className={cn(eyebrowVariants(), "m-0")}>{kicker}</p>
        <span className="text-muted-foreground hidden text-[0.78rem] sm:inline">
          {timeLabel}
        </span>
      </div>
      <ol className="m-0 grid list-none grid-cols-1 gap-[var(--gutter)] p-0 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="border-border hover:bg-muted focus-visible:bg-muted flex min-h-[44px] items-baseline gap-3 rounded-lg border px-4 py-3 no-underline transition-colors"
            >
              <span
                aria-hidden="true"
                className="text-muted-foreground font-mono text-[0.85rem]"
              >
                {item.ordinal}
              </span>
              <span className="text-foreground flex-1 text-[0.92rem] font-medium">
                {item.label}
              </span>
              <span className="text-muted-foreground shrink-0 text-[0.78rem] whitespace-nowrap">
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

/** La portada de una sección: ordinal ilustrado (decorativo, `aria-hidden`) +
 * kicker + `h2`. El ordinal ya está dicho en texto accesible por el kicker;
 * el numeral grande es pura ilustración, por eso va en `brand-purple-soft`
 * (BRAND.md: los pasteles son SOLO relleno decorativo, nunca texto). */
export function SectionCover({
  ordinal,
  kicker,
  title,
  id,
}: {
  ordinal: string;
  kicker: string;
  title: string;
  id: string;
}) {
  return (
    <div className="mb-[clamp(2rem,4vw,3rem)] flex items-end gap-[clamp(1rem,3vw,2rem)]">
      <span
        aria-hidden="true"
        className="text-brand-purple-soft font-display hidden text-[clamp(4rem,9vw,7rem)] leading-[0.8] font-semibold sm:block"
      >
        {ordinal}
      </span>
      <header>
        <p className={cn(eyebrowVariants(), "mb-3")}>{kicker}</p>
        <h2
          id={id}
          className={cn(titleVariants({ size: "section-sm" }), "max-w-[24ch]")}
        >
          {title}
        </h2>
      </header>
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
          return (
            <ul key={i} className="m-0 list-none space-y-[0.7rem] p-0">
              {block.items.map((item, j) => (
                <li key={j} className="flex gap-3 text-[1.02rem] leading-[1.7]">
                  <span
                    aria-hidden="true"
                    className="border-primary mt-[0.6em] size-[6px] shrink-0 rounded-full border-2"
                  />
                  <span>
                    <Rich text={item} />
                  </span>
                </li>
              ))}
            </ul>
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

/** Cita destacada: para el sitio EN el que un lector para. Marcas de esquina
 * en morado — el único uso "gráfico" del morado que no necesita 3:1 porque no
 * transporta información, es ornamento sobre un texto que ya se lee solo. */
export function Pullquote({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <aside
      role="note"
      className="border-brand-purple/40 relative my-[2.5rem] max-w-[38rem] border-t-2 border-b-2 py-6 pl-[1.5rem]"
    >
      <span
        aria-hidden="true"
        className="bg-brand-purple absolute top-0 bottom-0 left-0 w-[2px]"
      />
      <p className={cn(eyebrowVariants(), "mb-2")}>{label}</p>
      <blockquote className="font-display text-foreground m-0 text-[1.4rem] leading-[1.35] font-semibold text-balance">
        {children}
      </blockquote>
    </aside>
  );
}

/** Cita en el flujo: la cita menor, que no debe parar la lectura. Filete
 * morado pastel, tamaño de párrafo grande, sin marco. */
export function Pull({ children }: { children: ReactNode }) {
  return (
    <blockquote className="border-brand-purple-soft text-foreground my-[1.75rem] max-w-[var(--measure)] border-l-2 pl-5 text-[1.1rem] leading-[1.55] font-medium">
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

/** La franja «ENLACE ·» que cierra cada sección: cada afirmación apunta al
 * código que la sostiene (regla transversal del artículo). `path` es
 * RELATIVO al repo — el prefijo absoluto lo pone `GITHUB_URL`
 * (`lib/contact.ts`), nunca escrito a mano en el diccionario. */
export function RepoStrip({
  label,
  text,
  path,
}: {
  label: string;
  text: string;
  path: string;
}) {
  return (
    <footer className="border-border mt-[2.5rem] flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t pt-5 text-[0.92rem]">
      <span className="text-muted-foreground shrink-0 font-semibold tracking-[0.04em] uppercase">
        {label}
      </span>
      <a
        href={`${GITHUB_URL}/blob/main/${path}`}
        target="_blank"
        rel="noopener noreferrer"
        className="link-content link-content--underline inline-flex items-center gap-1"
      >
        {text}
        <ArrowUpRight aria-hidden="true" className="size-[15px] shrink-0" />
      </a>
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
        <span aria-hidden="true" className="flex gap-[3px]">
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              className={cn(
                "size-[6px] rounded-full",
                i < position ? "bg-foreground" : "bg-border",
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
    <figure className="border-border bg-card my-[2rem] overflow-hidden rounded-xl border">
      <div className="flex items-center justify-center p-[clamp(1rem,3vw,2rem)]">
        {children}
      </div>
      <figcaption className="border-border text-muted-foreground border-t px-5 py-4 text-[0.85rem] leading-[1.6]">
        {caption}
      </figcaption>
    </figure>
  );
}
