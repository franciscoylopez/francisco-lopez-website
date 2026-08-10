import { type Dictionary } from "@/app/[lang]/dictionaries";
import { SectionHeader } from "@/components/ui/heading";
import { InfoCard } from "@/components/ui/info-card";
import { SECTION, WRAP } from "@/components/ui/layout";
import { DataTable, TD, TR } from "@/components/ui/table";

/* ===================== (12) TABLAS ===================== */
export function Tablas({ t }: { t: Dictionary["designSystem"]["tablas"] }) {
  return (
    <section data-reveal className={SECTION}>
      <div className={WRAP}>
        <SectionHeader eyebrow={t.num} title={t.title} size="section-sm">
          <p className="text-muted-foreground m-0 mb-10 max-w-[var(--measure)] text-[0.95rem]">
            {t.lead}
          </p>
        </SectionHeader>

        <h3 className="font-display m-0 mb-2 text-[1rem] font-semibold">
          {t.dataTitle}
        </h3>
        <p className="text-muted-foreground m-0 mb-4 max-w-[var(--measure)] text-[0.9rem] leading-[1.55]">
          {t.dataLead}
        </p>
        {/* La demo es una tabla de verdad y con la pieza de verdad: si la capa
            cambia, este espécimen cambia con ella y no puede mentir. */}
        <DataTable
          caption={t.dataTitle}
          cols={[
            { label: t.demoCols.part, width: "34%" },
            { label: t.demoCols.markup, width: "26%" },
            { label: t.demoCols.what },
          ]}
        >
          {t.demoRows.map((r) => (
            <TR key={r.markup}>
              <TD head className="text-foreground font-medium">
                {r.part}
              </TD>
              <TD>
                <code className="font-mono text-[0.85rem]">{r.markup}</code>
              </TD>
              <TD className="text-muted-foreground text-[0.88rem]">{r.what}</TD>
            </TR>
          ))}
        </DataTable>

        <div className="mt-8 max-w-[var(--measure)]">
          <InfoCard title={t.ruleTitle} bullets={t.rule} foot={t.ruleFoot} />
        </div>
      </div>
    </section>
  );
}
