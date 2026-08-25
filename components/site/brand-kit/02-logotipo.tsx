import { type Dictionary } from "@/app/[lang]/dictionaries";
import { SectionHeader, titleVariants } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { CARD, PAIR, PANEL, SECTION, WRAP } from "@/components/ui/layout";
import { DataTable, TD, TR } from "@/components/ui/table";
import { paletteHex, SPLIT_MIN_PX } from "@/lib/design-values";
import { cn } from "@/lib/utils";
import {
  Dl,
  DlThemed,
  Glyph,
  monoPng,
  monoSvg,
  LEAD,
  pngPair,
  svgPair,
} from "./shared";

/* ===================== 02 LOGOTIPO ===================== */
// Superficie de la previsualización. `card` sigue al tema (es la del PANEL);
// `white` e `ink` NO conmutan a propósito — los assets mono son de una tinta pura
// y hay que verlos sobre el fondo para el que existen, no sobre el del tema. Es
// la excepción al «nunca hardcodees hex» de BRAND.md, y vive aquí, en la pieza,
// justamente para que ningún call site tenga que repetirla ni decidirla.
// El anillo interior no es adorno: sin él, en CADA tema uno de los dos platos
// desaparece dentro de la tarjeta —el blanco mide 1,04 contra `--card` en claro y
// el ink 1,11 en oscuro— y la tarjeta mono queda idéntica a la de al lado, que es
// justo la que enseña otra cosa. Su color se toma del plato, no se fija: es el
// `foreground` de su propio carril al 18%, el mismo patrón que la bolita del
// switch (D30). Medido: 1,45 claro / 1,78 oscuro, contra el 1,29 / 1,23 que ya da
// por bueno el `--border` del sitio sobre `--card`.
// El plato `ink` va como `style` y no como clase arbitraria (P37.659). Tailwind
// escanea el código como TEXTO PLANO, así que `bg-[${INK}]` no generaría ninguna
// clase y el plato se quedaría transparente sin dar error de compilación — es el
// punto 5 del método de `BRAND.md` §Accesibilidad. Un valor calculado solo puede
// llegar por `style`. `bg-white` sí puede quedarse: el blanco puro no es un token.
const INK = paletteHex("dark").background;

const PREVIEW_SURFACE = {
  card: { class: "", style: undefined },
  white: {
    class: "bg-white shadow-[inset_0_0_0_1px_rgba(25,29,33,0.18)]",
    style: undefined,
  },
  ink: {
    class: "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]",
    style: { background: INK },
  },
} as const;

function VariantCard({
  glyph,
  name,
  meta,
  surface = "card",
  children,
}: {
  glyph: React.ReactNode;
  name: string;
  meta: string;
  surface?: keyof typeof PREVIEW_SURFACE;
  children: React.ReactNode;
}) {
  return (
    <div className={cn(PANEL, "flex flex-col")}>
      <div
        className={cn(
          "border-border flex min-h-44 items-center justify-center border-b p-8",
          PREVIEW_SURFACE[surface].class,
        )}
        style={PREVIEW_SURFACE[surface].style}
      >
        {glyph}
      </div>
      <div className="flex flex-1 flex-col px-5 pt-[1.15rem] pb-[1.35rem]">
        <div className="font-display text-[1.05rem] font-semibold">{name}</div>
        <p className="text-muted-foreground mt-1 mb-[0.9rem] text-[0.82rem]">
          {meta}
        </p>
        <div className="mt-auto flex flex-col gap-2">{children}</div>
      </div>
    </div>
  );
}

function Lockup({ variant }: { variant: "split" | "flat" }) {
  return (
    <span className="inline-flex items-center gap-3">
      <Glyph variant={variant} h={60} />
      <span className="font-display text-[1.6rem] font-semibold tracking-[-0.01em] whitespace-nowrap">
        Francisco López
      </span>
    </span>
  );
}

function VariantBadge({
  on,
  children,
}: {
  on: boolean;
  children: React.ReactNode;
}) {
  return <Badge tone={on ? "purple" : "neutral"}>{children}</Badge>;
}

