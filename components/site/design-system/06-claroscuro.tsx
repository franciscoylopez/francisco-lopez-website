import { Download } from "lucide-react";
import { type Dictionary } from "@/app/[lang]/dictionaries";
import { CARD, SECTION, WRAP } from "@/components/ui/layout";
import { PALETTE, paletteHex } from "@/lib/design-values";
import { cn } from "@/lib/utils";
import { SectionHead } from "./shared";

/* ===================== (06) CLARO / OSCURO ===================== */
// Tarjeta de tema fijo (§06): muestra claro y oscuro con la paleta literal,
// independiente del tema activo, para enseñar ambas superficies a la vez.
function ThemeCard({
  variant,
  modeLabel,
  headline,
  cta,
}: {
  variant: "light" | "dark";
  modeLabel: string;
  headline: string;
  cta: string;
}) {
  // Los dieciocho valores que había aquí escritos a mano —nueve por tema— salen
  // de `PALETTE` (P37.6605). El mock no puede usar `var(--…)` porque pinta las
  // DOS paletas a la vez y las CSS vars solo dan la del tema activo; lo que no
  // podía era tener su propia copia: el cian claro llevaba días en el valor
  // anterior a P37.598, o sea que la página que documenta el sistema de color
  // enseñaba justo el color que se corrigió por publicar un AAA que no cumplía.
  // Ahora `npm run check:palette` no deja que vuelva a pasar.
  const p = PALETTE[variant];
  const c = {
    border: p.border,
    bg: p.background,
    fg: p.foreground,
    eyebrow: p["muted-foreground"],
    innerBorder: p.border,
    innerBg: p.card,
    bar: p.muted,
    btnBg: p.primary,
    btnFg: p["primary-foreground"],
  };

  // El pie de la tarjeta cita tres hexes. Estaban escritos en el diccionario —los
  // mismos seis caracteres en ES y en EN, o sea que nunca fueron copy (D38)— y DOS
  // de los seis mentían: `#E7E4DD` y `#2C333B` por `#E2DED4` y `#2E353C`. Los
  // destapó una captura de esta misma pantalla mientras se arreglaba el cian de
  // arriba, no una auditoría: nadie los había contado como copias de un token
  // porque son texto, no color, y ninguna herramienta compara un párrafo con el
  // píxel que tiene al lado. Ahora se derivan del mismo sitio que los pinta.
  const hex = paletteHex(variant);
  const caption = `bg ${hex.background} · card ${hex.card} · border ${hex.border}`;

  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{ borderColor: c.border, background: c.bg, color: c.fg }}
    >
      <div className="flex flex-col gap-4 px-6 py-[1.4rem]">
        <span
          className="text-[0.72rem] tracking-[0.06em] uppercase"
          style={{ color: c.eyebrow }}
        >
          {modeLabel}
        </span>
        <span className="font-display text-[1.6rem] leading-[1.05] font-semibold">
          {headline}
        </span>
        <div
          className="rounded-lg border p-4"
          style={{ borderColor: c.innerBorder, background: c.innerBg }}
        >
          <div
            className="mb-2 h-[0.7rem] w-[70%] rounded-full"
            style={{ background: c.bar }}
          />
          <div
            className="h-[0.7rem] rounded-full"
            style={{ background: c.bar }}
          />
        </div>
        {/* El CTA del mock lleva su icono, y no por decoración: la acción es
            «Descargar CV», que saca al usuario de la página, así que por la regla
            de §Cuándo una acción lleva icono le toca — y en la variante `solid` va
            DETRÁS de la etiqueta. Sin él, esta maqueta enseñaba un botón que el
            sitio no tiene, que es justo lo que la Fase 0 de `design-review` busca.
            Lo que NO lleva es hover ni el empujón de 2px: es un `<span>`, no se
            pulsa, y darle afordancia de control sería mentir en el otro sentido. */}
        <span
          className="inline-flex min-h-9 items-center gap-[0.5rem] self-start rounded-md px-[0.9rem] text-[0.82rem] font-medium"
          style={{ background: c.btnBg, color: c.btnFg }}
        >
          {cta}
          <Download className="size-4 shrink-0" />
        </span>
      </div>
      <div
        className="border-t px-6 py-[0.65rem] font-mono text-[0.72rem]"
        style={{ borderColor: c.border, color: c.eyebrow }}
      >
        {caption}
      </div>
    </div>
  );
}

export function Claroscuro({
  t,
}: {
  t: Dictionary["designSystem"]["claroscuro"];
}) {
  return (
    <section data-reveal className={SECTION}>
      <div className={WRAP}>
        <SectionHead num={t.num} title={t.title} />
        <p className="text-muted-foreground m-0 mb-10 max-w-[var(--measure)] text-[0.95rem]">
          {t.lead}
        </p>
        <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr))] gap-[var(--gutter)]">
          <ThemeCard
            variant="light"
            modeLabel={t.lightLabel}
            headline={t.sampleHeadline}
            cta={t.cta}
          />
          <ThemeCard
            variant="dark"
            modeLabel={t.darkLabel}
            headline={t.sampleHeadline}
            cta={t.cta}
          />
        </div>
        <div
          className={cn(CARD, "mt-6 max-w-[var(--measure)] px-[1.4rem] py-5")}
        >
          <h3 className="font-display m-0 mb-[0.6rem] text-[1rem] font-semibold">
            {t.ruleTitle}
          </h3>
          <ul className="text-muted-foreground m-0 flex list-disc flex-col gap-2 pl-[1.1rem] text-[0.9rem] leading-[1.6]">
            {t.rule.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <p className="text-muted-foreground m-0 mt-[0.9rem] text-[0.85rem]">
            {t.ruleFoot}
          </p>
        </div>
      </div>
    </section>
  );
}
