import { cn } from "@/lib/utils";

export type HitosDict = {
  eyebrow: string;
  title: string;
  meta: string;
  colName: string;
  colImpact: string;
  colYear: string;
  exitChip: string;
  emenduImpact: string;
  indyaLabel1: string;
  indyaLabel2: string;
  indyaApple: string;
  thetoolAcquired: string;
  thetoolNomination: string;
};

// Nombres, años y cifras son datos (no se traducen) → viven aquí; la prosa sale
// del diccionario. `.hitos-row` conmuta grid (móvil, impacto apilado) ↔ flex
// (desktop) en CSS (D7). Cada celda lleva grid-area (móvil) y flex-basis (desktop).
function Row({
  idx,
  name,
  year,
  emphasizeImpact = false,
  boldYear = false,
  children,
}: {
  idx: string;
  name: string;
  year: string;
  emphasizeImpact?: boolean;
  boldYear?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      data-reveal
      className="hitos-row border-border border-b [padding-block:clamp(1.15rem,2.4vw,1.6rem)]"
    >
      <span className="text-muted-foreground w-10 shrink-0 font-mono text-[0.8rem] [grid-area:idx]">
        {idx}
      </span>
      <div className="min-w-[12rem] flex-[1_1_15rem] [grid-area:name]">
        <span className="font-display text-[clamp(1.05rem,1.7vw,1.3rem)] font-semibold tracking-[-0.01em]">
          {name}
        </span>
      </div>
      <p
        className={cn(
          "m-0 min-w-[14rem] flex-[2_1_20rem] text-[0.95rem] leading-[1.55] [grid-area:impact]",
          emphasizeImpact ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {children}
      </p>
      <span
        className={cn(
          "text-foreground ml-auto shrink-0 font-mono text-[0.9rem] [grid-area:year]",
          boldYear && "font-semibold",
        )}
      >
        {year}
      </span>
    </div>
  );
}

// Hitos (PRD §8.1/§21). Quick-scan de reconocimientos, orden cronológico
// descendente. Sin icono. INDYA (02) anima contadores; TheTool exit (04) lleva
// el chip EXIT con reveal retardado.
export function Hitos({ dict }: { dict: HitosDict }) {
  return (
    <section
      id="hitos"
      className="border-border border-t py-[var(--section-y)]"
    >
      <div className="mx-auto max-w-[var(--container)] px-[var(--page-x)]">
        <div
          data-reveal
          className="mb-[clamp(2rem,4vw,3rem)] flex flex-wrap items-end justify-between gap-x-6 gap-y-4"
        >
          <div>
            <p className="text-muted-foreground m-0 mb-3 text-[0.8125rem] font-semibold tracking-[0.09em] uppercase">
              {dict.eyebrow}
            </p>
            <h2 className="font-display m-0 text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.022em]">
              {dict.title}
            </h2>
          </div>
          <span className="text-muted-foreground font-mono text-[0.95rem]">
            {dict.meta}
          </span>
        </div>

        {/* Etiquetas de columna — ocultas en móvil (la fila se reordena a grid) */}
        <div
          data-reveal
          className="border-border text-muted-foreground hidden items-center gap-x-6 border-b pb-3 text-[0.72rem] font-semibold tracking-[0.08em] uppercase md:flex"
        >
          <span className="w-10 shrink-0" />
          <span className="min-w-[12rem] flex-[1_1_15rem]">{dict.colName}</span>
          <span className="min-w-[14rem] flex-[2_1_20rem]">
            {dict.colImpact}
          </span>
          <span className="ml-auto shrink-0">{dict.colYear}</span>
        </div>

        <Row idx="(01)" name="Emendu" year="2026">
          {dict.emenduImpact}
        </Row>

        <Row idx="(02)" name="INDYA" year="2023">
          {dict.indyaLabel1}{" "}
          <strong className="text-foreground font-semibold [font-variant-numeric:tabular-nums]">
            <span data-count="16">16</span>% → <span data-count="10">10</span>%
          </strong>
          , {dict.indyaLabel2}{" "}
          <strong className="text-foreground font-semibold [font-variant-numeric:tabular-nums]">
            +<span data-count="28">28</span>%
          </strong>
          .
        </Row>

        <Row idx="(03)" name="INDYA" year="2022">
          {dict.indyaApple}
        </Row>

        <Row idx="(04)" name="TheTool" year="2021" emphasizeImpact boldYear>
          {dict.thetoolAcquired}
          <span
            className="exit-chip text-foreground ml-2 inline-flex items-center rounded-full px-2 py-[0.12rem] align-middle text-[0.66rem] font-semibold tracking-[0.05em] uppercase"
            style={{
              background:
                "color-mix(in oklch, var(--brand-purple), transparent 80%)",
            }}
          >
            {dict.exitChip}
          </span>
        </Row>

        <Row idx="(05)" name="TheTool" year="2019">
          {dict.thetoolNomination}
        </Row>
      </div>
    </section>
  );
}
