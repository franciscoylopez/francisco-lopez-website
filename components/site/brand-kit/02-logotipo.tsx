import { Download, Palette } from "lucide-react";

import { type Dictionary } from "@/app/[lang]/dictionaries";
import { actionVariants } from "@/components/ui/action";
import { SectionHeader, titleVariants } from "@/components/ui/heading";
import { Badge } from "@/components/ui/badge";
import { CARD, PAIR, PANEL, SECTION, WRAP } from "@/components/ui/layout";
import { DataTable, TD, TR } from "@/components/ui/table";
import { paletteHex, SPLIT_MIN_PX } from "@/lib/design-values";
import {
  HREF_KIT,
  PIEZAS,
  type Pieza,
  type Preview,
  svgDe,
} from "@/lib/logo-kit";
import { cn } from "@/lib/utils";
import { Glyph, LEAD } from "./shared";

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

// Qué plato pide cada previsualización. Los mono se ven sobre el fondo para el que
// existen, no sobre el del tema, y eso lo decide la pieza, no el punto de uso.
const SUPERFICIE_DE: Record<Preview, keyof typeof PREVIEW_SURFACE> = {
  split: "card",
  flat: "card",
  "mono-negro": "white",
  "mono-blanco": "ink",
};

/**
 * Lo que se pinta en el marco de cada tarjeta. Sale de la pieza y no del punto de
 * uso: el símbolo split y el lockup split se DIBUJAN igual y lo que cambia es si va
 * acompañado del wordmark, así que las dos preguntas viven juntas o no se entienden.
 */
function Especimen({ pieza }: { pieza: Pieza }) {
  const variant = pieza.preview === "split" ? "split" : "flat";
  if (pieza.esLockup) return <Lockup variant={variant} />;

  const mono =
    pieza.preview === "mono-negro"
      ? "black"
      : pieza.preview === "mono-blanco"
        ? "white"
        : undefined;
  return <Glyph variant={variant} h={96} mono={mono} />;
}

/** «1024, 512 y 256», con la conjunción que ponga el diccionario. */
function enumera(xs: (string | number)[], y: string): string {
  if (xs.length <= 1) return String(xs[0] ?? "");
  return `${xs.slice(0, -1).join(", ")} ${y} ${xs[xs.length - 1]}`;
}

/** Los tamaños de PNG que lleva el kit. Todas las piezas tienen los mismos. */
function listaPngs(y: string): string {
  return enumera([...(PIEZAS[0]?.pngs ?? [])], y);
}

/**
 * Qué añade el kit por encima del SVG suelto. Se COMPONE con la plantilla del
 * diccionario y los números de `lib/logo-kit.ts`: escrito a mano en dos idiomas se
 * desincronizaría del disco sin que nada fallara.
 *
 * Y ANUNCIA LA TINTA DEL SUELTO. Es la diferencia entera con lo que había antes: el
 * SVG tiene dos tintas igual que el PNG, así que un chip suelto tiene que contestar
 * cuál da. Antes lo contestaba el tema del sitio, en silencio.
 */
function EnElKit({
  pieza,
  t,
}: {
  pieza: Pieza;
  t: Dictionary["brandKit"]["logotipo"]["enElKit"];
}) {
  const partes = [t.png.replace("{tamanos}", enumera([...pieza.pngs], t.y))];
  if (pieza.dosTintas) partes.push(t.dosTintas);

  return (
    <p className="text-muted-foreground m-0 mt-[0.75rem] text-[0.8rem] leading-[1.5]">
      {pieza.dosTintas ? `${t.tintaSuelta} ` : null}
      <span className="text-foreground font-semibold">{t.prefijo}</span>{" "}
      {enumera(partes, t.y)}.
    </p>
  );
}

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

        {/* EL KIT COMPLETO. Es la acción destacada de la sección y por eso la única
            `solid` de la página: el reparto que ordena esto (P70.27) es que la
            TARJETA da la pieza canónica y el KIT da las variaciones. El icono va
            primero en el JSX y es la variante quien lo manda detrás.

            EL GLIFO QUE ROTULA LA TARJETA VA EN `foreground`, NO EN `primary`. No es
            una acción ni un estado: en esta marca el cian es el color de acción y
            nada más, y la acción de esta tarjeta ya es el botón. */}
        <div
          data-reveal
          className="border-border bg-card mb-[clamp(2rem,4vw,3rem)] flex flex-col gap-[1.1rem] rounded-xl border p-[clamp(1.5rem,3vw,2.25rem)] sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="max-w-[44ch]">
            <div className="mb-[0.35rem] flex items-center gap-[0.6rem]">
              <Palette className="text-foreground size-[18px]" aria-hidden />
              <span className="font-display text-[1.15rem] font-semibold">
                {t.kit.title}
              </span>
            </div>
            <p className="text-muted-foreground m-0 text-[0.92rem] leading-[1.55]">
              {t.kit.body.replace("{formatos}", listaPngs(t.enElKit.y))}
            </p>
          </div>
          <a
            href={HREF_KIT}
            download
            className={cn(
              actionVariants({ variant: "solid", size: "lg" }),
              "shrink-0",
            )}
          >
            <Download />
            {t.kit.cta}
          </a>
        </div>

        {/* LAS SEIS PIEZAS. Salían de seis bloques escritos a mano, cada uno con sus
            cuatro chips: 29 chips en la página, 49 anclas, y VEINTE de ellas en
            `display:none` porque la tinta la elegía el tema del sitio (P70.27).
            Ahora la lista es una (`lib/logo-kit.ts`), la recorre un bucle, y lo que
            el kit añade sobre el SVG suelto se COMPONE con la plantilla del
            diccionario en vez de escribirse en dos idiomas. */}
        {[0, 2, 4].map((desde) => (
          <div
            key={desde}
            data-reveal
            className={cn(
              PAIR,
              desde === 4 ? "mb-[clamp(3rem,6vw,5rem)]" : "mb-[var(--gutter)]",
            )}
          >
            {PIEZAS.slice(desde, desde + 2).map((pieza) => {
              const card = t.cards[pieza.id as keyof typeof t.cards];
              return (
                <VariantCard
                  key={pieza.id}
                  glyph={<Especimen pieza={pieza} />}
                  name={card.name}
                  meta={card.meta}
                  surface={SUPERFICIE_DE[pieza.preview]}
                >
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={svgDe(pieza)}
                      download
                      className={actionVariants({
                        variant: "outline-primary",
                        size: "sm",
                      })}
                    >
                      <Download />
                      {t.descargarSvg}
                    </a>
                  </div>
                  <EnElKit pieza={pieza} t={t.enElKit} />
                </VariantCard>
              );
            })}
          </div>
        ))}

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
