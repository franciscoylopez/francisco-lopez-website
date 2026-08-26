import { type Dictionary } from "@/app/[lang]/dictionaries";
import {
  dataLabelVariants,
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
import { GroupHead, SpecimenCard, TypeMeta, type SeccionMarco } from "./shared";
import { Marcas } from "@/components/ui/marcas";

/* ===================== TIPOGRAFÍA Y CABECERAS =====================
    Fusión de las antiguas 05 (tipografía) y 11 (cabeceras), P70.34. Eran una
    ESCALA y su APLICACIÓN, y separadas contestaban dos veces «cómo de grande es
    un titular», a 187 y a 873 palabras. Primero la tabla de niveles, después el
    componente que la usa.

    EL SUBAPARTADO DEL GRIS SE FUE A §04: enseñaba que el atenuado lo pone la
    superficie donde cae el texto, y eso es claro y oscuro, no tipografía. */

/** Guarda para el tamaño de titular que llega desde el diccionario. */
function isTitleSize(value: string): value is keyof typeof EYEBROW_GAP {
  return value in EYEBROW_GAP;
}
// Especímenes de la escala tipográfica (§05). Un espécimen es explícito a
// propósito —está para demostrar cada propiedad, así que la escribe— pero los
// tres niveles que YA son una variante del sistema se COMPONEN desde ella en vez
// de reescribir su valor: si la variante cambia, el espécimen cambia con ella y
// no puede mentir. Lo que el espécimen añade encima es lo que quiere enseñar y la
// variante no fija (la familia y el interlineado del eyebrow, que hereda).
//
// Los niveles h2–h4, body y small no tienen variante todavía: son la escala en
// crudo, y por eso siguen escritos. Cuando alguno se convierta en variante, su
// entrada aquí pasa a componerse igual (P37.66).
const SAMPLE: Record<string, string> = {
  display: titleVariants({ size: "page" }),
  h1: titleVariants({ size: "section-sm" }),
  h2: "font-display font-semibold text-[clamp(1.5rem,3vw,2rem)] leading-[1.15] tracking-[-0.015em]",
  h3: "font-display font-semibold text-[clamp(1.125rem,1.6vw,1.25rem)] leading-[1.3]",
  h4: "font-display font-semibold text-[1rem] leading-[1.4]",
  bodyL:
    "font-sans font-normal text-[clamp(1.0625rem,1.5vw,1.125rem)] leading-[1.6]",
  body: "font-sans font-normal text-[1rem] leading-[1.65]",
  small:
    "font-sans font-normal text-[0.875rem] leading-[1.5] text-muted-foreground",
  eyebrow: cn(eyebrowVariants(), "font-sans leading-[1.4]"),
};

export function Tipografia({
  t,
  marco,
}: {
  t: Dictionary["designSystem"]["tipografia"];
  marco: SeccionMarco;
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
        {/* `PANEL` y no su copia a mano: este contenedor era literalmente
            `PANEL` menos el `bg-card`, así que era la única de las seis tablas
            del sitio apoyada en el fondo de la página. Con la cebra encima no se
            notaba —el velo de las filas pares fingía la superficie que faltaba—;
            al quitarla quedó a la vista. El drift no lo introdujo la cebra: lo
            tapaba. */}
        <div className={PANEL}>
          {t.rows.map((row) => (
            <div key={row.name} className={SPECIMEN_ROW}>
              <div className="min-w-[min(100%,14rem)] flex-[1_1_16rem] overflow-hidden">
                <span className={cn("text-foreground block", SAMPLE[row.kind])}>
                  <Marcas>{row.sample}</Marcas>
                </span>
              </div>
              <div className="grid flex-[2_1_26rem] [grid-template-columns:repeat(auto-fit,minmax(6.5rem,1fr))] content-start gap-x-5 gap-y-[0.9rem]">
                <TypeMeta label={t.cols.level} value={row.name} />
                <TypeMeta label={t.cols.font} value={row.font} />
                <TypeMeta label={t.cols.desktop} value={row.desktop} mono />
                <TypeMeta label={t.cols.mobile} value={row.mobile} mono />
                <TypeMeta label={t.cols.lh} value={row.lh} mono />
                <TypeMeta label={t.cols.use} value={row.use} muted />
              </div>
            </div>
          ))}
        </div>

        {/* ---------- la capa de cabecera que aplica la escala ---------- */}
        {/* Los SIETE tamaños, renderizados con las variantes REALES. Van sobre
            <span> y <p>, no sobre <h1>/<h2>: un espécimen no debe entrar en el
            esquema de encabezados de la página —un lector de pantalla los
            anunciaría como secciones que no existen—, que es el mismo motivo por
            el que la escala de arriba se enseña en <span>.

            EL RÓTULO SE PINTA SOLO SI LO HAY: `card`, `sub` y `sub-sm` son los
            que en el sitio van SIN rótulo encima, así que dibujarles uno aquí
            enseñaría una composición que la página real no tiene. Su
            `EYEBROW_GAP` sí se publica, porque el valor existe en la capa. */}
        <GroupHead title={t.sizesTitle} lead={t.sizesLead} />
        <div className={PANEL}>
          {t.sizes.map((sz) => {
            if (!isTitleSize(sz.size)) return null;
            return (
              <div key={sz.size} className={SPECIMEN_ROW}>
                <div className="min-w-[min(100%,14rem)] flex-[1_1_18rem] overflow-hidden">
                  {sz.eyebrow ? (
                    <p className={cn(eyebrowVariants(), EYEBROW_GAP[sz.size])}>
                      {sz.eyebrow}
                    </p>
                  ) : null}
                  <span
                    className={cn(
                      titleVariants({ size: sz.size }),
                      "text-foreground block",
                    )}
                  >
                    {sz.sample}
                  </span>
                </div>
                <div className="grid flex-[1_1_16rem] [grid-template-columns:repeat(auto-fit,minmax(7.5rem,1fr))] content-start gap-x-5 gap-y-[0.9rem]">
                  <TypeMeta label="gap" value={EYEBROW_GAP[sz.size]} mono />
                  <TypeMeta label="lead" value={LEAD_GAP[sz.size]} mono />
                  <TypeMeta label={t.sizesCols.use} value={sz.use} muted />
                </div>
              </div>
            );
          })}
        </div>

        {/* LOS DOS RÓTULOS EN VERSALITAS van EMPAREJADOS porque el hallazgo era
            justo que se parecen. Cada demo trae SU composición natural, que es lo
            único que los distingue de verdad: el eyebrow con el titular debajo y
            su hueco derivado; el rótulo de dato con el dato debajo, sin hueco que
            derivar. Sueltos, uno junto a otro, serían dos cadenas casi iguales. */}
        <GroupHead title={t.labelTitle} lead={t.labelLead} />
        <div className={PAIR}>
          <SpecimenCard
            kicker={t.labelEyebrowKicker}
            cls="eyebrowVariants"
            rule={t.labelEyebrowRule}
            wide
          >
            <div>
              <p className={cn(eyebrowVariants(), EYEBROW_GAP.sub)}>
                {t.labelEyebrowSample}
              </p>
              <span className={cn(titleVariants({ size: "sub" }), "block")}>
                {t.labelEyebrowTitle}
              </span>
            </div>
          </SpecimenCard>
          <SpecimenCard
            kicker={t.labelDataKicker}
            cls="dataLabelVariants"
            rule={t.labelDataRule}
            wide
          >
            {/* La ficha del deep-dive, que es de donde salió la cadena: la
                etiqueta y su valor, sin titular por medio. */}
            <dl className="m-0">
              <dt className={cn(dataLabelVariants(), "mb-1")}>
                {t.labelDataSample}
              </dt>
              <dd className="text-foreground m-0 text-[0.95rem]">
                {t.labelDataValue}
              </dd>
            </dl>
          </SpecimenCard>
        </div>

        {/* LA DEMO ES LA FILA DE VERDAD, con los valores de `design-values.ts`:
            es la misma que abre esta página, así que se puede comprobar
            subiendo. Trae su propio hueco superior, que es parte de lo que la
            pieza resuelve. La ficha va SIN `children` porque meter la fila dentro
            de un marco enseñaría una composición que el sitio no tiene. */}
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
        <div className={cn(PAIR, "mt-8")}>
          <SpecimenCard
            kicker={t.stat.kicker}
            cls={t.stat.cls}
            rule={t.stat.rule}
          />
          <InfoCard title={t.ruleTitle} bullets={t.rule} />
        </div>
        {marco.closer}
      </div>
    </section>
  );
}
