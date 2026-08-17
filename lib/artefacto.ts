import "server-only";

import { readFileSync } from "node:fs";
import { join } from "node:path";

// Carga el SVG de un artefacto para inlinearlo en la página.
//
// POR QUÉ INLINE Y NO UN `<img src="...svg">`. Un SVG servido como imagen es un
// documento aparte: no ve las variables CSS de la página, así que el diagrama se
// quedaría con los colores que traiga cocidos y NO conmutaría con el tema — que
// es exactamente lo que §43 descartó al rechazar el vídeo para las
// ilustraciones. Inline, cada `var(--brand-cyan)` del dibujo resuelve contra los
// tokens del sitio y el artefacto pasa de carbón a hueso con el resto.
//
// Y SE LEE EN BUILD, NO EN CADA PETICIÓN: las páginas del deep-dive son
// estáticas (D25), así que esto ocurre una vez por página al construir. El coste
// es peso de HTML —unos 60 KB en la de Emendu—, que cae muy por debajo del
// pliegue y no toca el LCP, cuyo elemento es el h1 (284 ms medidos).
//
// El SVG que se lee aquí NO es el export crudo de mermaid.live: es el que deja
// `scripts/artefacto-svg.ts`, que le quita la hoja de estilos externa —la CSP no
// la permitiría—, el pan/zoom del editor y la paleta fija. La fuente de verdad
// del dibujo es el `.mmd` que hay al lado.

const DIR = join(process.cwd(), "content", "artefactos");

export function artefactoSvg(nombre: string): string {
  try {
    return readFileSync(join(DIR, `${nombre}.svg`), "utf8");
  } catch {
    // Lanza en vez de renderizar un hueco: un artefacto que falta es un
    // agujero visible en la página, y en build se ve; en producción, no.
    throw new Error(
      `Deep-dive: no encuentro el artefacto "${nombre}" en content/artefactos/. ` +
        `¿Se referenció en el diccionario sin generar el SVG desde su .mmd?`,
    );
  }
}
