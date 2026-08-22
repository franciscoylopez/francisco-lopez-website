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
import { fillPages } from "@/lib/design-values";
import type { Locale } from "@/lib/i18n/config";
import { InfoCard } from "@/components/ui/info-card";
import { PAIR, SECTION, WRAP } from "@/components/ui/layout";

import { GroupHead, SpecimenCard } from "./shared";

/* ===================== (15) ARTÍCULO LARGO =====================
    La familia de piezas que estrenó «Cómo se ha creado esta página» (P60):
    ninguna sabe nada de ESTE sitio —viven en `components/ui/article.tsx`, no
    en `site/`—, así que el espécimen las usa con contenido de muestra, no
    con el copy real de esa página. Publicada aquí ANTES de cerrar la tarea,
    como pide la Regla de construcción (paso 2: se crea la variante, se
    publica antes de dar por hecho).

    PARTIDA EN CINCO SUBAPARTADOS (P60.9). La primera versión metía las trece
    piezas dentro de un solo `PANEL` con una única entradilla para todas, y esa
    es exactamente la forma que NO tiene el resto de la página: las otras
    catorce secciones abren con `SectionHeader`, se parten en subapartados con
    `h3` cuando hace falta y cada espécimen lleva su ficha —rótulo, nombre,
    qué resuelve y la letra pequeña—. Era además la sección que menos se lo
    podía permitir, porque es la única que documenta una capa que nadie conoce
    todavía.

    EL EJE DEL CORTE es DÓNDE VIVE la pieza dentro del artículo, no si es de
    servidor o de cliente: lo primero se puede comprobar abriendo la página
    real al lado, lo segundo no le dice nada a quien lee. */

/** Los tres objetivos que activan el riel y el dock de compartir (design-review
 * P60, F3/60.6): son las mismas paradas que enseña `ArticleIndex` arriba, y no
 * hace falta más de tres para que el `IntersectionObserver` real tenga algo
 * que observar dentro de este panel. */
const RAIL_IDS = ["ds-rail-1", "ds-rail-2", "ds-rail-3"];

