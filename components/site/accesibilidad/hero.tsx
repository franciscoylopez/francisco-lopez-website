import { type CSSProperties } from "react";

import { type Dictionary } from "@/app/[lang]/dictionaries";
import { Badge } from "@/components/ui/badge";
import { CheckPill } from "@/components/ui/check-pill";
import { LineaEscrita, turno } from "@/components/ui/construye";
import { Stat } from "@/components/ui/stat-row";
import {
  levelOf,
  ratioOf,
  ratioText,
  type Theme,
  WCAG_TEXTO,
} from "@/lib/design-values";
import { type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

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
  lang,
}: {
  t: T["hero"];
  crumb: string;
  breadcrumb: BreadcrumbDict;
  homeHref: string;
  lang: Locale;
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
      <HeroComposition lang={lang} />
    </SystemPageOpening>
  );
}

// LA TARJETA DE CONTRASTE MEDIDO (2026-10-13). Sustituye a la de «Contraste ·
// AAA · 13,79:1», que daba la cifra sin decir qué significaba: ahora enseña el
// par («Aa» sobre el fondo), su nivel, su cifra y DÓNDE CAE en la escala de
// WCAG, de 1 a 21, con AA y AAA marcados. Elegida con `/prototype`. En móvil es
// la ficha entera, que antes era solo la muestra de foco y se quedaba pobre.
//
// LAS CIFRAS NO SE ESCRIBEN: el par es `bodyText` del censo (`CONTRAST`), los
// umbrales son `WCAG_TEXTO` —los mismos que lee `wcagLevel`— y el formato es el
// del idioma (`ratioText`: «13,79:1» en español, «13.79:1» en inglés).
//
// Y EL PAR CONMUTA CON EL TEMA (13,79 en claro, 15,32 en oscuro), así que la
// cifra y su marca en la escala se pintan las dos y elige `dark:`. La tarjeta
// de antes solo enseñaba la de claro.
const PAR = "bodyText" as const;
const TEMAS: readonly { tema: Theme; clase: string }[] = [
  { tema: "light", clase: "dark:hidden" },
  { tema: "dark", clase: "hidden dark:inline" },
];

/** La escala de WCAG, de 1 a 21, con AA, AAA y el par en su sitio. */
function Escala({
  ancho,
  i0,
  lang,
  minimo,
}: {
  ancho: number;
  i0: number;
  lang: Locale;
  /** `min-w-[Npx]` con el mismo ancho, escrito entero: le dice a
   *  `check:figuras` que este lienzo se pinta a su ancho y no se encoge. */
  minimo: string;
}) {
  const x = (r: number) => ((r - 1) / 20) * ancho;
  const cifra = (n: number, decimales: number) =>
    new Intl.NumberFormat(lang, {
      minimumFractionDigits: decimales,
      maximumFractionDigits: decimales,
    }).format(n);
  const rotulo = (
    px: number,
    texto: string,
    i: number,
    ancla: "start" | "middle" | "end",
  ) => (
    <text
      className="construye-pieza fill-muted-foreground font-mono"
      style={turno(i)}
      x={px + (ancla === "end" ? -3 : ancla === "start" ? 3 : 0)}
      y={34}
      textAnchor={ancla}
      fontSize={11}
    >
      {texto}
    </text>
  );
  return (
    <svg
      viewBox={`0 0 ${ancho} 38`}
      width={ancho}
      height={38}
      fill="none"
      overflow="visible"
      className={cn("block", minimo)}
    >
      <line
        className="construye-traza"
        pathLength={1}
        style={turno(i0)}
        x1={0}
        y1={20}
        x2={ancho}
        y2={20}
        stroke="var(--border)"
        strokeWidth={4}
        strokeLinecap="round"
      />
      {(
        [
          [WCAG_TEXTO.AA, 1, "end"],
          [WCAG_TEXTO.AAA, 0, "start"],
        ] as const
      ).map(([r, decimales, ancla], k) => (
        <g key={r}>
          <line
            className="construye-traza"
            pathLength={1}
            style={turno(i0 + 1.5 + k * 0.7)}
            x1={x(r)}
            y1={8}
            x2={x(r)}
            y2={20}
            stroke="var(--foreground)"
            strokeWidth={1}
          />
          {rotulo(x(r), cifra(r, decimales), i0 + 2 + k * 0.7, ancla)}
        </g>
      ))}
      {TEMAS.map(({ tema, clase }) => {
        const r = ratioOf(PAR, tema);
        return (
          <g key={tema} className={clase}>
            <line
              className="construye-traza"
              pathLength={1}
              style={turno(i0 + 0.5)}
              x1={0}
              y1={20}
              x2={x(r)}
              y2={20}
              stroke="var(--brand-cyan)"
              strokeWidth={4}
              strokeLinecap="round"
            />
            <line
              className="construye-traza"
              pathLength={1}
              style={turno(i0 + 3)}
              x1={x(r)}
              y1={4}
              x2={x(r)}
              y2={20}
              stroke="var(--brand-cyan)"
              strokeWidth={2}
            />
            {rotulo(x(r), cifra(r, 2), i0 + 3.5, "middle")}
          </g>
        );
      })}
    </svg>
  );
}

