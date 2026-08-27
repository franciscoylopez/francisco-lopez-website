import { cn } from "@/lib/utils";
import { SECTION, WRAP } from "@/components/ui/layout";
import { SectionHeader, dataLabelVariants } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { Marcas } from "@/components/ui/marcas";

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
      className="hito-fila hitos-row border-border border-b [padding-block:clamp(1.15rem,2.4vw,1.6rem)]"
    >
      <span className="text-muted-foreground w-10 shrink-0 font-mono text-[0.8rem] [grid-area:idx]">
        {idx}
      </span>
      <div className="min-w-[12rem] flex-[1_1_15rem] [grid-area:name]">
        <span className="font-display text-[clamp(1.05rem,1.7vw,1.3rem)] font-semibold tracking-[-0.01em]">
          <Marcas>{name}</Marcas>
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
          "hito-anio text-foreground ml-auto shrink-0 font-mono text-[0.9rem] [grid-area:year]",
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
//
// Y desde P81 la sección lleva «Estratos», la TEXTURA del gesto de marca: un
// filete crece bajo el año conforme la fila cruza (`.hito-fila`/`.hito-anio` en
// globals.css, con `animation-timeline`). Es textura y no firma: la firma es el
// punto del titular del Hero, y dos firmas compitiendo serían peor que ninguna
// (D137). Ningún texto se atenúa, que es lo que lo separa de un fundido por
// scroll.
export function Hitos({ dict }: { dict: HitosDict }) {
  return (
    <section id="hitos" className={SECTION}>
      <div className={WRAP}>
        <div
          data-reveal
          className="mb-[clamp(2rem,4vw,3rem)] flex flex-wrap items-end justify-between gap-x-6 gap-y-4"
        >
          <div>
            <SectionHeader eyebrow={dict.eyebrow} title={dict.title} />
          </div>
          <span className="text-muted-foreground font-mono text-[0.95rem]">
            {dict.meta}
          </span>
        </div>

        {/* Etiquetas de columna — ocultas en móvil (la fila se reordena a grid) */}
        <div
          data-reveal
          className={cn(
            dataLabelVariants(),
            "border-border hidden items-center gap-x-6 border-b pb-3 md:flex",
          )}
        >
          <span className="w-10 shrink-0" />
          <span className="min-w-[12rem] flex-[1_1_15rem]">{dict.colName}</span>
          <span className="min-w-[14rem] flex-[2_1_20rem]">
            {dict.colImpact}
          </span>
          <span className="ml-auto shrink-0">{dict.colYear}</span>
        </div>

        <Row idx="(01)" name="Emendu" year="2026">
          <Marcas>{dict.emenduImpact}</Marcas>
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
          <Marcas>{dict.indyaApple}</Marcas>
        </Row>

        <Row idx="(04)" name="TheTool" year="2021" emphasizeImpact boldYear>
          <Marcas>{dict.thetoolAcquired}</Marcas>
          <Badge tone="purple" kind="label" className="exit-chip ml-2">
            {dict.exitChip}
          </Badge>
        </Row>

        <Row idx="(05)" name="TheTool" year="2019">
          <Marcas>{dict.thetoolNomination}</Marcas>
        </Row>
      </div>
    </section>
  );
}
