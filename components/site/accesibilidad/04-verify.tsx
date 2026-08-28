import { type Dictionary } from "@/app/[lang]/dictionaries";
import { SectionHeader } from "@/components/ui/heading";
import { InfoCard } from "@/components/ui/info-card";
import { SECTION, WRAP } from "@/components/ui/layout";
import { Rich } from "@/components/ui/rich";
import { fillPages } from "@/lib/design-values";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

import { INTRO, NOTA, type FillCounts, type SeccionMarco } from "./shared";

type T = Dictionary["accesibilidad"];

/* ===================== (04) CÓMO SE VERIFICA ===================== */
export function Verify({
  t,
  marco,
  fillCounts,
  lang,
}: {
  t: T["verify"];
  marco: SeccionMarco;
  fillCounts: FillCounts;
  lang: Locale;
}) {
  return (
    <section
      data-reveal
      id={marco.id}
      className={cn(SECTION, "scroll-mt-[5rem]")}
    >
      <div className={WRAP}>
        <SectionHeader
          eyebrow={marco.kicker}
          title={t.heading}
          size="section-sm"
        >
          {/* Con `Rich` desde P70.105: aquí caen los enlaces de axe-core y
                Lighthouse, en la primera vez que se nombran en texto corrido y
                justo encima de las tarjetas que los describen. */}
          <p className={INTRO}>
            <Rich text={t.intro} />
          </p>
        </SectionHeader>
        <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,15rem),1fr))] gap-[var(--gutter)]">
          {t.items.map((v) => (
            <InfoCard
              key={v.tool}
              title={v.tool}
              body={fillPages(v.result, lang)}
              mono
            />
          ))}
        </div>
        {/* El matiz que no cabe en una tarjeta: más largo que el resto y
              deformaba la rejilla. Mismo patrón que la nota de (01). */}
        <p className={NOTA}>
          <Rich text={fillCounts(t.note)} />
        </p>
        {marco.closer}
      </div>
    </section>
  );
}
