import { ArrowRight } from "lucide-react";

import type { Dictionary } from "@/app/[lang]/dictionaries";
import { cn } from "@/lib/utils";

import { CARD, WRAP } from "./layout";

export type RelatedDict = Dictionary["related"];

type PageKey = "brandKit" | "designSystem" | "accesibilidad";

// Orden canónico del sistema. Las tres páginas existen; cada una enlaza a las otras
// dos desde una sola fuente (este array). Si alguna dejara de existir, `path: null`
// la devolvería al estado "Próximamente" sin tocar las demás.
const PAGES: { key: PageKey; path: string | null }[] = [
  { key: "brandKit", path: "/brand-kit" },
  { key: "designSystem", path: "/design-system" },
  { key: "accesibilidad", path: "/accesibilidad" },
];

// El foco NO se declara aquí: lo pone la regla global `:focus-visible` de
// globals.css, igual que en el resto del sitio. Antes esta card se lo sustituía
// por su propio `ring` (`focus-visible:outline-none` + `ring-2 ring-offset-2`),
// que además dejaba el color del offset sin declarar — y el default de Tailwind es
// blanco, así que en tema oscuro aparecía un halo claro entre la card y el anillo.
const LINK_CARD = cn(
  CARD,
  "group hover:bg-muted block px-[1.4rem] py-[1.2rem] transition-colors",
);

// Enlaces a las páginas hermanas del sistema (Brand Kit · Design System ·
// Accesibilidad). Compartido por las tres para que la relación se muestre desde
// la misma posición —cierre del <main>, antes del footer— y con el mismo
// formato. Cada página renderiza las otras dos (nunca a sí misma).
export function RelatedPages({
  dict,
  current,
  lang,
}: {
  dict: RelatedDict;
  current: PageKey;
  lang: string;
}) {
  const base = lang === "es" ? "" : `/${lang}`;
  const others = PAGES.filter((p) => p.key !== current);
  const headingId = "related-pages-label";

  return (
    <section className="border-border border-t">
      <nav
        data-reveal
        aria-labelledby={headingId}
        // Ritmo vertical propio, más corto que `SECTION`: es un cierre de página,
        // no una sección de contenido.
        className={cn(WRAP, "py-[clamp(3.5rem,7vw,6rem)]")}
      >
        <p
          id={headingId}
          className="text-muted-foreground m-0 mb-[clamp(1.25rem,3vw,2rem)] text-[0.8125rem] font-semibold tracking-[0.09em] uppercase"
        >
          {dict.eyebrow}
        </p>
        <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,20rem),1fr))] gap-[var(--gutter)]">
          {others.map(({ key, path }) => {
            const page = dict.pages[key];

            if (!path) {
              return (
                <div
                  key={key}
                  className="border-border rounded-[var(--radius-lg)] border border-dashed px-[1.4rem] py-[1.2rem]"
                >
                  <span className="text-muted-foreground flex items-center gap-2 text-[1rem] font-semibold">
                    {page.name}
                    <span className="bg-muted rounded-full px-[0.5rem] py-[0.1rem] text-[0.68rem] tracking-[0.03em] uppercase">
                      {dict.comingSoon}
                    </span>
                  </span>
                  <p className="text-muted-foreground m-0 mt-[0.55rem] text-[0.9rem] leading-[1.55]">
                    {page.desc}
                  </p>
                </div>
              );
            }

            return (
              <a key={key} href={`${base}${path}`} className={LINK_CARD}>
                <span className="text-foreground flex items-center justify-between gap-2 text-[1rem] font-semibold">
                  {page.name}
                  <span className="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5">
                    <ArrowRight className="size-[18px]" />
                  </span>
                </span>
                <p className="text-muted-foreground m-0 mt-[0.55rem] text-[0.9rem] leading-[1.55]">
                  {page.desc}
                </p>
              </a>
            );
          })}
        </div>
      </nav>
    </section>
  );
}
