import { Check, Download, Mail, Menu, Moon } from "lucide-react";

import type { Dictionary } from "@/app/[lang]/dictionaries";
import { actionVariants } from "@/components/ui/action";
import { Badge } from "@/components/ui/badge";
import { chromeLinkVariants } from "@/components/ui/chrome";
import {
  BREAKPOINT_COUNT,
  BREAKPOINTS,
  breakpointRange,
  CONTAINER_PX,
  fillRatios,
  GUTTER_RANGE_PX,
  isContrastId,
  LAYOUT_TOKENS,
  levelOf,
  MEASURE_REM,
  PALETTE,
  paletteHex,
  ratioText,
  SECTION_Y_RANGE_PX,
  SPACING_SCALE,
} from "@/lib/design-values";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

import { Breadcrumb, type BreadcrumbDict } from "./breadcrumb";
import { DevicePreview, GridDemo, RevealDemo } from "./design-system-islands";
import { InfoCard } from "@/components/ui/info-card";
import { CARD, PAIR, PANEL, SECTION, WRAP } from "@/components/ui/layout";
import { DataTable, SPECIMEN_ROW, TD, TR } from "@/components/ui/table";
import { RelatedPages, type RelatedDict } from "./related-pages";
import {
  EYEBROW_GAP,
  eyebrowVariants,
  SectionHeader,
  titleVariants,
} from "@/components/ui/heading";

type DesignSystemDict = Dictionary["designSystem"];

// Página Design System (PRD §20). Traducida de design/web-personal.dc.html (D1).
// Server Component salvo tres islas interactivas (design-system-islands.tsx):
// toggle de rejilla, demo de reveal y tabs de dispositivo. La sección de
// Accesibilidad es la checklist de cierre de todo el sitio (§20).

// Especímenes de la escala tipográfica (§05). Un espécimen es explícito a
// propósito —está para demostrar cada propiedad, así que la escribe— pero los
// tres niveles que YA son una variante del sistema se COMPONEN desde ella en vez
// de reescribir su valor: si la variante cambia, el espécimen cambia con ella y
// no puede mentir. Lo que el espécimen añade encima es lo que quiere enseñar y la
// variante no fija (la familia y el interlineado del eyebrow, que hereda).
//
// Los niveles h2–h4, body y small no tienen variante todavía: son la escala en
// crudo, y por eso siguen escritos. Cuando alguno se convierta en variante, su
// entrada aquí pasa a componerse igual (P37.66).
const SAMPLE: Record<string, string> = {
  display: titleVariants({ size: "page" }),
  h1: titleVariants({ size: "section-sm" }),
  h2: "font-display font-semibold text-[clamp(1.5rem,3vw,2rem)] leading-[1.15] tracking-[-0.015em]",
  h3: "font-display font-semibold text-[clamp(1.125rem,1.6vw,1.25rem)] leading-[1.3]",
  h4: "font-display font-semibold text-[1rem] leading-[1.4]",
  bodyL:
    "font-sans font-normal text-[clamp(1.0625rem,1.5vw,1.125rem)] leading-[1.6]",
  body: "font-sans font-normal text-[1rem] leading-[1.65]",
  small:
    "font-sans font-normal text-[0.875rem] leading-[1.5] text-muted-foreground",
  eyebrow: cn(eyebrowVariants(), "font-sans leading-[1.4]"),
};

/** Guarda para el tamaño de titular que llega desde el diccionario (§11). */
function isTitleSize(value: string): value is keyof typeof EYEBROW_GAP {
  return value in EYEBROW_GAP;
}

function SectionHead({ num, title }: { num: string; title: string }) {
  return (
    <div className="mb-4 flex items-baseline gap-4">
      <span className="text-muted-foreground font-mono text-[0.8rem]">
        {num}
      </span>
      <h2 className={titleVariants({ size: "section-sm" })}>{title}</h2>
    </div>
  );
}

