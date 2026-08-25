import { Check } from "lucide-react";

import type { Dictionary } from "@/app/[lang]/dictionaries";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import {
  LAST_A11Y_REVIEW,
  cardinal,
  levelOf,
  ratioText,
  fillDate,
  fillPages,
  fillRatios,
} from "@/lib/design-values";
import { pagePath, type Locale } from "@/lib/i18n/config";
import { Breadcrumb, type BreadcrumbDict } from "./breadcrumb";
import { InfoCard } from "@/components/ui/info-card";
import { Rich } from "@/components/ui/rich";
import { CARD, HERO_ROW, SECTION, WRAP } from "@/components/ui/layout";
import { Stat, StatRow } from "@/components/ui/stat-row";
import { EmailLink } from "./contact-actions";
import { RelatedPages, type RelatedDict } from "./related-pages";
import { HerenciaDiagram } from "./diagrams/herencia";
import { CapasVerificacionDiagram } from "./diagrams/capas-verificacion";
import { LiveStat } from "@/components/ui/live-stat";
import { fillFigures } from "@/lib/figures";
import { LEADING, SectionHeader } from "@/components/ui/heading";

type AccesibilidadDict = Dictionary["accesibilidad"];

// Página de Accesibilidad (PRD §9, V2). Hermana de Brand Kit / Design System (D21):
// mismo lenguaje visual —hero con composición a la derecha + fila de datos, secciones
// numeradas con `SectionHeader`, encabezado grande a la izquierda y contenido a ancho
// completo—, breadcrumb, RelatedPages y JSON-LD BreadcrumbList. Es la declaración
// PÚBLICA de conformidad (el nivel WCAG que cumple el sitio y cómo reportar una
// barrera), contrapunto del criterio interno de la sección 08 del Design System.
//
// El contenido está medido y verificado (axe 0 violaciones en claro/oscuro,
// Lighthouse a11y 100). La cifra de conformidad y la fecha de `hero.updated` se
// revisan tras cada QA de accesibilidad del build, no se declaran de memoria.
export function Accesibilidad({
  dict,
  related,
  breadcrumb,
  homeHref,
  lang,
}: {
  dict: AccesibilidadDict;
  related: RelatedDict;
  breadcrumb: BreadcrumbDict;
  homeHref: string;
  lang: Locale;
}) {
  const t = dict;

  // CUÁNTOS PUNTOS DEL CHECKLIST SE HEREDAN, contados y no escritos (D38). La nota
  // de (02) afirma «cuatro de los nueve», y las dos cifras son justo las que se
  // quedan atrás cuando alguien añade un punto: el total, porque la lista de
  // arriba crece sola, y el heredado, porque depende de si la pieza lo trae. El
  // dato vive PEGADO a cada punto (`inherited`) y no en una lista aparte, que es
  // lo que impide que digan cosas distintas.
  const total = t.measures.items.length;
  const heredados = t.measures.items.filter((m) => m.inherited).length;
  const fillCounts = (text: string) =>
    text
      .replace(/{heredados}/g, cardinal(heredados, lang))
      .replace(/{total}/g, cardinal(total, lang));

  return (
    <>
      {/* ===================== HERO ===================== */}
      <section className="flex flex-col py-[clamp(1.5rem,3vw,1.75rem)] pb-[var(--section-y)] md:min-h-[calc(100svh-5rem)]">
        {/* La apertura ocupa el pliegue (P54). Misma constante que el hero de la
            home y que el deep-dive; el porqué largo, en `brand-kit/hero.tsx`.
            Medido antes: a 1920×1080 dejaba 234px de hueco por debajo, con el
            rótulo de la segunda sección asomando. Es `min-h` porque a 1280×618
            esta apertura ya desborda el pliegue y la regla no debe recortar. El
            `w-full` evita que el `mx-auto` de `WRAP` desactive el stretch. */}
        <div className={`${WRAP} flex w-full flex-1 flex-col`}>
          <div data-reveal className="mb-[clamp(3rem,6vw,4.5rem)]">
            <Breadcrumb
              routeLabel={breadcrumb.routeLabel}
              items={[
                { label: breadcrumb.home, href: homeHref },
                { label: t.crumb },
              ]}
            />
          </div>
          <div className="my-auto">
            <div className={HERO_ROW}>
              {/* `self-start` — el porqué, en `brand-kit/hero.tsx`: sin él el hueco
                breadcrumb→eyebrow lo decide el alto de la ilustración de al lado. */}
              <div className="min-w-[min(100%,18rem)] flex-[1.2_1_24rem] self-start">
                <SectionHeader
                  eyebrow={t.hero.kicker}
                  title={t.hero.title}
                  level={1}
                  size="page"
                  reveal
                >
                  <p
                    data-reveal
                    className="text-muted-foreground max-w-[46ch] text-[clamp(1.05rem,1.6vw,1.2rem)] leading-[1.6]"
                  >
                    {t.hero.lead}
                  </p>
                </SectionHeader>
              </div>
              <HeroComposition />
            </div>
            {/* datos */}
            <StatRow>
              <Stat value="AA" label={t.hero.statConformidad} />
              <Stat value="AAA" label={t.hero.statColor} />
              <Stat value="0" label={t.hero.statAxe} />
              <Stat value="100" label={t.hero.statLighthouse} />
            </StatRow>
            {/* La vigencia de una declaración de conformidad es contexto que se
                quiere ANTES de leerla, no al final: sube aquí para igualar a la
                política de cookies, que ya la lleva arriba y cuyo copy dice «la
                fecha del principio». Va DEBAJO de las cifras para no meterse
                entre la entradilla y su dato. Sigue escrita a mano y duplicada en
                los dos idiomas: eso lo resuelve su tarea (P87.56). */}
            <p
              data-reveal
              className="text-muted-foreground m-0 mt-6 text-[0.85rem]"
            >
              {fillDate(t.hero.updated, LAST_A11Y_REVIEW, lang)}
            </p>
          </div>
        </div>
      </section>

      {/* ===================== (01) NIVEL DE CONFORMIDAD ===================== */}
      <section data-reveal className={SECTION}>
        <div className={WRAP}>
          <SectionHeader
            eyebrow={t.conformance.num}
            title={t.conformance.heading}
            size="section-sm"
          >
            <p className="text-muted-foreground m-0 mb-8 max-w-[var(--measure)] text-[0.95rem] leading-[1.7]">
              {fillRatios(t.conformance.intro, lang)}
            </p>
          </SectionHeader>
          <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,17rem),1fr))] gap-[var(--gutter)]">
            {t.conformance.rows.map((r) => (
              <InfoCard key={r.label} title={r.label} body={r.value} />
            ))}
          </div>
          {/* La precisión que sostiene la fila «Norma europea»: la EAA obliga a
              productos y servicios comerciales, no a una web personal, y decir lo
              contrario sería el error que justo el público de esta página detecta.
              Va con <Rich> porque lleva los enlaces oficiales, EUR-Lex y ETSI
              (D23), y desde P70.105 también el de WCAG: es aquí, «que remite a
              WCAG», donde la norma aparece por primera vez en texto corrido, y
              los salientes se reparten por la página en su primera aparición en
              vez de amontonarse en un bloque final (decisión de Francisco). */}
          <p className="text-muted-foreground m-0 mt-8 max-w-[var(--measure)] text-[0.95rem] leading-[1.7]">
            <Rich text={t.conformance.note} />
          </p>
        </div>
      </section>

      {/* ===================== (02) QUÉ SE HA HECHO ===================== */}
      <section data-reveal className={SECTION}>
        <div className={WRAP}>
          <SectionHeader
            eyebrow={t.measures.num}
            title={t.measures.heading}
            size="section-sm"
          >
            <p className="text-muted-foreground m-0 mb-8 max-w-[var(--measure)] text-[0.95rem] leading-[1.7]">
              {t.measures.intro}
            </p>
          </SectionHeader>
          <ol className="m-0 grid list-none [grid-template-columns:repeat(auto-fill,minmax(min(100%,21rem),1fr))] gap-3 p-0">
            {t.measures.items.map((c) => (
              <li key={c.title} className={cn(CARD, "px-[1.15rem] py-4")}>
                <div className="flex items-start gap-[0.9rem]">
                  <span
                    aria-hidden="true"
                    className="text-primary inline-flex h-[26px] w-[26px] flex-none items-center justify-center rounded-[7px]"
                    style={{
                      background:
                        "color-mix(in oklch, var(--primary), transparent 86%)",
                    }}
                  >
                    <Check className="size-[15px]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <p className="text-foreground m-0 text-[0.95rem] font-semibold">
                        {c.title}
                      </p>
                      <span className="text-muted-foreground font-mono text-[0.7rem] whitespace-nowrap tabular-nums">
                        {c.wcag}
                      </span>
                    </div>
                    <p className="text-muted-foreground m-0 mt-1 text-[0.86rem] leading-[1.55]">
                      {c.body}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          {/* El puente a (03): de los nueve puntos de arriba, cuáles no se
              vuelven a comprobar página a página. Mismo patrón de nota que el
              resto de secciones; las dos cifras se cuentan, no se escriben. */}
          <p className="text-muted-foreground m-0 mt-8 max-w-[var(--measure)] text-[0.95rem] leading-[1.7]">
            <Rich text={fillCounts(t.measures.note)} />
          </p>
        </div>
      </section>

      {/* ===================== (03) HERENCIA ===================== */}
      {/* LA SECCIÓN QUE FALTABA, y el diagnóstico que la abre (P70.02): la página
          contaba lo que tiene cualquiera y callaba lo que no tiene nadie. Los
          nueve puntos de (02) son la lista genérica; lo que los convierte en
          criterio es que cuatro de ellos NO se negocian por página porque los
          pone la capa de componentes, y que el atenuado lo resuelve la superficie
          y no el punto de uso (D30/D39/D61). Es lo que un CPO lee como criterio
          de producto, y no estaba escrito en ninguna parte del sitio. */}
      <section data-reveal className={SECTION}>
        <div className={WRAP}>
          <SectionHeader
            eyebrow={t.inheritance.num}
            title={t.inheritance.heading}
            size="section-sm"
          >
            <p className="text-muted-foreground m-0 mb-8 max-w-[var(--measure)] text-[0.95rem] leading-[1.7]">
              {t.inheritance.intro}
            </p>
          </SectionHeader>
          {/* EL DIBUJO VA ANTES DE LAS TARJETAS, no después (P70.101): las
              cuatro tarjetas cuentan CÓMO se hereda cada mecanismo, y el
              diagrama dice QUÉ se hereda. Puesto detrás, se leía como un
              resumen de lo ya leído en vez de como el mapa que las ordena.

              EL MARCO ES EL MISMO QUE EL DE LOS DIAGRAMAS DEL ARTÍCULO, y su
              `p-[clamp(1rem,2.5vw,1.5rem)]` no es decoración: a 360 resuelve a
              16px, que son los que `check:figuras` presupuesta al calcular el
              hueco (360 − 42 de página − 2 de borde − 32 de panel = 284). Con
              más aire, el rótulo cae por debajo de 11px pintados sin que nadie
              toque el dibujo. Se midió en el prototipo, donde con 24px daba
              9,19.

              Y `max-w-[690px]` PORQUE LA CAJA SE AJUSTA AL DIBUJO, no a la
              columna (feedback de Francisco: a ancho completo la tarjeta dejaba
              250px de vacío a cada lado del lienzo).

              EL NÚMERO NO ES DE DISEÑO Y NO SE PUEDE APRETAR MÁS: 690 − 2 del
              borde − 48 del padding a escritorio (el `clamp` ya en su tope de
              1,5rem) = 640 de contenido, que es lo que mide el `@container`. Y
              tiene que quedar POR ENCIMA de 630, el umbral del lienzo ancho:
              con 670 el contenido son 620 justos, o sea por debajo, y el
              diagrama saltaba al dibujo estrecho precisamente en escritorio.

              BAJAR EL UMBRAL EN VEZ DE ENSANCHAR LA CAJA NO VALE, y lo cazó
              `check:figuras` al intentarlo: el umbral es un CONTRATO —«este
              lienzo puede aparecer a partir de este ancho»—, así que ponerlo en
              610 promete dibujar a 610, y ahí el rótulo son 10,8px pintados.

              OJO AL VERIFICARLO: el gate no modela el `max-w` de esta caja, así
              que un 670 le parece bien. Lo que caza el salto de lienzo es mirar
              la página servida, no el gate.

              `diagram-realce` + `data-reveal` encienden el barrido de `.rlz`
              (D79). Sin JS o con `prefers-reduced-motion`, cada pieza es
              opacidad 1 desde el primer render. */}
          <figure
            data-reveal
            className="diagram-realce border-border bg-card mx-auto mt-0 mb-8 max-w-[690px] overflow-hidden rounded-xl border"
          >
            <div className="@container flex items-center justify-center p-[clamp(1rem,2.5vw,1.5rem)]">
              <HerenciaDiagram lang={lang} />
            </div>
            <figcaption
              className={cn(
                "border-border text-muted-foreground border-t px-5 py-4 text-[0.85rem]",
                LEADING.lead,
              )}
            >
              {t.inheritance.figura.caption}
            </figcaption>
          </figure>
          <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,17rem),1fr))] gap-[var(--gutter)]">
            {t.inheritance.items.map((i) => (
              <InfoCard
                key={i.title}
                title={i.title}
                body={fillPages(i.body, lang)}
              />
            ))}
          </div>
          <p className="text-muted-foreground m-0 mt-8 max-w-[var(--measure)] text-[0.95rem] leading-[1.7]">
            <Rich text={fillPages(t.inheritance.note, lang)} />
          </p>
          {/* EL DATO EN VIVO, y aquí es donde deja de ser una promesa: la
              sección afirma que los controles salen de una capa común, y esto
              enlaza al catálogo que los publica. La cifra NO se escribe —
              `{piezasNucleo}` la resuelve `fillFigures` contando en el disco
              los archivos con cabecera `@pieza núcleo`—, así que crear una
              pieza la mueve sola. Es D38 con forma de bloque, y por eso esta
              pieza dejó de vivir en la capa de artículo (P70.102, D113).

              Y el `example` enseña piezas REALES del sistema con una cifra
              REAL del censo, no una recreación: es el argumento de la sección
              hecho con el propio material del que habla. */}
          <LiveStat
            label={t.inheritance.livestat.label}
            source={t.inheritance.livestat.source}
            value={fillFigures(t.inheritance.livestat.value, lang)}
            linkLabel={t.inheritance.livestat.linkLabel}
            href={pagePath(lang, "design-system")}
            example={
              <>
                <Badge tone="cyan" kind="code">
                  {ratioText("bodyText", "light", lang)}
                </Badge>
                <Badge tone="cyan" kind="value">
                  {levelOf("bodyText", "light")}
                </Badge>
              </>
            }
          />
        </div>
      </section>

      {/* ===================== (04) CÓMO SE VERIFICA ===================== */}
      <section data-reveal className={SECTION}>
        <div className={WRAP}>
          <SectionHeader
            eyebrow={t.verify.num}
            title={t.verify.heading}
            size="section-sm"
          >
            {/* Con `Rich` desde P70.105: aquí caen los enlaces de axe-core y
                Lighthouse, en la primera vez que se nombran en texto corrido y
                justo encima de las tarjetas que los describen. */}
            <p className="text-muted-foreground m-0 mb-8 max-w-[var(--measure)] text-[0.95rem] leading-[1.7]">
              <Rich text={t.verify.intro} />
            </p>
          </SectionHeader>
          <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,15rem),1fr))] gap-[var(--gutter)]">
            {t.verify.items.map((v) => (
              <InfoCard
                key={v.tool}
                title={v.tool}
                body={fillPages(v.result, lang)}
                mono
              />
            ))}
          </div>
          {/* El matiz que no cabe en una tarjeta: más largo que el resto y
              deformaba la rejilla. Mismo patrón que la nota de (01). */}
          <p className="text-muted-foreground m-0 mt-8 max-w-[var(--measure)] text-[0.95rem] leading-[1.7]">
            <Rich text={t.verify.note} />
          </p>
        </div>
      </section>

      {/* ===================== (05) EL PUNTO CIEGO ===================== */}
      {/* La otra mitad del hueco de P70.02, y la que da credibilidad: qué
          encuentra una pasada a mano que ningún motor puede encontrar. El
          material estaba, pero repartido en dos notas al pie —el enlace de salto
          en la entradilla de (04) y los hallazgos de NVDA colgando de los
          límites—, o sea contado como pie de página de otra cosa. Con titular
          propio es un argumento; enterrado, era una anécdota. */}
      <section data-reveal className={SECTION}>
        <div className={WRAP}>
          <SectionHeader
            eyebrow={t.blindspot.num}
            title={t.blindspot.heading}
            size="section-sm"
          >
            <p className="text-muted-foreground m-0 mb-8 max-w-[var(--measure)] text-[0.95rem] leading-[1.7]">
              {t.blindspot.intro}
            </p>
          </SectionHeader>
          {/* EL DIAGRAMA QUE YA EXISTÍA Y NO SE PODÍA REUSAR (P70.104). Dibuja
              cinco capas de verificación de longitud creciente y una zona final
              marcada «lo que ninguna regla prohíbe» que solo alcanza la última,
              una persona. Es LITERALMENTE el titular de esta sección, y estaba
              escrito para el capítulo 09 del artículo.

              NO SE DIBUJÓ OTRO, y ese era el bloqueo: dos diagramas del mismo
              sitio contando lo mismo con cifras distintas es el drift que P70.02
              acababa de evitar. Reusarlo obligaba antes a dos cosas, y las dos
              se hicieron: corregir su geometría, que contradecía su propio texto
              alternativo (P68.594), y sacarlo de `como-se-ha-creado-diagrams/`,
              o sea de UNA página, a `diagrams/` (P68.7205).

              MISMA CAJA QUE EL DIAGRAMA DE (03), y el `max-w-[690px]` es la
              misma aritmética, no una coincidencia de diseño: 690 menos 2 de
              borde menos 48 de padding son 640 de contenido, y el umbral de
              este lienzo también es 630. Por debajo, el diagrama saltaría a su
              dibujo estrecho en escritorio. */}
          <figure
            data-reveal
            className="diagram-realce border-border bg-card mx-auto mt-0 mb-8 max-w-[690px] overflow-hidden rounded-xl border"
          >
            <div className="@container flex items-center justify-center p-[clamp(1rem,2.5vw,1.5rem)]">
              <CapasVerificacionDiagram lang={lang} />
            </div>
            <figcaption
              className={cn(
                "border-border text-muted-foreground border-t px-5 py-4 text-[0.85rem]",
                LEADING.lead,
              )}
            >
              {t.blindspot.figura.caption}
            </figcaption>
          </figure>
          <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,17rem),1fr))] gap-[var(--gutter)]">
            {t.blindspot.items.map((b) => (
              <InfoCard
                key={b.title}
                title={b.title}
                body={fillPages(b.body, lang)}
              />
            ))}
          </div>
          <p className="text-muted-foreground m-0 mt-8 max-w-[var(--measure)] text-[0.95rem] leading-[1.7]">
            <Rich text={t.blindspot.note} />
          </p>
        </div>
      </section>

      {/* ===================== (06) LÍMITES CONOCIDOS ===================== */}
      <section data-reveal className={SECTION}>
        <div className={WRAP}>
          <SectionHeader
            eyebrow={t.limits.num}
            title={t.limits.heading}
            size="section-sm"
          >
            <p className="text-muted-foreground m-0 mb-8 max-w-[var(--measure)] text-[0.95rem] leading-[1.7]">
              {t.limits.intro}
            </p>
          </SectionHeader>
          <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,19rem),1fr))] gap-[var(--gutter)]">
            {t.limits.items.map((l) => (
              <InfoCard key={l.title} title={l.title} body={l.body} />
            ))}
          </div>
          {/* El matiz que no cabe en una tarjeta: más largo que el resto y
              deformaba la rejilla. Mismo patrón que la nota de (01). */}
          <p className="text-muted-foreground m-0 mt-8 max-w-[var(--measure)] text-[0.95rem] leading-[1.7]">
            <Rich text={t.limits.note} />
          </p>
        </div>
      </section>

      {/* ===================== (07) EL TÉRMINO ===================== */}
      {/* EL HUECO QUE TAPA (P70.105): «a11y» aparecía UNA vez en toda la página
          —el rótulo `Lighthouse a11y` de la fila de datos del hero—, sin glosa,
          en la primera pantalla, y en una página cuyo público incluye a RRHH.
          Jerga de gremio usada como vocabulario común, justo en la página cuya
          sección 02 abre diciendo «en lenguaje llano». El rótulo del hero se
          arregló por su lado (dos cadenas), así que esta sección es CONTEXTO y
          no reparación.

          Y EL SEGUNDO HUECO, DE LA MISMA FAMILIA: la página citaba axe-core,
          Lighthouse, NVDA y WCAG sin enlazar ninguno. Quien no supiera qué es
          NVDA se quedaba igual.

          PERO ESOS CUATRO ENLACES NO VIVEN AQUÍ, y esa fue la corrección de
          Francisco a la primera versión: amontonarlos en el último bloque los
          pone donde ya no hacen falta. Cada uno cae en su PRIMERA aparición en
          texto corrido, no en una tarjeta —WCAG en la nota de (01), axe-core y
          Lighthouse en la entradilla de (04), NVDA en la nota de (05)—, y aquí
          se queda solo el de The A11Y Project, que es el sujeto de la sección.
          Todos inline en la prosa, y por eso sin icono: la regla del icono de
          `BRAND.md` deja fuera el enlace de contenido, cuya afordancia es el
          subrayado.

          NO ES UNA SÉPTIMA REJILLA DE TARJETAS a propósito. Las seis secciones
          anteriores ya son rejillas de `InfoCard`, y una más antes del cierre
          las convertiría en textura. Prosa + ilustración cambia el ritmo justo
          donde hace falta. */}
      <section data-reveal className={SECTION}>
        <div className={WRAP}>
          <SectionHeader
            eyebrow={t.term.num}
            title={t.term.heading}
            size="section-sm"
          >
            <p className="text-muted-foreground m-0 mb-8 max-w-[var(--measure)] text-[0.95rem] leading-[1.7]">
              {t.term.intro}
            </p>
          </SectionHeader>
          {/* PROSA A LA IZQUIERDA, MARCA A LA DERECHA, y sin caja: el recurso
              va directamente sobre el fondo de la página (decisión de Francisco,
              2026-08-25). La versión anterior lo metía en una tarjeta con filete
              y pie enmarcado, y una marca ajena dentro de una caja propia se lee
              como sello expuesto, que es justo lo que esta página no puede
              permitirse (mismo motivo que descartó el de getWCAG en P70.103).

              NO ES `PAIR`, que reparte 50/50 porque está escrito para DOS
              TARJETAS hermanas: aquí la columna de la derecha lleva un dibujo, y
              a media página dejaría un agujero a cada lado. Tampoco es
              `HERO_ROW`, cuyo `md:min-h-[19rem]` está calibrado para que las tres
              aperturas del sistema caigan a la misma altura. El reparto 2:1 deja
              la prosa en el ancho que `layout.ts` le da a un texto con imagen al
              lado, y apila por `flex-wrap` sin breakpoint.

              `items-center` VUELVE a ser lo correcto justo porque se quitó la
              caja: con tarjeta, la figura medía 442px contra 197 de prosa y
              centrarlas dejaba 180px de agujero sobre el primer párrafo (medido
              el 2026-08-25). Sin filete ni pie enmarcado, los dos altos se
              parecen y centrar es lo que pidió Francisco. */}
          <div className="flex flex-wrap items-center gap-[var(--gutter)]">
            <div className="flex min-w-[min(100%,20rem)] flex-[2_1_28rem] flex-col gap-4">
              <p className="text-muted-foreground m-0 text-[0.95rem] leading-[1.7]">
                {t.term.what}
              </p>
              <p className="text-muted-foreground m-0 text-[0.95rem] leading-[1.7]">
                <Rich text={t.term.project} />
              </p>
            </div>
            {/* SIN PIE Y SIN `<figure>` (decisión de Francisco, 2026-08-25): el
                recurso va suelto. Un `<figure>` sin `<figcaption>` no aporta
                nada que no aporte ya el `role="img"` del SVG con su nombre
                accesible, así que aquí sobra el elemento.

                LA ATRIBUCIÓN NO SE PIERDE POR ESO: la licencia de LoveA11y es
                «100% trademark and copyright-free» y no exige ninguna. Lo que se
                pierde es contarle al lector qué marca está viendo, y eso es una
                elección editorial, no un requisito.

                EL `max-w` OPERA SOBRE TODO AL APILAR: al envolver, el dibujo se
                queda solo en su línea y `flex-grow` lo estiraría al ancho entero
                de una tableta. Capado se comporta igual apilado que al lado de
                la prosa. Los 15,3rem son los 18 anteriores menos un 15%. */}
            <div className="flex max-w-[15.3rem] flex-[1_1_12rem] justify-center">
              <LoveA11yMark label={t.term.figura.alt} />
            </div>
          </div>
        </div>
      </section>

      {/* ===================== (08) REPORTAR UNA BARRERA ===================== */}
      <section data-reveal className={SECTION}>
        <div className={WRAP}>
          <SectionHeader
            eyebrow={t.report.num}
            title={t.report.heading}
            size="section-sm"
          >
            <div className="max-w-[var(--measure)]">
              <p className="text-foreground/90 m-0 text-[1.0625rem] leading-[1.7]">
                {t.report.body}
              </p>
              {/* La única superficie de contacto con asunto (D29): aquí se
                  reporta una barrera concreta, y preencabezarlo baja la fricción
                  de verdad. La home y Sobre mí lo dejan vacío a propósito.

                  Y AQUÍ NO HAY BOTÓN desde P67. Lo había —un sólido «Escríbeme»
                  con la dirección debajo—, y con la dirección escrita al lado no
                  añadía nada: el botón abría exactamente el mismo `mailto:` que
                  el enlace, así que era la misma acción dos veces, ocupando la
                  jerarquía del único sólido de la página. Esta página tampoco
                  enruta al formulario, a propósito: obligar a usarlo para
                  reportar una barrera sería una trampa el día que la barrera
                  fuera el formulario. */}
              <EmailLink subject={t.report.emailSubject} className="mt-6" />
            </div>
          </SectionHeader>
        </div>
      </section>

      <RelatedPages dict={related} current="accesibilidad" lang={lang} />
    </>
  );
}