function UsageKV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-muted-foreground">{k}</span>
      <span className="text-right tabular-nums">{v}</span>
    </div>
  );
}

export function Logotipo({ t }: { t: Dictionary["brandKit"]["logotipo"] }) {
  return (
    <section className={SECTION}>
      <div className={WRAP}>
        <div
          data-reveal
          className="mb-[clamp(2.5rem,5vw,4rem)] max-w-[var(--measure)]"
        >
          <SectionHeader eyebrow={t.num} title={t.title} size="section">
            <p className={LEAD}>{t.lead}</p>
          </SectionHeader>
        </div>

        {/* Fila 1 — símbolo split / plano */}
        <div data-reveal className={cn(PAIR, "mb-[var(--gutter)]")}>
          <VariantCard
            glyph={<Glyph variant="split" h={96} />}
            name={t.cards.symSplit.name}
            meta={t.cards.symSplit.meta}
          >
            <div className="flex flex-wrap gap-2">
              <DlThemed pair={svgPair("simbolo-split")} tone="primary">
                {t.cards.symSplit.svg}
              </DlThemed>
            </div>
            <div className="flex flex-wrap gap-2">
              <DlThemed pair={pngPair("simbolo-split", 1024)}>
                PNG 1024
              </DlThemed>
              <DlThemed pair={pngPair("simbolo-split", 512)}>PNG 512</DlThemed>
              <DlThemed pair={pngPair("simbolo-split", 256)}>PNG 256</DlThemed>
            </div>
          </VariantCard>

          <VariantCard
            glyph={<Glyph variant="flat" h={96} />}
            name={t.cards.symPlano.name}
            meta={t.cards.symPlano.meta}
          >
            <div className="flex flex-wrap gap-2">
              <DlThemed pair={svgPair("simbolo-plano")} tone="primary">
                {t.cards.symPlano.svg}
              </DlThemed>
            </div>
            <div className="flex flex-wrap gap-2">
              <DlThemed pair={pngPair("simbolo-plano", 1024)}>
                PNG 1024
              </DlThemed>
              <DlThemed pair={pngPair("simbolo-plano", 512)}>PNG 512</DlThemed>
              <DlThemed pair={pngPair("simbolo-plano", 256)}>PNG 256</DlThemed>
            </div>
          </VariantCard>
        </div>

        {/* Fila 2 — símbolo mono: DOS tarjetas, no una partida. Hasta P37.61
            compartían un solo panel con la previsualización dividida en
            blanco/negro y ocho chips en dos filas etiquetadas. Era la única
            tarjeta de la fila escrita a mano —las hermanas ya salían de
            VariantCard—, así que no heredó el ensanchado de chips de P37.592 y
            sus dos filas se partieron en cuatro. Separarlas borra la excepción
            en vez de afinarla, y ponerlas en el MISMO par conserva lo que el
            panel partido sí hacía bien: enseñar las dos tintas juntas. */}
        <div data-reveal className={cn(PAIR, "mb-[var(--gutter)]")}>
          <VariantCard
            glyph={<Glyph variant="flat" h={96} mono="black" />}
            name={t.cards.symMonoNegro.name}
            meta={t.cards.symMonoNegro.meta}
            surface="white"
          >
            <div className="flex flex-wrap gap-2">
              <Dl href={monoSvg("simbolo-mono-negro")} tone="primary">
                {t.cards.symMonoNegro.svg}
              </Dl>
            </div>
            <div className="flex flex-wrap gap-2">
              <Dl href={monoPng("simbolo-mono-negro", 1024)}>PNG 1024</Dl>
              <Dl href={monoPng("simbolo-mono-negro", 512)}>PNG 512</Dl>
              <Dl href={monoPng("simbolo-mono-negro", 256)}>PNG 256</Dl>
            </div>
          </VariantCard>

          <VariantCard
            glyph={<Glyph variant="flat" h={96} mono="white" />}
            name={t.cards.symMonoBlanco.name}
            meta={t.cards.symMonoBlanco.meta}
            surface="ink"
          >
            <div className="flex flex-wrap gap-2">
              <Dl href={monoSvg("simbolo-mono-blanco")} tone="primary">
                {t.cards.symMonoBlanco.svg}
              </Dl>
            </div>
            <div className="flex flex-wrap gap-2">
              <Dl href={monoPng("simbolo-mono-blanco", 1024)}>PNG 1024</Dl>
              <Dl href={monoPng("simbolo-mono-blanco", 512)}>PNG 512</Dl>
              <Dl href={monoPng("simbolo-mono-blanco", 256)}>PNG 256</Dl>
            </div>
          </VariantCard>
        </div>

        {/* Fila 3 — lockups */}
        <div data-reveal className={cn(PAIR, "mb-[clamp(3rem,6vw,5rem)]")}>
          <VariantCard
            glyph={<Lockup variant="split" />}
            name={t.cards.lockSplit.name}
            meta={t.cards.lockSplit.meta}
          >
            <div className="flex flex-wrap gap-2">
              <DlThemed pair={svgPair("lockup-split")} tone="primary">
                {t.cards.lockSplit.svg}
              </DlThemed>
            </div>
            <div className="flex flex-wrap gap-2">
              <DlThemed pair={pngPair("lockup-split", 1024)}>PNG 1024</DlThemed>
              <DlThemed pair={pngPair("lockup-split", 512)}>PNG 512</DlThemed>
              <DlThemed pair={pngPair("lockup-split", 256)}>PNG 256</DlThemed>
            </div>
          </VariantCard>

          <VariantCard
            glyph={<Lockup variant="flat" />}
            name={t.cards.lockPlano.name}
            meta={t.cards.lockPlano.meta}
          >
            <div className="flex flex-wrap gap-2">
              <DlThemed pair={svgPair("lockup-plano")} tone="primary">
                {t.cards.lockPlano.svg}
              </DlThemed>
            </div>
            <div className="flex flex-wrap gap-2">
              <DlThemed pair={pngPair("lockup-plano", 1024)}>PNG 1024</DlThemed>
              <DlThemed pair={pngPair("lockup-plano", 512)}>PNG 512</DlThemed>
              <DlThemed pair={pngPair("lockup-plano", 256)}>PNG 256</DlThemed>
            </div>
          </VariantCard>
        </div>

        {/* Tabla de uso */}
        <div data-reveal className="mb-[clamp(3rem,6vw,5rem)]">
          <h3 className={cn(titleVariants({ size: "sub" }), "mb-[0.4rem]")}>
            {t.usage.title}
          </h3>
          <p className="text-muted-foreground m-0 mb-6 text-[0.95rem]">
            {t.usage.sub}
          </p>
          {/* tabla ≥md */}
          <DataTable
            caption={t.usage.title}
            cols={[
              { label: t.usage.cols.ctx, width: "29%" },
              { label: t.usage.cols.variant, width: "17%" },
              { label: t.usage.cols.sym, width: "18%" },
              { label: t.usage.cols.word, width: "21%" },
              { label: t.usage.cols.bar },
            ]}
            className="hidden md:block"
          >
            {t.usage.rows.map((r) => (
              <TR key={r.ctx}>
                <TD head className="text-[0.92rem] font-semibold">
                  {r.ctx}
                </TD>
                <TD>
                  <VariantBadge on={r.on}>{r.variant}</VariantBadge>
                </TD>
                <TD className="text-foreground text-[0.92rem] tabular-nums">
                  {r.sym}
                </TD>
                <TD className="text-muted-foreground text-[0.92rem]">
                  {r.word}
                </TD>
                <TD className="text-muted-foreground text-[0.92rem] tabular-nums">
                  {r.bar}
                </TD>
              </TR>
            ))}
          </DataTable>
          {/* tarjetas <md */}
          <div className="flex flex-col gap-[0.85rem] md:hidden">
            {t.usage.rows.map((r) => (
              <div key={r.ctx} className={cn(CARD, "p-4")}>
                <div className="mb-[0.7rem] flex items-center justify-between gap-3">
                  <span className="font-display text-[1.05rem] font-semibold">
                    {r.ctx}
                  </span>
                  <VariantBadge on={r.on}>{r.variant}</VariantBadge>
                </div>
                <div className="flex flex-col gap-[0.35rem] text-[0.88rem]">
                  <UsageKV k={t.usage.cols.sym} v={r.sym} />
                  <UsageKV k={t.usage.cols.word} v={r.word} />
                  <UsageKV k={t.usage.cols.bar} v={r.bar} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Las siete reglas */}
        <div data-reveal className="mb-[clamp(3rem,6vw,5rem)]">
          <h3 className={cn(titleVariants({ size: "sub" }), "mb-6")}>
            {t.rules.title}
          </h3>
          <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr))] gap-[var(--gutter)]">
            {t.rules.items.map((r, i) => (
              <div
                key={r.title}
                className={cn(CARD, "px-[1.4rem] py-[1.35rem]")}
              >
                <div className="mb-[0.6rem] flex items-center gap-[0.7rem]">
                  <span className="bg-foreground text-background inline-flex h-[1.9rem] w-[1.9rem] flex-none items-center justify-center rounded-md font-mono text-[0.85rem] font-semibold">
                    {i + 1}
                  </span>
                  <h4 className={titleVariants({ size: "sub-sm" })}>
                    {r.title}
                  </h4>
                </div>
                <p className="text-muted-foreground m-0 text-[0.9rem] leading-[1.6] text-pretty">
                  {r.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Escalera del split (regla 1) */}
        <div data-reveal className={cn(PANEL, "p-[clamp(1.5rem,3vw,2.5rem)]")}>
          <div className="mb-8 max-w-[var(--measure)]">
            <p className="text-muted-foreground m-0 mb-2 font-mono text-[0.78rem]">
              {t.ladder.kicker}
            </p>
            <h3 className={cn(titleVariants({ size: "card" }), "mb-[0.6rem]")}>
              {t.ladder.title}
            </h3>
            <p className="text-muted-foreground m-0 text-[0.92rem] leading-[1.6]">
              {t.ladder.lead}
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-[clamp(1.25rem,4vw,3rem)]">
            {[24, 32, 48, 64, 96].map((h) => {
              const works = h >= SPLIT_MIN_PX;
              return (
                <div
                  key={h}
                  className="flex flex-col items-center gap-[0.9rem]"
                >
                  <div className="flex h-24 items-end justify-center">
                    <Glyph variant="split" h={h} />
                  </div>
                  <div className="text-center">
                    <div className="font-mono text-[0.85rem] font-semibold">
                      {h}px
                    </div>
                    <div className="text-muted-foreground text-[0.72rem]">
                      {t.ladder.crescent}{" "}
                      {(h * 0.051).toFixed(1).replace(".", ",")}px
                    </div>
                    {/* El peldaño que no sirve se ATENÚA, no se tiñe (P37.657).
                        Llevaba `brand-purple-accent` a 10,88px sobre `--card`:
                        3,70 claro y 3,96 oscuro, o sea fallo de AA, y encima un
                        uso del token fuera de su regla (existe solo para fondos
                        invertidos y texto grande). Y no era cuestión de elegir
                        otro morado: el estándar da 2,81 en claro, peor todavía.
                        Ningún morado de esta marca es texto pequeño sobre una
                        tarjeta clara. `text-muted-foreground` da 9,14 y 10,32 sin
                        par nuevo —lo resuelve `--surface-dim` de la tarjeta
                        (D39)— y dice lo que hay que decir: este peldaño está
                        degradado, no en error. La distinción no queda codificada
                        por color: cada estado lleva su propia palabra. */}
                    <div
                      className={cn(
                        "mt-[0.35rem] text-[0.68rem] font-semibold tracking-[0.04em] uppercase",
                        works ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {works ? t.ladder.works : t.ladder.dirty}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
