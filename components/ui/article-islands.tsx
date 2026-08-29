"use client";

// @pieza artículo · design-system/12-articulo.tsx · Las islas de cliente del texto largo: barra de progreso, copiar enlace y compartir.

import { Copy, Link2, Share2 } from "lucide-react";
import { useEffect, useRef } from "react";

import { actionVariants } from "@/components/ui/action";
import { useCopyToClipboard } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";

// `FloatingShare` navega las MISMAS paradas que el riel, así que comparte su tipo
// en vez de declarar uno gemelo. El riel se fue a `section-index-islands.tsx`
// (P70.38); el dock se queda, porque compartir un enlace es cosa del artículo.
import { useActiveSection, type RailItem } from "./section-index-islands";

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
  // La mecánica (escribir, confirmar 1800 ms, anunciar, fallar en silencio) se
  // fue a `copy-button.tsx` cuando aparecieron el segundo y el tercer call site
  // (P70.24). Aquí queda lo que de verdad es del artículo: QUÉ se copia, y qué
  // se anuncia según por qué camino se llegó.
  const { copied, announce, copy } = useCopyToClipboard();

  const copyLink = () => copy(window.location.href, copiedAnnounce);

  const share = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({ title: document.title, url: window.location.href })
        .catch(() => {});
      return;
    }
    // ANTES ANUNCIABA LO CONTRARIO DE LO QUE QUERÍA. El fallback llamaba a
    // `copyLink()` y ponía el aviso de «compartir no disponible» justo después,
    // en la misma vuelta: la promesa del portapapeles resolvía más tarde y lo
    // pisaba con «enlace copiado». O sea que el motivo por el que se había
    // copiado, que es la única información que ese aviso añade, no llegaba
    // nunca al lector de pantalla. Ahora el aviso ES el anuncio de esta copia.
    copy(window.location.href, shareUnavailableAnnounce);
  };

  const copyText = copied ? copiedLabel : copyLabel;
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
   * `outline-neutral` pinta un RELLENO con `--background` normal —claro en
   * claro— flotando sobre la banda oscura: legible mal, no un fallo de
   * contraste. Controles CON DOS FONDOS (BRAND.md): el color se toma del fondo,
   * no se fija. El CONTORNO ya no entra aquí —lo resuelve `--control-edge` por
   * superficie desde D97—; lo que queda es el relleno, que la capa no cubre. */
  onInverted?: boolean;
}) {
  const { copyText, announce, share, copyLink } = useShareLink({
    copyLabel,
    copiedLabel,
    copiedAnnounce,
    shareUnavailableAnnounce,
  });

  // EL BORDE YA NO SE ELIGE AQUÍ (2026-08-28, P50.92). Lo pone la variante con
  // `border-control-edge` y lo resuelve la superficie: el hero declara
  // `data-surface="inverted"`, que en globals.css mezcla el contorno desde
  // `--background`. Lo que queda del override son los dos que la capa NO
  // resuelve, y por eso siguen: no hay regla de `--muted` ni de `--foreground`
  // para la banda invertida, así que el relleno de reposo, el color del texto y
  // la pastilla de hover se derivan a mano del par de la banda.
  const btnClass = cn(
    actionVariants({ variant: "outline-neutral", size: "sm" }),
    onInverted &&
      "bg-transparent text-background hover:bg-background/15 focus-visible:bg-background/15",
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
  const { copied, announce, share, copyLink } = useShareLink({
    copyLabel,
    copiedLabel,
    copiedAnnounce,
    shareUnavailableAnnounce,
  });

  // MISMA PREGUNTA QUE EL RIEL, y por eso el mismo hook (P55). Aquí solo importa
  // si hay alguna sección en la banda; cuál sea da igual. Antes esto era un
  // observer propio que se DESCONECTABA al ver la primera, así que el dock
  // aparecía y ya no se iba: al volver al hero seguía flotando.
  const dentroDelCuerpo = useActiveSection(items) !== null;

  if (!dentroDelCuerpo) return null;

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
