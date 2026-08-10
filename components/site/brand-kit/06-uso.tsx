import { type Dictionary } from "@/app/[lang]/dictionaries";
import { SectionHeader } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { LinkedinIcon } from "@/components/ui/icons";
import { PANEL, SECTION, WRAP } from "@/components/ui/layout";
import { cn } from "@/lib/utils";
import { Glyph, LEAD } from "./shared";

/* ===================== 06 USO ===================== */
// Visuales antes/después de los 7 errores (§06). Reutilizan el glifo salvo los
// casos con formas ajenas (favicon 16 engordado, LinkedIn, muestras de color).
function ErrorVisual({
  index,
  side,
}: {
  index: number;
  side: "before" | "after";
}) {
  const before = side === "before";
  switch (index) {
    case 0: // viewBox: flat en caja de 80px, 23px vs 40px
      return (
        <span
          className={cn(
            "inline-flex h-20 w-20 items-center justify-center rounded-md",
            before
              ? "border-border border border-dashed"
              : "border-primary border",
          )}
        >
          <Glyph variant="flat" h={before ? 23 : 40} />
        </span>
      );
    case 1: // split @24 vs flat<48/split>=48
      return (
        <span className="flex h-[52px] items-end">
          <Glyph variant="split" h={before ? 24 : 48} />
        </span>
      );
    case 2: // favicon: 32-reescalado (trazo fino) vs dedicado 16 (trazo grueso)
      return before ? (
        <svg
          viewBox="31 17 58 70"
          width="58"
          height="70"
          fill="none"
          className="block"
          aria-hidden="true"
        >
          <circle
            cx="60"
            cy="46"
            r="26"
            stroke="var(--foreground)"
            strokeWidth="3.5"
          />
          <rect
            x="43.5"
            y="82.5"
            width="33"
            height="3.5"
            rx="1.75"
            fill="var(--foreground)"
          />
        </svg>
      ) : (
        <svg
          viewBox="0 0 80 80"
          width="70"
          height="70"
          fill="none"
          className="block"
          aria-hidden="true"
        >
          <g transform="translate(-20,-12)">
            <circle
              cx="60"
              cy="46"
              r="26"
              stroke="var(--foreground)"
              strokeWidth="10"
            />
            <rect
              x="42"
              y="82"
              width="36"
              height="5"
              rx="2.5"
              fill="var(--foreground)"
            />
          </g>
        </svg>
      );
    case 3: // peso: logo pequeño vs mayor, junto a LinkedIn
      // El vecino es el LinkedIn DEL SITIO (icons.tsx), no un dibujo propio de
      // esta ilustración. Era el relleno macizo —el que P37.5989 sustituyó por no
      // leerse en el footer—, así que la comparación se hacía contra un icono que
      // en el sitio ya no existe: la ilustración defendía su regla usando como
      // referencia algo que no está en ninguna pantalla. Mismo fallo que la luna y
      // el menú de la demo de chrome, una capa más sutil (P37.5993).
      return (
        <span className="text-muted-foreground inline-flex items-center gap-[0.65rem]">
          <Glyph variant="flat" h={before ? 15 : 25} />
          <LinkedinIcon className="size-[18px]" />
        </span>
      );
    case 4: // lockup 29% vs ~60%
      return (
        <span className="inline-flex items-center gap-[0.5rem]">
          <Glyph variant="flat" h={before ? 48 : 40} />
          <span
            className={cn(
              "font-display font-semibold tracking-[-0.01em]",
              before ? "text-[0.75rem]" : "text-[1.15rem]",
            )}
          >
            Francisco López
          </span>
        </span>
      );
    case 5: // círculo dentro del círculo
      return before ? (
        <span className="border-border bg-background inline-flex h-[72px] w-[72px] items-center justify-center rounded-full border">
          <Glyph variant="flat" h={25} />
        </span>
      ) : (
        <span className="inline-flex h-[72px] w-[72px] items-center justify-center">
          <Glyph variant="flat" h={60} />
        </span>
      );
    case 6: // colores desviados vs tokens
      return before ? (
        <span className="inline-flex gap-[0.4rem]">
          <span
            className="border-border h-[34px] w-[34px] rounded-md border"
            style={{ background: "#CFEFEE" }}
          />
          <span
            className="border-border h-[34px] w-[34px] rounded-md border"
            style={{ background: "#E6E0FB" }}
          />
        </span>
      ) : (
        <span className="inline-flex gap-[0.4rem]">
          <span className="border-border bg-brand-cyan-soft h-[34px] w-[34px] rounded-md border" />
          <span className="border-border bg-brand-purple-soft h-[34px] w-[34px] rounded-md border" />
        </span>
      );
    default:
      return null;
  }
}

export function Uso({ t }: { t: Dictionary["brandKit"]["uso"] }) {
  return (
    <section className={SECTION}>
      <div className={WRAP}>
        <div
          data-reveal
          className="mb-[clamp(2.5rem,5vw,4rem)] max-w-[var(--measure)]"
        >
          <SectionHeader eyebrow={t.num} title={t.title} size="section" />
          <p className={LEAD}>{t.lead}</p>
        </div>
        <div data-reveal className="flex flex-col gap-[var(--gutter)]">
          {t.cases.map((c, i) => (
            <div
              key={c.title}
              className={cn(
                PANEL,
                "grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,22rem),1fr))]",
              )}
            >
              <div className="grid grid-cols-2">
                <div className="border-border flex flex-col items-center justify-center gap-3 border-r px-4 py-7">
                  <ErrorVisual index={i} side="before" />
                  <span className="text-muted-foreground text-[0.7rem] font-semibold tracking-[0.05em] uppercase">
                    {c.before}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center gap-3 px-4 py-7">
                  <ErrorVisual index={i} side="after" />
                  <span className="text-primary text-[0.7rem] font-semibold tracking-[0.05em] uppercase">
                    {c.after}
                  </span>
                </div>
              </div>
              <div className="border-border border-t p-[clamp(1.35rem,3vw,1.85rem)]">
                <h3 className="font-display m-0 mb-[0.6rem] text-[1.2rem] font-semibold tracking-[-0.01em]">
                  {c.title}
                </h3>
                <Badge tone="purple" kind="code" className="mb-[0.7rem]">
                  {c.chip}
                </Badge>
                <p className="text-muted-foreground m-0 mb-[0.55rem] text-[0.9rem] leading-[1.6]">
                  {c.desc}
                </p>
                <p className="text-foreground m-0 text-[0.9rem] leading-[1.6]">
                  <strong className="font-semibold">{t.fixLabel}</strong>{" "}
                  {c.fix}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
