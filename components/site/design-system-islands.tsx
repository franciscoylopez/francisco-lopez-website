"use client";

import { useRef, useState } from "react";

import { actionVariants } from "@/components/ui/action";
import { cn } from "@/lib/utils";

import { PANEL } from "@/components/ui/layout";

// Las tres piezas interactivas del Design System (D7: JS solo en islas). El resto
// de la página es Server Component.

const COLS = Array.from({ length: 12 });

// (01) Rejilla — botón que conmuta la franja de 12 columnas sobre la maqueta.
export function GridDemo({
  num,
  title,
  showLabel,
  hideLabel,
  lead,
  baseLabel,
  baseVal,
  gutterLabel,
  gutterVal,
  hint,
}: {
  num: string;
  title: string;
  showLabel: string;
  hideLabel: string;
  lead: string;
  baseLabel: string;
  baseVal: string;
  gutterLabel: string;
  gutterVal: string;
  hint: string;
}) {
  const [show, setShow] = useState(true);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="flex items-baseline gap-4">
          <span className="text-muted-foreground font-mono text-[0.8rem]">
            {num}
          </span>
          <h2 className="font-display m-0 text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.02em]">
            {title}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-pressed={show}
          // El relleno pleno de primary ya significa «activo» (aria-pressed): el
          // hover del estado apagado usa un tinte, no el relleno, para no leerse
          // como seleccionado bajo el cursor. Lo resuelve la variante `toggle`.
          className={actionVariants({
            variant: "toggle-primary",
            on: show,
            size: "sm",
          })}
        >
          <span
            aria-hidden="true"
            className="inline-block h-[13px] w-[13px] rounded-[2px] border border-current"
            style={{
              background:
                "repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 4px)",
            }}
          />
          {show ? hideLabel : showLabel}
        </button>
      </div>
      <p className="text-muted-foreground m-0 mb-10 max-w-[var(--measure)] text-[0.95rem]">
        {lead}
      </p>
      <div className={cn(PANEL, "relative")}>
        <div className="px-[var(--page-x)] py-10">
          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 grid grid-cols-12 gap-[var(--gutter)] transition-opacity duration-300"
              style={{ opacity: show ? 1 : 0 }}
            >
              {COLS.map((_, i) => (
                <div
                  key={i}
                  className="rounded-[3px]"
                  style={{
                    background:
                      "color-mix(in oklch, var(--primary), transparent 88%)",
                  }}
                />
              ))}
            </div>
            <div className="relative flex flex-col gap-[1.1rem]">
              <div className="bg-muted h-[2.6rem] w-[min(100%,22rem)] rounded-md" />
              <div className="flex max-w-[var(--measure)] flex-col gap-[0.6rem]">
                <div className="bg-muted h-[0.85rem] rounded-full" />
                <div className="bg-muted h-[0.85rem] rounded-full" />
                <div className="bg-muted h-[0.85rem] w-[70%] rounded-full" />
              </div>
              <div className="mt-[0.6rem] grid [grid-template-columns:repeat(auto-fill,minmax(min(100%,13rem),1fr))] gap-[var(--gutter)]">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="border-border bg-background h-24 rounded-lg border"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="border-border text-muted-foreground flex flex-wrap gap-x-6 gap-y-2 border-t px-[var(--page-x)] py-3 text-[0.78rem]">
          <span>
            {baseLabel}{" "}
            <strong className="text-foreground font-semibold">{baseVal}</strong>
          </span>
          <span>
            {gutterLabel}{" "}
            <strong className="text-foreground font-semibold">
              {gutterVal}
            </strong>
          </span>
          <span>{hint}</span>
        </div>
      </div>
    </>
  );
}

