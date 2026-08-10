import { type Dictionary } from "@/app/[lang]/dictionaries";
import { SectionHeader } from "@/components/ui/heading";
import { SECTION, WRAP } from "@/components/ui/layout";
import { DevicePreview } from "../design-system-islands";

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
        {/* La cabecera va SUELTA, no dentro de un flex. `SectionHeader` devuelve un
            fragmento con dos hermanos —rótulo y titular—, así que un contenedor
            `flex justify-between` los convierte en dos ítems y los separa a los
            extremos de la fila: era el resto del envoltorio que aquí sostenía un
            control que hoy vive dentro de `DevicePreview`. */}
        <SectionHeader eyebrow={t.num} title={t.title} size="section-sm">
          <p className="text-muted-foreground m-0 mb-10 max-w-[var(--measure)] text-[0.95rem]">
            {t.lead}
          </p>
        </SectionHeader>
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
