import { type Dictionary } from "@/app/[lang]/dictionaries";
import { LineaEscrita, turno } from "@/components/ui/construye";
import { titleVariants } from "@/components/ui/heading";
import { Stat } from "@/components/ui/stat-row";
import {
  BREAKPOINT_COUNT,
  BREAKPOINTS,
  CONTAINER_PX,
  MEASURE_REM,
  SPACING_SCALE,
} from "@/lib/design-values";
import { cn } from "@/lib/utils";

import { type BreadcrumbDict } from "../breadcrumb";
import { SystemPageOpening } from "../system-page-opening";

/* ===================== HERO ===================== */
// LA HOJA DE ESPECIFICACIÓN, ACOTADA (2026-10-13). Sustituye a las tres
// maquetas con rejilla, que se leían como un wireframe cualquiera. Elegida con
// `/prototype` frente a una pieza despiezada y a la rejilla con bloques: una
// ficha con las escalas reales del sistema —la tipográfica, la de espaciado y
// los radios— y, fuera de ella, sus cotas en morado, que es lo que la separa de
// la retícula del Brand Kit sin dejar de ser de la misma familia.
//
// EL MORADO DE LAS COTAS ES UNA EXCEPCIÓN DECIDIDA, no un descuido: está
// escrita con fecha en `BRAND.md` §El morado decorativo no vale como elemento
// gráfico. La cifra que se lee va en `text-muted-foreground`; la línea solo
// dibuja.
//
// LAS CIFRAS NO SE ESCRIBEN. La tipográfica sale del techo de cada `clamp` de
// `titleVariants`; la de espaciado, de `SPACING_SCALE`; los radios son las
// utilidades reales (`rounded-sm`…`rounded-xl`), y las cotas, del tamaño con el
// que se dibuja la propia ficha.
//
// SE CONSTRUYE AL CARGAR: los peldaños «Aa», las barras de espaciado que se
// escriben, los radios y, al final, las cotas. Mecanismo en `globals.css`
// §La ficha que se construye.

/** El techo de un titular, en px: el tercer término de su `clamp`. */
function techo(size: "page" | "section" | "sub" | "card") {
  const m = /clamp\([^,]+,[^,]+,([\d.]+)rem\)/.exec(titleVariants({ size }));
  return m ? Number(m[1]) * 16 : 0;
}
const TIPO = (["page", "section", "sub", "card"] as const).map(techo);

/** Las clases escritas enteras: Tailwind no ve una clase interpolada. */
const RADIOS = [
  ["sm", "rounded-sm"],
  ["md", "rounded-md"],
  ["lg", "rounded-lg"],
  ["xl", "rounded-xl"],
] as const;

/** Turno de la primera cota: van al final, con la ficha ya construida. */
const T_COTAS = 13;

/** Las cotas de la ficha, por fuera: su ancho arriba y su alto a la derecha. */
function Cotas({
  ancho,
  alto,
  minimo,
}: {
  ancho: number;
  alto: number;
  /** `min-w-[Npx]` del lienzo de las cotas (ancho + 68), escrito entero: le
   *  dice a `check:figuras` que se pinta a su ancho y no se encoge. */
  minimo: string;
}) {
  const M = 34;
  const y = -14;
  const x = ancho + 14;
  type Punto = readonly [number, number];
  const linea = (
    [x1, y1]: Punto,
    [x2, y2]: Punto,
    i: number,
    tenue = false,
  ) => (
    <line
      className="construye-traza"
      pathLength={1}
      style={turno(i)}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="var(--brand-purple)"
      strokeOpacity={tenue ? 0.6 : 1}
      strokeWidth={1}
    />
  );
  return (
    <svg
      viewBox={`${-M} ${-M} ${ancho + 2 * M} ${alto + 2 * M}`}
      width={ancho + 2 * M}
      height={alto + 2 * M}
      fill="none"
      className={cn("pointer-events-none absolute z-[1]", minimo)}
      style={{ left: -M, top: -M }}
    >
      {/* el ancho: líneas de referencia, la cota y sus topes oblicuos */}
      {linea([0, -4], [0, y - 6], T_COTAS, true)}
      {linea([ancho, -4], [ancho, y - 6], T_COTAS, true)}
      {linea([0, y], [ancho, y], T_COTAS + 0.5)}
      {linea([-4, y + 4], [4, y - 4], T_COTAS + 0.5)}
      {linea([ancho - 4, y + 4], [ancho + 4, y - 4], T_COTAS + 0.5)}
      <text
        className="construye-pieza fill-muted-foreground font-mono"
        style={turno(T_COTAS + 1)}
        x={ancho / 2}
        y={y - 6}
        textAnchor="middle"
        fontSize={11}
      >
        {ancho}
      </text>
      {/* el alto */}
      {linea([ancho + 4, 0], [x + 6, 0], T_COTAS + 1.5, true)}
      {linea([ancho + 4, alto], [x + 6, alto], T_COTAS + 1.5, true)}
      {linea([x, 0], [x, alto], T_COTAS + 2)}
      {linea([x - 4, 4], [x + 4, -4], T_COTAS + 2)}
      {linea([x - 4, alto + 4], [x + 4, alto - 4], T_COTAS + 2)}
      {/* El giro va en un grupo: en el texto, el `transform-box: fill-box`
          de las piezas reinterpretaría el centro del `rotate`. */}
      <g transform={`rotate(90 ${x + 6} ${alto / 2})`}>
        <text
          className="construye-pieza fill-muted-foreground font-mono"
          style={turno(T_COTAS + 2.5)}
          x={x + 6}
          y={alto / 2}
          textAnchor="middle"
          fontSize={11}
        >
          {alto}
        </text>
      </g>
    </svg>
  );
}

