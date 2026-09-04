import { type CSSProperties } from "react";
import { ArrowRight, Download } from "lucide-react";

import type {
  TrayectoriaComunDict,
  TrayectoriaIndiceDict,
} from "@/app/[lang]/dictionaries";
import { EXPERIENCES, type ExperienceSlug } from "@/content/experiences";
import { factsOf } from "@/content/experience-copy";
import { actionVariants } from "@/components/ui/action";
import {
  dataLabelVariants,
  eyebrowVariants,
  titleVariants,
} from "@/components/ui/heading";
import { SECTION, WRAP } from "@/components/ui/layout";
import { IndexNote } from "@/components/ui/section-index";
import { Stat } from "@/components/ui/stat-row";
import { type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

import { BrandLogoBox } from "./brand-logo-box";
import { Periodo } from "./periodo";
import { type BreadcrumbDict } from "./breadcrumb";
import { SystemPageOpening } from "./system-page-opening";
import { Marcas } from "@/components/ui/marcas";

// ÍNDICE DEL DEEP-DIVE (P49). La página que le faltaba a la ruta: el breadcrumb
// de tres niveles de las cinco experiencias —`Inicio › Trayectoria › Emendu`—
// apuntaba aquí desde que se montaron, así que hasta ahora eran diez páginas con
// un enlace roto en su carpintería.
//
// QUÉ LISTA, Y POR QUÉ SOLO CINCO. Las que tienen caso, no la trayectoria
// entera: esa ya está en la sección de la portada y en el CV, y repetirla aquí
// habría hecho del índice una copia de la home con tres filas que no llevan a
// ningún sitio. Lo dice el pie del CV, para que la ausencia se lea como una
// decisión y no como un hueco (decidido con Francisco el 2026-08-18).
//
// NINGUNA TARJETA TIENE COPY PROPIO, y es lo único que de verdad había que
// acertar. Empresa, sector, rol y periodo salen del registro por experiencia
// —la fuente que D57/D58 acaban de fijar— y la afirmación es el `title` del
// deep-dive, o sea el h1 de la página a la que la tarjeta lleva. Un resumen
// escrito aquí habría sido la CUARTA longitud del mismo hecho, después de las
// tres que P48.5 acababa de unificar; y el modo de fallo no es teórico —el sitio
// ya tuvo la frase de INDYA hablando de «pricing y onboarding» cuando su página
// afirma justo lo contrario—.
//
// EL ORDEN LO PONE `EXPERIENCES`, cronológico descendente, igual que en la
// portada, en los logos y en el paso a la vecina. No se escribe en ningún sitio.

/** Las que tienen página, en el orden canónico del registro. */
const CON_PAGINA = EXPERIENCES.filter((e) => e.slug !== null);

// LA FILA DE CIFRAS NO SE TECLEA: se DERIVA de `content/experiences.ts`, que es
// la misma disciplina que D38 impuso a lo que el sitio publica sobre su propio
// sistema. Cuando se añada una sexta experiencia con página, las cuatro cifras
// se mueven solas; escritas a mano, tres de ellas mentirían ese mismo día.
//
// El diccionario se queda SOLO con las etiquetas, igual que en las tres
// hermanas: la cifra y su rótulo no pueden divergir porque no viven juntos.

/** Cuántos casos tienen página propia. */
const CASOS = CON_PAGINA.length;

/**
 * Cuántos terminaron en exit. Campo del dato, no una cadena de copy.
 *
 * El `"exit" in e` no es defensa: `EXPERIENCES` se declara con
 * `as const satisfies`, así que cada fila conserva sus literales y las que no
 * llevan el campo no lo tienen en su tipo. Es el mismo rigor que hace que
 * `ExperienceSlug` sea la unión real de los cinco y no `string`.
 */
const EXITS = CON_PAGINA.filter((e) => "exit" in e && e.exit).length;

/**
 * Desde qué año cubren estos cinco casos. Es el año de la más antigua CON
 * PÁGINA —no el de la trayectoria entera, que arranca en 2009 en Marketing—,
 * porque la cifra rotula lo que esta página lista y no otra cosa.
 */
const DESDE = Math.min(...CON_PAGINA.map((e) => Number(e.desde.slice(0, 4))));

/**
 * Los años que abarcan, contra el año en curso. Se recalcula en cada build, que
 * es justo lo que se quiere: una cifra congelada caduca en silencio el 1 de
 * enero y nadie se entera hasta que alguien la lee.
 */
const ANIOS = new Date().getFullYear() - DESDE;

/**
 * Cuántos sectores distintos cubren. Se cuenta sobre el copy porque el sector
 * VIVE en el copy —es una etiqueta traducida, no un dato— y el recuento sale
 * igual en los dos idiomas. Es función y no constante por eso mismo: necesita el
 * locale.
 */
const sectoresDe = (lang: Locale) =>
  new Set(CON_PAGINA.map((e) => factsOf(lang, e.company).sector)).size;

// ═══════════════════ LA COMPOSICIÓN DEL HERO ═══════════════════
//
// Decorativa (`aria-hidden`), como las de sus tres hermanas, y elegida con
// `/prototype` frente a otras dos direcciones: una ficha abierta por dentro
// («Corte») y la misma desplegada en estratos («Capas»). Ganó ésta.
//
// QUÉ DIBUJA, que es lo único que la justifica: cada hermana dibuja SU asunto
// —el Brand Kit, la anatomía del logo; el Design System, marcos con su rejilla—
// y el de esta página es la cantidad. Cinco fichas girando sobre un pivote
// común: las cuatro de atrás a filete, la de delante con contenido.
//
// SIN TEXTO, A PROPÓSITO. La versión del prototipo rotulaba la ficha de delante
// con una empresa y un sector de verdad, y eso habría metido copy fuera del
// diccionario en un elemento que nadie lee. Las líneas esquemáticas dicen lo
// mismo y no tienen idioma.
//
// EL ALTO ES EL TECHO: 15rem (240px) contra los 19rem de `HERO_ROW`, en la
// misma horquilla que las composiciones compactadas de las hermanas (207, 272 y
// 240). Mientras la ilustración sea más baja que la fila, es el TEXTO quien
// decide dónde cae la fila de cifras, que es lo que mantiene las cinco
// aperturas cuadradas.

/** Las cinco fichas: su giro, su retardo de entrada y su capa. */
const FICHAS = [
  { giro: -17, retardo: "0.06s", capa: "z-[1]" },
  { giro: -8.5, retardo: "0.12s", capa: "z-[2]" },
  { giro: 17, retardo: "0.18s", capa: "z-[1]" },
  { giro: 8.5, retardo: "0.24s", capa: "z-[2]" },
  { giro: 0, retardo: "0.3s", capa: "z-[3]" },
] as const;

/** El pivote común, por debajo del borde inferior: es lo que abre el abanico. */
const PIVOTE = "50% 128%";

const FICHA =
  "border-border h-[186px] w-[140px] rounded-[14px] border p-[14px]";
const LINEA = "h-[5px] rounded-[3px]";

function Barras() {
  return (
    <div className="flex items-end gap-[5px]">
      {[9, 15, 12, 21].map((alto) => (
        <span
          key={alto}
          className="bg-brand-cyan block w-[8px] rounded-[2px]"
          style={{ height: alto }}
        />
      ))}
    </div>
  );
}

function Dorso() {
  return (
    <>
      <div className="mb-[14px] flex justify-end">
        <div className="bg-muted size-[26px] rounded-[8px]" />
      </div>
      <div className="flex flex-col gap-[6px]">
        {["70%", "100%", "88%", "95%", "60%"].map((ancho) => (
          <div
            key={ancho}
            className={cn(LINEA, "bg-muted")}
            style={{ width: ancho }}
          />
        ))}
      </div>
    </>
  );
}

function Frente() {
  return (
    <>
      <div className="mb-[12px] flex items-start justify-between gap-[10px]">
        <div className={cn(LINEA, "bg-muted mt-[10px] w-[64px]")} />
        <div className="bg-brand-cyan-soft size-[26px] rounded-[8px]" />
      </div>
      <div className="mb-[18px] flex flex-col gap-[6px]">
        {["92%", "64%"].map((ancho) => (
          <div
            key={ancho}
            className="bg-foreground h-[7px] rounded-[3px]"
            style={{ width: ancho }}
          />
        ))}
      </div>
      <div className="mb-[16px] flex flex-col gap-[6px]">
        {["100%", "82%", "94%"].map((ancho) => (
          <div
            key={ancho}
            className={cn(LINEA, "bg-foreground")}
            style={{ width: ancho }}
          />
        ))}
      </div>
      <Barras />
    </>
  );
}

function HeroComposition() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-[1_1_26rem] items-center justify-center"
    >
      {/* escritorio */}
      <div className="relative hidden h-60 w-[min(25rem,100%)] md:block">
        {/* La tarjeta pastel de detrás, misma pieza y misma función que las dos
            del Brand Kit: dar cuerpo sin meter color donde va tinta. Gira sobre
            EL MISMO PIVOTE que las fichas, como una sexta del abanico — con un
            giro propio se descolgaba 195px por debajo del dibujo y cruzaba el
            filete de la fila de cifras (medido en el prototipo). */}
        <div
          className="entrada-pliegue absolute bottom-2 left-1/2 z-0 w-[140px]"
          style={{ "--retardo-entrada": "0.04s" } as CSSProperties}
        >
          <div
            className="bg-brand-cyan-soft h-[170px] w-[124px] rounded-[14px]"
            style={{
              transformOrigin: PIVOTE,
              transform: "translateX(-50%) rotate(-25deg)",
            }}
          />
        </div>

        {/* El envoltorio ABSOLUTO lleva la entrada y la ficha de dentro lleva el
            giro. Al revés no funciona: el `transform` de la entrada convierte al
            envoltorio en bloque contenedor y la ficha se recolocaría mientras
            dura la transición.

            LO QUE NO HAY QUE COPIAR DE AQUÍ es que haga falta el envoltorio para
            que giro y entrada convivan. Aquí hace falta por lo de arriba —el
            giro va con un `translateX(-50%)` que la ficha necesita—, pero las
            tres hermanas giran la ficha misma y no llevan envoltorio: usan la
            propiedad individual `rotate`, que compone con el `transform` de la
            entrada sin pisarlo. El porqué, en `globals.css` §Entrada del
            pliegue. */}
        {FICHAS.map(({ giro, retardo, capa }) => (
          <div
            key={giro}
            className={cn(
              "entrada-pliegue absolute bottom-2 left-1/2 w-[140px]",
              capa,
            )}
            style={{ "--retardo-entrada": retardo } as CSSProperties}
          >
            <div
              className={cn(
                FICHA,
                giro === 0
                  ? "border-foreground bg-background"
                  : "bg-transparent",
              )}
              style={{
                transformOrigin: PIVOTE,
                transform: `translateX(-50%) rotate(${giro}deg)`,
              }}
            >
              {giro === 0 ? <Frente /> : <Dorso />}
            </div>
          </div>
        ))}
      </div>

      {/* móvil: una sola ficha, como hace Design System con su marco. Cinco
          giradas a este ancho se pisan y no se lee ninguna. */}
      <div className="relative mx-auto h-[11.5rem] w-[min(16rem,100%)] md:hidden">
        <div className="entrada-pliegue border-foreground bg-background absolute inset-0 rounded-[14px] border p-[14px]">
          <Frente />
        </div>
      </div>
    </div>
  );
}

