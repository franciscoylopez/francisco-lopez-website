import { ArrowRight, Download } from "lucide-react";

import type {
  TrayectoriaComunDict,
  TrayectoriaIndiceDict,
} from "@/app/[lang]/dictionaries";
import { EXPERIENCES, type ExperienceSlug } from "@/content/experiences";
import { factsOf } from "@/content/experience-copy";
import { actionVariants } from "@/components/ui/action";
import {
  LEAD_SIZE,
  LEADING,
  SectionHeader,
  dataLabelVariants,
  titleVariants,
} from "@/components/ui/heading";
import { FOLD_CRUMB, FOLD_GROUP, SECTION, WRAP } from "@/components/ui/layout";
import { type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

import { BrandLogoBox } from "./brand-logo-box";
import { Periodo } from "./periodo";
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
    <>
      {/* LA APERTURA OCUPA EL PLIEGUE, como Brand Kit, Design System,
          Accesibilidad y Contacto, y con su misma constante:
          `md:min-h-[calc(100svh-5rem)]` (P54, D144). No es que la invariante se
          hubiera roto: es que esta página NUNCA entró en ella. Sin grupo de
          pliegue, `npm run pliegue` la contaba entre las diez que no lo usan, así
          que no había nada que pudiera avisar. Medido antes de tocarlo, a
          1920×1080: el `h1` caía a 249px contra los 389 de las otras cuatro, y la
          rejilla de tarjetas asomaba a 569 — la página abría enseñando el índice
          en vez de decir qué es.

          Y SU CASO ES EL DE CONTACTO, no el de las tres del sistema: la apertura
          es tipográfica —no usa `HERO_ROW` ni tiene fila de cifras—, así que por
          estructura no llega a los 464px que miden las otras. Lo que la cuadra no
          es compactar nada, es el SUELO de `FOLD_GROUP`, que existe exactamente
          para este caso (P70.35). El sobrante cae debajo del contenido.

          Es `min-h` y no `h`, y va con `md:`, por lo mismo que en las otras
          cuatro: en un portátil esta apertura ya desborda el pliegue y la regla no
          debe recortar; en móvil, llenar el pliegue no compra nada. */}
      <section className="flex flex-col py-[clamp(1.5rem,3vw,1.75rem)] pb-[var(--section-y)] md:min-h-[calc(100svh-5rem)]">
        {/* El `w-full` evita que el `mx-auto` de `WRAP` desactive el stretch. */}
        <div className={cn(WRAP, "flex w-full flex-1 flex-col")}>
          <div data-reveal className={FOLD_CRUMB}>
            <Breadcrumb
              routeLabel={breadcrumb.routeLabel}
              items={[
                { label: breadcrumb.home, href: homeHref },
                { label: comun.crumbIndice },
              ]}
            />
          </div>

          {/* `my-auto`: dentro del pliegue el grupo se centra en el aire que
              sobra, en vez de quedarse pegado al breadcrumb. El `mb` que este
              bloque llevaba —`clamp(2.5rem,5vw,4rem)` hasta la rejilla— se va con
              la rejilla a su propia sección: el hueco lo pone ahora el ritmo del
              sistema, no un valor escrito aquí. */}
          <div className={FOLD_GROUP}>
            {/* EL `h1` AL TAMAÑO DE SUS HERMANAS DEL PLIEGUE, que es la otra
                mitad de esta tarea. Medido: el eyebrow (13px) y la entradilla
                (19,2px) YA coincidían con las otras cuatro —lo dejó así P72.26 al
                unificar las entradillas—, así que el único divergente era el
                titular: 56px (`page-sm`) contra los 80 de `page`.

                Y NO ERA UN CAMBIO DE UNA PALABRA. Con `page` dentro de `PROSE`
                (42rem) este titular —el más largo de las cinco aperturas— cae a
                CUATRO líneas y el grupo se va a 506px con el `h1` a 367: o sea,
                subir el tamaño rompía el pliegue que esta misma tarea acaba de
                arreglar. La medida de 50rem es donde vuelve a dos líneas, y con
                ella el grupo mide 464 y el `h1` cae a 389, igual que las otras
                cuatro. Es el ancho del TITULAR, no el de la página: la entradilla
                se queda en su medida de lectura, como en las tres del sistema. */}
            <header data-reveal className="max-w-[50rem]">
              <SectionHeader
                eyebrow={dict.eyebrow}
                title={dict.title}
                level={1}
                size="page"
              >
                <p className={cn(LEAD_SIZE, LEADING.lead, "max-w-[46ch]")}>
                  {dict.lead}
                </p>
              </SectionHeader>
            </header>
          </div>
        </div>
      </section>

      {/* LA REJILLA SALE DE LA APERTURA, que es lo que hace que la apertura sea
          una portada y no una portada con el principio de otra cosa debajo.
          Sección propia con `SECTION` —filete superior y ritmo vertical—, igual
          que la sección que sigue al pliegue en Contacto. */}
      <section className={SECTION}>
        <div className={WRAP}>
          <ul
            data-reveal
            className="m-0 grid list-none gap-[var(--gutter)] p-0 md:grid-cols-2 lg:grid-cols-3"
          >
            {CON_PAGINA.map((exp) => {
              const slug = exp.slug as ExperienceSlug;
              const { role, sector } = factsOf(lang, exp.company);
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
                    <h2 className={titleVariants({ size: "card" })}>
                      {claims[slug]}
                    </h2>

                    <p className="text-muted-foreground mt-auto flex items-center justify-between gap-3 pt-[1.4rem] text-[0.9rem] [font-variant-numeric:tabular-nums]">
                      <span>
                        {role} · <Periodo lang={lang} company={exp.company} />
                      </span>
                      {/* Mismo gesto y misma excepción de movimiento que la flecha
                          del cierre de página: la clase va escrita entera, no
                          compuesta, porque Tailwind escanea el fuente como texto
                          plano. */}
                      <span className="transition-transform group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-focus-visible:translate-x-0">
                        <ArrowRight
                          aria-hidden="true"
                          className="size-[18px]"
                        />
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
            <p className="text-muted-foreground m-0 max-w-[52ch] text-[0.92rem] leading-[1.6]">
              {dict.ctaNota}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