/**
 * La ficha a su tamaño. `completa` es la de escritorio: el peldaño de 80, la
 * escala de espaciado entera y las etiquetas que en móvil no caben.
 */
function Ficha({
  ancho,
  alto,
  completa,
  minimo,
}: {
  ancho: number;
  alto: number;
  completa: boolean;
  minimo: string;
}) {
  const tipo = completa ? TIPO : TIPO.slice(1);
  const espacio = completa ? SPACING_SCALE : SPACING_SCALE.slice(0, 7);
  return (
    <div className="relative" style={{ width: ancho, height: alto }}>
      <div
        className={cn(
          "entrada-pliegue border-foreground bg-background relative z-[2] grid h-full grid-cols-[auto_1fr] grid-rows-[1fr_auto] overflow-hidden rounded-[14px] border",
          completa
            ? "gap-x-[26px] gap-y-3 px-5 py-3"
            : "gap-x-[18px] gap-y-[10px] px-4 py-[14px]",
        )}
      >
        <div
          className={cn(
            "flex flex-col justify-center",
            completa ? "gap-2" : "gap-1.5",
          )}
        >
          {tipo.map((px, k) => (
            <div key={px} className="flex items-baseline gap-2">
              <span
                className="construye-pieza font-display leading-[0.9] font-semibold"
                style={{
                  ...turno(k),
                  fontSize: Math.round(px * (completa ? 0.5 : 0.42)),
                }}
              >
                Aa
              </span>
              <LineaEscrita
                i={k + 0.5}
                className="text-muted-foreground font-mono text-[11px] leading-none"
              >
                {px}
              </LineaEscrita>
            </div>
          ))}
        </div>
        <div
          className={cn(
            "flex flex-col justify-center",
            completa ? "gap-[3px]" : "gap-[5px]",
          )}
        >
          {espacio.map(({ name, px }, k) => (
            <div key={name} className="flex items-center gap-2">
              <LineaEscrita
                i={4 + k * 0.6}
                ancho={`${Math.round(px * (completa ? 0.78 : 0.62))}px`}
                className="bg-brand-cyan h-[5px] rounded-[2px]"
              />
              {completa && (
                <span
                  className="construye-pieza text-muted-foreground font-mono text-[11px] leading-none"
                  style={turno(4.3 + k * 0.6)}
                >
                  {px}
                </span>
              )}
            </div>
          ))}
        </div>
        <div
          className={cn(
            "border-border col-span-full flex border-t pt-2",
            completa ? "gap-[22px]" : "gap-[14px]",
          )}
        >
          {RADIOS.map(([nombre, clase], k) => (
            <div key={nombre} className="flex items-center gap-1.5">
              <span
                className={cn(
                  "construye-pieza border-foreground border-[1.5px]",
                  clase,
                  completa ? "size-6" : "size-[22px]",
                )}
                style={turno(10 + k)}
              />
              {completa && (
                <LineaEscrita
                  i={10.5 + k}
                  className="text-muted-foreground font-mono text-[11px] leading-none"
                >
                  {nombre}
                </LineaEscrita>
              )}
            </div>
          ))}
        </div>
      </div>
      <Cotas ancho={ancho} alto={alto} minimo={minimo} />
    </div>
  );
}

// Composición decorativa. En móvil, `pt-8` deja sitio a la cota de arriba, que
// sale de la ficha, y `overflow-x-clip` impide que la de la derecha desborde la
// página a 320px. El `pr-7` de la ficha móvil centra la ficha CON su cota de la
// derecha (~26px fuera de ella), no la ficha sola: centrada sola, a 320 la cota
// caía en x=297-310 y el clip se la comía.
function HeroComposition() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-[1_1_26rem] items-center justify-center pt-8 max-md:overflow-x-clip md:pt-0"
    >
      <div className="pr-7 md:hidden">
        <Ficha ancho={240} alto={176} completa={false} minimo="min-w-[308px]" />
      </div>
      <div className="hidden md:block">
        <Ficha ancho={336} alto={224} completa minimo="min-w-[404px]" />
      </div>
    </div>
  );
}

// El esqueleto —pliegue, breadcrumb, grupo centrado, fila de texto y fila de
// datos— lo pone `SystemPageOpening`, compartido con Brand Kit y Accesibilidad.
// Ahí está el porqué de cada pieza y la invariante que protege (P63.5).
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
    <SystemPageOpening
      crumb={crumb}
      breadcrumb={breadcrumb}
      homeHref={homeHref}
      eyebrow={t.kicker}
      title={t.title}
      lead={t.lead}
      leadMeasure="max-w-[44ch]"
      stats={
        <>
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
        </>
      }
    >
      <HeroComposition />
    </SystemPageOpening>
  );
}