// --- Subcomponentes ---

// EL TRAZADO DE LoveA11y, tal cual sale del pack de marca: UN solo `path` con
// `fill-rule="evenodd"` sobre un lienzo de 760×600. Un corazón cuyo trazo inferior
// derecho se prolonga hasta hacer de cola de la «y» de «a11y», que es lo que
// convierte al dibujo en la ilustración exacta de lo que el texto explica.
//
// LA LICENCIA LO PERMITE SIN ATRIBUCIÓN: «Free, forever», «100% trademark and
// copyright-free», «designed to be remixed». Las quince variantes del pack son el
// mismo dibujo en quince colores, así que no hay nada que elegir: se coge una y el
// relleno pasa a token.
const LOVE_A11Y_PATH =
  "m211.62,339.39c-9.69,0-15.16-4.66-15.16-12.59s5.21-11.89,15.16-11.89h22.86v11.41c-3.74,7.91-12.67,13.05-22.86,13.05m11.42-99.95c-18.58,0-37.75,3.62-57.15,10.19-4.14,1.4-9.12,4.5-6.59,11.61l4.33,12.07c3.19,8.93,7.87,9.65,15.98,7.03,11.74-3.82,22.15-6.65,30.61-6.65,12.41,0,24.24,5.02,24.24,18.18h-33.04c-34.03.46-52.17,13.99-52.17,38.45s16.89,39.85,45.71,39.85c17.88,0,31.29-5.81,39.5-16.07v6.1c0,4.34,3.78,7.89,8.4,7.89h32.36c4.62,0,8.4-3.56,8.4-7.89v-74.36c0-29.35-22.61-46.36-60.61-46.36l.02-.04Zm170.11-32.89v17.9c0,5.51,2.22,6.97,7.75,6.79l24.04-.94v129.85c0,4.34,3.78,7.89,8.4,7.89h34.79c4.62,0,8.4-3.56,8.4-7.89v-165.86c0-6.24-2.41-8.11-8.63-7.35l-64.2,9.81c-8.99,1.32-10.58,4.1-10.58,9.77l.02.02Zm-104.27,0v17.9c0,5.51,2.22,6.97,7.75,6.79l24.05-.94v129.85c0,4.34,3.78,7.89,8.4,7.89h34.79c4.62,0,8.4-3.56,8.4-7.89v-165.86c0-6.24-2.41-8.11-8.63-7.35l-64.2,9.81c-8.99,1.32-10.58,4.1-10.58,9.77l.02.02Zm71.55-118.16c13.68-18.92,30.72-35.59,50.33-49.18,28.5-19.74,61.6-32.37,96.65-37.13,56.24-7.61,113.68,6.07,159.2,37.99,29.05,20.38,51.91,46.24,67.72,76.87,52.23,101.23,18.01,230.14-42.2,321.46-47.2,71.6-118.88,134.84-205.88,160.3-14.21,4.16-17.63-8.31-20.88-18.08-3.29-9.93-7.56-20.68,6.65-24.84,76.19-22.28,139.04-79.57,180.08-142.22,51.91-79.21,85.46-195.85,35.89-282.87-12.31-21.6-29.15-39.93-50.05-54.59-35.36-24.8-79.99-35.47-123.69-29.55-27.23,3.7-52.93,13.55-75.07,28.87-22.15,15.35-39.98,35.67-51.81,58.99-1.41,2.8-3.44,5.29-5.93,7.31-9.99,8.11-25.08,7.11-33.74-2.24-18.77-20.24-42.81-35.77-69.6-45.1-26.81-9.35-55.48-12.17-83.77-8.33-44.99,6.09-85.16,28.52-112.35,62.67-72.45,90.9-19.68,213.59,68.61,275.6,40.49,28.46,89.19,46.92,139.19,53.81,47.79,6.57,98.08,2.7,142.84-15.05,44.12-17.48,87.34-44.54,114.32-90.36-1.35-2.44-2.62-5.15-3.78-8.15l-51.93-114.52c-3-6.62-1.31-8.73,6.5-8.73h30.72c9.33,0,10.35.28,13.79,8.93l29.32,73.8c8.7-24.5,12.39-49.14,14.78-77.19.32-3.78,3.84-5.76,7.62-5.54h40.49c2.03.12,3.86.86,5.11,2.4,1.37,1.7,1.2,3.56.76,5.51-21.37,119.98-63.9,204.9-189.03,255.28-52.69,21.2-111.99,25.9-168.4,18.12-57.84-7.97-114.13-29.39-160.95-62.31C11.99,383.13-45.13,233.04,43.53,121.78c34.85-43.72,86.34-72.38,143.93-80.19,36.23-4.92,72.96-1.36,107.29,10.61,23.96,8.35,46.21,20.64,65.68,36.19v-.02Z";

