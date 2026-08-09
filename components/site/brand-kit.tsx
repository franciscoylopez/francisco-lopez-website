import { Download, Info } from "lucide-react";

import type { Dictionary } from "@/app/[lang]/dictionaries";
import { actionVariants } from "@/components/ui/action";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { BRAND_SWATCHES, swatchRatioParts } from "@/lib/design-values";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

import { Breadcrumb, type BreadcrumbDict } from "./breadcrumb";
import { LinkedinIcon } from "@/components/ui/icons";
import { CARD, PAIR, PANEL, SECTION, WRAP } from "@/components/ui/layout";
import { RelatedPages, type RelatedDict } from "./related-pages";
import { SectionHeader, titleVariants } from "@/components/ui/heading";

type BrandKitDict = Dictionary["brandKit"];

// Página Brand Kit (PRD §19). Traducida de design/web-personal.dc.html (D1).
// Server Component completo: la única interacción es el reveal (RevealRoot, en la
// page) y las descargas dependientes de tema, que se resuelven con dos <a>
// conmutados por CSS (dark:hidden / hidden dark:inline-flex), sin JS (D7). La
// énfasis inline del diseño (<strong> a media frase) se renderiza en texto plano.

// --- Assets del logo-kit. La tinta sigue el tema: claro → tinta oscura sobre
//     fondo claro; oscuro → tinta clara sobre fondo oscuro (public/logo-kit/**). ---
const svgPair = (n: string) => ({
  light: `/logo-kit/svg/${n}-claro.svg`,
  dark: `/logo-kit/svg/${n}-oscuro.svg`,
});
const pngPair = (n: string, sz: number) => ({
  light: `/logo-kit/png/${n}-tintaOscura-${sz}.png`,
  dark: `/logo-kit/png/${n}-tintaClara-${sz}.png`,
});
const favPair = (sz: number) => ({
  light: `/logo-kit/favicon/favicon-claro-${sz}.png`,
  dark: `/logo-kit/favicon/favicon-oscuro-${sz}.png`,
});
const monoSvg = (n: string) => `/logo-kit/svg/${n}.svg`;
const monoPng = (n: string, sz: number) => `/logo-kit/png/${n}-${sz}.png`;

// Chips de descarga. Salen de la capa de acción del sistema (P37.592), que ya trae
// el objetivo táctil de 44px —punto 3 de la checklist que publica el propio Design
// System; estos chips estaban a 40px hasta P37.59— y el par de hover correcto:
// outline-primary se rellena de cian, el outline neutro se apoya en la pastilla
// `muted` del chrome.
const DL_PRIMARY = actionVariants({ variant: "outline-primary", size: "sm" });
const DL_NEUTRAL = actionVariants({ variant: "outline-neutral", size: "sm" });

// Descarga con href único (assets neutros al tema: mono negro/blanco).
//
// El icono ya no es opcional (P37.5988). Había una prop `icon` que cada uso ponía
// o no, y el resultado era que dentro del MISMO panel el chip de SVG lo llevaba y
// los de PNG no, aunque los cuatro descargan exactamente igual. La regla del icono
// —lo lleva la acción que saca al usuario de la página— no admite matiz aquí:
// estos componentes existen solo para descargar, así que el icono es suyo, no de
// quien los invoca. Una decisión menos que tomar en cada llamada.
function Dl({
  href,
  tone = "neutral",
  children,
}: {
  href: string;
  tone?: "primary" | "neutral";
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      download
      className={tone === "primary" ? DL_PRIMARY : DL_NEUTRAL}
    >
      <Download />
      {children}
    </a>
  );
}

// Descarga dependiente de tema: dos <a> conmutados por CSS (sin JS).
function DlThemed({
  pair,
  tone = "neutral",
  children,
}: {
  pair: { light: string; dark: string };
  tone?: "primary" | "neutral";
  children: React.ReactNode;
}) {
  const cls = tone === "primary" ? DL_PRIMARY : DL_NEUTRAL;
  return (
    <>
      <a href={pair.light} download className={cn(cls, "dark:hidden")}>
        <Download />
        {children}
      </a>
      <a
        href={pair.dark}
        download
        className={cn(cls, "hidden dark:inline-flex")}
      >
        <Download />
        {children}
      </a>
    </>
  );
}

// Glifo dimensionado por altura (reutiliza el componente Logo, fuente única de la
// geometría). `h` en px.
function Glyph({
  variant,
  h,
  mono,
}: {
  variant: "split" | "flat";
  h: number;
  mono?: "black" | "white";
}) {
  return (
    <span className="block shrink-0" style={{ height: `${h}px` }}>
      <Logo
        variant={variant}
        forceColor={mono ?? "theme"}
        className="h-full gap-0"
      />
    </span>
  );
}

// Tipografía de sección, propia de esta página. Las cajas y los ritmos comunes
// (WRAP / SECTION / PANEL) vienen de `./layout`: lo que aquí se llamaba `CARD` era
// en realidad el PANEL del sistema —radio xl y `overflow-hidden`— y ese nombre
// equivocado era lo que hacía parecer que el sistema tenía tres tarjetas distintas.
const NUM =
  "text-muted-foreground m-0 mb-3 font-mono text-[0.8rem] tracking-[0.04em]";
