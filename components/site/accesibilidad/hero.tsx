import { type Dictionary } from "@/app/[lang]/dictionaries";
import { Badge } from "@/components/ui/badge";
import { CheckPill } from "@/components/ui/check-pill";
import { SectionHeader } from "@/components/ui/heading";
import { FOLD_CRUMB, FOLD_GROUP, HERO_ROW, WRAP } from "@/components/ui/layout";
import { Stat, StatRow } from "@/components/ui/stat-row";

import { Breadcrumb, type BreadcrumbDict } from "../breadcrumb";

type T = Dictionary["accesibilidad"];

/* ===================== HERO ===================== */
export function Hero({
  t,
  crumb,
  breadcrumb,
  homeHref,
}: {
  t: T["hero"];
  crumb: string;
  breadcrumb: BreadcrumbDict;
  homeHref: string;
}) {
  return (
    <section className="flex flex-col py-[clamp(1.5rem,3vw,1.75rem)] pb-[var(--section-y)] md:min-h-[calc(100svh-5rem)]">
      {/* La apertura ocupa el pliegue (P54). Misma constante que el hero de la
            home y que el deep-dive; el porqué largo, en `brand-kit/hero.tsx`.
            Medido antes: a 1920×1080 dejaba 234px de hueco por debajo, con el
            rótulo de la segunda sección asomando. Es `min-h` porque a 1280×618
            esta apertura ya desborda el pliegue y la regla no debe recortar. El
            `w-full` evita que el `mx-auto` de `WRAP` desactive el stretch. */}
      <div className={`${WRAP} flex w-full flex-1 flex-col`}>
        <div data-reveal className={FOLD_CRUMB}>
          <Breadcrumb
            routeLabel={breadcrumb.routeLabel}
            items={[
              { label: breadcrumb.home, href: homeHref },
              { label: crumb },
            ]}
          />
        </div>
        <div className={FOLD_GROUP}>
          <div className={HERO_ROW}>
            {/* `self-start` — el porqué, en `brand-kit/hero.tsx`: sin él el hueco
                breadcrumb→eyebrow lo decide el alto de la ilustración de al lado. */}
            <div className="min-w-[min(100%,18rem)] flex-[1.2_1_24rem] self-start">
              <SectionHeader
                eyebrow={t.kicker}
                title={t.title}
                level={1}
                size="page"
                reveal
              >
                <p
                  data-reveal
                  className="text-muted-foreground max-w-[46ch] text-[clamp(1.05rem,1.6vw,1.2rem)] leading-[1.6]"
                >
                  {t.lead}
                </p>
              </SectionHeader>
            </div>
            <HeroComposition />
          </div>
          {/* datos */}
          <StatRow>
            <Stat value="AA" label={t.statConformidad} />
            <Stat value="AAA" label={t.statColor} />
            <Stat value="0" label={t.statAxe} />
            <Stat value="100" label={t.statLighthouse} />
          </StatRow>
        </div>
      </div>
    </section>
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
      {/* 15rem = 240px, no 20 (320). Las tres piezas ocupaban 124, 116 y 65 de
          alto, pero estaban repartidas en 320 con SESENTA Y OCHO PÍXELES DE NADA
          entre el checklist (acababa en 174) y la muestra de foco (empezaba en
          242). Lo vio Francisco comparando las tres aperturas. No se han hecho
          las piezas más pequeñas: se han juntado. */}
      <div className="relative hidden h-60 w-[min(25rem,100%)] md:block">
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
              <CheckPill size="sm" />
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
          className="absolute top-[10.5rem] left-0"
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
