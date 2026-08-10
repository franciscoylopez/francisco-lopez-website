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

          <div
            className={`mt-[clamp(2.5rem,5vw,3.5rem)] flex flex-col gap-[clamp(2rem,4vw,3rem)] ${PROSE}`}
          >
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
                // Sin anchos: en una columna de lectura de 42rem, cinco columnas
                // repartidas a porcentaje estrangulan la de propósito —que es la
                // única con frases— y parte cada una en palabras sueltas. Aquí
                // reparte el navegador por contenido, y el suelo lo pone `minWidth`.
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

            {/* Conservación */}
            <Section heading={t.retentionHeading}>
              <p>{t.retentionBody}</p>
            </Section>

            {/* Cambios */}
            <Section heading={t.changesHeading}>
              <p>{t.changesBody}</p>
            </Section>

            {/* Contacto */}
            <Section heading={t.contactHeading}>
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
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section data-reveal>
      <h2 className="font-display m-0 mb-3 text-[clamp(1.35rem,2.4vw,1.65rem)] leading-[1.2] font-semibold tracking-[-0.015em]">
        {heading}
      </h2>
      <div className="text-foreground/90 [&_p]:m-0 [&_p]:text-[1rem] [&_p]:leading-[1.7]">
        {children}
      </div>
    </section>
  );
}