export function ArticuloLargo({
  t,
  lang,
}: {
  t: Dictionary["designSystem"]["articulo"];
  lang: Locale;
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
  const f = t.fichas;

  return (
    <section data-reveal className={SECTION}>
      <div className={WRAP}>
        <SectionHeader eyebrow={t.num} title={t.title} size="section-sm">
          <p className="text-muted-foreground m-0 mb-10 max-w-[var(--measure)] text-[0.95rem]">
            {t.lead}
          </p>
        </SectionHeader>

        {/* ── (a) La portada del artículo ───────────────────────────── */}
        <GroupHead first {...t.groups.portada} />
        <div className={PAIR}>
          <SpecimenCard {...f.byline}>
            <ByLine name={t.bylineName} role={t.bylineRole} />
          </SpecimenCard>
          <SpecimenCard {...f.share}>
            <ShareActions shareLabel={t.shareLabel} {...shareStrings} />
          </SpecimenCard>
        </div>
        <div className="mt-[var(--gutter)]">
          <SpecimenCard wide {...f.index}>
            <ArticleIndex
              kicker={t.indexKicker}
              timeLabel={t.indexTimeLabel}
              ariaLabel={t.indexAriaLabel}
              items={railItems.map((it, i) => ({ ...it, minutes: 3 + i }))}
            />
          </SpecimenCard>
        </div>

        {/* ── (b) La apertura de cada parada ────────────────────────── */}
        <GroupHead {...t.groups.parada} />
        <SpecimenCard wide {...f.cover}>
          {/* `level={4}`: aquí la portada cuelga del `h2` de la sección y del
              `h3` de este subapartado, así que su titular no puede ser el `h2`
              que sí es en la página real (punto 4 del checklist). */}
          <SectionCover
            level={4}
            ordinal={t.coverKicker.slice(0, 2)}
            kicker={t.coverKicker}
            title={t.coverTitle}
            id="ds-articulo-cover"
            metaLine={t.coverMeta}
          />
        </SpecimenCard>

        {/* ── (c) Lo que flota junto al texto ───────────────────────── */}
        <GroupHead {...t.groups.cuerpo} />
        <div className={PAIR}>
          {/* Las dos citas flotan en la página real; dentro de su ficha no hay
              texto alrededor del que apartarse, así que se ven en su forma
              base. Es la misma pieza: el lado lo pone `ArticleProse`. */}
          <SpecimenCard {...f.pullquote}>
            <Pullquote>{t.pullquote}</Pullquote>
          </SpecimenCard>
          <SpecimenCard {...f.pull}>
            <Pull>{t.pull}</Pull>
          </SpecimenCard>
          <SpecimenCard wide {...f.diagram}>
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
          </SpecimenCard>
          <SpecimenCard wide {...f.livestat}>
            <LiveStat
              label={t.liveStatLabel}
              source={t.liveStatSource}
              value={fillPages(t.liveStatValue, lang)}
              linkLabel={t.liveStatLink}
              href="#ds-articulo-cover"
            />
          </SpecimenCard>
        </div>

        {/* ── (d) El pie de cada parada ─────────────────────────────── */}
        <GroupHead {...t.groups.pie} />
        <div className="grid gap-[var(--gutter)]">
          {/* Las dos franjas se enseñan CON la última línea del cuerpo encima
              (P60.9): las dos abren con `border-t` y un margen superior de
              2,5rem, así que sueltas en una caja se leían como un filete
              huérfano sobre un hueco vacío. Pegadas a un párrafo, ese mismo
              hueco es lo que son: el aire que las separa de la prosa. */}
          <SpecimenCard wide {...f.repo}>
            <p className="text-muted-foreground m-0 text-[1.02rem] leading-[1.7]">
              {t.pieSample}
            </p>
            <RepoStrip
              label={t.repoLabel}
              parts={[
                t.repoText,
                { label: "DECISIONS.md", path: "DECISIONS.md" },
              ]}
            />
          </SpecimenCard>
          <SpecimenCard wide {...f.chapter}>
            <p className="text-muted-foreground m-0 text-[1.02rem] leading-[1.7]">
              {t.pieSample}
            </p>
            <ChapterNav
              position={5}
              total={11}
              indexLabel={t.chapterIndexLabel}
              indexHref="#ds-articulo-cover"
              nextLabel={t.chapterNextLabel}
              nextHref="#ds-articulo-cover"
              positionLabel={t.chapterPositionLabel}
            />
          </SpecimenCard>
        </div>

        {/* ── (e) Lo que no se va con el scroll ─────────────────────── */}
        <GroupHead {...t.groups.islas} />
        {/* Riel de índice, barra de progreso y dock de compartir: los tres
            nacen `fixed` a la VENTANA (design-review P60, F3/60.6) —
            correcto en la página real, pero aquí necesitan un contenedor
            que les cree su propio "containing block" para no invadir el
            resto del Design System. `[transform:translateZ(0)]` en un
            ancestro hace exactamente eso (CSS §fixed positioning): un
            `fixed` descendiente se posiciona relativo A ESTA caja, no al
            viewport. Los tres objetivos de `RAIL_IDS` viven dentro, así
            que el `IntersectionObserver` real los activa al llegar aquí
            haciendo scroll — mismo componente, mismo comportamiento.

            Por eso las tres comparten UNA demo y sus fichas van debajo sin
            espécimen propio: separarlas en tres cajas sería tres veces la
            misma caja vacía. */}
        <div className="border-border bg-background relative isolate h-[220px] [transform:translateZ(0)] overflow-hidden rounded-xl border">
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
        <p className="text-muted-foreground m-0 mt-3 mb-[var(--gutter)] max-w-[var(--measure)] text-[0.8rem] leading-[1.55]">
          {t.railHint}
        </p>
        <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,17rem),1fr))] items-start gap-[var(--gutter)]">
          <SpecimenCard {...f.progress} />
          <SpecimenCard {...f.rail} />
          <SpecimenCard {...f.dock} />
        </div>

        <div className="mt-12 max-w-[var(--measure)]">
          <InfoCard title={t.ruleTitle} bullets={t.rule} foot={t.ruleFoot} />
        </div>
      </div>
    </section>
  );
}
