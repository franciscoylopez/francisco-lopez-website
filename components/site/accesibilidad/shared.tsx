import type { ReactNode } from "react";

import { LEADING } from "@/components/ui/heading";
import { cardinal } from "@/lib/design-values";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export type { SeccionMarco } from "@/components/ui/section-index";

// Lo único de esta página que se usa en MÁS DE UNA sección. Todo lo demás vive
// en el archivo de la suya, igual que en Design System y Brand Kit.
//
// Y AQUÍ NO HAY `SectionHead`: las ocho secciones abren con `SectionHeader` de la
// capa desde P37.695. Lo que sube son tres cosas que de verdad cruzan — dos
// medidas de párrafo, el marco de las dos figuras y el sustituidor de recuentos.

/**
 * LA ENTRADILLA Y LA NOTA DE UNA SECCIÓN. Son la misma medida con el margen al
 * otro lado: la entradilla empuja hacia abajo (`mb-8`) y la nota se separa de lo
 * que cierra (`mt-8`). Estaban escritas seis veces cada una.
 *
 * Van como constantes LITERALES y no como una función que reciba el margen:
 * Tailwind escanea el código como texto plano, así que una clase construida por
 * interpolación no se genera y el elemento se queda sin estilo, sin error de
 * compilación (`BRAND.md` §Cómo medir, punto 5).
 */
export const INTRO =
  "text-muted-foreground m-0 mb-8 max-w-[var(--measure)] text-[0.95rem] leading-[1.7]";

/** El matiz que no cabe en una tarjeta, bajo la rejilla de la sección. */
export const NOTA =
  "text-muted-foreground m-0 mt-8 max-w-[var(--measure)] text-[0.95rem] leading-[1.7]";

/**
 * EL MARCO DE LAS DOS FIGURAS DE ESTA PÁGINA (03) y (05). Antes estaba escrito
 * dos veces con un comentario que decía «misma caja que el diagrama de (03), y el
 * `max-w-[690px]` es la misma aritmética, no una coincidencia de diseño». Ahora
 * es literalmente la misma caja, que es lo que ese comentario quería garantizar.
 *
 * EL `p-[clamp(1rem,2.5vw,1.5rem)]` NO ES DECORACIÓN: a 360 resuelve a 16px, que
 * son los que `check:figuras` presupuesta al calcular el hueco (360 − 42 de
 * página − 2 de borde − 32 de panel = 284). Con más aire, el rótulo cae por
 * debajo de 11px pintados sin que nadie toque el dibujo. Se midió en el
 * prototipo, donde con 24px daba 9,19.
 *
 * SIN `mx-auto`, o sea alineada a la IZQUIERDA (Francisco, 2026-08-25, para las
 * DOS figuras de esta página). Centrada dejaba su borde izquierdo desalineado con
 * todo lo demás de la sección —titular, entradilla y la primera columna de
 * tarjetas arrancan en el mismo eje—, y en una página que es sobre todo rejillas
 * de tarjetas esa desalineación se nota más que el desequilibrio de tener hueco a
 * la derecha.
 *
 * Y `max-w-[690px]` PORQUE LA CAJA SE AJUSTA AL DIBUJO, no a la columna
 * (feedback de Francisco: a ancho completo la tarjeta dejaba 250px de vacío a
 * cada lado del lienzo).
 *
 * EL NÚMERO NO ES DE DISEÑO Y NO SE PUEDE APRETAR MÁS: 690 − 2 del borde − 48 del
 * padding a escritorio (el `clamp` ya en su tope de 1,5rem) = 640 de contenido,
 * que es lo que mide el `@container`. Y tiene que quedar POR ENCIMA de 630, el
 * umbral del lienzo ancho: con 670 el contenido son 620 justos, o sea por debajo,
 * y el diagrama saltaba al dibujo estrecho precisamente en escritorio.
 *
 * BAJAR EL UMBRAL EN VEZ DE ENSANCHAR LA CAJA NO VALE, y lo cazó `check:figuras`
 * al intentarlo: el umbral es un CONTRATO —«este lienzo puede aparecer a partir de
 * este ancho»—, así que ponerlo en 610 promete dibujar a 610, y ahí el rótulo son
 * 10,8px pintados.
 *
 * OJO AL VERIFICARLO: el gate no modela el `max-w` de esta caja, así que un 670 le
 * parece bien. Lo que caza el salto de lienzo es mirar la página servida, no el
 * gate.
 *
 * `diagram-realce` + `data-reveal` encienden el barrido de `.rlz` (D79). Sin JS o
 * con `prefers-reduced-motion`, cada pieza es opacidad 1 desde el primer render.
 */
export function DiagramaFigura({
  caption,
  children,
}: {
  caption: string;
  children: ReactNode;
}) {
  return (
    <figure
      data-reveal
      className="diagram-realce border-border bg-card mt-0 mb-8 max-w-[690px] overflow-hidden rounded-xl border"
    >
      <div className="@container flex items-center justify-center p-[clamp(1rem,2.5vw,1.5rem)]">
        {children}
      </div>
      <figcaption
        className={cn(
          "border-border text-muted-foreground border-t px-5 py-4 text-[0.85rem]",
          LEADING.lead,
        )}
      >
        {caption}
      </figcaption>
    </figure>
  );
}

/**
 * CUÁNTOS PUNTOS DEL CHECKLIST SE HEREDAN, contados y no escritos (D38). La nota
 * de (02) afirma «cuatro de los nueve», y las dos cifras son justo las que se
 * quedan atrás cuando alguien añade un punto: el total, porque la lista de arriba
 * crece sola, y el heredado, porque depende de si la pieza lo trae. El dato vive
 * PEGADO a cada punto (`inherited`) y no en una lista aparte, que es lo que impide
 * que digan cosas distintas.
 *
 * Lo consumen DOS secciones —(02) y (04)—, así que se construye una vez en
 * `index.tsx` y baja como prop. Es la misma disciplina que el recorrido: el dato
 * se deriva donde está su fuente, no en cada sitio que lo pinta.
 */
export type FillCounts = (text: string) => string;

export function hacerFillCounts(
  items: readonly { inherited?: boolean }[],
  lang: Locale,
  guardianes: { comprobaciones: number; fingidos: number },
): FillCounts {
  const total = items.length;
  const heredados = items.filter((m) => m.inherited).length;
  return (text: string) =>
    text
      .replace(/{heredados}/g, cardinal(heredados, lang))
      .replace(/{total}/g, cardinal(total, lang))
      // Las dos del arnés no salen de la lista de al lado sino de
      // `scripts/guardianes/casos.ts`, sellado en `design-values` y verificado
      // por `check:accesibilidad`: escritas a mano llegaron a decir catorce y
      // veintitrés habiendo quince y veintisiete (P50.73).
      //
      // Y van en NUMERAL, no en letra como los otros dos: la tabla de cardinales
      // llega a veinte y estas dos ya la pasan. Estirarla era inventar veinte
      // palabras de datos para dos cifras que además crecen solas.
      .replace(/{comprobaciones}/g, String(guardianes.comprobaciones))
      .replace(/{fingidos}/g, String(guardianes.fingidos));
}
