import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

// Lo único que comparten los diagramas de «Cómo se ha creado esta página»: las
// dos clases de rótulo y el helper de realce. Todo lo demás vive en el archivo
// de su diagrama.
//
// UN ARCHIVO POR DIAGRAMA (P68.55), que es lo que D42 ya decidió para el mismo
// problema —`design-system/` son 18 archivos y `brand-kit/` 9— y lo único que
// el artículo no había hecho. Antes esto eran 1.031 líneas en un solo módulo,
// el archivo más grande del repositorio, creciendo con cada capítulo que gana
// figura; retocar UN diagrama obligaba a recorrerlas todas. El gate del
// refactor es el de D42/D45: `npm run gate:html` con diff vacío.
//
// Los diagramas son propios (P60, D54): SVG inline con tokens, no `<img>` —
// así conmutan con el tema. Site-specific (el contenido de cada uno es del
// artículo), por eso viven en `site/` y no en `ui/`, que solo aporta el marco
// (`DiagramPanel`). El pie de cada uno es del diccionario, no de aquí (P60
// tanda 2): la versión anterior lo tenía escrito en español dentro de este
// módulo, así que EN publicaba una leyenda en castellano — bug de i18n que se
// arregla pasando el `caption` como parte del bloque `{ type: "diagram" }`,
// igual que el texto de una cita.
//
// Y CADA COMPONENTE RECIBE `lang` POR LA MISMA RAZÓN (hallazgo al verificar
// EN de P60 tanda 2, no algo que pidiera el feedback): el texto DENTRO del
// SVG —«selección · 5-10s», «se usa», «busca ausencia»— estaba tan hardcodeado
// en español como el pie que ya se arregló, y verificando la página en inglés
// se veía la mitad del diagrama en castellano. Cada diagrama lleva su propio
// `t` con las dos versiones; el componente solo elige el idioma.
//
// SON OCHO —los archivos de esta carpeta, así que el número no caduca—, NO LOS
// ONCE QUE MARCA CADA `VISUAL ·` DEL BORRADOR. El resto de secciones se apoyan
// en la prosa y en las citas/dato-en-vivo; añadir un diagrama a cada una de
// las once habría sido ilustrar por completar una lista, no porque la sección
// lo necesitara. Es tarea de V3 (columna B de la DoD) si al verlo en pantalla
// se echa en falta alguno más.
//
// RUIDO CONOCIDO (D67): axe marca `<text>` dentro de estos SVG como
// `incomplete` en `color-contrast` — no resuelve `fill` sobre `<text>` SVG, no
// es un hallazgo. Medido a mano (viewport-verifier, P60): el par real es
// `--muted-foreground`/`--foreground` sobre `--card`, ya calibrado (D30/D39).

export const LBL = "fill-muted-foreground font-mono text-[11px]";
export const LBL_STRONG = "fill-foreground font-mono text-[11px] font-medium";

/** «Realce» (D79): cada pieza de un diagrama entra atenuada y un barrido
 * secuencial la lleva a opacidad plena, en el orden NARRATIVO que marca `i`
 * —el origen primero, lo que depende de él después—, no el orden en que cae
 * en el DOM. `.rlz` y `--i` los resuelve la CSS global (`app/globals.css`);
 * aquí solo se combina con las clases propias de cada pieza. */
export function rlz(i: number, extra?: string) {
  return { className: cn(extra, "rlz"), style: { "--i": i } as CSSProperties };
}
