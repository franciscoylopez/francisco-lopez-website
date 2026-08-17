import type {
  DeepDiveDict,
  TrayectoriaComunDict,
} from "@/app/[lang]/dictionaries";

import { Breadcrumb, type BreadcrumbDict } from "./breadcrumb";
import { CARD, PANEL, SECTION, WRAP } from "@/components/ui/layout";
import { artefactoSvg } from "@/lib/artefacto";
import { Rich } from "@/components/ui/rich";
import { SectionHeader } from "@/components/ui/heading";

// PLANTILLA ÚNICA del deep-dive por experiencia (P48). Una sola forma renderiza
// las cinco: la homogeneidad de la serie no la dan los títulos —los subapartados
// de «La historia» son libres y cambian de una a otra— sino el MARCO y la
// longitud (PRD-Historical §42). Por eso la plantilla es el sitio donde vive el
// marco, y el diccionario solo trae contenido.
//
// LA APERTURA ES TIPOGRÁFICA Y SIN IMAGEN, y es una decisión, no una carencia:
//
//  - El h1 no es el nombre de la empresa sino la AFIRMACIÓN de la experiencia
//    («No se elige una empresa, se elige un squad»). El nombre ya está en el
//    rótulo, en el breadcrumb y en el título del navegador; gastarle el h1 sería
//    repetirlo tres veces y no decir nada. Es la misma regla con la que D43 sacó
//    el titular de las 19 secciones del sitio.
//  - Sin imagen, la apertura no paga LCP: el LCP es el propio h1 (284 ms medidos
//    en local), no una foto que descargar.
//
//    OJO — LO QUE AQUÍ SE ESCRIBIÓ PRIMERO ERA FALSO, y lo tumbó el primer
//    disparo del gate (D52) sobre esta misma página. Decía que sin banda por `vw`
//    «el modo de fallo caro de D50 desaparece por construcción». No desaparece:
//    **el eje de D50 nunca fue `vw`, era el ALTO**, y una apertura tipográfica
//    tiene su propia forma de crecer — el `<dl>` de Datos mide 80,25px cuando
//    cada valor cabe en una línea y 103px cuando uno envuelve, y el h1 salta de
//    dos líneas a tres según cuántos caracteres tenga la afirmación. Medido a
//    1280×618 (un 1920 con el escalado de Windows al 150%), Emendu terminaba sus
//    Datos en 639,55px, o sea **21,55px por debajo del borde de la ventana**,
//    mientras Freepik cabía por 1,25px. Quitar el `vw` cambió el mecanismo, no el
//    eje. Por eso esto se comprueba dibujando y no al cerrar.
//  - Y escala a cinco páginas sin que ninguna pese más que otra. Con el logo de
//    cada empresa, la apertura de Freepik y la de KUOTIP no pesarían igual —que
//    es justo lo que §42 evita: que la corta parezca la versión incompleta de la
//    larga.
//
// EL ORDINAL DEL RÓTULO ES POSICIONAL, no fijo por sección: «El caso» solo
// aparece donde hay historia de verdad, así que en Freepik los Aprendizajes son
// la 03 y en Emendu la 04. Numerar por marco dejaría un hueco donde falta el
// caso, que es exactamente leerlo como una sección que falta.

type DeepDiveProps = {
  t: DeepDiveDict;
  comun: TrayectoriaComunDict;
  breadcrumb: BreadcrumbDict;
  homeHref: string;
  indexHref: string;
};

/** Prosa del cuerpo, con el mismo pie que la otra página larga del sitio. */
function Body({ paragraphs }: { paragraphs: readonly string[] }) {
  return (
    <div className="text-foreground/90 flex flex-col gap-5">
      {paragraphs.map((p, i) => (
        <p key={i} className="m-0 text-[1.0625rem] leading-[1.75]">
          <Rich text={p} />
        </p>
      ))}
    </div>
  );
}

/**
 * Sección del deep-dive: filete, rótulo numerado y titular propio de la página.
 * EL CUERPO VA A ANCHO DE CONTENEDOR, NO A LA MEDIDA DE LECTURA. `PROSE` (42rem)
 * ocupa el 52% de los 1.280px de contenido, y a lo largo de una página entera eso
 * no se lee como una columna de lectura: se lee como media página vacía, y además
 * alarga el scroll. La media columna es el tratamiento de las **entradas y los
 * cierres** —el h1 de la apertura—, no el del cuerpo. Es la misma corrección que
 * ya se hizo en Sobre mí, donde «Cómo llegué a Producto» ocupa el contenedor
 * entero (2026-08-16, revisión de Francisco sobre la plantilla servida).
 */
