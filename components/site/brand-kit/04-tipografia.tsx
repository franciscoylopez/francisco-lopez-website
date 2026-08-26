import { type Dictionary } from "@/app/[lang]/dictionaries";
import { SectionHeader } from "@/components/ui/heading";
import { PANEL, SECTION, WRAP } from "@/components/ui/layout";
import { cn } from "@/lib/utils";
import { LEAD } from "./shared";
import type { SeccionMarco } from "@/components/ui/section-index";

/* ===================== 04 TIPOGRAFÍA ===================== */
function TypeCard({
  face,
  data,
}: {
  face: "display" | "sans";
  data: { name: string; tag: string; desc: string };
}) {
  const fam = face === "display" ? "font-display" : "font-sans";
  return (
    <div className={cn(PANEL, "p-[clamp(1.5rem,3vw,2.25rem)]")}>
      <div
        className={cn(
          fam,
          "text-[clamp(4rem,9vw,6rem)] leading-[0.95] tracking-[-0.03em]",
          face === "display" ? "font-bold" : "font-semibold",
        )}
      >
        Aa
      </div>
      <div className="font-display mt-4 text-[1.4rem] font-semibold tracking-[-0.01em]">
        {data.name}
      </div>
      <p className="text-muted-foreground mt-2 mb-[1.1rem] text-[0.72rem] font-semibold tracking-[0.06em] uppercase">
        {data.tag}
      </p>
      <p className="text-muted-foreground m-0 mb-[1.1rem] text-[0.95rem] leading-[1.6] text-pretty">
        {data.desc}
      </p>
      <p
        className={cn(
          fam,
          "m-0 text-[1.25rem] font-semibold tracking-[-0.01em]",
        )}
      >
        ABCDEFGHIJKLM
        <br />
        abcdefghijklm 0123456789
      </p>
    </div>
  );
}

export function Tipografia({
  t,
  marco,
}: {
  t: Dictionary["brandKit"]["tipografia"];
  marco: SeccionMarco;
}) {
  return (
    <section id={marco.id} className={cn(SECTION, "scroll-mt-[5rem]")}>
      <div className={WRAP}>
        <div
          data-reveal
          className="mb-[clamp(2.5rem,5vw,4rem)] max-w-[var(--measure)]"
        >
          <SectionHeader eyebrow={marco.kicker} title={t.title} size="section">
            <p className={LEAD}>{t.lead}</p>
          </SectionHeader>
        </div>
        <div
          data-reveal
          className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,20rem),1fr))] gap-[var(--gutter)]"
        >
          <TypeCard face="display" data={t.bricolage} />
          <TypeCard face="sans" data={t.inter} />
        </div>
        {marco.closer}
      </div>
    </section>
  );
}
