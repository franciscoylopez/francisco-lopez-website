"use client";

// @pieza primitiva · design-system/10-composicion.tsx · El riel fijo que sigue la sección activa de una página con paradas.

import { cva } from "class-variance-authority";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

// La isla de cliente de `section-index.tsx` (D7: JS solo donde hace falta estado o
// una API del navegador). El índice y el cierre de bloque son servidor; esto no,
// porque necesita `IntersectionObserver` para saber dónde está el lector.
//
// Se movió aquí desde `article-islands.tsx` con sus dos hermanas de servidor
// (P70.38): el porqué del traslado, entero, en la cabecera de `section-index.tsx`.

export type RailItem = { id: string; ordinal: string; label: string };

/**
 * LA PÍLDORA DEL RIEL, que era la cuarta excepción viva de `BRAND.md` §Ningún
 * control se escribe a mano — «no compone `chromeLinkVariants`; sale a
 * `chrome.tsx`».
 *
 * SALE, PERO NO A `chrome.tsx`, y conviene decir por qué en vez de dejarlo raro.
 * `chromeLinkVariants` gobierna el ANCLA, y aquí el ancla no tiene aspecto: es un
 * cuadrado de 44×44 transparente, el objetivo táctil, y nada más. Todo lo que se
 * ve —el círculo, su expansión, el estado activo— vive en un `<span>` interior que
 * ninguna `shape` de chrome puede describir, porque las tres shapes de chrome son
 * el CONTENEDOR del enlace, no una pieza dentro de él.
 *
 * Lo que la excepción pedía de verdad era que esto dejara de ser una cadena inline
 * de veinte clases con un ternario dentro. Eso es lo que cambia: la píldora es una
 * variante, con su eje de estado, y vive con la pieza que la usa. Que no acabara en
 * el archivo que la nota de 2026-08-22 predijo es un detalle de destino, no de
 * cumplimiento — y `BRAND.md` queda actualizado en consecuencia.
 *
 * `border-control-edge`, NO `border-border` (P68.585). El filete decorativo y el
 * contorno de un control se parecen y no son lo mismo: al segundo WCAG 1.4.11 le
 * pide 3:1, porque es lo que permite reconocerlo COMO control, y aquí la píldora es
 * lo único que dice que ahí se pulsa. Con `--border` medía 1,21:1 en claro y 1,36
 * en oscuro.
 *
 * `motion-reduce:transition-none` (P70.39, medido por `viewport-verifier`): el
 * archivo no tenía NINGUNA regla de movimiento reducido, y `globals.css` no trae
 * un reseteo global —cada animación opta por su cuenta—, así que la píldora
 * animaba con `prefers-reduced-motion` activo. Y no es un hover cualquiera: el
 * estado `active` lo cambia el `IntersectionObserver` AL HACER SCROLL, o sea que
 * la pastilla se expandía y se contraía sola, sin gesto del usuario. Es el punto
 * 7 del checklist, y lo publica la página hermana de esta.
 * * `shrink-0` (regresión cazada por Francisco viendo la página): el `<a>` exterior
 * también es `flex`, así que este pill —flex item suyo— heredaba `flex-shrink: 1` y
 * se encogía a los 44px del padre en vez de desbordar hasta `max-w-64`, aunque el
 * padre tenga `overflow: visible`. El shrink ocurre en el cálculo del layout flex;
 * no lo evita `overflow-visible`.
 */
export const railPillVariants = cva(
  "border-control-edge flex h-6 max-w-6 shrink-0 items-center gap-2 overflow-hidden rounded-full border pl-[3px] font-mono text-[0.68rem] whitespace-nowrap transition-[max-width,background-color,color,border-color] duration-200 ease-out motion-reduce:transition-none group-hover:max-w-64 group-focus-visible:max-w-64",
  {
    variants: {
      state: {
        /** La sección en la que está el lector. Blanco/negro: el morado no
         *  convenció en pantalla (feedback de diseño de P60). */
        active: "bg-foreground text-background border-foreground",
        idle: "bg-card text-muted-foreground group-hover:bg-card group-hover:text-foreground",
      },
    },
    defaultVariants: { state: "idle" },
  },
);

/** El riel fijo de escritorio (≥1280px), con la sección activa resaltada por
 * `IntersectionObserver`. Es una MEJORA, no un requisito: el índice pintado
 * en servidor ya cubre la navegación sin JS, así que si el observer no puede
 * montarse, el riel simplemente no resalta nada — no rompe.
 *
 * Solo se monta a partir de la primera parada (P60 tanda 2, punto 3): antes de
 * eso —la apertura y la propia sección del índice— ya hay un elemento con su
 * misma función, y el riel encima era un segundo índice compitiendo con el
 * primero. Como `active` arranca en `null` hasta que el observer confirma la
 * primera sección visible, basta con no pintar nada mientras sea `null`. */
