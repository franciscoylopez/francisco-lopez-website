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

const [, , entrada, salida] = process.argv;
if (!entrada || !salida) {
  console.error("Uso: npx tsx scripts/artefacto-svg.ts <export.svg> <destino.svg>");
  process.exit(1);
}

let svg = readFileSync(entrada, "utf8");

/**
 * La caja del grafo, recorriendo el SVG y ACUMULANDO LOS `translate` de los
 * grupos que envuelven cada forma.
 *
 * La primera versión no lo hacía y por eso salió corta: en Mermaid las cajas de
 * los CLUSTER llevan coordenadas absolutas, pero las de los NODOS van centradas
 * en el origen (`x="-68" y="-22"`) dentro de un `<g transform="translate(cx,cy)">`.
 * Leyendo el `rect` sin su grupo, un nodo que vive en y=1.400 se contabilizaba
 * como si estuviera en y=-22 — así que el alto salió 1.203 cuando el dibujo mide
 * bastante más, y la última banda quedaba fuera del `viewBox` y la recortaba el
 * `overflow-hidden` del panel. Se vio en pantalla, no en el código: el SVG lleva
 * `overflow:visible`, así que pintaba fuera de su caja sin quejarse.
 */
function cajaDelGrafo(fuente: string) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  const punto = (x: number, y: number) => {
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  };

  // Pila de traslaciones: se apila al abrir un `<g>` y se desapila al cerrarlo.
  const pila: { x: number; y: number }[] = [{ x: 0, y: 0 }];
  const actual = () => pila[pila.length - 1] ?? { x: 0, y: 0 };

  for (const m of fuente.matchAll(/<(\/?)(g|rect|path|circle)\b([^>]*)>/g)) {
    const [, cierre, tag, attrs = ""] = m;
    const t = actual();

    if (tag === "g") {
      if (cierre) {
        if (pila.length > 1) pila.pop();
        continue;
      }
      const tr = /transform="translate\((-?[0-9.]+)[, ]\s*(-?[0-9.]+)\)"/.exec(
        attrs,
      );
      pila.push(
        tr
          ? { x: t.x + Number(tr[1]), y: t.y + Number(tr[2]) }
          : { x: t.x, y: t.y },
      );
      // Los `<g/>` autocerrados no llegan aquí; Mermaid no los emite.
      continue;
    }

    const num = (k: string) =>
      Number(new RegExp(`${k}="(-?[0-9.]+)"`).exec(attrs)?.[1] ?? NaN);

    if (tag === "rect") {
      const x = num("x");
      const y = num("y");
      const w = num("width");
      const h = num("height");
      if (Number.isFinite(w) && Number.isFinite(h)) {
        const x0 = (Number.isFinite(x) ? x : 0) + t.x;
        const y0 = (Number.isFinite(y) ? y : 0) + t.y;
        punto(x0, y0);
        punto(x0 + w, y0 + h);
      }
    } else if (tag === "circle") {
      const cx = num("cx");
      const cy = num("cy");
      const r = num("r");
      if (Number.isFinite(r)) {
        const x0 = (Number.isFinite(cx) ? cx : 0) + t.x;
        const y0 = (Number.isFinite(cy) ? cy : 0) + t.y;
        punto(x0 - r, y0 - r);
        punto(x0 + r, y0 + r);
      }
    } else if (tag === "path") {
      const d = /\sd="([^"]+)"/.exec(attrs)?.[1] ?? "";
      for (const p of d.matchAll(/(-?[0-9.]+)[, ](-?[0-9.]+)/g)) {
        punto(Number(p[1]) + t.x, Number(p[2]) + t.y);
      }
    }
  }

  const M = 28; // margen, para que el trazo de los bordes no se corte
  return {
    x: Math.round(minX - M),
    y: Math.round(minY - M),
    w: Math.round(maxX - minX + M * 2),
    h: Math.round(maxY - minY + M * 2),
  };
}

const caja = cajaDelGrafo(svg);

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