/**
 * La marca de LoveA11y con el cian de esta casa.
 *
 * NO ES `aria-hidden`, al contrario que la composición del hero: el dibujo DICE
 * «a11y», o sea que lleva información y no puede quedarse fuera del árbol de
 * accesibilidad. Va con `role="img"` y su nombre accesible, y el nombre describe
 * el dibujo (qué se ve), no lo llama «logo».
 *
 * NO LLEVA `max-w` PROPIO, y eso es deliberado: quien acota el dibujo es su
 * columna, y **un segundo tope aquí dejaba un remanente**. Medido el 2026-08-25:
 * con `max-w-[20rem]` el SVG paraba en 320 dentro de un hueco de 334, o sea 7px
 * de vacío por lado que no eran el padding de nadie. Es la misma forma del
 * defecto ya corregido en el diagrama de (03): dos topes que no concuerdan, y el
 * dibujo deja de llenar lo suyo. Un solo tope.
 *
 * MONOCROMO (`--foreground`), Y NO EL CIAN DE MARCA (decisión de Francisco,
 * 2026-08-25). Nació en `--brand-cyan` por §Color de `BRAND.md`, que manda la
 * capa decorativa para las ilustraciones; el problema es que esto no es una
 * ilustración nuestra, es la marca de OTRO. Teñirla con el color de esta casa la
 * disfraza de elemento propio, y el sitio ya tiene una convención para un logo
 * ajeno: monocromo, como los de Trayectoria y Toolkit. La diferencia es que allí
 * son dos PNG que conmutan por tema y aquí basta un token, porque es SVG.
 *
 * Contra `--background` es el par más medido del sitio (13,79 claro / 15,32
 * oscuro), muy por encima del 3:1 que WCAG 1.4.11 le pide a un gráfico que hay
 * que entender.
 */
