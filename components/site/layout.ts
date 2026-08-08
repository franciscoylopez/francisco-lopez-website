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

/** Prosa a la medida de lectura (~91 caracteres en Inter). */
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
