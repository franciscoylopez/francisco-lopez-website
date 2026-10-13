import { type CSSProperties } from "react";

import { type Dictionary } from "@/app/[lang]/dictionaries";
import { LineaEscrita, turno } from "@/components/ui/construye";
import { Stat } from "@/components/ui/stat-row";
import {
  BREAKPOINT_COUNT,
  BREAKPOINTS,
  CONTAINER_PX,
  MEASURE_REM,
} from "@/lib/design-values";
import { cn } from "@/lib/utils";

import { type BreadcrumbDict } from "../breadcrumb";
import { SystemPageOpening } from "../system-page-opening";

/* ===================== HERO ===================== */
// LO DE DENTRO DE CADA MARCO SE CONSTRUYE AL CARGAR (2026-10-13): primero las
// doce columnas de la rejilla, a medio paso, luego el titular y las líneas. El
// `i` de cada pieza es su turno; el reloj lo pone el marco. Mecanismo en
// `globals.css` §La ficha que se construye.

/** El marco del frente, el mismo en escritorio y en móvil salvo cuántas líneas
 *  lleva cada columna y cuánto mide la segunda. */
function MarcoRejilla({ anchos }: { anchos: string[] }) {
  return (
    <>
      <div className="absolute inset-[0.6rem] grid grid-cols-12 gap-[2px]">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="construye-barra bg-brand-cyan-soft rounded-[1px]"
            style={turno(i * 0.5)}
          />
        ))}
      </div>
      <div className="relative flex flex-col gap-[0.6rem] p-[0.8rem]">
        <LineaEscrita
          i={6}
          ancho="45%"
          className="bg-foreground h-[0.55rem] rounded-full"
        />
        <div className="grid grid-cols-2 gap-[0.7rem]">
          {[0, 1].map((col) => (
            <div key={col} className="flex flex-col gap-[0.4rem]">
              {anchos.map((ancho, k) => (
                <LineaEscrita
                  key={k}
                  i={7 + col * anchos.length + k}
                  ancho={ancho}
                  className="bg-foreground h-[0.32rem] rounded-full opacity-55"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
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
      {/* 17rem = 272px, no 20 (320). Aquí NO había hueco muerto —los tres
          marcos se solapaban de forma continua— así que compactar es solaparlos
          un poco más: el segundo sube de top-12 a top-8. El motivo es el mismo
          que en Accesibilidad: mientras la ilustración sea más alta que la
          columna de texto, es ELLA la que decide dónde cae la fila de datos, y
          entonces cada página la pone a una altura distinta. */}
      <div className="relative hidden h-[17rem] w-[min(25rem,100%)] md:block">
        <div
          className="entrada-pliegue construye-fondo border-border bg-background absolute top-0 right-4 flex h-[12.5rem] w-[6.5rem] flex-col gap-[0.4rem] rounded-[12px] border p-[0.7rem]"
          style={
            { rotate: "6deg", "--retardo-entrada": "0.08s" } as CSSProperties
          }
        >
          {["60%", "100%", "92%", "97%", "88%"].map((w, i) => (
            <LineaEscrita
              key={i}
              i={i}
              ancho={w}
              className={cn(
                "bg-muted rounded-full",
                i === 0 ? "h-[0.4rem]" : "h-[0.3rem]",
              )}
            />
          ))}
        </div>
        <div
          className="entrada-pliegue construye-fondo border-border bg-background absolute top-8 right-10 h-56 w-44 rounded-[14px] border p-[0.85rem]"
          style={
            { rotate: "-4deg", "--retardo-entrada": "0.16s" } as CSSProperties
          }
        >
          <LineaEscrita
            i={0}
            ancho="45%"
            caja="mb-[0.55rem]"
            className="bg-muted h-[0.5rem] rounded-full"
          />
          <div className="grid grid-cols-2 gap-[0.55rem]">
            {[0, 1].map((col) => (
              <div key={col} className="flex flex-col gap-[0.35rem]">
                {["100%", "85%", "100%"].map((w, k) => (
                  <LineaEscrita
                    key={k}
                    i={1 + col * 3 + k}
                    ancho={w}
                    className="bg-muted h-[0.3rem] rounded-full"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div
          className="entrada-pliegue border-foreground bg-background absolute bottom-2 left-0 h-[11.5rem] w-[15.5rem] overflow-hidden rounded-[14px] border"
          style={
            { rotate: "2deg", "--retardo-entrada": "0.24s" } as CSSProperties
          }
        >
          <MarcoRejilla anchos={["100%", "85%", "100%"]} />
        </div>
      </div>
      {/* mobile */}
      <div className="relative mx-auto h-[11.5rem] w-[min(16rem,100%)] md:hidden">
        <div className="entrada-pliegue border-foreground bg-background absolute inset-0 overflow-hidden rounded-[14px] border">
          <MarcoRejilla anchos={["100%", "80%"]} />
        </div>
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
