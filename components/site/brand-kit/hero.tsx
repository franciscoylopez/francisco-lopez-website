import { type Dictionary } from "@/app/[lang]/dictionaries";
import { SectionHeader } from "@/components/ui/heading";
import { HERO_ROW, WRAP } from "@/components/ui/layout";
import { Stat, StatRow } from "@/components/ui/stat-row";
import {
  COLOR_TOKEN_COUNT,
  SPLIT_MIN_PX,
  TYPE_FAMILIES,
} from "@/lib/design-values";
import { Breadcrumb, type BreadcrumbDict } from "../breadcrumb";
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
    <section className="flex flex-col py-[clamp(1.5rem,3vw,1.75rem)] pb-[var(--section-y)] md:min-h-[calc(100svh-5rem)]">
      {/* LA APERTURA OCUPA EL PLIEGUE (P54, 2026-08-19), con la MISMA constante
          y el mismo guard de breakpoint que el hero de la home
          (`site/hero.tsx`) y que el deep-dive: 5rem es el alto del header
          sticky y `md:` deja el móvil fuera, donde llenar el pliegue no compra
          nada.

          POR QUÉ HACÍA FALTA, medido antes de tocarlo: a 1920×1080 la apertura
          terminaba a 797px y dejaba 283px de hueco por debajo, así que el
          rótulo de la segunda sección asomaba y la primera vista pasaba de ser
          una portada a ser portada + principio de otra cosa. A 2560×1440 el
          hueco era de 643px.

          Y ES `min-h`, NO `h`: a 1280×618 y 1536×740 —el 1920 de Windows al
          150% y al 125%— esta apertura ya mide MÁS que el pliegue (medido:
          desborda 150 y 51px), así que la regla simplemente no aplica y no
          puede recortar nada. Es D50 al revés.

          El `w-full` de abajo no sobra: al volver flex el contenedor, el
          `mx-auto` de `WRAP` pasa a ser margen del eje transversal y por
          especificación DESACTIVA el stretch, con lo que la caja se encoge a su
          contenido y se desalinea del nav. No da ningún error de compilación.

          Y EL GRUPO VA ANCLADO ARRIBA, NO CENTRADO — al contrario que el
          deep-dive, y por un motivo que solo se ve con las tres páginas juntas.
          Allí la apertura es tipográfica y de alto CONSTANTE, así que centrar no
          puede descolocar nada. Aquí los tres grupos miden distinto (428, 484 y
          477 medidos a 1920, porque la entradilla y la composición cambian de
          página a página) y `my-auto` reparte el sobrante: el h1 caía a 406, 378
          y 409, o sea tres alturas distintas en tres páginas hermanas. Lo
          reportó Francisco viéndolas seguidas. Anclado arriba, el hueco
          breadcrumb→eyebrow es FIJO y lo único que varía es cuánto aire queda
          abajo, que no se compara de un vistazo. Es lo que «toda página abre
          igual» (D43) exige de verdad. */}
      <div className={`${WRAP} flex w-full flex-1 flex-col`}>
        <div data-reveal className="mb-[clamp(3rem,6vw,4.5rem)]">
          <Breadcrumb
            routeLabel={breadcrumb.routeLabel}
            items={[
              { label: breadcrumb.home, href: homeHref },
              { label: crumb },
            ]}
          />
        </div>
        {/* EL GRUPO VA CENTRADO, como el deep-dive y por la misma razón: una
            portada reparte el aire arriba y abajo, no lo acumula debajo de un
            bloque pegado al breadcrumb. Francisco lo pidió al ver estas tres al
            lado de `/trayectoria`, que ya lo hacía.

            Y AHORA SE PUEDE, que en el primer intento no. Centrar reparte el
            sobrante, así que si los grupos miden distinto el eyebrow cae a
            distinta altura en cada página — que es exactamente lo que pasó (h1 a
            406, 378 y 409). Lo que lo arregla no es el anclaje: es que los tres
            grupos midan LO MISMO, y de eso se encargan el `min-h` de `HERO_ROW`
            y las composiciones compactadas. Con eso hecho, centrar es seguro. */}
        <div className="my-auto">
          <div className={HERO_ROW}>
            {/* `self-start`: la fila sigue centrada —la composición decorativa
              queda equilibrada frente al texto— pero la COLUMNA DE TEXTO se ancla
              arriba. Sin eso el hueco breadcrumb→eyebrow lo decidía el alto de la
              ilustración: la fila la manda el elemento más alto y `items-center`
              empuja al otro, así que el eyebrow caía a 72px en Brand Kit (texto más
              alto que su composición), 83 en Design System y 99 en Accesibilidad
              (composición 54px más alta que el texto → 27 de empuje). Tres alturas
              distintas en tres páginas hermanas, y NO lo causaba el pliegue: venía
              de antes. Con esto, 72 en las tres. */}
            <div className="min-w-[min(100%,18rem)] flex-[1.2_1_24rem] self-start">
              <SectionHeader
                eyebrow={t.kicker}
                title={t.title}
                level={1}
                size="page"
                reveal
              >
                <p
                  data-reveal
                  className="text-muted-foreground max-w-[40ch] text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-[1.6]"
                >
                  {t.lead}
                </p>
              </SectionHeader>
            </div>
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
          </div>
          {/* Fila de datos (P54.3). Las otras dos páginas que documentan el sistema
            —Design System y Accesibilidad— abrían con su resumen en cifras y
            esta no, siendo de la misma familia. Los VALORES salen de
            `lib/design-values.ts` (D38): el diccionario solo trae la etiqueta,
            así que la cifra publicada y la del sistema no pueden divergir. El
            recuento de color se DERIVA de las dos capas de la paleta, y el
            umbral del split es el mismo valor con el que la sección del
            logotipo decide qué peldaños funcionan. */}
          <StatRow>
            <Stat value={String(COLOR_TOKEN_COUNT)} label={t.statColor} />
            <Stat
              value={String(TYPE_FAMILIES.length)}
              label={t.statTipografia}
            />
            <Stat value={String(SPLIT_MIN_PX)} unit="px" label={t.statSplit} />
            <Stat value="AA→AAA" label={t.statA11y} />
          </StatRow>
        </div>
      </div>
    </section>
  );
}
