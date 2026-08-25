import { type Dictionary } from "@/app/[lang]/dictionaries";
import { SectionHeader } from "@/components/ui/heading";
import { InfoCard } from "@/components/ui/info-card";
import { PAIR, SECTION, WRAP } from "@/components/ui/layout";
import { PageCloser, type CloserItem } from "@/components/ui/page-closer";
import { type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

import { GroupHead, SpecimenCard } from "./shared";

/* ===================== (17) BLOQUES DE PÁGINA =====================
    Sección propia, y el criterio es el que pide la skill: se justifica cuando
    lo que falta no es una pieza más sino un SITIO. Estas dos no encajan en
    ninguna de las que ya existen —no son un control con caja (09), ni un enlace
    (08), ni un rótulo (10), ni una cabecera (11)—, y las dos comparten
    exactamente el mismo pasado: se escribieron a mano en dos páginas distintas
    y ya se leían distinto antes de que nadie lo notara. La nota nació dos veces
    (P37.62, solo una tenía `mono`); el cierre lo estrenaron las tres páginas del
    sistema y volvió a decidirse entero al aparecer el deep-dive (P48).

    Por eso van juntas y por eso el titular habla de FORMATO: lo que sube a la
    capa no es el aspecto de una caja, es la decisión de que no la tome cada
    página por su cuenta.

    EL CIERRE SE DEMUESTRA ENTERO, con su ritmo vertical propio y su filete de
    arriba, porque es justo eso lo que se publica. Y lleva `labelId` propio: la
    página ya termina con un cierre de verdad, y dos `id` iguales en el mismo
    documento es un defecto de accesibilidad, no un detalle. */
export function Bloques({
  t,
  lang,
}: {
  t: Dictionary["designSystem"]["bloques"];
  lang: Locale;
}) {
  const base = lang === "es" ? "" : `/${lang}`;

  // Los dos estados de un destino, que son los dos que el sitio pinta: el que
  // enlaza y el que todavía no existe. El enlace es REAL, como todo en esta
  // página: una demo con `href="#"` no comprobaría ni el foco ni el hover.
  const demoItems: CloserItem[] = [
    {
      key: "back",
      kicker: t.demoBackKicker,
      name: t.demoBackName,
      desc: t.demoBackDesc,
      href: `${base}/trayectoria/kuotip`,
      direction: "back",
    },
    {
      key: "soon",
      kicker: t.demoSoonKicker,
      name: t.demoSoonName,
      desc: t.demoSoonDesc,
      badge: t.demoSoonBadge,
    },
  ];

  return (
    <section data-reveal className={SECTION}>
      <div className={WRAP}>
        <SectionHeader eyebrow={t.num} title={t.title} size="section-sm">
          <p className="text-muted-foreground m-0 mb-10 max-w-[var(--measure)] text-[0.95rem]">
            {t.lead}
          </p>
        </SectionHeader>

        <GroupHead title={t.noteTitle} lead={t.noteLead} first />
        <div className={PAIR}>
          <SpecimenCard
            kicker={t.noteKicker}
            cls="InfoCard"
            rule={t.noteRule}
            note={t.noteNote}
            wide
          >
            <InfoCard title={t.demoNoteTitle} body={t.demoNoteBody} />
          </SpecimenCard>
          <SpecimenCard
            kicker={t.monoKicker}
            cls="InfoCard · mono"
            rule={t.monoRule}
            note={t.monoNote}
            wide
          >
            <InfoCard
              mono
              title={t.demoMonoTitle}
              bullets={t.demoMonoBullets}
              foot={t.demoMonoFoot}
            />
          </SpecimenCard>
        </div>

        <GroupHead title={t.closerTitle} lead={t.closerLead} />
        <SpecimenCard
          kicker={t.closerKicker}
          cls="PageCloser"
          rule={t.closerRule}
          note={t.closerNote}
          wide
        >
          <PageCloser
            eyebrow={t.demoCloserEyebrow}
            items={demoItems}
            labelId="ds-closer-demo-label"
          />
        </SpecimenCard>

        {/* Las dos reglas que esta sección publica y que no se ven mirando una
            caja. En `PAIR`, como en (09) y (16): apiladas a la medida de lectura
            dejarían media sección vacía (P37.62). */}
        <div className={cn(PAIR, "mt-8")}>
          <InfoCard
            title={t.twiceTitle}
            bullets={t.twiceRule}
            foot={t.twiceFoot}
          />
          <InfoCard
            title={t.wholeTitle}
            bullets={t.wholeRule}
            foot={t.wholeFoot}
          />
        </div>
      </div>
    </section>
  );
}
