import { cn } from "@/lib/utils";
import { type Dictionary } from "@/app/[lang]/dictionaries";
import { SectionHeader, titleVariants } from "@/components/ui/heading";
import { SECTION, WRAP } from "@/components/ui/layout";
import { RevealDemo } from "../design-system-islands";

/* ===================== (07) MOVIMIENTO ===================== */
// Glifo del nav (§07 transición) — split/flat dimensionado por altura.
function NavGlyph({
  variant,
  h,
  className,
}: {
  variant: "split" | "flat";
  h: number;
  className?: string;
}) {
  const w = +((h * 58) / 70).toFixed(2);
  return variant === "split" ? (
    <svg
      viewBox="0 0 58 70"
      width={w}
      height={h}
      fill="none"
      className={cn("block flex-none overflow-visible", className)}
      aria-hidden="true"
    >
      <circle
        cx="26.45"
        cy="26.45"
        r="26"
        stroke="var(--brand-cyan-split)"
        strokeWidth="6"
      />
      <circle
        cx="31.55"
        cy="31.55"
        r="26"
        stroke="var(--brand-purple-split)"
        strokeWidth="6"
      />
      <circle
        cx="29"
        cy="29"
        r="26"
        stroke="var(--foreground)"
        strokeWidth="6"
      />
      <rect
        x="11.5"
        y="64"
        width="35"
        height="6"
        rx="3"
        fill="var(--foreground)"
      />
    </svg>
  ) : (
    <svg
      viewBox="0 0 58 70"
      width={w}
      height={h}
      fill="none"
      className={cn("block flex-none overflow-visible", className)}
      aria-hidden="true"
    >
      <circle
        cx="29"
        cy="29"
        r="26"
        stroke="var(--foreground)"
        strokeWidth="6"
      />
      <rect
        x="11.5"
        y="64"
        width="35"
        height="6"
        rx="3"
        fill="var(--foreground)"
      />
    </svg>
  );
}

export function Movimiento({
  t,
}: {
  t: Dictionary["designSystem"]["movimiento"];
}) {
  return (
    <section data-reveal className={SECTION}>
      <div className={WRAP}>
        <SectionHeader eyebrow={t.num} title={t.title} size="section-sm">
          {/* Era la única sección del sitio sin prosa de ningún tipo: abría con
              una palabra y una tabla de duraciones. La entradilla es nueva y su
              trabajo es presentar esa tabla (P37.695). */}
          <p className="text-muted-foreground m-0 mb-10 max-w-[var(--measure)] text-[0.95rem]">
            {t.lead}
          </p>
        </SectionHeader>
        <div className="flex flex-wrap gap-10">
          <div className="min-w-[min(100%,18rem)] flex-[1_1_20rem]">
            <div className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-[0.6rem] text-[0.9rem]">
              {t.timings.map((tm) => (
                <div key={tm.k} className="contents">
                  <span className="text-foreground font-mono">{tm.k}</span>
                  <span className="text-muted-foreground">{tm.v}</span>
                </div>
              ))}
            </div>
            <ul className="text-muted-foreground m-0 mt-6 flex list-disc flex-col gap-2 pl-[1.1rem] text-[0.88rem]">
              {t.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
          <div className="min-w-[min(100%,16rem)] flex-[1_1_18rem]">
            <RevealDemo demoLabel={t.demoLabel} replayLabel={t.replay} />
          </div>
        </div>

        {/* transición del nav */}
        <div className="border-border mt-11 border-t border-dashed pt-9">
          <h3 className={cn(titleVariants({ size: "sub-sm" }), "mb-5")}>
            {t.navTitle}
          </h3>
          <div className="flex flex-wrap gap-10">
            <ul className="text-muted-foreground m-0 flex min-w-[min(100%,18rem)] flex-[1_1_20rem] list-disc flex-col gap-[0.55rem] pl-[1.1rem] text-[0.9rem] leading-[1.6]">
              {t.navBullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <div className="flex min-w-[min(100%,15rem)] flex-[1_1_16rem] flex-col gap-[0.85rem]">
              <div className="border-border bg-background flex h-20 items-center justify-between gap-4 rounded-lg border px-5">
                <span className="inline-flex items-center gap-[0.6rem]">
                  {/* PILOTO SCROLL-DRIVEN (P70.26). Los dos estados siguen
                      dibujados a la vez; lo único que añade el scroll es la
                      escala, así que la figura no pierde nada donde la técnica
                      no llega. El porqué de la elección y sus dos capas de
                      degradación están en `globals.css`. */}
                  <NavGlyph variant="split" h={48} className="nav-demo-split" />
                  <span className="font-display text-foreground text-[1.05rem] font-semibold tracking-[-0.01em]">
                    Francisco López
                  </span>
                </span>
                <span className="text-muted-foreground font-mono text-[0.68rem]">
                  {t.navState1}
                </span>
              </div>
              <div className="border-border bg-background flex h-16 items-center justify-between gap-4 rounded-lg border px-5">
                <NavGlyph variant="flat" h={28} className="nav-demo-flat" />
                <span className="text-muted-foreground font-mono text-[0.68rem]">
                  {t.navState2}
                </span>
              </div>
              <p className="text-muted-foreground m-0 mt-[0.1rem] text-[0.8rem]">
                {t.navFoot}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
