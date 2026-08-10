import { type Dictionary } from "@/app/[lang]/dictionaries";
import { SectionHeader } from "@/components/ui/heading";
import { CARD, SECTION, WRAP } from "@/components/ui/layout";
import { DataTable, TD, TR } from "@/components/ui/table";
import { breakpointRange } from "@/lib/design-values";
import { cn } from "@/lib/utils";

/* ===================== (03) BREAKPOINTS ===================== */
export function Breakpoints({
  t,
}: {
  t: Dictionary["designSystem"]["breakpoints"];
}) {
  return (
    <section data-reveal className={SECTION}>
      <div className={WRAP}>
        <SectionHeader eyebrow={t.num} title={t.title} size="section-sm" />
        {/* La entradilla estaba escrita, pero al PIE de la sección, bajo la
            tabla: era una nota a lo que ya habías leído en vez de la frase que
            te prepara para leerlo. Sube a su sitio (P37.695). */}
        <p className="text-muted-foreground m-0 mt-4 mb-10 max-w-[var(--measure)] text-[0.95rem]">
          {t.lead}
        </p>
        {/* tabla ≥md */}
        <DataTable
          caption={t.title}
          cols={[
            { label: t.cols.token, width: "23%" },
            { label: t.cols.ctx, width: "26%" },
            { label: t.cols.change },
          ]}
          className="hidden md:block"
        >
          {t.rows.map((bp) => (
            <TR key={bp.token}>
              <TD head>
                <code className="text-foreground font-mono text-[0.9rem] font-semibold">
                  {bp.token}
                </code>
                <span className="text-muted-foreground mt-[0.15rem] block text-[0.78rem]">
                  {breakpointRange(bp.token)}
                </span>
              </TD>
              <TD className="text-[0.88rem] font-medium">{bp.ctx}</TD>
              <TD className="text-muted-foreground text-[0.88rem]">
                {bp.change}
              </TD>
            </TR>
          ))}
        </DataTable>
        {/* tarjetas <md */}
        <div className="flex flex-col gap-[0.85rem] md:hidden">
          {t.rows.map((bp) => (
            <div key={bp.token} className={cn(CARD, "px-5 py-[1.1rem]")}>
              <div className="flex items-baseline justify-between gap-4">
                <code className="text-foreground font-mono text-[0.95rem] font-semibold">
                  {bp.token}
                </code>
                <span className="text-muted-foreground text-[0.8rem]">
                  {breakpointRange(bp.token)}
                </span>
              </div>
              <div className="mt-[0.35rem] text-[0.9rem] font-medium">
                {bp.ctx}
              </div>
              <p className="text-muted-foreground m-0 mt-[0.4rem] text-[0.86rem]">
                {bp.change}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
