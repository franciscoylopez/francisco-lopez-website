import { Download, Info } from "lucide-react";

import { actionVariants } from "@/components/ui/action";
import { titleVariants } from "@/components/ui/heading";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

// Lo único del Brand Kit que se usa en MÁS DE UNA sección: los tres rótulos de
// cabecera, los dos chips de descarga y el marco de espécimen del logo. El
// resto de subcomponentes vive en el archivo de su sección (P37.69).

// Chips de descarga. Salen de la capa de acción del sistema (P37.592), que ya trae
// el objetivo táctil de 44px —punto 3 de la checklist que publica el propio Design
// System; estos chips estaban a 40px hasta P37.59— y el par de hover correcto:
// outline-primary se rellena de cian, el outline neutro se apoya en la pastilla
// `muted` del chrome.
const DL_PRIMARY = actionVariants({ variant: "outline-primary", size: "sm" });
const DL_NEUTRAL = actionVariants({ variant: "outline-neutral", size: "sm" });

// --- Assets del logo-kit. La tinta sigue el tema: claro → tinta oscura sobre
//     fondo claro; oscuro → tinta clara sobre fondo oscuro (public/logo-kit/**). ---
export const svgPair = (n: string) => ({
  light: `/logo-kit/svg/${n}-claro.svg`,
  dark: `/logo-kit/svg/${n}-oscuro.svg`,
});
export const pngPair = (n: string, sz: number) => ({
  light: `/logo-kit/png/${n}-tintaOscura-${sz}.png`,
  dark: `/logo-kit/png/${n}-tintaClara-${sz}.png`,
});
export const favPair = (sz: number) => ({
  light: `/logo-kit/favicon/favicon-claro-${sz}.png`,
  dark: `/logo-kit/favicon/favicon-oscuro-${sz}.png`,
});
export const monoSvg = (n: string) => `/logo-kit/svg/${n}.svg`;
export const monoPng = (n: string, sz: number) =>
  `/logo-kit/png/${n}-${sz}.png`;

// Tipografía de sección, propia de esta página. Las cajas y los ritmos comunes
// (WRAP / SECTION / PANEL) vienen de `./layout`: lo que aquí se llamaba `CARD` era
// en realidad el PANEL del sistema —radio xl y `overflow-hidden`— y ese nombre
// equivocado era lo que hacía parecer que el sistema tenía tres tarjetas distintas.
export const NUM =
  "text-muted-foreground m-0 mb-3 font-mono text-[0.8rem] tracking-[0.04em]";
// El título de sección sale de la capa de cabecera (P37.65): era una copia exacta.
export const H2 = titleVariants({ size: "section" });
export const LEAD =
  "text-muted-foreground mt-[1.4rem] text-[clamp(1rem,1.4vw,1.15rem)] leading-[1.6] text-pretty";

// Descarga con href único (assets neutros al tema: mono negro/blanco).
//
// El icono ya no es opcional (P37.5988). Había una prop `icon` que cada uso ponía
// o no, y el resultado era que dentro del MISMO panel el chip de SVG lo llevaba y
// los de PNG no, aunque los cuatro descargan exactamente igual. La regla del icono
// —lo lleva la acción que saca al usuario de la página— no admite matiz aquí:
// estos componentes existen solo para descargar, así que el icono es suyo, no de
// quien los invoca. Una decisión menos que tomar en cada llamada.
export function Dl({
  href,
  tone = "neutral",
  children,
}: {
  href: string;
  tone?: "primary" | "neutral";
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      download
      className={tone === "primary" ? DL_PRIMARY : DL_NEUTRAL}
    >
      <Download />
      {children}
    </a>
  );
}

// Descarga dependiente de tema: dos <a> conmutados por CSS (sin JS).
export function DlThemed({
  pair,
  tone = "neutral",
  children,
}: {
  pair: { light: string; dark: string };
  tone?: "primary" | "neutral";
  children: React.ReactNode;
}) {
  const cls = tone === "primary" ? DL_PRIMARY : DL_NEUTRAL;
  return (
    <>
      <a href={pair.light} download className={cn(cls, "dark:hidden")}>
        <Download />
        {children}
      </a>
      <a
        href={pair.dark}
        download
        className={cn(cls, "hidden dark:inline-flex")}
      >
        <Download />
        {children}
      </a>
    </>
  );
}

// Glifo dimensionado por altura (reutiliza el componente Logo, fuente única de la
// geometría). `h` en px.
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
    <span className="block shrink-0" style={{ height: `${h}px` }}>
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
