import { SECTION, WRAP } from "@/components/ui/layout";
import { Tile } from "@/components/ui/tile";
import { SectionHeader, titleVariants } from "@/components/ui/heading";
import { cn } from "@/lib/utils";

export type ProcesoDict = {
  eyebrow: string;
  title: string;
  intro: string;
  steps: { title: string; desc: string }[];
};

// Cómo trabajo (PRD §8.2). Aside sticky en desktop + lista de 6 etapas. El número
// (01–06) es dato, no traducible → se deriva del índice. Responsive por CSS (D7):
// apila en móvil, aside sticky ≥md.
export function ComoTrabajo({ dict }: { dict: ProcesoDict }) {
  return (
    <section id="proceso" className={SECTION}>
      <div className={WRAP}>
        <div className="flex flex-col gap-[clamp(2rem,5vw,4rem)] md:flex-row">
          <div
            data-reveal
            className="min-w-[min(100%,17rem)] self-start md:sticky md:top-[5.5rem] md:flex-[1_1_18rem]"
          >
            <SectionHeader eyebrow={dict.eyebrow} title={dict.title}>
              <p className="text-muted-foreground max-w-[32ch] text-base leading-[1.6]">
                {dict.intro}
              </p>
            </SectionHeader>
          </div>

          <div className="border-border min-w-[min(100%,20rem)] border-t md:flex-[1.8_1_28rem]">
            {dict.steps.map((step, i) => (
              <div
                key={step.title}
                data-reveal
                className="border-border relative flex flex-wrap gap-x-8 gap-y-2 border-b py-[clamp(1.5rem,3vw,2.25rem)]"
              >
                <span
                  aria-hidden="true"
                  className="border-primary absolute top-[clamp(1.5rem,3vw,2.25rem)] right-0 h-[14px] w-[14px] border-t-2 border-r-2"
                />
                {/* La casilla sale de `Tile` desde P83.5: era la misma caja que
                    la del logo de marca, escrita aquí a mano, y por eso las dos
                    podían discrepar (y discrepaban, en tamaño y en relleno).
                    El `bg-card` que llevaba a mano se conserva porque es la
                    utilidad, no un velo: al velo `color-mix` que hubo antes lo
                    ignoraba `--surface-dim` y el número se quedaba con el
                    atenuado de la página, 6,62:1 en oscuro y por debajo de AAA
                    (P37.6565). Es el caso de manual de por qué la superficie
                    sale de la capa. */}
                <Tile className="text-muted-foreground font-mono text-[0.85rem]">
                  {String(i + 1).padStart(2, "0")}
                </Tile>
                <div className="min-w-[min(100%,14rem)] flex-[1_1_16rem]">
                  <h3
                    className={cn(
                      titleVariants({ size: "card" }),
                      "mb-[0.4rem]",
                    )}
                  >
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground m-0 max-w-[var(--measure)] text-[0.95rem] leading-[1.6]">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
