import { Download } from "lucide-react";

import { BrandLogoBox } from "./brand-logo-box";

type TrayRow = {
  period: string;
  role: string;
  company: string;
  desc: string;
};

export type TrayectoriaDict = {
  eyebrow: string;
  title: string;
  cta: string;
  productoLabel: string;
  productoIntro: string;
  shutappTitle: string;
  shutappPeriod: string;
  shutappSubtitle: string;
  previoLabel: string;
  previoIntro: string;
  producto: TrayRow[];
  nested: TrayRow[];
  previo: TrayRow[];
};

// Los nombres de archivo de logo son datos (mapeados por posición); null = fila
// sin logo (Havas · Increnta · Miss Conversion, §8.5).
const PRODUCTO_LOGOS = [
  "companies/emendu",
  "companies/kuotip",
  "companies/indya",
  "companies/freepik",
];
const NESTED_LOGOS = ["companies/thetool", "companies/pickaso"];
const PREVIO_LOGOS: (string | null)[] = ["companies/ontecnia", null];

function LogoCell({ name }: { name: string | null }) {
  if (!name) return null;
  return (
    <span className="hidden justify-self-end md:block">
      <BrandLogoBox name={name} />
    </span>
  );
}

function Row({ row, logo }: { row: TrayRow; logo: string | null }) {
  return (
    <div className="tray-grid border-border border-b py-[clamp(1.35rem,3vw,1.85rem)]">
      <p className="text-muted-foreground m-0 pt-[0.15rem] text-[0.9rem] whitespace-nowrap [font-variant-numeric:tabular-nums]">
        {row.period}
      </p>
      <div>
        <div className="font-display text-[clamp(1.05rem,1.6vw,1.3rem)] leading-[1.2] font-semibold tracking-[-0.01em]">
          {row.role}
        </div>
        <div className="text-muted-foreground mt-1 text-[0.9rem]">
          {row.company}
        </div>
        <p className="text-muted-foreground m-0 mt-[0.7rem] max-w-[60ch] text-[0.92rem] leading-[1.6] text-pretty">
          {row.desc}
        </p>
      </div>
      <LogoCell name={logo} />
    </div>
  );
}

function NestedRow({ row, logo }: { row: TrayRow; logo: string | null }) {
  return (
    <div className="tray-grid-nested relative">
      {/* conector horizontal hacia el borde vertical del contenedor */}
      <span
        aria-hidden="true"
        className="bg-border absolute top-[0.55rem] h-0.5"
        style={{
          left: "calc(-1 * clamp(1rem, 2.5vw, 1.75rem) - 2px)",
          width: "clamp(0.75rem, 2vw, 1.15rem)",
        }}
      />
      <p className="text-muted-foreground m-0 pt-[0.15rem] text-[0.85rem] whitespace-nowrap [font-variant-numeric:tabular-nums]">
        {row.period}
      </p>
      <div>
        <div className="font-display text-[clamp(0.98rem,1.4vw,1.15rem)] leading-[1.2] font-semibold tracking-[-0.01em]">
          {row.role}
        </div>
        <div className="text-muted-foreground mt-[0.2rem] text-[0.88rem]">
          {row.company}
        </div>
        <p className="text-muted-foreground m-0 mt-[0.6rem] max-w-[58ch] text-[0.9rem] leading-[1.6] text-pretty">
          {row.desc}
        </p>
      </div>
      <LogoCell name={logo} />
    </div>
  );
}

