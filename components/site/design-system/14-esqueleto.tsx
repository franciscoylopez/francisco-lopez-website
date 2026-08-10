import { type Dictionary } from "@/app/[lang]/dictionaries";
import { SECTION, WRAP } from "@/components/ui/layout";
import { DevicePreview } from "../design-system-islands";
import { SectionHead } from "./shared";

/* ===================== (14) ESQUELETO ===================== */
export function Esqueleto({
  t,
}: {
  t: Dictionary["designSystem"]["esqueleto"];
}) {
  return (
    <section
      data-reveal
      // Misma familia que la fila cebra: la sección se pinta su propio velo de
      // `--card` y por eso tiene que declararlo (P37.6565).
      data-surface="card"
      className={SECTION}
      style={{
        background: "color-mix(in srgb, var(--card), transparent 45%)",
      }}
    >
      <div className={WRAP}>
        <div className="mb-10 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-4">
          <SectionHead num={t.num} title={t.title} />
        </div>
        <p className="text-muted-foreground m-0 mb-8 max-w-[var(--measure)] text-[0.95rem]">
          {t.lead}
        </p>
        <p className="text-muted-foreground border-primary m-0 mb-8 max-w-[var(--measure)] border-l-2 pl-[0.9rem] text-[0.88rem] md:hidden">
          {t.mobileNote}
        </p>
        <DevicePreview
          groupLabel={t.devGroupLabel}
          devFull={t.devFull}
          devTablet={t.devTablet}
          devMobile={t.devMobile}
          rows={t.rows}
        />
      </div>
    </section>
  );
}
