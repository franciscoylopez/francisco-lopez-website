import type { ComponentType } from "react";

import type { ComoSeHaCreadoDict } from "@/app/[lang]/dictionaries";
import {
  ArticleIndex,
  ArticleProse,
  ByLine,
  ChapterNav,
  DiagramPanel,
  LiveStat,
  RepoStrip,
  SectionCover,
} from "@/components/ui/article";
import {
  ReadingProgress,
  SectionRail,
  ShareActions,
} from "@/components/ui/article-islands";
import { SECTION, WRAP } from "@/components/ui/layout";
import { GITHUB_URL } from "@/lib/contact";
import {
  articleWordCount,
  sectionReadingTime,
  type ArticleBlock,
} from "@/lib/reading-time";

import { Breadcrumb, type BreadcrumbDict } from "./breadcrumb";
import { ContactActions, type ContactActionsDict } from "./contact-actions";
import {
  CapasVerificacionDiagram,
  CascadaDiagram,
  CIDiagram,
  DosVelocidadesDiagram,
  SinConsentimientoDiagram,
} from "./como-se-ha-creado-diagrams";

// La página «Cómo se ha creado esta página» (P60, sprint «Cómo se ha creado»,
// PRD-Live.md §9). Site-specific: compone las piezas genéricas de
// `components/ui/article.tsx` con EL contenido real del artículo — igual que
// `deep-dive.tsx` compone `ui/heading.tsx` con el copy de una experiencia.
//
// LA APERTURA Y EL CIERRE SON BANDA/PROSA NORMAL, NO DOS BANDAS INVERTIDAS
// COMO EL PROTOTIPO DE P59. El borrador de contenido (P58, fuente de verdad
// por ser el que se cerró después) pide explícitamente reutilizar la franja
// de contacto compartida (D29) en el cierre, no una nueva — así que el cierre
// usa `ContactActions` con el mismo patrón que Sobre mí y Accesibilidad, y la
// banda invertida queda solo para la apertura. Documentado en el PR de esta
// tarea, no en BRAND.md: es una decisión de UNA página, no una regla nueva.
//
// PASADA DE FEEDBACK (2026-08-21, revisión de Francisco sobre la página
// servida): breadcrumb integrado en la banda (con la variante `inverted` que
// ganaron `Breadcrumb`/`chromeLinkVariants`), apertura recortada al mínimo —
// el enlace «échale un ojo» fuera, palabras/nota movidas al índice—, con
// `md:min-h` para que el heading quepa entero en el pliegue como en
// Accesibilidad/Brand Kit/Design System, y cada franja de enlace con un
// `<a>` por decisión citada en vez de uno solo para la frase entera.

const DIAGRAMS: Record<string, { Component: ComponentType; caption: string }> =
  {
    s01: {
      Component: DosVelocidadesDiagram,
      caption:
        "El mismo scroll, leído a dos ritmos: quien escanea solo llega al primer tramo; quien lee en profundidad recorre la página entera.",
    },
    s05: {
      Component: CascadaDiagram,
      caption:
        "La cascada de la Regla de construcción: cuatro preguntas, en orden, antes de escribir markup nuevo.",
    },
    s07: {
      Component: SinConsentimientoDiagram,
      caption:
        "Sin consentimiento y sin clic en el vídeo, la página no hace ni una petición de red hacia terceros.",
    },
    s08: {
      Component: CapasVerificacionDiagram,
      caption:
        "Cada capa de verificación encuentra lo que la anterior no puede ver. Solo la de abajo, una persona, encuentra lo que no incumple ninguna regla.",
    },
    s09: {
      Component: CIDiagram,
      caption:
        "Los quince pasos de integración continua: la mayoría busca la ausencia de un patrón malo, no su presencia.",
    },
  };

