import type { Dictionary } from "@/app/[lang]/dictionaries";
import { EMAIL } from "@/lib/contact";
import { cn } from "@/lib/utils";

import { Breadcrumb, type BreadcrumbDict } from "./breadcrumb";
import { RelatedPages, type RelatedDict } from "./related-pages";

type AccesibilidadDict = Dictionary["accesibilidad"];

const WRAP = "mx-auto max-w-[var(--container)] px-[var(--page-x)]";
const SECTION = "border-border border-t py-[var(--section-y)]";
const CARD = "border-border bg-card rounded-[var(--radius-lg)] border";

// Página de Accesibilidad (PRD §9, V2). Hermana de Brand Kit / Design System (D21):
// mismo lenguaje visual —hero con composición a la derecha + fila de datos, secciones
// numeradas con `SectionHead`, encabezado grande a la izquierda y contenido a ancho
// completo—, breadcrumb, RelatedPages y JSON-LD BreadcrumbList. Es la declaración
// PÚBLICA de conformidad (el nivel WCAG que cumple el sitio y cómo reportar una
// barrera), contrapunto del criterio interno de la sección 08 del Design System.
//
// El contenido está medido y verificado (axe 0 violaciones en claro/oscuro,
// Lighthouse a11y 100). La cifra de conformidad y la fecha de `report.updated` se
// revisan tras cada QA de accesibilidad del build, no se declaran de memoria.
export function Accesibilidad({
  dict,
  related,
  breadcrumb,
  homeHref,
  lang,
}: {
  dict: AccesibilidadDict;
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
                className="text-muted-foreground mt-6 max-w-[46ch] text-[clamp(1.05rem,1.6vw,1.2rem)] leading-[1.6]"
              >
                {t.hero.lead}
              </p>
            </div>
            <HeroComposition />
          </div>
          {/* datos */}
          <div
            data-reveal
            className="border-border mt-[clamp(3rem,6vw,4.5rem)] grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,11rem),1fr))] gap-[var(--gutter)] border-t pt-8"
          >
            <Stat value="AA" label={t.hero.statConformidad} />
            <Stat value="AAA" label={t.hero.statColor} />
            <Stat value="0" label={t.hero.statAxe} />
            <Stat value="100" label={t.hero.statLighthouse} />
          </div>
        </div>
      </section>

      {/* ===================== (01) NIVEL DE CONFORMIDAD ===================== */}
      <section data-reveal className={SECTION}>
        <div className={WRAP}>
          <SectionHead num={t.conformance.num} title={t.conformance.heading} />
          <p className="text-muted-foreground m-0 mb-8 max-w-[var(--measure)] text-[0.95rem] leading-[1.7]">
            {t.conformance.note}
          </p>
          <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,17rem),1fr))] gap-[var(--gutter)]">
            {t.conformance.rows.map((r) => (
              <InfoCard key={r.label} title={r.label} body={r.value} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== (02) QUÉ SE HA HECHO ===================== */}
      <section data-reveal className={SECTION}>
        <div className={WRAP}>
          <SectionHead num={t.measures.num} title={t.measures.heading} />
          <p className="text-muted-foreground m-0 mb-8 max-w-[var(--measure)] text-[0.95rem] leading-[1.7]">
            {t.measures.intro}
          </p>
          <ol className="m-0 grid list-none [grid-template-columns:repeat(auto-fill,minmax(min(100%,21rem),1fr))] gap-3 p-0">
            {t.measures.items.map((c) => (
              <li key={c.title} className={cn(CARD, "px-[1.15rem] py-4")}>
                <div className="flex items-start gap-[0.9rem]">
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
        </div>
      </section>

      {/* ===================== (03) CÓMO SE VERIFICA ===================== */}
      <section data-reveal className={SECTION}>
        <div className={WRAP}>
          <SectionHead num={t.verify.num} title={t.verify.heading} />
          <p className="text-muted-foreground m-0 mb-8 max-w-[var(--measure)] text-[0.95rem] leading-[1.7]">
            {t.verify.intro}
          </p>
          <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,15rem),1fr))] gap-[var(--gutter)]">
            {t.verify.items.map((v) => (
              <InfoCard key={v.tool} title={v.tool} body={v.result} mono />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== (04) LÍMITES CONOCIDOS ===================== */}
      <section data-reveal className={SECTION}>
        <div className={WRAP}>
          <SectionHead num={t.limits.num} title={t.limits.heading} />
          <p className="text-muted-foreground m-0 mb-8 max-w-[var(--measure)] text-[0.95rem] leading-[1.7]">
            {t.limits.intro}
          </p>
          <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,19rem),1fr))] gap-[var(--gutter)]">
            {t.limits.items.map((l) => (
              <InfoCard key={l.title} title={l.title} body={l.body} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== (05) REPORTAR UNA BARRERA ===================== */}
      <section data-reveal className={SECTION}>
        <div className={WRAP}>
          <SectionHead num={t.report.num} title={t.report.heading} />
          <div className="max-w-[var(--measure)]">
            <p className="text-foreground/90 m-0 text-[1.0625rem] leading-[1.7]">
              {t.report.body}
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="border-primary text-primary hover:bg-primary/10 mt-6 inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-md)] border px-[1.1rem] text-[0.95rem] font-semibold transition-colors"
            >
              {t.report.emailLabel} {EMAIL}
            </a>
            <p className="text-muted-foreground m-0 mt-6 text-[0.85rem]">
              {t.report.updated}
            </p>
          </div>
        </div>
      </section>

      <RelatedPages dict={related} current="accesibilidad" lang={lang} />
    </main>
  );
}

