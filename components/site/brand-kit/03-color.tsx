import { type Dictionary } from "@/app/[lang]/dictionaries";
import { SectionHeader } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { CARD, SECTION, WRAP } from "@/components/ui/layout";
import { CopyButton, CopyChoice } from "@/components/ui/copy-button";
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
 * EL PIE DEL HEX: los dos valores en UN RENGLÓN cuando el token conmuta.
 *
 * Apilarlos no cuesta alto —el control de 44px ya fija la altura de la fila, así
 * que los dos caben dentro—, así que el renglón no se elige por espacio: se elige
 * porque los dos valores se comparan de un vistazo, que es para lo que sirve un
 * Brand Kit. Medido en el prototipo: el par mide 112px y no se parte ni con la
 * tarjeta a 222, por debajo de las 13rem que llega a medir la columna.
 *
 * LOS RÓTULOS «CLARO» / «OSCURO» SALEN DE AQUÍ y viven en el menú, que es donde
 * la elección de verdad ocurre. En el renglón sobraban: no marcaban un estado, y
 * el orden claro→oscuro es el mismo en las nueve muestras.
 */
function SwatchHex({ hex }: { hex: string | { light: string; dark: string } }) {
  if (typeof hex === "string") {
    return (
      <code className="text-foreground block font-mono text-[0.78rem]">
        {hex}
      </code>
    );
  }
  return (
    <span className="flex min-w-0 flex-wrap items-baseline gap-x-[0.35rem] font-mono text-[0.78rem]">
      <code>{hex.light}</code>
      <span aria-hidden="true" className="text-muted-foreground">
        ·
      </span>
      <code>{hex.dark}</code>
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
                  {/* CUÁL DE LOS DOS CONTROLES lo decide si el token conmuta,
                      y esa es la corrección de P70.36. Antes había uno solo que
                      copiaba el hex del tema activo sin decirlo: además de no
                      decirlo, dejaba INALCANZABLE el otro valor, que en un Brand
                      Kit es tan legítimo como el primero. Ahora, cuando hay dos,
                      se eligen por su nombre en un menú.

                      El `-my-2` deja el suelo táctil de 44px intacto y evita que
                      la tarjeta crezca 26px: los vecinos de arriba y abajo no son
                      interactivos, así que solaparlos no quita nada. */}
                  <div className="mt-[0.15rem] flex items-center justify-between gap-2">
                    <SwatchHex hex={s.hex} />
                    {typeof s.hex === "string" ? (
                      <CopyButton
                        value={s.hex}
                        label={t.copyAria.replace("{token}", s.token)}
                        announcement={t.copiedAnnounce}
                        copiedLabel={t.copiedLabel}
                        className="-my-2"
                      />
                    ) : (
                      <CopyChoice
                        values={s.hex}
                        optionLabels={{ light: t.hexLight, dark: t.hexDark }}
                        label={t.chooseAria.replace("{token}", s.token)}
                        announcement={t.copiedAnnounce}
                        copiedLabel={t.copiedLabel}
                        className="-my-2"
                      />
                    )}
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