// La tarjeta comparte forma con la del cierre de página (`ui/page-closer.tsx`) y
// aun así se escribe aquí. No es descuido: aquélla sube ENTERA —sección, rótulo y
// rejilla, con el ritmo corto de un remate— porque lo que no debe divergir es el
// formato del cierre, y ésta es el CONTENIDO de la página, con logo y con un
// titular de verdad dentro. Extraer una primitiva común obligaría a tocar el
// cierre de seis páginas para no ganar nada hoy; si aparece un tercer caso, ese
// será el momento (regla 4 de `BRAND.md` §Cómo se escribe una regla: antes de
// unificar dos valores que se parecen, mirar si significan cosas distintas).
// SALE DE LA VARIANTE `card` (P70.15). Escrita a mano le faltaba el
// `focus-visible:bg-muted`, así que el teclado no recibía lo que recibe el ratón.
// El `border-control-edge` que antes había que pedir aquí —esta tarjeta SE PULSA, y
// WCAG 1.4.11 le pide 3:1 al contorno que la identifica— ya viene dentro: es la
// diferencia entre un filete decorativo y el contorno de un control (D97).
//
// LO QUE SE NEUTRALIZA: `size="card"` dimensiona una FILA (icono + etiqueta) y esto
// es una pila, así que hay que devolver el `align-items` a `stretch` y el `gap` a
// cero. Sin eso, el contenido se encogería al centro y las tres partes se separarían
// 12px — dos cambios visuales que no pide nadie.
const TARJETA = cn(
  actionVariants({ variant: "card", size: "card" }),
  "group flex h-full flex-col items-stretch gap-0 p-[1.4rem]",
);

