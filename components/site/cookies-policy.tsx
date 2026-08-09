import type { Dictionary } from "@/app/[lang]/dictionaries";
import { EMAIL } from "@/lib/contact";

import { Breadcrumb, type BreadcrumbDict } from "./breadcrumb";
import { ConsentPreferencesButton } from "./consent-preferences-button";
import { PROSE, WRAP } from "@/components/ui/layout";

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
    <main id="top">
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
            <p className="text-muted-foreground m-0 mb-5 text-[0.8125rem] font-semibold tracking-[0.09em] uppercase">
              {t.kicker}
            </p>
            <h1 className="font-display m-0 text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.05] font-semibold tracking-[-0.025em]">
              {t.title}
            </h1>
            <p className="text-muted-foreground mt-4 text-[0.9rem]">
              {t.updated}
            </p>
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
              <div className="border-border mt-5 overflow-x-auto rounded-xl border">
                <table className="w-full min-w-[34rem] border-collapse text-left text-[0.9rem]">
                  <thead>
                    <tr className="border-border bg-muted/50 border-b">
                      <Th>{t.table.name}</Th>
                      <Th>{t.table.provider}</Th>
                      <Th>{t.table.purpose}</Th>
                      <Th>{t.table.duration}</Th>
                      <Th>{t.table.category}</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.rows.map((row) => (
                      <tr
                        key={row.name}
                        className="border-border border-b last:border-0"
                      >
                        <Td>
                          <code className="text-[0.85rem]">{row.name}</code>
                        </Td>
                        <Td>{row.provider}</Td>
                        <Td className="text-muted-foreground">{row.purpose}</Td>
                        <Td className="whitespace-nowrap">{row.duration}</Td>
                        <Td className="whitespace-nowrap">{row.category}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                <ConsentPreferencesButton
                  label={t.manageButton}
                  variant="button"
                />
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
    </main>
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

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th scope="col" className="text-foreground px-4 py-3 font-semibold">
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 align-top ${className}`}>{children}</td>;
}
