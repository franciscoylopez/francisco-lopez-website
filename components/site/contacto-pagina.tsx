import { Mail, Phone } from "lucide-react";

import { Breadcrumb, type BreadcrumbDict } from "./breadcrumb";
import { ContactForm } from "./contact-form";
import type { ContactoPaginaDict } from "@/app/[lang]/dictionaries";
import { actionVariants } from "@/components/ui/action";
import { LEAD_GAP, SectionHeader } from "@/components/ui/heading";
import { PANEL, SECTION, WRAP } from "@/components/ui/layout";
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
          <div data-reveal className="mb-[clamp(2.5rem,5vw,3.5rem)]">
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
          <div className="my-auto grid items-start gap-x-[clamp(2rem,5vw,4rem)] lg:grid-cols-[minmax(0,1.2fr)_minmax(17rem,22rem)]">
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
              className="text-muted-foreground m-0 max-w-[44ch] text-[clamp(1.05rem,1.6vw,1.2rem)] leading-[1.6] lg:col-start-1 lg:row-start-2"
            >
              {dict.lead}
            </p>

            {/* Apilados en móvil, el hueco lo pone este margen; en la rejilla de
              dos columnas se anula y manda el centrado vertical. */}
            <ul
              data-reveal
              aria-label={dict.channels.label}
              className="m-0 mt-[clamp(2rem,4vw,2.5rem)] flex list-none flex-col gap-[0.6rem] p-0 lg:col-start-2 lg:row-start-2 lg:mt-0 lg:self-center"
            >
              {canales.map(({ icon: Icon, rotulo, valor, href }) => (
                <li key={valor} className="min-w-0">
                  {/* La tarjeta pulsable entera: `variant="card"` de la capa de
                    acciones, creada aquí (P67). El prototipo la escribió con
                    clases sueltas y dejó anotado que eso era deuda. */}
                  <a
                    href={href}
                    className={cn(
                      actionVariants({ variant: "card", size: "card" }),
                    )}
                  >
                    <Icon
                      aria-hidden
                      className="text-muted-foreground shrink-0"
                    />
                    <span className="min-w-0">
                      <span className="text-muted-foreground block text-[0.75rem] tracking-[0.06em] uppercase">
                        {rotulo}
                      </span>
                      {/* Un correo de 39 caracteres es la cadena más larga que
                        sirve el sitio, y a 320px no cabe: sin esto la tarjeta
                        reabre el scroll horizontal que cerró P65.5 (medido: la
                        columna salía a 368 en un viewport de 320).

                        Y ES `anywhere`, NO el `break-words` que traía el
                        prototipo, que no bastaba: `overflow-wrap: break-word`
                        parte la línea AL PINTAR pero no reduce el ancho mínimo
                        intrínseco, así que la columna de la rejilla se seguía
                        dimensionando por la palabra entera. `anywhere` sí lo
                        reduce, y solo parte cuando hace falta, a diferencia de
                        `break-all`, que partiría el dominio siempre. */}
                      <span className="text-foreground block [overflow-wrap:anywhere]">
                        {valor}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
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
