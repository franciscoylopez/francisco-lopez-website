import { type Dictionary } from "@/app/[lang]/dictionaries";
import {
  ArticleIndex,
  ByLine,
  ChapterNav,
  DiagramPanel,
  LiveStat,
  Pull,
  Pullquote,
  RepoStrip,
  SectionCover,
} from "@/components/ui/article";
import {
  FloatingShare,
  ReadingProgress,
  SectionRail,
  ShareActions,
} from "@/components/ui/article-islands";
import { SectionHeader } from "@/components/ui/heading";
import { PANEL, SECTION, WRAP } from "@/components/ui/layout";

/* ===================== (15) ARTÍCULO LARGO =====================
    La familia de piezas que estrenó «Cómo se ha creado esta página» (P60):
    ninguna sabe nada de ESTE sitio —viven en `components/ui/article.tsx`, no
    en `site/`—, así que el espécimen las usa con contenido de muestra, no
    con el copy real de esa página. Publicada aquí ANTES de cerrar la tarea,
    como pide la Regla de construcción (paso 2: se crea la variante, se
    publica antes de dar por hecho). */
/** Los tres objetivos que activan el riel y el dock de compartir (design-review
 * P60, F3/60.6): son las mismas paradas que enseña `ArticleIndex` debajo, y no
 * hace falta más de tres para que el `IntersectionObserver` real tenga algo
 * que observar dentro de este panel. */
const RAIL_IDS = ["ds-rail-1", "ds-rail-2", "ds-rail-3"];

export function ArticuloLargo({
  t,
}: {
  t: Dictionary["designSystem"]["articulo"];
}) {
  const railItems: { id: string; ordinal: string; label: string }[] =
    RAIL_IDS.map((id, i) => ({
      id,
      ordinal: `0${i + 1}`,
      label: t.indexItems[i] ?? "",
    }));
  const shareStrings = {
    copyLabel: t.shareCopyLabel,
    copiedLabel: t.shareCopiedLabel,
    copiedAnnounce: t.shareCopiedAnnounce,
    shareUnavailableAnnounce: t.shareUnavailableAnnounce,
  };

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
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <ByLine name={t.bylineName} role={t.bylineRole} />
            <ShareActions shareLabel={t.shareLabel} {...shareStrings} />
          </div>
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
          <DiagramPanel caption={t.diagramCaption}>
            <svg
              viewBox="0 0 160 60"
              role="img"
              aria-hidden="true"
              className="h-auto w-full max-w-[220px]"
            >
              <rect
                x="4"
                y="4"
                width="70"
                height="52"
                rx="6"
                className="fill-primary/70"
              />
              <rect
                x="86"
                y="4"
                width="70"
                height="52"
                rx="6"
                className="fill-muted"
              />
            </svg>
          </DiagramPanel>
          <div className="mb-6">
            <ArticleIndex
              kicker={t.indexKicker}
              timeLabel={t.indexTimeLabel}
              ariaLabel={t.indexAriaLabel}
              items={railItems.map((it, i) => ({
                ...it,
                minutes: 3 + i,
              }))}
            />
          </div>
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
          {/* Riel de índice, barra de progreso y dock de compartir: los tres
              nacen `fixed` a la VENTANA (design-review P60, F3/60.6) —
              correcto en la página real, pero aquí necesitan un contenedor
              que les cree su propio "containing block" para no invadir el
              resto del Design System. `[transform:translateZ(0)]` en un
              ancestro hace exactamente eso (CSS §fixed positioning): un
              `fixed` descendiente se posiciona relativo A ESTE panel, no al
              viewport. Los tres objetivos de `RAIL_IDS` viven dentro, así
              que el `IntersectionObserver` real los activa al llegar aquí
              haciendo scroll — mismo componente, mismo comportamiento. */}
          <div className="border-border relative isolate mt-6 h-[220px] [transform:translateZ(0)] overflow-hidden rounded-lg border">
            <ReadingProgress ariaLabel={t.progressAriaLabel} />
            <SectionRail items={railItems} />
            <FloatingShare
              items={railItems}
              shareLabel={t.shareLabel}
              {...shareStrings}
            />
            <div className="flex h-full flex-col justify-between p-4">
              {RAIL_IDS.map((id) => (
                <span key={id} id={id} aria-hidden="true" />
              ))}
            </div>
          </div>
          <p className="text-muted-foreground m-0 mt-2 text-[0.8rem]">
            {t.railHint}
          </p>
        </div>
        <p className="text-muted-foreground m-0 mt-4 text-[0.8rem]">{t.hint}</p>
      </div>
    </section>
  );
}
