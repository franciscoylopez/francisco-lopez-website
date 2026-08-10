import { type Dictionary } from "@/app/[lang]/dictionaries";
import { SectionHeader } from "@/components/ui/heading";
import { PANEL, SECTION, WRAP } from "@/components/ui/layout";
import { SECTION_Y_RANGE_PX, SPACING_SCALE } from "@/lib/design-values";

/* ===================== (04) RITMO ===================== */
export function Ritmo({ t }: { t: Dictionary["designSystem"]["ritmo"] }) {
  return (
    <section data-reveal className={SECTION}>
      <div className={WRAP}>
        <SectionHeader eyebrow={t.num} title={t.title} size="section-sm">
          <p className="text-muted-foreground m-0 mb-10 max-w-[var(--measure)] text-[0.95rem]">
            {t.lead}
          </p>
        </SectionHeader>
        <div className="flex flex-wrap gap-10">
          <div className="min-w-[min(100%,20rem)] flex-[1_1_22rem]">
            <h3 className="font-display m-0 mb-4 text-[1rem] font-semibold">
              {t.scaleTitle}
            </h3>
            <div className="flex flex-col gap-[0.55rem]">
              {SPACING_SCALE.map((s) => (
                <div key={s.name} className="flex items-center gap-4">
                  <span className="text-muted-foreground w-14 flex-shrink-0 font-mono text-[0.78rem]">
                    {s.name}
                  </span>
                  <span className="text-foreground w-12 flex-shrink-0 text-[0.78rem]">
                    {s.px}px
                  </span>
                  <span
                    className="bg-primary h-[0.85rem] rounded-[2px]"
                    style={{ width: s.bar }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="min-w-[min(100%,20rem)] flex-[1_1_22rem]">
            <h3 className="font-display m-0 mb-4 text-[1rem] font-semibold">
              {t.rhythmTitle}
            </h3>
            <div className={PANEL}>
              <div className="border-border border-b border-dashed px-[var(--page-x)] py-6">
                <div className="bg-muted h-[1.4rem] w-[60%] rounded-sm" />
              </div>
              <div
                className="flex h-[clamp(3rem,6vw,5rem)] items-center justify-center"
                style={{
                  background:
                    "color-mix(in oklch, var(--primary), transparent 92%)",
                }}
              >
                <span className="text-muted-foreground font-mono text-[0.75rem]">
                  --section-y · clamp({SECTION_Y_RANGE_PX})
                </span>
              </div>
              <div className="border-border border-t border-dashed px-[var(--page-x)] py-6">
                <div className="bg-muted h-[1.4rem] w-[45%] rounded-sm" />
              </div>
            </div>
            <ul className="text-muted-foreground m-0 mt-5 flex list-disc flex-col gap-[0.45rem] pl-[1.1rem] text-[0.88rem]">
              {t.rhythm.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
