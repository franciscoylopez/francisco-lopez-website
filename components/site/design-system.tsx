import type { Dictionary } from "@/app/[lang]/dictionaries";
import { actionVariants } from "@/components/ui/action";
import { cn } from "@/lib/utils";

import { Breadcrumb, type BreadcrumbDict } from "./breadcrumb";
import { DevicePreview, GridDemo, RevealDemo } from "./design-system-islands";
import { CARD, PANEL, SECTION, WRAP } from "./layout";
import { RelatedPages, type RelatedDict } from "./related-pages";

type DesignSystemDict = Dictionary["designSystem"];

// Página Design System (PRD §20). Traducida de design/web-personal.dc.html (D1).
// Server Component salvo tres islas interactivas (design-system-islands.tsx):
// toggle de rejilla, demo de reveal y tabs de dispositivo. La sección de
// Accesibilidad es la checklist de cierre de todo el sitio (§20).

const SAMPLE: Record<string, string> = {
  display:
    "font-display font-semibold text-[clamp(2.75rem,7vw,5rem)] leading-[1.0] tracking-[-0.025em]",
  h1: "font-display font-semibold text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] tracking-[-0.02em]",
  h2: "font-display font-semibold text-[clamp(1.5rem,3vw,2rem)] leading-[1.15] tracking-[-0.015em]",
  h3: "font-display font-semibold text-[clamp(1.125rem,1.6vw,1.25rem)] leading-[1.3]",
  h4: "font-display font-semibold text-[1rem] leading-[1.4]",
  bodyL:
    "font-sans font-normal text-[clamp(1.0625rem,1.5vw,1.125rem)] leading-[1.6]",
  body: "font-sans font-normal text-[1rem] leading-[1.65]",
  small:
    "font-sans font-normal text-[0.875rem] leading-[1.5] text-muted-foreground",
  eyebrow:
    "font-sans font-semibold text-[0.8125rem] leading-[1.4] tracking-[0.09em] uppercase text-muted-foreground",
};

