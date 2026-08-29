"use client";

// @pieza primitiva · design-system/12-articulo.tsx · El riel fijo que sigue la sección activa de una página con paradas.

import { cva } from "class-variance-authority";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

// La isla de cliente de `section-index.tsx` (D7: JS solo donde hace falta estado o
// una API del navegador). El índice y el cierre de bloque son servidor; esto no,
// porque necesita `IntersectionObserver` para saber dónde está el lector.
//
// Se movió aquí desde `article-islands.tsx` con sus dos hermanas de servidor
// (P70.38): el porqué del traslado, entero, en la cabecera de `section-index.tsx`.

// CUÁNDO LLEVA RIEL UNA PÁGINA (P70.415, 2026-08-26). Regla, no gusto:
//
//   El riel va donde la página se LEE. El índice y el cierre de bloque, donde la
//   página se CONSULTA.
//
// Es el mismo eje con el que D121 dejó fuera `ReadingProgress` de las páginas del
// sistema —«mide cuánto texto queda por leer, y en una página de consulta eso no
// significa nada»—, solo que entonces se aplicó a dos de las tres piezas y esta se
// vino por inercia. Estuvo tres commits en Design System, Brand Kit y
// Accesibilidad, y se retiró de las tres al verlas: a una página de referencia se
// llega buscando una sección, se salta una vez desde el índice y se lee. No se
// recorre, así que un indicador permanente de posición no orienta: decora.
//
// Y ADEMÁS SOLO CUADRA EN UNA FRANJA ESTRECHA DE ANCHOS, que es lo que lo hizo
// evidente. A 2560px acaba en x=72 y el texto empieza en 640: 568px de vacío,
// porque va pegado al borde de la VENTANA y no al contenido. Por debajo de 1536
// pasa lo contrario —no tiene canal y se mete encima—, que es lo que se comió los
// clics de los botones de descarga del Brand Kit (P70.40).
//
// Hoy su único consumidor es el artículo, y por eso se publica en su sección del
// Design System, con las otras dos islas fijas. El archivo NO vuelve a la capa de
// artículo: la pieza está escrita genérica —recibe su `ariaLabel` y no sabe nada
// del artículo— y moverla sería ruido.

export type RailItem = { id: string; ordinal: string; label: string };

/**
 * ¿EN QUÉ SECCIÓN ESTÁ EL LECTOR, Y `null` CUANDO NO ESTÁ EN NINGUNA?
 *
 * Las dos islas flotantes del artículo —el riel y el dock de compartir— hacían
 * la misma pregunta con dos observers gemelos, y **las dos sabían encender y
 * ninguna apagar** (P55). Al volver al hero o al índice se quedaban en pantalla,
 * que es justo donde no tienen nada que hacer. Eran dos defectos distintos con
 * el mismo síntoma: el dock hacía `io.disconnect()` en cuanto veía la primera
 * sección —o sea que destruía el mecanismo que podría detectar la salida— y el
 * riel conservaba el observer pero solo asignaba `active`, nunca lo limpiaba.
 *
 * LO QUE FALTABA ES EL CONJUNTO, no una rama más. El callback solo trae los
 * elementos que HAN CAMBIADO, así que desde una entrada suelta no se puede
 * contestar «ninguna»: hay que llevar la cuenta de quién sigue dentro de la
 * banda. Con eso, «fuera del cuerpo» es simplemente que el conjunto está vacío.
 *
 * Y CUÁL DE LAS DE DENTRO ES LA ACTIVA NO CAMBIA: sigue ganando la última
 * entrada del lote, exactamente como antes. Es la mitad que ya funcionaba y que
 * esta tarea no toca; tocarla habría movido el resaltado del riel sin que nadie
 * lo hubiera pedido.
 *
 * El `rootMargin` era el mismo en los dos sitios y ahora se escribe una vez.
 * Vive en `ui/` porque no sabe nada de este sitio: recibe ids y devuelve un id.
 */
export function useActiveSection(items: RailItem[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const targets = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const dentro = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            dentro.add(entry.target.id);
            setActive(entry.target.id);
          } else {
            dentro.delete(entry.target.id);
          }
        }
        if (dentro.size === 0) setActive(null);
      },
      { rootMargin: "-30% 0px -55% 0px" },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return active;
}

