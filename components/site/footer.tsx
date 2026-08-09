import { actionVariants } from "@/components/ui/action";
import { chromeLinkVariants } from "@/components/ui/chrome";
import { Logo } from "@/components/ui/logo";
import { LINKEDIN_URL } from "@/lib/contact";
import { cn } from "@/lib/utils";

import { LinkedinIcon } from "@/components/ui/icons";

export type FooterDict = {
  copyright: string;
  brandKit: string;
  designSystem: string;
  accesibilidad: string;
  cookies: string;
  linkedinAria: string;
};

// Footer compartido (PRD §7/§17). Una fila de baja densidad: logo flat 32px +
// copyright · enlaces (Brand Kit / Design System / Accesibilidad / Cookies)
// ópticamente centrados · LinkedIn. Enlaces de chrome en foreground/muted (no
// primary, BRAND.md).
export function Footer({ dict, lang }: { dict: FooterDict; lang: string }) {
  const base = lang === "es" ? "" : `/${lang}`;
  return (
    <footer className="border-border border-t">
      <div className="mx-auto flex max-w-[var(--container)] flex-col items-center gap-5 px-[var(--page-x)] py-[clamp(1.75rem,3.5vw,2.5rem)] md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-x-8">
        <div className="text-foreground flex items-center gap-[0.65rem] md:justify-self-start">
          <Logo variant="flat" className="h-8 gap-0" />
          <span className="text-muted-foreground text-[0.9rem]">
            {dict.copyright}
          </span>
        </div>

        {/* El tamaño de texto (0,9rem) es la tipografía de esta fila, no una
            métrica del enlace, así que se queda aquí — ver la nota de `chrome.tsx`. */}
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:justify-self-center">
          {[
            { href: `${base}/brand-kit`, label: dict.brandKit },
            { href: `${base}/design-system`, label: dict.designSystem },
            { href: `${base}/accesibilidad`, label: dict.accesibilidad },
            { href: `${base}/cookies`, label: dict.cookies },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={cn(
                chromeLinkVariants({ tone: "muted" }),
                "text-[0.9rem]",
              )}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={dict.linkedinAria}
          // Estaba a 40×40px, por debajo del mínimo de 44 que publica la propia
          // checklist de Accesibilidad del sitio (P37.595). Ahora el suelo lo pone
          // la variante y no depende de que nadie se acuerde.
          className={cn(
            actionVariants({ variant: "icon", size: "icon" }),
            "flex-none md:justify-self-end",
          )}
        >
          {/* Sin tamaño a mano: lo pone `size: "icon"` de la variante. */}
          <LinkedinIcon />
        </a>
      </div>
    </footer>
  );
}
