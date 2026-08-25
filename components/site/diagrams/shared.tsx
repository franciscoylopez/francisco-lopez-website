import type { CSSProperties, ReactNode } from "react";

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

/* ── DOS LIENZOS POR DIAGRAMA (P68.59) ──────────────────────────────────────
 *
 * EL PROBLEMA, medido y no percibido: el rótulo de estos diagramas declara
 * 11px, pero 11px DENTRO de un `viewBox` son 11 unidades de dibujo, no 11
 * píxeles de pantalla. Lo que se pinta es `11 × (ancho pintado / ancho del
 * viewBox)`, así que a 360 —donde el panel deja 284px— un lienzo de 620
 * unidades pintaba el rótulo a **5,0px**. Los siete estaban entre 5,0 y 8,2.
 * El `font-size` computado decía 11 en todos los viewports: la escala del
 * `viewBox` no aparece en él, y por eso no lo vio ningún metro.
 *
 * LA SALIDA, elegida con `/prototype` entre cuatro direcciones: cada diagrama
 * tiene una segunda disposición, estrecha, en un lienzo de 280 unidades, y se
 * conmuta con una container query. Sin JavaScript y sin dejar de ser Server
 * Component. Las descartadas y por qué, en la tarea; la que más se acercó
 * —pintar a tamaño natural con desplazamiento horizontal— dejaba tres
 * diagramas por debajo del suelo igual y obligaba a arrastrar siete figuras.
 *
 * EL UMBRAL NO ES UN NÚMERO DE DISEÑO, ES EL PROPIO LIENZO: `viewBox + 10`.
 * Un dibujo de 620 unidades necesita 620px pintados para que su rótulo llegue
 * a 11; uno de 380 necesita 380. Los +10 son margen para no conmutar en el
 * empate exacto.
 *
 * Con un umbral ÚNICO quedaba un agujero que no se ve probando a 360/768/1536
 * a ancho completo: una figura FLOTADA (`sm:w-1/2`) en un viewport de 1024
 * tiene ~437px de contenido, así que enseñaba el lienzo ancho y pintaba 8,3px.
 * De ahí que el umbral viaje al lado del `viewBox`, que es de donde sale.
 *
 * Y ES UNA CONTAINER QUERY, NO UN BREAKPOINT, justamente por ese caso: lo que
 * decide es el ancho del PANEL, no el de la ventana. Media columna a 1024 y
 * columna entera a 360 son el mismo hueco y merecen el mismo dibujo.
 *
 * SIN SUMARLE EL PADDING, y esto costó una corrección: una container query
 * mide la caja de CONTENIDO del contenedor, así que lo que compara ya es el
 * ancho que le queda al SVG. Sumárselo desplazaba los siete umbrales 48px y
 * mandaba al dibujo de móvil huecos donde el ancho cabía de sobra.
 *
 * Y UNA CONSECUENCIA QUE NO ES DEL CONMUTADOR SINO DEL DIBUJO: media columna
 * son ~550px hasta 1536, así que un lienzo de 560 o 600 no cabe ahí en NINGÚN
 * viewport. Las dos figuras flotadas grandes —s01 y s05— se estrecharon a 540
 * en vez de dejarlas conmutar en escritorio: su versión ancha se pintaba a
 * escala 0,98 y ese 2% era justo el déficit de 10,6px que arrastraban.
 *
 * LOS UMBRALES SON LITERALES A PROPÓSITO. Tailwind escanea el código como
 * texto plano: una clase construida por interpolación no se genera y el
 * elemento se queda sin regla, sin error de compilación (`BRAND.md` §Cómo
 * medir, punto 5 — la trampa que ya costó cuatro comprobadores). Por eso el
 * mapa de abajo escribe cada clase entera y el diagrama solo elige la llave.
 */
const UMBRAL = {
  390: ["contents @max-[390px]:hidden", "hidden @max-[390px]:contents"],
  490: ["contents @max-[490px]:hidden", "hidden @max-[490px]:contents"],
  545: ["contents @max-[545px]:hidden", "hidden @max-[545px]:contents"],
  570: ["contents @max-[570px]:hidden", "hidden @max-[570px]:contents"],
  610: ["contents @max-[610px]:hidden", "hidden @max-[610px]:contents"],
  630: ["contents @max-[630px]:hidden", "hidden @max-[630px]:contents"],
} as const;

/** El ancho de contenido a partir del cual el lienzo ancho ya pinta su rótulo
 * a 11px o más: el `viewBox` del diagrama más 10 de margen. */
export type Umbral = keyof typeof UMBRAL;

/** Los dos dibujos de un diagrama, con el conmutador en UN solo sitio.
 *
 * Solo uno está en el DOM visible a la vez, así que el `aria-label` que cada
 * lienzo lleva NO se duplica para un lector de pantalla: `display:none` saca
 * al oculto del árbol de accesibilidad. Y el texto alternativo es el mismo en
 * los dos porque lo que cambia es la FORMA del dibujo, no lo que cuenta. */
export function DosLienzos({
  umbral,
  ancho,
  estrecho,
}: {
  umbral: Umbral;
  ancho: ReactNode;
  estrecho: ReactNode;
}) {
  const [claseAncho, claseEstrecho] = UMBRAL[umbral];
  return (
    <>
      {/* `contents` y no `block`: el envoltorio desaparece de la caja y el
          `<svg>` sigue siendo hijo directo del flex de `DiagramPanel`, que es
          quien lo centra. Con un `block` en medio, el `w-full` del SVG se
          resolvería contra un hijo flex sin ancho propio. */}
      <div className={claseAncho}>{ancho}</div>
      <div className={claseEstrecho}>{estrecho}</div>
    </>
  );
}
