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
      {/* `<time>` y no `<span>` (P67.6): el año ya es un dato legible por
          máquina —cuatro cifras son una fecha ISO 8601 válida—, así que servirlo
          como texto suelto era tirar información que ya se tenía. El elemento no
          pinta nada distinto; `.hito-anio` sigue siendo quien anima el filete. */}
      <time
        dateTime={year}
        className={cn(
          "hito-anio text-foreground ml-auto shrink-0 font-mono text-[0.9rem] [grid-area:year]",
          boldYear && "font-semibold",
        )}
      >
        {year}
      </time>
    </div>
  );
}

/**
 * EL AÑO DE CADA HITO, EN UN SITIO. Estaba escrito en el JSX de cada fila, que
 * era su único consumidor; desde que el `Person` de la home marca los
 * reconocimientos son dos, y un año que se escribe dos veces es el modo de fallo
 * de D57/D58 con otro traje.
 */
const ANIO = {
  emendu: "2026",
  indyaMetricas: "2023",
  indyaApple: "2022",
  thetoolExit: "2021",
  thetoolNominacion: "2019",
} as const;

/**
 * LOS DOS HITOS QUE ADEMÁS SON UN RECONOCIMIENTO, para el `award` del nodo
 * `Person` (P82).
 *
 * SON DOS DE CINCO, Y NO LOS CINCO, que es donde la tarea se corrigió a sí
 * misma. `award` en Schema.org es «un premio ganado por o para esta entidad», y
 * de los cinco hitos solo dos lo son: la selección de Apple y la nominación del
 * App Promotion Summit. Los otros tres son un partnership, dos cifras de churn y
 * activación, y una adquisición: hechos ciertos y publicados, pero ninguno es un
 * premio. Marcarlos como `award` habría sido publicar marcado falso para llenar
 * una propiedad, que es exactamente lo que D157 prohíbe (mismo criterio que
 * descartó `codeRepository` en el `WebSite` y `SearchAction` en un sitio sin
 * buscador).
 *
 * El exit no se pierde: lo cuenta la sección, su chip y el deep-dive de TheTool.
 * Lo que no tiene es una propiedad de `Person` donde quepa sin mentir.
 *
 * SALE DEL DICCIONARIO Y DE `ANIO`, o sea de lo mismo que pinta la fila: si el
 * copy de un hito cambia, el marcado cambia con él.
 */
export function awardsOf(dict: HitosDict): string[] {
  const sinPunto = (t: string) => t.replace(/\.$/, "");
  // Campo · campo · campo, que es el separador que fija `CLAUDE.md` §copy. Con
  // paréntesis, el segundo saldría anidado dentro de los suyos: «… (App Promotion
  // Summit) (TheTool, 2019)».
  return [
    `${sinPunto(dict.indyaApple)} · INDYA · ${ANIO.indyaApple}`,
    `${sinPunto(dict.thetoolNomination)} · TheTool · ${ANIO.thetoolNominacion}`,
  ];
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

        <Row idx="(01)" name="Emendu" year={ANIO.emendu}>
          <Marcas>{dict.emenduImpact}</Marcas>
        </Row>

        <Row idx="(02)" name="INDYA" year={ANIO.indyaMetricas}>
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

        <Row idx="(03)" name="INDYA" year={ANIO.indyaApple}>
          <Marcas>{dict.indyaApple}</Marcas>
        </Row>

        <Row
          idx="(04)"
          name="TheTool"
          year={ANIO.thetoolExit}
          emphasizeImpact
          boldYear
        >
          <Marcas>{dict.thetoolAcquired}</Marcas>
          <Badge tone="purple" kind="label" className="exit-chip ml-2">
            {dict.exitChip}
          </Badge>
        </Row>

        <Row idx="(05)" name="TheTool" year={ANIO.thetoolNominacion}>
          <Marcas>{dict.thetoolNomination}</Marcas>
        </Row>
      </div>
    </section>
  );
}
