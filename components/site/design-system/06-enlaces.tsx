import { Menu, Moon } from "lucide-react";
import { SectionHeader } from "@/components/ui/heading";
import { type Dictionary } from "@/app/[lang]/dictionaries";
import { InfoCard } from "@/components/ui/info-card";
import { actionVariants } from "@/components/ui/action";
import { chromeLinkVariants } from "@/components/ui/chrome";
import { SECTION, WRAP } from "@/components/ui/layout";
import { cn } from "@/lib/utils";

import { SpecimenCard, type SeccionMarco } from "./shared";

/* ===================== ENLACES ===================== */
export function Enlaces({
  t,
  marco,
}: {
  t: Dictionary["designSystem"]["enlaces"];
  marco: SeccionMarco;
}) {
  // EL CASO INVERTIDO VIVE EN `cases` desde P70.33 —es un caso más de la misma
  // familia y no una excepción con claves propias— pero se PINTA aparte y a lo
  // ancho, por el motivo que explica el comentario de más abajo. El corte va
  // aquí, en una línea, en vez de repartido por el JSX.
  const rejilla = t.cases.slice(0, -1);
  const invertido = t.cases[t.cases.length - 1]!;

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
        <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,19rem),1fr))] items-start gap-[var(--gutter)]">
          {rejilla.map((c, i) => (
            /* Demo vivo: el hover real de cada clase, no una captura. */
            <SpecimenCard
              key={c.cls}
              kicker={c.kicker}
              cls={c.cls}
              rule={c.rule}
              note={c.note}
            >
              {i === 0 && (
                <p className="m-0 text-center text-[0.95rem] leading-[1.7]">
                  {t.demoContentBefore}{" "}
                  <a href="#top" className="link-content">
                    {t.demoContentLink}
                  </a>{" "}
                  {t.demoContentAfter}
                </p>
              )}
              {i === 1 && (
                <div className="flex flex-wrap items-center justify-center gap-1">
                  {t.demoChromeItems.map((item) => (
                    <a
                      key={item}
                      href="#top"
                      className={cn(
                        chromeLinkVariants({ shape: "bar" }),
                        "text-[0.88rem]",
                      )}
                    >
                      {item}
                    </a>
                  ))}
                </div>
              )}
              {i === 2 && (
                <div className="flex items-center gap-1.5">
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
                </div>
              )}
              {/* El `tone: "inverted"` necesita SU superficie para demostrarse:
                    sobre el fondo de la página se vería igual que el chrome de al
                    lado. La banda es la demo, no un adorno — y lleva
                    `data-surface="inverted"` porque se pinta su propio fondo, que
                    es lo que permite a la capa recalcular el atenuado y la
                    pastilla (D39/D61). */}
              {i === 3 && (
                <div
                  data-surface="inverted"
                  className="bg-foreground -mx-5 -my-7 flex grow flex-wrap items-center justify-center gap-1 self-stretch px-5 py-7"
                >
                  {t.demoChromeItems.map((item) => (
                    <a
                      key={item}
                      href="#top"
                      className={cn(
                        chromeLinkVariants({
                          shape: "bar",
                          tone: "inverted",
                        }),
                        "text-[0.88rem]",
                      )}
                    >
                      {item}
                    </a>
                  ))}
                </div>
              )}
            </SpecimenCard>
          ))}
        </div>
        <p className="text-muted-foreground m-0 mt-4 text-[0.8rem]">{t.hint}</p>

        {/* La contraparte invertida del enlace de CONTENIDO (P70.18). Va aparte
            y a lo ancho, no como quinta tarjeta de la rejilla de arriba: con
            `minmax(19rem)` caben cuatro por fila y la quinta se quedaría sola
            dejando tres cuartos de fila vacíos, que es el mismo problema que
            documentó (10). Y a lo ancho es además como aparece de verdad: una
            banda ocupa la página entera, no un tercio.

            La banda se declara `data-surface="inverted"` y no elige ningún
            color: es lo que permite a la capa resolver el enlace, el atenuado y
            la pastilla de hover (D39/D61). */}
        <SpecimenCard
          kicker={t.invertedKicker}
          cls={invertido.cls}
          rule={invertido.rule}
          note={invertido.note}
          wide
        >
          <div
            data-surface="inverted"
            className="bg-foreground text-background rounded-lg px-[clamp(1.25rem,3vw,2rem)] py-8"
          >
            <p className="m-0 mx-auto max-w-[var(--measure)] text-[0.95rem] leading-[1.7]">
              {t.demoInvertedBefore}{" "}
              <a href="#top" className="link-content">
                {t.demoInvertedLink}
              </a>{" "}
              {t.demoInvertedAfter}
            </p>
          </div>
        </SpecimenCard>
        {/* SALE DE `InfoCard`, no de una caja a mano. Las dos secciones escribían
            este mismo bloque —tarjeta, titular `sub-sm`, lista y pie— con las
            mismas clases, y era lo que la pieza hace desde que existe. Lo cazó
            `qlty` al renombrarse los archivos: 16 líneas idénticas en dos sitios. */}
        <div className="mt-8 max-w-[var(--measure)]">
          <InfoCard title={t.ruleTitle} bullets={t.rule} foot={t.ruleFoot} />
        </div>
        {marco.closer}
      </div>
    </section>
  );
}
