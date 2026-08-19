import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { PANEL } from "./layout";

// Capa de tabla (P37.658). Sexta capa del sistema, y la última que quedaba con la
// forma que tuvieron el botón, el chrome, la etiqueta y la cabecera antes de tener
// la suya: SEIS tablas —no cinco: el inventario contó las del Design System y el
// Brand Kit y se dejó la de la política de cookies, que vive en otra página— con
// CUATRO definiciones distintas de fila de cabecera divergiendo en siete
// propiedades (layout, gap, padding lateral, padding vertical, tracking, peso y
// fondo) y seis paddings de fila distintos, ninguno de los cuales significaba nada.
//
// Que el inventario se dejara una es en sí el argumento de la capa: se hizo
// mirando dos páginas, porque son las que documentan el sistema, y la tabla que
// faltaba estaba en la que nadie asocia con diseño.
//
// ───────────────────────────────────────────────────────────────────────────────
// LA PREGUNTA DE D36 PRIMERO: ¿la cebra y el filete significan cosas distintas, o
// es una tabla haciendo algo que las otras no?
//
// Respuesta: **es una tabla haciendo algo que las otras no**, y encima no lo estaba
// haciendo. Hay UN separador de tabla en el sistema, el filete.
//
// Cómo se llegó ahí, porque el camino importa más que la conclusión. La hipótesis
// con la que se abrió la tarea —«la cebra ayuda cuando la fila es alta y hay muchas
// columnas»— no sobrevive al inventario: la «Tabla de uso» tiene CINCO columnas y
// no la lleva. Así que se probó un eje mejor: la FORMA de la fila —un renglón de
// celdas frente a un bloque que se envuelve—, y bajo esa lectura la cebra se quedó
// y se le dio también a Cabeceras, que tiene la misma forma.
//
// Y entonces Francisco la miró en pantalla y no le cuadró, así que se MIDIÓ: el
// velo daba un salto de **ΔL* 1,02 en claro** y 2,02 en oscuro, contra los 3,89 /
// 9,04 de la pastilla de hover, que es el escalón que este proyecto usa como
// referencia de «esto se ve» (`BRAND.md` §Cómo medir, punto 4). O sea que la banda
// no agrupaba filas —su única justificación—: ponía un tinte por debajo del umbral,
// y por eso se leía como que algo no cuadraba en vez de como estructura.
//
// LA LECCIÓN, que es la reutilizable: un argumento de diseño bien construido —y el
// de la forma de la fila lo era— sigue siendo una hipótesis hasta que se mide.
// Subirla habría exigido construir la banda sobre `--muted`, o sea una superficie
// nueva con su atenuado recalculado y su par en el censo, para hacer un trabajo que
// el filete ya hace. Lo barato y lo correcto coincidían.
// ───────────────────────────────────────────────────────────────────────────────
//
// POR QUÉ ES `<table>` DE VERDAD Y NO DIVS CON GRID. No es cosmética: la de
// «Contraste medido» son trece filas por tres columnas de datos numéricos, y en
// divs un lector de pantalla no asocia celda con columna — se oye «13,79:1 AAA
// 15,32:1 AAA» sin saber cuál es el tema claro y cuál el oscuro. axe no lo marca
// porque un div no es una tabla rota: simplemente no es una tabla, y eso ninguna
// herramienta lo puede echar de menos.
//
// Las de ESPÉCIMEN se quedan en divs a propósito, y no es una excepción a medias:
// cada metadato ya lleva su propia etiqueta al lado (`TypeMeta`), así que son
// listas de pares etiqueta-valor, no una rejilla de celdas que dependan de una
// cabecera para significar algo. Envolverlas en `<table>` añadiría una cabecera
// que no existe.
//
// EL ANCHO DE COLUMNA LO PONE `<colgroup>`, y esa es la otra cosa que se lleva por
// delante: en la versión con grid, la plantilla de columnas estaba escrita DOS
// veces por tabla —una en la cabecera y otra en la fila— y tenían que coincidir a
// mano. Ahora se declara una vez, y si dejan de coincidir es porque no hay dos.

/** Una columna: su rótulo y, opcionalmente, el ancho que reserva. */
export type Col = {
  label: string;
  /** Cualquier ancho CSS válido para `<col>`: `1.4fr` no vale, `28%` sí. */
  width?: string;
};

/**
 * La celda de cabecera, en UNA definición — cuatro, contando la de la tabla de
 * cookies, que el inventario no vio porque vive en otra página. De las que había se
 * toma la moda en cada propiedad —0,85rem de alto, tracking 0,05em— y se resuelven
 * las dos que no la tenían: el peso queda `font-semibold` (es un
 * `<th>`, y era lo único que una de las tres decía en voz alta) y el fondo se
 * quita, porque el `bg-card` que llevaba la del Brand Kit era invisible dentro de
 * un `PANEL` —que ya es `bg-card`— y solo se veía por estar esa tabla fuera de uno.
 * Ahora está dentro, como las demás.
 */
const HEAD_CELL =
  "border-border text-muted-foreground border-b px-[calc(var(--gutter)/2)] py-[0.85rem] text-[0.72rem] font-semibold tracking-[0.05em] uppercase first:pl-[var(--gutter)] last:pr-[var(--gutter)]";

