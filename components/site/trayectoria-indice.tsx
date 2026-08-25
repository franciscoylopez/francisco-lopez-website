import { ArrowRight, Download } from "lucide-react";

import type {
  TrayectoriaComunDict,
  TrayectoriaIndiceDict,
} from "@/app/[lang]/dictionaries";
import { EXPERIENCES, type ExperienceSlug } from "@/content/experiences";
import { factsOf } from "@/content/experience-copy";
import { actionVariants } from "@/components/ui/action";
import { SectionHeader, dataLabelVariants } from "@/components/ui/heading";
import { PROSE, WRAP } from "@/components/ui/layout";
import { type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

import { BrandLogoBox } from "./brand-logo-box";
import { Breadcrumb, type BreadcrumbDict } from "./breadcrumb";
import { Marcas } from "@/components/ui/marcas";

// ÍNDICE DEL DEEP-DIVE (P49). La página que le faltaba a la ruta: el breadcrumb
// de tres niveles de las cinco experiencias —`Inicio › Trayectoria › Emendu`—
// apuntaba aquí desde que se montaron, así que hasta ahora eran diez páginas con
// un enlace roto en su carpintería.
//
// QUÉ LISTA, Y POR QUÉ SOLO CINCO. Las que tienen caso, no la trayectoria
// entera: esa ya está en la sección de la portada y en el CV, y repetirla aquí
// habría hecho del índice una copia de la home con tres filas que no llevan a
// ningún sitio. Lo dice el pie del CV, para que la ausencia se lea como una
// decisión y no como un hueco (decidido con Francisco el 2026-08-18).
//
// NINGUNA TARJETA TIENE COPY PROPIO, y es lo único que de verdad había que
// acertar. Empresa, sector, rol y periodo salen del registro por experiencia
// —la fuente que D57/D58 acaban de fijar— y la afirmación es el `title` del
// deep-dive, o sea el h1 de la página a la que la tarjeta lleva. Un resumen
// escrito aquí habría sido la CUARTA longitud del mismo hecho, después de las
// tres que P48.5 acababa de unificar; y el modo de fallo no es teórico —el sitio
// ya tuvo la frase de INDYA hablando de «pricing y onboarding» cuando su página
// afirma justo lo contrario—.
//
// EL ORDEN LO PONE `EXPERIENCES`, cronológico descendente, igual que en la
// portada, en los logos y en el paso a la vecina. No se escribe en ningún sitio.

/** Las que tienen página, en el orden canónico del registro. */
const CON_PAGINA = EXPERIENCES.filter((e) => e.slug !== null);

// La tarjeta comparte forma con la del cierre de página (`ui/page-closer.tsx`) y
// aun así se escribe aquí. No es descuido: aquélla sube ENTERA —sección, rótulo y
// rejilla, con el ritmo corto de un remate— porque lo que no debe divergir es el
// formato del cierre, y ésta es el CONTENIDO de la página, con logo y con un
// titular de verdad dentro. Extraer una primitiva común obligaría a tocar el
// cierre de seis páginas para no ganar nada hoy; si aparece un tercer caso, ese
// será el momento (regla 4 de `BRAND.md` §Cómo se escribe una regla: antes de
// unificar dos valores que se parecen, mirar si significan cosas distintas).
// SALE DE LA VARIANTE `card` (P70.15). Escrita a mano le faltaba el
// `focus-visible:bg-muted`, así que el teclado no recibía lo que recibe el ratón.
// El `border-control-edge` que antes había que pedir aquí —esta tarjeta SE PULSA, y
// WCAG 1.4.11 le pide 3:1 al contorno que la identifica— ya viene dentro: es la
// diferencia entre un filete decorativo y el contorno de un control (D97).
//
// LO QUE SE NEUTRALIZA: `size="card"` dimensiona una FILA (icono + etiqueta) y esto
// es una pila, así que hay que devolver el `align-items` a `stretch` y el `gap` a
// cero. Sin eso, el contenido se encogería al centro y las tres partes se separarían
// 12px — dos cambios visuales que no pide nadie.
const TARJETA = cn(
  actionVariants({ variant: "card", size: "card" }),
  "group flex h-full flex-col items-stretch gap-0 p-[1.4rem]",
);

export function TrayectoriaIndice({
  dict,
  comun,
  claims,
  breadcrumb,
  homeHref,
  cvHref,
  hrefDe,
  lang,
}: {
  dict: TrayectoriaIndiceDict;
  comun: TrayectoriaComunDict;
  /** El h1 de cada deep-dive, leído de su propio diccionario. */
  claims: Record<ExperienceSlug, string>;
  breadcrumb: BreadcrumbDict;
  homeHref: string;
  cvHref: string;
  /** Ruta de una experiencia, ya con el locale resuelto. */
  hrefDe: (slug: string) => string;
  lang: Locale;
}) {
  return (
    <section className="py-[clamp(1.5rem,3vw,1.75rem)] pb-[var(--section-y)]">
      <div className={WRAP}>
        <div data-reveal className="mb-[clamp(2.5rem,5vw,3.5rem)]">
          <Breadcrumb
            routeLabel={breadcrumb.routeLabel}
            items={[
              { label: breadcrumb.home, href: homeHref },
              { label: comun.crumbIndice },
            ]}
          />
        </div>

        <header
          data-reveal
          className={cn(PROSE, "mb-[clamp(2.5rem,5vw,4rem)]")}
        >
          <SectionHeader
            eyebrow={dict.eyebrow}
            title={dict.title}
            level={1}
            size="page-sm"
          >
            <p className="text-[clamp(1.0625rem,1.6vw,1.2rem)] leading-[1.6] text-pretty">
              {dict.lead}
            </p>
          </SectionHeader>
        </header>

        <ul
          data-reveal
          className="m-0 grid list-none gap-[var(--gutter)] p-0 md:grid-cols-2 lg:grid-cols-3"
        >
          {CON_PAGINA.map((exp) => {
            const slug = exp.slug as ExperienceSlug;
            const { role, period, sector } = factsOf(lang, exp.company);
            return (
              <li key={slug} className="m-0">
                <a href={hrefDe(slug)} className={TARJETA}>
                  <div className="mb-[1.1rem] flex items-start justify-between gap-3">
                    <p className={dataLabelVariants()}>
                      <Marcas>{exp.company}</Marcas> · {sector}
                    </p>
                    {exp.logo ? <BrandLogoBox name={exp.logo} /> : null}
                  </div>

                  {/* El titular de la tarjeta ES el h1 de su página. Va como h2
                      —y no como un párrafo en negrita— porque es lo que hace
                      navegable la rejilla con un lector de pantalla: cinco
                      encabezados de segundo nivel bajo el h1 de la página, sin
                      saltos (punto 4 del checklist). */}
                  <h2 className="font-display m-0 text-[clamp(1.15rem,1.7vw,1.4rem)] leading-[1.25] font-semibold tracking-[-0.015em] text-balance">
                    {claims[slug]}
                  </h2>

                  <p className="text-muted-foreground mt-auto flex items-center justify-between gap-3 pt-[1.4rem] text-[0.9rem] [font-variant-numeric:tabular-nums]">
                    <span>
                      {role} · {period}
                    </span>
                    {/* Mismo gesto y misma excepción de movimiento que la flecha
                        del cierre de página: la clase va escrita entera, no
                        compuesta, porque Tailwind escanea el fuente como texto
                        plano. */}
                    <span className="transition-transform group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-focus-visible:translate-x-0">
                      <ArrowRight aria-hidden="true" className="size-[18px]" />
                    </span>
                  </p>
                </a>
              </li>
            );
          })}
        </ul>

        {/* El CV cierra el índice como cierra la sección de la portada, y con él
            va la nota que explica por qué aquí hay cinco y no ocho. La nota es
            copy y no una fila apagada a propósito: una tarjeta que no lleva a
            ningún sitio se lee como un enlace roto. */}
        <div
          data-reveal
          className="mt-[clamp(2.5rem,5vw,3.5rem)] flex flex-wrap items-center gap-x-8 gap-y-4"
        >
          <a
            href={cvHref}
            download
            className={cn(
              actionVariants({ variant: "outline-primary" }),
              "flex-none",
            )}
          >
            <Download aria-hidden="true" />
            {dict.cta}
          </a>
          <p className="text-muted-foreground m-0 max-w-[52ch] text-[0.92rem] leading-[1.6] text-pretty">
            {dict.ctaNota}
          </p>
        </div>
      </div>
    </section>
  );
}
