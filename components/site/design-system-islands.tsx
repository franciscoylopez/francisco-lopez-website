"use client";

import { useRef, useState, type CSSProperties } from "react";

import { actionVariants } from "@/components/ui/action";
import { SectionHeader } from "@/components/ui/heading";
import { cn } from "@/lib/utils";

import { PANEL } from "@/components/ui/layout";

// Las piezas interactivas del Design System, juntas y FUERA de su carpeta de
// secciones (D7: JS solo en islas; el porqué de que no vayan a su NN-*.tsx, en
// D42 §La excepción). La frontera `"use client"` se paga por archivo: repartirlas
// convertiría tres archivos de sección enteros en Client Components. El resto de
// la página es Server Component.
//
// Una isla nueva viene AQUÍ, no a su sección.

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
      {/* La CUARTA copia privada de la cabecera numerada (P37.695), y la más
          fácil de perder de vista: la sección 01 dibuja la suya aquí dentro
          porque el toggle de rejilla va en la misma fila. Como la de
          Accesibilidad, escribía a mano las clases de `section-sm` en vez de
          usar la variante. */}
      <div className="mb-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <SectionHeader eyebrow={num} title={title} size="section-sm" />
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
      <p className="text-muted-foreground m-0 mt-4 mb-10 max-w-[var(--measure)] text-[0.95rem]">
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
//
// LA DEMO NO DESCRIBE EL REVEAL: LO USA (P74.35). Se dibujaba con una transición
// inline propia, y por eso llevaba una tercera versión de las mismas cifras: la
// página publicaba 600 ms y 12px, `globals.css` decía 600 ms y 14px, y esto de
// aquí, .5s y 12px. Tres fuentes, tres respuestas, en la página cuyo trabajo es
// no poder mentir. Ahora las piezas son `[data-reveal]` normales y el replay solo
// les quita y les devuelve `data-shown`: la duración, la curva y el recorrido los
// pone la capa, así que la demo cambia sola cuando cambie el reveal.
//
// Y de paso arregla un incumplimiento que no se veía: con `prefers-reduced-motion`
// el estilo inline animaba igual, porque no preguntaba. La regla vive en
// `.reveal-on`, que el island de motion NO añade cuando hay reduced-motion, así
// que ahora el botón deja las piezas donde están, que es lo correcto.
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
    // Rebobinar al estado oculto SIN transición, y solo entonces devolverla. Con
    // el reflow a secas no basta y se ve vacío: quitar `data-shown` con la
    // transición puesta arranca un fundido HACIA fuera, así que al devolverlo un
    // frame después el elemento sigue casi opaco y no hay recorrido que ver.
    // (Medido: opacidad 1 → 1 → 1 antes de esto.)
    items.forEach((el) => {
      el.style.transition = "none";
      el.removeAttribute("data-shown");
    });
    void demo.offsetWidth;
    items.forEach((el, i) => {
      // Cadena vacía = se devuelve la transición de la capa, no una copia suya.
      el.style.transition = "";
      el.style.transitionDelay = `${i * 80}ms`;
      el.setAttribute("data-shown", "1");
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
        <div data-reveal className="demo-item bg-muted h-[2.2rem] rounded-md" />
        <div
          data-reveal
          className="demo-item bg-muted h-[2.2rem] w-[85%] rounded-md"
        />
        <div
          data-reveal
          className="demo-item bg-muted h-[2.2rem] w-[70%] rounded-md"
        />
      </div>
    </div>
  );
}