// 4 · La paleta, a tokens. El orden importa: primero los hex largos.
//
// EL LIENZO DE MERMAID ES `--card`, NO `--background`. Mermaid llama «blanco» a
// su lienzo, y aquí el lienzo es el panel que envuelve al diagrama, que se pinta
// `bg-card`. Por eso todo lo que Mermaid deja en blanco —el cuerpo del cluster,
// el hueco del estado final, el estado compuesto— se mapea a `var(--card)`: son
// huecos, no superficies nuevas. El relleno de NODO sigue yendo a
// `var(--background)`, que es un peldaño por debajo del panel en los dos temas y
// es lo que hace que la caja se vea.
const PALETA: [RegExp, string][] = [
  // Trazo de nodos, clusters y aristas → el cian de marca (7,47 / 8,36 contra
  // `--background`, umbral de gráfico 3:1).
  [/#9370DB/gi, "var(--brand-cyan)"],
  // Relleno de nodo → el fondo de la página, para que la caja respire igual en
  // los dos temas.
  [/#ECECFF/gi, "var(--background)"],
  // Texto. Mermaid escribe el mismo gris en las dos notaciones, y la corta se
  // escapó de la primera versión de esta tabla: dejó 4 `fill:#333` vivos.
  [/#333333/gi, "var(--foreground)"],
  [/#333\b/gi, "var(--foreground)"],
  [/#000000/gi, "var(--foreground)"],
  // Cluster: relleno y filete.
  [/#f0f0f0/gi, "var(--muted)"],
  [/#e0e0e0/gi, "var(--border)"],
  // Notas de Mermaid: si alguna aparece, que sea neutra y no amarilla.
  [/#fff5ad/gi, "var(--muted)"],
  [/#aaaa33/gi, "var(--border)"],
  [/#552222/gi, "var(--foreground)"],
  [/#131300/gi, "var(--foreground)"],
  // La pastilla que Mermaid pone detrás de la etiqueta de una arista, para que
  // el texto no se lea encima de la flecha. Va a `--muted` —que es a donde ya
  // iba su `#f0f0f0`— y no a `--card`: si se funde con el lienzo deja de
  // enmascarar, que es su único trabajo.
  [/rgba\(232,\s*232,\s*232,\s*0?\.8\)/gi, "var(--muted)"],
  // El fondo blanco del lienzo.
  [/background-color:\s*rgb\(255,\s*255,\s*255\);?/gi, ""],
  [/fill="rgb\(255,\s*255,\s*255\)"/gi, 'fill="transparent"'],
  // Los nombres de color. Mermaid los mezcla con los hex en la misma hoja, y
  // por ahí entraron los cinco slabs blancos que en oscuro dejaban el diagrama
  // con pinta de captura pegada sobre la página. `red` es el color con el que
  // Mermaid marca una etiqueta que no ha sabido resolver: aquí no puede quedar.
  [/(fill|stroke|color|background-color)\s*:\s*white\b/gi, "$1:var(--card)"],
  [/(fill|stroke|color|background-color)\s*:\s*(black|red)\b/gi,
    "$1:var(--foreground)"],
];
for (const [re, token] of PALETA) svg = svg.replace(re, token);

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

// 7 · EL GUARDIÁN. Los pasos de arriba son una lista de colores CONOCIDOS, y una
// lista de conocidos falla en silencio: la primera versión mapeaba `#333333` pero
// no `#333`, y no cubría los nombres de color, así que el export se publicó con
// 17 declaraciones de color fijo y cinco rectángulos blancos que en oscuro no
// conmutaban. No lo cazó el typecheck, ni el linter, ni `gate:html` —el HTML era
// idéntico, el que estaba mal era el color— sino mirar el diagrama en oscuro.
//
// Así que aquí no se comprueba que los conocidos cuadren, sino que NO QUEDA
// NINGÚN color literal en el archivo: mismo giro que D38 le dio al guardián de
// la paleta. Si Mermaid cambia su hoja o el diagrama estrena una forma nueva,
// esto se rompe en la terminal y no en la página.
const COLOR_LITERAL =
  /(fill|stroke|color|background-color|flood-color|stop-color)\s*:\s*([^;}"']+)/gi;
const PERMITIDO = /^(none|transparent|currentcolor|inherit|var\(--[\w-]+\))$/i;
const fugas = [
  ...new Set(
    [...svg.matchAll(COLOR_LITERAL)]
      .map(([, prop = "", valor = ""]) => [prop, valor.trim()] as const)
      .filter(([, valor]) => valor !== "" && !PERMITIDO.test(valor))
      .map(([prop, valor]) => `${prop}:${valor}`),
  ),
];
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
