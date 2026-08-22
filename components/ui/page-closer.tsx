// @pieza primitiva · pendiente · El cierre común de las trece páginas: a dónde se va desde aquí.

import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { Badge } from "./badge";
import { CARD, WRAP } from "./layout";
import { eyebrowVariants } from "./heading";

// CIERRE DE PÁGINA: el rótulo suelto y la rejilla de tarjetas-enlace que remata
// el `<main>` antes del footer. Lo estrenaron las tres páginas del sistema
// (Brand Kit · Design System · Accesibilidad) dentro de `site/related-pages.tsx`,
// y sube aquí al aparecer el SEGUNDO caso: el paso a la experiencia anterior y
// posterior del deep-dive (P48).
//
// Sube entero —sección, rótulo y rejilla— y no solo la tarjeta, porque lo que
// tiene que no divergir es el FORMATO del cierre: el ritmo vertical propio (más
// corto que `SECTION`, porque es un remate y no una sección de contenido), el
// filete de arriba y el hueco del rótulo. Si solo subiera la tarjeta, el segundo
// caso volvería a decidir esas tres cosas por su cuenta y en dos meses serían dos
// cierres distintos — que es exactamente cómo empezó el drift de las cabeceras
// (D43).
//
// QUÉ NO SABE: nada de este sitio. Recibe rótulo y una lista de destinos, así que
// vive en `ui/` (frontera de D36). Quién es hermana de quién lo deciden sus dos
// llamadores, que sí lo saben.
//
// EL FOCO NO SE DECLARA AQUÍ: lo pone la regla global `:focus-visible` de
// `globals.css`. La versión anterior se lo sustituía por su propio `ring` con el
// color del offset sin declarar, y en tema oscuro salía un halo claro entre la
// tarjeta y el anillo.
const LINK_CARD = cn(
  CARD,
  "group hover:bg-muted block px-[1.4rem] py-[1.2rem] transition-colors",
);

/** Un destino del cierre. Sin `href` se dibuja apagado, con su etiqueta. */
export type CloserItem = {
  key: string;
  name: string;
  desc: string;
  /**
   * Rótulo pequeño ENCIMA del nombre, para cuando las tarjetas no son
   * equivalentes entre sí y hay que decir cuál es cuál («Experiencia anterior» /
   * «siguiente»). Las hermanas del sistema no lo llevan —ahí las tres tarjetas
   * significan lo mismo— y sin él no añade ningún nodo al DOM, que es lo que
   * permitió que el refactor saliera con diff vacío.
   */
  kicker?: string;
  /** Ausente = todavía no existe: tarjeta punteada, no enlace. */
  href?: string;
  /** Qué dice la etiqueta de la tarjeta apagada («Próximamente»). */
  badge?: string;
  /**
   * Hacia dónde va este destino. `forward` (por defecto) es «ir ahí»: flecha a la
   * derecha, en el borde derecho de la fila. `back` es «volver atrás»: flecha a la
   * IZQUIERDA y delante del nombre.
   *
   * No es solo girar el glifo. Una flecha que apunta a la izquierda pegada al
   * borde derecho no dice nada; lo que se lee como «anterior» es el conjunto de
   * las dos cosas —dirección y posición—, que es el patrón de paginación de
   * siempre. Con las dos tarjetas juntas queda `[← anterior]` y `[siguiente →]`,
   * y no hace falta leer el rótulo para saber cuál es cuál.
   */
  direction?: "forward" | "back";
};

/**
 * El rótulo de una tarjeta. Reusa `eyebrowVariants` —la misma capa que el rótulo
 * de la sección— bajado un punto de tamaño: dentro de la tarjeta compite con el
 * nombre, que es lo que hay que leer primero.
 */
function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className={cn(eyebrowVariants(), "mb-[0.45rem] text-[0.7rem]")}>
      {children}
    </p>
  );
}

/**
 * La flecha de la tarjeta, con su empujón al pasar por encima.
 *
 * EL EMPUJÓN VA HACIA DONDE APUNTA. Es el mismo gesto que la variante `solid` da
 * a su icono, con su mismo escape de `motion-reduce` —era el único transform
 * animado del sitio que no lo llevaba (P37.68): el gesto estaba copiado, la
 * excepción de movimiento no—. Y las clases van ESCRITAS ENTERAS en las dos
 * ramas, no compuestas con una plantilla: Tailwind escanea el código como texto
 * plano, así que una clase construida por interpolación no se genera y el
 * elemento se queda sin gesto **sin dar error de compilación** (punto 5 del
 * método de `BRAND.md`).
 */
