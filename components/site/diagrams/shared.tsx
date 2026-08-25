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
 * Cómo se escribe todo eso —y por qué el lienzo acabó siendo la única cifra que
 * un diagrama declara— está justo debajo.
 */
/* ── EL LIENZO ES LA ÚNICA CIFRA, y de él salen las otras dos (P68.7205) ──
 *
 * Antes, cada diagrama escribía el ancho de su lienzo TRES veces: en su propio
 * `viewBox`, en su `max-w-[Npx]` y, con un +10, en el `umbral` que le pasaba a
 * `DosLienzos`. Tres sitios con el mismo número y nada que los atara, así que
 * la pregunta no era si iban a desviarse sino cuándo. Ya lo habían hecho tres
 * veces, y las tres por caminos distintos:
 *
 *  · `s01`: el tope se quedó en 600 con un lienzo de 620 y el rótulo no llegaba
 *    a 11px ni a pantalla completa (P68.59).
 *  · `s01` y `s05`: se estrecharon a 540 y su umbral se quedó en 545, o sea +5.
 *  · `s07`: lienzo de 560 con tope de 620, copiado de otro diagrama. No rompía
 *    nada —un tope MAYOR que el lienzo agranda el dibujo, no lo encoge— pero
 *    pintaba esa figura un 10% más grande de como está dibujada.
 *
 * Un gate mide DESPUÉS; una capa impide ANTES. `check:figuras` seguía en CI y
 * seguirá, pero ahora como confirmación: el número entra una vez, y el tope y el
 * umbral se leen de esta tabla.
 *
 * LAS CLASES SON LITERALES, y eso no es estilo: Tailwind escanea el código como
 * texto plano, así que una clase construida por interpolación no se genera y el
 * elemento se queda sin regla, sin error de compilación (`BRAND.md` §Cómo medir,
 * punto 5). Por eso la tabla escribe cada clase entera en vez de componerla.
 *
 * EL UMBRAL ES EL LIENZO +10: un dibujo de 620 unidades necesita 620px pintados
 * para que su rótulo llegue a 11, y los diez son margen para no conmutar en el
 * empate exacto. Y es una CONTAINER query, no un breakpoint, porque lo que
 * decide es el ancho del panel: media columna a 1024 y columna entera a 360 son
 * el mismo hueco y merecen el mismo dibujo.
 */
const LIENZO = {
  380: {
    cap: "h-auto w-full max-w-[380px]",
    ancho: "contents @max-[390px]:hidden",
    estrecho: "hidden @max-[390px]:contents",
  },
  480: {
    cap: "h-auto w-full max-w-[480px]",
    ancho: "contents @max-[490px]:hidden",
    estrecho: "hidden @max-[490px]:contents",
  },
  540: {
    cap: "h-auto w-full max-w-[540px]",
    ancho: "contents @max-[550px]:hidden",
    estrecho: "hidden @max-[550px]:contents",
  },
  560: {
    cap: "h-auto w-full max-w-[560px]",
    ancho: "contents @max-[570px]:hidden",
    estrecho: "hidden @max-[570px]:contents",
  },
  600: {
    cap: "h-auto w-full max-w-[600px]",
    ancho: "contents @max-[610px]:hidden",
    estrecho: "hidden @max-[610px]:contents",
  },
  620: {
    cap: "h-auto w-full max-w-[620px]",
    ancho: "contents @max-[630px]:hidden",
    estrecho: "hidden @max-[630px]:contents",
  },
} as const;

/** El ancho del `viewBox` del lienzo ancho. Es la única cifra que un diagrama
 * declara sobre su escala: el tope y el umbral salen de ella. Un ancho que no
 * esté en la tabla es un error de compilación, no un rótulo pequeño en
 * producción. */
export type Lienzo = keyof typeof LIENZO;

/** El lienzo estrecho es el MISMO para los ocho diagramas: 280 unidades, con
 * tope de 300. No es coincidencia sino la premisa del rediseño de P68.59 —el
 * hueco de un móvil de 360 son 284px—, así que vive aquí y ningún diagrama lo
 * escribe. Solo su ALTO cambia, porque el mismo contenido apilado ocupa distinto
 * en cada uno. */
const ESTRECHO_W = 280;
const ESTRECHO_CAP = "h-auto w-full max-w-[300px]";

/** Los dos dibujos de un diagrama, con el lienzo, el tope y el conmutador en UN
 * solo sitio.
 *
 * EL `aria-label` SE PASA UNA VEZ y la capa lo pone en los dos `<svg>`, que es
 * como debía ser: el texto alternativo describe lo que el diagrama CUENTA, y eso
 * no cambia entre las dos disposiciones. Escrito en cada lienzo, eran dos sitios
 * donde podían acabar diciendo cosas distintas.
 *
 * Solo uno está en el DOM visible a la vez, así que el `aria-label` NO se duplica
 * para un lector de pantalla: `display:none` saca al oculto del árbol de
 * accesibilidad. */
export function DosLienzos({
  ariaLabel,
  ancho,
  estrecho,
}: {
  ariaLabel: string;
  ancho: { w: Lienzo; h: number; children: ReactNode };
  estrecho: { h: number; children: ReactNode };
}) {
  const L = LIENZO[ancho.w];
  return (
    <>
      {/* `contents` y no `block`: el envoltorio desaparece de la caja y el
          `<svg>` sigue siendo hijo directo del flex de `DiagramPanel`, que es
          quien lo centra. Con un `block` en medio, el `w-full` del SVG se
          resolvería contra un hijo flex sin ancho propio. */}
      <div className={L.ancho}>
        <svg
          viewBox={`0 0 ${ancho.w} ${ancho.h}`}
          role="img"
          aria-label={ariaLabel}
          className={L.cap}
        >
          {ancho.children}
        </svg>
      </div>
      <div className={L.estrecho}>
        <svg
          viewBox={`0 0 ${ESTRECHO_W} ${estrecho.h}`}
          role="img"
          aria-label={ariaLabel}
          className={ESTRECHO_CAP}
        >
          {estrecho.children}
        </svg>
      </div>
    </>
  );
}