export function SectionRail({
  items,
  ariaLabel,
}: {
  items: RailItem[];
  /**
   * EL NOMBRE ACCESIBLE, QUE ANTES ESTABA HARDCODEADO EN ESPAÑOL (P70.39).
   *
   * Dos defectos de una vez, los dos vistos en la página SERVIDA y ninguno
   * detectable leyendo el JSX:
   *
   * 1. `/en/como-se-ha-creado` y `/en/design-system` anunciaban «Índice de
   *    secciones» a un lector de pantalla en inglés. Es la regla más dura del
   *    proyecto —cero strings hardcodeados— incumplida dentro de una pieza.
   * 2. Con un nombre FIJO, dos rieles de la misma página comparten nombre
   *    accesible: el del Design System y el de su propio espécimen de §12 se
   *    montan a la vez en cuanto la caja de demo entra en la banda del observer,
   *    y ahí `landmark-unique` deja de cumplirse. `SectionCloser` ya resolvía esto
   *    metiendo la posición en su etiqueta; al riel le faltaba.
   *
   * Obligatorio, no opcional con valor por defecto: un defecto que reaparece en
   * silencio no se cierra con un default.
   */
  ariaLabel: string;
}) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const targets = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-30% 0px -55% 0px" },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  if (active === null) return null;

  /* EL RIEL SE CENTRA EN EL HUECO QUE LE QUEDA, NO EN EL VIEWPORT (P68.57).
        Antes era `top-1/2 -translate-y-1/2`, o sea centrado sobre la ventana
        entera, cabecera pegajosa incluida. Con once capítulos medía 548px y no
        molestaba; con doce mide 598 y la primera pastilla se mete DEBAJO del
        nav por debajo de 728px de `innerHeight` — que es justo lo que da un
        portátil de 15" a 1920/125% una vez Chrome se queda con su cromo (~720).
        Medido: a 700 solapa 14px, a 660 son 34, a 620 son 54, y por debajo de
        598 además se sale por los dos extremos. No era «se rompe a 1920»: era
        el eje de ALTO, el que D50 obliga a mirar mientras se dibuja.

        `top-[5rem]` es la MISMA distancia con la que las secciones con ancla
        libran el nav (`scroll-mt-[5rem]`); si algún día el nav cambia de alto,
        se mueven todos juntos.

        Y el `ol` lleva `my-auto` en vez de que el `nav` centre con
        `items-center`: cuando el contenido desborda un contenedor centrado por
        alineación, el navegador recorta por ARRIBA y esa parte se vuelve
        inalcanzable. Con margen automático se centra igual mientras cabe y
        empieza a desplazarse cuando no.

        El scroll vive en el `nav`, no en el `ol`, y por eso el `nav` mide
        `w-64`: `overflow-y` distinto de `visible` obliga a `overflow-x` a
        recortar también, y la pastilla se ensancha hasta `max-w-64` en hover.
        Con el scroll en el `ol` —de 44px de ancho— la etiqueta se cortaría al
        aparecer. A cambio, esa caja de 256px se queda `pointer-events-none` y
        solo la lista los recupera: si no, el riel invisible interceptaría los
        clics de una columna entera de texto. */
  return (
    <nav
      aria-label={ariaLabel}
      className="pointer-events-none fixed top-[5rem] bottom-6 left-[clamp(0.75rem,2vw,1.75rem)] z-30 hidden w-64 [scrollbar-width:none] flex-col overflow-y-auto xl:flex [&::-webkit-scrollbar]:hidden"
    >
      {/* `mx-0 my-auto`, no `m-0 my-auto`: la abreviada y la de eje compiten por
          la misma propiedad y quién gana lo decide el orden de la hoja, no el
          de las clases. */}
      <ol className="pointer-events-auto mx-0 my-auto flex w-11 list-none flex-col gap-[0.4rem] p-0">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id}>
              {/* La etiqueta ya NO es un tooltip flotante aparte: el propio
                  círculo se ensancha en hover/foco y la revela dentro de la
                  misma pastilla — «integrado con el índice», feedback de
                  diseño de P60. `overflow-hidden` + `max-width` en vez de
                  `width` porque el texto no puede reflowar durante la
                  transición. `max-w-64` cabe la etiqueta más larga sin
                  cortarla — con `max-w-40` el hover truncaba a media palabra
                  (P60 tanda 2, punto 4).
                  El `<a>` es el objetivo táctil de 44×44 (design-review P60:
                  la píldora visible de 24px medía por debajo del suelo del
                  checklist); el aspecto entero vive en el `<span>` interior,
                  así que no crece en pantalla.
                  `justify-start`, NO `-center` (aviso de Francisco: el hover
                  se desplazaba a la izquierda y tapaba el texto): el pill
                  crece desde su borde izquierdo — centrado, la mitad del
                  crecimiento empujaba hacia fuera del borde del riel. */}
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className="group flex size-11 shrink-0 items-center justify-start"
              >
                <span
                  className={cn(
                    railPillVariants({ state: isActive ? "active" : "idle" }),
                  )}
                >
                  <span className="flex size-[18px] shrink-0 items-center justify-center">
                    {item.ordinal}
                  </span>
                  <span className="pr-3 text-[0.78rem]">{item.label}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