function Flecha({ back = false }: { back?: boolean }) {
  const Icon = back ? ArrowLeft : ArrowRight;
  return (
    <span
      className={
        back
          ? "text-muted-foreground transition-transform group-hover:-translate-x-0.5 group-focus-visible:-translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-focus-visible:translate-x-0"
          : "text-muted-foreground transition-transform group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-focus-visible:translate-x-0"
      }
    >
      <Icon className="size-[18px]" />
    </span>
  );
}

export function PageCloser({
  eyebrow,
  items,
  labelId = "related-pages-label",
}: {
  eyebrow: string;
  items: CloserItem[];
  /** Solo se cambia si en la misma página hubiera dos cierres. */
  labelId?: string;
}) {
  return (
    <section className="border-border border-t">
      <nav
        data-reveal
        aria-labelledby={labelId}
        // Ritmo vertical propio, más corto que `SECTION`: es un cierre de página,
        // no una sección de contenido.
        className={cn(WRAP, "py-[clamp(3.5rem,7vw,6rem)]")}
      >
        <p
          id={labelId}
          // Rótulo suelto: no abre una cabecera, así que no usa `SectionHeader` ni
          // su hueco —el margen es hasta la rejilla de tarjetas, no hasta un título.
          className={cn(eyebrowVariants(), "mb-[clamp(1.25rem,3vw,2rem)]")}
        >
          {eyebrow}
        </p>
        {/* UNA SOLA TARJETA NO SE ESTIRA. Con `auto-fit` y un único ítem, el
            `1fr` le da los 1.280px enteros del contenedor y sale una caja
            punteada casi vacía con el texto pegado a la izquierda. No es un
            estado transitorio: la experiencia MÁS RECIENTE nunca tiene
            «siguiente», así que Emendu se queda con una tarjeta para siempre.
            El tope solo actúa cuando hay una —con dos, la rejilla reparte como
            siempre, que es lo que mantiene idéntico el cierre de las tres
            páginas del sistema—. */}
        <div
          className={cn(
            "grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,20rem),1fr))] gap-[var(--gutter)]",
            items.length === 1 && "max-w-[34rem]",
          )}
        >
          {items.map((item) => {
            if (!item.href) {
              return (
                <div
                  key={item.key}
                  className="border-border rounded-lg border border-dashed px-[1.4rem] py-[1.2rem]"
                >
                  {item.kicker ? <Kicker>{item.kicker}</Kicker> : null}
                  <span className="text-muted-foreground flex items-center gap-2 text-[1rem] font-semibold">
                    {item.name}
                    {item.badge ? (
                      <Badge kind="label">{item.badge}</Badge>
                    ) : null}
                  </span>
                  <p className="text-muted-foreground m-0 mt-[0.55rem] text-[0.9rem] leading-[1.55]">
                    {item.desc}
                  </p>
                </div>
              );
            }

            const back = item.direction === "back";

            return (
              <a key={item.key} href={item.href} className={LINK_CARD}>
                {item.kicker ? <Kicker>{item.kicker}</Kicker> : null}
                {/* Las dos ramas van con la cadena ENTERA y no compuestas con
                    `cn()`. No es estilo: `cn` concatena en tiempo de ejecución y
                    deja el modificador al final, así que la clase resultante
                    cambia de ORDEN aunque pinte igual — y eso es un HTML
                    distinto en las tres páginas del sistema, que `gate:html`
                    marcó al instante. Escritas enteras, Prettier las ordena en
                    el fuente y el cierre publicado no se mueve un byte. */}
                <span
                  className={
                    back
                      ? "text-foreground flex items-center justify-start gap-2 text-[1rem] font-semibold"
                      : "text-foreground flex items-center justify-between gap-2 text-[1rem] font-semibold"
                  }
                >
                  {back ? <Flecha back /> : null}
                  {item.name}
                  {back ? null : <Flecha />}
                </span>
                <p className="text-muted-foreground m-0 mt-[0.55rem] text-[0.9rem] leading-[1.55]">
                  {item.desc}
                </p>
              </a>
            );
          })}
        </div>
      </nav>
    </section>
  );
}