// SE PROBÓ SACAR «En un minuto» A SU PROPIA SUPERFICIE (`PANEL`, o sea `--card`)
// y se descartó viéndolo servido (2026-08-16, Francisco). El argumento a favor
// era bueno sobre el papel —es la sección escrita para el lector de 5-10 segundos
// del PRD §2, así que una caja propia diría en el diseño lo que ya dice el
// contenido— y aun así no funcionó en pantalla: a ancho de contenedor la caja
// sale mucho más ancha que alta y deja de leerse como tarjeta. Queda anotado para
// que no vuelva a proponerse como idea nueva.
function Seccion({
  n,
  label,
  title,
  children,
}: {
  n: number;
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className={SECTION}>
      <div className={WRAP}>
        <div data-reveal>
          <SectionHeader
            eyebrow={`${String(n).padStart(2, "0")} — ${label}`}
            title={title}
            size="section-sm"
            titleClassName="text-balance"
          />
        </div>
        <div data-reveal className="mt-[clamp(1.5rem,3vw,2.25rem)]">
          {children}
        </div>
      </div>
    </section>
  );
}

/**
 * Los cinco datos de la experiencia. Es una lista de definiciones y no una tabla:
 * son cinco pares etiqueta-valor de UNA sola entidad, no filas comparables entre
 * sí, y `<dl>` es lo que hace que un lector de pantalla lea «Reporting: miembro
 * del equipo de liderazgo» en vez de dos textos seguidos (D40, que reserva el
 * marcado de tabla para lo que de verdad tiene columnas).
 */
