import { CheckPill } from "@/components/ui/check-pill";
import { SectionHeader, titleVariants } from "@/components/ui/heading";
import { type Dictionary } from "@/app/[lang]/dictionaries";
import { Badge } from "@/components/ui/badge";
import { CARD, SECTION, WRAP } from "@/components/ui/layout";
import { DataTable, TD, TR } from "@/components/ui/table";
import { isContrastId, levelOf, ratioText } from "@/lib/design-values";
import { type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

/* ===================== ACCESIBILIDAD ===================== */
// La marca de verificación del checklist ya NO se dibuja aquí: sale de
// `ui/check-pill.tsx` (P70.44). Estaba escrita a mano en esta sección y dos veces
// más en `/accesibilidad`, y son justo las dos páginas cuyo argumento es que el
// sistema es coherente: la que documenta el checklist no puede enseñar un check
// distinto del que pinta la página real.

function ContrastBadge({ lv }: { lv: string | null }) {
  if (!lv) return null;
  return (
    <Badge tone={lv === "AAA" ? "cyan" : "neutral"} className="ml-[0.35rem]">
      {lv}
    </Badge>
  );
}

import type { SeccionMarco } from "./shared";

export function Accesibilidad({
  t,
  marco,
  lang,
}: {
  t: Dictionary["designSystem"]["accesibilidad"];
  marco: SeccionMarco;
  lang: Locale;
}) {
  return (
    <section
      data-reveal
      id={marco.id}
      className={cn(SECTION, "scroll-mt-[5rem]")}
    >
      <div className={WRAP}>
        <SectionHeader eyebrow={marco.kicker} title={t.title} size="section-sm">
          <p className="text-muted-foreground m-0 mb-6 max-w-[var(--measure)] text-[0.95rem]">
            {t.lead}
          </p>
        </SectionHeader>

        <h3 className={cn(titleVariants({ size: "sub-sm" }), "mt-8 mb-4")}>
          {t.contrastTitle}
        </h3>
        <DataTable
          caption={t.contrastTitle}
          cols={[
            { label: t.contrastCols.measure, width: "50%" },
            { label: t.contrastCols.light, width: "25%" },
            { label: t.contrastCols.dark, width: "25%" },
          ]}
        >
          {t.contrastRows.map((r) => {
            // La fila la nombra el copy; la cifra y el nivel salen del censo.
            if (!isContrastId(r.id)) return null;
            const id = r.id;
            return (
              <TR key={r.id}>
                <TD head>
                  <span className="text-foreground font-medium">{r.label}</span>
                  <span className="text-muted-foreground mt-[0.15rem] block text-[0.78rem]">
                    {r.note}
                  </span>
                </TD>
                {(["light", "dark"] as const).map((theme) => (
                  <TD
                    key={theme}
                    className="text-foreground font-mono text-[0.9rem]"
                  >
                    {ratioText(id, theme, lang)}
                    <ContrastBadge lv={levelOf(id, theme)} />
                  </TD>
                ))}
              </TR>
            );
          })}
        </DataTable>
        <p className="text-muted-foreground m-0 mt-4 max-w-[var(--measure)] text-[0.85rem]">
          {t.contrastNote}
        </p>

        <h3 className={cn(titleVariants({ size: "sub-sm" }), "mt-10 mb-4")}>
          {t.checklistTitle}
        </h3>
        <ol className="m-0 grid list-none [grid-template-columns:repeat(auto-fill,minmax(min(100%,20rem),1fr))] gap-3 p-0">
          {t.checklist.map((c, i) => (
            <li
              key={c}
              className={cn(
                CARD,
                "flex items-start gap-[0.9rem] px-[1.15rem] py-4",
              )}
            >
              <CheckPill />
              <div className="flex-1">
                <span className="text-muted-foreground font-mono text-[0.72rem]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-foreground m-0 mt-[0.2rem] text-[0.9rem] leading-[1.55]">
                  {c}
                </p>
              </div>
            </li>
          ))}
        </ol>
        {marco.closer}
      </div>
    </section>
  );
}
