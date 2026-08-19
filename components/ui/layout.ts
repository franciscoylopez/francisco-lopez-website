// Primitivas de layout del sistema (P37.594). Fuente única de las cajas y los
// ritmos que comparten todas las páginas, para que cambiar el gutter o el radio de
// una tarjeta sea UNA edición y no cinco.
//
// Antes de este archivo, `WRAP` estaba escrito idéntico cinco veces (cookies,
// accesibilidad, brand-kit, design-system, sobre-mi), `SECTION` tres y `CARD` tres
// —y esas tres no coincidían—. La divergencia de `CARD` resultó no ser drift sino
// un problema de nombre: hay DOS cajas en el sistema y una de ellas no lo sabía.
// Ver `CARD` y `PANEL` abajo.
//
// Es un `.ts` sin JSX a propósito: son cadenas de clases, no componentes. Cada
// caller las compone con `cn()` y añade su propio espaciado.

/** Contenedor de página: centra al ancho del grid y aplica el gutter lateral. */
export const WRAP = "mx-auto max-w-[var(--container)] px-[var(--page-x)]";

/** Sección de página: filete superior + ritmo vertical del sistema. */
export const SECTION = "border-border border-t py-[var(--section-y)]";

/**
 * Fila de la apertura: columna de texto a la izquierda, ilustración a la derecha.
 * La usan las tres páginas que documentan el sistema (Brand Kit, Design System y
 * Accesibilidad), donde estaba escrita TRES veces con las mismas clases.
 *
 * EL `min-h` ES LA PARTE QUE NO SE PUEDE ESCRIBIR EN CADA PÁGINA, y es lo que
 * hace que la fila de datos caiga a la misma altura en las tres. Sin él, el alto
 * de la fila lo decide el contenido más alto de cada página —la columna de texto
 * mide 272, 297 y 266 según lo que ocupe la entradilla— y los datos aparecían a
 * 653, 679 y 648. Se ve al comparar las tres seguidas, que es como lo detectó
 * Francisco. 19rem (304px) deja aire sobre la más alta de las tres sin recortar
 * ninguna.
 *
 * Va con `md:` como el resto del andamiaje de pliegue: en móvil la fila apila y
 * un alto mínimo solo metería un agujero.
 *
 * OJO al orden de causas si esto se vuelve a descuadrar: mientras la ILUSTRACIÓN
 * sea más alta que la columna de texto, es ella la que manda y este `min-h` no
 * arregla nada. Las tres composiciones se compactaron a 207, 272 y 240 justo para
 * que no pase.
 */
export const HERO_ROW =
  "flex flex-wrap items-center justify-between gap-[clamp(2rem,5vw,4rem)] md:min-h-[19rem]";

/**
 * Prosa a la medida de lectura (~91 caracteres en Inter).
 *
 * NO ES LA ANCHURA POR DEFECTO DE TODO TEXTO, y conviene saberlo antes de
 * alcanzarla por reflejo. El ancho de un bloque de texto en este sitio lo decide
 * QUÉ ES el bloque, y son tres casos —cerrado el 2026-08-18 midiendo el deep-dive
 * y Sobre mí, que es donde ya convivían los tres—:
 *
 * · **Bullets → media columna.** «En un minuto» del deep-dive y «Dónde estoy
 *   ahora» de Sobre mí: ~650-670px, o sea ~80 caracteres. Una lista se escanea, y
 *   a ancho completo el ojo pierde el salto de un bullet al siguiente.
 * · **Prosa sola → ancho de contenedor**, o sea 1.280px y ~157 caracteres por
 *   línea. Es MUY por encima de la medida clásica (60-75) y de este `PROSE`
 *   (~91), y es deliberado: a media página, mil doscientas palabras seguidas se
 *   leen como media página VACÍA y alargan el scroll el doble. Se decidió viendo
 *   las dos versiones servidas y se reconfirmó midiendo.
 * · **Prosa con una imagen al lado → lo que le deje la imagen.** Las dos de «Más
 *   allá del trabajo» caen en 608px y eso NO es una excepción a la regla
 *   anterior: ahí la otra mitad no está vacía.
 *
 * Así que `PROSE` es para el texto que de verdad quiere la medida clásica —una
 * entradilla, una nota, un párrafo suelto dentro de una caja—, no para el cuerpo
 * de una página larga.
 */
export const PROSE = "max-w-[var(--measure)]";

