import { type Dictionary } from "@/app/[lang]/dictionaries";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/ui/heading";
import { InfoCard } from "@/components/ui/info-card";
import { SECTION, WRAP } from "@/components/ui/layout";
import { LiveStat } from "@/components/ui/live-stat";
import { Rich } from "@/components/ui/rich";
import { fillPages, levelOf, ratioText } from "@/lib/design-values";
import { fillFigures } from "@/lib/figures";
import { pagePath, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

import { HerenciaDiagram } from "../diagrams/herencia";
import { DiagramaFigura, INTRO, NOTA, type SeccionMarco } from "./shared";

type T = Dictionary["accesibilidad"];

/* ===================== (03) HERENCIA ===================== */
// LA SECCIÓN QUE FALTABA, y el diagnóstico que la abre (P70.02): la página
// contaba lo que tiene cualquiera y callaba lo que no tiene nadie. Los nueve
// puntos de (02) son la lista genérica; lo que los convierte en criterio es que
// cuatro de ellos NO se negocian por página porque los pone la capa de
// componentes, y que el atenuado lo resuelve la superficie y no el punto de uso
// (D30/D39/D61). Es lo que un CPO lee como criterio de producto, y no estaba
// escrito en ninguna parte del sitio.
export function Inheritance({
  t,
  marco,
  lang,
}: {
  t: T["inheritance"];
  marco: SeccionMarco;
  lang: Locale;
}) {
  return (
    <section
      data-reveal
      id={marco.id}
      className={cn(SECTION, "scroll-mt-[5rem]")}
    >
      <div className={WRAP}>
        <SectionHeader
          eyebrow={marco.kicker}
          title={t.heading}
          size="section-sm"
        >
          <p className={INTRO}>{t.intro}</p>
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

              SIN `mx-auto`, o sea alineada a la IZQUIERDA (Francisco,
              2026-08-25, para las DOS figuras de esta página). Centrada dejaba
              su borde izquierdo desalineado con todo lo demás de la sección
              —titular, entradilla y la primera columna de tarjetas arrancan en
              el mismo eje—, y en una página que es sobre todo rejillas de
              tarjetas esa desalineación se nota más que el desequilibrio de
              tener hueco a la derecha.

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
        <DiagramaFigura caption={t.figura.caption}>
          <HerenciaDiagram lang={lang} />
        </DiagramaFigura>
        <div className="grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,17rem),1fr))] gap-[var(--gutter)]">
          {t.items.map((i) => (
            <InfoCard
              key={i.title}
              title={i.title}
              body={fillPages(i.body, lang)}
            />
          ))}
        </div>
        <p className={NOTA}>
          <Rich text={fillPages(t.note, lang)} />
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
          label={t.livestat.label}
          source={t.livestat.source}
          value={fillFigures(t.livestat.value, lang)}
          linkLabel={t.livestat.linkLabel}
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
        {marco.closer}
      </div>
    </section>
  );
}
