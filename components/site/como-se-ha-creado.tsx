import type { ComponentType, ReactNode } from "react";

import type { ComoSeHaCreadoDict } from "@/app/[lang]/dictionaries";
import {
  ArticleProse,
  ByLine,
  RepoStrip,
  type RepoStripPart,
  SectionCover,
} from "@/components/ui/article";
import {
  FloatingShare,
  ReadingProgress,
  ShareActions,
} from "@/components/ui/article-islands";
import { SectionCloser, SectionIndex } from "@/components/ui/section-index";
import { SectionRail } from "@/components/ui/section-index-islands";
import { Badge } from "@/components/ui/badge";
import { LEADING, SectionHeader } from "@/components/ui/heading";
import { SECTION, WRAP } from "@/components/ui/layout";
import { GITHUB_URL } from "@/lib/contact";
import { fillPages } from "@/lib/design-values";
import { fillFigures, registroAgentes, rellena } from "@/lib/figures";
import {
  DECISIONES_PATH,
  ES_DECISION,
  lineasDeDecision,
} from "@/lib/decisions";
import type { Locale } from "@/lib/i18n/config";
import {
  articleWordCount,
  sectionReadingTime,
  type ArticleBlock,
} from "@/lib/reading-time";
import { cn } from "@/lib/utils";

import { Breadcrumb, type BreadcrumbDict } from "./breadcrumb";
import { DosVelocidadesDiagram } from "./como-se-ha-creado-diagrams/01-dos-velocidades";
import { CapasColorDiagram } from "./como-se-ha-creado-diagrams/03-capas-color";
import { StackDiagram } from "./como-se-ha-creado-diagrams/04-stack";
import { CascadaDiagram } from "./como-se-ha-creado-diagrams/05-cascada";
import { TresLongitudesDiagram } from "./como-se-ha-creado-diagrams/06-tres-longitudes";
import { SinConsentimientoDiagram } from "./como-se-ha-creado-diagrams/07-sin-consentimiento";
import { CapasVerificacionDiagram } from "./diagrams/capas-verificacion";
import { CIDiagram } from "./como-se-ha-creado-diagrams/09-ci";

// La página «Cómo se ha creado esta página» (P60, sprint «Cómo se ha creado»,
// PRD-Live.md §9). Site-specific: compone las piezas genéricas de
// `components/ui/article.tsx` con EL contenido real del artículo — igual que
// `deep-dive.tsx` compone `ui/heading.tsx` con el copy de una experiencia.
//
// LA APERTURA ES BANDA INVERTIDA; EL CIERRE, PROSA NORMAL IGUAL QUE LAS OTRAS
// DIEZ SECCIONES (P60 tanda 3, puntos 7 y 9). La primera versión reutilizaba
// la franja de contacto compartida (D29) al final del cierre, así que era la
// única de las once secciones con un pie distinto al resto. Se quitó: el
// contacto ya vive en la home, y el cierre gana en consistencia siendo una
// sección más — mismo `SectionCover`, mismo `RepoStrip`, mismo `SectionCloser`
// (sin `nextHref`, por no tener «siguiente»).
//
// PASADA DE FEEDBACK (2026-08-21, revisión de Francisco sobre la página
// servida): breadcrumb integrado en la banda (con la variante `inverted` que
// ganaron `Breadcrumb`/`chromeLinkVariants`), apertura recortada al mínimo —
// el enlace «échale un ojo» fuera, palabras/nota movidas al índice—, con
// `md:min-h` para que el heading quepa entero en el pliegue como en
// Accesibilidad/Brand Kit/Design System, y cada franja de enlace con un
// `<a>` por decisión citada en vez de uno solo para la frase entera.

/**
 * Las líneas de `DECISIONS.md`, leídas UNA VEZ por build. Las trece páginas se
 * prerenderizan (D48), así que esto es trabajo de `next build`, no de petición.
 */
const LINEAS_DECISION = lineasDeDecision();

/** La cita tal y como la guarda el diccionario: sin `line`, que es derivado. */
type CitaDict =
  | string
  | { label: string; path: string }
  | { label: string; external: string };

/**
 * Le pone el ancla `#L…` a cada decisión citada, resolviéndola de la cabecera
 * real (`lib/decisions.ts`). El diccionario guarda la etiqueta y el archivo; la
 * línea no se escribe nunca, porque una línea escrita a mano es una segunda
 * verdad y ya se desincronizó en 27 de 38 citas.
 *
 * Solo toca las citas a `DECISIONS.md` con etiqueta `D<n>`: el resto —archivos
 * de código, `BRAND.md`, URLs externas— apuntan al archivo entero a propósito.
 */
