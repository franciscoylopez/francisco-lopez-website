"use client";

// @pieza artículo · design-system/15-articulo.tsx · Las islas de cliente del texto largo: riel de secciones, copiar enlace, compartir.

import { Copy, Link2, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { actionVariants } from "@/components/ui/action";
import { cn } from "@/lib/utils";

// Las tres islas de «Cómo se ha creado esta página» (D7: JS solo donde hace
// falta estado o una API del navegador). El resto de la página es Server
// Component — `article.tsx` (server) + estas tres.

/* ───────────────────────── ReadingProgress ───────────────────────── */

/** Barra de progreso de lectura, en `--progress-ink` (P60, morado calibrado
 * contra `--background`). Actualiza por scroll con `requestAnimationFrame`;
 * sin transición propia, así que no necesita excepción de
 * `prefers-reduced-motion`: el ancho SIGUE al scroll, no anima por su cuenta. */
export function ReadingProgress({ ariaLabel }: { ariaLabel: string }) {
  const fillRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const paint = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`;
      barRef.current?.setAttribute(
        "aria-valuenow",
        String(Math.round(p * 100)),
      );
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(paint);
      }
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", paint);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", paint);
    };
  }, []);

  return (
    // `z-[60]`, por ENCIMA del nav (`z-50`, sticky): con z-40 la barra
    // quedaba pintada DEBAJO de la cabecera opaca del nav y no se veía nunca
    // — «esto lo hemos perdido», feedback de diseño de P60. Vive pegada al
    // borde superior del viewport, no al borde inferior del nav, así que es
    // visible aunque el nav cambie de alto.
    <div
      ref={barRef}
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      className="bg-border fixed inset-x-0 top-0 z-[60] h-[3px]"
    >
      <div
        ref={fillRef}
        className="bg-progress-ink h-full w-full origin-left"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}

/* ───────────────────────── SectionRail ───────────────────────── */

export type RailItem = { id: string; ordinal: string; label: string };

/** El riel fijo de escritorio (≥1280px), con la sección activa resaltada por
 * `IntersectionObserver`. Es una MEJORA, no un requisito: el índice pintado
 * en servidor ya cubre la navegación sin JS, así que si el observer no puede
 * montarse, el riel simplemente no resalta nada — no rompe.
 *
 * Solo se monta a partir del capítulo 01 (P60 tanda 2, punto 3): antes de eso
 * —apertura + sección «Índice»— ya hay un elemento con su misma función
 * (orientar al lector), y el riel encima era un segundo índice compitiendo
 * con el primero. Como `active` arranca en `null` hasta que el observer
 * confirma la primera sección visible, basta con no pintar nada mientras sea
 * `null`. */
export function SectionRail({ items }: { items: RailItem[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const targets = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-30% 0px -55% 0px" },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  if (active === null) return null;

  return (
    <nav
      aria-label="Índice de secciones"
      className="fixed top-1/2 left-[clamp(0.75rem,2vw,1.75rem)] z-30 hidden -translate-y-1/2 xl:block"
    >
      <ol className="m-0 flex list-none flex-col gap-[0.4rem] p-0">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id}>
              {/* La etiqueta ya NO es un tooltip flotante aparte: el propio
                  círculo se ensancha en hover/foco y la revela dentro de la
                  misma pastilla — «integrado con el índice», feedback de
                  diseño de P60. `overflow-hidden` + `max-width` en vez de
                  `width` porque el texto no puede reflowar durante la
                  transición. `max-w-64` cabe la etiqueta más larga del
                  índice («El sistema de componentes», 26 caracteres) sin
                  cortarla — con `max-w-40` el hover truncaba a media palabra
                  (P60 tanda 2, punto 4). La sección activa vuelve a
                  blanco/negro: el morado no convenció en pantalla.
                  El `<a>` es el objetivo táctil de 44×44 (design-review P60:
                  la píldora visible de 24px medía por debajo del suelo del
                  checklist); el aspecto entero — círculo, expansión, color —
                  vive en el `<span>` interior, así que no crece en pantalla.
                  No compone `chromeLinkVariants`: excepción documentada con
                  fecha en BRAND.md §Ningún control se escribe a mano.
                  `justify-start`, NO `-center` (aviso de Francisco: el hover
                  se desplazaba a la izquierda y tapaba el texto): el pill
                  crece desde su borde izquierdo, igual que antes del fix de
                  44×44 — centrado, la mitad del crecimiento empujaba a la
                  IZQUIERDA, hacia fuera del borde del riel. */}
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className="group flex size-11 shrink-0 items-center justify-start"
              >
                <span
                  className={cn(
                    // shrink-0 (regresión cazada tras el fix de 44×44, aviso
                    // de Francisco viendo la página): el <a> exterior también
                    // es `flex`, así que este pill —flex item suyo— heredaba
                    // `flex-shrink: 1` por defecto y se encogía a los 44px
                    // del padre en vez de desbordar hasta max-w-64, aunque el
                    // padre tenga `overflow: visible`. El shrink ocurre en el
                    // cálculo del layout flex, no lo evita overflow-visible.
                    "border-border flex h-6 max-w-6 shrink-0 items-center gap-2 overflow-hidden rounded-full border pl-[3px] font-mono text-[0.68rem] whitespace-nowrap transition-[max-width,background-color,color,border-color] duration-200 ease-out group-hover:max-w-64 group-focus-visible:max-w-64",
                    isActive
                      ? "bg-foreground text-background border-foreground"
                      : "bg-card text-muted-foreground group-hover:bg-card group-hover:text-foreground",
                  )}
                >
                  <span className="flex size-[18px] shrink-0 items-center justify-center">
                    {item.ordinal}
                  </span>
                  <span className="pr-3 text-[0.78rem]">{item.label}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ───────────────────────── ShareActions ───────────────────────── */

/** Compartir nativo con fallback a copiar enlace. `navigator.share` no está en
 * todos los navegadores; sin él, el botón de compartir también copia y avisa
 * por `aria-live` — la acción nunca queda muda. */
type ShareLinkStrings = {
  copyLabel: string;
  copiedLabel: string;
  copiedAnnounce: string;
  shareUnavailableAnnounce: string;
};

/** Compartir nativo con fallback a copiar enlace, y el anuncio `aria-live`
 * para cuando no hay `navigator.share`. Extraído de `ShareActions` (P60
 * tanda 3, punto 8): el dock flotante de la derecha necesita la MISMA
 * lógica con botones solo-icono, y una lógica de estado con dos call sites
 * no se copia, se comparte. */
function useShareLink({
  copyLabel,
  copiedLabel,
  copiedAnnounce,
  shareUnavailableAnnounce,
}: ShareLinkStrings) {
  const [copyText, setCopyText] = useState(copyLabel);
  const [announce, setAnnounce] = useState("");

  const copyLink = () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setCopyText(copiedLabel);
        setAnnounce(copiedAnnounce);
        setTimeout(() => {
          setCopyText(copyLabel);
          setAnnounce("");
        }, 1800);
      })
      .catch(() => {});
  };

  const share = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({ title: document.title, url: window.location.href })
        .catch(() => {});
      return;
    }
    copyLink();
    setAnnounce(shareUnavailableAnnounce);
  };

  const copied = copyText !== copyLabel;
  return { copyText, copied, announce, share, copyLink };
}

export function ShareActions({
  shareLabel,
  copyLabel,
  copiedLabel,
  copiedAnnounce,
  shareUnavailableAnnounce,
  onInverted = false,
}: ShareLinkStrings & {
  shareLabel: string;
  /** El único uso hoy: la apertura del artículo, sobre `bg-foreground`. Ahí
   * `outline-neutral` pinta un rectángulo con `--background` normal —claro en
   * claro— flotando sobre la banda oscura: legible mal, no un fallo de
   * contraste. Controles CON DOS FONDOS (BRAND.md): el color se toma del
   * fondo, no se fija, así que aquí se deriva de `--background`/`--foreground`
   * en vez de reusar la variante pensada para superficies normales. */
  onInverted?: boolean;
}) {
  const { copyText, announce, share, copyLink } = useShareLink({
    copyLabel,
    copiedLabel,
    copiedAnnounce,
    shareUnavailableAnnounce,
  });

  // El borde al 35% daba 2,1-3:1 contra la banda (viewport-verifier, P60):
  // por debajo del 3:1 que WCAG 1.4.11 pide a un componente de UI en los dos
  // temas. El texto interior ya es AAA (mismo par que el resto del sitio);
  // solo el límite del control necesitaba más opacidad de `--background`.
  const btnClass = cn(
    actionVariants({ variant: "outline-neutral", size: "sm" }),
    onInverted &&
      "border-background/70 bg-transparent text-background hover:bg-background/15 focus-visible:bg-background/15",
  );

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={share} className={btnClass}>
        <Share2 aria-hidden="true" />
        {shareLabel}
      </button>
      <button type="button" onClick={copyLink} className={btnClass}>
        {copyText === copyLabel ? (
          <Link2 aria-hidden="true" />
        ) : (
          <Copy aria-hidden="true" />
        )}
        {copyText}
      </button>
      <p aria-live="polite" className="sr-only">
        {announce}
      </p>
    </div>
  );
}

/* ───────────────────────── FloatingShare ───────────────────────── */

/** Dock flotante de compartir/copiar en el borde derecho (≥1280px), pareja
 * del `SectionRail` de la izquierda — mismo breakpoint, misma regla de
 * aparición (P60 tanda 3, punto 8): compartir solo vivía en la apertura, así
 * que quien ya había bajado a leer no tenía forma de compartir sin volver
 * arriba. Aparece a partir del capítulo 01 por el mismo motivo que el riel:
 * antes de eso la apertura YA tiene sus propios botones de compartir a la
 * vista, y duplicarlos ahí sería redundante. Solo icono, con la misma
 * pastilla de 44px que el resto del chrome solo-icono del sitio. */
export function FloatingShare({
  items,
  shareLabel,
  copyLabel,
  copiedLabel,
  copiedAnnounce,
  shareUnavailableAnnounce,
}: ShareLinkStrings & {
  items: RailItem[];
  shareLabel: string;
}) {
  const [visible, setVisible] = useState(false);
  const { copied, announce, share, copyLink } = useShareLink({
    copyLabel,
    copiedLabel,
    copiedAnnounce,
    shareUnavailableAnnounce,
  });

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const targets = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
            return;
          }
        }
      },
      { rootMargin: "-30% 0px -55% 0px" },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  if (!visible) return null;

  const btnClass = actionVariants({ variant: "icon" });

  return (
    <div className="fixed top-1/2 right-[clamp(0.75rem,2vw,1.75rem)] z-30 hidden -translate-y-1/2 xl:flex xl:flex-col xl:gap-2">
      <button
        type="button"
        onClick={share}
        className={btnClass}
        aria-label={shareLabel}
      >
        <Share2 aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={copyLink}
        className={btnClass}
        aria-label={copied ? copiedLabel : copyLabel}
      >
        {copied ? <Copy aria-hidden="true" /> : <Link2 aria-hidden="true" />}
      </button>
      <p aria-live="polite" className="sr-only">
        {announce}
      </p>
    </div>
  );
}
