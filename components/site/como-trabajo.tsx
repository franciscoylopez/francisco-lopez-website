import { SECTION, WRAP } from "@/components/ui/layout";
import { SectionHeader } from "@/components/ui/heading";

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
            <SectionHeader eyebrow={dict.eyebrow} title={dict.title} />
            <p className="text-muted-foreground mt-[1.4rem] max-w-[32ch] text-base leading-[1.6]">
              {dict.intro}
            </p>
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
                {/* `bg-card` y no el velo `color-mix(--card 70%, transparent)`
                    que llevaba antes: era esta misma superficie escrita a mano y
                    aclarada un poco (en oscuro se separaban tres pasos de RGB,
                    en claro ni eso), pero al no ser la utilidad quedaba fuera de
                    `--surface-dim` y el número se quedaba con el atenuado de la
                    página — 6,62:1 en oscuro, por debajo de AAA (P37.6565). Es el
                    caso de manual de por qué la superficie sale de la capa. */}
                <div className="border-border bg-card text-muted-foreground flex h-10 w-10 flex-none items-center justify-center rounded-md border font-mono text-[0.85rem]">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="min-w-[min(100%,14rem)] flex-[1_1_16rem]">
                  <h3 className="font-display m-0 mb-[0.4rem] text-[clamp(1.25rem,2vw,1.6rem)] leading-[1.2] font-semibold tracking-[-0.015em]">
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
