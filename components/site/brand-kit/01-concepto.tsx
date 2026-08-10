import { type Dictionary } from "@/app/[lang]/dictionaries";
import { PANEL, SECTION, WRAP } from "@/components/ui/layout";
import { cn } from "@/lib/utils";
import { Glyph, H2, LEAD, NUM } from "./shared";

/* ===================== 01 CONCEPTO ===================== */
export function Concepto({ t }: { t: Dictionary["brandKit"]["concepto"] }) {
  return (
    <section className={SECTION}>
      <div className={WRAP}>
        <div
          data-reveal
          className="mb-[clamp(2.5rem,5vw,4rem)] max-w-[var(--measure)]"
        >
          <p className={NUM}>{t.num}</p>
          <h2 className={H2}>{t.title}</h2>
          <p className={LEAD}>{t.lead}</p>
        </div>
        <div
          data-reveal
          className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,15rem),1fr))] gap-[var(--gutter)]"
        >
          {[
            { variant: "flat" as const, c: t.plano },
            { variant: "split" as const, c: t.split },
          ].map((it) => (
            <div
              key={it.c.title}
              className={cn(
                PANEL,
                "flex min-h-64 flex-col items-center justify-center gap-5 p-8",
              )}
            >
              <Glyph variant={it.variant} h={120} />
              <div className="text-center">
                <div className="font-display text-[1.15rem] font-semibold">
                  {it.c.title}
                </div>
                <p className="text-muted-foreground m-0 mt-[0.3rem] text-[0.9rem]">
                  {it.c.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