function conAncla(parts: readonly CitaDict[]): RepoStripPart[] {
  return parts.map((part) => {
    if (typeof part === "string" || !("path" in part)) return part;
    if (part.path !== DECISIONES_PATH || !ES_DECISION.test(part.label))
      return part;
    const line = LINEAS_DECISION.get(part.label);
    return line ? { ...part, line } : part;
  });
}

export function ComoSeHaCreado({
  dict,
  lang,
  breadcrumb,
  homeHref,
}: {
  dict: ComoSeHaCreadoDict;
  lang: Locale;
  breadcrumb: BreadcrumbDict;
  homeHref: string;
}) {
  const t = dict;

  // Registro site-specific id→componente (D36): el bloque `{ type: "diagram",
  // id, caption }` del diccionario dice DÓNDE va cada diagrama y en qué
  // idioma se lee su pie; este registro dice qué SVG dibuja cada id. Cada
  // diagrama necesita además el idioma para SU PROPIO texto interno (el pie
  // ya viene traducido del diccionario, pero las etiquetas dentro del SVG
  // —«se despliega», «busca ausencia»— estaban hardcodeadas en español, el
  // mismo bug de i18n una capa más adentro, hallado al verificar la página en
  // inglés — P60 tanda 2). `ArticleProse` solo sabe pedir un `ComponentType`
  // sin props, así que aquí se cierra sobre `lang` en vez de cambiar ese
  // contrato.
  const DIAGRAMS: Record<string, ComponentType> = {
    s01: () => <DosVelocidadesDiagram lang={lang} />,
    s03: () => <CapasColorDiagram lang={lang} />,
    s04: () => <StackDiagram lang={lang} />,
    s05: () => <CascadaDiagram lang={lang} />,
    s06: () => <TresLongitudesDiagram lang={lang} />,
    s08: () => <SinConsentimientoDiagram lang={lang} />,
    s09: () => <CapasVerificacionDiagram lang={lang} />,
    s10: () => <CIDiagram lang={lang} />,
  };

  // El `href` de un `{ type: "livestat" }` es un slug relativo, una URL
  // externa completa (el informe de PageSpeed Insights, s08) o el literal
  // «github»; resolverlo depende del locale (D36, mismo patrón que
  // `DIAGRAMS`).
  const resolveLiveStatHref = (href: string) => {
    if (href === "github") return GITHUB_URL;
    if (href.startsWith("http")) return href;
    return `${homeHref}${href}`;
  };

  // Las mismas pastillas que usa el resto del sitio, no una recreación (P60
  // tanda 2, punto 17): el «ejemplo real» del apartado de badge.tsx que el
  // cuerpo de s05 acaba de contar.
  const LIVESTAT_EXTRAS: Record<string, ReactNode> = {
    s05: (
      <>
        <Badge tone="cyan" kind="code">
          13,79:1
        </Badge>
        <Badge tone="purple" kind="label">
          Exit
        </Badge>
        <Badge tone="neutral" kind="value">
          AAA
        </Badge>
      </>
    ),
    s08: (
      <>
        <Badge tone="cyan" kind="value">
          SEO 100
        </Badge>
        <Badge tone="cyan" kind="value">
          {lang === "es" ? "Accesibilidad 100" : "Accessibility 100"}
        </Badge>
        <Badge tone="cyan" kind="value">
          {lang === "es" ? "Buenas prácticas 100" : "Best practices 100"}
        </Badge>
      </>
    ),
    // Las tres pastillas de la tarjeta de agentes SALEN DEL SELLO, no escritas
    // aquí. La regleta de al lado las tiene a mano porque son las otras
    // categorías de Lighthouse, que llevan clavadas en 100 desde que existen;
    // estas tres se mueven en cada pasada, y una cifra tecleada en un extra es
    // el mismo hueco que D102 cerró en el `value` de un `livestat`: dentro de un
    // `ReactNode` no la ve `check:articulo`. El grado vive aquí y no en el
    // `value` para que el dato de arriba sea una sola cifra, como en PageSpeed.
    "s08-geo": (() => {
      const a = registroAgentes();
      return (
        <>
          <Badge tone="cyan" kind="value">
            {lang === "es" ? `Grado ${a.grado}` : `Grade ${a.grado}`}
          </Badge>
          <Badge tone="cyan" kind="value">
            {lang === "es"
              ? `${a.checks} comprobaciones`
              : `${a.checks} checks`}
          </Badge>
          <Badge tone="cyan" kind="value">
            {lang === "es"
              ? `${a.noAplican} no aplican`
              : `${a.noAplican} not applicable`}
          </Badge>
        </>
      );
    })(),
  };

  // El diccionario viene de JSON: `type` se infiere como `string`, no como el
  // literal `"p" | "h3" | "ul" | "quote"` que pide `ArticleBlock`. El dato es
  // correcto en tiempo de ejecución —lo comprueba el guardián ES↔EN (D11)—,
  // así que se estrecha aquí UNA vez en vez de en cada punto de consumo.
  // Los bloques del diccionario, con las cifras DERIVADAS ya sustituidas: el
  // copy escribe `{paginas}` y el recuento lo pone `lib/design-values.ts`
  // leyéndolo del registro de rutas (D72). Mismo mecanismo que `fillRatios` y
  // `fillRatios`, y por el mismo motivo: «AAA en las doce páginas» llevaba días
  // siendo falso porque la cifra estaba escrita a mano en los dos diccionarios.
  //
  // ALCANZA A TODA CADENA DEL BLOQUE, no solo al `value` de un `livestat`
  // (P68.495). Antes solo se rellenaba ahí, así que un `{pasosCI}` en el pie de
  // un diagrama se habría publicado con las llaves puestas. Rellenar el bloque
  // entero cuesta lo mismo y quita una regla que había que recordar; las citas
  // (`label`/`path`) pasan por aquí sin tokens y salen intactas.
  const blocksOf = (raw: unknown) =>
    (raw as ArticleBlock[]).map(
      (b) =>
        rellena(b, (t) =>
          fillFigures(fillPages(t, lang), lang),
        ) as ArticleBlock,
    );

  const totalWords = articleWordCount(
    t.sections.map((s) => ({ body: blocksOf(s.body) })),
    [
      ...t.hero.leadParas.map((text) => ({ type: "p" as const, text })),
      ...blocksOf(t.opening.body),
    ],
  );
  const totalSections = t.sections.length + 1; // + cierre

  // El tiempo por sección es el `meta` de la celda, no un campo que la pieza
  // conozca (P70.38): `SectionIndex` sirve ahora a cuatro páginas y solo esta es
  // prosa, así que quien sabe qué significa el dato es el llamador. Va como
  // fragmento y no como plantilla —`≈{n} min`, no `` `≈${n} min` ``— para que el
  // HTML servido no cambie ni un byte: React separa nodos de texto adyacentes con
  // `<!-- -->` y una cadena única los fundiría en uno. Es lo que `gate:html` mira.
  const metaTiempo = (body: Parameters<typeof blocksOf>[0]) => (
    <>≈{sectionReadingTime(blocksOf(body)).minutes} min</>
  );

  const indexItems = [
    ...t.sections.map((s) => ({
      id: s.id,
      ordinal: s.ordinal,
      label: s.indexLabel,
      meta: metaTiempo(s.body),
    })),
    {
      id: t.closing.id,
      ordinal: t.closing.ordinal,
      label: t.closing.indexLabel,
      meta: metaTiempo(t.closing.body),
    },
  ];

  const railItems = indexItems.map((it) => ({
    id: it.id,
    ordinal: it.ordinal,
    label: it.label,
  }));

  /** «Capítulo 08 de 11 · 4 min de lectura», compuesta de tres fragmentos de
   * copy + dos cifras calculadas en build (D60) — nunca escrita entera. */
  // «1 de 11 · 4 min», sin «Capítulo» ni el cero de relleno ni «de lectura»
  // (P60 tanda 3, punto 2): con el texto largo, la meta-línea competía en
  // ancho con el numeral y no cabía a su lado. «min» sin traducir es la
  // misma convención que ya usa `SectionIndex` para el tiempo por sección.
  const metaLineFor = (position: number, minutes: number) =>
    `${position} ${t.sectionMeta.of} ${totalSections} · ${minutes} min`;

  return (
    <>
      {/* Apertura: banda invertida con el breadcrumb integrado (ya no una
          fila aparte sobre --background, que se leía como un cambio de color
          extraño) y recortada a lo esencial para caber en el pliegue —
          palabras/secciones y la nota de lectura viven ahora en el índice.
          `data-surface="inverted"` (globals.css) hace que
          `text-muted-foreground` resuelva su propio atenuado (D30/D39).

          MISMO PATRÓN QUE brand-kit/design-system/accesibilidad/deep-dive
          (P60 tanda 2, punto 1): `${WRAP} flex w-full flex-1 flex-col`, con
          el breadcrumb anclado arriba y solo el grupo de abajo en `my-auto`.
          La versión anterior centraba TODO el bloque con `justify-center`
          sobre un `WRAP` sin `w-full`: al ser flex-item, el `mx-auto` de
          `WRAP` desactiva el `stretch` por especificación y la caja se
          encoge a su contenido, desplazando en ANCHO hasta el breadcrumb.
          Es la tercera vez que este bug aparece pese a llevar el porqué
          comentado en las otras cuatro páginas — D77 documenta el mecanismo
          una sola vez, en vez de seguir copiando el comentario. */}
      <div
        data-surface="inverted"
        className="bg-foreground text-background flex flex-col py-[clamp(2.5rem,5vw,4rem)] md:min-h-[calc(100svh-5rem)]"
      >
        <div className={`${WRAP} flex w-full flex-1 flex-col`}>
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
          <div className="my-auto">
            <p
              data-reveal
              className="text-muted-foreground m-0 mb-2 text-[0.8125rem] font-semibold tracking-[0.09em] uppercase"
            >
              {t.hero.kicker}
            </p>
            <h1
              data-reveal
              className="font-display m-0 mb-5 text-[clamp(2.25rem,5.5vw,3.75rem)] leading-[1.02] font-semibold tracking-[-0.025em]"
            >
              {t.hero.title}
            </h1>
            <div data-reveal className="max-w-[var(--measure)] space-y-2">
              <p className={cn("m-0 text-[1.15rem]", LEADING.lead)}>
                {t.hero.leadParas[0]}
              </p>
              <p className={cn("m-0 text-[1.05rem]", LEADING.lead)}>
                {t.hero.leadParas[1]}
              </p>
            </div>
            <div
              data-reveal
              className="mt-6 flex flex-wrap items-center justify-between gap-4"
            >
              <ByLine
                name={t.hero.bylineName}
                role={t.hero.bylineRole}
                photoSrc="/img/francisco-como-se-ha-creado-byline-1x1.webp"
                photoAlt={t.hero.bylinePhotoAlt}
              />
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
      </div>

      {/* Riel de índice y dock de compartir DESPUÉS del breadcrumb y del `h1`
          en el DOM (design-review P60): las tres piezas van `fixed`, así que
          moverlas aquí no cambia nada en pantalla, pero antes precedían al
          título de la página en el orden de tabulación — quien navegaba por
          teclado o lector de pantalla pasaba por 11 enlaces del índice + 2
          botones del dock antes de que se anunciara el `h1`. */}
      <ReadingProgress ariaLabel={t.progress.ariaLabel} />
      <SectionRail items={railItems} ariaLabel={t.rail.ariaLabel} />
      <FloatingShare
        items={railItems}
        shareLabel={t.hero.shareLabel}
        copyLabel={t.hero.copyLabel}
        copiedLabel={t.hero.copiedLabel}
        copiedAnnounce={t.hero.copiedAnnounce}
        shareUnavailableAnnounce={t.hero.shareUnavailableAnnounce}
      />

      {/* Apertura: prosa de entrada, ANTES del índice y fuera de él —no es una
          parada más del recorrido, no lleva ordinal ni cuenta en `indexItems`,
          y por eso no aparece en el riel ni en `SectionCloser`. Lleva SU PROPIO
          titular (`SectionHeader`, `level={2}`) porque el `h1` de la página ya
          lo puso el hero — dos `h1` rompería el punto 4 del checklist, que
          `check:marco` verifica— pero en tamaño `section` (el mismo peldaño
          que separaba las once secciones numeradas, más grande que su
          `section-sm`): es la única cabecera de todo el artículo que no abre
          una parada del recorrido, y el tamaño lo dice antes que el texto.
          Sus palabras sí entran en el recuento total: es texto real que el
          lector se lee, aunque no sea una sección numerada.

          Ancho de MEDIA COLUMNA (`--measure`, ~42rem), no el de la prosa a
          columna completa (`--prose-w`, 78rem): a cuatro frases cortas,
          columna entera dejaba líneas larguísimas para tan poco texto — el
          mismo motivo por el que las listas de `ArticleProse` ya usan
          `--measure` en vez del ancho del contenedor. */}
      <section id="apertura" className={SECTION}>
        <div className={WRAP}>
          <SectionHeader
            eyebrow={t.opening.kicker}
            title={t.opening.title}
            level={2}
            size="section"
          >
            <div className="max-w-[var(--measure)]">
              <ArticleProse blocks={blocksOf(t.opening.body)} />
            </div>
          </SectionHeader>
        </div>
      </section>

      {/* scroll-mt-[5rem] en las tres secciones con ancla (design-review P60):
          el nav es sticky y ningún ancla tenía margen de scroll, así que los
          30+ enlaces internos del artículo (índice, SectionCloser) dejaban la
          sección arrancando debajo del nav. 5rem es el mismo alto que ya
          asume la apertura (`calc(100svh-5rem)`), con margen de sobra sobre
          los ~65px reales del nav. */}
      <section id="indice" className={cn(SECTION, "scroll-mt-[5rem]")}>
        <div className={WRAP}>
          <SectionIndex
            kicker={t.index.kicker}
            aside={t.index.timeLabel}
            ariaLabel={t.index.ariaLabel}
            items={indexItems}
            intro={
              // Vivía ANTES del eyebrow «ÍNDICE» — dos elementos orientando
              // al lector, uno encima del otro (P60 tanda 2, punto 2). Ahora
              // cuelga de su propio rótulo, entre el eyebrow y la rejilla, y
              // el recuento cierra la MISMA línea que la nota en vez de ir en
              // un párrafo propio debajo (P60 tanda 3-bis, punto 1): eran dos
              // frases orientando al lector, apiladas, cuando son una sola
              // idea — cómo leer el artículo y cuánto hay que leer.
              <p
                data-reveal
                className={cn(
                  "text-muted-foreground m-0 max-w-[var(--measure)] text-[0.9rem]",
                  LEADING.lead,
                )}
              >
                {t.index.note}{" "}
                <b className="text-foreground font-medium">
                  {totalWords.toLocaleString("es-ES")}
                </b>{" "}
                {t.index.wordsSuffix}
                <span className="mx-[0.5em]">·</span>
                <b className="text-foreground font-medium">
                  {totalSections}
                </b>{" "}
                {t.index.sectionsSuffix}
              </p>
            }
          />
        </div>
      </section>

      {t.sections.map((s, i) => {
        const position = i + 1;
        return (
          <section
            key={s.id}
            id={s.id}
            className={cn(SECTION, "scroll-mt-[5rem]")}
          >
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
              <ArticleProse
                blocks={blocksOf(s.body)}
                diagrams={DIAGRAMS}
                resolveLiveStatHref={resolveLiveStatHref}
                liveStatExtras={LIVESTAT_EXTRAS}
              />
              <RepoStrip
                label={s.enlace.label}
                parts={conAncla(s.enlace.parts)}
              />
              <SectionCloser
                position={position}
                total={totalSections}
                indexLabel={t.chapterNav.indexLabel}
                indexHref="#indice"
                nextLabel={`${t.chapterNav.nextLabel} ${
                  t.sections[i + 1]?.ordinal ?? t.closing.ordinal
                } · ${t.sections[i + 1]?.indexLabel ?? t.closing.indexLabel}`}
                nextHref={`#${t.sections[i + 1]?.id ?? t.closing.id}`}
                ariaLabel={t.chapterNav.ariaLabel}
                positionLabel={`${position} ${t.sectionMeta.of} ${totalSections}`}
              />
            </div>
          </section>
        );
      })}

      <section id={t.closing.id} className={cn(SECTION, "scroll-mt-[5rem]")}>
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
          <ArticleProse blocks={blocksOf(t.closing.body)} diagrams={DIAGRAMS} />
          <RepoStrip
            label={t.closing.enlace.label}
            parts={conAncla(t.closing.enlace.parts)}
          />
          {/* El cierre termina igual que las otras diez secciones —mismo pie,
              sin franja de contacto propia (P60 tanda 3, puntos 7 y 9): tenía
              su propio bloque de «Escríbeme / teléfono / LinkedIn / CV», que
              lo hacía la única sección con un pie distinto, y ese contacto ya
              vive en la home (D29). Sin «siguiente» —es la última—, así que
              `SectionCloser` se llama sin `nextHref`. */}
          <SectionCloser
            position={totalSections}
            total={totalSections}
            indexLabel={t.chapterNav.indexLabel}
            indexHref="#indice"
            ariaLabel={t.chapterNav.ariaLabel}
            positionLabel={`${totalSections} ${t.sectionMeta.of} ${totalSections}`}
          />
        </div>
      </section>
    </>
  );
}
