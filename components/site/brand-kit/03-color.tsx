import { type Dictionary } from "@/app/[lang]/dictionaries";
import { SectionHeader } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { CARD, SECTION, WRAP } from "@/components/ui/layout";
import { CopyButton } from "@/components/ui/copy-button";
import {
  BRAND_SWATCHES,
  swatchRatioParts,
  swatchSwaps,
} from "@/lib/design-values";
import { type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { Callout, LEAD } from "./shared";

/* ===================== 03 COLOR ===================== */
// Los VALORES de la rejilla de color (token, hex, muestra y sus cifras medidas)
// salen de `lib/design-values.ts`; el diccionario solo conserva el nombre y la
// nota de cada muestra, que es lo único que un traductor toca (P37.66).
const SWATCH: Record<string, (typeof BRAND_SWATCHES)[number] | undefined> =
  Object.fromEntries(BRAND_SWATCHES.map((s) => [s.id, s]));

/**
 * EL HEX DEL PIE, y cuál de los dos se va a copiar cuando hay dos.
 *
 * El token que conmuta imprime sus dos valores y el botón de al lado copia UNO,
 * el del tema que se está viendo. Eso ya era así; lo que faltaba era decirlo.
 *
 * NO SE RESUELVE EN EL RENDER, Y NO ES UN DETALLE: quien pinta esta tarjeta es un
 * Server Component, que no sabe en qué tema está el navegador. Leerlo en el
 * primer render de cliente sería una discrepancia de hidratación esperando a
 * ocurrir —es el mismo motivo por el que `CopyButton` resuelve el valor en el
 * CLIC y no al renderizar—. Así que lo decide el CSS: los dos valores se pintan
 * siempre y la variante `dark:` intercambia cuál va en tinta plena. Cero
 * JavaScript nuevo.
 *
 * Y LA ETIQUETA NO ES DECORADO, ES EL PUNTO 6 DEL GATE. Si el único indicio de
 * cuál se copia fuera el contraste entre tinta y gris, sería un estado codificado
 * solo por color. El rótulo «claro» / «oscuro» está siempre escrito, así que la
 * información se lee sin depender del tono; el tono la refuerza.
 */
function SwatchHex({
  hex,
  labels,
}: {
  hex: string | { light: string; dark: string };
  labels: { light: string; dark: string };
}) {
  if (typeof hex === "string") {
    return (
      <code className="text-foreground block font-mono text-[0.78rem]">
        {hex}
      </code>
    );
  }
  return (
    <span className="flex min-w-0 flex-wrap items-baseline gap-x-[0.6rem] gap-y-[0.1rem] text-[0.78rem]">
      <span className="text-foreground dark:text-muted-foreground">
        <span className="mr-[0.3rem] text-[0.68rem] tracking-[0.04em] uppercase">
          {labels.light}
        </span>{" "}
        <code className="font-mono">{hex.light}</code>
      </span>
      <span className="text-muted-foreground dark:text-foreground">
        <span className="mr-[0.3rem] text-[0.68rem] tracking-[0.04em] uppercase">
          {labels.dark}
        </span>{" "}
        <code className="font-mono">{hex.dark}</code>
      </span>
    </span>
  );
}

export function Color({
  t,
  lang,
}: {
  t: Dictionary["brandKit"]["color"];
  lang: Locale;
}) {
  const ratioLabels: Record<string, string> = t.ratioLabels;

  return (
    <section className={SECTION}>
      <div className={WRAP}>
        <div
          data-reveal
          className="mb-[clamp(2.5rem,5vw,4rem)] max-w-[var(--measure)]"
        >
          <SectionHeader eyebrow={t.num} title={t.title} size="section">
            <p className={LEAD}>{t.lead}</p>
          </SectionHeader>
        </div>
        <div
          data-reveal
          className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,13rem),1fr))] gap-[var(--gutter)]"
        >
          {t.items.map((c) => {
            // El copy manda QUÉ muestras se publican; el módulo, cuánto valen.
            const s = SWATCH[c.id];
            if (!s) return null;
            const ratio = swatchRatioParts(
              s,
              lang,
              (k) => ratioLabels[k] ?? k,
            ).join(" · ");
            return (
              <div key={c.id} className={cn(CARD, "overflow-hidden")}>
                <div
                  className="border-border flex h-[118px] items-end border-b p-[0.85rem]"
                  style={{ background: s.sample }}
                >
                  <span
                    className="font-display text-[1.5rem] font-semibold"
                    style={{ color: s.sampleFg }}
                  >
                    Aa
                  </span>
                </div>
                <div className="px-4 pt-[0.9rem] pb-[1.1rem]">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-display text-[0.98rem] font-semibold">
                      {c.name}
                    </div>
                    <Badge tone={swatchSwaps(s) ? "cyan" : "neutral"}>
                      {swatchSwaps(s) ? t.swapConmuta : t.swapFijo}
                    </Badge>
                  </div>
                  <code className="text-muted-foreground mt-[0.35rem] block font-mono text-[0.76rem]">
                    {s.token}
                  </code>
                  {/* El pie IMPRIME los dos hexes cuando el token conmuta, y el
                      botón COPIA uno solo: el del tema que se está viendo. Son
                      dos cosas distintas y por eso son dos funciones (ver la
                      nota de `swatchHexFor` en design-values). El anuncio dice
                      cuál se ha llevado, que es lo que deshace la ambigüedad
                      para quien no ve la pantalla.

                      Y ESA ERA LA MITAD QUE FALTABA (P70.30): la única persona a
                      la que se le decía cuál de los dos se llevaba era la que no
                      ve la pantalla. Quien la mira leía «#F7F3EC · #191D21» y un
                      botón, sin nada que dijera cuál de los dos. Francisco
                      esperaba dos botones; lo que faltaba no era un control, era
                      la etiqueta.

                      El `-my-2` deja el suelo táctil de 44px intacto y evita
                      que la tarjeta crezca 26px: los vecinos de arriba y abajo
                      no son interactivos, así que solaparlos no quita nada. */}
                  <div className="mt-[0.15rem] flex items-center justify-between gap-2">
                    <SwatchHex
                      hex={s.hex}
                      labels={{ light: t.hexLight, dark: t.hexDark }}
                    />
                    <CopyButton
                      value={s.hex}
                      label={t.copyAria.replace("{token}", s.token)}
                      announcement={t.copiedAnnounce}
                      copiedLabel={t.copiedLabel}
                      className="-my-2 shrink-0"
                    />
                  </div>
                  <div className="border-border text-muted-foreground mt-[0.6rem] border-t border-dashed pt-[0.6rem] text-[0.78rem]">
                    {ratio}
                  </div>
                  <div className="text-muted-foreground mt-[0.2rem] text-[0.76rem]">
                    {c.note}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Callout data-reveal accent="purple">
          {t.pastelNote}
        </Callout>
      </div>
    </section>
  );
}
