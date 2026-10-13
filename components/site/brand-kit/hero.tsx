import { type CSSProperties } from "react";

import { type Dictionary } from "@/app/[lang]/dictionaries";
import { turno } from "@/components/ui/construye";
import { MONOGRAMA } from "@/components/ui/logo";
import { Stat } from "@/components/ui/stat-row";
import {
  COLOR_TOKEN_COUNT,
  SPLIT_MIN_PX,
  TYPE_FAMILIES,
} from "@/lib/design-values";
import { cn } from "@/lib/utils";

import { type BreadcrumbDict } from "../breadcrumb";
import { SystemPageOpening } from "../system-page-opening";
import { Glyph } from "./shared";

/* ===================== HERO ===================== */
// LA RETÍCULA DE CONSTRUCCIÓN (2026-10-13). Sustituye al navegador con su nav,
// que se leía como «una web» y no como «una marca». Elegida con `/prototype`
// frente a una hoja de marca y a la escala del logo: el monograma se dibuja
// sobre su retícula y salen las cotas de su geometría real. Las dos tarjetas
// pastel de antes se quedan como flancos, ahora también en móvil.
//
// LAS COTAS NO SE ESCRIBEN: se derivan de `MONOGRAMA` (`ui/logo.tsx`). Si el
// logo cambia, el dibujo y sus cifras cambian con él.
//
// SE CONSTRUYE AL CARGAR: la retícula se traza de fondo a medio paso, se marca
// el centro, el aro se traza, aparece la base, el split se abre y salen las
// cotas. Mecanismo en `globals.css` §La ficha que se construye, incluidos los
// dos gestos del dibujo (`construye-traza` y `construye-abre`).
const M = MONOGRAMA;
const ARRIBA = M.cy - M.r - M.trazo / 2;
const ABAJO = M.base.y + M.base.h;
const ALTO = ABAJO - ARRIBA;

/** Turno de la primera pieza del monograma: la retícula va antes, de fondo. */
const T0 = 6;

function Cota({
  x1,
  y1,
  x2,
  y2,
  i,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  i: number;
}) {
  return (
    <line
      className="construye-traza"
      pathLength={1}
      style={turno(i)}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="var(--brand-cyan)"
      strokeWidth={1}
    />
  );
}

/** Los dos topes de una cota, perpendiculares a ella. */
function Topes({
  a,
  b,
  en,
  horizontal,
  i,
}: {
  a: number;
  b: number;
  en: number;
  horizontal: boolean;
  i: number;
}) {
  return (
    <>
      {[a, b].map((p) =>
        horizontal ? (
          <Cota key={p} x1={p} y1={en - 4} x2={p} y2={en + 4} i={i} />
        ) : (
          <Cota key={p} x1={en - 4} y1={p} x2={en + 4} y2={p} i={i} />
        ),
      )}
    </>
  );
}

function Rotulo({
  x,
  y,
  i,
  ancla = "middle",
  children,
}: {
  x: number;
  y: number;
  i: number;
  ancla?: "start" | "middle" | "end";
  children: number | string;
}) {
  return (
    <text
      className="construye-pieza fill-muted-foreground font-mono"
      style={turno(i)}
      x={x}
      y={y}
      textAnchor={ancla}
      fontSize={11}
    >
      {children}
    </text>
  );
}

/**
 * La retícula a la medida de su ficha. Se dibuja en píxeles reales (el
 * `viewBox` mide lo que la ficha), así que los rótulos se pintan a 11px en
 * cualquier ancho (DoD, fila 11). `completa` añade la cota del trazo, que en la
 * ficha móvil no cabe sin pisar el aro.
 */
