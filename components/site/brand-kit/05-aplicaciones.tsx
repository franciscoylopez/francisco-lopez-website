import { Download } from "lucide-react";

import { type Dictionary } from "@/app/[lang]/dictionaries";
import { actionVariants } from "@/components/ui/action";
import { SectionHeader } from "@/components/ui/heading";
import { PANEL, SECTION, WRAP } from "@/components/ui/layout";
import { type Locale } from "@/lib/i18n/config";
import { FAVICON_PNGS, HREF_FAVICON_ICO } from "@/lib/logo-kit";
import { cn } from "@/lib/utils";
import { Callout, Glyph, LEAD } from "./shared";

/* ===================== 05 APLICACIONES ===================== */
export function Aplicaciones({
  t,
  tKit,
  lang,
}: {
  t: Dictionary["brandKit"]["aplicaciones"];
  /**
   * El copy de «qué añade el kit», que vive con la sección 02 porque es donde se
   * explica el reparto. Aquí llega como prop en vez de duplicarse: la misma frase
   * escrita en dos ramas del diccionario acabaría diciendo dos cosas.
   */
  tKit: Dictionary["brandKit"]["logotipo"]["enElKit"];
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
            {/* El `.ico` es la pieza canónica del favicon y es la que se ofrece
                suelta; sus dos PNG viajan en el kit, igual que los tamaños del
                resto de piezas (P70.27). */}
            <div className="flex flex-wrap gap-2">
              <a
                href={HREF_FAVICON_ICO}
                download
                className={actionVariants({
                  variant: "outline-primary",
                  size: "sm",
                })}
              >
                <Download />
                {t.favicon.ico}
              </a>
            </div>
            <p className="text-muted-foreground m-0 mt-[0.75rem] text-[0.8rem] leading-[1.5]">
              <span className="text-foreground font-semibold">
                {tKit.prefijo}
              </span>{" "}
              {tKit.png.replace(
                "{tamanos}",
                `${FAVICON_PNGS[0]} ${tKit.y} ${FAVICON_PNGS[1]}`,
              )}{" "}
              {tKit.y} {tKit.dosTintas}.
            </p>
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
              // 47 KiB de PNG que se pedían EAGER para algo que vive en la
              // sección 05, muy por debajo del pliegue (P70.28). No se puede
              // reescalar: /api/og es una ruta con query, y el optimizador de
              // Next exige para eso un `images.localPatterns` con la cadena de
              // búsqueda EXACTA — una config que falla en silencio con un 400 el
              // día que cambie un parámetro. Sacarla de la carga inicial cuesta
              // dos atributos y no puede romperse.
              loading="lazy"
              decoding="async"
              className="border-border mb-[1.2rem] block w-full rounded-lg border"
            />
            {/* AQUÍ NO VA NINGUNA DESCARGA (P70.27). Este panel ofrecía el SVG y el
                PNG 1024 del lockup split, que son EXACTAMENTE los mismos archivos
                que ya ofrece su tarjeta en la sección 02: cuatro de las 49 anclas
                de la página eran URLs repetidas. El panel explica cómo se construye
                la tarjeta OG, que es lo suyo; la pieza se baja donde vive. */}
          </div>
        </div>
        <Callout data-reveal accent="primary">
          {t.pngNote}
        </Callout>
      </div>
    </section>
  );
}