// El título de sección sale de la capa de cabecera (P37.65): era una copia exacta.
const H2 = titleVariants({ size: "section" });
const LEAD =
  "text-muted-foreground mt-[1.4rem] text-[clamp(1rem,1.4vw,1.15rem)] leading-[1.6] text-pretty";

// Los VALORES de la rejilla de color (token, hex, muestra y sus cifras medidas)
// salen de `lib/design-values.ts`; el diccionario solo conserva el nombre y la
// nota de cada muestra, que es lo único que un traductor toca (P37.66).
const SWATCH: Record<string, (typeof BRAND_SWATCHES)[number] | undefined> =
  Object.fromEntries(BRAND_SWATCHES.map((s) => [s.id, s]));

export function BrandKit({
  dict,
  related,
  breadcrumb,
  homeHref,
  lang,
}: {
  dict: BrandKitDict;
  related: RelatedDict;
  breadcrumb: BreadcrumbDict;
  homeHref: string;
  lang: Locale;
}) {
  const t = dict;
  const ratioLabels: Record<string, string> = t.color.ratioLabels;

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
                className="text-muted-foreground mt-6 max-w-[40ch] text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-[1.6]"
              >
                {t.hero.lead}
              </p>
            </div>
            {/* Composición: la anatomía del logo aplicada a escala (PRD §19).
                Centro foreground que conmuta, flancos pastel fijos. Decorativa. */}
            <div
              aria-hidden="true"
              className="flex flex-[1_1_26rem] items-center justify-center"
            >
              <div className="relative w-[min(21rem,100%)]">
                <div
                  data-reveal
                  className="absolute top-1/2 left-[-2.75rem] z-[1] hidden -translate-y-1/2 md:block"
                  style={{ transitionDelay: "0.16s" }}
                >
                  <div
                    className="bg-brand-cyan-soft flex h-[10.5rem] w-[7.5rem] items-center justify-center rounded-xl"
                    style={{ transform: "rotate(-6deg)" }}
                  >
                    <Glyph variant="flat" h={27} />
                  </div>
                </div>
                <div
                  data-reveal
                  className="absolute top-1/2 right-[-2.75rem] z-[1] hidden -translate-y-1/2 md:block"
                  style={{ transitionDelay: "0.24s" }}
                >
                  <div
                    className="bg-brand-purple-soft flex h-[10.5rem] w-[7.5rem] items-center justify-center rounded-xl"
                    style={{ transform: "rotate(6deg)" }}
                  >
                    <Glyph variant="flat" h={27} />
                  </div>
                </div>
                <BrowserMockup />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== 01 CONCEPTO ===================== */}
      <section className={SECTION}>
        <div className={WRAP}>
          <div
            data-reveal
            className="mb-[clamp(2.5rem,5vw,4rem)] max-w-[var(--measure)]"
          >
            <p className={NUM}>{t.concepto.num}</p>
            <h2 className={H2}>{t.concepto.title}</h2>
            <p className={LEAD}>{t.concepto.lead}</p>
          </div>
          <div
            data-reveal
            className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,15rem),1fr))] gap-[var(--gutter)]"
          >
            {[
              { variant: "flat" as const, c: t.concepto.plano },
              { variant: "split" as const, c: t.concepto.split },
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

      {/* ===================== 02 LOGOTIPO ===================== */}
      <section className={SECTION}>
        <div className={WRAP}>
          <div
            data-reveal
            className="mb-[clamp(2.5rem,5vw,4rem)] max-w-[var(--measure)]"
          >
            <p className={NUM}>{t.logotipo.num}</p>
            <h2 className={H2}>{t.logotipo.title}</h2>
            <p className={LEAD}>{t.logotipo.lead}</p>
          </div>

          {/* Fila 1 — símbolo split / plano */}
          <div data-reveal className={cn(PAIR, "mb-[var(--gutter)]")}>
            <VariantCard
              glyph={<Glyph variant="split" h={96} />}
              name={t.logotipo.cards.symSplit.name}
              meta={t.logotipo.cards.symSplit.meta}
            >
              <div className="flex flex-wrap gap-2">
                <DlThemed pair={svgPair("simbolo-split")} tone="primary">
                  {t.logotipo.cards.symSplit.svg}
                </DlThemed>
              </div>
              <div className="flex flex-wrap gap-2">
                <DlThemed pair={pngPair("simbolo-split", 1024)}>
                  PNG 1024
                </DlThemed>
                <DlThemed pair={pngPair("simbolo-split", 512)}>512</DlThemed>
                <DlThemed pair={pngPair("simbolo-split", 256)}>256</DlThemed>
              </div>
            </VariantCard>

            <VariantCard
              glyph={<Glyph variant="flat" h={96} />}
              name={t.logotipo.cards.symPlano.name}
              meta={t.logotipo.cards.symPlano.meta}
            >
              <div className="flex flex-wrap gap-2">
                <DlThemed pair={svgPair("simbolo-plano")} tone="primary">
                  {t.logotipo.cards.symPlano.svg}
                </DlThemed>
              </div>
              <div className="flex flex-wrap gap-2">
                <DlThemed pair={pngPair("simbolo-plano", 1024)}>
                  PNG 1024
                </DlThemed>
                <DlThemed pair={pngPair("simbolo-plano", 512)}>512</DlThemed>
                <DlThemed pair={pngPair("simbolo-plano", 256)}>256</DlThemed>
              </div>
            </VariantCard>
          </div>

          {/* Fila 2 — símbolo mono: DOS tarjetas, no una partida. Hasta P37.61
              compartían un solo panel con la previsualización dividida en
              blanco/negro y ocho chips en dos filas etiquetadas. Era la única
              tarjeta de la fila escrita a mano —las hermanas ya salían de
              VariantCard—, así que no heredó el ensanchado de chips de P37.592 y
              sus dos filas se partieron en cuatro. Separarlas borra la excepción
              en vez de afinarla, y ponerlas en el MISMO par conserva lo que el
              panel partido sí hacía bien: enseñar las dos tintas juntas. */}
          <div data-reveal className={cn(PAIR, "mb-[var(--gutter)]")}>
            <VariantCard
              glyph={<Glyph variant="flat" h={96} mono="black" />}
              name={t.logotipo.cards.symMonoNegro.name}
              meta={t.logotipo.cards.symMonoNegro.meta}
              surface="white"
            >
              <div className="flex flex-wrap gap-2">
                <Dl href={monoSvg("simbolo-mono-negro")} tone="primary">
                  {t.logotipo.cards.symMonoNegro.svg}
                </Dl>
              </div>
              <div className="flex flex-wrap gap-2">
                <Dl href={monoPng("simbolo-mono-negro", 1024)}>PNG 1024</Dl>
                <Dl href={monoPng("simbolo-mono-negro", 512)}>512</Dl>
                <Dl href={monoPng("simbolo-mono-negro", 256)}>256</Dl>
              </div>
            </VariantCard>

            <VariantCard
              glyph={<Glyph variant="flat" h={96} mono="white" />}
              name={t.logotipo.cards.symMonoBlanco.name}
              meta={t.logotipo.cards.symMonoBlanco.meta}
              surface="ink"
            >
              <div className="flex flex-wrap gap-2">
                <Dl href={monoSvg("simbolo-mono-blanco")} tone="primary">
                  {t.logotipo.cards.symMonoBlanco.svg}
                </Dl>
              </div>
              <div className="flex flex-wrap gap-2">
                <Dl href={monoPng("simbolo-mono-blanco", 1024)}>PNG 1024</Dl>
                <Dl href={monoPng("simbolo-mono-blanco", 512)}>512</Dl>
                <Dl href={monoPng("simbolo-mono-blanco", 256)}>256</Dl>
              </div>
            </VariantCard>
          </div>

          {/* Fila 3 — lockups */}
          <div data-reveal className={cn(PAIR, "mb-[clamp(3rem,6vw,5rem)]")}>
            <VariantCard
              glyph={<Lockup variant="split" />}
              name={t.logotipo.cards.lockSplit.name}
              meta={t.logotipo.cards.lockSplit.meta}
            >
              <div className="flex flex-wrap gap-2">
                <DlThemed pair={svgPair("lockup-split")} tone="primary">
                  {t.logotipo.cards.lockSplit.svg}
                </DlThemed>
              </div>
              <div className="flex flex-wrap gap-2">
                <DlThemed pair={pngPair("lockup-split", 1024)}>
                  PNG 1024
                </DlThemed>
                <DlThemed pair={pngPair("lockup-split", 512)}>512</DlThemed>
                <DlThemed pair={pngPair("lockup-split", 256)}>256</DlThemed>
              </div>
            </VariantCard>

            <VariantCard
              glyph={<Lockup variant="flat" />}
              name={t.logotipo.cards.lockPlano.name}
              meta={t.logotipo.cards.lockPlano.meta}
            >
              <div className="flex flex-wrap gap-2">
                <DlThemed pair={svgPair("lockup-plano")} tone="primary">
                  {t.logotipo.cards.lockPlano.svg}
                </DlThemed>
              </div>
              <div className="flex flex-wrap gap-2">
                <DlThemed pair={pngPair("lockup-plano", 1024)}>
                  PNG 1024
                </DlThemed>
                <DlThemed pair={pngPair("lockup-plano", 512)}>512</DlThemed>
                <DlThemed pair={pngPair("lockup-plano", 256)}>256</DlThemed>
              </div>
            </VariantCard>
          </div>

          {/* Tabla de uso */}
          <div data-reveal className="mb-[clamp(3rem,6vw,5rem)]">
            <h3 className="font-display m-0 mb-[0.4rem] text-[clamp(1.4rem,2.4vw,1.9rem)] font-semibold tracking-[-0.015em]">
              {t.logotipo.usage.title}
            </h3>
            <p className="text-muted-foreground m-0 mb-6 text-[0.95rem]">
              {t.logotipo.usage.sub}
            </p>
            {/* tabla ≥md */}
            <div className="border-border hidden overflow-hidden rounded-lg border md:block">
              <div className="bg-card border-border text-muted-foreground grid grid-cols-[1.4fr_0.8fr_0.9fr_1fr_0.7fr] gap-4 border-b px-5 py-[0.9rem] text-[0.72rem] font-semibold tracking-[0.06em] uppercase">
                <span>{t.logotipo.usage.cols.ctx}</span>
                <span>{t.logotipo.usage.cols.variant}</span>
                <span>{t.logotipo.usage.cols.sym}</span>
                <span>{t.logotipo.usage.cols.word}</span>
                <span>{t.logotipo.usage.cols.bar}</span>
              </div>
              {t.logotipo.usage.rows.map((r) => (
                <div
                  key={r.ctx}
                  className="border-border grid grid-cols-[1.4fr_0.8fr_0.9fr_1fr_0.7fr] items-center gap-4 border-b px-5 py-[0.95rem] text-[0.92rem] last:border-b-0"
                >
                  <span className="font-semibold">{r.ctx}</span>
                  <span>
                    <VariantBadge on={r.on}>{r.variant}</VariantBadge>
                  </span>
                  <span className="text-foreground tabular-nums">{r.sym}</span>
                  <span className="text-muted-foreground">{r.word}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {r.bar}
                  </span>
                </div>
              ))}
            </div>
            {/* tarjetas <md */}
            <div className="flex flex-col gap-[0.85rem] md:hidden">
              {t.logotipo.usage.rows.map((r) => (
                <div key={r.ctx} className={cn(CARD, "p-4")}>
                  <div className="mb-[0.7rem] flex items-center justify-between gap-3">
                    <span className="font-display text-[1.05rem] font-semibold">
                      {r.ctx}
                    </span>
                    <VariantBadge on={r.on}>{r.variant}</VariantBadge>
                  </div>
                  <div className="flex flex-col gap-[0.35rem] text-[0.88rem]">
                    <UsageKV k={t.logotipo.usage.cols.sym} v={r.sym} />
                    <UsageKV k={t.logotipo.usage.cols.word} v={r.word} />
                    <UsageKV k={t.logotipo.usage.cols.bar} v={r.bar} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Las siete reglas */}
          <div data-reveal className="mb-[clamp(3rem,6vw,5rem)]">
            <h3 className="font-display m-0 mb-6 text-[clamp(1.4rem,2.4vw,1.9rem)] font-semibold tracking-[-0.015em]">
              {t.logotipo.rules.title}
            </h3>
            <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr))] gap-[var(--gutter)]">
              {t.logotipo.rules.items.map((r, i) => (
                <div
                  key={r.title}
                  className={cn(CARD, "px-[1.4rem] py-[1.35rem]")}
                >
                  <div className="mb-[0.6rem] flex items-center gap-[0.7rem]">
                    <span className="bg-foreground text-background inline-flex h-[1.9rem] w-[1.9rem] flex-none items-center justify-center rounded-md font-mono text-[0.85rem] font-semibold">
                      {i + 1}
                    </span>
                    <h4 className="font-display m-0 text-[1.05rem] leading-[1.25] font-semibold tracking-[-0.01em]">
                      {r.title}
                    </h4>
                  </div>
                  <p className="text-muted-foreground m-0 text-[0.9rem] leading-[1.6] text-pretty">
                    {r.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Escalera del split (regla 1) */}
          <div
            data-reveal
            className={cn(PANEL, "p-[clamp(1.5rem,3vw,2.5rem)]")}
          >
            <div className="mb-8 max-w-[var(--measure)]">
              <p className="text-muted-foreground m-0 mb-2 font-mono text-[0.78rem]">
                {t.logotipo.ladder.kicker}
              </p>
              <h3 className="font-display m-0 mb-[0.6rem] text-[clamp(1.2rem,2vw,1.5rem)] font-semibold tracking-[-0.015em]">
                {t.logotipo.ladder.title}
              </h3>
              <p className="text-muted-foreground m-0 text-[0.92rem] leading-[1.6]">
                {t.logotipo.ladder.lead}
              </p>
            </div>
            <div className="flex flex-wrap items-end gap-[clamp(1.25rem,4vw,3rem)]">
              {[24, 32, 48, 64, 96].map((h) => {
                const works = h >= 48;
                return (
                  <div
                    key={h}
                    className="flex flex-col items-center gap-[0.9rem]"
                  >
                    <div className="flex h-24 items-end justify-center">
                      <Glyph variant="split" h={h} />
                    </div>
                    <div className="text-center">
                      <div className="font-mono text-[0.85rem] font-semibold">
                        {h}px
                      </div>
                      <div className="text-muted-foreground text-[0.72rem]">
                        {t.logotipo.ladder.crescent}{" "}
                        {(h * 0.051).toFixed(1).replace(".", ",")}px
                      </div>
                      <div
                        className={cn(
                          "mt-[0.35rem] text-[0.68rem] font-semibold tracking-[0.04em] uppercase",
                          works ? "text-primary" : "text-brand-purple-accent",
                        )}
                      >
                        {works
                          ? t.logotipo.ladder.works
                          : t.logotipo.ladder.dirty}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== 03 COLOR ===================== */}
      <section className={SECTION}>
        <div className={WRAP}>
          <div
            data-reveal
            className="mb-[clamp(2.5rem,5vw,4rem)] max-w-[var(--measure)]"
          >
            <p className={NUM}>{t.color.num}</p>
            <h2 className={H2}>{t.color.title}</h2>
            <p className={LEAD}>{t.color.lead}</p>
          </div>
          <div
            data-reveal
            className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,13rem),1fr))] gap-[var(--gutter)]"
          >
            {t.color.items.map((c) => {
              // El copy manda QUÉ muestras se publican; el módulo, cuánto valen.
              const s = SWATCH[c.id];
              if (!s) return null;
              const ratio = swatchRatioParts(
                s,
                lang,
                (k) => ratioLabels[k] ?? k,
              ).join(" · ");
              return (
                <div key={c.id} className={cn(CARD, "overflow-hidden")}>
                  <div
                    className="border-border flex h-[118px] items-end border-b p-[0.85rem]"
                    style={{ background: s.sample }}
                  >
                    <span
                      className="font-display text-[1.5rem] font-semibold"
                      style={{ color: s.sampleFg }}
                    >
                      Aa
                    </span>
                  </div>
                  <div className="px-4 pt-[0.9rem] pb-[1.1rem]">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-display text-[0.98rem] font-semibold">
                        {c.name}
                      </div>
                      <Badge tone={s.swaps ? "cyan" : "neutral"}>
                        {s.swaps ? t.color.swapConmuta : t.color.swapFijo}
                      </Badge>
                    </div>
                    <code className="text-muted-foreground mt-[0.35rem] block font-mono text-[0.76rem]">
                      {s.token}
                    </code>
                    <code className="text-foreground mt-[0.15rem] block font-mono text-[0.78rem]">
                      {s.hex}
                    </code>
                    <div className="border-border text-muted-foreground mt-[0.6rem] border-t border-dashed pt-[0.6rem] text-[0.78rem]">
                      {ratio}
                    </div>
                    <div className="text-muted-foreground mt-[0.2rem] text-[0.76rem]">
                      {c.note}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Callout data-reveal accent="purple">
            {t.color.pastelNote}
          </Callout>
        </div>
      </section>

      {/* ===================== 04 TIPOGRAFÍA ===================== */}
      <section className={SECTION}>
        <div className={WRAP}>
          <div
            data-reveal
            className="mb-[clamp(2.5rem,5vw,4rem)] max-w-[var(--measure)]"
          >
            <p className={NUM}>{t.tipografia.num}</p>
            <h2 className={H2}>{t.tipografia.title}</h2>
            <p className={LEAD}>{t.tipografia.lead}</p>
          </div>
          <div
            data-reveal
            className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,20rem),1fr))] gap-[var(--gutter)]"
          >
            <TypeCard face="display" data={t.tipografia.bricolage} />
            <TypeCard face="sans" data={t.tipografia.inter} />
          </div>
        </div>
      </section>

      {/* ===================== 05 APLICACIONES ===================== */}
      <section className={SECTION}>
        <div className={WRAP}>
          <div
            data-reveal
            className="mb-[clamp(2.5rem,5vw,4rem)] max-w-[var(--measure)]"
          >
            <p className={NUM}>{t.aplicaciones.num}</p>
            <h2 className={H2}>{t.aplicaciones.title}</h2>
            <p className={LEAD}>{t.aplicaciones.lead}</p>
          </div>
          <div
            data-reveal
            className="mb-8 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,17rem),1fr))] gap-[var(--gutter)]"
          >
            {/* favicon */}
            <div className={cn(PANEL, "p-[clamp(1.4rem,3vw,1.9rem)]")}>
              <div className="font-display mb-[0.35rem] text-[1.15rem] font-semibold">
                {t.aplicaciones.favicon.title}
              </div>
              <p className="text-muted-foreground m-0 mb-[1.2rem] text-[0.88rem] leading-[1.55]">
                {t.aplicaciones.favicon.desc}
              </p>
              <div className="mb-[1.2rem] flex items-end gap-6">
                {[48, 32, 16].map((sz) => (
                  <div key={sz} className="flex flex-col items-center gap-2">
                    <span
                      className="border-border bg-background inline-flex items-center justify-center border"
                      style={{
                        width: `${sz}px`,
                        height: `${sz}px`,
                        borderRadius: sz >= 48 ? 8 : sz >= 32 ? 6 : 4,
                      }}
                    >
                      <Glyph variant="flat" h={Math.round(sz * 0.62)} />
                    </span>
                    <span className="text-muted-foreground font-mono text-[0.72rem]">
                      {sz}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Dl href="/logo-kit/favicon/favicon.ico" tone="primary">
                  {t.aplicaciones.favicon.ico}
                </Dl>
                <DlThemed pair={favPair(32)}>PNG 32</DlThemed>
                <DlThemed pair={favPair(16)}>PNG 16</DlThemed>
              </div>
            </div>

            {/* OG / redes */}
            <div className={cn(PANEL, "p-[clamp(1.4rem,3vw,1.9rem)]")}>
              <div className="font-display mb-[0.35rem] text-[1.15rem] font-semibold">
                {t.aplicaciones.og.title}
              </div>
              <p className="text-muted-foreground m-0 mb-[1.2rem] text-[0.88rem] leading-[1.55]">
                {t.aplicaciones.og.desc}
              </p>
              {/* Preview = la imagen OG real generada (/api/og), no un mockup: es
                  la misma que se sirve a las redes, así que no puede divergir. De
                  fondo de marca fijo (no conmuta con el tema, como la OG real). */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/og?card=brand-kit&lang=${lang}`}
                width={1200}
                height={630}
                alt={t.aplicaciones.og.previewAlt}
                className="border-border mb-[1.2rem] block w-full rounded-lg border"
              />
              <div className="flex flex-wrap gap-2">
                <DlThemed pair={pngPair("lockup-split", 1024)} tone="primary">
                  {t.aplicaciones.og.dl1}
                </DlThemed>
                <DlThemed pair={svgPair("lockup-split")}>SVG</DlThemed>
              </div>
            </div>
          </div>
          <Callout data-reveal accent="primary">
            {t.aplicaciones.pngNote}
          </Callout>
        </div>
      </section>

      {/* ===================== 06 USO ===================== */}
      <section className={SECTION}>
        <div className={WRAP}>
          <div
            data-reveal
            className="mb-[clamp(2.5rem,5vw,4rem)] max-w-[var(--measure)]"
          >
            <p className={NUM}>{t.uso.num}</p>
            <h2 className={H2}>{t.uso.title}</h2>
            <p className={LEAD}>{t.uso.lead}</p>
          </div>
          <div data-reveal className="flex flex-col gap-[var(--gutter)]">
            {t.uso.cases.map((c, i) => (
              <div
                key={c.title}
                className={cn(
                  PANEL,
                  "grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,22rem),1fr))]",
                )}
              >
                <div className="grid grid-cols-2">
                  <div className="border-border flex flex-col items-center justify-center gap-3 border-r px-4 py-7">
                    <ErrorVisual index={i} side="before" />
                    <span className="text-muted-foreground text-[0.7rem] font-semibold tracking-[0.05em] uppercase">
                      {c.before}
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-3 px-4 py-7">
                    <ErrorVisual index={i} side="after" />
                    <span className="text-primary text-[0.7rem] font-semibold tracking-[0.05em] uppercase">
                      {c.after}
                    </span>
                  </div>
                </div>
                <div className="border-border border-t p-[clamp(1.35rem,3vw,1.85rem)]">
                  <h3 className="font-display m-0 mb-[0.6rem] text-[1.2rem] font-semibold tracking-[-0.01em]">
                    {c.title}
                  </h3>
                  <Badge tone="purple" kind="code" className="mb-[0.7rem]">
                    {c.chip}
                  </Badge>
                  <p className="text-muted-foreground m-0 mb-[0.55rem] text-[0.9rem] leading-[1.6]">
                    {c.desc}
                  </p>
                  <p className="text-foreground m-0 text-[0.9rem] leading-[1.6]">
                    <strong className="font-semibold">{t.uso.fixLabel}</strong>{" "}
                    {c.fix}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RelatedPages dict={related} current="brandKit" lang={lang} />
    </main>
  );
}

// --- Subcomponentes ---

// Superficie de la previsualización. `card` sigue al tema (es la del PANEL);
// `white` e `ink` NO conmutan a propósito — los assets mono son de una tinta pura
// y hay que verlos sobre el fondo para el que existen, no sobre el del tema. Es
// la excepción al «nunca hardcodees hex» de BRAND.md, y vive aquí, en la pieza,
// justamente para que ningún call site tenga que repetirla ni decidirla.
// El anillo interior no es adorno: sin él, en CADA tema uno de los dos platos
// desaparece dentro de la tarjeta —el blanco mide 1,04 contra `--card` en claro y
// el ink 1,11 en oscuro— y la tarjeta mono queda idéntica a la de al lado, que es
// justo la que enseña otra cosa. Su color se toma del plato, no se fija: es el
// `foreground` de su propio carril al 18%, el mismo patrón que la bolita del
// switch (D30). Medido: 1,45 claro / 1,78 oscuro, contra el 1,29 / 1,23 que ya da
// por bueno el `--border` del sitio sobre `--card`.
const PREVIEW_SURFACE = {
  card: "",
  white: "bg-white shadow-[inset_0_0_0_1px_rgba(25,29,33,0.18)]",
  ink: "bg-[#191D21] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]",
} as const;

function VariantCard({
  glyph,
  name,
  meta,
  surface = "card",
  children,
}: {
  glyph: React.ReactNode;
  name: string;
  meta: string;
  surface?: keyof typeof PREVIEW_SURFACE;
  children: React.ReactNode;
}) {
  return (
    <div className={cn(PANEL, "flex flex-col")}>
      <div
        className={cn(
          "border-border flex min-h-44 items-center justify-center border-b p-8",
          PREVIEW_SURFACE[surface],
        )}
      >
        {glyph}
      </div>
      <div className="flex flex-1 flex-col px-5 pt-[1.15rem] pb-[1.35rem]">
        <div className="font-display text-[1.05rem] font-semibold">{name}</div>
        <p className="text-muted-foreground mt-1 mb-[0.9rem] text-[0.82rem]">
          {meta}
        </p>
        <div className="mt-auto flex flex-col gap-2">{children}</div>
      </div>
    </div>
  );
}

function Lockup({ variant }: { variant: "split" | "flat" }) {
  return (
    <span className="inline-flex items-center gap-3">
      <Glyph variant={variant} h={60} />
      <span className="font-display text-[1.6rem] font-semibold tracking-[-0.01em] whitespace-nowrap">
        Francisco López
      </span>
    </span>
  );
}

function VariantBadge({
  on,
  children,
}: {
  on: boolean;
  children: React.ReactNode;
}) {
  return <Badge tone={on ? "purple" : "neutral"}>{children}</Badge>;
}

function UsageKV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-right tabular-nums">{v}</span>
    </div>
  );
}

function Callout({
  accent,
  children,
  ...rest
}: {
  accent: "primary" | "purple";
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const color =
    accent === "primary" ? "var(--primary)" : "var(--brand-purple-accent)";
  return (
    <div
      {...rest}
      className="border-border bg-card mt-8 flex max-w-[var(--measure)] items-start gap-[0.85rem] rounded-md border px-[1.35rem] py-[1.15rem]"
      style={{ borderLeft: `3px solid ${color}` }}
    >
      <Info
        stroke={color}
        className="mt-[0.1rem] size-5 flex-none"
        aria-hidden="true"
      />
      <p className="text-foreground m-0 text-[0.92rem] leading-[1.6]">
        {children}
      </p>
    </div>
  );
}

function TypeCard({
  face,
  data,
}: {
  face: "display" | "sans";
  data: { name: string; tag: string; desc: string };
}) {
  const fam = face === "display" ? "font-display" : "font-sans";
  return (
    <div className={cn(PANEL, "p-[clamp(1.5rem,3vw,2.25rem)]")}>
      <div
        className={cn(
          fam,
          "text-[clamp(4rem,9vw,6rem)] leading-[0.95] tracking-[-0.03em]",
          face === "display" ? "font-bold" : "font-semibold",
        )}
      >
        Aa
      </div>
      <div className="font-display mt-4 text-[1.4rem] font-semibold tracking-[-0.01em]">
        {data.name}
      </div>
      <p className="text-muted-foreground mt-2 mb-[1.1rem] text-[0.72rem] font-semibold tracking-[0.06em] uppercase">
        {data.tag}
      </p>
      <p className="text-muted-foreground m-0 mb-[1.1rem] text-[0.95rem] leading-[1.6] text-pretty">
        {data.desc}
      </p>
      <p
        className={cn(
          fam,
          "m-0 text-[1.25rem] font-semibold tracking-[-0.01em]",
        )}
      >
        ABCDEFGHIJKLM
        <br />
        abcdefghijklm 0123456789
      </p>
    </div>
  );
}

// Composición decorativa del hero: ventana de navegador con el chrome a trazo
// invertido sobre una superficie foreground. Reproduce la anatomía del logo.
function BrowserMockup() {
  const line = (t: number) =>
    `color-mix(in srgb, var(--background), transparent ${t}%)`;
  return (
    <div
      data-reveal
      className="relative z-[2] w-full overflow-hidden rounded-[12px]"
      style={{ background: "var(--foreground)" }}
    >
      {/* pestañas */}
      <div
        className="flex h-[38px] items-end px-[10px]"
        style={{ borderBottom: `1px solid ${line(72)}` }}
      >
        <div
          className="flex h-[28px] items-center gap-2 px-3"
          style={{
            border: `1px solid ${line(55)}`,
            borderBottom: "none",
            borderRadius: "7px 7px 0 0",
          }}
        >
          <svg
            viewBox="31 17 58 70"
            width="12"
            height="14"
            fill="none"
            className="block flex-none"
            aria-hidden="true"
          >
            <circle
              cx="60"
              cy="46"
              r="26"
              stroke="var(--background)"
              strokeWidth="6"
            />
            <rect
              x="42"
              y="82"
              width="36"
              height="5"
              rx="2.5"
              fill="var(--background)"
            />
          </svg>
          <span
            className="h-[2px] w-[44px] rounded-[1px]"
            style={{ background: line(45) }}
          />
        </div>
      </div>
      {/* barra de direcciones */}
      <div
        className="flex h-[28px] items-center px-3"
        style={{ borderBottom: `1px solid ${line(72)}` }}
      >
        <span
          className="h-[13px] flex-1 rounded-[6.5px]"
          style={{ border: `1px solid ${line(55)}` }}
        />
      </div>
      {/* nav del sitio con proporciones reales */}
      <div
        className="flex h-[34px] items-center justify-between px-3"
        style={{ borderBottom: `1px solid ${line(72)}` }}
      >
        <span className="inline-flex items-center gap-[7px]">
          <svg
            viewBox="28 15 64 72"
            width="18"
            height="20"
            fill="none"
            className="block flex-none overflow-visible"
            aria-hidden="true"
          >
            <circle
              cx="57"
              cy="44"
              r="26"
              stroke="var(--brand-cyan-split)"
              strokeWidth="6"
            />
            <circle
              cx="63"
              cy="48"
              r="26"
              stroke="var(--brand-purple-split)"
              strokeWidth="6"
            />
            <circle
              cx="60"
              cy="46"
              r="26"
              stroke="var(--background)"
              strokeWidth="6"
            />
            <rect
              x="42"
              y="82"
              width="36"
              height="5"
              rx="2.5"
              fill="var(--background)"
            />
          </svg>
          <span
            className="font-display text-[9px] leading-none font-semibold tracking-[-0.01em]"
            style={{ color: "var(--background)" }}
          >
            Francisco López
          </span>
        </span>
        <span className="inline-flex items-center gap-[6px]">
          <span
            className="h-[12px] w-[40px] rounded-[6px]"
            style={{ border: `1px solid ${line(45)}` }}
          />
          <span
            className="h-[12px] w-[12px] rounded-[4px]"
            style={{ border: `1px solid ${line(45)}` }}
          />
        </span>
      </div>
      {/* contenido esquemático */}
      <div className="flex flex-col gap-[13px] px-[14px] pt-5 pb-6">
        <span
          className="h-[3px] w-[46%] rounded-[1.5px]"
          style={{ background: line(30) }}
        />
        {["90%", "78%", "84%", "62%"].map((w, i) => (
          <span
            key={i}
            className="h-[2px] rounded-[1px]"
            style={{ width: w, background: line(58) }}
          />
        ))}
      </div>
    </div>
  );
}

// Visuales antes/después de los 7 errores (§06). Reutilizan el glifo salvo los
// casos con formas ajenas (favicon 16 engordado, LinkedIn, muestras de color).
function ErrorVisual({
  index,
  side,
}: {
  index: number;
  side: "before" | "after";
}) {
  const before = side === "before";
  switch (index) {
    case 0: // viewBox: flat en caja de 80px, 23px vs 40px
      return (
        <span
          className={cn(
            "inline-flex h-20 w-20 items-center justify-center rounded-md",
            before
              ? "border-border border border-dashed"
              : "border-primary border",
          )}
        >
          <Glyph variant="flat" h={before ? 23 : 40} />
        </span>
      );
    case 1: // split @24 vs flat<48/split>=48
      return (
        <span className="flex h-[52px] items-end">
          <Glyph variant="split" h={before ? 24 : 48} />
        </span>
      );
    case 2: // favicon: 32-reescalado (trazo fino) vs dedicado 16 (trazo grueso)
      return before ? (
        <svg
          viewBox="31 17 58 70"
          width="58"
          height="70"
          fill="none"
          className="block"
          aria-hidden="true"
        >
          <circle
            cx="60"
            cy="46"
            r="26"
            stroke="var(--foreground)"
            strokeWidth="3.5"
          />
          <rect
            x="43.5"
            y="82.5"
            width="33"
            height="3.5"
            rx="1.75"
            fill="var(--foreground)"
          />
        </svg>
      ) : (
        <svg
          viewBox="0 0 80 80"
          width="70"
          height="70"
          fill="none"
          className="block"
          aria-hidden="true"
        >
          <g transform="translate(-20,-12)">
            <circle
              cx="60"
              cy="46"
              r="26"
              stroke="var(--foreground)"
              strokeWidth="10"
            />
            <rect
              x="42"
              y="82"
              width="36"
              height="5"
              rx="2.5"
              fill="var(--foreground)"
            />
          </g>
        </svg>
      );
    case 3: // peso: logo pequeño vs mayor, junto a LinkedIn
      // El vecino es el LinkedIn DEL SITIO (icons.tsx), no un dibujo propio de
      // esta ilustración. Era el relleno macizo —el que P37.5989 sustituyó por no
      // leerse en el footer—, así que la comparación se hacía contra un icono que
      // en el sitio ya no existe: la ilustración defendía su regla usando como
      // referencia algo que no está en ninguna pantalla. Mismo fallo que la luna y
      // el menú de la demo de chrome, una capa más sutil (P37.5993).
      return (
        <span className="text-muted-foreground inline-flex items-center gap-[0.65rem]">
          <Glyph variant="flat" h={before ? 15 : 25} />
          <LinkedinIcon className="size-[18px]" />
        </span>
      );
    case 4: // lockup 29% vs ~60%
      return (
        <span className="inline-flex items-center gap-[0.5rem]">
          <Glyph variant="flat" h={before ? 48 : 40} />
          <span
            className={cn(
              "font-display font-semibold tracking-[-0.01em]",
              before ? "text-[0.75rem]" : "text-[1.15rem]",
            )}
          >
            Francisco López
          </span>
        </span>
      );
    case 5: // círculo dentro del círculo
      return before ? (
        <span className="border-border bg-background inline-flex h-[72px] w-[72px] items-center justify-center rounded-full border">
          <Glyph variant="flat" h={25} />
        </span>
      ) : (
        <span className="inline-flex h-[72px] w-[72px] items-center justify-center">
          <Glyph variant="flat" h={60} />
        </span>
      );
    case 6: // colores desviados vs tokens
      return before ? (
        <span className="inline-flex gap-[0.4rem]">
          <span
            className="border-border h-[34px] w-[34px] rounded-md border"
            style={{ background: "#CFEFEE" }}
          />
          <span
            className="border-border h-[34px] w-[34px] rounded-md border"
            style={{ background: "#E6E0FB" }}
          />
        </span>
      ) : (
        <span className="inline-flex gap-[0.4rem]">
          <span className="border-border bg-brand-cyan-soft h-[34px] w-[34px] rounded-md border" />
          <span className="border-border bg-brand-purple-soft h-[34px] w-[34px] rounded-md border" />
        </span>
      );
    default:
      return null;
  }
}