export function TrayectoriaIndice({
  dict,
  comun,
  claims,
  breadcrumb,
  homeHref,
  cvHref,
  hrefDe,
  lang,
}: {
  dict: TrayectoriaIndiceDict;
  comun: TrayectoriaComunDict;
  /** El h1 de cada deep-dive, leído de su propio diccionario. */
  claims: Record<ExperienceSlug, string>;
  breadcrumb: BreadcrumbDict;
  homeHref: string;
  cvHref: string;
  /** Ruta de una experiencia, ya con el locale resuelto. */
  hrefDe: (slug: string) => string;
  lang: Locale;
}) {
  return (
    <>
      {/* LA APERTURA SALE DE LA PIEZA COMPARTIDA, no de este archivo. Esta
          página es el CUARTO caso de `SystemPageOpening`, que hasta ahora servía
          a Brand Kit, Design System y Accesibilidad: en cuanto la apertura ganó
          composición y fila de cifras dejó de parecerse a las tres y pasó a ser
          la misma cosa, así que la cascada de `CLAUDE.md` §Regla de construcción
          la resuelve en el paso 1 — existe, se usa.

          LO QUE ESO ARREGLA DE PASO. Antes esta página no tenía grupo de pliegue
          siquiera: `npm run pliegue` la contaba entre las que no lo usan, así
          que no había nada que pudiera avisar. Medido a 1920×1080, su `h1` caía
          a 249px contra los 389 de las otras cuatro y la rejilla asomaba a 569,
          o sea que abría enseñando el índice en vez de decir qué es.

          Y LO QUE COSTÓ SABERLO, porque no se ve leyendo el código: dentro de
          `HERO_ROW` la columna de texto mide 611px, no los 800 que esta página
          tenía sueltos. Con el titular largo que llevaba —«Cinco experiencias,
          contadas por dentro»— el `h1` a 80px caía a CUATRO líneas y el grupo se
          iba a 655: el tamaño de sus hermanas y la fila de cifras no cabían a la
          vez. Lo resolvió el copy, no el CSS: «Mi Trayectoria» es un rótulo
          corto como «Brand Kit» o «Design System», entra en una línea y devuelve
          el grupo a 464. Es la razón por la que las tres hermanas caben, y no se
          había visto porque ninguna tiene un titular largo. */}
      <SystemPageOpening
        crumb={comun.crumbIndice}
        breadcrumb={breadcrumb}
        homeHref={homeHref}
        eyebrow={dict.eyebrow}
        title={dict.title}
        lead={dict.lead}
        leadMeasure="max-w-[46ch]"
        stats={
          <>
            <Stat value={String(CASOS)} label={dict.statCasos} />
            <Stat value={String(ANIOS)} label={dict.statAnios} />
            <Stat value={String(EXITS)} label={dict.statExit} />
            <Stat value={String(sectoresDe(lang))} label={dict.statSectores} />
          </>
        }
      >
        <HeroComposition />
      </SystemPageOpening>

      {/* LA REJILLA SALE DE LA APERTURA, que es lo que hace que la apertura sea
          una portada y no una portada con el principio de otra cosa debajo.
          Sección propia con `SECTION` —filete superior y ritmo vertical—, igual
          que la sección que sigue al pliegue en Contacto. */}
      <section className={SECTION}>
        <div className={WRAP}>
          {/* LA INTRO ES UNA LÍNEA, NO UN BLOQUE. La primera versión era una
              cabecera de sección con cuatro columnas rotuladas —contexto,
              decisiones, cifras, aprendizajes— y el problema no era el copy: era
              que un bloque de ese alto empuja la rejilla fuera de la pantalla, y
              lo que la página tiene que enseñar son las cinco tarjetas.

              ASÍ QUE SE USA LA PIEZA QUE YA RESUELVE ESTO: `IndexNote`, la frase
              que orienta al lector bajo el eyebrow de un índice, la misma que
              usan el Brand Kit, el Design System, Accesibilidad y el artículo. Y
              aquí la rejilla de tarjetas HACE de lista del índice, así que la
              pieza entera (`SectionIndex`) no encaja: repetiría en celdas lo que
              está justo debajo en tarjetas.

              SIN FIGURA, y no es un olvido: la única cifra que cabría —cuántos
              casos hay— ya la publica la fila del hero, y el `·` de `IndexNote`
              existe para separar figuras DISTINTAS. El Brand Kit puede poner «6
              secciones» porque sus cifras de hero son otras. */}
          <div className="mb-[clamp(2.5rem,5vw,3.5rem)]">
            <p data-reveal className={cn(eyebrowVariants(), "mb-3")}>
              {dict.intro.eyebrow}
            </p>
            <IndexNote note={dict.intro.note} figures={[]} />
          </div>

          <ul
            data-reveal
            className="m-0 grid list-none gap-[var(--gutter)] p-0 md:grid-cols-2 lg:grid-cols-3"
          >
            {CON_PAGINA.map((exp) => {
              const slug = exp.slug as ExperienceSlug;
              const { role, sector } = factsOf(lang, exp.company);
              return (
                <li key={slug} className="m-0">
                  <a href={hrefDe(slug)} className={TARJETA}>
                    <div className="mb-[1.1rem] flex items-start justify-between gap-3">
                      <p className={dataLabelVariants()}>
                        <Marcas>{exp.company}</Marcas> · {sector}
                      </p>
                      {exp.logo ? <BrandLogoBox name={exp.logo} /> : null}
                    </div>

                    {/* El titular de la tarjeta ES el h1 de su página. Va como h2
                        —y no como un párrafo en negrita— porque es lo que hace
                        navegable la rejilla con un lector de pantalla: cinco
                        encabezados de segundo nivel bajo el h1 de la página, sin
                        saltos (punto 4 del checklist). */}
                    <h2 className={titleVariants({ size: "card" })}>
                      {claims[slug]}
                    </h2>

                    <p className="text-muted-foreground mt-auto flex items-center justify-between gap-3 pt-[1.4rem] text-[0.9rem] [font-variant-numeric:tabular-nums]">
                      <span>
                        {role} · <Periodo lang={lang} company={exp.company} />
                      </span>
                      {/* Mismo gesto y misma excepción de movimiento que la flecha
                          del cierre de página: la clase va escrita entera, no
                          compuesta, porque Tailwind escanea el fuente como texto
                          plano. */}
                      <span className="transition-transform group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-focus-visible:translate-x-0">
                        <ArrowRight
                          aria-hidden="true"
                          className="size-[18px]"
                        />
                      </span>
                    </p>
                  </a>
                </li>
              );
            })}
          </ul>

          {/* El CV cierra el índice como cierra la sección de la portada, y con él
              va la nota que explica por qué aquí hay cinco y no ocho. La nota es
              copy y no una fila apagada a propósito: una tarjeta que no lleva a
              ningún sitio se lee como un enlace roto. */}
          <div
            data-reveal
            className="mt-[clamp(2.5rem,5vw,3.5rem)] flex flex-wrap items-center gap-x-8 gap-y-4"
          >
            <a
              href={cvHref}
              download
              className={cn(
                actionVariants({ variant: "outline-primary" }),
                "flex-none",
              )}
            >
              <Download aria-hidden="true" />
              {dict.cta}
            </a>
            <p className="text-muted-foreground m-0 max-w-[52ch] text-[0.92rem] leading-[1.6]">
              {dict.ctaNota}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
