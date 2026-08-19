import { type Dictionary } from "@/app/[lang]/dictionaries";
import { SectionHeader } from "@/components/ui/heading";
import { WRAP } from "@/components/ui/layout";
import { Stat, StatRow } from "@/components/ui/stat-row";
import {
  BREAKPOINT_COUNT,
  BREAKPOINTS,
  CONTAINER_PX,
  MEASURE_REM,
} from "@/lib/design-values";
import { Breadcrumb, type BreadcrumbDict } from "../breadcrumb";

/* ===================== HERO ===================== */
// Composición decorativa del hero: tres marcos de página escalonados con la
// rejilla de 12 columnas visible en el frente. Solo desktop; en móvil, un marco.
function HeroComposition() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-[1_1_26rem] items-center justify-center"
    >
      {/* desktop */}
      <div className="relative hidden h-80 w-[min(25rem,100%)] md:block">
        <div
          data-reveal
          className="border-border bg-background absolute top-0 right-4 flex h-[12.5rem] w-[6.5rem] flex-col gap-[0.4rem] rounded-[12px] border p-[0.7rem]"
          style={{ transform: "rotate(6deg)", transitionDelay: "0.08s" }}
        >
          {["60%", "100%", "92%", "97%", "88%"].map((w, i) => (
            <div
              key={i}
              className="bg-muted h-[0.3rem] rounded-full first:h-[0.4rem]"
              style={{ width: w }}
            />
          ))}
        </div>
        <div
          data-reveal
          className="border-border bg-background absolute top-12 right-10 h-56 w-44 rounded-[14px] border p-[0.85rem]"
          style={{ transform: "rotate(-4deg)", transitionDelay: "0.16s" }}
        >
          <div className="bg-muted mb-[0.55rem] h-[0.5rem] w-[45%] rounded-full" />
          <div className="grid grid-cols-2 gap-[0.55rem]">
            {[0, 1].map((col) => (
              <div key={col} className="flex flex-col gap-[0.35rem]">
                <div className="bg-muted h-[0.3rem] rounded-full" />
                <div className="bg-muted h-[0.3rem] w-[85%] rounded-full" />
                <div className="bg-muted h-[0.3rem] rounded-full" />
              </div>
            ))}
          </div>
        </div>
        <div
          data-reveal
          className="border-foreground bg-background absolute bottom-2 left-0 h-[11.5rem] w-[15.5rem] overflow-hidden rounded-[14px] border"
          style={{ transform: "rotate(2deg)", transitionDelay: "0.24s" }}
        >
          <div className="absolute inset-[0.6rem] grid grid-cols-12 gap-[2px]">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-brand-cyan-soft rounded-[1px]" />
            ))}
          </div>
          <div className="relative flex flex-col gap-[0.6rem] p-[0.8rem]">
            <div className="bg-foreground h-[0.55rem] w-[45%] rounded-full" />
            <div className="grid grid-cols-2 gap-[0.7rem]">
              {[0, 1].map((col) => (
                <div key={col} className="flex flex-col gap-[0.4rem]">
                  <div className="bg-foreground h-[0.32rem] rounded-full opacity-55" />
                  <div className="bg-foreground h-[0.32rem] w-[85%] rounded-full opacity-55" />
                  <div className="bg-foreground h-[0.32rem] rounded-full opacity-55" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* mobile */}
      <div className="relative mx-auto h-[11.5rem] w-[min(16rem,100%)] md:hidden">
        <div className="border-foreground bg-background absolute inset-0 overflow-hidden rounded-[14px] border">
          <div className="absolute inset-[0.6rem] grid grid-cols-12 gap-[2px]">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-brand-cyan-soft rounded-[1px]" />
            ))}
          </div>
          <div className="relative flex flex-col gap-[0.6rem] p-[0.8rem]">
            <div className="bg-foreground h-[0.55rem] w-[45%] rounded-full" />
            <div className="grid grid-cols-2 gap-[0.7rem]">
              {[0, 1].map((col) => (
                <div key={col} className="flex flex-col gap-[0.4rem]">
                  <div className="bg-foreground h-[0.32rem] rounded-full opacity-55" />
                  <div className="bg-foreground h-[0.32rem] w-[80%] rounded-full opacity-55" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero({
  t,
  crumb,
  breadcrumb,
  homeHref,
}: {
  t: Dictionary["designSystem"]["hero"];
  crumb: string;
  breadcrumb: BreadcrumbDict;
  homeHref: string;
}) {
  return (
    <section className="py-[clamp(1.5rem,3vw,1.75rem)] pb-[var(--section-y)]">
      <div className={WRAP}>
        <div data-reveal className="mb-[clamp(3rem,6vw,4.5rem)]">
          <Breadcrumb
            routeLabel={breadcrumb.routeLabel}
            items={[
              { label: breadcrumb.home, href: homeHref },
              { label: crumb },
            ]}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-[clamp(2rem,5vw,4rem)]">
          <div className="min-w-[min(100%,18rem)] flex-[1.2_1_24rem]">
            <SectionHeader
              eyebrow={t.kicker}
              title={t.title}
              level={1}
              size="page"
              reveal
            >
              <p
                data-reveal
                className="text-muted-foreground max-w-[44ch] text-[clamp(1.05rem,1.6vw,1.2rem)] leading-[1.6]"
              >
                {t.lead}
              </p>
            </SectionHeader>
          </div>
          <HeroComposition />
        </div>
        {/* stats */}
        <StatRow>
          <Stat
            value={String(CONTAINER_PX)}
            unit="px"
            label={t.statContainer}
          />
          <Stat
            value={String(BREAKPOINT_COUNT)}
            unit={` ${t.statBreakpoints}`}
            label={BREAKPOINTS.filter((b) => b.min !== null)
              .map((b) => b.min)
              .join(" · ")}
          />
          <Stat value={String(MEASURE_REM)} unit="rem" label={t.statMeasure} />
          <Stat value="AA→AAA" label={t.statA11y} />
        </StatRow>
      </div>
    </section>
  );
}