// Marca de verificación de las listas de esta página. `size-[15px]` porque vive
// dentro de una pastilla teñida de 26px y no sale de la capa de acción — no es un
// control, es un adorno de contenido.
const CHECK = "size-[15px]";

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
  lang: Locale;
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
              <SectionHeader
                eyebrow={t.hero.kicker}
                title={t.hero.title}
                level={1}
                size="page"
                reveal
              />
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
            <Stat
              value={String(CONTAINER_PX)}
              unit="px"
              label={t.hero.statContainer}
            />
            <Stat
              value={String(BREAKPOINT_COUNT)}
              unit={` ${t.hero.statBreakpoints}`}
              label={BREAKPOINTS.filter((b) => b.min !== null)
                .map((b) => b.min)
                .join(" · ")}
            />
            <Stat
              value={String(MEASURE_REM)}
              unit="rem"
              label={t.hero.statMeasure}
            />
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
            gutterVal={`var(--gutter) · ${GUTTER_RANGE_PX}`}
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
              // Superficie invertida: su primer plano es `--background`, así que
              // el atenuado se construye desde el otro extremo. Antes se escribían
              // aquí tres transparencias a ojo y la del rótulo daba 4,33:1 en
              // oscuro —por debajo de AA— sin que nada lo cazara: axe no sabe
              // resolver `color-mix()` y archiva esos elementos en `incomplete`,
              // que es donde nadie mira (P37.6565).
              data-surface="inverted"
              className="border-border overflow-hidden rounded-xl border"
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
                <span className="text-muted-foreground text-[0.68rem] tracking-[0.06em] uppercase">
                  {t.tokens.copyHint}
                </span>
              </div>
              <div className="flex flex-col gap-[0.55rem] p-5 font-mono text-[clamp(0.8rem,1.4vw,0.92rem)] leading-[1.5]">
                {LAYOUT_TOKENS.map((tok) => (
                  <div
                    key={tok.name}
                    className="flex flex-wrap gap-x-3 gap-y-1"
                  >
                    {/* El panel invierte con el tema (su fondo es `--foreground`),
                        así que el acento no puede ser fijo: usa el cian del OTRO
                        tema. Antes era `--brand-cyan-split`, que en oscuro caía a
                        2,09:1 sobre el panel en hueso. */}
                    <span style={{ color: "var(--primary-on-inverted)" }}>
                      {tok.name}:
                    </span>
                    <span
                      style={{
                        color:
                          "color-mix(in oklch,var(--background),transparent 18%)",
                      }}
                    >
                      {tok.value};
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
          <DataTable
            caption={t.breakpoints.title}
            cols={[
              { label: t.breakpoints.cols.token, width: "23%" },
              { label: t.breakpoints.cols.ctx, width: "26%" },
              { label: t.breakpoints.cols.change },
            ]}
            className="hidden md:block"
          >
            {t.breakpoints.rows.map((bp) => (
              <TR key={bp.token}>
                <TD head>
                  <code className="text-foreground font-mono text-[0.9rem] font-semibold">
                    {bp.token}
                  </code>
                  <span className="text-muted-foreground mt-[0.15rem] block text-[0.78rem]">
                    {breakpointRange(bp.token)}
                  </span>
                </TD>
                <TD className="text-[0.88rem] font-medium">{bp.ctx}</TD>
                <TD className="text-muted-foreground text-[0.88rem]">
                  {bp.change}
                </TD>
              </TR>
            ))}
          </DataTable>
          {/* tarjetas <md */}
          <div className="flex flex-col gap-[0.85rem] md:hidden">
            {t.breakpoints.rows.map((bp) => (
              <div key={bp.token} className={cn(CARD, "px-5 py-[1.1rem]")}>
                <div className="flex items-baseline justify-between gap-4">
                  <code className="text-foreground font-mono text-[0.95rem] font-semibold">
                    {bp.token}
                  </code>
                  <span className="text-muted-foreground text-[0.8rem]">
                    {breakpointRange(bp.token)}
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
                {t.ritmo.rhythmTitle}
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
          <div className="border-border overflow-hidden rounded-xl border">
            {t.tipografia.rows.map((row) => (
              <div key={row.name} className={SPECIMEN_ROW}>
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
            />
            <ThemeCard
              variant="dark"
              modeLabel={t.claroscuro.darkLabel}
              headline={t.claroscuro.sampleHeadline}
              cta={t.claroscuro.cta}
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
                <div className="border-border bg-background flex h-20 items-center justify-between gap-4 rounded-lg border px-5">
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
                <div className="border-border bg-background flex h-16 items-center justify-between gap-4 rounded-lg border px-5">
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
                className="border-border overflow-hidden rounded-xl border"
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
                          className={cn(
                            chromeLinkVariants({ shape: "bar" }),
                            "text-[0.88rem]",
                          )}
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
                        className={actionVariants({
                          variant: "icon",
                          size: "icon",
                        })}
                      >
                        <Moon />
                      </a>
                      <a
                        href="#top"
                        aria-label={c.cls}
                        className={actionVariants({
                          variant: "icon",
                          size: "icon",
                        })}
                      >
                        <Menu />
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
                className="border-border overflow-hidden rounded-xl border"
              >
                <div className="bg-background flex min-h-[7.5rem] flex-wrap items-center justify-center gap-2 px-5 py-7">
                  {/* Con su icono, como los botones reales de los que toman la
                      etiqueta: el de contacto de la home y el de Trayectoria. Lo
                      llevan porque las dos acciones sacan al usuario de la página
                      —una abre el correo, la otra descarga un archivo— y los de
                      utilidad no lo llevan porque se resuelven aquí dentro; es
                      exactamente la regla que la tarjeta explica al lado.
                      El tamaño, la posición y el empujón ya no se escriben aquí:
                      hasta P37.5988 este sólido llevaba su sobre a mano, detrás de
                      la etiqueta y SIN el empujón de 2px que sí tenía el botón real
                      —la página que documenta la variante enseñaba un botón que no
                      existía—. Ahora es el mismo `actionVariants` y no puede
                      mentir, que es el motivo entero de esta sección. */}
                  {i === 0 && (
                    <a
                      href="#top"
                      className={actionVariants({ variant: "solid" })}
                    >
                      <Mail aria-hidden="true" />
                      {t.botones.demoSolid}
                    </a>
                  )}
                  {i === 1 && (
                    <a
                      href="#top"
                      className={actionVariants({ variant: "outline-primary" })}
                    >
                      <Download aria-hidden="true" />
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
                        className={actionVariants({
                          variant: "icon",
                          size: "icon",
                        })}
                      >
                        <Moon />
                      </a>
                      <a
                        href="#top"
                        aria-label={c.cls}
                        className={actionVariants({
                          variant: "icon",
                          size: "icon",
                        })}
                      >
                        <Menu />
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
          {/* La regla del icono se publica aquí, no solo en BRAND.md (P37.5988).
              Es el paso que faltaba: los enlaces son difíciles de incumplir porque
              hicieron el recorrido completo regla → clase → sección publicada →
              uso, y esta parte del botón se había quedado en el primer paso.

              Las dos notas van en PAIR, no apiladas a la medida de lectura: son
              dos reglas hermanas —cuándo lleva icono, y que ninguna se escribe a
              mano— y apiladas dejaban media sección vacía a la derecha (P37.62). */}
          <div className={cn(PAIR, "mt-8")}>
            <InfoCard
              title={t.botones.iconTitle}
              bullets={t.botones.iconRule}
              foot={t.botones.iconFoot}
            />
            <InfoCard
              title={t.botones.ruleTitle}
              bullets={t.botones.rule}
              foot={t.botones.ruleFoot}
            />
          </div>
        </div>
      </section>

      {/* ===================== (10) ETIQUETAS =====================
          La tercera capa del sistema, publicada aquí por el mismo motivo que (09):
          el recorrido completo es regla → componente → sección publicada → uso, y
          una regla que hay que recordar es una regla que se incumple (P37.655).
          Los demos son los MISMOS `Badge` que usa el sitio, así que la página no
          puede enseñar una pastilla que no exista. */}
      <section data-reveal className={SECTION}>
        <div className={WRAP}>
          <SectionHead num={t.etiquetas.num} title={t.etiquetas.title} />
          <p className="text-muted-foreground m-0 mb-10 max-w-[var(--measure)] text-[0.95rem]">
            {t.etiquetas.lead}
          </p>
          {/* Cuatro tarjetas, no seis como en (09): con el `minmax` de aquella
              sección caben tres por fila y la cuarta se quedaba sola dejando dos
              tercios de fila vacíos. A 15rem entran las cuatro en una sola fila y
              el bloque se lee como lo que es — un eje de tres tonos más el de los
              registros. Es el mismo problema que resolvió `PAIR` (P37.61/62): el
              número de columnas se elige por cuántas piezas hay, no por defecto. */}
          <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-[var(--gutter)]">
            {t.etiquetas.cases.map((c, i) => {
              // La cuarta tarjeta cierra con una cifra REAL del censo —la misma
              // que publica la tabla de (12)—, no con una escrita a mano: es un
              // espécimen del registro `code`, y un espécimen que miente sobre el
              // dato que ilustra es exactamente lo que arregla P37.66.
              const demo =
                i === 3
                  ? [...c.demo, ratioText("bodyText", "light", lang)]
                  : c.demo;
              return (
                <div
                  key={c.cls}
                  className="border-border overflow-hidden rounded-xl border"
                >
                  <div className="bg-background flex min-h-[7.5rem] flex-wrap items-center justify-center gap-2 px-5 py-7">
                    {/* Las tres primeras tarjetas enseñan un TONO con dos ejemplos
                      reales; la cuarta enseña los tres `kind` sobre un mismo tono,
                      que es el eje que de verdad significa algo. Por eso el mapeo
                      va por índice y no por una prop en el diccionario: el copy
                      describe la variante, no la elige. */}
                    {demo.map((d, j) => (
                      <Badge
                        key={d}
                        tone={
                          i === 0
                            ? "neutral"
                            : i === 1
                              ? "cyan"
                              : i === 2
                                ? "purple"
                                : "neutral"
                        }
                        kind={
                          i === 3
                            ? ((["label", "value", "code"] as const)[j] ??
                              "value")
                            : "value"
                        }
                      >
                        {d}
                      </Badge>
                    ))}
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
                      {fillRatios(c.note, lang)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-muted-foreground m-0 mt-4 text-[0.8rem]">
            {t.etiquetas.hint}
          </p>
          <div className="mt-8 max-w-[var(--measure)]">
            <InfoCard
              title={t.etiquetas.ruleTitle}
              bullets={t.etiquetas.rule}
              foot={fillRatios(t.etiquetas.ruleFoot, lang)}
            />
          </div>
        </div>
      </section>

      {/* ===================== (11) CABECERAS ===================== */}
      <section data-reveal className={SECTION}>
        <div className={WRAP}>
          <SectionHead num={t.cabeceras.num} title={t.cabeceras.title} />
          <p className="text-muted-foreground m-0 mb-10 max-w-[var(--measure)] text-[0.95rem]">
            {t.cabeceras.lead}
          </p>

          {/* Los cuatro tamaños, renderizados con las variantes REALES. Van sobre
              <span> y <p>, no sobre <h1>/<h2>: un espécimen no debe entrar en el
              esquema de encabezados de la página —un lector de pantalla los
              anunciaría como secciones que no existen—, que es el mismo motivo
              por el que §(05) enseña la escala tipográfica en <span>. */}
          <div className={PANEL}>
            {t.cabeceras.sizes.map((s) => {
              if (!isTitleSize(s.size)) return null;
              return (
                <div key={s.size} className={SPECIMEN_ROW}>
                  <div className="min-w-[min(100%,14rem)] flex-[1_1_18rem] overflow-hidden">
                    <p className={cn(eyebrowVariants(), EYEBROW_GAP[s.size])}>
                      {s.eyebrow}
                    </p>
                    <span
                      className={cn(
                        titleVariants({ size: s.size }),
                        "text-foreground block",
                      )}
                    >
                      {s.sample}
                    </span>
                  </div>
                  <div className="grid flex-[1_1_16rem] [grid-template-columns:repeat(auto-fit,minmax(7.5rem,1fr))] content-start gap-x-5 gap-y-[0.9rem]">
                    <TypeMeta
                      label={t.cabeceras.cols.gap}
                      value={EYEBROW_GAP[s.size]}
                      mono
                    />
                    <TypeMeta
                      label={t.cabeceras.cols.use}
                      value={s.use}
                      muted
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <h3 className="font-display m-0 mt-10 mb-2 text-[1rem] font-semibold">
            {t.cabeceras.toneTitle}
          </h3>
          <p className="text-muted-foreground m-0 mb-4 max-w-[var(--measure)] text-[0.9rem] leading-[1.55]">
            {t.cabeceras.toneLead}
          </p>
          <div className={PAIR}>
            {t.cabeceras.tones.map((tone) => {
              const band = tone.surface === "--muted";
              return (
                <div key={tone.surface} className={cn(PANEL, "flex flex-col")}>
                  <div
                    className={cn(
                      "flex flex-1 flex-col justify-center px-5 py-8",
                      // La superficie ES la demo: los dos rótulos salen de la
                      // MISMA clase, sin prop que los distinga, y se pintan
                      // distinto solo porque el fondo que tienen debajo es otro
                      // (`--surface-dim`, P37.6565). Por eso el espécimen tiene
                      // que traer la superficie de verdad y no un color parecido.
                      band ? "bg-muted" : "bg-background",
                    )}
                  >
                    <p className={cn(eyebrowVariants(), "mb-3")}>
                      {tone.label}
                    </p>
                    <span
                      className={cn(
                        titleVariants({ size: "section-sm" }),
                        "block text-[1.5rem]",
                      )}
                    >
                      {tone.sample}
                    </span>
                  </div>
                  <div className="border-border bg-card border-t px-5 pt-[1.1rem] pb-[1.35rem]">
                    <code className="text-muted-foreground font-mono text-[0.74rem]">
                      {tone.surface}
                    </code>
                    <p className="text-muted-foreground m-0 mt-[0.5rem] text-[0.82rem] leading-[1.55]">
                      {tone.note}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 max-w-[var(--measure)]">
            <InfoCard
              title={t.cabeceras.ruleTitle}
              bullets={t.cabeceras.rule}
              foot={t.cabeceras.ruleFoot}
            />
          </div>
        </div>
      </section>

      {/* ===================== (12) TABLAS ===================== */}
      <section data-reveal className={SECTION}>
        <div className={WRAP}>
          <SectionHead num={t.tablas.num} title={t.tablas.title} />
          <p className="text-muted-foreground m-0 mb-10 max-w-[var(--measure)] text-[0.95rem]">
            {t.tablas.lead}
          </p>

          <h3 className="font-display m-0 mb-2 text-[1rem] font-semibold">
            {t.tablas.dataTitle}
          </h3>
          <p className="text-muted-foreground m-0 mb-4 max-w-[var(--measure)] text-[0.9rem] leading-[1.55]">
            {t.tablas.dataLead}
          </p>
          {/* La demo es una tabla de verdad y con la pieza de verdad: si la capa
              cambia, este espécimen cambia con ella y no puede mentir. */}
          <DataTable
            caption={t.tablas.dataTitle}
            cols={[
              { label: t.tablas.demoCols.part, width: "34%" },
              { label: t.tablas.demoCols.markup, width: "26%" },
              { label: t.tablas.demoCols.what },
            ]}
          >
            {t.tablas.demoRows.map((r) => (
              <TR key={r.markup}>
                <TD head className="text-foreground font-medium">
                  {r.part}
                </TD>
                <TD>
                  <code className="font-mono text-[0.85rem]">{r.markup}</code>
                </TD>
                <TD className="text-muted-foreground text-[0.88rem]">
                  {r.what}
                </TD>
              </TR>
            ))}
          </DataTable>

          <div className="mt-8 max-w-[var(--measure)]">
            <InfoCard
              title={t.tablas.ruleTitle}
              bullets={t.tablas.rule}
              foot={t.tablas.ruleFoot}
            />
          </div>
        </div>
      </section>

      {/* ===================== (13) ACCESIBILIDAD ===================== */}
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
          <DataTable
            caption={t.accesibilidad.contrastTitle}
            cols={[
              { label: t.accesibilidad.contrastCols.measure, width: "50%" },
              { label: t.accesibilidad.contrastCols.light, width: "25%" },
              { label: t.accesibilidad.contrastCols.dark, width: "25%" },
            ]}
          >
            {t.accesibilidad.contrastRows.map((r) => {
              // La fila la nombra el copy; la cifra y el nivel salen del censo.
              if (!isContrastId(r.id)) return null;
              const id = r.id;
              return (
                <TR key={r.id}>
                  <TD head>
                    <span className="text-foreground font-medium">
                      {r.label}
                    </span>
                    <span className="text-muted-foreground mt-[0.15rem] block text-[0.78rem]">
                      {r.note}
                    </span>
                  </TD>
                  {(["light", "dark"] as const).map((theme) => (
                    <TD
                      key={theme}
                      className="text-foreground font-mono text-[0.9rem]"
                    >
                      {ratioText(id, theme, lang)}
                      <ContrastBadge lv={levelOf(id, theme)} />
                    </TD>
                  ))}
                </TR>
              );
            })}
          </DataTable>
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
                  <Check className={CHECK} />
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

      {/* ===================== (14) ESQUELETO ===================== */}
      <section
        data-reveal
        // Misma familia que la fila cebra: la sección se pinta su propio velo de
        // `--card` y por eso tiene que declararlo (P37.6565).
        data-surface="card"
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

function ContrastBadge({ lv }: { lv: string | null }) {
  if (!lv) return null;
  return (
    <Badge tone={lv === "AAA" ? "cyan" : "neutral"} className="ml-[0.35rem]">
      {lv}
    </Badge>
  );
}

// Tarjeta de tema fijo (§06): muestra claro y oscuro con la paleta literal,
// independiente del tema activo, para enseñar ambas superficies a la vez.
function ThemeCard({
  variant,
  modeLabel,
  headline,
  cta,
}: {
  variant: "light" | "dark";
  modeLabel: string;
  headline: string;
  cta: string;
}) {
  // Los dieciocho valores que había aquí escritos a mano —nueve por tema— salen
  // de `PALETTE` (P37.6605). El mock no puede usar `var(--…)` porque pinta las
  // DOS paletas a la vez y las CSS vars solo dan la del tema activo; lo que no
  // podía era tener su propia copia: el cian claro llevaba días en el valor
  // anterior a P37.598, o sea que la página que documenta el sistema de color
  // enseñaba justo el color que se corrigió por publicar un AAA que no cumplía.
  // Ahora `npm run check:palette` no deja que vuelva a pasar.
  const p = PALETTE[variant];
  const c = {
    border: p.border,
    bg: p.background,
    fg: p.foreground,
    eyebrow: p["muted-foreground"],
    innerBorder: p.border,
    innerBg: p.card,
    bar: p.muted,
    btnBg: p.primary,
    btnFg: p["primary-foreground"],
  };

  // El pie de la tarjeta cita tres hexes. Estaban escritos en el diccionario —los
  // mismos seis caracteres en ES y en EN, o sea que nunca fueron copy (D38)— y DOS
  // de los seis mentían: `#E7E4DD` y `#2C333B` por `#E2DED4` y `#2E353C`. Los
  // destapó una captura de esta misma pantalla mientras se arreglaba el cian de
  // arriba, no una auditoría: nadie los había contado como copias de un token
  // porque son texto, no color, y ninguna herramienta compara un párrafo con el
  // píxel que tiene al lado. Ahora se derivan del mismo sitio que los pinta.
  const hex = paletteHex(variant);
  const caption = `bg ${hex.background} · card ${hex.card} · border ${hex.border}`;

  return (
    <div
      className="overflow-hidden rounded-xl border"
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
          className="rounded-lg border p-4"
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
        {/* El CTA del mock lleva su icono, y no por decoración: la acción es
            «Descargar CV», que saca al usuario de la página, así que por la regla
            de §Cuándo una acción lleva icono le toca — y en la variante `solid` va
            DETRÁS de la etiqueta. Sin él, esta maqueta enseñaba un botón que el
            sitio no tiene, que es justo lo que la Fase 0 de `design-review` busca.
            Lo que NO lleva es hover ni el empujón de 2px: es un `<span>`, no se
            pulsa, y darle afordancia de control sería mentir en el otro sentido. */}
        <span
          className="inline-flex min-h-9 items-center gap-[0.5rem] self-start rounded-md px-[0.9rem] text-[0.82rem] font-medium"
          style={{ background: c.btnBg, color: c.btnFg }}
        >
          {cta}
          <Download className="size-4 shrink-0" />
        </span>
      </div>
      <div
        className="border-t px-6 py-[0.65rem] font-mono text-[0.72rem]"
        style={{ borderColor: c.border, color: c.eyebrow }}
      >
        {caption}
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
