// @pieza primitiva · design-system/10-composicion.tsx · La banda que abre un bloque de secciones: qué las agrupa y cuáles son.

import { Fragment, type ReactNode } from "react";

import { WRAP } from "@/components/ui/layout";

/**
 * LA BANDA QUE ABRE UN BLOQUE DE SECCIONES (P70.47, 2026-08-27).
 *
 * POR QUÉ EXISTE. Las tres páginas del sistema sumaban **60,3 pantallas sin un
 * solo cambio de fondo a ancho completo**: 0% de su alto en banda, contra el 17%
 * de la home y el 2,7% del artículo. Medido sobre las páginas servidas, no
 * estimado. Un ritmo plano de esa longitud no es minimalismo, es que la página no
 * respira en ningún sitio.
 *
 * Y hay un segundo problema que esta pieza resuelve de paso: las doce secciones
 * del Design System dejaron de estar en orden cronológico en P70.34 y pasaron a
 * una jerarquía —`fundamentos → piezas → composición → excepción`—, pero esa
 * decisión **solo existía en un comentario**. Doce secciones seguidas, todas
 * separadas por el mismo filete, no dicen dónde acaba una familia y empieza otra.
 *
 * LO QUE SE DESCARTÓ, para que no vuelva. Se probaron tres direcciones sobre la
 * página real (`/prototype`, 2026-08-26):
 *
 * · **Teñir bloques enteros** con `bg-muted`. Funciona, y destapó que `--border`
 *   estaba calibrado contra `--background` y solo contra él: sobre la banda el
 *   contorno de una tarjeta caía de 1,29 a **1,10** y la tarjeta perdía el filo.
 *   Era la misma deuda que D39 cerró para el atenuado y D97 para el contorno de un
 *   control, y **la cerró D131 el 2026-08-27** — el filete se recalcula por
 *   superficie como sus dos hermanos, así que esta dirección ya no tiene ese pero.
 *   Sigue descartada por lo de abajo, que es lo que de verdad la descartaba.
 * · **Dar superficie al cierre de sección**, sin fondo nuevo. Es la más barata y
 *   la más fiel a D123, y se quedó a un paso.
 * · **INVERTIR LA SECCIÓN-TESIS de cada página, que es lo que la tarea pedía
 *   literalmente, y es IMPOSIBLE.** Estas secciones son galerías: dentro hay
 *   tarjetas `bg-card`, tablas y especímenes que dan por hecho el fondo de
 *   página. La banda de la home no es contenido invertido, es un manifiesto, o
 *   sea tipo sola. Traducida bien, la dirección es INSERTAR la banda, no teñir lo
 *   que ya hay. Por eso esta pieza es un bloque nuevo y no una variante de
 *   sección.
 *
 * CUÁNTAS CABEN, que es lo que decide si esto escala. Lo que fija la densidad es
 * el número de BLOQUES, no el de secciones: con el reparto actual sale una banda
 * cada 8,9 pantallas en el Design System, 7,4 en el Brand Kit y 6,8 en
 * Accesibilidad. Partir el Brand Kit en tres bloques daría una cada 4,6 y la
 * página pasaría a leerse a golpes. **Si una página nueva pide más de un bloque
 * cada ~6 pantallas, lo que sobra son bloques, no banda.**
 *
 * ESTÁ EN `ui/` Y NO EN `site/` porque no sabe nada de este sitio: recibe un
 * título, una entradilla y una lista de paradas, y no conoce ni copy, ni rutas,
 * ni secciones (frontera de D36).
 */
