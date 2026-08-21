"use client";

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
    <div
      ref={barRef}
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      className="bg-border fixed inset-x-0 top-0 z-40 h-[3px]"
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
 * montarse, el riel simplemente no resalta nada — no rompe. */
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

  return (
    <nav
      aria-label="Índice de secciones"
      className="fixed top-1/2 left-[clamp(0.75rem,2vw,1.75rem)] z-30 hidden -translate-y-1/2 xl:block"
    >
      <ol className="m-0 flex list-none flex-col gap-[0.4rem] p-0">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id} className="group relative">
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "flex size-6 items-center justify-center rounded-full font-mono text-[0.68rem] transition-colors",
                  isActive
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                {item.ordinal}
              </a>
              <span
                role="tooltip"
                className="bg-foreground text-background pointer-events-none absolute top-1/2 left-[calc(100%+0.5rem)] -translate-y-1/2 rounded-md px-2 py-1 text-[0.75rem] whitespace-nowrap opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
              >
                {item.label}
              </span>
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
export function ShareActions({
  shareLabel,
  copyLabel,
  copiedLabel,
  copiedAnnounce,
  shareUnavailableAnnounce,
}: {
  shareLabel: string;
  copyLabel: string;
  copiedLabel: string;
  copiedAnnounce: string;
  shareUnavailableAnnounce: string;
}) {
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

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={share}
        className={actionVariants({ variant: "outline-neutral", size: "sm" })}
      >
        <Share2 aria-hidden="true" />
        {shareLabel}
      </button>
      <button
        type="button"
        onClick={copyLink}
        className={actionVariants({ variant: "outline-neutral", size: "sm" })}
      >
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
