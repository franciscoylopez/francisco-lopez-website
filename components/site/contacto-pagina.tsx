import { Mail, Phone } from "lucide-react";

import { Breadcrumb, type BreadcrumbDict } from "./breadcrumb";
import { ContactForm } from "./contact-form";
import type { ContactoPaginaDict } from "@/app/[lang]/dictionaries";
import { ActionCardLines, actionVariants } from "@/components/ui/action";
import {
  LEAD_GAP,
  LEAD_SIZE,
  LEADING,
  SectionHeader,
} from "@/components/ui/heading";
import {
  FOLD_CRUMB,
  FOLD_GROUP,
  PANEL,
  SECTION,
  WRAP,
} from "@/components/ui/layout";
import { EMAIL, PHONE_DISPLAY, PHONE_TEL, mailtoHref } from "@/lib/contact";
import { pagePath, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

// La página de Contacto (P67), en la dirección «Tarjetas» que eligió P66. Son
// DOS secciones, y esa división es el diseño:
//
//   1. la apertura, que OCUPA EL PLIEGUE — eyebrow + h1 arriba, entradilla
//      abajo, canales a la derecha centrados contra ella;
//   2. el formulario, centrado, ya por debajo.
//
// LA REJILLA NO ES UNA FILA DE DOS COLUMNAS, y la diferencia importa: los canales
// se centran en altura contra LA ENTRADILLA, no contra la cabecera entera. Para
// eso tienen que compartir fila con ella, así que la cabecera se parte en dos
// filas y los canales ocupan la segunda de la columna derecha. Con un `flex` de
// dos columnas el centrado sería contra el bloque completo.
//
// El hueco titular→entradilla no se escribe aquí: es `LEAD_GAP.page`, el mismo
// valor que pone `SectionHeader` cuando lleva `children`. Se importa en vez de
// copiarse (D34), para que no se desincronice el día que ese hueco cambie.
//
// QUÉ NO ESTÁ, Y ES DELIBERADO (P66): ni LinkedIn ni el CV. LinkedIn se retiró de
// los canales y su único punto del sitio pasa a ser el footer; el CV es una
// descarga, no una vía de contacto, y juntarlos era herencia de la franja de la
// home.

export function ContactoPagina({
  dict,
  breadcrumb,
  lang,
}: {
  dict: ContactoPaginaDict;
  breadcrumb: BreadcrumbDict;
  lang: Locale;
}) {
  const canales = [
    {
      icon: Mail,
      rotulo: dict.channels.email,
      valor: EMAIL,
      href: mailtoHref(),
    },
    {
      icon: Phone,
      rotulo: dict.channels.phone,
      valor: PHONE_DISPLAY,
      href: `tel:${PHONE_TEL}`,
    },
  ];

  return (
    <>
      {/* LA APERTURA OCUPA EL PLIEGUE, como Brand Kit, Design System y
          Accesibilidad, y con su misma constante: `md:min-h-[calc(100svh-5rem)]`
          (P54). El prototipo de P66 lo había evitado a propósito —temía heredar
          el `min-h` de `HERO_ROW`, que existe para cuadrar las TRES páginas del
          sistema entre sí—, pero eso es otro mecanismo: aquí no se usa
          `HERO_ROW`, se usa el andamiaje del pliegue, que es independiente.

          Lo que compra: en la primera pantalla se ve la cabecera y los canales, y
          el formulario aparece al bajar. Sin esto el formulario asomaba por
          debajo y la página abría enseñando una caja de campos en vez de decir a
          quién estás escribiendo.

          Es `min-h` y no `h`: en un portátil bajo esta apertura ya desborda el
          pliegue, y la regla no debe recortar. Y va con `md:` porque en móvil la
          rejilla apila y un alto mínimo solo metería un agujero. */}
      <section className="flex flex-col py-[clamp(1.5rem,3vw,1.75rem)] pb-[var(--section-y)] md:min-h-[calc(100svh-5rem)]">
        {/* El `w-full` evita que el `mx-auto` de `WRAP` desactive el stretch. */}
        <div className={cn(WRAP, "flex w-full flex-1 flex-col")}>
          <div data-reveal className={FOLD_CRUMB}>
            <Breadcrumb
              routeLabel={breadcrumb.routeLabel}
              items={[
                { label: breadcrumb.home, href: pagePath(lang) },
                { label: dict.crumb },
              ]}
            />
          </div>

          {/* `my-auto`: dentro del pliegue, el bloque se centra en el aire que
              sobra en vez de quedarse pegado al breadcrumb. */}
          <div
            className={cn(
              FOLD_GROUP,
              // `content-start` NO es decorado: sin él, el suelo de `FOLD_GROUP`
              // rompe justo esta apertura. Un grid con `min-height` y filas
              // automáticas reparte el sobrante ENTRE LAS FILAS —`align-content`
              // vale `normal`, que aquí se comporta como `stretch`—, así que los
              // 167px que le faltaban a esta página se metían entre el titular y
              // su entradilla y las separaban un dedo. Las otras tres no lo
              // sufren porque su grupo es un bloque, no un grid.
              "grid content-start items-start gap-x-[clamp(2rem,5vw,4rem)] lg:grid-cols-[minmax(0,1.2fr)_minmax(17rem,22rem)]",
            )}
          >
            <div
              data-reveal
              className={cn(LEAD_GAP.page, "lg:col-start-1 lg:row-start-1")}
            >
              <SectionHeader
                eyebrow={dict.kicker}
                title={dict.title}
                level={1}
                size="page"
              />
            </div>

            <p
              data-reveal
              className={cn(
                LEAD_SIZE,
                LEADING.lead,
                "text-muted-foreground m-0 max-w-[44ch] lg:col-start-1 lg:row-start-2",
              )}
            >
              {dict.lead}
            </p>

            {/* Apilados en móvil, el hueco lo pone este margen; en la rejilla de
              dos columnas se anula y manda el centrado vertical. */}
            {/* `<address>` (P67.6): es el elemento exacto para los datos de
              contacto de la persona de la que habla el documento, y esta es la
              única página del sitio que los PUBLICA como contenido. El footer no
              lo lleva a propósito: allí los mismos canales son carpintería de
              navegación, y un `<address>` por página repetiría la afirmación
              catorce veces.

              ENVUELVE Y NO SUSTITUYE A LA LISTA: son dos cosas distintas —esto
              es información de contacto, aquello es una lista de dos canales— y
              `<address>` no puede tener `<li>`. Se lleva la colocación en la
              rejilla y la lista se queda con su forma; `not-italic` desactiva la
              cursiva que el navegador le pone por defecto, que es lo único que
              este elemento cambia de aspecto. */}
            <address
              data-reveal
              className="mt-[clamp(2rem,4vw,2.5rem)] not-italic lg:col-start-2 lg:row-start-2 lg:mt-0 lg:self-center"
            >
              <ul
                aria-label={dict.channels.label}
                className="m-0 flex list-none flex-col gap-[0.6rem] p-0"
              >
                {canales.map(({ icon: Icon, rotulo, valor, href }) => (
                  <li key={valor} className="min-w-0">
                    {/* La tarjeta pulsable entera: `variant="card"` de la capa de
                    acciones, creada aquí (P67). El prototipo la escribió con
                    clases sueltas y dejó anotado que eso era deuda. El interior
                    —icono, rótulo y valor— sale de `ActionCardLines`, de la misma
                    capa: estaba escrito aquí y otra vez en su demo del Design
                    System, byte a byte (design-review, 2026-08-23). */}
                    <a
                      href={href}
                      className={cn(
                        actionVariants({ variant: "card", size: "card" }),
                      )}
                    >
                      <ActionCardLines
                        icon={<Icon aria-hidden />}
                        label={rotulo}
                        value={valor}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </address>
          </div>
        </div>
      </section>

      {/* EL FORMULARIO ES OTRA SECCIÓN, no un bloque más de la apertura, y por
          eso el filete que lo separa es el `border-t` de `SECTION` en vez de una
          línea escrita a mano: es el mismo ritmo con el que se separan las
          secciones del resto del sitio, y así el pliegue de arriba lo cierra
          exactamente donde cierran las demás páginas. */}
      <section className={SECTION}>
        <div className={WRAP}>
          <div
            data-reveal
            className={cn(
              PANEL,
              "mx-auto max-w-[52rem] p-[clamp(1.5rem,3vw,2.25rem)]",
            )}
          >
            <ContactForm
              dict={dict.form}
              lang={lang}
              legalHref={`${pagePath(lang, "cookies")}#privacidad`}
            />
          </div>
        </div>
      </section>
    </>
  );
}
