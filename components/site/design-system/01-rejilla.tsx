import { type Dictionary } from "@/app/[lang]/dictionaries";
import { InfoCard } from "@/components/ui/info-card";
import { SECTION, WRAP } from "@/components/ui/layout";
import { GUTTER_RANGE_PX } from "@/lib/design-values";
import { GridDemo } from "../design-system-islands";

/* ===================== (01) REJILLA ===================== */
export function Rejilla({ t }: { t: Dictionary["designSystem"]["rejilla"] }) {
  return (
    <section data-reveal className={SECTION}>
      <div className={WRAP}>
        <GridDemo
          num={t.num}
          title={t.title}
          showLabel={t.showGrid}
          hideLabel={t.hideGrid}
          lead={t.lead}
          baseLabel={t.baseLabel}
          baseVal={t.baseVal}
          gutterLabel={t.gutterLabel}
          gutterVal={`var(--gutter) · ${GUTTER_RANGE_PX}`}
          hint={t.hint}
        />
        <div className="mt-8 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,15rem),1fr))] gap-[var(--gutter)]">
          {t.cards.map((c) => (
            <InfoCard key={c.title} title={c.title} body={c.body} />
          ))}
        </div>
      </div>
    </section>
  );
}