export function ComoSeHaCreado({
  dict,
  contacto,
  breadcrumb,
  homeHref,
  cvHref,
}: {
  dict: ComoSeHaCreadoDict;
  contacto: ContactActionsDict;
  breadcrumb: BreadcrumbDict;
  homeHref: string;
  cvHref: string;
}) {
  const t = dict;

  // El diccionario viene de JSON: `type` se infiere como `string`, no como el
  // literal `"p" | "h3" | "ul" | "quote"` que pide `ArticleBlock`. El dato es
  // correcto en tiempo de ejecución —lo comprueba el guardián ES↔EN (D11)—,
  // así que se estrecha aquí UNA vez en vez de en cada punto de consumo.
  const blocksOf = (raw: unknown) => raw as ArticleBlock[];

  const totalWords = articleWordCount(
    t.sections.map((s) => ({ body: blocksOf(s.body) })),
    t.hero.leadParas.map((text) => ({ type: "p" as const, text })),
  );
  const totalSections = t.sections.length + 1; // + cierre

  const indexItems = [
    ...t.sections.map((s) => ({
      id: s.id,
      ordinal: s.ordinal,
      label: s.indexLabel,
      minutes: sectionReadingTime(blocksOf(s.body)).minutes,
    })),
    {
      id: t.closing.id,
      ordinal: t.closing.ordinal,
      label: t.closing.indexLabel,
      minutes: sectionReadingTime(blocksOf(t.closing.body)).minutes,
    },
  ];

  const railItems = indexItems.map((it) => ({
    id: it.id,
    ordinal: it.ordinal,
    label: it.label,
  }));

  /** «Capítulo 08 de 11 · 4 min de lectura», compuesta de tres fragmentos de
   * copy + dos cifras calculadas en build (D60) — nunca escrita entera. */
  const metaLineFor = (position: number, minutes: number) =>
    `${t.sectionMeta.chapter} ${String(position).padStart(2, "0")} ${
      t.sectionMeta.of
    } ${totalSections} · ${minutes} ${t.sectionMeta.reading}`;

  return (
    <>
      <ReadingProgress ariaLabel={t.progress.ariaLabel} />
      <SectionRail items={railItems} />

      {/* Apertura: banda invertida con el breadcrumb integrado (ya no una
          fila aparte sobre --background, que se leía como un cambio de color
          extraño) y recortada a lo esencial para caber en el pliegue —
          palabras/secciones y la nota de lectura viven ahora en el índice.
          `data-surface="inverted"` (globals.css) hace que
          `text-muted-foreground` resuelva su propio atenuado (D30/D39). */}
      <div
        data-surface="inverted"
        className="bg-foreground text-background flex flex-col justify-center py-[clamp(2.5rem,5vw,4rem)] md:min-h-[calc(100svh-5rem)]"
      >
        <div className={WRAP}>
          <div data-reveal className="mb-[clamp(2rem,5vw,3.5rem)]">
            <Breadcrumb
              routeLabel={breadcrumb.routeLabel}
              items={[
                { label: breadcrumb.home, href: homeHref },
                { label: t.crumb },
              ]}
              inverted
            />
          </div>
          <p
            data-reveal
            className="text-muted-foreground m-0 mb-2 text-[0.8125rem] font-semibold tracking-[0.09em] uppercase"
          >
            {t.hero.kicker}
          </p>
          <h1
            data-reveal
            className="font-display m-0 mb-5 text-[clamp(2.25rem,5.5vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.025em] text-balance"
          >
            {t.hero.title}
          </h1>
          <div data-reveal className="max-w-[var(--measure)] space-y-2">
            <p className="m-0 text-[1.15rem] leading-[1.55]">
              {t.hero.leadParas[0]}
            </p>
            <p className="m-0 text-[1.05rem] leading-[1.6]">
              {t.hero.leadParas[1]}
            </p>
          </div>
          <div
            data-reveal
            className="mt-6 flex flex-wrap items-center justify-between gap-4"
          >
            <ByLine name={t.hero.bylineName} role={t.hero.bylineRole} />
            <ShareActions
              shareLabel={t.hero.shareLabel}
              copyLabel={t.hero.copyLabel}
              copiedLabel={t.hero.copiedLabel}
              copiedAnnounce={t.hero.copiedAnnounce}
              shareUnavailableAnnounce={t.hero.shareUnavailableAnnounce}
              onInverted
            />
          </div>
        </div>
      </div>

      <section id="indice" className={SECTION}>
        <div className={WRAP}>
          <p data-reveal className="m-0 mb-1 text-[0.95rem] font-medium">
            <b>{totalWords.toLocaleString("es-ES")}</b> {t.index.wordsSuffix}
            <span className="mx-[0.6em]">·</span>
            <b>{totalSections}</b> {t.index.sectionsSuffix}
          </p>
          <p
            data-reveal
            className="text-muted-foreground m-0 mb-8 max-w-[var(--measure)] text-[0.9rem] leading-[1.6]"
          >
            {t.index.note}
          </p>
          <ArticleIndex
            kicker={t.index.kicker}
            timeLabel={t.index.timeLabel}
            ariaLabel={t.index.ariaLabel}
            items={indexItems}
          />
        </div>
      </section>

      {t.sections.map((s, i) => {
        const diagram = DIAGRAMS[s.id];
        const position = i + 1;
        return (
          <section key={s.id} id={s.id} className={SECTION}>
            <div className={WRAP}>
              <SectionCover
                ordinal={s.ordinal}
                kicker={s.kicker}
                title={s.title}
                id={`${s.id}-h`}
                metaLine={metaLineFor(
                  position,
                  sectionReadingTime(blocksOf(s.body)).minutes,
                )}
              />
              <ArticleProse blocks={blocksOf(s.body)} />
              {diagram ? (
                <DiagramPanel caption={diagram.caption}>
                  <diagram.Component />
                </DiagramPanel>
              ) : null}
              {s.liveStat ? (
                <LiveStat
                  label={s.liveStat.label}
                  source={s.liveStat.source}
                  value={s.liveStat.value}
                  linkLabel={s.liveStat.linkLabel}
                  href={
                    s.liveStat.href === "github"
                      ? GITHUB_URL
                      : `${homeHref}${s.liveStat.href}`
                  }
                />
              ) : null}
              <RepoStrip label={s.enlace.label} parts={s.enlace.parts} />
              <ChapterNav
                position={position}
                total={totalSections}
                indexLabel={t.chapterNav.indexLabel}
                indexHref="#indice"
                nextLabel={`${t.chapterNav.nextLabel} ${
                  t.sections[i + 1]?.ordinal ?? t.closing.ordinal
                } · ${t.sections[i + 1]?.indexLabel ?? t.closing.indexLabel}`}
                nextHref={`#${t.sections[i + 1]?.id ?? t.closing.id}`}
                positionLabel={`${position} de ${totalSections}`}
              />
            </div>
          </section>
        );
      })}

      <section id={t.closing.id} className={SECTION}>
        <div className={WRAP}>
          <SectionCover
            ordinal={t.closing.ordinal}
            kicker={t.closing.kicker}
            title={t.closing.title}
            id={`${t.closing.id}-h`}
            metaLine={metaLineFor(
              totalSections,
              sectionReadingTime(blocksOf(t.closing.body)).minutes,
            )}
          />
          <ArticleProse blocks={blocksOf(t.closing.body)} />
          <p className="text-muted-foreground mt-6 mb-0 text-[0.85rem]">
            {t.closing.meta}
          </p>
          <RepoStrip
            label={t.closing.enlace.label}
            parts={t.closing.enlace.parts}
          />
          <div className="mt-[clamp(2.25rem,4.5vw,3rem)]">
            <ContactActions dict={contacto} cvHref={cvHref} />
          </div>
        </div>
      </section>
    </>
  );
}
