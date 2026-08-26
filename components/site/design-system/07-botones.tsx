import { ArrowRight, Download, Mail, Menu, Moon } from "lucide-react";
import { SectionHeader } from "@/components/ui/heading";
import { type Dictionary } from "@/app/[lang]/dictionaries";
import { ActionCardLines, actionVariants } from "@/components/ui/action";
import { InfoCard } from "@/components/ui/info-card";
import { PAIR, SECTION, WRAP } from "@/components/ui/layout";
import { cn } from "@/lib/utils";

import { FocusSimulator } from "@/components/site/design-system-islands";

import { VideoEmbed } from "@/components/ui/video-embed";
import { SpecimenCard, type SeccionMarco } from "./shared";

/* ===================== BOTONES Y ACCIONES =====================
    Hermana de (08): la otra mitad de la capa interactiva. Existe porque los
    enlaces eran coherentes y los botones no, y la diferencia era justo esta
    página — los enlaces habían hecho el recorrido regla → clase → sección
    publicada → uso, y los botones se habían quedado en el primer paso
    (P37.597). Los demos son los MISMOS `actionVariants` que usa el sitio: si
    una variante cambia, esta página cambia con ella y no puede mentir. */
export function Botones({
  t,
  marco,
}: {
  t: Dictionary["designSystem"]["botones"];
  marco: SeccionMarco;
}) {
  // La última ficha —el control sobre imagen, que absorbió la antigua §18— se
  // pinta aparte y a lo ancho: su demo es un vídeo y no cabe en una columna de
  // la rejilla. El corte va aquí, en una línea, y no repartido por el JSX.
  const rejilla = t.cases.slice(0, -1);
  const sobreImagen = t.cases[t.cases.length - 1]!;

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
        {/* Las dos formas de VER un estado, juntas y antes de los especímenes:
            el hover se enseña pasando el cursor, y el foco no se podía enseñar
            sin saber usar el teclado (P70.25). La pista de hover vivía debajo de
            la rejilla y sube aquí: son la misma instrucción dicha dos veces, y
            separadas la segunda no se leía como pareja de la primera. */}
        <FocusSimulator
          hint={t.hint}
          showLabel={t.focusShow}
          hideLabel={t.focusHide}
        >
          <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,19rem),1fr))] items-start gap-[var(--gutter)]">
            {rejilla.map((c, i) => (
              <SpecimenCard
                key={c.cls}
                kicker={c.kicker}
                cls={c.cls}
                rule={c.rule}
                note={c.note}
              >
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
                    {/* El interior sale de `ActionCardLines`, la misma pieza que
                        sirve los canales de `/contacto`. Estaba escrito aquí y
                        allí byte a byte, así que esta demo iba a empezar a mentir
                        en cuanto alguien tocara el rótulo — y sin que nada
                        avisara (design-review, 2026-08-23). */}
                    <ActionCardLines
                      icon={<Mail aria-hidden="true" />}
                      label={t.demoCardLabel}
                      value={t.demoCardValue}
                    />
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
              </SpecimenCard>
            ))}
          </div>
        </FocusSimulator>

        {/* EL CONTROL SOBRE IMAGEN, que es lo que queda de la antigua §18
            (P70.34). Va aparte y a lo ancho, no como novena tarjeta de la
            rejilla: su demo es un vídeo, y a 19rem de columna no se vería. Es el
            mismo criterio que usa §06 con el enlace sobre banda invertida.

            La demo es la pieza real y carga de verdad al pulsar, como en la
            página donde vive: una fachada con `href="#"` no comprobaría ni el
            velo ni el disco sobre la foto. */}
        <div className="mt-[var(--gutter)]">
          <SpecimenCard
            kicker={sobreImagen.kicker}
            cls={sobreImagen.cls}
            rule={sobreImagen.rule}
            note={sobreImagen.note}
            wide
          >
            <div className="mx-auto max-w-[40rem]">
              <VideoEmbed
                id="rf79VTlAdUM"
                poster="/img/thetool-video-poster.webp"
                title={t.demoVideoTitle}
                playLabel={t.demoPlayLabel}
              />
            </div>
          </SpecimenCard>
        </div>
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
          <InfoCard title={t.ruleTitle} bullets={t.rule} />
        </div>
        {marco.closer}
      </div>
    </section>
  );
}
