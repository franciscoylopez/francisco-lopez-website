import { type Dictionary } from "@/app/[lang]/dictionaries";
import { SectionHeader } from "@/components/ui/heading";
import { SECTION, WRAP } from "@/components/ui/layout";
import { Rich } from "@/components/ui/rich";
import { cn } from "@/lib/utils";

import { INTRO, type SeccionMarco } from "./shared";

type T = Dictionary["accesibilidad"];

/* ===================== (07) EL TÉRMINO ===================== */
// EL HUECO QUE TAPA (P70.105): «a11y» aparecía UNA vez en toda la página
// —el rótulo `Lighthouse a11y` de la fila de datos del hero—, sin glosa,
// en la primera pantalla, y en una página cuyo público incluye a RRHH.
// Jerga de gremio usada como vocabulario común, justo en la página cuya
// sección 02 abre diciendo «en lenguaje llano». El rótulo del hero se
// arregló por su lado (dos cadenas), así que esta sección es CONTEXTO y
// no reparación.
//
// Y EL SEGUNDO HUECO, DE LA MISMA FAMILIA: la página citaba axe-core,
// Lighthouse, NVDA y WCAG sin enlazar ninguno. Quien no supiera qué es
// NVDA se quedaba igual.
//
// PERO ESOS CUATRO ENLACES NO VIVEN AQUÍ, y esa fue la corrección de
// Francisco a la primera versión: amontonarlos en el último bloque los
// pone donde ya no hacen falta. Cada uno cae en su PRIMERA aparición en
// texto corrido, no en una tarjeta —WCAG en la nota de (01), axe-core y
// Lighthouse en la entradilla de (04), NVDA en la nota de (05)—, y aquí
// se queda solo el de The A11Y Project, que es el sujeto de la sección.
// Todos inline en la prosa, y por eso sin icono: la regla del icono de
// `BRAND.md` deja fuera el enlace de contenido, cuya afordancia es el
// subrayado.
//
// NO ES UNA SÉPTIMA REJILLA DE TARJETAS a propósito. Las seis secciones
// anteriores ya son rejillas de `InfoCard`, y una más antes del cierre
// las convertiría en textura. Prosa + ilustración cambia el ritmo justo
// donde hace falta.
export function Term({ t, marco }: { t: T["term"]; marco: SeccionMarco }) {
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
              {t.what}
            </p>
            <p className="text-muted-foreground m-0 text-[0.95rem] leading-[1.7]">
              <Rich text={t.project} />
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
            <LoveA11yMark label={t.figura.alt} />
          </div>
        </div>
        {marco.closer}
      </div>
    </section>
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
