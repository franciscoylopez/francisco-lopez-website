import { type Dictionary } from "@/app/[lang]/dictionaries";
import {
  ChapterNav,
  LiveStat,
  Pull,
  Pullquote,
  RepoStrip,
  SectionCover,
} from "@/components/ui/article";
import { SectionHeader } from "@/components/ui/heading";
import { PANEL, SECTION, WRAP } from "@/components/ui/layout";

/* ===================== (15) ARTÍCULO LARGO =====================
    La familia de piezas que estrenó «Cómo se ha creado esta página» (P60):
    ninguna sabe nada de ESTE sitio —viven en `components/ui/article.tsx`, no
    en `site/`—, así que el espécimen las usa con contenido de muestra, no
    con el copy real de esa página. Publicada aquí ANTES de cerrar la tarea,
    como pide la Regla de construcción (paso 2: se crea la variante, se
    publica antes de dar por hecho). */
export function ArticuloLargo({
  t,
}: {
  t: Dictionary["designSystem"]["articulo"];
}) {
  return (
    <section data-reveal className={SECTION}>
      <div className={WRAP}>
        <SectionHeader eyebrow={t.num} title={t.title} size="section-sm">
          <p className="text-muted-foreground m-0 mb-10 max-w-[var(--measure)] text-[0.95rem]">
            {t.lead}
          </p>
        </SectionHeader>

        <div className={`${PANEL} p-[clamp(1.25rem,3vw,2rem)]`}>
          <SectionCover
            ordinal={t.coverKicker.slice(0, 2)}
            kicker={t.coverKicker}
            title={t.coverTitle}
            id="ds-articulo-cover"
            metaLine={t.coverMeta}
          />
          <div className="grid grid-cols-1 gap-x-[var(--gutter)] gap-y-2 md:grid-cols-2">
            <Pullquote>{t.pullquote}</Pullquote>
            <Pull>{t.pull}</Pull>
          </div>
          <LiveStat
            label={t.liveStatLabel}
            source={t.liveStatSource}
            value={t.liveStatValue}
            linkLabel={t.liveStatLink}
            href="#ds-articulo-cover"
          />
          <RepoStrip
            label={t.repoLabel}
            parts={[
              t.repoText,
              { label: "DECISIONS.md", path: "DECISIONS.md" },
            ]}
          />
          <ChapterNav
            position={5}
            total={11}
            indexLabel={t.chapterIndexLabel}
            indexHref="#ds-articulo-cover"
            nextLabel={t.chapterNextLabel}
            nextHref="#ds-articulo-cover"
            positionLabel={t.chapterPositionLabel}
          />
        </div>
        <p className="text-muted-foreground m-0 mt-4 text-[0.8rem]">{t.hint}</p>
      </div>
    </section>
  );
}
