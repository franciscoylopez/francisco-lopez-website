import { type Dictionary } from "@/app/[lang]/dictionaries";
import { Field, FieldErrorSummary } from "@/components/ui/field";
import { SectionHeader } from "@/components/ui/heading";
import { InfoCard } from "@/components/ui/info-card";
import { PAIR, SECTION, WRAP } from "@/components/ui/layout";
import { cn } from "@/lib/utils";

import { GroupHead, SpecimenCard } from "./shared";

/* ===================== (16) FORMULARIO =====================
    Sección propia y no un subapartado de (09), y el criterio es el que la skill
    `publicar-en-design-system` pide aplicar: se justifica cuando la pieza es una
    CAPA, no cuando es una pieza más. Esta lo es. Hasta P67 el sitio no tenía
    formularios —era de solo lectura entero— y el campo no encaja en ninguna de
    las que ya existen: no es un control con caja (09), ni un enlace (08), ni un
    rótulo que no se pulsa (10). Es la primera superficie que RECIBE.

    LOS ESPECÍMENES SON LOS CAMPOS REALES, no una imitación con clases sueltas:
    el mismo `Field` que sirve `/contacto`. Si mañana cambia el borde de error o
    el suelo táctil, esta página cambia con él. Es la promesa entera de la
    página, y la razón por la que las demos nunca son maquetas.

    LOS CAMPOS DE LA DEMO NO SON INTERACTIVOS a propósito (`readOnly`): un campo
    editable aquí invita a escribir en un formulario que no envía a ningún sitio,
    y además metería tres controles de teclado en medio de una página de lectura.
    Siguen siendo focalizables, que es lo que hace que el anillo de foco se pueda
    comprobar aquí mismo. */
export function Formulario({
  t,
}: {
  t: Dictionary["designSystem"]["formulario"];
}) {
  return (
    <section data-reveal className={SECTION}>
      <div className={WRAP}>
        <SectionHeader eyebrow={t.num} title={t.title} size="section-sm">
          <p className="text-muted-foreground m-0 mb-10 max-w-[var(--measure)] text-[0.95rem]">
            {t.lead}
          </p>
        </SectionHeader>

        <GroupHead title={t.fieldTitle} lead={t.fieldLead} first />
        <div className={PAIR}>
          <SpecimenCard
            kicker={t.fieldKicker}
            cls="Field"
            rule={t.fieldRule}
            note={t.fieldNote}
            wide
          >
            <Field
              id="ds-field-ok"
              name="ds-field-ok"
              label={t.demoLabel}
              placeholder={t.demoPlaceholder}
              readOnly
            />
          </SpecimenCard>
          <SpecimenCard
            kicker={t.errorKicker}
            cls="Field · error"
            rule={t.errorRule}
            note={t.errorNote}
            wide
          >
            <Field
              id="ds-field-error"
              name="ds-field-error"
              label={t.demoLabel}
              placeholder={t.demoPlaceholder}
              error={t.demoError}
              readOnly
            />
          </SpecimenCard>
        </div>

        <GroupHead title={t.summaryTitle} lead={t.summaryLead} />
        <SpecimenCard
          kicker={t.summaryKicker}
          cls="FieldErrorSummary"
          rule={t.summaryRule}
          wide
        >
          <FieldErrorSummary title={t.demoSummary} items={t.demoSummaryItems} />
        </SpecimenCard>

        {/* Las dos reglas que esta capa publica y que no se ven mirando un
            campo. En `PAIR` y no apiladas: son hermanas y a la medida de lectura
            dejarían media sección vacía (P37.62). */}
        <div className={cn(PAIR, "mt-8")}>
          <InfoCard title={t.redTitle} bullets={t.redRule} />
          <InfoCard title={t.serverTitle} bullets={t.serverRule} />
        </div>
      </div>
    </section>
  );
}