function LoveA11yMark({ label }: { label: string }) {
  return (
    <svg
      viewBox="0 0 760 600"
      role="img"
      aria-label={label}
      className="fill-foreground h-auto w-full"
    >
      <path fillRule="evenodd" d={LOVE_A11Y_PATH} />
    </svg>
  );
}

// Composición del hero (decorativa, aria-hidden): tres piezas superpuestas que
// ilustran de qué habla la página —una tarjeta de contraste medido, una checklist
// con marcas, y una muestra del anillo de foco de 2px— con el mismo tratamiento de
// capas rotadas que la de Design System. Tokens de marca; el cian es el acento.
function HeroComposition() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-[1_1_24rem] items-center justify-center"
    >
      {/* desktop */}
      {/* 15rem = 240px, no 20 (320). Las tres piezas ocupaban 124, 116 y 65 de
          alto, pero estaban repartidas en 320 con SESENTA Y OCHO PÍXELES DE NADA
          entre el checklist (acababa en 174) y la muestra de foco (empezaba en
          242). Lo vio Francisco comparando las tres aperturas. No se han hecho
          las piezas más pequeñas: se han juntado. */}
      <div className="relative hidden h-60 w-[min(25rem,100%)] md:block">
        {/* atrás: contraste medido */}
        <div
          data-reveal
          className="border-border bg-background absolute top-0 right-2 w-[9.5rem] rounded-[14px] border p-[0.9rem]"
          style={{ transform: "rotate(6deg)", transitionDelay: "0.08s" }}
        >
          <div className="text-muted-foreground font-mono text-[0.6rem] tracking-[0.05em] uppercase">
            Contraste
          </div>
          <div className="font-display text-foreground mt-1 text-[2rem] leading-none">
            AAA
          </div>
          <Badge tone="cyan" kind="code" className="mt-2">
            13,79:1
          </Badge>
        </div>
        {/* medio: checklist */}
        <div
          data-reveal
          className="border-border bg-background absolute top-16 right-20 flex w-[11rem] flex-col gap-[0.55rem] rounded-[14px] border p-[0.95rem]"
          style={{ transform: "rotate(-4deg)", transitionDelay: "0.16s" }}
        >
          {[100, 82, 94].map((w, i) => (
            <div key={i} className="flex items-center gap-[0.55rem]">
              <span
                className="text-primary inline-flex h-[18px] w-[18px] flex-none items-center justify-center rounded-[5px]"
                style={{
                  background:
                    "color-mix(in oklch, var(--primary), transparent 86%)",
                }}
              >
                <Check className="size-[15px]" />
              </span>
              <div
                className="bg-muted h-[0.32rem] rounded-full"
                style={{ width: `${w}%` }}
              />
            </div>
          ))}
        </div>
        {/* delante: anillo de foco */}
        <div
          data-reveal
          className="absolute top-[10.5rem] left-0"
          style={{ transform: "rotate(2deg)", transitionDelay: "0.24s" }}
        >
          <div className="ring-primary ring-offset-background rounded-[13px] ring-2 ring-offset-2">
            <div className="border-border bg-background flex items-center gap-[0.6rem] rounded-[13px] border px-[1.1rem] py-[0.8rem]">
              <span className="bg-primary h-[0.55rem] w-[0.55rem] flex-none rounded-full" />
              <span className="bg-foreground h-[0.42rem] w-[5.5rem] rounded-full opacity-70" />
            </div>
          </div>
          <div className="text-muted-foreground mt-[0.55rem] pl-[0.2rem] font-mono text-[0.6rem]">
            focus · 2px
          </div>
        </div>
      </div>
      {/* móvil: solo la muestra de foco */}
      <div className="md:hidden">
        <div className="ring-primary ring-offset-background rounded-[13px] ring-2 ring-offset-2">
          <div className="border-border bg-background flex items-center gap-[0.6rem] rounded-[13px] border px-[1.1rem] py-[0.8rem]">
            <span className="bg-primary h-[0.55rem] w-[0.55rem] flex-none rounded-full" />
            <span className="bg-foreground h-[0.42rem] w-[5.5rem] rounded-full opacity-70" />
          </div>
        </div>
      </div>
    </div>
  );
}
