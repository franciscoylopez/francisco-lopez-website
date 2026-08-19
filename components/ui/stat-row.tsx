import type { ReactNode } from "react";

/**
 * Capa de FILA DE CIFRAS: el resumen en datos que va bajo la apertura de una
 * página (P54.3, 2026-08-19).
 *
 * POR QUÉ EXISTE. Estaba escrita DOS VECES, con firmas distintas: una en
 * `accesibilidad.tsx` y otra en `design-system/hero.tsx`, la primera un
 * subconjunto de la segunda (sin `unit`). Añadir una tercera copia para el Brand
 * Kit es justo lo que la «Regla de construcción» de `CLAUDE.md` manda no hacer:
 * si el caso es del sistema, se crea la pieza, no el caso. Misma historia que las
 * cuatro copias privadas de la cabecera numerada (D43).
 *
 * ESTÁ EN `ui/` Y NO EN `site/` porque no sabe nada de este sitio: recibe cifras
 * y etiquetas, y no conoce ni rutas, ni copy, ni secciones (frontera de D36).
 *
 * EL ANCHO MÍNIMO DE COLUMNA ERA EL ÚNICO VALOR QUE DIFERÍA entre las dos copias
 * —13rem en Design System, 11rem en Accesibilidad— y ninguna decía por qué. Se
 * unifica en **11rem**, y esa decisión se tomó VIÉNDOLA, no razonándola: el
 * primer intento fue 13rem con el argumento de que aguanta mejor la etiqueta más
 * larga («Ancho máximo del contenedor»), y en pantalla resultó ser peor. A 900px
 * de ancho, con 13rem la fila de cuatro se parte en 3 + 1 y deja un dato
 * HUÉRFANO en una segunda línea; con 11rem entran los cuatro y lo único que pasa
 * es que esa etiqueta ocupa dos líneas. Un huérfano se lee como un fallo de
 * maquetación; un salto de línea, no.
 *
 * Efecto secundario asumido: Design System también cambia, porque llevaba 13rem
 * y por tanto arrastraba el huérfano. Sale ganando.
 *
 * No se deja como prop: un parámetro sin motivo escrito es la puerta por la que
 * volvió el drift (BRAND.md §Cómo se escribe una regla, regla 4).
 */

/** Una cifra con su etiqueta. `unit` va pegada al número, más pequeña y atenuada. */
export function Stat({
  value,
  unit,
  label,
}: {
  value: string;
  unit?: string;
  label: ReactNode;
}) {
  return (
    <div>
      <div className="font-display text-[1.6rem] leading-none">
        {value}
        {unit && (
          <span className="text-muted-foreground text-[0.9rem]">{unit}</span>
        )}
      </div>
      <div className="text-muted-foreground mt-[0.35rem] text-[0.85rem]">
        {label}
      </div>
    </div>
  );
}

/**
 * La fila. Trae el filete superior y el hueco que la separa de la apertura, que
 * también estaban escritos en los dos sitios.
 */
export function StatRow({ children }: { children: ReactNode }) {
  return (
    <div
      data-reveal
      className="border-border mt-[clamp(3rem,6vw,4.5rem)] grid [grid-template-columns:repeat(auto-fit,minmax(min(100%,11rem),1fr))] gap-[var(--gutter)] border-t pt-8"
    >
      {children}
    </div>
  );
}