// Trayectoria (PRD §8.5). Dos bloques (Producto / Marketing & Growth). Shutapp
// Projects es fila padre con TheTool y PICKASO anidados, conectados por un borde
// vertical. Logo por fila (oculto en móvil, D7). CTA secundario de descarga de CV.
export function Trayectoria({
  dict,
  cvHref,
}: {
  dict: TrayectoriaDict;
  cvHref: string;
}) {
  return (
    <section
      id="trayectoria"
      className="border-border border-t py-[var(--section-y)]"
    >
      <div className="mx-auto max-w-[var(--container)] px-[var(--page-x)]">
        <div
          data-reveal
          className="mb-[clamp(2.5rem,5vw,4rem)] max-w-[var(--measure)]"
        >
          <p className="text-muted-foreground m-0 mb-3 text-[0.8125rem] font-semibold tracking-[0.09em] uppercase">
            {dict.eyebrow}
          </p>
          <h2 className="font-display m-0 text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.022em]">
            {dict.title}
          </h2>
        </div>

        {/* Bloque Producto: intro + CTA */}
        <div
          data-reveal
          className="mb-[clamp(1.5rem,3vw,2.25rem)] flex flex-wrap items-start justify-between gap-x-10 gap-y-5"
        >
          <div className="min-w-[min(100%,20rem)] flex-[1_1_30rem]">
            <p className="text-muted-foreground m-0 mb-2 text-[0.72rem] font-semibold tracking-[0.08em] uppercase">
              {dict.productoLabel}
            </p>
            <p className="m-0 max-w-[64ch] text-[clamp(1rem,1.4vw,1.15rem)] leading-[1.6] text-pretty">
              {dict.productoIntro}
            </p>
          </div>
          <a
            href={cvHref}
            download
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground inline-flex min-h-[44px] flex-none items-center gap-[0.55rem] rounded-md border px-[1.35rem] text-[0.92rem] font-semibold transition-colors"
          >
            <Download className="size-[17px]" aria-hidden="true" />
            {dict.cta}
          </a>
        </div>

        <div data-reveal className="border-border border-t">
          {dict.producto.map((row, i) => (
            <Row key={row.company} row={row} logo={PRODUCTO_LOGOS[i] ?? null} />
          ))}

          {/* Shutapp Projects — fila padre con roles anidados */}
          <div className="border-border border-b py-[clamp(1.35rem,3vw,1.85rem)]">
            <div className="tray-grid">
              <p className="text-muted-foreground m-0 pt-[0.15rem] text-[0.9rem] whitespace-nowrap [font-variant-numeric:tabular-nums]">
                {dict.shutappPeriod}
              </p>
              <div>
                <div className="font-display text-[clamp(1.05rem,1.6vw,1.3rem)] leading-[1.2] font-semibold tracking-[-0.01em]">
                  {dict.shutappTitle}
                </div>
                <div className="text-muted-foreground mt-1 text-[0.9rem]">
                  {dict.shutappSubtitle}
                </div>
              </div>
            </div>
            <div
              className="border-border mt-[1.15rem] flex flex-col gap-[1.35rem] border-l-2"
              style={{
                marginLeft: "clamp(0.5rem, 3vw, 1.5rem)",
                paddingLeft: "clamp(1rem, 2.5vw, 1.75rem)",
              }}
            >
              {dict.nested.map((row, i) => (
                <NestedRow
                  key={row.company}
                  row={row}
                  logo={NESTED_LOGOS[i] ?? null}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bloque Experiencia previa */}
        <div aria-hidden="true" className="h-[clamp(3.5rem,7vw,6rem)]" />
        <div
          aria-hidden="true"
          className="border-foreground mb-[clamp(2rem,4vw,3rem)] border-t-2 opacity-[0.28]"
        />
        <p
          data-reveal
          className="text-muted-foreground m-0 mb-2 text-[0.72rem] font-semibold tracking-[0.08em] uppercase"
        >
          {dict.previoLabel}
        </p>
        <p
          data-reveal
          className="m-0 mb-[clamp(1.5rem,3vw,2.25rem)] max-w-[64ch] text-[clamp(1rem,1.4vw,1.15rem)] leading-[1.6] text-pretty"
        >
          {dict.previoIntro}
        </p>
        <div data-reveal className="border-border border-t">
          {dict.previo.map((row, i) => (
            <Row key={row.company} row={row} logo={PREVIO_LOGOS[i] ?? null} />
          ))}
        </div>
      </div>
    </section>
  );
}
