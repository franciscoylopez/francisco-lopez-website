import { type Dictionary } from "@/app/[lang]/dictionaries";
import { eyebrowVariants, titleVariants } from "@/components/ui/heading";
import { PANEL, SECTION, WRAP } from "@/components/ui/layout";
import { SPECIMEN_ROW } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { SectionHead, TypeMeta } from "./shared";

/* ===================== (05) TIPOGRAFÍA ===================== */
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
}: {
  t: Dictionary["designSystem"]["tipografia"];
}) {
  return (
    <section data-reveal className={SECTION}>
      <div className={WRAP}>
        <SectionHead num={t.num} title={t.title} />
        <p className="text-muted-foreground m-0 mb-10 max-w-[var(--measure)] text-[0.95rem]">
          {t.lead}
        </p>
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
                  {row.sample}
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
      </div>
    </section>
  );
}
