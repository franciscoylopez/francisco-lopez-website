import { Menu, Moon } from "lucide-react";
import { SectionHeader } from "@/components/ui/heading";
import { type Dictionary } from "@/app/[lang]/dictionaries";
import { actionVariants } from "@/components/ui/action";
import { chromeLinkVariants } from "@/components/ui/chrome";
import { CARD, SECTION, WRAP } from "@/components/ui/layout";
import { cn } from "@/lib/utils";

/* ===================== (08) ENLACES ===================== */
export function Enlaces({ t }: { t: Dictionary["designSystem"]["enlaces"] }) {
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
              {/* Demo vivo: el hover real de cada clase, no una captura. */}
              <div className="bg-background flex min-h-[7.5rem] items-center justify-center px-5 py-7">
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
        <div
          className={cn(CARD, "mt-8 max-w-[var(--measure)] px-[1.4rem] py-5")}
        >
          <h3 className="font-display m-0 mb-[0.6rem] text-[1rem] font-semibold">
            {t.ruleTitle}
          </h3>
          <ul className="text-muted-foreground m-0 flex list-disc flex-col gap-2 pl-[1.1rem] text-[0.9rem] leading-[1.6]">
            {t.rule.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <p className="text-muted-foreground m-0 mt-[0.9rem] text-[0.85rem] leading-[1.6]">
            {t.ruleFoot}
          </p>
        </div>
      </div>
    </section>
  );
}
