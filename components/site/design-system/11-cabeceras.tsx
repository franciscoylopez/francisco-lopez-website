import { type Dictionary } from "@/app/[lang]/dictionaries";
import {
  EYEBROW_GAP,
  eyebrowVariants,
  titleVariants,
} from "@/components/ui/heading";
import { InfoCard } from "@/components/ui/info-card";
import { PAIR, PANEL, SECTION, WRAP } from "@/components/ui/layout";
import { SPECIMEN_ROW } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { SectionHead, TypeMeta } from "./shared";

/* ===================== (11) CABECERAS ===================== */
/** Guarda para el tamaño de titular que llega desde el diccionario (§11). */
function isTitleSize(value: string): value is keyof typeof EYEBROW_GAP {
  return value in EYEBROW_GAP;
}

export function Cabeceras({
  t,
}: {
  t: Dictionary["designSystem"]["cabeceras"];
}) {
  return (
    <section data-reveal className={SECTION}>
      <div className={WRAP}>
        <SectionHead num={t.num} title={t.title} />
        <p className="text-muted-foreground m-0 mb-10 max-w-[var(--measure)] text-[0.95rem]">
          {t.lead}
        </p>

        {/* Los cuatro tamaños, renderizados con las variantes REALES. Van sobre
            <span> y <p>, no sobre <h1>/<h2>: un espécimen no debe entrar en el
            esquema de encabezados de la página —un lector de pantalla los
            anunciaría como secciones que no existen—, que es el mismo motivo
            por el que §(05) enseña la escala tipográfica en <span>. */}
        <div className={PANEL}>
          {t.sizes.map((s) => {
            if (!isTitleSize(s.size)) return null;
            return (
              <div key={s.size} className={SPECIMEN_ROW}>
                <div className="min-w-[min(100%,14rem)] flex-[1_1_18rem] overflow-hidden">
                  <p className={cn(eyebrowVariants(), EYEBROW_GAP[s.size])}>
                    {s.eyebrow}
                  </p>
                  <span
                    className={cn(
                      titleVariants({ size: s.size }),
                      "text-foreground block",
                    )}
                  >
                    {s.sample}
                  </span>
                </div>
                <div className="grid flex-[1_1_16rem] [grid-template-columns:repeat(auto-fit,minmax(7.5rem,1fr))] content-start gap-x-5 gap-y-[0.9rem]">
                  <TypeMeta
                    label={t.cols.gap}
                    value={EYEBROW_GAP[s.size]}
                    mono
                  />
                  <TypeMeta label={t.cols.use} value={s.use} muted />
                </div>
              </div>
            );
          })}
        </div>

        <h3 className="font-display m-0 mt-10 mb-2 text-[1rem] font-semibold">
          {t.toneTitle}
        </h3>
        <p className="text-muted-foreground m-0 mb-4 max-w-[var(--measure)] text-[0.9rem] leading-[1.55]">
          {t.toneLead}
        </p>
        <div className={PAIR}>
          {t.tones.map((tone) => {
            const band = tone.surface === "--muted";
            return (
              <div key={tone.surface} className={cn(PANEL, "flex flex-col")}>
                <div
                  className={cn(
                    "flex flex-1 flex-col justify-center px-5 py-8",
                    // La superficie ES la demo: los dos rótulos salen de la
                    // MISMA clase, sin prop que los distinga, y se pintan
                    // distinto solo porque el fondo que tienen debajo es otro
                    // (`--surface-dim`, P37.6565). Por eso el espécimen tiene
                    // que traer la superficie de verdad y no un color parecido.
                    band ? "bg-muted" : "bg-background",
                  )}
                >
                  <p className={cn(eyebrowVariants(), "mb-3")}>{tone.label}</p>
                  <span
                    className={cn(
                      titleVariants({ size: "section-sm" }),
                      "block text-[1.5rem]",
                    )}
                  >
                    {tone.sample}
                  </span>
                </div>
                <div className="border-border bg-card border-t px-5 pt-[1.1rem] pb-[1.35rem]">
                  <code className="text-muted-foreground font-mono text-[0.74rem]">
                    {tone.surface}
                  </code>
                  <p className="text-muted-foreground m-0 mt-[0.5rem] text-[0.82rem] leading-[1.55]">
                    {tone.note}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 max-w-[var(--measure)]">
          <InfoCard title={t.ruleTitle} bullets={t.rule} foot={t.ruleFoot} />
        </div>
      </div>
    </section>
  );
}
