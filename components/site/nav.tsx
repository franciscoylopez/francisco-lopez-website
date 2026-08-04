"use client";

import { Menu, Moon, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Logo } from "@/components/ui/logo";
import { cvPath, type Locale } from "@/lib/i18n/config";

export type NavDict = {
  homeAria: string;
  downloadCv: string;
  sobreMi: string;
  menu: string;
  toggleTheme: string;
  switchLanguage: string;
  switchLanguageShort: string;
};

// Nav sticky (BRAND.md regla 6 · PRD §6). Transición continua con el scroll:
// p = clamp(scrollY/120) cuantizado a pasos de 1/50 para limitar re-renders.
//   símbolo 48→28px · capas del split se extinguen a p/0.05 · wordmark a p/0.45 ·
//   barra 80→64px. Con prefers-reduced-motion salta en scrollY>48 (sin interpolar).
// CV/hamburguesa alternan por CSS (D7: responsive en CSS, no en JS).
// `homeHref` por defecto es "#top" (scroll al inicio en la home); las páginas
// internas pasan la URL de la home para que el logo navegue de vuelta.
export function Nav({
  dict,
  homeHref = "#top",
  lang,
}: {
  dict: NavDict;
  homeHref?: string;
  lang: Locale;
}) {
  // El menú deriva su propio enlace del CV a partir del locale (fuente única
  // cvPath). Las otras apariciones del CV en el home (CTA de Trayectoria y
  // Contacto) lo resuelven igual desde la página.
  const cvHref = cvPath(lang);
  const sobreMiHref = `${lang === "es" ? "" : `/${lang}`}/sobre-mi`;
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname() || "/";
  const [p, setP] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Selector de idioma (toggle al otro locale conservando la página actual, D2):
  // ES sin prefijo, EN en /en. Enlace <a> nativo → navegación completa, para que
  // el SSR sirva el diccionario del nuevo locale y `<html lang>` se actualice.
  // Se despoja cualquier segmento de locale inicial: en el prerender estático
  // usePathname trae la ruta interna con prefijo (/es/..., /en/...), mientras que
  // en runtime el ES va sin prefijo (/...). Quitando /es|/en el subpath es el
  // mismo en ambos casos → sin desajuste de hidratación.
  const subpath = pathname.replace(/^\/(es|en)(?=\/|$)/, "") || "/";
  const altHref =
    lang === "en" ? subpath : subpath === "/" ? "/en" : `/en${subpath}`;
  const isSobreMi = subpath === "/sobre-mi";

  useEffect(() => {
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let raf = 0;
    const compute = () => {
      raf = 0;
      const next = reduce
        ? window.scrollY > 48
          ? 1
          : 0
        : Math.round(Math.min(1, Math.max(0, window.scrollY / 120)) * 50) / 50;
      setP((prev) => (prev === next ? prev : next));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const symH = 48 - 20 * p;
  const splitOpacity = Math.max(0, Math.min(1, 1 - p / 0.05));
  const barMinHeight = 80 - 16 * p;
  const nameO = Math.max(0, Math.min(1, 1 - p / 0.45));
  const isDark = resolvedTheme === "dark";

  return (
    <header
      className="border-border sticky top-0 z-50 border-b backdrop-blur-[10px]"
      style={{
        // Frosted translúcido al 86%. Se mezcla en sRGB, no en oklch: mezclar con
        // `transparent` en oklch deja el tono en `none` (hue powerless) y el nav
        // pierde el matiz del fondo → se ve gris/rosado junto al body. En sRGB el
        // tono se conserva y el nav casa con el fondo cuando no hay scroll debajo.
        background: "color-mix(in srgb, var(--background) 86%, transparent)",
      }}
    >
      <div
        className="mx-auto flex max-w-[var(--container)] items-center justify-between gap-4 px-[var(--page-x)]"
        style={{ minHeight: `${barMinHeight}px` }}
      >
        <a
          href={homeHref}
          aria-label={dict.homeAria}
          className="text-foreground inline-flex items-center no-underline"
        >
          <span className="block shrink-0" style={{ height: `${symH}px` }}>
            <Logo splitOpacity={splitOpacity} className="h-full gap-0" />
          </span>
          <span
            className="font-display overflow-hidden text-[1.375rem] font-semibold tracking-[-0.01em] whitespace-nowrap"
            style={
              nameO <= 0
                ? { opacity: 0, maxWidth: 0, marginLeft: 0 }
                : {
                    opacity: nameO,
                    maxWidth: "none",
                    marginLeft: "0.6rem",
                    transform: `translateX(${(-(1 - nameO) * 8).toFixed(1)}px)`,
                  }
            }
          >
            Francisco López
          </span>
        </a>

        {/* Grupo de controles (CV + menú + tema): no es navegación de sitio, así
            que <div> — evita un segundo landmark de navegación sin nombre único
            (el único <nav> es el del footer). */}
        <div className="flex items-center gap-1.5">
          <a
            href={cvHref}
            download
            className="text-foreground hidden min-h-[44px] items-center px-[0.85rem] text-[0.88rem] font-medium whitespace-nowrap link-chrome sm:inline-flex"
          >
            {dict.downloadCv}
          </a>
          <a
            href={sobreMiHref}
            aria-current={isSobreMi ? "page" : undefined}
            className="text-foreground hidden min-h-[44px] items-center px-[0.85rem] text-[0.88rem] font-medium whitespace-nowrap link-chrome aria-[current=page]:underline sm:inline-flex"
          >
            {dict.sobreMi}
          </a>
          <a
            href={altHref}
            hrefLang={lang === "en" ? "es" : "en"}
            aria-label={dict.switchLanguage}
            className="text-muted-foreground hover:text-foreground focus-visible:text-foreground hidden min-h-[44px] items-center px-[0.6rem] text-[0.85rem] font-medium link-chrome sm:inline-flex"
          >
            {dict.switchLanguageShort}
          </a>
          <button
            type="button"
            aria-label={dict.menu}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="border-border text-foreground icon-chrome [--icon-chrome-bg:var(--card)] inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-md border sm:hidden"
          >
            <Menu className="size-[18px]" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={dict.toggleTheme}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="border-border text-foreground icon-chrome [--icon-chrome-bg:var(--card)] ml-0.5 inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-md border"
          >
            <Moon className="size-[18px] dark:hidden" aria-hidden="true" />
            <Sun className="hidden size-[18px] dark:block" aria-hidden="true" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-border bg-background border-t sm:hidden">
          <div className="mx-auto flex max-w-[var(--container)] flex-col px-[var(--page-x)] pt-2 pb-[0.85rem]">
            <a
              href={cvHref}
              download
              onClick={() => setMenuOpen(false)}
              className="text-foreground inline-flex min-h-[44px] items-center text-[0.95rem] font-medium link-chrome"
            >
              {dict.downloadCv}
            </a>
            <a
              href={sobreMiHref}
              aria-current={isSobreMi ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
              className="text-foreground inline-flex min-h-[44px] items-center text-[0.95rem] font-medium link-chrome aria-[current=page]:underline"
            >
              {dict.sobreMi}
            </a>
            <a
              href={altHref}
              hrefLang={lang === "en" ? "es" : "en"}
              aria-label={dict.switchLanguage}
              onClick={() => setMenuOpen(false)}
              className="text-foreground inline-flex min-h-[44px] items-center text-[0.95rem] font-medium link-chrome"
            >
              {dict.switchLanguageShort}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