/**
 * ¿QUÉ BORDE DEL RIEL ESCONDE PARADAS? (P63, 2026-08-29.)
 *
 * A 1280×618 —el portátil de 15" con escalado de Windows que D50 obliga a
 * mirar— un riel de doce paradas mide 598px de contenido contra 514 de hueco:
 * `618 − 80 (top-[5rem]) − 24 (bottom-6)`, y `12 × 44 + 11 × 6,4` por el otro
 * lado. La aritmética cuadra exacta y **nada estaba roto**: el scroll interno
 * recorta, el teclado llega porque el navegador auto-desplaza el contenedor al
 * enfocar, y `my-auto` centra mientras cabe. Lo que faltaba era la AFORDANCIA:
 * `[scrollbar-width:none]` oculta la barra a propósito, así que quien usa el
 * ratón no tenía ninguna señal de que ahí abajo había más.
 *
 * SE DEVUELVE COMO DESVANECIDO Y NO COMO BARRA. La barra viviría en el borde
 * derecho del `nav`, que mide `w-64` por lo del hover, o sea a 256px del riel y
 * flotando sobre la columna de texto: señalaría en el sitio equivocado. El
 * desvanecido señala donde está el corte.
 *
 * Y SE MIDE POR SEPARADO CADA BORDE, que es lo que impide que la señal mienta.
 * Un desvanecido fijo arriba y abajo teñiría el primer y el último círculo aun
 * cuando no hay nada escondido: sería decoración con forma de aviso. Aquí el de
 * arriba solo existe si `scrollTop > 0` y el de abajo solo si queda contenido,
 * así que cuando el riel cabe entero —Accesibilidad con 8 paradas, Brand Kit con
 * 6— no se pinta ninguno.
 *
 * NO TOCA NINGÚN PAR DE CONTRASTE. La fila de una parada mide 44px y su píldora
 * 24, así que sobran 10px por arriba y 10 por abajo; con el degradado en 14px lo
 * único que llega a atenuarse es una píldora que YA está cortada por el borde,
 * que es exactamente la que hay que anunciar. Una parada entera dentro del hueco
 * se pinta intacta.
 */
function useBordesOcultos(deps: unknown) {
  const ref = useRef<HTMLElement>(null);
  const [bordes, setBordes] = useState({ arriba: false, abajo: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const medir = () => {
      // El margen de 1px absorbe el redondeo subpíxel del zoom del navegador:
      // sin él, un `scrollHeight` de 514,4 contra un `clientHeight` de 514
      // encendería el aviso en una lista que cabe entera.
      const arriba = el.scrollTop > 1;
      const abajo = el.scrollTop + el.clientHeight < el.scrollHeight - 1;
      setBordes((prev) =>
        prev.arriba === arriba && prev.abajo === abajo
          ? prev
          : { arriba, abajo },
      );
    };
    medir();
    el.addEventListener("scroll", medir, { passive: true });
    // El alto del hueco depende del viewport, y el del contenido de cuántas
    // paradas haya: las dos cosas cambian sin que haya scroll de por medio.
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", medir);
      ro.disconnect();
    };
  }, [deps]);

  return { ref, ...bordes };
}

/**
 * Las cuatro máscaras, escritas ENTERAS y no compuestas por interpolación.
 * Tailwind escanea el código como texto plano: una clase construida con una
 * plantilla no se genera, y el elemento se queda sin regla **sin error de
 * compilación** (`BRAND.md` §Cómo medir, punto 5).
 */
const MASCARA = {
  ninguno: "",
  arriba:
    "[mask-image:linear-gradient(to_bottom,transparent_0,black_14px,black_100%)]",
  abajo:
    "[mask-image:linear-gradient(to_bottom,black_0,black_calc(100%-14px),transparent_100%)]",
  ambos:
    "[mask-image:linear-gradient(to_bottom,transparent_0,black_14px,black_calc(100%-14px),transparent_100%)]",
} as const;

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
  const active = useActiveSection(items);
  // La dependencia es un NÚMERO y no `items`, y no es un atajo: el riel no se
  // pinta mientras `active` es `null`, así que la primera vez que el efecto
  // corre el `nav` todavía no existe y no hay nada que medir. Con el número de
  // paradas —0 mientras no hay riel— el efecto vuelve a correr justo cuando el
  // elemento entra en el DOM, y no en cada render, que es lo que haría un array.
  const { ref, arriba, abajo } = useBordesOcultos(
    active === null ? 0 : items.length,
  );

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

        EL RIEL SE PEGA AL BORDE POR DEBAJO DE 1536px, Y NO ES ESTÉTICA (P70.40).
        Entre 1280 —donde se monta— y 1536 la página NO TIENE CANAL para él: el
        contenido arranca en `--page-x` (40px) y una tarjeta añade ~21 de relleno,
        así que lo pulsable empieza en x=61. Con la posición anterior el objetivo
        táctil del riel ocupaba x 25,6–69,6 y se COMÍA los clics: medido con
        `elementFromPoint` sobre los tres «Descargar SVG» del Brand Kit a 1280×618,
        el elemento de arriba era una parada del riel, no el botón. No es solape
        visual, es intercepción — y axe no la ve, porque no evalúa qué elemento
        recibe el punto.

        Con `left-2` el riel ocupa 8–52 y deja 9px de aire hasta el contenido en
        todo el tramo 1280–1535. De 1536 en adelante el contenedor ya centra y
        sobra sitio, así que vuelve el `clamp` de siempre.

        Lo que esto NO arregla: por debajo de 1536 el riel sigue flotando sobre el
        área de contenido en vez de vivir en un canal propio. Hoy no molesta
        porque ese borde suele estar vacío; el día que otra página ponga algo
        pulsable ahí, vuelve. Eso es una decisión de layout, no un ajuste.
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
      ref={ref}
      aria-label={ariaLabel}
      className={cn(
        "pointer-events-none fixed top-[5rem] bottom-6 left-2 z-30 hidden w-64 [scrollbar-width:none] flex-col overflow-y-auto xl:flex 2xl:left-[clamp(0.75rem,2vw,1.75rem)] [&::-webkit-scrollbar]:hidden",
        arriba && abajo
          ? MASCARA.ambos
          : arriba
            ? MASCARA.arriba
            : abajo
              ? MASCARA.abajo
              : MASCARA.ninguno,
      )}
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