function Reticula({
  ancho,
  alto,
  completa,
}: {
  ancho: number;
  alto: number;
  completa: boolean;
}) {
  const k = (alto - 58) / ALTO;
  const cx = ancho / 2 + 10;
  const X = (x: number) => cx + (x - M.cx) * k;
  const Y = (y: number) => 20 + (y - ARRIBA) * k;
  const paso = completa ? 20 : 16;

  const lineas: [number, number, number, number][] = [];
  for (let x = paso; x < ancho; x += paso) lineas.push([x, alto, x, 0]);
  for (let y = paso; y < alto; y += paso) lineas.push([0, y, ancho, y]);

  const c = { x: X(M.cx), y: Y(M.cy) };
  const r = M.r * k;
  const trazo = M.trazo * k;
  const baseIzq = X(M.base.x);
  const baseDer = X(M.base.x + M.base.w);
  const arriba = Y(ARRIBA);
  const abajo = Y(ABAJO);
  const yBase = abajo + (completa ? 14 : 12);
  const xAlto = X(M.cx - M.r - M.trazo / 2) - (completa ? 26 : 18);
  const xTrazo = c.x - r - trazo / 2;

  return (
    <svg
      viewBox={`0 0 ${ancho} ${alto}`}
      width={ancho}
      height={alto}
      fill="none"
      className="block"
    >
      <g className="construye-fondo" stroke="var(--border)" strokeWidth={1}>
        {lineas.map(([x1, y1, x2, y2], n) => (
          <line
            key={n}
            className="construye-traza"
            pathLength={1}
            style={turno(n * 0.25)}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
          />
        ))}
      </g>

      {/* El split, detrás del aro: cada capa sale de su centro hacia su sitio,
          así que su camino es el inverso de su desplazamiento. */}
      {(
        [
          ["var(--brand-cyan-split)", M.cian],
          ["var(--brand-purple-split)", M.morado],
        ] as const
      ).map(([color, d]) => (
        <circle
          key={color}
          className="construye-abre"
          style={
            {
              ...turno(T0 + 3),
              "--dx": `${-d.dx * k}px`,
              "--dy": `${-d.dy * k}px`,
            } as CSSProperties
          }
          cx={X(M.cx + d.dx)}
          cy={Y(M.cy + d.dy)}
          r={r}
          stroke={color}
          strokeWidth={trazo}
        />
      ))}
      {/* El aro se traza desde las doce. */}
      <circle
        className="construye-traza"
        pathLength={1}
        transform={`rotate(-90 ${c.x} ${c.y})`}
        style={turno(T0 + 1)}
        cx={c.x}
        cy={c.y}
        r={r}
        stroke="var(--foreground)"
        strokeWidth={trazo}
      />
      <rect
        className="construye-pieza"
        style={turno(T0 + 2)}
        x={baseIzq}
        y={Y(M.base.y)}
        width={M.base.w * k}
        height={M.base.h * k}
        rx={M.base.rx * k}
        fill="var(--foreground)"
      />

      {/* el centro */}
      <Cota x1={c.x - 6} y1={c.y} x2={c.x + 6} y2={c.y} i={T0} />
      <Cota x1={c.x} y1={c.y - 6} x2={c.x} y2={c.y + 6} i={T0} />
      {/* el radio */}
      <Cota x1={c.x} y1={c.y} x2={c.x + r} y2={c.y} i={T0 + 4} />
      <Rotulo x={c.x + r / 2} y={c.y - 6} i={T0 + 4.5}>
        {`r ${M.r}`}
      </Rotulo>
      {/* la base */}
      <Cota x1={baseIzq} y1={yBase} x2={baseDer} y2={yBase} i={T0 + 5} />
      <Topes a={baseIzq} b={baseDer} en={yBase} horizontal i={T0 + 5} />
      <Rotulo x={(baseIzq + baseDer) / 2} y={yBase + 13} i={T0 + 5.5}>
        {M.base.w}
      </Rotulo>
      {/* el alto */}
      <Cota x1={xAlto} y1={arriba} x2={xAlto} y2={abajo} i={T0 + 6} />
      <Topes a={arriba} b={abajo} en={xAlto} horizontal={false} i={T0 + 6} />
      <Rotulo
        x={xAlto - 6}
        y={(arriba + abajo) / 2 + 4}
        i={T0 + 6.5}
        ancla="end"
      >
        {ALTO}
      </Rotulo>
      {/* el trazo, solo en la ficha de escritorio */}
      {completa && (
        <>
          <Cota x1={xTrazo} y1={c.y} x2={xTrazo + trazo} y2={c.y} i={T0 + 7} />
          <Topes a={xTrazo} b={xTrazo + trazo} en={c.y} horizontal i={T0 + 7} />
          <Rotulo x={xTrazo - 5} y={c.y - 6} i={T0 + 7.5} ancla="end">
            {M.trazo}
          </Rotulo>
        </>
      )}
    </svg>
  );
}

