import { cn } from "@/lib/utils";

import { chromeLinkVariants } from "@/components/ui/chrome";

export type BreadcrumbDict = {
  routeLabel: string;
  home: string;
};

export type Crumb = { label: string; href?: string };

// Breadcrumb compartido de páginas internas (PRD §17, checklist a11y §20 punto 5):
// <nav aria-label>, lista ordenada, el nivel actual sin enlace y con
// aria-current="page", separadores decorativos ocultos al lector, área táctil de
// 44×44px y foco visible (heredado de :focus-visible en globals.css). Enlaces de
// chrome en muted-foreground, nunca primary (BRAND.md).
export function Breadcrumb({
  routeLabel,
  items,
  inverted = false,
}: {
  routeLabel: string;
  items: Crumb[];
  /** Sobre una banda invertida (P60): el nivel actual pasa de `text-foreground`
   * —que ahí ES el fondo de la banda, invisible— a `text-background`, y los
   * enlaces usan `chromeLinkVariants({ tone: "inverted" })` en vez de
   * `"muted"` (mismo problema en el hover). Requiere que el ancestro lleve
   * `data-surface="inverted"` para que el atenuado en reposo resuelva bien. */
  inverted?: boolean;
}) {
  return (
    <nav aria-label={routeLabel}>
      <ol className="m-0 flex flex-wrap items-center gap-x-1 p-0 text-[0.9rem]">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-x-1">
              {item.href && !last ? (
                <a
                  href={item.href}
                  className={chromeLinkVariants({
                    tone: inverted ? "inverted" : "muted",
                  })}
                >
                  {item.label}
                </a>
              ) : (
                // El nivel actual NO sale de `chromeLinkVariants`: no es un
                // enlace —no se pulsa— y la variante le daría una pastilla de
                // hover sobre algo que no responde. Solo comparte el alto de 44px,
                // para que la fila no cambie de altura cuando el breadcrumb tiene
                // un único nivel.
                <span
                  aria-current="page"
                  className={cn(
                    "inline-flex min-h-[44px] items-center font-medium",
                    inverted ? "text-background" : "text-foreground",
                  )}
                >
                  {item.label}
                </span>
              )}
              {!last && (
                <span aria-hidden="true" className="text-muted-foreground">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
