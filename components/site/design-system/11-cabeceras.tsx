import { type Dictionary } from "@/app/[lang]/dictionaries";
import {
  EYEBROW_GAP,
  eyebrowVariants,
  LEAD_GAP,
  SectionHeader,
  titleVariants,
} from "@/components/ui/heading";
import { InfoCard } from "@/components/ui/info-card";
import { PAIR, PANEL, SECTION, WRAP } from "@/components/ui/layout";
import { Stat, StatRow } from "@/components/ui/stat-row";
import { SPECIMEN_ROW } from "@/components/ui/table";
import {
  BREAKPOINT_COUNT,
  BREAKPOINTS,
  CONTAINER_PX,
} from "@/lib/design-values";
import { cn } from "@/lib/utils";
import { GroupHead, SpecimenCard, TypeMeta } from "./shared";

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
        <SectionHeader eyebrow={t.num} title={t.title} size="section-sm">
          <p className="text-muted-foreground m-0 mb-10 max-w-[var(--measure)] text-[0.95rem]">
            {t.lead}
          </p>
        </SectionHeader>

        {/* Los CINCO tamaños, renderizados con las variantes REALES. Van sobre
            <span> y <p>, no sobre <h1>/<h2>: un espécimen no debe entrar en el
            esquema de encabezados de la página —un lector de pantalla los
            anunciaría como secciones que no existen—, que es el mismo motivo
            por el que §(05) enseña la escala tipográfica en <span>.

            ERAN CUATRO hasta el 2026-08-18, y el que faltaba es `sub`: nació con
            «La historia» del deep-dive y se usa en las cinco páginas de
            experiencia, así que esta sección llevaba documentando cuatro quintos
            de su propia capa. Es el recorrido incompleto de siempre —regla ✓,
            variante ✓, sección publicada ✗, uso ✓—, el mismo peldaño que se
            saltaron los botones. Lo encontró `design-review`.

            EL RÓTULO SE PINTA SOLO SI LO HAY, y no es un detalle de implementación:
            `sub` es el único tamaño que en el sitio va SIN rótulo encima, así que
            dibujarle uno aquí enseñaría una composición que la página real no
            tiene — que es exactamente el defecto de «demos que enseñan algo que no
            existe». Su `EYEBROW_GAP` sí se publica, porque el valor existe en la
            capa aunque hoy no lo gaste nadie. */}
        <div className={PANEL}>
          {t.sizes.map((s) => {
            if (!isTitleSize(s.size)) return null;
            return (
              <div key={s.size} className={SPECIMEN_ROW}>
                <div className="min-w-[min(100%,14rem)] flex-[1_1_18rem] overflow-hidden">
                  {s.eyebrow ? (
                    <p className={cn(eyebrowVariants(), EYEBROW_GAP[s.size])}>
                      {s.eyebrow}
                    </p>
                  ) : null}
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
                  {/* El segundo hueco de la cabecera, publicado desde que existe
                      la constante (P45): la página documentaba la mitad de la
                      capa. Sale de `LEAD_GAP`, no de una copia suya. */}
                  <TypeMeta
                    label={t.cols.leadGap}
                    value={LEAD_GAP[s.size]}
                    mono
                  />
                  <TypeMeta label={t.cols.use} value={s.use} muted />
                </div>
              </div>
            );
          })}
        </div>

        <GroupHead title={t.toneTitle} lead={t.toneLead} />
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

        {/* LA FILA DE CIFRAS, publicada el 2026-08-22. Era la única de las siete
            piezas del núcleo sin sección: nació el 2026-08-19 y el inventario
            derivado de D89 la sacó por su nombre. Va AQUÍ y no en una sección
            propia porque el titular de esta ya dice de qué habla —cómo abre una
            página— y la fila es justo lo que va debajo de esa apertura.

            LA DEMO ES LA FILA DE VERDAD, con los valores de `design-values.ts`:
            es la misma que abre esta página, así que se puede comprobar
            subiendo. Y por eso trae su propio hueco superior, que es parte de lo
            que la pieza resuelve y no un descuido de esta sección. La ficha va
            SIN `children` —la variante de `SpecimenCard` para piezas cuya demo
            no cabe dentro de una caja—, porque meter la fila dentro de un marco
            enseñaría una composición que el sitio no tiene. */}
        <GroupHead title={t.statTitle} lead={t.statLead} />
        <StatRow>
          <Stat
            value={String(CONTAINER_PX)}
            unit="px"
            label={t.stat.labels.container}
          />
          <Stat
            value={String(BREAKPOINT_COUNT)}
            unit={` ${t.stat.labels.breakpointsUnit}`}
            label={BREAKPOINTS.filter((b) => b.min !== null)
              .map((b) => b.min)
              .join(" · ")}
          />
          <Stat value="AA→AAA" label={t.stat.labels.contrast} />
        </StatRow>
        <div className="mt-8 max-w-[var(--measure)]">
          <SpecimenCard
            kicker={t.stat.kicker}
            cls={t.stat.cls}
            rule={t.stat.rule}
            note={t.stat.note}
          />
        </div>

        <div className="mt-8 max-w-[var(--measure)]">
          <InfoCard title={t.ruleTitle} bullets={t.rule} foot={t.ruleFoot} />
        </div>
      </div>
    </section>
  );
}