/** La tarjeta: compacta en el trío de escritorio, holgada como ficha móvil. */
function TarjetaContraste({
  compacta,
  lang,
}: {
  compacta: boolean;
  lang: Locale;
}) {
  return (
    <div
      className={cn(
        "flex flex-col",
        compacta ? "gap-2.5" : "h-full justify-between",
      )}
    >
      <div className={cn("flex items-center", compacta ? "gap-3" : "gap-4")}>
        <span
          className={cn(
            "construye-pieza border-foreground font-display grid flex-none place-items-center border-[1.5px] leading-[0.85] font-semibold",
            compacta
              ? "size-12 rounded-[10px] text-[28px]"
              : "size-[66px] rounded-[12px] text-[46px]",
          )}
          style={turno(0)}
        >
          Aa
        </span>
        <div className={cn("flex flex-col", compacta ? "gap-1.5" : "gap-2")}>
          <span
            className={cn(
              "construye-pieza font-display leading-[0.85] font-semibold",
              compacta ? "text-[26px]" : "text-[34px]",
            )}
            style={turno(1)}
          >
            {levelOf(PAR, "light")}
          </span>
          <span className="construye-pieza self-start" style={turno(2)}>
            <Badge tone="cyan" kind="code">
              {TEMAS.map(({ tema, clase }) => (
                <span key={tema} className={clase}>
                  {ratioText(PAR, tema, lang)}
                </span>
              ))}
            </Badge>
          </span>
        </div>
      </div>
      <Escala
        ancho={compacta ? 172 : 208}
        i0={3}
        lang={lang}
        minimo={compacta ? "min-w-[172px]" : "min-w-[208px]"}
      />
    </div>
  );
}

// La muestra de foco, la de delante en escritorio. Se construye al cargar: el
// punto y luego la línea, que se escribe. Mecanismo en `globals.css` §La ficha
// que se construye.
function MuestraFoco() {
  return (
    <div className="border-border bg-background flex items-center gap-[0.6rem] rounded-[13px] border px-[1.1rem] py-[0.8rem]">
      <span
        className="construye-pieza bg-primary h-[0.55rem] w-[0.55rem] flex-none rounded-full"
        style={turno(0)}
      />
      <LineaEscrita
        i={1}
        ancho="5.5rem"
        className="bg-foreground h-[0.42rem] rounded-full opacity-70"
      />
    </div>
  );
}

// Composición del hero (decorativa, aria-hidden): tres piezas que ilustran de
// qué habla la página —el contraste medido, una checklist con marcas y una
// muestra del anillo de foco de 2px—, con el tratamiento de capas rotadas de
// las otras aperturas.
//
// EN DIAGONAL desde que la tarjeta de contraste es más ancha (13,5rem): arriba a
// la derecha, el checklist a la izquierda y el foco abajo a la derecha. En la
// disposición de antes el checklist y el foco la tapaban.
//
// Y EN CASCADA: cada tarjeta entra cuando la anterior casi ha terminado de
// construirse (0,04 · 0,55 · 1,05 s), no las tres a la vez como antes (0,08 ·
// 0,16 · 0,24). Lo pidió Francisco al verlo. Con movimiento reducido los
// retardos se anulan (`.entrada-pliegue`, D136), así que esa versión no espera.
function HeroComposition({ lang }: { lang: Locale }) {
  return (
    <div
      aria-hidden="true"
      className="flex flex-[1_1_24rem] items-center justify-center"
    >
      {/* desktop */}
      <div className="relative hidden h-60 w-[min(25rem,100%)] md:block">
        {/* arriba a la derecha: el contraste medido */}
        <div
          className="entrada-pliegue construye-fondo border-border bg-background absolute top-0 right-0 w-[13.5rem] rounded-[14px] border p-[0.9rem]"
          style={
            { rotate: "5deg", "--retardo-entrada": "0.04s" } as CSSProperties
          }
        >
          <TarjetaContraste compacta lang={lang} />
        </div>
        {/* a la izquierda: checklist */}
        <div
          className="entrada-pliegue construye-fondo border-border bg-background absolute top-[5.25rem] left-0 flex w-[11rem] flex-col gap-[0.55rem] rounded-[14px] border p-[0.95rem]"
          style={
            { rotate: "-4deg", "--retardo-entrada": "0.55s" } as CSSProperties
          }
        >
          {[100, 82, 94].map((w, i) => (
            <div key={i} className="flex items-center gap-[0.55rem]">
              <span className="construye-pieza" style={turno(i * 2)}>
                <CheckPill size="sm" />
              </span>
              <LineaEscrita
                i={i * 2 + 1}
                ancho={`${w}%`}
                className="bg-muted h-[0.32rem] rounded-full"
              />
            </div>
          ))}
        </div>
        {/* abajo a la derecha: anillo de foco */}
        <div
          className="entrada-pliegue absolute top-[11rem] right-6"
          style={
            { rotate: "2deg", "--retardo-entrada": "1.05s" } as CSSProperties
          }
        >
          <div className="ring-primary ring-offset-background rounded-[13px] ring-2 ring-offset-2">
            <MuestraFoco />
          </div>
          <div
            className="construye-pieza text-muted-foreground mt-[0.55rem] pl-[0.2rem] font-mono text-[0.6rem]"
            style={turno(2)}
          >
            focus · 2px
          </div>
        </div>
      </div>
      {/* móvil: la tarjeta de contraste, holgada, como ficha entera */}
      <div className="md:hidden">
        <div className="entrada-pliegue border-foreground bg-background h-[11rem] w-[15rem] rounded-[14px] border px-4 py-3.5">
          <TarjetaContraste compacta={false} lang={lang} />
        </div>
      </div>
    </div>
  );
}