// --- Subcomponentes ---

// Encabezado numerado de sección (mismo patrón que Design System): número mono +
// título grande, alineado a la izquierda; el contenido de la sección va debajo, a
// ancho completo.
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

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-[1.6rem] leading-none">{value}</div>
      <div className="text-muted-foreground mt-[0.35rem] text-[0.85rem]">
        {label}
      </div>
    </div>
  );
}

function InfoCard({
  title,
  body,
  mono,
}: {
  title: string;
  body: string;
  mono?: boolean;
}) {
  return (
    <div className={cn(CARD, "p-5")}>
      <h3
        className={cn(
          "text-foreground m-0 mb-2 text-[1rem] font-semibold",
          mono ? "font-mono text-[0.95rem]" : "font-display",
        )}
      >
        {title}
      </h3>
      <p className="text-muted-foreground m-0 text-[0.88rem] leading-[1.6]">
        {body}
      </p>
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

// Composición del hero (decorativa, aria-hidden): tres piezas superpuestas que
// ilustran de qué habla la página —una tarjeta de contraste medido, una checklist
// con marcas, y una muestra del anillo de foco de 2px— con el mismo tratamiento de
// capas rotadas que la de Design System. Tokens de marca; el cian es el acento.
function HeroComposition() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-[1_1_24rem] items-center justify-center"
    >
      {/* desktop */}
      <div className="relative hidden h-80 w-[min(25rem,100%)] md:block">
        {/* atrás: contraste medido */}
        <div
          data-reveal
          className="border-border bg-background absolute top-0 right-2 w-[9.5rem] rounded-[14px] border p-[0.9rem]"
          style={{ transform: "rotate(6deg)", transitionDelay: "0.08s" }}
        >
          <div className="text-muted-foreground font-mono text-[0.6rem] tracking-[0.05em] uppercase">
            Contraste
          </div>
          <div className="font-display text-foreground mt-1 text-[2rem] leading-none">
            AAA
          </div>
          <div
            className="text-primary mt-2 inline-flex items-center rounded-full px-2 py-[0.15rem] font-mono text-[0.68rem] font-semibold"
            style={{
              background:
                "color-mix(in oklch, var(--primary), transparent 86%)",
            }}
          >
            13,79:1
          </div>
        </div>
        {/* medio: checklist */}
        <div
          data-reveal
          className="border-border bg-background absolute top-16 right-20 flex w-[11rem] flex-col gap-[0.55rem] rounded-[14px] border p-[0.95rem]"
          style={{ transform: "rotate(-4deg)", transitionDelay: "0.16s" }}
        >
          {[100, 82, 94].map((w, i) => (
            <div key={i} className="flex items-center gap-[0.55rem]">
              <span
                className="text-primary inline-flex h-[18px] w-[18px] flex-none items-center justify-center rounded-[5px]"
                style={{
                  background:
                    "color-mix(in oklch, var(--primary), transparent 86%)",
                }}
              >
                <CheckIcon />
              </span>
              <div
                className="bg-muted h-[0.32rem] rounded-full"
                style={{ width: `${w}%` }}
              />
            </div>
          ))}
        </div>
        {/* delante: anillo de foco */}
        <div
          data-reveal
          className="absolute bottom-4 left-0"
          style={{ transform: "rotate(2deg)", transitionDelay: "0.24s" }}
        >
          <div className="ring-primary ring-offset-background rounded-[13px] ring-2 ring-offset-2">
            <div className="border-border bg-background flex items-center gap-[0.6rem] rounded-[13px] border px-[1.1rem] py-[0.8rem]">
              <span className="bg-primary h-[0.55rem] w-[0.55rem] flex-none rounded-full" />
              <span className="bg-foreground h-[0.42rem] w-[5.5rem] rounded-full opacity-70" />
            </div>
          </div>
          <div className="text-muted-foreground mt-[0.55rem] pl-[0.2rem] font-mono text-[0.6rem]">
            focus · 2px
          </div>
        </div>
      </div>
      {/* móvil: solo la muestra de foco */}
      <div className="md:hidden">
        <div className="ring-primary ring-offset-background rounded-[13px] ring-2 ring-offset-2">
          <div className="border-border bg-background flex items-center gap-[0.6rem] rounded-[13px] border px-[1.1rem] py-[0.8rem]">
            <span className="bg-primary h-[0.55rem] w-[0.55rem] flex-none rounded-full" />
            <span className="bg-foreground h-[0.42rem] w-[5.5rem] rounded-full opacity-70" />
          </div>
        </div>
      </div>
    </div>
  );
}
