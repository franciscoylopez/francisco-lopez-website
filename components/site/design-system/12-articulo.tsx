import { type Dictionary } from "@/app/[lang]/dictionaries";
import {
  ByLine,
  DiagramPanel,
  Pull,
  Pullquote,
  RepoStrip,
  SectionCover,
} from "@/components/ui/article";
import { LiveStat } from "@/components/ui/live-stat";
import {
  FloatingShare,
  ReadingProgress,
  ShareActions,
} from "@/components/ui/article-islands";
import { SectionRail } from "@/components/ui/section-index-islands";
import { SectionHeader } from "@/components/ui/heading";
import { fillPages } from "@/lib/design-values";
import type { Locale } from "@/lib/i18n/config";
import { InfoCard } from "@/components/ui/info-card";
import { PAIR, SECTION, WRAP } from "@/components/ui/layout";

import { cn } from "@/lib/utils";
import { GroupHead, SpecimenCard, type SeccionMarco } from "./shared";

/* ===================== ARTÍCULO LARGO =====================
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
 * P60, F3/60.6): no hace falta más de tres para que el `IntersectionObserver`
 * real tenga algo que observar dentro de este panel. Sus rótulos salen de
 * `indexItems`, que se queda aunque el índice ya no se demuestre aquí (P70.416):
 * lo que alimenta ahora es el riel. */
const RAIL_IDS = ["ds-rail-1", "ds-rail-2", "ds-rail-3"];

export function ArticuloLargo({
  t,
  marco,
  lang,
}: {
  t: Dictionary["designSystem"]["articulo"];
  marco: SeccionMarco;
  lang: Locale;
}) {
  const railItems: { id: string; ordinal: string; label: string }[] =
    RAIL_IDS.map((id, i) => ({
      id,
      ordinal: `0${i + 1}`,
      label: t.indexItems[i] ?? "",
    }));
  // LAS CADENAS DEL ESPÉCIMEN SON LAS DEL ARTÍCULO, palabra por palabra
  // (P72.48). Tienen que estar duplicadas —cada página carga su rama del
  // diccionario (D48) y ésta no puede importar la del artículo—, pero decían
  // otra cosa: «Enlace copiado» aquí contra «Copiado» allí, y dos redacciones
  // distintas del aviso de compartir no disponible. Un espécimen que enseña un
  // control con copy que ese control no tiene está enseñando otro control, que
  // es justo lo que esta página existe para no hacer. Al tocar una, se tocan
  // las dos.
  const shareStrings = {
    copyLabel: t.shareCopyLabel,
    copiedLabel: t.shareCopiedLabel,
    copiedAnnounce: t.shareCopiedAnnounce,
    shareUnavailableAnnounce: t.shareUnavailableAnnounce,
  };
  const f = t.fichas;

  return (
    <section
      data-reveal
      id={marco.id}
      className={cn(SECTION, "scroll-mt-[5rem]")}
    >
      <div className={WRAP}>
        <SectionHeader eyebrow={marco.kicker} title={t.title} size="section-sm">
          <p className="text-muted-foreground m-0 mb-10 max-w-[var(--measure)] text-[0.95rem]">
            {t.lead}
          </p>
        </SectionHeader>

        {/* ── (a) La portada del artículo ───────────────────────────── */}
        <GroupHead first {...t.groups.portada} />
        {/* BAJO UNA FICHA (P70.33): eran especímenes con reglas distintas que
            decían lo mismo con otras palabras, y son lo que aparece una sola vez,
            al principio. Aquí se demuestran juntas, que además es como se ven en
            la página real.

            EL ÍNDICE YA NO ESTÁ AQUÍ (P70.416). Era la tercera de este grupo, y
            desde P70.395 lo publica §10 —es una pieza general, la usan cuatro
            páginas—, así que enseñarlo también aquí era la misma pieza dos veces
            en la misma página, con dos fichas distintas. Lo que se queda en §12
            es lo que solo es del artículo. */}
        <SpecimenCard wide {...f.portada}>
          <div className="flex flex-col gap-[var(--gutter)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <ByLine name={t.bylineName} role={t.bylineRole} />
              <ShareActions shareLabel={t.shareLabel} {...shareStrings} />
            </div>
          </div>
        </SpecimenCard>

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
          <SpecimenCard wide {...f.citas}>
            <div className="flex flex-col gap-6">
              <Pullquote>{t.pullquote}</Pullquote>
              <Pull>{t.pull}</Pull>
            </div>
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

        {/* ── (d) El pie de cada parada ───────────────────────────────
            SIN FICHA PROPIA desde P70.33: la franja se sigue viendo —forma parte
            de `article.tsx`, que sí está publicada— pero deja de ocupar una
            entrada del catálogo. Lo que enseña es el ORDEN en el que cierra una
            sección, y eso se ve mirándola.

            ERAN DOS (P70.416): la otra demostraba el cierre de bloque, que desde
            P70.395 publica §10 por ser pieza general. */}
        <div className="mt-12 grid gap-[var(--gutter)]">
          {/* La franja se enseña CON la última línea del cuerpo encima (P60.9):
              abre con `border-t` y un margen superior de 2,5rem, así que suelta
              en una caja se leía como un filete huérfano sobre un hueco vacío.
              Pegada a un párrafo, ese mismo hueco es lo que es: el aire que la
              separa de la prosa. */}
          <div className="border-border bg-background rounded-xl border px-[clamp(1.25rem,3vw,2rem)] py-8">
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
          </div>
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
          <SectionRail items={railItems} ariaLabel={t.railAriaLabel} />
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
        <SpecimenCard {...f.islas} />

        <div className="mt-12 max-w-[var(--measure)]">
          <InfoCard title={t.ruleTitle} bullets={t.rule} />
        </div>
        {marco.closer}
      </div>
    </section>
  );
}
