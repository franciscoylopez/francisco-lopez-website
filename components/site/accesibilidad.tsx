import { Check } from "lucide-react";

import type { Dictionary } from "@/app/[lang]/dictionaries";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { fillRatios } from "@/lib/design-values";
import type { Locale } from "@/lib/i18n/config";
import { Breadcrumb, type BreadcrumbDict } from "./breadcrumb";
import { InfoCard } from "@/components/ui/info-card";
import { CARD, SECTION, WRAP } from "@/components/ui/layout";
import { EmailCta } from "./contact-actions";
import { RelatedPages, type RelatedDict } from "./related-pages";
import { SectionHeader } from "@/components/ui/heading";

type AccesibilidadDict = Dictionary["accesibilidad"];

// Página de Accesibilidad (PRD §9, V2). Hermana de Brand Kit / Design System (D21):
// mismo lenguaje visual —hero con composición a la derecha + fila de datos, secciones
// numeradas con `SectionHeader`, encabezado grande a la izquierda y contenido a ancho
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
          <SectionHeader
            eyebrow={t.conformance.num}
            title={t.conformance.heading}
            size="section-sm"
          />
          <p className="text-muted-foreground m-0 mt-4 mb-8 max-w-[var(--measure)] text-[0.95rem] leading-[1.7]">
            {fillRatios(t.conformance.intro, lang)}
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
          <SectionHeader
            eyebrow={t.measures.num}
            title={t.measures.heading}
            size="section-sm"
          />
          <p className="text-muted-foreground m-0 mt-4 mb-8 max-w-[var(--measure)] text-[0.95rem] leading-[1.7]">
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
                    <Check className="size-[15px]" />
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
          <SectionHeader
            eyebrow={t.verify.num}
            title={t.verify.heading}
            size="section-sm"
          />
          <p className="text-muted-foreground m-0 mt-4 mb-8 max-w-[var(--measure)] text-[0.95rem] leading-[1.7]">
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
          <SectionHeader
            eyebrow={t.limits.num}
            title={t.limits.heading}
            size="section-sm"
          />
          <p className="text-muted-foreground m-0 mt-4 mb-8 max-w-[var(--measure)] text-[0.95rem] leading-[1.7]">
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
          <SectionHeader
            eyebrow={t.report.num}
            title={t.report.heading}
            size="section-sm"
          />
          <div className="mt-4 max-w-[var(--measure)]">
            <p className="text-foreground/90 m-0 text-[1.0625rem] leading-[1.7]">
              {t.report.body}
            </p>
            <EmailCta label={t.report.emailCta} showAddress className="mt-6" />
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
          <Badge tone="cyan" kind="code" className="mt-2">
            13,79:1
          </Badge>
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
                <Check className="size-[15px]" />
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
