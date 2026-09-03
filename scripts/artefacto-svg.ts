// Convierte el export crudo de mermaid.live en el SVG que el sitio puede servir.
//
//   npx tsx scripts/artefacto-svg.ts <export.svg> <destino.svg>
//
// POR QUÉ HACE FALTA UNA PASADA Y NO SE COMMITEA EL EXPORT TAL CUAL. El SVG que
// sale de mermaid.live trae tres cosas que en este sitio no pueden entrar, y
// ninguna es cosmética:
//
//  1. UN `<?xml-stylesheet?>` A CDNJS. Una hoja de estilos externa que el
//     navegador pediría al pintar el diagrama: la CSP del sitio no la permite
//     (D26/D32, allowlist mínima) y sería una petición a un tercero en una
//     página que hoy no hace ninguna. Fuera.
//  2. LA PALETA DE MERMAID, EN HEX FIJO. Morado #9370DB, texto #333, fondo
//     blanco. Un color fijo no conmuta con el tema —es la misma razón por la que
//     §43 descartó el vídeo para las ilustraciones— y además el morado ya se
//     midió y no llega: 2,65 contra `--background` en claro, por debajo del 3:1
//     que WCAG 1.4.11 pide a un gráfico (D41). Se remapea a tokens: el trazo al
//     cian, que da 7,47/8,36, y el texto a `--foreground`.
//  3. EL ESTADO DE PAN/ZOOM DEL EDITOR, cocido en una `matrix()` sobre el grupo
//     raíz, y ningún `viewBox`. O sea que el dibujo se ve donde el editor lo
//     había dejado, no donde va. Se retira la matriz y se pone el `viewBox` con
//     la caja real del grafo.
//
// El `.mmd` sigue siendo la fuente de verdad; esto es solo el traductor.

import { readFileSync, writeFileSync } from "node:fs";

import { cajaPublicada } from "./artefacto/caja";
import { aTokens, fugasDeColor } from "./artefacto/paleta";

const [, , entrada, salida] = process.argv;
if (!entrada || !salida) {
  console.error(
    "Uso: npx tsx scripts/artefacto-svg.ts <export.svg> <destino.svg>",
  );
  process.exit(1);
}

let svg = readFileSync(entrada, "utf8");

const caja = cajaPublicada(svg);

// 1 · Fuera la declaración XML y la hoja de estilos externa.
svg = svg.replace(/<\?xml[^>]*\?>\s*/g, "");

// 2 · Fuera el pan/zoom del editor: sin él, el `viewBox` manda.
svg = svg.replace(
  /(class="svg-pan-zoom_viewport")\s*transform="[^"]*"\s*style="[^"]*"/,
  "$1",
);

// 3 · La etiqueta `<svg>`: `viewBox` real, sin alto fijo y sin fondo propio.
svg = svg.replace(/<svg[^>]*>/, (tag) => {
  const id = /id="([^"]+)"/.exec(tag)?.[1] ?? "artefacto";
  return (
    `<svg id="${id}" xmlns="http://www.w3.org/2000/svg" ` +
    `viewBox="${caja.x} ${caja.y} ${caja.w} ${caja.h}" ` +
    // Sin clases de Tailwind: este archivo es un `.svg` en `content/`, y
    // Tailwind escanea el código como TEXTO — una clase que solo viva aquí
    // podría no generarse y no daría error (punto 5 del método de `BRAND.md`).
    // El tamaño lo pone el contenedor, que sí es un `.tsx`.
    //
    // `aria-hidden` y NO `role="img"`: los dos juntos se contradicen. Un lector
    // de pantalla no puede seguir flechas, así que el dibujo se oculta y la
    // alternativa es la secuencia contada en prosa, que va justo antes.
    `aria-hidden="true" style="overflow:visible">`
  );
});
// 4 · La paleta, a tokens, y el guardián que la respalda: los dos viven en
// `artefacto/paleta.ts`, porque una tabla de colores conocidos sin su barrido
// de ausencia falla en silencio (esto ya publicó 17 declaraciones fijas).
svg = aTokens(svg);

// 5 · LA TIPOGRAFÍA NO SE TOCA, y esto costó una vuelta. La primera versión la
// cambiaba a la del sitio «para que el diagrama se integrara», y el resultado
// fue que las etiquetas salían CORTADAS —«MODULO_RENTING_ACTI», «CONFIRMACIC»—:
// Mermaid calcula el ancho de cada caja midiendo el texto con SU tipografía, y
// esos anchos vienen ya cocidos en el SVG. Cambiar la fuente después mueve las
// métricas y deja el texto sin sitio.
//
// Es la misma familia de error que el redibujo que esto sustituye: tocar un
// artefacto para que combine mejor con la página acaba estropeando el artefacto.
// Aquí, además, la fidelidad y lo que funciona coinciden — se queda como Mermaid
// lo escribió.

// 6 · Las sombras de Mermaid son negro fijo: invisibles en oscuro y sucias en
// claro. Se retiran las referencias, no el `<filter>` (que queda inerte). El
// tema `neo` las declara además en CSS, con un gris fijo (`rgba(185,185,185)`),
// y esas también se van: hoy están inertes porque este diagrama no usa `neo`,
// pero un artefacto que sí lo use las heredaría.
svg = svg.replace(/\s*filter="url\(#[^)]*drop-shadow[^)]*\)"/g, "");
svg = svg.replace(/filter:\s*drop-shadow\([^)]*\)\s*;?/gi, "");
// 7 · EL GUARDIÁN, cuyo porqué vive junto a la tabla que respalda.
const fugas = fugasDeColor(svg);
if (fugas.length > 0) {
  console.error(
    `\nColor fijo en el artefacto — ${fugas.length} declaración(es) que no ` +
      `conmutan con el tema:\n  ${fugas.join("\n  ")}\n\n` +
      `Añade su mapeo a PALETA en ${import.meta.url.split("/").pop()}.`,
  );
  process.exit(1);
}

writeFileSync(salida, `${svg.trim()}\n`, "utf8");
console.log(
  `Artefacto escrito en ${salida} — viewBox ${caja.x} ${caja.y} ${caja.w} ${caja.h}`,
);