/**
 * La celda de datos. UN GUTTER EN TODAS PARTES: medio por lado, que compone el
 * gutter entero entre columnas —igual que el `gap` de la versión con grid— y uno
 * entero contra el borde del panel.
 *
 * Los extremos usaban `--page-x` (40px), heredado de las tablas con rejilla del
 * Design System, y ahí no se notaba porque ocupan el ancho de página. En la de
 * cookies, que vive dentro de `PROSE` (42rem), esos 80px de los dos extremos se
 * comían casi un cuarto de la tabla y la columna de finalidad partía sus frases en
 * dos palabras por línea. Y no era una tabla nueva estrenando el problema: la vieja
 * llevaba `px-4`, así que el cambio la empeoró. Con el gutter, la de cookies queda
 * incluso algo más ancha que antes y las cuatro del Design System aprietan 16px.
 */
const CELL =
  "border-border border-b px-[calc(var(--gutter)/2)] py-4 text-left align-top font-normal first:pl-[var(--gutter)] last:pr-[var(--gutter)]";

/**
 * Tabla de DATOS: rejilla de celdas con cabecera de columna. Scroll horizontal
 * propio en vez de romper el layout de la página — la regla es que el cuerpo nunca
 * scrollea en horizontal, así que lo hace la tabla.
 */
export function DataTable({
  caption,
  cols,
  minWidth,
  children,
  className,
}: {
  /**
   * Qué es esta tabla, para quien no la ve. No se pinta: el `<h3>` que la precede
   * ya lo dice en pantalla, pero un lector de pantalla que salta de tabla en tabla
   * no lo tiene delante.
   */
  caption: string;
  cols: readonly Col[];
  /**
   * Ancho por debajo del cual la tabla deja de encogerse y empieza a scrollear.
   * Solo lo necesita la de cookies, que tiene CINCO columnas y una sola con frases
   * (propósito): sin suelo, en una ventana estrecha el navegador reparte el ancho y
   * esa columna acaba partiendo cada frase en palabras sueltas.
   *
   * OJO, EL MOTIVO CAMBIÓ EL 2026-08-19 (P54.2) aunque el valor no: hasta entonces
   * hacía falta porque esa tabla vivía dentro de `PROSE` (42rem) y se estrangulaba
   * ya en escritorio. Ahora el cuerpo de cookies va a ancho de contenedor y allí
   * mide 1.278px, así que el suelo solo actúa en MÓVIL (medido a 390px: 572 y
   * scrollea). Las del Design System ocupan el ancho de página y no lo usan.
   */
  minWidth?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(PANEL, className)}>
      <div className="overflow-x-auto">
        <table
          className="w-full border-collapse text-left"
          style={minWidth ? { minWidth } : undefined}
        >
          <caption className="sr-only">{caption}</caption>
          <colgroup>
            {cols.map((c) => (
              <col
                key={c.label}
                style={c.width ? { width: c.width } : undefined}
              />
            ))}
          </colgroup>
          <thead>
            <tr>
              {cols.map((c) => (
                <th key={c.label} scope="col" className={HEAD_CELL}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          {/* El filete de la última fila se apaga aquí y no con `last:` en la
              celda: `border-collapse` fusiona el borde inferior de la fila con el
              del panel y quedaba un hairline doble. */}
          <tbody className="[&>tr:last-child>*]:border-b-0">{children}</tbody>
        </table>
      </div>
    </div>
  );
}

/** Fila de datos. */
export function TR({ children }: { children: ReactNode }) {
  return <tr>{children}</tr>;
}

/**
 * Celda. `head` la convierte en la celda que NOMBRA la fila (`<th scope="row">`),
 * que es lo que hace que un lector de pantalla lea «Atenuado sobre card, claro,
 * 9,14:1» en vez de tres números sueltos.
 *
 * El `font-normal` y el `text-left` de la base están por esto: la hoja del
 * navegador pone `<th>` en negrita y centrado, y al pasar las tablas a marcado real
 * eso se coló en las notas de cada fila —que ya tenían su peso decidido— sin que
 * nadie lo hubiera escrito. La semántica la elige `head`; el aspecto, la variante.
 */
export function TD({
  children,
  head,
  className,
}: {
  children: ReactNode;
  head?: boolean;
  className?: string;
}) {
  const Tag = head ? "th" : "td";
  return (
    <Tag
      {...(head ? { scope: "row" as const } : {})}
      className={cn(CELL, className)}
    >
      {children}
    </Tag>
  );
}

/**
 * La fila de las tablas de ESPÉCIMEN: un bloque que se envuelve, no un renglón de
 * celdas. Unifica los dos ritmos que había —`gap-y-4 py-6` en tipografía y
 * `gap-y-5 py-7` en cabeceras— sin que la diferencia significara nada.
 *
 * Se separa con FILETE, igual que `DataTable`: es el único separador de tabla del
 * sistema. La cebra que llevaba la de tipografía se midió y se borró — ver arriba.
 */
export const SPECIMEN_ROW =
  "border-border flex flex-wrap items-baseline gap-x-8 gap-y-4 border-b px-[var(--page-x)] py-6 last:border-b-0";
