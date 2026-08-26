import { type Dictionary } from "@/app/[lang]/dictionaries";
import { SectionHeader } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { InfoCard } from "@/components/ui/info-card";
import { SECTION, WRAP } from "@/components/ui/layout";
import { fillRatios, ratioText } from "@/lib/design-values";
import { type Locale } from "@/lib/i18n/config";

import { cn } from "@/lib/utils";
import { SpecimenCard, type SeccionMarco } from "./shared";

/* ===================== ETIQUETAS =====================
    La tercera capa del sistema, publicada aquí por el mismo motivo que (09):
    el recorrido completo es regla → componente → sección publicada → uso, y
    una regla que hay que recordar es una regla que se incumple (P37.655).
    Los demos son los MISMOS `Badge` que usa el sitio, así que la página no
    puede enseñar una pastilla que no exista. */
export function Etiquetas({
  t,
  marco,
  lang,
}: {
  t: Dictionary["designSystem"]["etiquetas"];
  marco: SeccionMarco;
  lang: Locale;
}) {
  return (
    <section
      data-reveal
      id={marco.id}
      className={cn(SECTION, "scroll-mt-[5rem]")}
    >
      <div className={WRAP}>
        <SectionHeader eyebrow={marco.kicker} title={t.title} size="section-sm">
          <p className="text-muted-foreground m-0 mb-10 max-w-[var(--measure)] text-[0.95rem]">
            {t.lead}
          </p>
        </SectionHeader>
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
              <SpecimenCard
                key={c.cls}
                kicker={c.kicker}
                cls={c.cls}
                rule={c.rule}
                note={c.note ? fillRatios(c.note, lang) : undefined}
              >
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
                        ? ((["label", "value", "code"] as const)[j] ?? "value")
                        : "value"
                    }
                  >
                    {d}
                  </Badge>
                ))}
              </SpecimenCard>
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
        {marco.closer}
      </div>
    </section>
  );
}