function Datos({
  datos,
  labels,
}: {
  datos: DeepDiveDict["datos"];
  labels: TrayectoriaComunDict["datosLabels"];
}) {
  const filas = [
    { label: labels.rol, value: datos.rol },
    { label: labels.periodo, value: datos.periodo },
    { label: labels.sector, value: datos.sector },
    { label: labels.tamano, value: datos.tamano },
    { label: labels.reporting, value: datos.reporting },
  ];

  return (
    <dl className="border-border m-0 grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,11rem),1fr))] gap-x-[var(--gutter)] gap-y-6 border-t pt-[clamp(1.5rem,3vw,2rem)]">
      {filas.map((f) => (
        <div key={f.label}>
          <dt className="text-muted-foreground m-0 text-[0.72rem] font-semibold tracking-[0.08em] uppercase">
            {f.label}
          </dt>
          <dd className="m-0 mt-[0.45rem] text-[0.95rem] leading-[1.5] text-pretty">
            {f.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * El artefacto de la página. Va DENTRO de «El caso» y después de la prosa que lo
 * nombra, no al final de la página: es prueba de lo que se acaba de contar, no un
 * anexo. Mismo criterio con el que §43 dejó dentro el vídeo de INDYA —lo que
 * respalda la lectura va dentro; lo que la sustituye, fuera—.
 */
function Artefacto({
  title,
  caption,
  description,
  svg,
}: NonNullable<NonNullable<DeepDiveDict["caso"]>["artefacto"]>) {
  return (
    <figure className="m-0 mt-8">
      <h3 className="text-muted-foreground m-0 mb-4 text-[0.72rem] font-semibold tracking-[0.08em] uppercase">
        {title}
      </h3>
      <div className={PANEL}>
        {/* La alternativa textual va ANTES del dibujo y visualmente oculta: un
            lector de pantalla no puede seguir flechas, así que no se etiqueta el
            dibujo, se CUENTA lo que dice (punto 8 del checklist). */}
        <p className="sr-only">{description}</p>
        {/* El diagrama es ancho de verdad —2.235 unidades— así que scrollea
            dentro de su panel en vez de encogerse hasta ser ilegible. El cuerpo
            de la página nunca scrollea en horizontal. */}
        <div className="overflow-x-auto p-[var(--gutter)]">
          <div
            className="[&>svg]:block [&>svg]:h-auto [&>svg]:w-full [&>svg]:min-w-[46rem]"
            // El SVG viene de `content/artefactos/`, generado por
            // `scripts/artefacto-svg.ts` desde el `.mmd`. Va inline y no como
            // `<img>` porque una imagen no ve las variables CSS de la página, y
            // entonces el diagrama no conmutaría con el tema.
            dangerouslySetInnerHTML={{ __html: artefactoSvg(svg) }}
          />
        </div>
      </div>
      <figcaption className="text-muted-foreground m-0 mt-3 text-[0.9rem] leading-[1.55] text-pretty">
        {caption}
      </figcaption>
    </figure>
  );
}

/**
 * Las cifras del caso. Tres tarjetas y no una tabla, por lo mismo que `Datos`: no
 * hay columnas que comparar, hay tres medidas sueltas de la misma entrega. La
 * cifra va en `font-display` porque es lo que el lector rápido de §2 se lleva si
 * no lee nada más.
 */
function Resultados({
  resultados,
}: {
  resultados: NonNullable<NonNullable<DeepDiveDict["caso"]>["resultados"]>;
}) {
  return (
    <section aria-label={resultados.title} className="mt-8">
      {/* `h3` y no `h4`: dentro de «El caso» no hay subapartados, así que un h4
          sería un salto de nivel (punto 4 del checklist). El nivel es semántica
          y el tamaño es aspecto — aquí el rótulo se ve pequeño y encabeza igual. */}
      <h3 className="text-muted-foreground m-0 mb-4 text-[0.72rem] font-semibold tracking-[0.08em] uppercase">
        {resultados.title}
      </h3>
      <ul className="m-0 grid list-none [grid-template-columns:repeat(auto-fit,minmax(min(100%,13rem),1fr))] gap-[var(--gutter)] p-0">
        {resultados.items.map((r) => (
          <li key={r.value} className={`${CARD} p-5`}>
            <p className="font-display m-0 text-[clamp(1.5rem,3vw,1.9rem)] leading-[1.1] font-semibold tracking-[-0.02em] [font-variant-numeric:tabular-nums]">
              {r.value}
            </p>
            <p className="text-muted-foreground m-0 mt-2 text-[0.9rem] leading-[1.55] text-pretty">
              {r.desc}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function DeepDive({
  t,
  comun,
  breadcrumb,
  homeHref,
  indexHref,
}: DeepDiveProps) {
  // El ordinal se cuenta al vuelo porque «El caso» es opcional. Ver la nota de
  // arriba.
  let n = 0;
  const siguiente = () => ++n;

  return (
    <>
      <div className="py-[clamp(1.5rem,3vw,1.75rem)]">
        <div className={WRAP}>
          <div data-reveal className="mb-[clamp(2rem,4vw,3rem)]">
            <Breadcrumb
              routeLabel={breadcrumb.routeLabel}
              items={[
                { label: breadcrumb.home, href: homeHref },
                { label: comun.crumbIndice, href: indexHref },
                { label: t.crumb },
              ]}
            />
          </div>

          {/* La apertura SÍ es media columna: es la entrada, y el `max-w` del
              titular es lo que la dibuja. Ver la nota de `Seccion`. */}
          <header>
            <SectionHeader
              eyebrow={t.eyebrow}
              title={t.title}
              level={1}
              size="page"
              reveal
              // 20ch y no 15: con 15 el titular caía a TRES líneas de 80px, y
              // esas tres líneas eran las que empujaban los Datos 21,55px por
              // debajo del borde a 1280×618. Con 20 entra en dos en las dos
              // afirmaciones escritas, que además es lo que hace que las cinco
              // aperturas pesen parecido en vez de depender de cuántas palabras
              // tenga cada frase.
              titleClassName="max-w-[20ch] text-balance"
            />
          </header>

          <div data-reveal className="mt-[clamp(2.5rem,5vw,3.5rem)]">
            <Datos datos={t.datos} labels={comun.datosLabels} />
          </div>
        </div>
      </div>

      <Seccion
        n={siguiente()}
        label={comun.secciones.minuto}
        title={t.minuto.title}
      >
        {/* Los discos en cian son DECORACIÓN, no información: lo que dice el
            bullet es su texto, y el marcador solo lo puntea. Es el hueco que
            `BRAND.md` deja abierto para los tokens de marca —«detalles»— y el
            que da color a la sección sin teñir nada que haya que leer. */}
        <ul className="text-foreground/90 marker:text-brand-cyan m-0 flex list-disc flex-col gap-[0.9rem] p-0 pl-[1.1rem]">
          {t.minuto.items.map((item, i) => (
            <li key={i} className="text-[1.0625rem] leading-[1.7]">
              <Rich text={item} />
            </li>
          ))}
        </ul>
      </Seccion>

      <Seccion
        n={siguiente()}
        label={comun.secciones.historia}
        title={t.historia.title}
      >
        <div className="flex flex-col gap-[clamp(2rem,4vw,2.75rem)]">
          {t.historia.bloques.map((b) => (
            <div key={b.title}>
              <SectionHeader title={b.title} level={3} size="sub">
                <Body paragraphs={b.paras} />
              </SectionHeader>
            </div>
          ))}
        </div>
      </Seccion>

      {t.caso ? (
        <Seccion
          n={siguiente()}
          label={comun.secciones.caso}
          title={t.caso.title}
        >
          <Body paragraphs={t.caso.paras} />
          {t.caso.artefacto ? <Artefacto {...t.caso.artefacto} /> : null}
          {t.caso.resultados ? (
            <Resultados resultados={t.caso.resultados} />
          ) : null}
          <div className="mt-8">
            <Body paragraphs={t.caso.cierre} />
          </div>
        </Seccion>
      ) : null}

      <Seccion
        n={siguiente()}
        label={comun.secciones.aprendizajes}
        title={t.aprendizajes.title}
      >
        {/* Lista ORDENADA: los aprendizajes van numerados en el documento de
            formato y se citan por su número. El marcador lo pinta la lista, no
            un dígito escrito en el texto. */}
        <ol className="text-foreground/90 m-0 flex list-decimal flex-col gap-6 p-0 pl-[1.35rem] marker:font-semibold">
          {t.aprendizajes.items.map((a) => (
            <li key={a.title} className="text-[1.0625rem] leading-[1.75]">
              <strong className="text-foreground font-semibold">
                {a.title}
              </strong>{" "}
              <Rich text={a.text} />
            </li>
          ))}
        </ol>
      </Seccion>
    </>
  );
}
