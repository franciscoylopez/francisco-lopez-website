import { type CSSProperties } from "react";

import { type Dictionary } from "@/app/[lang]/dictionaries";
import { Badge } from "@/components/ui/badge";
import { CheckPill } from "@/components/ui/check-pill";
import { Stat } from "@/components/ui/stat-row";

import { type BreadcrumbDict } from "../breadcrumb";
import { SystemPageOpening } from "../system-page-opening";

type T = Dictionary["accesibilidad"];

/* ===================== HERO ===================== */
// El esqueleto —pliegue, breadcrumb, grupo centrado, fila de texto y fila de
// datos— lo pone `SystemPageOpening`, compartido con Brand Kit y Design System.
// Ahí está el porqué de cada pieza y la invariante que protege (P63.5).
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
    <SystemPageOpening
      crumb={crumb}
      breadcrumb={breadcrumb}
      homeHref={homeHref}
      eyebrow={t.kicker}
      title={t.title}
      lead={t.lead}
      leadMeasure="max-w-[46ch]"
      stats={
        <>
          <Stat value="AA" label={t.statConformidad} />
          <Stat value="AAA" label={t.statColor} />
          <Stat value="0" label={t.statAxe} />
          <Stat value="100" label={t.statLighthouse} />
        </>
      }
    >
      <HeroComposition />
    </SystemPageOpening>
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
          className="entrada-pliegue border-border bg-background absolute top-0 right-2 w-[9.5rem] rounded-[14px] border p-[0.9rem]"
          style={
            { rotate: "6deg", "--retardo-entrada": "0.08s" } as CSSProperties
          }
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
          className="entrada-pliegue border-border bg-background absolute top-16 right-20 flex w-[11rem] flex-col gap-[0.55rem] rounded-[14px] border p-[0.95rem]"
          style={
            { rotate: "-4deg", "--retardo-entrada": "0.16s" } as CSSProperties
          }
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
          className="entrada-pliegue absolute top-[10.5rem] left-0"
          style={
            { rotate: "2deg", "--retardo-entrada": "0.24s" } as CSSProperties
          }
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
        <div className="entrada-pliegue ring-primary ring-offset-background rounded-[13px] ring-2 ring-offset-2">
          <div className="border-border bg-background flex items-center gap-[0.6rem] rounded-[13px] border px-[1.1rem] py-[0.8rem]">
            <span className="bg-primary h-[0.55rem] w-[0.55rem] flex-none rounded-full" />
            <span className="bg-foreground h-[0.42rem] w-[5.5rem] rounded-full opacity-70" />
          </div>
        </div>
      </div>
    </div>
  );
}