/** Las dos tarjetas pastel de detrás, con el glifo plano. Entran con su
 *  retardo y su glifo aparece a medio paso, como una ficha de fondo. */
function Flanco({ lado }: { lado: "izq" | "der" }) {
  const izq = lado === "izq";
  return (
    <div
      className={cn(
        "entrada-pliegue construye-fondo absolute top-1/2 z-[1] -translate-y-1/2",
        izq
          ? "left-[-1.7rem] md:left-[-2.75rem]"
          : "right-[-1.7rem] md:right-[-2.75rem]",
      )}
      style={{ "--retardo-entrada": izq ? "0.08s" : "0.16s" } as CSSProperties}
    >
      <div
        className={cn(
          "flex h-[6.6rem] w-[4.6rem] items-center justify-center rounded-[10px] md:h-[10.5rem] md:w-[7.5rem] md:rounded-xl",
          izq ? "bg-brand-cyan-soft" : "bg-brand-purple-soft",
        )}
        style={{ transform: `rotate(${izq ? -6 : 6}deg)` }}
      >
        <span className="construye-pieza block md:hidden" style={turno(0)}>
          <Glyph variant="flat" h={20} />
        </span>
        <span className="construye-pieza hidden md:block" style={turno(0)}>
          <Glyph variant="flat" h={27} />
        </span>
      </div>
    </div>
  );
}

// El esqueleto —pliegue, breadcrumb, grupo centrado, fila de texto y fila de
// datos— lo pone `SystemPageOpening`, compartido con Design System y
// Accesibilidad. Ahí está el porqué de cada pieza y la invariante que protege:
// las tres aperturas centran su grupo en el pliegue, y centrar solo es seguro
// mientras los tres midan lo mismo (P63.5).
export function Hero({
  t,
  crumb,
  breadcrumb,
  homeHref,
}: {
  t: Dictionary["brandKit"]["hero"];
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
      leadMeasure="max-w-[40ch]"
      /* Fila de datos (P54.3). Las otras dos páginas que documentan el sistema
         —Design System y Accesibilidad— abrían con su resumen en cifras y esta
         no, siendo de la misma familia. Los VALORES salen de
         `lib/design-values.ts` (D38): el diccionario solo trae la etiqueta, así
         que la cifra publicada y la del sistema no pueden divergir. El recuento
         de color se DERIVA de las dos capas de la paleta, y el umbral del split
         es el mismo valor con el que la sección del logotipo decide qué
         peldaños funcionan. */
      stats={
        <>
          <Stat value={String(COLOR_TOKEN_COUNT)} label={t.statColor} />
          <Stat value={String(TYPE_FAMILIES.length)} label={t.statTipografia} />
          <Stat value={String(SPLIT_MIN_PX)} unit="px" label={t.statSplit} />
          <Stat value="AA→AAA" label={t.statA11y} />
        </>
      }
    >
      {/* Composición decorativa: la retícula de construcción con sus flancos.
          `max-md:overflow-x-clip` porque en móvil los flancos sobresalen de la
          ficha y a 320px desbordarían la página: se recorta el borde de la
          tarjeta pastel, nunca la página. */}
      <div
        aria-hidden="true"
        className="flex flex-[1_1_26rem] items-center justify-center max-md:overflow-x-clip"
      >
        <div className="relative">
          <Flanco lado="izq" />
          <Flanco lado="der" />
          <div className="entrada-pliegue border-foreground bg-background relative z-[2] overflow-hidden rounded-[14px] border">
            <div className="md:hidden">
              <Reticula ancho={240} alto={176} completa={false} />
            </div>
            <div className="hidden md:block">
              <Reticula ancho={336} alto={224} completa />
            </div>
          </div>
        </div>
      </div>
    </SystemPageOpening>
  );
}
