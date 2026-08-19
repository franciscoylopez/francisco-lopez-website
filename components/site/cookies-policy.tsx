import type { Dictionary } from "@/app/[lang]/dictionaries";
import { EMAIL } from "@/lib/contact";

import { Breadcrumb, type BreadcrumbDict } from "./breadcrumb";
import { ConsentPreferencesButton } from "./consent-preferences-button";
import { PROSE, WRAP } from "@/components/ui/layout";
import { DataTable, TD, TR } from "@/components/ui/table";
import { SectionHeader } from "@/components/ui/heading";

type CookiesDict = Dictionary["cookies"];

const GOOGLE_POLICIES_URL =
  "https://policies.google.com/technologies/partner-sites";
const MICROSOFT_PRIVACY_URL = "https://privacy.microsoft.com/privacystatement";

// Página de política de cookies / aviso de privacidad (P23). Documenta lo que la web
// carga HOY: el almacenamiento de consentimiento (localStorage), el contenedor de
// Google Tag Manager y, bajo consentimiento, Google Analytics + Microsoft Clarity (P37).
//
// MANTENIMIENTO: al añadir una herramienta nueva que use cookies o almacenamiento,
// hay que AÑADIR su fila a la tabla y actualizar la fecha de `updated` en el
// diccionario. Es criterio de cierre de esa tarea, no un extra.
export function CookiesPolicy({
  dict,
  breadcrumb,
  homeHref,
}: {
  dict: CookiesDict;
  breadcrumb: BreadcrumbDict;
  homeHref: string;
}) {
  const t = dict;
  return (
    <>
      {/* ESTA APERTURA NO LLENA EL PLIEGUE, al contrario que Brand Kit, Design
          System, Accesibilidad y el deep-dive. No es un olvido de P54: se midió y
          se decidió que no. Su encabezado son 252px de contenido —título, fecha y
          entradilla, sin ilustración ni fila de datos—, así que estirarlo a los
          1.000px del pliegue dejaría 539px de aire, más del doble de lo que hay
          dentro. Las otras cuatro llevan ~600 de contenido y ~300 de aire.

          Y hay un motivo de uso además del de proporción: esto es un documento
          que se CONSULTA, y el lector viene a por la tabla. Retrasarla una
          pantalla para que la portada respire es cambiar su trabajo por
          simetría. */}
      <section className="py-[clamp(1.5rem,3vw,1.75rem)] pb-[var(--section-y)]">
        <div className={WRAP}>
          <div data-reveal className="mb-[clamp(2.5rem,5vw,3.5rem)]">
            <Breadcrumb
              routeLabel={breadcrumb.routeLabel}
              items={[
                { label: breadcrumb.home, href: homeHref },
                { label: t.crumb },
              ]}
            />
          </div>

          <header data-reveal className={PROSE}>
            <SectionHeader
              eyebrow={t.kicker}
              title={t.title}
              level={1}
              size="page-sm"
            >
              <p className="text-muted-foreground text-[0.9rem]">{t.updated}</p>
            </SectionHeader>
            <p className="mt-6 text-[clamp(1.0625rem,1.6vw,1.2rem)] leading-[1.6]">
              {t.lead}
            </p>
          </header>

          {/* EL CUERPO VA A ANCHO DE CONTENEDOR, NO A LA MEDIDA DE LECTURA.
              Esta página era la última que quedaba con todo el cuerpo dentro de
              `PROSE` (42rem, el 52% del contenido), y a lo largo de una página
              entera eso no se lee como columna de lectura: se lee como media
              página vacía. Es la misma corrección que ya se hizo en Sobre mí
              (2026-08-16) y en el deep-dive (D53), donde quedó escrito que la
              media columna es el tratamiento de las ENTRADAS y los CIERRES, no
              del cuerpo. Medido: los párrafos del deep-dive van a 1.280px y
              aquí iban a 672.

              Se quedan en `PROSE` los dos bloques que Francisco señaló, y son
              justamente esos dos: la apertura de arriba y el Contacto del final.
              La tabla es la que más gana — cinco columnas en 42rem estrangulaban
              la de propósito, que es la única con frases. */}
          <div className="mt-[clamp(2.5rem,5vw,3.5rem)] flex flex-col gap-[clamp(2rem,4vw,3rem)]">
            {/* Qué son */}
            <Section heading={t.whatHeading}>
              <p>{t.whatBody}</p>
            </Section>

            {/* Qué usamos + tabla */}
            <Section heading={t.useHeading}>
              <p>{t.useIntro}</p>
              {/* La SEXTA tabla del sitio, que el inventario de P37.658 no contó
                  —vive en otra página— y que por tanto tenía una CUARTA definición
                  de cabecera propia, con su `bg-muted/50`, su `px-4 py-3` y sus
                  `Th`/`Td` locales. Sale de la capa como las demás. */}
              <DataTable
                caption={t.useHeading}
                // Sin anchos: reparte el navegador por contenido, que con cinco
                // columnas y una sola de frases (propósito) sale mejor que cualquier
                // porcentaje. El `minWidth` sigue haciendo falta, pero YA NO por lo
                // que decía este comentario: desde que el cuerpo va a ancho de
                // contenedor (P54.2) la tabla mide 1.278px y no lo necesita en
                // escritorio. Lo necesita en MÓVIL, donde cinco columnas en 350px se
                // convertirían en palabras sueltas — medido: con el suelo, la tabla
                // mide 572 y scrollea, que es lo correcto.
                cols={[
                  { label: t.table.name },
                  { label: t.table.provider },
                  { label: t.table.purpose },
                  { label: t.table.duration },
                  { label: t.table.category },
                ]}
                minWidth="34rem"
                className="mt-5"
              >
                {t.rows.map((row) => (
                  <TR key={row.name}>
                    <TD head>
                      <code className="text-[0.85rem]">{row.name}</code>
                    </TD>
                    <TD>{row.provider}</TD>
                    <TD className="text-muted-foreground">{row.purpose}</TD>
                    <TD className="whitespace-nowrap">{row.duration}</TD>
                    <TD className="whitespace-nowrap">{row.category}</TD>
                  </TR>
                ))}
              </DataTable>
              <p className="text-muted-foreground mt-3 text-[0.85rem] leading-relaxed">
                {t.tableNote}
              </p>
            </Section>

            {/* Base legal */}
            <Section heading={t.legalHeading}>
              <p>{t.legalBody}</p>
            </Section>

            {/* Gestionar / retirar */}
            <Section heading={t.manageHeading}>
              <p>{t.manageBody}</p>
              <div className="mt-5">
                <ConsentPreferencesButton label={t.manageButton} />
              </div>
              <p className="mt-4">{t.manageBrowser}</p>
            </Section>

            {/* Terceros */}
            <Section heading={t.thirdHeading}>
              <p>
                {t.thirdBody}{" "}
                <a
                  href={GOOGLE_POLICIES_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-content link-content--underline"
                >
                  {t.thirdLinkLabel}
                </a>{" "}
                {t.thirdBody2}{" "}
                <a
                  href={MICROSOFT_PRIVACY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-content link-content--underline"
                >
                  {t.thirdLink2Label}
                </a>
                .
              </p>
            </Section>

            {/* Vídeo incrustado. Va DESPUÉS de Terceros y en su propia sección
                porque no es una cookie que esta web ponga: es un marco de YouTube
                que no existe hasta que el visitante pulsa play, así que no cabe en
                la tabla de arriba —no tiene nombre, ni proveedor activo, ni
                duración mientras nadie lo reproduzca—. Ver `ui/video-embed.tsx`. */}
            <Section heading={t.embedHeading}>
              <p>{t.embedBody}</p>
            </Section>

            {/* Conservación */}
            <Section heading={t.retentionHeading}>
              <p>{t.retentionBody}</p>
            </Section>

            {/* Cambios */}
            <Section heading={t.changesHeading}>
              <p>{t.changesBody}</p>
            </Section>

            {/* Contacto — CIERRE, así que vuelve a la medida de lectura, igual
                que la apertura. Es el segundo de los dos bloques que se quedan
                estrechos. */}
            <Section heading={t.contactHeading} prose>
              <p>
                {t.contactBody}{" "}
                <a
                  href={`mailto:${EMAIL}`}
                  className="link-content link-content--underline"
                >
                  {EMAIL}
                </a>
                .
              </p>
            </Section>
          </div>
        </div>
      </section>
    </>
  );
}

function Section({
  heading,
  children,
  prose,
}: {
  heading: string;
  children: React.ReactNode;
  /** Solo para el cierre: lo devuelve a la medida de lectura. */
  prose?: boolean;
}) {
  return (
    <section data-reveal className={prose ? PROSE : undefined}>
      <h2 className="font-display m-0 mb-3 text-[clamp(1.35rem,2.4vw,1.65rem)] leading-[1.2] font-semibold tracking-[-0.015em]">
        {heading}
      </h2>
      <div className="text-foreground/90 [&_p]:m-0 [&_p]:text-[1rem] [&_p]:leading-[1.7]">
        {children}
      </div>
    </section>
  );
}
