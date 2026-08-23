import { ArrowRight, Download, Mail, Menu, Moon } from "lucide-react";
import { SectionHeader } from "@/components/ui/heading";
import { type Dictionary } from "@/app/[lang]/dictionaries";
import { actionVariants } from "@/components/ui/action";
import { InfoCard } from "@/components/ui/info-card";
import { PAIR, SECTION, WRAP } from "@/components/ui/layout";
import { cn } from "@/lib/utils";

/* ===================== (09) BOTONES Y ACCIONES =====================
    Hermana de (08): la otra mitad de la capa interactiva. Existe porque los
    enlaces eran coherentes y los botones no, y la diferencia era justo esta
    página — los enlaces habían hecho el recorrido regla → clase → sección
    publicada → uso, y los botones se habían quedado en el primer paso
    (P37.597). Los demos son los MISMOS `actionVariants` que usa el sitio: si
    una variante cambia, esta página cambia con ella y no puede mentir. */
export function Botones({ t }: { t: Dictionary["designSystem"]["botones"] }) {
  return (
    <section data-reveal className={SECTION}>
      <div className={WRAP}>
        <SectionHeader eyebrow={t.num} title={t.title} size="section-sm">
          <p className="text-muted-foreground m-0 mb-10 max-w-[var(--measure)] text-[0.95rem]">
            {t.lead}
          </p>
        </SectionHeader>
        <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,19rem),1fr))] items-start gap-[var(--gutter)]">
          {t.cases.map((c, i) => (
            <div
              key={c.cls}
              className="border-border overflow-hidden rounded-xl border"
            >
              <div className="bg-background flex min-h-[7.5rem] flex-wrap items-center justify-center gap-2 px-5 py-7">
                {/* Con su icono, como los botones reales de los que toman la
                    etiqueta: el de contacto de la home y el de Trayectoria. Lo
                    llevan porque las dos acciones sacan al usuario de la página
                    —una abre el correo, la otra descarga un archivo— y los de
                    utilidad no lo llevan porque se resuelven aquí dentro; es
                    exactamente la regla que la tarjeta explica al lado.
                    El tamaño, la posición y el empujón ya no se escriben aquí:
                    hasta P37.5988 este sólido llevaba su sobre a mano, detrás de
                    la etiqueta y SIN el empujón de 2px que sí tenía el botón real
                    —la página que documenta la variante enseñaba un botón que no
                    existía—. Ahora es el mismo `actionVariants` y no puede
                    mentir, que es el motivo entero de esta sección. */}
                {i === 0 && (
                  <a
                    href="#top"
                    className={actionVariants({ variant: "solid" })}
                  >
                    <ArrowRight aria-hidden="true" />
                    {t.demoSolid}
                  </a>
                )}
                {i === 1 && (
                  <a
                    href="#top"
                    className={actionVariants({ variant: "outline-primary" })}
                  >
                    <Download aria-hidden="true" />
                    {t.demoOutlinePrimary}
                  </a>
                )}
                {i === 2 && (
                  <>
                    <a
                      href="#top"
                      className={actionVariants({
                        variant: "outline-neutral",
                      })}
                    >
                      {t.demoNeutral}
                    </a>
                    <a
                      href="#top"
                      className={actionVariants({ variant: "ghost" })}
                    >
                      {t.demoGhost}
                    </a>
                  </>
                )}
                {/* Los dos casos con estado se muestran con <span>, no con
                    botones: su demostración es ver los dos estados A LA VEZ, y
                    un botón que no hace nada sería un control inerte y
                    focalizable puesto ahí solo para ilustrar. El hover sigue
                    funcionando —es CSS— así que no se pierde nada. */}
                {i === 3 && (
                  <>
                    <span
                      className={actionVariants({
                        variant: "toggle-primary",
                        on: true,
                        size: "sm",
                      })}
                    >
                      {t.stateOn}
                    </span>
                    <span
                      className={actionVariants({
                        variant: "toggle-primary",
                        on: false,
                        size: "sm",
                      })}
                    >
                      {t.stateOff}
                    </span>
                  </>
                )}
                {i === 4 &&
                  t.demoSegments.map((seg, j) => (
                    <span
                      key={seg}
                      className={actionVariants({
                        variant: "toggle-neutral",
                        on: j === 0,
                        size: "sm",
                      })}
                    >
                      {seg}
                    </span>
                  ))}
                {/* La tarjeta pulsable. Va con `wide` de facto —ocupa el ancho
                    de su celda— porque su demo es la caja entera, no un control
                    centrado: encogerla al centro enseñaría otra cosa.
                    `cn()` NO es decorativo aquí: `cva` concatena y no fusiona,
                    así que sin él ganaría el `font-semibold` de la base y la
                    demo saldría en negrita mientras la tarjeta real no. Es
                    exactamente el fallo que se cazó al construirla. */}
                {i === 6 && (
                  <a
                    href="#top"
                    className={cn(
                      actionVariants({ variant: "card", size: "card" }),
                      "max-w-[19rem]",
                    )}
                  >
                    <Mail
                      aria-hidden="true"
                      className="text-muted-foreground shrink-0"
                    />
                    <span className="min-w-0">
                      <span className="text-muted-foreground block text-[0.75rem] tracking-[0.06em] uppercase">
                        {t.demoCardLabel}
                      </span>
                      <span className="text-foreground block [overflow-wrap:anywhere]">
                        {t.demoCardValue}
                      </span>
                    </span>
                  </a>
                )}
                {i === 5 && (
                  <>
                    <a
                      href="#top"
                      aria-label={c.kicker}
                      className={actionVariants({
                        variant: "icon",
                        size: "icon",
                      })}
                    >
                      <Moon />
                    </a>
                    <a
                      href="#top"
                      aria-label={c.cls}
                      className={actionVariants({
                        variant: "icon",
                        size: "icon",
                      })}
                    >
                      <Menu />
                    </a>
                  </>
                )}
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
                  {c.note}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground m-0 mt-4 text-[0.8rem]">{t.hint}</p>
        {/* La regla del icono se publica aquí, no solo en BRAND.md (P37.5988).
            Es el paso que faltaba: los enlaces son difíciles de incumplir porque
            hicieron el recorrido completo regla → clase → sección publicada →
            uso, y esta parte del botón se había quedado en el primer paso.

            Las dos notas van en PAIR, no apiladas a la medida de lectura: son
            dos reglas hermanas —cuándo lleva icono, y que ninguna se escribe a
            mano— y apiladas dejaban media sección vacía a la derecha (P37.62). */}
        <div className={cn(PAIR, "mt-8")}>
          <InfoCard
            title={t.iconTitle}
            bullets={t.iconRule}
            foot={t.iconFoot}
          />
          <InfoCard title={t.ruleTitle} bullets={t.rule} foot={t.ruleFoot} />
        </div>
      </div>
    </section>
  );
}
