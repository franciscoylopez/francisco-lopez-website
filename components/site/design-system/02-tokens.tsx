import { type Dictionary } from "@/app/[lang]/dictionaries";
import { SectionHeader } from "@/components/ui/heading";
import { InfoCard } from "@/components/ui/info-card";
import { SECTION, WRAP } from "@/components/ui/layout";
import { LAYOUT_TOKENS } from "@/lib/design-values";

/* ===================== (02) TOKENS ===================== */
export function Tokens({ t }: { t: Dictionary["designSystem"]["tokens"] }) {
  return (
    <section data-reveal className={SECTION}>
      <div className={WRAP}>
        <SectionHeader eyebrow={t.num} title={t.title} size="section-sm">
          <p className="text-muted-foreground m-0 mb-10 max-w-[var(--measure)] text-[0.95rem]">
            {t.lead}
          </p>
        </SectionHeader>
        <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,22rem),1fr))] items-start gap-[var(--gutter)]">
          <div
            // Superficie invertida: su primer plano es `--background`, así que
            // el atenuado se construye desde el otro extremo. Antes se escribían
            // aquí tres transparencias a ojo y la del rótulo daba 4,33:1 en
            // oscuro —por debajo de AA— sin que nada lo cazara: axe no sabe
            // resolver `color-mix()` y archiva esos elementos en `incomplete`,
            // que es donde nadie mira (P37.6565).
            data-surface="inverted"
            className="border-border overflow-hidden rounded-xl border"
            style={{ background: "var(--foreground)" }}
          >
            <div
              className="flex items-center justify-between gap-4 px-5 py-[0.9rem]"
              style={{
                borderBottom:
                  "1px solid color-mix(in oklch,var(--background),transparent 82%)",
              }}
            >
              <span
                className="font-mono text-[0.75rem]"
                style={{
                  color:
                    "color-mix(in oklch,var(--background),transparent 25%)",
                }}
              >
                {t.copyLabel}
              </span>
              <span className="text-muted-foreground text-[0.68rem] tracking-[0.06em] uppercase">
                {t.copyHint}
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
                  <span
                    style={{
                      color:
                        "color-mix(in oklch,var(--background),transparent 18%)",
                    }}
                  >
                    {tok.value};
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-[var(--gutter)]">
            {t.cards.map((c) => (
              <InfoCard key={c.title} title={c.title} body={c.body} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
