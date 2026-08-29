import { type Dictionary } from "@/app/[lang]/dictionaries";
import { Stat } from "@/components/ui/stat-row";
import {
  COLOR_TOKEN_COUNT,
  SPLIT_MIN_PX,
  TYPE_FAMILIES,
} from "@/lib/design-values";

import { type BreadcrumbDict } from "../breadcrumb";
import { SystemPageOpening } from "../system-page-opening";
import { Glyph } from "./shared";

/* ===================== HERO ===================== */
// Composición decorativa del hero: ventana de navegador con el chrome a trazo
// invertido sobre una superficie foreground. Reproduce la anatomía del logo.
function BrowserMockup() {
  const line = (t: number) =>
    `color-mix(in srgb, var(--background), transparent ${t}%)`;
  return (
    <div
      data-reveal
      className="relative z-[2] w-full overflow-hidden rounded-[12px]"
      style={{ background: "var(--foreground)" }}
    >
      {/* pestañas */}
      <div
        className="flex h-[38px] items-end px-[10px]"
        style={{ borderBottom: `1px solid ${line(72)}` }}
      >
        <div
          className="flex h-[28px] items-center gap-2 px-3"
          style={{
            border: `1px solid ${line(55)}`,
            borderBottom: "none",
            borderRadius: "7px 7px 0 0",
          }}
        >
          <svg
            viewBox="31 17 58 70"
            width="12"
            height="14"
            fill="none"
            className="block flex-none"
            aria-hidden="true"
          >
            <circle
              cx="60"
              cy="46"
              r="26"
              stroke="var(--background)"
              strokeWidth="6"
            />
            <rect
              x="42"
              y="82"
              width="36"
              height="5"
              rx="2.5"
              fill="var(--background)"
            />
          </svg>
          <span
            className="h-[2px] w-[44px] rounded-[1px]"
            style={{ background: line(45) }}
          />
        </div>
      </div>
      {/* barra de direcciones */}
      <div
        className="flex h-[28px] items-center px-3"
        style={{ borderBottom: `1px solid ${line(72)}` }}
      >
        <span
          className="h-[13px] flex-1 rounded-[6.5px]"
          style={{ border: `1px solid ${line(55)}` }}
        />
      </div>
      {/* nav del sitio con proporciones reales */}
      <div
        className="flex h-[34px] items-center justify-between px-3"
        style={{ borderBottom: `1px solid ${line(72)}` }}
      >
        <span className="inline-flex items-center gap-[7px]">
          <svg
            viewBox="28 15 64 72"
            width="18"
            height="20"
            fill="none"
            className="block flex-none overflow-visible"
            aria-hidden="true"
          >
            <circle
              cx="57"
              cy="44"
              r="26"
              stroke="var(--brand-cyan-split)"
              strokeWidth="6"
            />
            <circle
              cx="63"
              cy="48"
              r="26"
              stroke="var(--brand-purple-split)"
              strokeWidth="6"
            />
            <circle
              cx="60"
              cy="46"
              r="26"
              stroke="var(--background)"
              strokeWidth="6"
            />
            <rect
              x="42"
              y="82"
              width="36"
              height="5"
              rx="2.5"
              fill="var(--background)"
            />
          </svg>
          <span
            className="font-display text-[9px] leading-none font-semibold tracking-[-0.01em]"
            style={{ color: "var(--background)" }}
          >
            Francisco López
          </span>
        </span>
        <span className="inline-flex items-center gap-[6px]">
          <span
            className="h-[12px] w-[40px] rounded-[6px]"
            style={{ border: `1px solid ${line(45)}` }}
          />
          <span
            className="h-[12px] w-[12px] rounded-[4px]"
            style={{ border: `1px solid ${line(45)}` }}
          />
        </span>
      </div>
      {/* contenido esquemático */}
      <div className="flex flex-col gap-[13px] px-[14px] pt-5 pb-6">
        <span
          className="h-[3px] w-[46%] rounded-[1.5px]"
          style={{ background: line(30) }}
        />
        {["90%", "78%", "84%", "62%"].map((w, i) => (
          <span
            key={i}
            className="h-[2px] rounded-[1px]"
            style={{ width: w, background: line(58) }}
          />
        ))}
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
      leadClassName="max-w-[40ch] text-[clamp(1.0625rem,1.6vw,1.25rem)]"
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
      {/* Composición: la anatomía del logo aplicada a escala (PRD §19).
          Centro foreground que conmuta, flancos pastel fijos. Decorativa. */}
      <div
        aria-hidden="true"
        className="flex flex-[1_1_26rem] items-center justify-center"
      >
        <div className="relative w-[min(21rem,100%)]">
          <div
            data-reveal
            className="absolute top-1/2 left-[-2.75rem] z-[1] hidden -translate-y-1/2 md:block"
            style={{ transitionDelay: "0.16s" }}
          >
            <div
              className="bg-brand-cyan-soft flex h-[10.5rem] w-[7.5rem] items-center justify-center rounded-xl"
              style={{ transform: "rotate(-6deg)" }}
            >
              <Glyph variant="flat" h={27} />
            </div>
          </div>
          <div
            data-reveal
            className="absolute top-1/2 right-[-2.75rem] z-[1] hidden -translate-y-1/2 md:block"
            style={{ transitionDelay: "0.24s" }}
          >
            <div
              className="bg-brand-purple-soft flex h-[10.5rem] w-[7.5rem] items-center justify-center rounded-xl"
              style={{ transform: "rotate(6deg)" }}
            >
              <Glyph variant="flat" h={27} />
            </div>
          </div>
          <BrowserMockup />
        </div>
      </div>
    </SystemPageOpening>
  );
}
