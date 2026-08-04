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
export const CARD = "border-border bg-card rounded-[var(--radius-lg)] border";

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
export const PANEL =
  "border-border bg-card overflow-hidden rounded-[var(--radius-xl)] border";