/**
 * Tarjeta pequeña — el bloque de contenido que vive DENTRO de una sección: una
 * medida de accesibilidad, un breakpoint, una nota. Radio `lg` (10px).
 */
export const CARD = "border-border bg-card rounded-lg border";

/**
 * Panel grande — el contenedor de showcase que ENMARCA una demostración y suele
 * llevar subdivisiones internas con sus propios filetes: las variantes del logo,
 * las muestras de tokens, la maqueta del esqueleto. Radio `xl` (14px) y
 * `overflow-hidden`, porque su contenido llega hasta el borde.
 *
 * El radio mayor no es decorativo: es la jerarquía de anidamiento. Un panel
 * contiene tarjetas, así que su esquina tiene que ser más abierta que la de lo que
 * hay dentro. `brand-kit` ya usaba esta caja pero llamándola `CARD`, y por eso
 * parecía que el sistema tenía un `CARD` con dos radios distintos.
 */
export const PANEL = "border-border bg-card overflow-hidden rounded-xl border";

/**
 * Fila de DOS tarjetas. Columnas explícitas, no `auto-fit`: un par es una pareja
 * —split/plano, mono negro/mono blanco, las dos notas de una sección— y no debe
 * romperse porque en la caja quepan tres. Es también la unidad de reveal, para que
 * las dos entren juntas.
 *
 * Existe porque dos tarjetas apiladas a `max-w-[var(--measure)]` dentro de una
 * sección a ancho completo dejan media pantalla vacía a la derecha y hacen crecer
 * la página en vertical sin motivo (P37.62), y porque repartir seis tarjetas en
 * 4 + 2 estrecha tanto la primera fila que sus chips saltan de línea (P37.61).
 */
export const PAIR =
  "grid grid-cols-1 items-stretch gap-[var(--gutter)] md:grid-cols-2";

/**
 * Grupo de acciones de un diálogo: apiladas y a ancho completo, con la principal
 * abajo. NO es una fila que se parte cuando no cabe.
 *
 * Por qué apiladas y no en fila (P37.5986): el diálogo mide 512px como máximo, que
 * dejan 462px de contenido, y sus tres acciones necesitan 496px — se salen por 34px
 * y la tercera caía sola a una segunda línea, alineada a la derecha, leyéndose como
 * un desajuste. La causa fue P37.592: al migrar a `actionVariants` los botones
 * pasaron de `px-4` a `px-[1.35rem]`, o sea 33,6px más de fila. Se migró el botón y
 * nadie volvió a mirar el contenedor que lo agrupa.
 *
 * Se apilan en vez de encogerlos a `size="sm"` porque la fila solo cabría por poco
 * y **solo en algunos idiomas** —los labels en EN son más cortos que en ES—, así que
 * volvería a romperse con el siguiente cambio de copy sin que nadie se entere. El
 * apilado no depende del largo del texto: es estable en cualquier idioma y es además
 * el layout que el diálogo ya usaba en móvil.
 */
export const DIALOG_ACTIONS = "mt-6 flex flex-col gap-2 [&>*]:w-full";

/**
 * Grupo de acciones de una tarjeta que solo es estrecha EN MÓVIL: apiladas y a
 * ancho completo por debajo de `sm`, en fila a partir de ahí. Hoy, el banner de
 * consentimiento.
 *
 * Son dos exports y no uno porque son dos necesidades distintas, no dos nombres
 * para lo mismo (la lección `CARD`/`PANEL`): el **diálogo** mide 512px SIEMPRE y
 * sus tres acciones piden 496 —no caben ni en escritorio—, así que se apila
 * incondicionalmente. El **banner** llega a 640px, donde la fila cabe de sobra y
 * apilarla a ancho completo la haría pesada; el problema aparece solo a 320px,
 * con la tarjeta en 280 y 240 de contenido.
 *
 * Por qué existe (P37.68, primer disparo del punto «contenedores de controles»):
 * el banner llevaba `flex flex-wrap gap-2` y a 320px sus tres botones caían en
 * **tres líneas de 133 / 148 / 136px**, alineados a la izquierda y desiguales —
 * exactamente la forma que P37.5986 rechazó para el diálogo y arregló con
 * `DIALOG_ACTIONS`. Se arregló el diálogo y **nadie volvió a mirar el banner**,
 * que está en el mismo archivo ochenta líneas más arriba.
 */
export const BANNER_ACTIONS =
  "flex flex-col gap-2 [&>*]:w-full sm:flex-row sm:[&>*]:w-auto";
