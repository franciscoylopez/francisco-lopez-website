export type MasAllaDict = {
  eyebrow: string;
  line1a: string;
  exitWord: string;
  line1b: string;
  line2: string;
};

// Más allá del PM (PRD §8.3). Banda de manifiesto con fondo invertido (bg =
// foreground, texto = background), simétrica en ambos temas. "Exit" y el divisor
// usan --brand-purple-accent (AA-large verificado sobre fondos invertidos). Los
// textos apagados se mezclan en sRGB para no perder el tono (ver Nav).
export function MasAlla({ dict }: { dict: MasAllaDict }) {
  return (
    <section
      id="mas-alla"
      className="bg-foreground text-background py-[clamp(5rem,11vw,9.5rem)]"
    >
      <div className="mx-auto max-w-[var(--container)] px-[var(--page-x)]">
        <p
          data-reveal
          className="m-0 mb-[clamp(1.75rem,4vw,3rem)] text-[0.8125rem] font-semibold tracking-[0.11em] uppercase"
          style={{
            color: "color-mix(in srgb, var(--background) 58%, transparent)",
          }}
        >
          {dict.eyebrow}
        </p>
        <p
          data-reveal
          className="font-display m-0 max-w-[20ch] text-[clamp(1.9rem,4.6vw,3.75rem)] leading-[1.12] font-semibold tracking-[-0.022em] text-pretty"
        >
          {dict.line1a}
          <span style={{ color: "var(--brand-purple-accent)" }}>
            {dict.exitWord}
          </span>
          {dict.line1b}
        </p>
        <div
          data-reveal
          aria-hidden="true"
          className="my-[clamp(1.75rem,3.5vw,2.75rem)] h-0.5 w-14"
          style={{ background: "var(--brand-purple-accent)" }}
        />
        <p
          data-reveal
          className="font-display m-0 text-[clamp(1.125rem,1.6vw,1.25rem)] leading-[1.45] font-normal tracking-[0.01em] text-balance"
          style={{
            color: "color-mix(in srgb, var(--background) 78%, transparent)",
          }}
        >
          {dict.line2}
        </p>
      </div>
    </section>
  );
}
