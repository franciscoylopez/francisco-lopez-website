import { type Dictionary } from "@/app/[lang]/dictionaries";
import { Badge } from "@/components/ui/badge";
import { CARD, SECTION, WRAP } from "@/components/ui/layout";
import { BRAND_SWATCHES, swatchRatioParts } from "@/lib/design-values";
import { type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { Callout, H2, LEAD, NUM } from "./shared";

/* ===================== 03 COLOR ===================== */
// Los VALORES de la rejilla de color (token, hex, muestra y sus cifras medidas)
// salen de `lib/design-values.ts`; el diccionario solo conserva el nombre y la
// nota de cada muestra, que es lo único que un traductor toca (P37.66).
const SWATCH: Record<string, (typeof BRAND_SWATCHES)[number] | undefined> =
  Object.fromEntries(BRAND_SWATCHES.map((s) => [s.id, s]));

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
          <p className={NUM}>{t.num}</p>
          <h2 className={H2}>{t.title}</h2>
          <p className={LEAD}>{t.lead}</p>
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
                    <Badge tone={s.swaps ? "cyan" : "neutral"}>
                      {s.swaps ? t.swapConmuta : t.swapFijo}
                    </Badge>
                  </div>
                  <code className="text-muted-foreground mt-[0.35rem] block font-mono text-[0.76rem]">
                    {s.token}
                  </code>
                  <code className="text-foreground mt-[0.15rem] block font-mono text-[0.78rem]">
                    {s.hex}
                  </code>
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