// (07) Demo de scroll-reveal — botón que reproduce la animación fade-up.
export function RevealDemo({
  demoLabel,
  replayLabel,
}: {
  demoLabel: string;
  replayLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const replay = () => {
    const demo = ref.current;
    if (!demo) return;
    const items = demo.querySelectorAll<HTMLElement>(".demo-item");
    items.forEach((el, i) => {
      el.style.transition = "none";
      el.style.opacity = "0";
      el.style.transform = "translateY(12px)";
      void el.offsetWidth;
      el.style.transition =
        "opacity .5s cubic-bezier(.4,0,.2,1), transform .5s cubic-bezier(.4,0,.2,1)";
      el.style.transitionDelay = `${i * 90}ms`;
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  };

  return (
    <div className={cn(PANEL, "p-6")}>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-muted-foreground text-[0.8rem]">{demoLabel}</span>
        <button
          type="button"
          onClick={replay}
          className={actionVariants({ variant: "outline-neutral", size: "sm" })}
        >
          {replayLabel}
        </button>
      </div>
      <div ref={ref} className="flex flex-col gap-[0.6rem]">
        <div className="demo-item bg-muted h-[2.2rem] rounded-md" />
        <div className="demo-item bg-muted h-[2.2rem] w-[85%] rounded-md" />
        <div className="demo-item bg-muted h-[2.2rem] w-[70%] rounded-md" />
      </div>
    </div>
  );
}

type SkeletonRow = { idx: string; name: string; h: string };

// (09) Esqueleto navegable — tabs de dispositivo que reencuadran la maqueta. Los
// controles se ocultan <md por CSS (no pueden demostrar nada en móvil); ahí el
// marco cae a ancho completo.
export function DevicePreview({
  groupLabel,
  devFull,
  devTablet,
  devMobile,
  rows,
}: {
  groupLabel: string;
  devFull: string;
  devTablet: string;
  devMobile: string;
  rows: SkeletonRow[];
}) {
  const [dev, setDev] = useState<"full" | "tablet" | "mobile">("full");
  const maxWidth =
    dev === "mobile" ? "390px" : dev === "tablet" ? "768px" : "100%";

  // Neutro, igual que las pestañas del Toolkit: es un grupo de alternativas
  // excluyentes que reencuadra una maqueta que ya está en pantalla — se elige cómo
  // mirar el contenido, no se dispara una acción. El toggle de rejilla de arriba sí
  // es cian porque es un interruptor suelto: enciende algo que no estaba.
  const segBtn = (on: boolean) =>
    actionVariants({ variant: "toggle-neutral", on, size: "sm" });

  return (
    <>
      <div className="mb-8 flex items-center justify-end">
        <div
          role="group"
          aria-label={groupLabel}
          className="hidden flex-wrap gap-2 md:flex"
        >
          <button
            type="button"
            onClick={() => setDev("full")}
            aria-pressed={dev === "full"}
            className={segBtn(dev === "full")}
          >
            {devFull}
          </button>
          <button
            type="button"
            onClick={() => setDev("tablet")}
            aria-pressed={dev === "tablet"}
            className={segBtn(dev === "tablet")}
          >
            {devTablet}
          </button>
          <button
            type="button"
            onClick={() => setDev("mobile")}
            aria-pressed={dev === "mobile"}
            className={segBtn(dev === "mobile")}
          >
            {devMobile}
          </button>
        </div>
      </div>
      <div className="flex justify-center">
        <div
          className="border-border bg-background w-full overflow-hidden rounded-2xl border transition-[max-width] duration-300"
          style={{ maxWidth }}
        >
          <div className="border-border flex items-center justify-between border-b px-5 py-[0.85rem]">
            <div className="flex items-center gap-2">
              <span className="border-foreground h-[18px] w-[18px] rounded-full border-2" />
              <span className="bg-muted h-[0.7rem] w-20 rounded-full" />
            </div>
            <span className="bg-primary h-[0.7rem] w-14 rounded-full" />
          </div>
          <div className="px-[clamp(1rem,4vw,2.5rem)]">
            {rows.map((sk) => (
              <div
                key={sk.idx}
                className="border-border border-b py-[clamp(2rem,5vw,3.5rem)]"
              >
                <div className="mb-5 flex items-baseline gap-[0.7rem]">
                  <span className="text-muted-foreground font-mono text-[0.7rem]">
                    {sk.idx}
                  </span>
                  <span className="font-display text-muted-foreground text-[0.95rem] font-semibold">
                    {sk.name}
                  </span>
                </div>
                <div
                  className="border-border rounded-lg border border-dashed"
                  style={{
                    height: sk.h,
                    background:
                      "repeating-linear-gradient(135deg, color-mix(in srgb, var(--muted), transparent 25%) 0 10px, transparent 10px 20px)",
                  }}
                />
              </div>
            ))}
            <div className="flex flex-wrap items-center justify-between gap-4 py-10">
              <span className="bg-muted h-[0.7rem] w-32 rounded-full" />
              <div className="flex gap-2">
                <span className="bg-muted h-[0.7rem] w-12 rounded-full" />
                <span className="bg-muted h-[0.7rem] w-12 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
