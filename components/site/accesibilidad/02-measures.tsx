import { type Dictionary } from "@/app/[lang]/dictionaries";
import { CheckPill } from "@/components/ui/check-pill";
import { SectionHeader } from "@/components/ui/heading";
import { CARD, SECTION, WRAP } from "@/components/ui/layout";
import { Rich } from "@/components/ui/rich";
import { cn } from "@/lib/utils";

import { INTRO, NOTA, type FillCounts, type SeccionMarco } from "./shared";

type T = Dictionary["accesibilidad"];

/* ===================== (02) QUÉ SE HA HECHO ===================== */
export function Measures({
  t,
  marco,
  fillCounts,
}: {
  t: T["measures"];
  marco: SeccionMarco;
  fillCounts: FillCounts;
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
          <p className={INTRO}>{t.intro}</p>
        </SectionHeader>
        <ol className="m-0 grid list-none [grid-template-columns:repeat(auto-fill,minmax(min(100%,21rem),1fr))] gap-3 p-0">
          {t.items.map((c) => (
            <li key={c.title} className={cn(CARD, "px-[1.15rem] py-4")}>
              <div className="flex items-start gap-[0.9rem]">
                <CheckPill />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <p className="text-foreground m-0 text-[0.95rem] font-semibold">
                      {c.title}
                    </p>
                    <span className="text-muted-foreground font-mono text-[0.7rem] whitespace-nowrap tabular-nums">
                      {c.wcag}
                    </span>
                  </div>
                  <p className="text-muted-foreground m-0 mt-1 text-[0.86rem] leading-[1.55]">
                    {c.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
        {/* El puente a (03): de los nueve puntos de arriba, cuáles no se
              vuelven a comprobar página a página. Mismo patrón de nota que el
              resto de secciones; las dos cifras se cuentan, no se escriben. */}
        <p className={NOTA}>
          <Rich text={fillCounts(t.note)} />
        </p>
        {marco.closer}
      </div>
    </section>
  );
}