export function BlockOpener({
  title,
  lead,
  items,
}: {
  title: string;
  lead: string;
  /** Las secciones que caen dentro del bloque, en orden. */
  items: { ordinal: string; label: string }[];
}) {
  return (
    /**
     * `data-surface="inverted"` no es decorativo y no se puede omitir: aquí
     * `--foreground` es el FONDO, así que sin él el atenuado de la entradilla se
     * calcularía contra la superficie equivocada (D39). Mismo motivo por el que
     * lo lleva la apertura del artículo.
     *
     * El `data-reveal` va en los HIJOS y no en la banda, como en el manifiesto de
     * la home: una banda a sangre que empieza en `opacity: 0` es justo lo que
     * retrasa el LCP (P44).
     */
    <section
      data-surface="inverted"
      className="bg-foreground text-background py-[clamp(3.5rem,7vw,6rem)]"
    >
      <div className={WRAP}>
        <h2
          data-reveal
          className="font-display m-0 text-[clamp(1.9rem,4vw,3rem)] leading-[1.1] font-semibold tracking-[-0.022em]"
        >
          {title}
        </h2>
        {/*
         * EL FILETE MORADO, QUE ES DE LA OTRA BANDA (P68.7117, 2026-08-27).
         *
         * La pregunta era si esta banda debía tomar el acento morado, y la
         * respuesta que se descartó fue teñir el ORDINAL de cada parada: mide
         * 12,8px, así que su umbral AAA es 7 y `--brand-purple-accent` da 7,04
         * en claro —pasa por cuatro centésimas, el margen más fino del sitio, en
         * la superficie invertida más repetida que hay—. Además le quitaría
         * contraste (hoy da 10,32 / 9,89) y le daría al morado un segundo
         * significado en páginas donde ya tiene uno: el punto de 6px del índice
         * de sección, que marca «estás en la sección N de N», sale catorce veces
         * en el Design System.
         *
         * El filete no tiene ninguno de esos problemas y sí resuelve lo que la
         * tarea quería: es EL MISMO RECURSO que ya usa la banda-manifiesto de la
         * home, así que las dos bandas invertidas del sitio se leen como la misma
         * familia en vez de como dos piezas que coinciden en el fondo. Va
         * `aria-hidden` y sin información, así que no tiene umbral que cumplir.
         *
         * SU RITMO ES MÁS CORTO QUE EL DEL MANIFIESTO a propósito: aquel abre con
         * un titular de hasta 3,75rem y este con uno de 3, y la banda de bloque es
         * mobiliario de orientación, no una declaración. La geometría es común
         * (`.band-rule`); el margen, de cada bloque.
         */}
        <div
          data-reveal
          aria-hidden="true"
          className="band-rule my-[clamp(1.25rem,2.5vw,1.75rem)]"
        />
        <p
          data-reveal
          className="text-muted-foreground m-0 max-w-[var(--measure)] text-[1.0625rem] leading-[1.6]"
        >
          {lead}
        </p>
        {/*
         * QUÉ LLEVA DENTRO, con los rótulos REALES del índice y no con copy
         * nuevo: es lo que convierte la banda en la apertura de un bloque en vez
         * de en un eslogan, y lo que hace que sirva para orientarse, que es lo
         * que una página de CONSULTA necesita (D123).
         *
         * HUBO UN RÓTULO DE RANGO ENCIMA («Secciones 05 a 08») y salió el
         * 2026-08-27: esta lista ya lleva los ordinales, así que el rango decía
         * dos veces lo mismo con menos información.
         *
         * TEXTO Y NO ENLACES, a propósito: sobre banda invertida `.link-content`
         * no tiene contraparte —lo descubrió P66 y sigue abierto—, así que
         * enlazar aquí pediría antes esa variante. El día que exista, esta lista
         * es su primer call site.
         */}
        <ul
          data-reveal
          className="m-0 mt-[clamp(1.75rem,3vw,2.5rem)] flex list-none flex-wrap gap-x-6 gap-y-2 p-0"
        >
          {items.map((item) => (
            <li key={item.ordinal} className="flex items-baseline gap-2">
              {/*
               * EL ATENUADO DEL ORDINAL LO PONE LA SUPERFICIE, NO UN `opacity`
               * (design-review de la tanda 8, 2026-08-27).
               *
               * Nació como `opacity-70` y era el ÚNICO texto del repositorio
               * atenuado así —los otros siete `opacity-*` son barras de
               * esqueleto, o sea ilustración—. Dos motivos para que saliera, y
               * el segundo es el que importa:
               *
               * · `BRAND.md` §El atenuado lo pone la superficie: «no se elige
               *   el color del texto atenuado». La entradilla de esta misma
               *   banda, doce líneas más arriba, ya lo hacía bien. Dos
               *   mecanismos para el mismo trabajo en un componente de 40
               *   líneas es la señal de drift, no un detalle.
               *
               * · EL CENSO NO SABE VER UN `opacity`. Lee `getComputedStyle().color`
               *   y solo descarta `opacity: 0`, así que puntuaba este ordinal
               *   con **15,32** —el anclaje, la mejor cifra del sitio— cuando
               *   la pantalla pintaba **5,97 en oscuro** y **7,52 en claro**.
               *   A 12,8px el umbral AAA es 7, así que el sitio publicaba
               *   «cero pares bajo AAA» con uno debajo. No es que el metro se
               *   quedara corto: señalaba como mejor par de la página el peor.
               *   (`BRAND.md` §Cómo medir, punto 8, por cuarta vez.)
               *
               * Con `text-muted-foreground` el ordinal sube a 9,89 / 10,32 —lo
               * mismo que la entradilla— y sigue muy por debajo de la etiqueta
               * de al lado, que va a `--background` pleno: la jerarquía que
               * buscaba el `opacity` se mantiene, medida en vez de pintada a
               * ojo. NO se añadió un segundo escalón de `--surface-dim` para
               * conservar el tono exacto de antes: sería un token con un solo
               * call site, que es indirección y no fuente única.
               */}
              <span className="text-muted-foreground font-mono text-[0.8rem] tabular-nums">
                {item.ordinal}
              </span>
              <span className="text-[0.95rem]">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ─────────────────── El reparto: bandas + secciones ─────────────────── */

/**
 * LAS SECCIONES DE UNA PÁGINA, REPARTIDAS EN SUS BLOQUES (P50.88).
 *
 * El cableado de la banda —abrir el bloque y detrás sus secciones— entró en el
 * Design System y en el Brand Kit por duplicado el mismo día (D125), y `qlty` lo
 * mide: **15 líneas idénticas en dos sitios** (mass 101). Es el mismo argumento
 * que subió el recorrido a la capa en `section-index.tsx`: la misma decisión
 * escrita en dos sitios acaba diciendo dos cosas.
 *
 * Aquí van las CLAVES y nada más. El título y la entradilla de cada bloque son
 * copy y llegan por `copy`; los ordinales de la banda salen de `paradas`, así que
 * reordenar la página no puede dejar una banda anunciando secciones que ya no
 * están debajo.
 *
 * Sigue sin saber nada de este sitio (frontera de D36): recibe listas, copy ya
 * resuelto y nodos ya montados.
 */
export function SectionBlocks<K extends string, B extends string>({
  bloques,
  copy,
  paradas,
  secciones,
}: {
  bloques: readonly { id: B; claves: readonly K[] }[];
  copy: Record<B, { title: string; lead: string }>;
  paradas: readonly { clave: K; ordinal: string; label: string }[];
  secciones: Record<K, ReactNode>;
}) {
  return (
    <>
      {bloques.map((bloque) => (
        <Fragment key={bloque.id}>
          <BlockOpener
            title={copy[bloque.id].title}
            lead={copy[bloque.id].lead}
            items={paradas.filter((p) =>
              (bloque.claves as readonly string[]).includes(p.clave),
            )}
          />
          {bloque.claves.map((clave) => (
            <Fragment key={clave}>{secciones[clave]}</Fragment>
          ))}
        </Fragment>
      ))}
    </>
  );
}