function SectionHead({ num, title }: { num: string; title: string }) {
  return (
    <div className="mb-4 flex items-baseline gap-4">
      <span className="text-muted-foreground font-mono text-[0.8rem]">
        {num}
      </span>
      <h2 className="font-display m-0 text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.02em]">
        {title}
      </h2>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

// Glifos de la demo de chrome solo-icono (§08). Locales a la página: son la
// ilustración del patrón, no los controles reales del nav (esos viven en Nav).
function MoonGlyph() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function MenuGlyph() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function DesignSystem({
  dict,
  related,
  breadcrumb,
  homeHref,
  lang,
}: {
  dict: DesignSystemDict;
  related: RelatedDict;
  breadcrumb: BreadcrumbDict;
  homeHref: string;
  lang: string;
}) {
  const t = dict;

  return (
    <main id="top">
      {/* ===================== HERO ===================== */}
      <section className="py-[clamp(1.5rem,3vw,1.75rem)] pb-[var(--section-y)]">
        <div className={WRAP}>
          <div data-reveal className="mb-[clamp(3rem,6vw,4.5rem)]">
            <Breadcrumb
              routeLabel={breadcrumb.routeLabel}
              items={[
                { label: breadcrumb.home, href: homeHref },
                { label: t.crumb },
              ]}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-[clamp(2rem,5vw,4rem)]">
            <div className="min-w-[min(100%,18rem)] flex-[1.2_1_24rem]">
              <p
                data-reveal
                className="text-muted-foreground m-0 mb-5 text-[0.8125rem] font-semibold tracking-[0.09em] uppercase"
              >
                {t.hero.kicker}
              </p>
              <h1
                data-reveal
                className="font-display m-0 text-[clamp(2.75rem,7vw,5rem)] leading-[1.0] font-semibold tracking-[-0.025em]"
              >
                {t.hero.title}
              </h1>
              <p
                data-reveal
                className="text-muted-foreground mt-6 max-w-[44ch] text-[clamp(1.05rem,1.6vw,1.2rem)] leading-[1.6]"
              >
                {t.hero.lead}
              </p>
            </div>
            <HeroComposition />
          </div>
          {/* stats */}
          <div
            data-reveal
            className="border-border mt-[clamp(3rem,6vw,4.5rem)] grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,13rem),1fr))] gap-[var(--gutter)] border-t pt-8"
          >
            <Stat value="1360" unit="px" label={t.hero.statContainer} />
            <Stat
              value="4"
              unit={` ${t.hero.statBreakpoints}`}
              label={t.hero.statBreakpointsList}
            />
            <Stat value="42" unit="rem" label={t.hero.statMeasure} />
            <Stat value="AA→AAA" label={t.hero.statA11y} />
          </div>
        </div>
      </section>

      {/* ===================== (01) REJILLA ===================== */}
      <section data-reveal className={SECTION}>
        <div className={WRAP}>
          <GridDemo
            num={t.rejilla.num}
            title={t.rejilla.title}
            showLabel={t.rejilla.showGrid}
            hideLabel={t.rejilla.hideGrid}
            lead={t.rejilla.lead}
            baseLabel={t.rejilla.baseLabel}
            baseVal={t.rejilla.baseVal}
            gutterLabel={t.rejilla.gutterLabel}
            gutterVal={t.rejilla.gutterVal}
            hint={t.rejilla.hint}
          />
          <div className="mt-8 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,15rem),1fr))] gap-[var(--gutter)]">
            {t.rejilla.cards.map((c) => (
              <InfoCard key={c.title} title={c.title} body={c.body} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== (02) TOKENS ===================== */}
      <section data-reveal className={SECTION}>
        <div className={WRAP}>
          <SectionHead num={t.tokens.num} title={t.tokens.title} />
          <p className="text-muted-foreground m-0 mb-10 max-w-[var(--measure)] text-[0.95rem]">
            {t.tokens.lead}
          </p>
          <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,22rem),1fr))] items-start gap-[var(--gutter)]">
            <div
              className="border-border overflow-hidden rounded-[var(--radius-xl)] border"
              style={{ background: "var(--foreground)" }}
            >
              <div
                className="flex items-center justify-between gap-4 px-5 py-[0.9rem]"
                style={{
                  borderBottom:
                    "1px solid color-mix(in oklch,var(--background),transparent 82%)",
                }}
              >
                <span
                  className="font-mono text-[0.75rem]"
                  style={{
                    color:
                      "color-mix(in oklch,var(--background),transparent 25%)",
                  }}
                >
                  {t.tokens.copyLabel}
                </span>
                <span
                  className="text-[0.68rem] tracking-[0.06em] uppercase"
                  style={{
                    color:
                      "color-mix(in oklch,var(--background),transparent 40%)",
                  }}
                >
                  {t.tokens.copyHint}
                </span>
              </div>
              <div className="flex flex-col gap-[0.55rem] p-5 font-mono text-[clamp(0.8rem,1.4vw,0.92rem)] leading-[1.5]">
                {t.tokens.items.map((tok) => (
                  <div
                    key={tok.name}
                    className="flex flex-wrap gap-x-3 gap-y-1"
                  >
                    <span style={{ color: "var(--brand-cyan-split)" }}>
                      {tok.name}:
                    </span>
                    <span
                      style={{
                        color:
                          "color-mix(in oklch,var(--background),transparent 18%)",
                      }}
                    >
                      {tok.val};
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-[var(--gutter)]">
              {t.tokens.cards.map((c) => (
                <InfoCard key={c.title} title={c.title} body={c.body} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== (03) BREAKPOINTS ===================== */}
      <section data-reveal className={SECTION}>
        <div className={WRAP}>
          <SectionHead num={t.breakpoints.num} title={t.breakpoints.title} />
          {/* tabla ≥md */}
          <div className={cn(PANEL, "hidden md:block")}>
            <div className="border-border text-muted-foreground grid grid-cols-[minmax(6rem,0.7fr)_minmax(6rem,0.8fr)_minmax(10rem,1.6fr)] gap-[var(--gutter)] border-b px-[var(--page-x)] py-[0.85rem] text-[0.72rem] tracking-[0.05em] uppercase">
              <span>{t.breakpoints.cols.token}</span>
              <span>{t.breakpoints.cols.ctx}</span>
              <span>{t.breakpoints.cols.change}</span>
            </div>
            {t.breakpoints.rows.map((bp) => (
              <div
                key={bp.token}
                className="border-border grid grid-cols-[minmax(6rem,0.7fr)_minmax(6rem,0.8fr)_minmax(10rem,1.6fr)] items-start gap-[var(--gutter)] border-b px-[var(--page-x)] py-[1.1rem] last:border-b-0"
              >
                <span>
                  <code className="text-foreground font-mono text-[0.9rem] font-semibold">
                    {bp.token}
                  </code>
                  <span className="text-muted-foreground mt-[0.15rem] block text-[0.78rem]">
                    {bp.min}
                  </span>
                </span>
                <span className="text-[0.88rem] font-medium">{bp.ctx}</span>
                <span className="text-muted-foreground text-[0.88rem]">
                  {bp.change}
                </span>
              </div>
            ))}
          </div>
          {/* tarjetas <md */}
          <div className="flex flex-col gap-[0.85rem] md:hidden">
            {t.breakpoints.rows.map((bp) => (
              <div key={bp.token} className={cn(CARD, "px-5 py-[1.1rem]")}>
                <div className="flex items-baseline justify-between gap-4">
                  <code className="text-foreground font-mono text-[0.95rem] font-semibold">
                    {bp.token}
                  </code>
                  <span className="text-muted-foreground text-[0.8rem]">
                    {bp.min}
                  </span>
                </div>
                <div className="mt-[0.35rem] text-[0.9rem] font-medium">
                  {bp.ctx}
                </div>
                <p className="text-muted-foreground m-0 mt-[0.4rem] text-[0.86rem]">
                  {bp.change}
                </p>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground m-0 mt-5 max-w-[var(--measure)] text-[0.85rem]">
            {t.breakpoints.note}
          </p>
        </div>
      </section>

      {/* ===================== (04) RITMO ===================== */}
      <section data-reveal className={SECTION}>
        <div className={WRAP}>
          <SectionHead num={t.ritmo.num} title={t.ritmo.title} />
          <p className="text-muted-foreground m-0 mb-10 max-w-[var(--measure)] text-[0.95rem]">
            {t.ritmo.lead}
          </p>
          <div className="flex flex-wrap gap-10">
            <div className="min-w-[min(100%,20rem)] flex-[1_1_22rem]">
              <h3 className="font-display m-0 mb-4 text-[1rem] font-semibold">
                {t.ritmo.scaleTitle}
              </h3>
              <div className="flex flex-col gap-[0.55rem]">
                {t.ritmo.spacing.map((s) => (
                  <div key={s.name} className="flex items-center gap-4">
                    <span className="text-muted-foreground w-14 flex-shrink-0 font-mono text-[0.78rem]">
                      {s.name}
                    </span>
                    <span className="text-foreground w-12 flex-shrink-0 text-[0.78rem]">
                      {s.px}
                    </span>
                    <span
                      className="bg-primary h-[0.85rem] rounded-[2px]"
                      style={{ width: s.w }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="min-w-[min(100%,20rem)] flex-[1_1_22rem]">
              <h3 className="font-display m-0 mb-4 text-[1rem] font-semibold">
                {t.ritmo.rhythmTitle}
              </h3>
              <div className={PANEL}>
                <div className="border-border border-b border-dashed px-[var(--page-x)] py-6">
                  <div className="bg-muted h-[1.4rem] w-[60%] rounded-[var(--radius-sm)]" />
                </div>
                <div
                  className="flex h-[clamp(3rem,6vw,5rem)] items-center justify-center"
                  style={{
                    background:
                      "color-mix(in oklch, var(--primary), transparent 92%)",
                  }}
                >
                  <span className="text-muted-foreground font-mono text-[0.75rem]">
                    {t.ritmo.sectionYLabel}
                  </span>
                </div>
                <div className="border-border border-t border-dashed px-[var(--page-x)] py-6">
                  <div className="bg-muted h-[1.4rem] w-[45%] rounded-[var(--radius-sm)]" />
                </div>
              </div>
              <ul className="text-muted-foreground m-0 mt-5 flex list-disc flex-col gap-[0.45rem] pl-[1.1rem] text-[0.88rem]">
                {t.ritmo.rhythm.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== (05) TIPOGRAFÍA ===================== */}
      <section data-reveal className={SECTION}>
        <div className={WRAP}>
          <SectionHead num={t.tipografia.num} title={t.tipografia.title} />
          <p className="text-muted-foreground m-0 mb-10 max-w-[var(--measure)] text-[0.95rem]">
            {t.tipografia.lead}
          </p>
          <div className="border-border overflow-hidden rounded-[var(--radius-xl)] border">
            {t.tipografia.rows.map((row, i) => (
              <div
                key={row.name}
                className="border-border flex flex-wrap items-baseline gap-x-8 gap-y-4 border-b px-[var(--page-x)] py-6 last:border-b-0"
                style={
                  i % 2 === 1
                    ? {
                        background:
                          "color-mix(in srgb, var(--card), transparent 55%)",
                      }
                    : undefined
                }
              >
                <div className="min-w-[min(100%,14rem)] flex-[1_1_16rem] overflow-hidden">
                  <span
                    className={cn("text-foreground block", SAMPLE[row.kind])}
                  >
                    {row.sample}
                  </span>
                </div>
                <div className="grid flex-[2_1_26rem] [grid-template-columns:repeat(auto-fit,minmax(6.5rem,1fr))] content-start gap-x-5 gap-y-[0.9rem]">
                  <TypeMeta label={t.tipografia.cols.level} value={row.name} />
                  <TypeMeta label={t.tipografia.cols.font} value={row.font} />
                  <TypeMeta
                    label={t.tipografia.cols.desktop}
                    value={row.desktop}
                    mono
                  />
                  <TypeMeta
                    label={t.tipografia.cols.mobile}
                    value={row.mobile}
                    mono
                  />
                  <TypeMeta label={t.tipografia.cols.lh} value={row.lh} mono />
                  <TypeMeta
                    label={t.tipografia.cols.use}
                    value={row.use}
                    muted
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== (06) CLARO / OSCURO ===================== */}
      <section data-reveal className={SECTION}>
        <div className={WRAP}>
          <SectionHead num={t.claroscuro.num} title={t.claroscuro.title} />
          <p className="text-muted-foreground m-0 mb-10 max-w-[var(--measure)] text-[0.95rem]">
            {t.claroscuro.lead}
          </p>
          <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr))] gap-[var(--gutter)]">
            <ThemeCard
              variant="light"
              modeLabel={t.claroscuro.lightLabel}
              headline={t.claroscuro.sampleHeadline}
              cta={t.claroscuro.cta}
              tokens={t.claroscuro.lightTokens}
            />
            <ThemeCard
              variant="dark"
              modeLabel={t.claroscuro.darkLabel}
              headline={t.claroscuro.sampleHeadline}
              cta={t.claroscuro.cta}
              tokens={t.claroscuro.darkTokens}
            />
          </div>
          <div
            className={cn(CARD, "mt-6 max-w-[var(--measure)] px-[1.4rem] py-5")}
          >
            <h3 className="font-display m-0 mb-[0.6rem] text-[1rem] font-semibold">
              {t.claroscuro.ruleTitle}
            </h3>
            <ul className="text-muted-foreground m-0 flex list-disc flex-col gap-2 pl-[1.1rem] text-[0.9rem] leading-[1.6]">
              {t.claroscuro.rule.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <p className="text-muted-foreground m-0 mt-[0.9rem] text-[0.85rem]">
              {t.claroscuro.ruleFoot}
            </p>
          </div>
        </div>
      </section>

      {/* ===================== (07) MOVIMIENTO ===================== */}
      <section data-reveal className={SECTION}>
        <div className={WRAP}>
          <SectionHead num={t.movimiento.num} title={t.movimiento.title} />
          <div className="flex flex-wrap gap-10">
            <div className="min-w-[min(100%,18rem)] flex-[1_1_20rem]">
              <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-[0.6rem] text-[0.9rem]">
                {t.movimiento.timings.map((tm) => (
                  <div key={tm.k} className="contents">
                    <span className="text-foreground font-mono">{tm.k}</span>
                    <span className="text-muted-foreground">{tm.v}</span>
                  </div>
                ))}
              </div>
              <ul className="text-muted-foreground m-0 mt-6 flex list-disc flex-col gap-2 pl-[1.1rem] text-[0.88rem]">
                {t.movimiento.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
            <div className="min-w-[min(100%,16rem)] flex-[1_1_18rem]">
              <RevealDemo
                demoLabel={t.movimiento.demoLabel}
                replayLabel={t.movimiento.replay}
              />
            </div>
          </div>

          {/* transición del nav */}
          <div className="border-border mt-11 border-t border-dashed pt-9">
            <h3 className="font-display m-0 mb-5 text-[1rem] font-semibold">
              {t.movimiento.navTitle}
            </h3>
            <div className="flex flex-wrap gap-10">
              <ul className="text-muted-foreground m-0 flex min-w-[min(100%,18rem)] flex-[1_1_20rem] list-disc flex-col gap-[0.55rem] pl-[1.1rem] text-[0.9rem] leading-[1.6]">
                {t.movimiento.navBullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <div className="flex min-w-[min(100%,15rem)] flex-[1_1_16rem] flex-col gap-[0.85rem]">
                <div className="border-border bg-background flex h-20 items-center justify-between gap-4 rounded-[var(--radius-lg)] border px-5">
                  <span className="inline-flex items-center gap-[0.6rem]">
                    <NavGlyph variant="split" h={48} />
                    <span className="font-display text-foreground text-[1.05rem] font-semibold tracking-[-0.01em]">
                      Francisco López
                    </span>
                  </span>
                  <span className="text-muted-foreground font-mono text-[0.68rem]">
                    {t.movimiento.navState1}
                  </span>
                </div>
                <div className="border-border bg-background flex h-16 items-center justify-between gap-4 rounded-[var(--radius-lg)] border px-5">
                  <NavGlyph variant="flat" h={28} />
                  <span className="text-muted-foreground font-mono text-[0.68rem]">
                    {t.movimiento.navState2}
                  </span>
                </div>
                <p className="text-muted-foreground m-0 mt-[0.1rem] text-[0.8rem]">
                  {t.movimiento.navFoot}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== (08) ENLACES ===================== */}
      <section data-reveal className={SECTION}>
        <div className={WRAP}>
          <SectionHead num={t.enlaces.num} title={t.enlaces.title} />
          <p className="text-muted-foreground m-0 mb-10 max-w-[var(--measure)] text-[0.95rem]">
            {t.enlaces.lead}
          </p>
          <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,19rem),1fr))] items-start gap-[var(--gutter)]">
            {t.enlaces.cases.map((c, i) => (
              <div
                key={c.cls}
                className="border-border overflow-hidden rounded-[var(--radius-xl)] border"
              >
                {/* Demo vivo: el hover real de cada clase, no una captura. */}
                <div className="bg-background flex min-h-[7.5rem] items-center justify-center px-5 py-7">
                  {i === 0 && (
                    <p className="m-0 text-center text-[0.95rem] leading-[1.7]">
                      {t.enlaces.demoContentBefore}{" "}
                      <a
                        href="#top"
                        className="link-content link-content--underline"
                      >
                        {t.enlaces.demoContentLink}
                      </a>{" "}
                      {t.enlaces.demoContentAfter}
                    </p>
                  )}
                  {i === 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-1">
                      {t.enlaces.demoChromeItems.map((item) => (
                        <a
                          key={item}
                          href="#top"
                          className="text-foreground link-chrome inline-flex min-h-[44px] items-center px-[0.85rem] text-[0.88rem] font-medium"
                        >
                          {item}
                        </a>
                      ))}
                    </div>
                  )}
                  {i === 2 && (
                    <div className="flex items-center gap-1.5">
                      <a
                        href="#top"
                        aria-label={c.kicker}
                        className={cn(
                          actionVariants({ variant: "icon", size: "icon" }),
                          "[--icon-chrome-bg:var(--card)]",
                        )}
                      >
                        <MoonGlyph />
                      </a>
                      <a
                        href="#top"
                        aria-label={c.cls}
                        className={cn(
                          actionVariants({ variant: "icon", size: "icon" }),
                          "[--icon-chrome-bg:var(--card)]",
                        )}
                      >
                        <MenuGlyph />
                      </a>
                    </div>
                  )}
                </div>
                <div className="border-border bg-card border-t px-5 pt-[1.1rem] pb-[1.35rem]">
                  <div className="mb-[0.7rem] flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <span className="text-foreground text-[0.72rem] font-semibold tracking-[0.05em] uppercase">
                      {c.kicker}
                    </span>
                    <code className="text-muted-foreground font-mono text-[0.74rem]">
                      {c.cls}
                    </code>
                  </div>
                  <p className="text-foreground m-0 text-[0.88rem] leading-[1.6]">
                    {c.rule}
                  </p>
                  <p className="text-muted-foreground border-border m-0 mt-[0.8rem] border-t border-dashed pt-[0.8rem] text-[0.82rem] leading-[1.55]">
                    {c.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground m-0 mt-4 text-[0.8rem]">
            {t.enlaces.hint}
          </p>
          <div
            className={cn(CARD, "mt-8 max-w-[var(--measure)] px-[1.4rem] py-5")}
          >
            <h3 className="font-display m-0 mb-[0.6rem] text-[1rem] font-semibold">
              {t.enlaces.ruleTitle}
            </h3>
            <ul className="text-muted-foreground m-0 flex list-disc flex-col gap-2 pl-[1.1rem] text-[0.9rem] leading-[1.6]">
              {t.enlaces.rule.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <p className="text-muted-foreground m-0 mt-[0.9rem] text-[0.85rem] leading-[1.6]">
              {t.enlaces.ruleFoot}
            </p>
          </div>
        </div>
      </section>

      {/* ===================== (09) BOTONES Y ACCIONES =====================
          Hermana de (08): la otra mitad de la capa interactiva. Existe porque los
          enlaces eran coherentes y los botones no, y la diferencia era justo esta
          página — los enlaces habían hecho el recorrido regla → clase → sección
          publicada → uso, y los botones se habían quedado en el primer paso
          (P37.597). Los demos son los MISMOS `actionVariants` que usa el sitio: si
          una variante cambia, esta página cambia con ella y no puede mentir. */}
      <section data-reveal className={SECTION}>
        <div className={WRAP}>
          <SectionHead num={t.botones.num} title={t.botones.title} />
          <p className="text-muted-foreground m-0 mb-10 max-w-[var(--measure)] text-[0.95rem]">
            {t.botones.lead}
          </p>
          <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,19rem),1fr))] items-start gap-[var(--gutter)]">
            {t.botones.cases.map((c, i) => (
              <div
                key={c.cls}
                className="border-border overflow-hidden rounded-[var(--radius-xl)] border"
              >
                <div className="bg-background flex min-h-[7.5rem] flex-wrap items-center justify-center gap-2 px-5 py-7">
                  {i === 0 && (
                    <a
                      href="#top"
                      className={actionVariants({ variant: "solid" })}
                    >
                      {t.botones.demoSolid}
                    </a>
                  )}
                  {i === 1 && (
                    <a
                      href="#top"
                      className={actionVariants({ variant: "outline-primary" })}
                    >
                      {t.botones.demoOutlinePrimary}
                    </a>
                  )}
                  {i === 2 && (
                    <>
                      <a
                        href="#top"
                        className={actionVariants({
                          variant: "outline-neutral",
                        })}
                      >
                        {t.botones.demoNeutral}
                      </a>
                      <a
                        href="#top"
                        className={actionVariants({ variant: "ghost" })}
                      >
                        {t.botones.demoGhost}
                      </a>
                    </>
                  )}
                  {/* Los dos casos con estado se muestran con <span>, no con
                      botones: su demostración es ver los dos estados A LA VEZ, y
                      un botón que no hace nada sería un control inerte y
                      focalizable puesto ahí solo para ilustrar. El hover sigue
                      funcionando —es CSS— así que no se pierde nada. */}
                  {i === 3 && (
                    <>
                      <span
                        className={actionVariants({
                          variant: "toggle-primary",
                          on: true,
                          size: "sm",
                        })}
                      >
                        {t.botones.stateOn}
                      </span>
                      <span
                        className={actionVariants({
                          variant: "toggle-primary",
                          on: false,
                          size: "sm",
                        })}
                      >
                        {t.botones.stateOff}
                      </span>
                    </>
                  )}
                  {i === 4 &&
                    t.botones.demoSegments.map((seg, j) => (
                      <span
                        key={seg}
                        className={actionVariants({
                          variant: "toggle-neutral",
                          on: j === 0,
                          size: "sm",
                        })}
                      >
                        {seg}
                      </span>
                    ))}
                  {i === 5 && (
                    <>
                      <a
                        href="#top"
                        aria-label={c.kicker}
                        className={cn(
                          actionVariants({ variant: "icon", size: "icon" }),
                          "[--icon-chrome-bg:var(--card)]",
                        )}
                      >
                        <MoonGlyph />
                      </a>
                      <a
                        href="#top"
                        aria-label={c.cls}
                        className={cn(
                          actionVariants({ variant: "icon", size: "icon" }),
                          "[--icon-chrome-bg:var(--card)]",
                        )}
                      >
                        <MenuGlyph />
                      </a>
                    </>
                  )}
                </div>
                <div className="border-border bg-card border-t px-5 pt-[1.1rem] pb-[1.35rem]">
                  <div className="mb-[0.7rem] flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <span className="text-foreground text-[0.72rem] font-semibold tracking-[0.05em] uppercase">
                      {c.kicker}
                    </span>
                    <code className="text-muted-foreground font-mono text-[0.74rem]">
                      {c.cls}
                    </code>
                  </div>
                  <p className="text-foreground m-0 text-[0.88rem] leading-[1.6]">
                    {c.rule}
                  </p>
                  <p className="text-muted-foreground border-border m-0 mt-[0.8rem] border-t border-dashed pt-[0.8rem] text-[0.82rem] leading-[1.55]">
                    {c.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground m-0 mt-4 text-[0.8rem]">
            {t.botones.hint}
          </p>
          <div
            className={cn(CARD, "mt-8 max-w-[var(--measure)] px-[1.4rem] py-5")}
          >
            <h3 className="font-display m-0 mb-[0.6rem] text-[1rem] font-semibold">
              {t.botones.ruleTitle}
            </h3>
            <ul className="text-muted-foreground m-0 flex list-disc flex-col gap-2 pl-[1.1rem] text-[0.9rem] leading-[1.6]">
              {t.botones.rule.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <p className="text-muted-foreground m-0 mt-[0.9rem] text-[0.85rem] leading-[1.6]">
              {t.botones.ruleFoot}
            </p>
          </div>
        </div>
      </section>

      {/* ===================== (10) ACCESIBILIDAD ===================== */}
      <section data-reveal className={SECTION}>
        <div className={WRAP}>
          <SectionHead
            num={t.accesibilidad.num}
            title={t.accesibilidad.title}
          />
          <p className="text-muted-foreground m-0 mb-6 max-w-[var(--measure)] text-[0.95rem]">
            {t.accesibilidad.lead}
          </p>

          <h3 className="font-display m-0 mt-8 mb-4 text-[1rem] font-semibold">
            {t.accesibilidad.contrastTitle}
          </h3>
          <div className={PANEL}>
            <div className="border-border text-muted-foreground flex flex-wrap gap-x-4 gap-y-[0.4rem] border-b px-[var(--page-x)] py-[0.85rem] text-[0.72rem] tracking-[0.05em] uppercase">
              <span className="min-w-40 flex-[2_1_12rem]">
                {t.accesibilidad.contrastCols.measure}
              </span>
              <span className="min-w-24 flex-[1_1_7rem]">
                {t.accesibilidad.contrastCols.light}
              </span>
              <span className="min-w-24 flex-[1_1_7rem]">
                {t.accesibilidad.contrastCols.dark}
              </span>
            </div>
            {t.accesibilidad.contrastRows.map((r) => (
              <div
                key={r.label}
                className="border-border flex flex-wrap items-baseline gap-x-4 gap-y-[0.4rem] border-b px-[var(--page-x)] py-4 last:border-b-0"
              >
                <span className="min-w-40 flex-[2_1_12rem]">
                  <span className="text-foreground font-medium">{r.label}</span>
                  <span className="text-muted-foreground mt-[0.15rem] block text-[0.78rem]">
                    {r.note}
                  </span>
                </span>
                <span className="text-foreground min-w-24 flex-[1_1_7rem] font-mono text-[0.9rem]">
                  {r.light}
                  <ContrastBadge lv={r.lightLv} />
                </span>
                <span className="text-foreground min-w-24 flex-[1_1_7rem] font-mono text-[0.9rem]">
                  {r.dark}
                  <ContrastBadge lv={r.darkLv} />
                </span>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground m-0 mt-4 max-w-[var(--measure)] text-[0.85rem]">
            {t.accesibilidad.contrastNote}
          </p>

          <h3 className="font-display m-0 mt-10 mb-4 text-[1rem] font-semibold">
            {t.accesibilidad.checklistTitle}
          </h3>
          <ol className="m-0 grid list-none [grid-template-columns:repeat(auto-fill,minmax(min(100%,20rem),1fr))] gap-3 p-0">
            {t.accesibilidad.checklist.map((c, i) => (
              <li
                key={c}
                className={cn(
                  CARD,
                  "flex items-start gap-[0.9rem] px-[1.15rem] py-4",
                )}
              >
                <span
                  aria-hidden="true"
                  className="text-primary inline-flex h-[26px] w-[26px] flex-none items-center justify-center rounded-[7px]"
                  style={{
                    background:
                      "color-mix(in oklch, var(--primary), transparent 86%)",
                  }}
                >
                  <CheckIcon />
                </span>
                <div className="flex-1">
                  <span className="text-muted-foreground font-mono text-[0.72rem]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-foreground m-0 mt-[0.2rem] text-[0.9rem] leading-[1.55]">
                    {c}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===================== (11) ESQUELETO ===================== */}
      <section
        data-reveal
        className={SECTION}
        style={{
          background: "color-mix(in srgb, var(--card), transparent 45%)",
        }}
      >
        <div className={WRAP}>
          <div className="mb-10 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-4">
            <SectionHead num={t.esqueleto.num} title={t.esqueleto.title} />
          </div>
          <p className="text-muted-foreground m-0 mb-8 max-w-[var(--measure)] text-[0.95rem]">
            {t.esqueleto.lead}
          </p>
          <p className="text-muted-foreground border-primary m-0 mb-8 max-w-[var(--measure)] border-l-2 pl-[0.9rem] text-[0.88rem] md:hidden">
            {t.esqueleto.mobileNote}
          </p>
          <DevicePreview
            groupLabel={t.esqueleto.devGroupLabel}
            devFull={t.esqueleto.devFull}
            devTablet={t.esqueleto.devTablet}
            devMobile={t.esqueleto.devMobile}
            rows={t.esqueleto.rows}
          />
        </div>
      </section>

      <RelatedPages dict={related} current="designSystem" lang={lang} />
    </main>
  );
}

// --- Subcomponentes ---

function Stat({
  value,
  unit,
  label,
}: {
  value: string;
  unit?: string;
  label: string;
}) {
  return (
    <div>
      <div className="font-display text-[1.6rem] leading-none">
        {value}
        {unit && (
          <span className="text-muted-foreground text-[0.9rem]">{unit}</span>
        )}
      </div>
      <div className="text-muted-foreground mt-[0.35rem] text-[0.85rem]">
        {label}
      </div>
    </div>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <div className={cn(CARD, "p-5")}>
      <h3 className="font-display m-0 mb-2 text-[1rem] font-semibold">
        {title}
      </h3>
      <p className="text-muted-foreground m-0 text-[0.88rem]">{body}</p>
    </div>
  );
}

function TypeMeta({
  label,
  value,
  mono,
  muted,
}: {
  label: string;
  value: string;
  mono?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[0.15rem]">
      <span className="text-muted-foreground text-[0.68rem] tracking-[0.04em] uppercase">
        {label}
      </span>
      <span
        className={cn(
          "text-[0.82rem]",
          mono && "font-mono",
          muted && "text-muted-foreground",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function ContrastBadge({ lv }: { lv: string }) {
  if (!lv) return null;
  const aaa = lv === "AAA";
  return (
    <span
      className={cn(
        "ml-[0.35rem] inline-block rounded-full px-[0.4rem] py-[0.1rem] font-sans text-[0.66rem] font-semibold tracking-[0.04em]",
        aaa ? "text-primary" : "bg-muted text-muted-foreground",
      )}
      style={
        aaa
          ? {
              background:
                "color-mix(in oklch, var(--primary), transparent 84%)",
            }
          : undefined
      }
    >
      {lv}
    </span>
  );
}

// Tarjeta de tema fijo (§06): muestra claro y oscuro con valores oklch literales,
// independientes del tema activo, para enseñar ambas superficies a la vez.
function ThemeCard({
  variant,
  modeLabel,
  headline,
  cta,
  tokens,
}: {
  variant: "light" | "dark";
  modeLabel: string;
  headline: string;
  cta: string;
  tokens: string;
}) {
  const c =
    variant === "light"
      ? {
          border: "oklch(0.901 0.0142 88.69)",
          bg: "oklch(0.9653 0.0102 81.8)",
          fg: "oklch(0.2657 0.0118 248.27)",
          eyebrow: "oklch(0.4365 0.0064 95.19)",
          innerBorder: "oklch(0.901 0.0142 88.69)",
          innerBg: "oklch(0.9855 0.0057 84.57)",
          bar: "oklch(0.9316 0.0128 86.83)",
          btnBg: "oklch(0.43 0.0886 194.82)",
          btnFg: "oklch(0.9855 0.0057 84.57)",
        }
      : {
          border: "oklch(0.3252 0.0157 248.31)",
          bg: "oklch(0.2283 0.0098 248.26)",
          fg: "oklch(0.9653 0.0102 81.8)",
          eyebrow: "oklch(0.7295 0.0116 95.22)",
          innerBorder: "oklch(0.3252 0.0157 248.31)",
          innerBg: "oklch(0.2657 0.0118 248.27)",
          bar: "oklch(0.3063 0.0152 252.34)",
          btnBg: "oklch(0.7626 0.1156 191.46)",
          btnFg: "oklch(0.2283 0.0098 248.26)",
        };
  return (
    <div
      className="overflow-hidden rounded-[var(--radius-xl)] border"
      style={{ borderColor: c.border, background: c.bg, color: c.fg }}
    >
      <div className="flex flex-col gap-4 px-6 py-[1.4rem]">
        <span
          className="text-[0.72rem] tracking-[0.06em] uppercase"
          style={{ color: c.eyebrow }}
        >
          {modeLabel}
        </span>
        <span className="font-display text-[1.6rem] leading-[1.05] font-semibold">
          {headline}
        </span>
        <div
          className="rounded-[var(--radius-lg)] border p-4"
          style={{ borderColor: c.innerBorder, background: c.innerBg }}
        >
          <div
            className="mb-2 h-[0.7rem] w-[70%] rounded-full"
            style={{ background: c.bar }}
          />
          <div
            className="h-[0.7rem] rounded-full"
            style={{ background: c.bar }}
          />
        </div>
        <span
          className="inline-flex min-h-9 items-center self-start rounded-[var(--radius-md)] px-[0.9rem] text-[0.82rem] font-medium"
          style={{ background: c.btnBg, color: c.btnFg }}
        >
          {cta}
        </span>
      </div>
      <div
        className="border-t px-6 py-[0.65rem] font-mono text-[0.72rem]"
        style={{ borderColor: c.border, color: c.eyebrow }}
      >
        {tokens}
      </div>
    </div>
  );
}

// Glifo del nav (§07 transición) — split/flat dimensionado por altura.
function NavGlyph({ variant, h }: { variant: "split" | "flat"; h: number }) {
  const w = +((h * 58) / 70).toFixed(2);
  return variant === "split" ? (
    <svg
      viewBox="0 0 58 70"
      width={w}
      height={h}
      fill="none"
      className="block flex-none overflow-visible"
      aria-hidden="true"
    >
      <circle
        cx="26.45"
        cy="26.45"
        r="26"
        stroke="var(--brand-cyan-split)"
        strokeWidth="6"
      />
      <circle
        cx="31.55"
        cy="31.55"
        r="26"
        stroke="var(--brand-purple-split)"
        strokeWidth="6"
      />
      <circle
        cx="29"
        cy="29"
        r="26"
        stroke="var(--foreground)"
        strokeWidth="6"
      />
      <rect
        x="11.5"
        y="64"
        width="35"
        height="6"
        rx="3"
        fill="var(--foreground)"
      />
    </svg>
  ) : (
    <svg
      viewBox="0 0 58 70"
      width={w}
      height={h}
      fill="none"
      className="block flex-none overflow-visible"
      aria-hidden="true"
    >
      <circle
        cx="29"
        cy="29"
        r="26"
        stroke="var(--foreground)"
        strokeWidth="6"
      />
      <rect
        x="11.5"
        y="64"
        width="35"
        height="6"
        rx="3"
        fill="var(--foreground)"
      />
    </svg>
  );
}

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
