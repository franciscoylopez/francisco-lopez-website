import { actionVariants } from "@/components/ui/action";
import { chromeLinkVariants } from "@/components/ui/chrome";
import { Logo } from "@/components/ui/logo";
import { GITHUB_URL, LINKEDIN_URL } from "@/lib/contact";
import { pagePath, type Locale } from "@/lib/i18n/config";
import type { StaticPageSlug } from "@/lib/routes";
import { cn } from "@/lib/utils";

import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";

export type FooterDict = {
  copyright: string;
  brandKit: string;
  designSystem: string;
  comoSeHaCreado: string;
  accesibilidad: string;
  cookies: string;
  linkedinAria: string;
  githubAria: string;
};

/** Las etiquetas del diccionario que rotulan una página, no un canal. */
type EtiquetaDePagina = Extract<
  keyof FooterDict,
  "comoSeHaCreado" | "brandKit" | "designSystem" | "accesibilidad" | "cookies"
>;

// QUÉ PÁGINAS ENSEÑA EL FOOTER, y por qué esto no es un `map` del registro.
//
// El footer **selecciona** —enseña cinco de las ocho estáticas— y usa **etiqueta
// propia**: «El Making of» no es el título de la página, ni su URL, ni su
// breadcrumb. Así que no puede derivarse entero de `lib/routes.ts`.
//
// Lo que sí sale de ahí es lo que se olvidaba: **que la página exista** y **cuál
// es su ruta**. `slug` es un `StaticPageSlug`, la unión de literales del
// registro, así que retirar una página de `lib/routes.ts` deja de COMPILAR aquí
// en vez de dejar un enlace muerto; y el `href` lo construye `pagePath`, la
// misma fuente que el canonical y los tres `hreflang` (D45), en vez del ternario
// `lang === "es" ? … : …` que este archivo llevaba copiado.
//
// Lo que sigue siendo una decisión y no un automatismo: **añadir** una página
// aquí. Una página nueva no aparece sola en el footer, y eso es deliberado — no
// todas van. Lo que D82 dejó al descubierto es que tampoco avisaba: «Cómo se ha
// creado» hubo que insertarla a mano y nada lo habría dicho.
const ENLACES: readonly { slug: StaticPageSlug; label: EtiquetaDePagina }[] = [
  { slug: "como-se-ha-creado", label: "comoSeHaCreado" },
  { slug: "brand-kit", label: "brandKit" },
  { slug: "design-system", label: "designSystem" },
  { slug: "accesibilidad", label: "accesibilidad" },
  { slug: "cookies", label: "cookies" },
];

// Footer compartido (PRD §7/§17). Una fila de baja densidad: logo flat 32px +
// copyright · enlaces (El Making of / Brand Kit / Design System /
// Accesibilidad / Cookies) ópticamente centrados · los dos canales de icono.
// El label del primero es solo del footer ("El Making of" / "The Making Of"):
// el título de la página, la URL y el breadcrumb siguen siendo «Cómo se ha
// creado esta página» / «How it was built».
// Enlaces de chrome en foreground/muted (no primary, BRAND.md).
export function Footer({ dict, lang }: { dict: FooterDict; lang: Locale }) {
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
          {ENLACES.map(({ slug, label }) => (
            <a
              key={slug}
              href={pagePath(lang, slug)}
              className={cn(
                chromeLinkVariants({ tone: "muted" }),
                "text-[0.9rem]",
              )}
            >
              {dict[label]}
            </a>
          ))}
        </nav>

        {/* Los dos canales de icono. El suelo táctil de 44px lo pone la variante
            `icon` y no depende de que nadie se acuerde (P37.595, cuando estaban
            a 40×40); el hueco de 0,25rem es el que deja sus dos áreas separadas
            sin que la pareja se lea como dos bloques distintos. */}
        <div className="flex flex-none items-center gap-1 md:justify-self-end">
          {[
            { href: GITHUB_URL, label: dict.githubAria, Icon: GithubIcon },
            {
              href: LINKEDIN_URL,
              label: dict.linkedinAria,
              Icon: LinkedinIcon,
            },
          ].map(({ href, label, Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className={actionVariants({ variant: "icon", size: "icon" })}
            >
              {/* Sin tamaño a mano: lo pone `size: "icon"` de la variante. */}
              <Icon />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
