import { Info } from "lucide-react";

import { Logo } from "@/components/ui/logo";

// Lo único del Brand Kit que se usa en MÁS DE UNA sección: la entradilla, el aviso
// y el marco de espécimen del logo. El resto de subcomponentes vive en el archivo
// de su sección (P37.69).
//
// LOS CHIPS DE DESCARGA SALIERON DE AQUÍ EL 2026-08-26 (P70.27). Vivían `Dl` y
// `DlThemed`, y con ellos los constructores de ruta `svgPair` / `pngPair` /
// `favPair` / `monoSvg` / `monoPng`. `DlThemed` dibujaba DOS anclas por descarga
// —una `dark:hidden` y otra `hidden dark:inline-flex`— para conmutar de tinta sin
// JS, y esa era justamente la avería: la tinta la elegía el TEMA DEL SITIO, así que
// de las 49 anclas de la página veinte estaban siempre en `display:none`, sin foco y
// fuera del árbol de accesibilidad. Para bajar la tinta oscura estando en tema
// oscuro había que cambiar el tema de la web, y nada lo decía.
//
// Ahora la tarjeta ofrece un SVG y ANUNCIA su tinta, el resto va en el kit, y las
// rutas las construye `lib/logo-kit.ts`, que además es lo que `check:kit` contrasta
// contra el disco.

// Entradilla de sección, propia de esta página. Las cajas y los ritmos comunes
// (WRAP / SECTION / PANEL) vienen de `./layout`: lo que aquí se llamaba `CARD` era
// en realidad el PANEL del sistema —radio xl y `overflow-hidden`— y ese nombre
// equivocado era lo que hacía parecer que el sistema tenía tres tarjetas distintas.
//
// AQUÍ VIVÍAN `NUM` y `H2` (P37.695). El titular ya salía de la capa de cabecera
// desde P37.65, pero el rótulo seguía siendo un `<p>` monoespaciado suelto — la
// tercera copia privada de la cabecera numerada. Ahora el par entero sale de
// `SectionHeader`, así que el rótulo de estas seis secciones es el mismo que el
// del hero de esta misma página, que ya lo usaba.
export const LEAD =
  "text-muted-foreground text-[clamp(1rem,1.4vw,1.15rem)] leading-[1.6]";

// Glifo dimensionado por altura (reutiliza el componente Logo, fuente única de la
// geometría). `h` en px.
//
// EL ENVOLTORIO ES FLEX Y NO BLOCK, y no es cosmético (P37.695). `Logo` es
// `inline-flex`, así que dentro de un envoltorio `block` es una caja EN LÍNEA:
// no rellena su hueco, se apoya en la línea de texto, y la altura de esa línea
// la manda el `line-height` heredado —24px—, no el glifo. Mientras el glifo mide
// ≥24px no se nota; por debajo, la línea gana y lo empuja hacia abajo. Se veía
// en el espécimen de favicon de 16px, donde el glifo (10px) caía 8px y se salía
// del marco. Con el envoltorio en `flex` el `Logo` pasa a ser un ítem flex y la
// línea de texto deja de existir.
export function Glyph({
  variant,
  h,
  mono,
}: {
  variant: "split" | "flat";
  h: number;
  mono?: "black" | "white";
}) {
  return (
    <span className="flex shrink-0" style={{ height: `${h}px` }}>
      <Logo
        variant={variant}
        forceColor={mono ?? "theme"}
        className="h-full gap-0"
      />
    </span>
  );
}

export function Callout({
  accent,
  children,
  ...rest
}: {
  accent: "primary" | "purple";
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  // El acento morado es `--brand-purple`, no `--brand-purple-accent` (P37.657).
  // Este callout vive sobre `--card`, y el accent existe SOLO para fondos
  // invertidos — la propia regla de BRAND.md dice que fuera de ahí va el morado
  // estándar. Antes daba igual de lejos (los dos morados se parecían); desde que
  // el accent conmuta con el tema, usarlo aquí lo dejaría en 2,07 claro / 1,91
  // oscuro, o sea invisible sobre la tarjeta. El filete y el icono son
  // decoración —el icono es `aria-hidden` y el texto lleva el mensaje entero—,
  // así que no hay umbral que cumplir; lo que hay que cumplir es la regla.
  const color = accent === "primary" ? "var(--primary)" : "var(--brand-purple)";
  return (
    <div
      {...rest}
      className="border-border bg-card mt-8 flex max-w-[var(--measure)] items-start gap-[0.85rem] rounded-md border px-[1.35rem] py-[1.15rem]"
      style={{ borderLeft: `3px solid ${color}` }}
    >
      <Info
        stroke={color}
        className="mt-[0.1rem] size-5 flex-none"
        aria-hidden="true"
      />
      <p className="text-foreground m-0 text-[0.92rem] leading-[1.6]">
        {children}
      </p>
    </div>
  );
}