/**
 * (05) LA OTRA PUERTA DE ENTRADA: la que entra AL CARGAR *(P72.512)*.
 *
 * Hermana de `RevealDemo`, y separada de ella a propósito: son dos mecanismos
 * distintos y la sección existe para que se note (D202). Aquélla demuestra
 * `data-reveal`, que espera a que el elemento entre en viewport; ésta demuestra
 * `.entrada-pliegue`, que no espera a nada porque lo suyo ya está en pantalla.
 *
 * USA LA CLASE REAL, no una copia con las mismas cifras: es la misma regla de
 * `globals.css` que corre en las cuatro portadas del sistema, retardo escalonado
 * incluido. Si algún día cambia la curva o la duración, esta demo cambia con
 * ella; con una recreación, publicaría un movimiento que el sitio ya no tiene.
 *
 * REBOBINAR ES QUITAR LA CLASE, NO TOCAR LA TRANSICIÓN. Aquí el movimiento es un
 * `@keyframes`, no una transición, así que el problema de `RevealDemo` —que al
 * quitar el estado arrancaba un fundido hacia fuera— no existe: se retira la
 * clase, se fuerza el reflow y se vuelve a poner. El navegador reinicia la
 * animación desde su primer fotograma.
 */
export function EntradaDemo({
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
    const items = demo.querySelectorAll<HTMLElement>(".demo-entrada");
    items.forEach((el) => el.classList.remove("entrada-pliegue"));
    void demo.offsetWidth;
    items.forEach((el) => el.classList.add("entrada-pliegue"));
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
      {/* Tres fichas escalonadas, que es la forma que tiene el mecanismo en las
          portadas: el retardo va por variable para que la regla de movimiento
          reducido pueda anularlo (globals.css §Entrada del pliegue). */}
      <div ref={ref} className="flex items-end gap-[0.6rem]">
        {["0s", "0.08s", "0.16s"].map((retardo, i) => (
          <div
            key={retardo}
            className="demo-entrada entrada-pliegue bg-muted flex-1 rounded-md"
            style={
              {
                height: `${4.6 - i * 0.7}rem`,
                "--retardo-entrada": retardo,
              } as CSSProperties
            }
          />
        ))}
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

/* ───────────────────────── FocusSimulator ───────────────────────── */

/** (09) Botones — enciende el anillo de foco sobre los especímenes sin que
 * ninguno se vuelva focalizable.
 *
 * POR QUÉ FINGE EN VEZ DE ENFOCAR. La sección es INERTE a propósito: sus demos
 * son `<a href="#top">` y `<span>` porque los estados con carga se enseñan a la
 * vez y un control que no hace nada sería una parada de tabulación puesta ahí
 * para ilustrar. Enfocarlos de verdad metería doce paradas inútiles en una
 * página sobre accesibilidad, que es empeorar justo lo que se documenta.
 *
 * Y EL ANILLO QUE ENSEÑA NO ES UNA IMITACIÓN: la regla de `globals.css` que
 * pinta `:focus-visible` lleva el selector del simulador dentro, con la
 * especificidad igualada. No hay dos juegos de valores que puedan divergir, así
 * que la pregunta «¿coincide píxel a píxel con el real?» no depende de que
 * alguien lo compruebe: no hay forma de que no coincida. */
export function FocusSimulator({
  showLabel,
  hideLabel,
  hint,
  children,
}: {
  showLabel: string;
  hideLabel: string;
  hint: string;
  children: React.ReactNode;
}) {
  const [on, setOn] = useState(false);

  return (
    <div data-focus-sim={on ? "on" : "off"}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <p className="text-muted-foreground m-0 max-w-[var(--measure)] text-[0.8rem]">
          {hint}
        </p>
        <button
          type="button"
          onClick={() => setOn((v) => !v)}
          aria-pressed={on}
          // Interruptor SUELTO, no grupo de alternativas: enciende una capa que
          // antes no estaba, y no compite con ningún par al lado. De ahí
          // `toggle-primary` y no `toggle-neutral` (BRAND.md §Controles con
          // estado).
          className={actionVariants({
            variant: "toggle-primary",
            on,
            size: "sm",
          })}
        >
          {/* El glifo es el propio anillo, dibujado con los mismos 2px de trazo
              y 2px de hueco: un cuadrado con su contorno separado. Es forma, no
              color, que es lo que el punto 6 del checklist pide de un estado. */}
          <span
            aria-hidden="true"
            className="inline-block h-[13px] w-[13px] rounded-[2px] border-2 border-current"
            style={{ outline: "2px solid currentColor", outlineOffset: "1px" }}
          />
          {on ? hideLabel : showLabel}
        </button>
      </div>
      {children}
    </div>
  );
}
