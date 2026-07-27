import { Logo } from "@/components/ui/logo";

import { LinkedinIcon } from "./icons";

export type FooterDict = {
  copyright: string;
  brandKit: string;
  designSystem: string;
  linkedinAria: string;
};

const LINKEDIN_URL = "https://www.linkedin.com/in/franciscolopez1975/";

// Footer compartido (PRD §7/§17). Una fila de baja densidad: logo flat 32px +
// copyright · enlaces (Brand Kit / Design System) ópticamente centrados · LinkedIn.
// Enlaces de chrome en foreground/muted (no primary, BRAND.md). Las rutas de Brand
// Kit y Design System se construyen en su propia tarea (hoy 404 hasta entonces).
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

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:justify-self-center">
          <a
            href={`${base}/brand-kit`}
            className="text-muted-foreground text-[0.9rem] underline-offset-4 hover:underline focus-visible:underline"
          >
            {dict.brandKit}
          </a>
          <a
            href={`${base}/design-system`}
            className="text-muted-foreground text-[0.9rem] underline-offset-4 hover:underline focus-visible:underline"
          >
            {dict.designSystem}
          </a>
        </nav>

        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={dict.linkedinAria}
          className="border-border text-foreground inline-flex h-10 w-10 flex-none items-center justify-center rounded-md border md:justify-self-end"
        >
          <LinkedinIcon className="size-[18px]" />
        </a>
      </div>
    </footer>
  );
}
