import { type Dictionary } from "@/app/[lang]/dictionaries";
import { SectionHeader } from "@/components/ui/heading";
import { PANEL, SECTION, WRAP } from "@/components/ui/layout";
import { type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import {
  Callout,
  Dl,
  DlThemed,
  favPair,
  Glyph,
  LEAD,
  pngPair,
  svgPair,
} from "./shared";

/* ===================== 05 APLICACIONES ===================== */
export function Aplicaciones({
  t,
  lang,
}: {
  t: Dictionary["brandKit"]["aplicaciones"];
  lang: Locale;
}) {
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
        <div
          data-reveal
          className="mb-8 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,17rem),1fr))] gap-[var(--gutter)]"
        >
          {/* favicon */}
          <div className={cn(PANEL, "p-[clamp(1.4rem,3vw,1.9rem)]")}>
            <div className="font-display mb-[0.35rem] text-[1.15rem] font-semibold">
              {t.favicon.title}
            </div>
            <p className="text-muted-foreground m-0 mb-[1.2rem] text-[0.88rem] leading-[1.55]">
              {t.favicon.desc}
            </p>
            <div className="mb-[1.2rem] flex items-end gap-6">
              {[48, 32, 16].map((sz) => (
                <div key={sz} className="flex flex-col items-center gap-2">
                  <span
                    className="border-border bg-background inline-flex items-center justify-center border"
                    style={{
                      width: `${sz}px`,
                      height: `${sz}px`,
                      borderRadius: sz >= 48 ? 8 : sz >= 32 ? 6 : 4,
                    }}
                  >
                    <Glyph variant="flat" h={Math.round(sz * 0.62)} />
                  </span>
                  <span className="text-muted-foreground font-mono text-[0.72rem]">
                    {sz}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Dl href="/logo-kit/favicon/favicon.ico" tone="primary">
                {t.favicon.ico}
              </Dl>
              <DlThemed pair={favPair(32)}>PNG 32</DlThemed>
              <DlThemed pair={favPair(16)}>PNG 16</DlThemed>
            </div>
          </div>

          {/* OG / redes */}
          <div className={cn(PANEL, "p-[clamp(1.4rem,3vw,1.9rem)]")}>
            <div className="font-display mb-[0.35rem] text-[1.15rem] font-semibold">
              {t.og.title}
            </div>
            <p className="text-muted-foreground m-0 mb-[1.2rem] text-[0.88rem] leading-[1.55]">
              {t.og.desc}
            </p>
            {/* Preview = la imagen OG real generada (/api/og), no un mockup: es
                la misma que se sirve a las redes, así que no puede divergir. De
                fondo de marca fijo (no conmuta con el tema, como la OG real). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/og?card=brand-kit&lang=${lang}`}
              width={1200}
              height={630}
              alt={t.og.previewAlt}
              className="border-border mb-[1.2rem] block w-full rounded-lg border"
            />
            {/* Mismo orden y misma jerarquía que las otras cuatro tarjetas de
                descarga: el SVG es la pieza canónica y va en `primary`; los PNG
                son la alternativa y van en neutro. Aquí estaban al revés —PNG
                1024 destacado y el SVG de chip pequeño— sin motivo: el lockup
                que se descarga es el mismo. */}
            <div className="flex flex-wrap gap-2">
              <DlThemed pair={svgPair("lockup-split")} tone="primary">
                {t.og.dlSvg}
              </DlThemed>
              <DlThemed pair={pngPair("lockup-split", 1024)}>PNG 1024</DlThemed>
            </div>
          </div>
        </div>
        <Callout data-reveal accent="primary">
          {t.pngNote}
        </Callout>
      </div>
    </section>
  );
}
