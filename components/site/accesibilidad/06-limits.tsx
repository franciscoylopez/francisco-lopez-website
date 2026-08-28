import { type Dictionary } from "@/app/[lang]/dictionaries";
import { SectionHeader } from "@/components/ui/heading";
import { InfoCard } from "@/components/ui/info-card";
import { SECTION, WRAP } from "@/components/ui/layout";
import { Rich } from "@/components/ui/rich";
import { cn } from "@/lib/utils";

import { INTRO, NOTA, type SeccionMarco } from "./shared";

type T = Dictionary["accesibilidad"];

/* ===================== (06) LÍMITES CONOCIDOS ===================== */
export function Limits({ t, marco }: { t: T["limits"]; marco: SeccionMarco }) {
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
          <p className={INTRO}>{t.intro}</p>
        </SectionHeader>
        <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,19rem),1fr))] gap-[var(--gutter)]">
          {t.items.map((l) => (
            <InfoCard key={l.title} title={l.title} body={l.body} />
          ))}
        </div>
        {/* El matiz que no cabe en una tarjeta: más largo que el resto y
              deformaba la rejilla. Mismo patrón que la nota de (01). */}
        <p className={NOTA}>
          <Rich text={t.note} />
        </p>
        {marco.closer}
      </div>
    </section>
  );
}
