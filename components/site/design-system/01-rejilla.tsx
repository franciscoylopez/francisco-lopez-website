import { type Dictionary } from "@/app/[lang]/dictionaries";
import { CopyButton } from "@/components/ui/copy-button";
import { InfoCard } from "@/components/ui/info-card";
import { CARD, SECTION, WRAP } from "@/components/ui/layout";
import { DataTable, TD, TR } from "@/components/ui/table";
import {
  GUTTER_RANGE_PX,
  LAYOUT_TOKENS,
  LAYOUT_TOKENS_CSS,
  breakpointRange,
} from "@/lib/design-values";
import { cn } from "@/lib/utils";
import { DevicePreview, GridDemo } from "../design-system-islands";
import { GroupHead, type SeccionMarco } from "./shared";

/* ===================== REJILLA Y MEDIDAS ===================== */
// Absorbe las antiguas 02 (tokens de layout) y 03 (breakpoints), y se queda con
// la 14 (esqueleto navegable) como DEMO en vez de como sección.
//
// Las cuatro contestaban la misma pregunta —cuánto ancho hay y dónde se corta— y
// separadas obligaban a saltar entre cuatro paradas para entender una sola cosa.
// El esqueleto, además, nunca fue un tema: con 87 palabras era la sección más
// corta de la página y lo que hace es ILUSTRAR la rejilla y el ritmo, así que su
// sitio es debajo de ellos.
//
// La cabecera de la sección la dibuja `GridDemo`, no este archivo: el toggle de
// rejilla va en la misma fila que el titular. Los subapartados de abajo usan
// `GroupHead`.
export function Rejilla({
  t,
  marco,
}: {
  t: Dictionary["designSystem"]["rejilla"];
  marco: SeccionMarco;
}) {
  return (
    <section
      data-reveal
      id={marco.id}
      className={cn(SECTION, "scroll-mt-[5rem]")}
    >
      <div className={WRAP}>
        <GridDemo
          num={marco.kicker}
          title={t.title}
          showLabel={t.showGrid}
          hideLabel={t.hideGrid}
          lead={t.lead}
          baseLabel={t.baseLabel}
          baseVal={t.baseVal}
          gutterLabel={t.gutterLabel}
          gutterVal={`var(--gutter) · ${GUTTER_RANGE_PX}`}
          hint={t.hint}
        />
        <div className="mt-8 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,15rem),1fr))] gap-[var(--gutter)]">
          {t.cards.map((c) => (
            <InfoCard key={c.title} title={c.title} body={c.body} />
          ))}
        </div>

        {/* ---------- los tokens de layout ---------- */}
        <GroupHead title={t.tokensTitle} lead={t.tokensLead} />
        <div
          // Superficie invertida: su primer plano es `--background`, así que el
          // atenuado se construye desde el otro extremo. Antes se escribían aquí
          // tres transparencias a ojo y la del rótulo daba 4,33:1 en oscuro —por
          // debajo de AA— sin que nada lo cazara: axe no sabe resolver
          // `color-mix()` y archiva esos elementos en `incomplete`, que es donde
          // nadie mira (P37.6565).
          data-surface="inverted"
          // A MEDIA ANCHURA, no a la del contenedor. Es un bloque de CÓDIGO, y
          // el argumento es el mismo de `--measure`: a 1360px las cinco
          // declaraciones quedan perdidas en una línea de trece centímetros con
          // el ojo saltando de la propiedad a su valor. En la sección anterior a
          // la fusión tenía tarjetas al lado que le fijaban este ancho; al
          // quedarse solo se estiró, y así se veía.
          //
          // `text-background` ES EL ARREGLO DE FONDO *(P72.515)*. El panel se
          // pintaba su superficie y no declaraba su primer plano, así que su
          // `color` computado valía exactamente lo mismo que su
          // `background-color` (medido) y CUALQUIER texto de dentro era
          // invisible hasta que alguien le escribía un color a mano. Por eso
          // había cuatro `color-mix` sueltos aquí: no eran un descuido, eran la
          // única salida que dejaba la pieza.
          //
          // Es §Controles con dos fondos de `BRAND.md` aplicado a una
          // superficie: la pieza es el `foreground` de su propio carril, y en un
          // carril invertido ese foreground es `--background`. Con eso puesto,
          // el atenuado vuelve a ser `text-muted-foreground` —que sobre esta
          // superficie ya resuelve solo, porque el panel declara su familia con
          // `data-surface`— y el contenido, a heredar.
          className="border-border text-background max-w-[38rem] overflow-hidden rounded-xl border"
          style={{ background: "var(--foreground)" }}
        >
          {/* El botón de copiar mide 44px de suelo táctil, así que la cabecera
              del panel baja su relleno vertical para no crecer con él: el
              objetivo se conserva entero, la caja casi no se entera. */}
          <div className="border-border flex items-center justify-between gap-4 border-b py-[0.4rem] pr-[0.4rem] pl-5">
            <span className="text-muted-foreground font-mono text-[0.75rem]">
              {t.copyLabel}
            </span>
            <span className="flex items-center gap-1">
              <span className="text-muted-foreground text-[0.68rem] tracking-[0.06em] uppercase">
                {t.copyHint}
              </span>
              <CopyButton
                value={LAYOUT_TOKENS_CSS}
                label={t.copyAria}
                announcement={t.copiedAnnounce}
                copiedLabel={t.copiedLabel}
                onInverted
                // Debajo: esta barra mide poco más que el propio botón, así que
                // una pastilla por encima se sale del panel y el
                // `overflow-hidden` la corta.
                confirmPlacement="below"
              />
            </span>
          </div>
          <div className="flex flex-col gap-[0.55rem] p-5 font-mono text-[clamp(0.8rem,1.4vw,0.92rem)] leading-[1.5]">
            {LAYOUT_TOKENS.map((tok) => (
              <div key={tok.name} className="flex flex-wrap gap-x-3 gap-y-1">
                {/* El panel invierte con el tema (su fondo es `--foreground`),
                    así que el acento no puede ser fijo: usa el cian del OTRO
                    tema. Antes era `--brand-cyan-split`, que en oscuro caía a
                    2,09:1 sobre el panel en hueso. */}
                <span style={{ color: "var(--primary-on-inverted)" }}>
                  {tok.name}:
                </span>
                {/* El valor HEREDA, y no se atenúa: es el contenido del bloque
                    de código, no un rótulo. Iba a un 82% escrito a mano, que es
                    otra cosa que el atenuado del sistema —el rótulo va al 75%—:
                    dos porcentajes parecidos que significaban cosas distintas
                    (regla 4 de `BRAND.md`). Ahora el rótulo es
                    `text-muted-foreground` y esto, el primer plano del panel. */}
                <span>{tok.value};</span>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- los breakpoints ---------- */}
        <GroupHead title={t.bpTitle} lead={t.bpLead} />
        {/* tabla ≥md */}
        <DataTable
          caption={t.bpTitle}
          cols={[
            { label: t.cols.token, width: "23%" },
            { label: t.cols.ctx, width: "26%" },
            { label: t.cols.change },
          ]}
          className="hidden md:block"
        >
          {t.rows.map((bp) => (
            <TR key={bp.token}>
              <TD head>
                <code className="text-foreground font-mono text-[0.9rem] font-semibold">
                  {bp.token}
                </code>
                <span className="text-muted-foreground mt-[0.15rem] block text-[0.78rem]">
                  {breakpointRange(bp.token)}
                </span>
              </TD>
              <TD className="text-[0.88rem] font-medium">{bp.ctx}</TD>
              <TD className="text-muted-foreground text-[0.88rem]">
                {bp.change}
              </TD>
            </TR>
          ))}
        </DataTable>
        {/* tarjetas <md */}
        <div className="flex flex-col gap-[0.85rem] md:hidden">
          {t.rows.map((bp) => (
            <div key={bp.token} className={cn(CARD, "px-5 py-[1.1rem]")}>
              <div className="flex items-baseline justify-between gap-4">
                <code className="text-foreground font-mono text-[0.95rem] font-semibold">
                  {bp.token}
                </code>
                <span className="text-muted-foreground text-[0.8rem]">
                  {breakpointRange(bp.token)}
                </span>
              </div>
              <div className="mt-[0.35rem] text-[0.9rem] font-medium">
                {bp.ctx}
              </div>
              <p className="text-muted-foreground m-0 mt-[0.4rem] text-[0.86rem]">
                {bp.change}
              </p>
            </div>
          ))}
        </div>

        {/* ---------- el esqueleto, que ilustra las tres cosas de arriba ---------- */}
        <GroupHead title={t.esqTitle} lead={t.esqLead} />
        <p className="text-muted-foreground border-primary m-0 mb-8 max-w-[var(--measure)] border-l-2 pl-[0.9rem] text-[0.88rem] md:hidden">
          {t.mobileNote}
        </p>
        <DevicePreview
          groupLabel={t.devGroupLabel}
          devFull={t.devFull}
          devTablet={t.devTablet}
          devMobile={t.devMobile}
          rows={t.esqRows}
        />
        {marco.closer}
      </div>
    </section>
  );
}
