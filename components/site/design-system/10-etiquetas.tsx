import { type Dictionary } from "@/app/[lang]/dictionaries";
import { SectionHeader } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { InfoCard } from "@/components/ui/info-card";
import { SECTION, WRAP } from "@/components/ui/layout";
import { fillRatios, ratioText } from "@/lib/design-values";
import { type Locale } from "@/lib/i18n/config";

/* ===================== (10) ETIQUETAS =====================
    La tercera capa del sistema, publicada aquí por el mismo motivo que (09):
    el recorrido completo es regla → componente → sección publicada → uso, y
    una regla que hay que recordar es una regla que se incumple (P37.655).
    Los demos son los MISMOS `Badge` que usa el sitio, así que la página no
    puede enseñar una pastilla que no exista. */
export function Etiquetas({
  t,
  lang,
}: {
  t: Dictionary["designSystem"]["etiquetas"];
  lang: Locale;
}) {
  return (
    <section data-reveal className={SECTION}>
      <div className={WRAP}>
        <SectionHeader eyebrow={t.num} title={t.title} size="section-sm" />
        <p className="text-muted-foreground m-0 mt-4 mb-10 max-w-[var(--measure)] text-[0.95rem]">
          {t.lead}
        </p>
        {/* Cuatro tarjetas, no seis como en (09): con el `minmax` de aquella
            sección caben tres por fila y la cuarta se quedaba sola dejando dos
            tercios de fila vacíos. A 15rem entran las cuatro en una sola fila y
            el bloque se lee como lo que es — un eje de tres tonos más el de los
            registros. Es el mismo problema que resolvió `PAIR` (P37.61/62): el
            número de columnas se elige por cuántas piezas hay, no por defecto. */}
        <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,15rem),1fr))] items-start gap-[var(--gutter)]">
          {t.cases.map((c, i) => {
            // La cuarta tarjeta cierra con una cifra REAL del censo —la misma
            // que publica la tabla de (12)—, no con una escrita a mano: es un
            // espécimen del registro `code`, y un espécimen que miente sobre el
            // dato que ilustra es exactamente lo que arregla P37.66.
            const demo =
              i === 3
                ? [...c.demo, ratioText("bodyText", "light", lang)]
                : c.demo;
            return (
              <div
                key={c.cls}
                className="border-border overflow-hidden rounded-xl border"
              >
                <div className="bg-background flex min-h-[7.5rem] flex-wrap items-center justify-center gap-2 px-5 py-7">
                  {/* Las tres primeras tarjetas enseñan un TONO con dos ejemplos
                    reales; la cuarta enseña los tres `kind` sobre un mismo tono,
                    que es el eje que de verdad significa algo. Por eso el mapeo
                    va por índice y no por una prop en el diccionario: el copy
                    describe la variante, no la elige. */}
                  {demo.map((d, j) => (
                    <Badge
                      key={d}
                      tone={
                        i === 0
                          ? "neutral"
                          : i === 1
                            ? "cyan"
                            : i === 2
                              ? "purple"
                              : "neutral"
                      }
                      kind={
                        i === 3
                          ? ((["label", "value", "code"] as const)[j] ??
                            "value")
                          : "value"
                      }
                    >
                      {d}
                    </Badge>
                  ))}
                </div>
                <div className="border-border bg-card border-t px-5 pt-[1.1rem] pb-[1.35rem]">
                  <div className="mb-[0.7rem] flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <span className="text-foreground text-[0.72rem] font-semibold tracking-[0.05em] uppercase">
                      {c.kicker}
                    </span>
                    <code className="text-muted-foreground font-mono text-[0.74rem]">
                      {c.cls}
                    </code>
                  </div>
                  <p className="text-foreground m-0 text-[0.88rem] leading-[1.6]">
                    {c.rule}
                  </p>
                  <p className="text-muted-foreground border-border m-0 mt-[0.8rem] border-t border-dashed pt-[0.8rem] text-[0.82rem] leading-[1.55]">
                    {fillRatios(c.note, lang)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-muted-foreground m-0 mt-4 text-[0.8rem]">{t.hint}</p>
        <div className="mt-8 max-w-[var(--measure)]">
          <InfoCard
            title={t.ruleTitle}
            bullets={t.rule}
            foot={fillRatios(t.ruleFoot, lang)}
          />
        </div>
      </div>
    </section>
  );
}
