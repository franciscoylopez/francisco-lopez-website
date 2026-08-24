/**
 * El rótulo pintado de toda figura con lienzo escalado — `npm run check:figuras`.
 *
 * QUÉ MIDE, Y POR QUÉ NO LO VEÍA NADIE. Un `<text>` dentro de un `<svg viewBox>`
 * NO se pinta al tamaño que declara: `text-[11px]` son 11 **unidades de dibujo**,
 * y lo que llega a la pantalla es
 *
 *     px pintados = font-size × (ancho pintado / ancho del viewBox)
 *
 * Los siete diagramas del artículo llevaban desde que existen pintando entre 5,0
 * y 8,2px a 360 (P68.59), y no lo detectó nada porque cae en el hueco de tres
 * metros a la vez: `viewport-verifier` mira desbordamientos y ejes de layout, y
 * un texto pequeño no produce ninguno; axe da `incomplete` en `color-contrast`
 * sobre `<text>` de SVG (D67) y **no mide tamaño de texto**; y el `font-size`
 * computado dice 11 en todos los viewports, así que un guardián que leyera el
 * CSS no vería nada. La escala del `viewBox` no aparece en ninguna de las tres.
 *
 * EL SUELO ES 11px PINTADOS A 360, que es el punto 11 de la columna A de la
 * Definition of Done (`CLAUDE.md`), no un número inventado aquí.
 *
 * POR QUÉ ESTO SÍ ESTÁ EN CI, al revés que el censo y que `psi`. La tarea daba
 * por hecho que haría falta navegador —«se mide sobre el sitio servido»— y no
 * hace falta: **todo lo que entra en la cuenta está en el HTML prerenderizado**.
 * El `viewBox`, el tope (`max-w-[Npx]`), el umbral de la container query
 * (`@max-[Npx]:hidden`) y el `font-size` de cada rótulo (`text-[Npx]`) son
 * atributos, no resultados de layout. Lo único que hay que aportar es el ancho
 * del hueco más estrecho donde una figura puede aparecer, y eso es una
 * constante del marco, no una medición por página. Así que corre en cada PR y
 * cuesta segundos, en vez de depender de que alguien abra un navegador.
 *
 * CÓMO SE ACOTA EL PEOR CASO, que es la única parte con criterio:
 *
 * - Un lienzo detrás de `contents @max-[N]:hidden` es el ANCHO de un par: solo
 *   se dibuja cuando el contenedor pasa de N, así que su peor caso es `N` —o el
 *   tope, si el tope es menor.
 * - Un lienzo detrás de `hidden @max-[N]:contents` es el ESTRECHO: se dibuja de
 *   N para abajo, sin suelo, así que su peor caso es el hueco más estrecho del
 *   sitio, `ANCHO_MINIMO`.
 * - Un lienzo suelto, sin pareja, puede caer en cualquier hueco: mismo trato que
 *   el estrecho.
 *
 * VALIDADO CONTRA EL NAVEGADOR ANTES DE CREÉRSELO (`BRAND.md` §Cómo medir,
 * punto 1), que es lo que separa un metro de una opinión: sobre el sitio servido
 * a 360, las siete figuras del artículo miden 11,2px, y este script predice
 * 11,2 para las siete. A 1280, el navegador da 11,0 en cinco y 12,2 en s08; el
 * script predice lo mismo. Si algún día deja de cuadrar, el fallo es del
 * script, no del sitio.
 *
 * LO QUE NO CUBRE, dicho para que no se dé por cubierto:
 *
 * - **Los lienzos que se DESPLAZAN a ancho fijo**, como el artefacto de Emendu:
 *   se miden y se nombran en cada corrida con su cifra, pero no tumban el gate
 *   (decisión de Francisco, 2026-08-24). El motivo es que la palanca no es la
 *   misma — a un lienzo anclado por `min-w` no se le puede estrechar el dibujo,
 *   hay que RE-RENDERIZARLO con otra tipografía, que es otro subsistema (D54) y
 *   recalcula el layout entero. Hoy hay uno y está a 5,4px.
 *   **Que salga por pantalla en cada corrida es la mitad de la decisión**: sin
 *   eso sería un alcance recortado en silencio, que es el antipatrón que
 *   describe `BRAND.md` §Cómo se escribe una regla.
 * - **Por debajo de 360.** El suelo de la DoD es 360 y aquí se aplica ese. A 320
 *   los lienzos estrechos del artículo pintan 9,7px: está medido, está fuera del
 *   contrato, y cerrarlo pide lienzos de 244 unidades en vez de 280. Es decisión
 *   de producto, no de este script — y por eso el informe lo dice en voz alta en
 *   vez de callárselo.
 * - **Que el rótulo QUEPA.** Esto mide tamaño, no desbordamiento: un texto de 11
 *   unidades que se sale de su caja pasa por aquí. Eso se ve dibujando.
 * - **Texto que no sea `<text>` o `<p>` dentro del SVG.** Si aparece otra forma
 *   de meter texto en un lienzo, hay que añadirla — y mientras tanto el recuento
 *   de rótulos medidos es lo que delata que falta algo.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { JSDOM, type DOMWindow } from "jsdom";

import { locales } from "../lib/i18n/config";
import { PAGE_SLUGS } from "../lib/routes";

const RAIZ_BUILD = join(".next", "server", "app");

/** El suelo, en píxeles pintados: DoD columna A, punto 11. */
const SUELO_PX = 11;

/**
 * El ancho, en píxeles, del hueco más estrecho donde el sitio dibuja una figura:
 * el contenido del panel de un diagrama a 360.
 *
 *     360 − 42 (padding de página) − 2 (borde del panel) − 32 (padding del panel) = 284
 *
 * Medido en el navegador además de calculado, que no es lo mismo (P68.59): a 360
 * el `getBoundingClientRect()` del panel da 318 y el de su contenido, 284.
 *
 * SI ESTA CIFRA SE QUEDA VIEJA, el gate afloja en silencio — es su único punto
 * ciego. Por eso el informe la publica en cada corrida junto a los px que
 * predice: comparar contra un navegador a 360 es entonces mirar dos números.
 */
const ANCHO_MINIMO = 284;

const VARIANTES = locales.flatMap((lang) =>
  PAGE_SLUGS.map((slug) => ({ lang, slug })),
);

let fallos = 0;
let variantesLeidas = 0;
let lienzos = 0;
let rotulos = 0;
let peor = { px: Infinity, donde: "" };

/** Los lienzos que se DESPLAZAN a ancho fijo: se miden y se nombran, no se
 * juzgan. Uno por variante, con su rótulo más justo. */
let lienzosDesplazados = 0;
let rotulosDesplazados = 0;
const desplazados = new Map<
  string,
  { px: number; vb: number; ancho: number; fs: number }
>();

function fallo(variante: string, mensaje: string) {
  fallos++;
  console.error(`  ✗ ${variante} — ${mensaje}`);
}

/** El número de un `max-w-[540px]` / `@max-[545px]:hidden` / `text-[11px]`. */
function px(clases: string, patron: RegExp): number | null {
  const m = clases.match(patron);
  return m?.[1] ? Number(m[1]) : null;
}

/**
 * El tamaño declarado de un rótulo, en unidades del lienzo. Hay tres formas de
 * decirlo y este sitio usa las tres: la utilidad de Tailwind en los diagramas
 * propios, y el atributo o el `style` inline en los SVG que genera Mermaid.
 * Se hereda del ancestro más cercano que lo declare, que es como lo resuelve
 * el navegador y como lo escribe Mermaid (un `<g>` con la clase, los `<text>`
 * dentro sin nada).
 */
function tamanoRotulo(
  nodo: Element,
  svg: Element,
  ventana: DOMWindow,
): number | null {
  for (let n: Element | null = nodo; n; n = n.parentElement) {
    const clases = n.getAttribute("class") ?? "";
    const porUtilidad = px(clases, /text-\[([\d.]+)px\]/);
    if (porUtilidad !== null) return porUtilidad;

    const atributo = n.getAttribute("font-size");
    if (atributo) {
      const v = Number.parseFloat(atributo);
      if (Number.isFinite(v)) return v;
    }

    const inline = n.getAttribute("style") ?? "";
    const porEstilo = inline.match(/font-size:\s*([\d.]+)px/);
    if (porEstilo?.[1]) return Number(porEstilo[1]);

    if (n === svg) break;
  }

  // ÚLTIMO RECURSO, y con condición: un SVG que trae su PROPIA hoja de estilos
  // —los que genera Mermaid— declara ahí el tamaño, heredado desde la raíz, y
  // eso no se ve subiendo por atributos. `getComputedStyle` de jsdom sí lo
  // resuelve, porque ese `<style>` está en el documento.
  //
  // La condición no es cosmética: el CSS de Tailwind viaja en un `<link>` que
  // jsdom NO descarga, así que para nuestros propios diagramas `getComputedStyle`
  // devolvería el tamaño POR DEFECTO del documento y el gate mediría 16 donde
  // hay 11. Solo se usa cuando el propio lienzo declara `font-size`, que es la
  // evidencia de que hay una regla detrás y no un valor inventado.
  const hoja = svg.querySelector("style")?.textContent ?? "";
  if (!/font-size/.test(hoja)) return null;
  const calculado = Number.parseFloat(ventana.getComputedStyle(nodo).fontSize);
  return Number.isFinite(calculado) ? calculado : null;
}

/**
 * El ancho mínimo en px que un ancestro le imponga al lienzo, si lo hay. Cubre
 * tanto `min-w-[46rem]` puesto sobre el propio SVG como la forma que usa el
 * artefacto, `[&>svg]:min-w-[46rem]` en su envoltorio.
 */
function sueloPorDesplazamiento(svg: Element): number | null {
  for (let n: Element | null = svg; n; n = n.parentElement) {
    const clases = n.getAttribute("class") ?? "";
    const rem = clases.match(/min-w-\[([\d.]+)rem\]/);
    if (rem?.[1]) return Math.round(Number(rem[1]) * 16);
    const enPx = clases.match(/min-w-\[(\d+)px\]/);
    if (enPx?.[1]) return Number(enPx[1]);
  }
  return null;
}

/**
 * El ancho pintado más estrecho al que este lienzo puede llegar a dibujarse.
 * Devuelve también de dónde sale, porque un informe que da una cifra sin decir
 * de qué regla viene no se puede auditar.
 */
function peorAncho(svg: Element): {
  ancho: number;
  motivo: string;
  seDesplaza: boolean;
} {
  const tope = px(svg.getAttribute("class") ?? "", /max-w-\[(\d+)px\]/);
  const clasesPadre = svg.parentElement?.getAttribute("class") ?? "";
  const umbralAncho = px(clasesPadre, /@max-\[(\d+)px\]:hidden/);

  // UN LIENZO QUE SE DESPLAZA NO SE ENCOGE. Si un ancestro le fija un ancho
  // mínimo —`min-w-[46rem]` dentro de un `overflow-x-auto`, que es lo que hace
  // el artefacto de Emendu—, su ancho pintado no depende del hueco: es ese
  // mínimo. Modelarlo importa porque si no se juzgaría por el hueco más
  // estrecho del sitio y saldría un número peor que el real.
  const suelo = sueloPorDesplazamiento(svg);
  if (suelo !== null) {
    return {
      ancho: suelo,
      motivo: `mínimo de ${suelo}px, se desplaza`,
      seDesplaza: true,
    };
  }

  if (umbralAncho !== null) {
    // Lienzo ANCHO: solo se dibuja por encima del umbral.
    const ancho = tope === null ? umbralAncho : Math.min(umbralAncho, tope);
    return {
      ancho,
      motivo:
        tope !== null && tope < umbralAncho
          ? `tope ${tope}px`
          : `umbral ${umbralAncho}px`,
      seDesplaza: false,
    };
  }

  // Lienzo ESTRECHO (o suelto): puede caer en el hueco más angosto del sitio.
  const ancho = tope === null ? ANCHO_MINIMO : Math.min(ANCHO_MINIMO, tope);
  return {
    ancho,
    motivo: tope !== null && tope < ANCHO_MINIMO ? `tope ${tope}px` : "a 360",
    seDesplaza: false,
  };
}

function revisarLienzo(variante: string, svg: Element, ventana: DOMWindow) {
  const vb = svg.getAttribute("viewBox")?.trim().split(/\s+/);
  const anchoVb = vb?.length === 4 ? Number(vb[2]) : NaN;
  if (!Number.isFinite(anchoVb) || anchoVb <= 0) return;

  const textos = [
    ...svg.querySelectorAll("text"),
    ...svg.querySelectorAll("foreignObject p"),
    ...svg.querySelectorAll("foreignObject span:not(:has(*))"),
  ].filter((n) => (n.textContent ?? "").trim().length > 0);
  if (textos.length === 0) return; // un dibujo sin rótulos no tiene nada que medir

  const { ancho, motivo, seDesplaza } = peorAncho(svg);
  const escala = ancho / anchoVb;
  if (seDesplaza) lienzosDesplazados++;
  else lienzos++;

  for (const nodo of textos) {
    const fs = tamanoRotulo(nodo, svg, ventana);
    if (fs === null) {
      // No se puede medir ⇒ no aprueba. Es la doctrina del repo: un rótulo que
      // el metro no sabe leer no es un rótulo correcto, es un punto ciego.
      fallo(
        variante,
        `un rótulo del lienzo \`${anchoVb}\` no declara su tamaño con \`text-[Npx]\`, ` +
          `así que no se puede saber a cuántos píxeles se pinta: «${(nodo.textContent ?? "").trim().slice(0, 40)}»`,
      );
      continue;
    }
    const pintado = fs * escala;

    // UN LIENZO QUE SE DESPLAZA SE MIDE, PERO NO SE JUZGA AQUÍ (decisión de
    // Francisco, 2026-08-24). Su ancho pintado no lo decide el hueco sino su
    // propio `min-w`, así que la palanca no es la misma: en el artefacto de
    // Emendu no se puede estrechar el lienzo, hay que RE-RENDERIZARLO con una
    // tipografía mayor, que es otro subsistema (D54) y recalcula el layout
    // entero. Se le pone cifra y se NOMBRA en cada corrida —callarlo sería
    // exactamente el aprobado silencioso que este gate existe para evitar—,
    // pero no tumba el PR de otra página.
    if (seDesplaza) {
      const antes = desplazados.get(variante);
      if (!antes || pintado < antes.px) {
        desplazados.set(variante, { px: pintado, vb: anchoVb, ancho, fs });
      }
      rotulosDesplazados++;
      continue;
    }

    rotulos++;
    if (pintado < peor.px) {
      peor = {
        px: pintado,
        donde: `${variante} · lienzo ${anchoVb} · ${(nodo.textContent ?? "").trim().slice(0, 30)}`,
      };
    }
    if (pintado + 0.05 < SUELO_PX) {
      fallo(
        variante,
        `rótulo a **${pintado.toFixed(1).replace(".", ",")}px** pintados (suelo ${SUELO_PX}): ` +
          `${fs} unidades en un lienzo de ${anchoVb}, dibujado como mucho a ${ancho}px (${motivo}). ` +
          `«${(nodo.textContent ?? "").trim().slice(0, 40)}» — o el lienzo se estrecha, o el rótulo sube.`,
      );
    }
  }
}

function revisar(lang: (typeof locales)[number], slug: string) {
  const variante = `${lang}${slug ? `/${slug}` : ""}`;
  // La misma resolución que `check:marco`: la home es `es.html`, no `es/index.html`.
  const archivo = join(RAIZ_BUILD, `${lang}${slug ? `/${slug}` : ""}.html`);
  if (!existsSync(archivo)) {
    fallo(
      variante,
      `no hay HTML prerenderizado en \`${archivo}\`. O la página dejó de ser estática ` +
        "—y entonces sale de este gate en silencio, que es lo que hay que mirar— o Next " +
        "cambió dónde deja el prerender.",
    );
    return;
  }
  variantesLeidas++;
  const dom = new JSDOM(readFileSync(archivo, "utf8"));
  try {
    for (const svg of dom.window.document.querySelectorAll("svg[viewBox]")) {
      revisarLienzo(variante, svg, dom.window);
    }
  } finally {
    dom.window.close();
  }
}

function main() {
  if (!existsSync(RAIZ_BUILD)) {
    console.error(
      `\ncheck:figuras — no hay build en \`${RAIZ_BUILD}\`.\n\n` +
        "Este gate mide el HTML que el sitio EMITE, no el código que lo genera:\n\n  npm run build\n",
    );
    process.exit(2);
  }

  console.log("");
  for (const { lang, slug } of VARIANTES) revisar(lang, slug);

  // Guardas de cero. Las tres han sido el modo de fallo silencioso de algún
  // metro de este repo: una lista vacía se lee igual que un aprobado.
  if (variantesLeidas === 0) {
    console.error(
      "\ncheck:figuras — CERO variantes leídas. El gate no ha mirado nada.\n",
    );
    process.exit(2);
  }
  if (lienzos === 0) {
    console.error(
      "\ncheck:figuras — CERO lienzos con rótulo encontrados en " +
        `${variantesLeidas} variantes. El sitio tiene diagramas con \`<text>\`, así que ` +
        "esto no es un aprobado: o el selector dejó de encajar, o las figuras dejaron " +
        "de prerenderizarse.\n",
    );
    process.exit(2);
  }
  if (rotulos === 0) {
    console.error(
      `\ncheck:figuras — ${lienzos} lienzos y CERO rótulos medidos. Mismo caso.\n`,
    );
    process.exit(2);
  }

  if (fallos > 0) {
    console.error(
      `\ncheck:figuras ✗ — ${fallos} ${fallos === 1 ? "rótulo" : "rótulos"} por debajo de ` +
        `${SUELO_PX}px pintados.\n`,
    );
    process.exit(1);
  }

  console.log(
    `check:figuras ✓ — ${lienzos} lienzos escalados y ${rotulos} rótulos medidos en ` +
      `${variantesLeidas} variantes; ninguno por debajo de ${SUELO_PX}px pintados. ` +
      `El más justo: ${peor.px.toFixed(1).replace(".", ",")}px (${peor.donde}).`,
  );
  console.log(
    `  · hueco más estrecho asumido: ${ANCHO_MINIMO}px de contenido, que es el panel a 360. ` +
      "Compáralo con el navegador si el marco cambia de paddings.",
  );
  console.log(
    "  · fuera del contrato: por debajo de 360 no se juzga. A 320, los lienzos " +
      "estrechos del artículo pintan 9,7px (medido, P68.59).",
  );

  // MEDIDOS Y NO JUZGADOS. Van al final y con su cifra, uno a uno, porque un
  // recuento agregado es donde se esconden: el censo ya se lo encontró con los
  // pares sobre imagen (P68.587) y la lección fue nombrarlos.
  if (desplazados.size > 0) {
    console.log(
      `  · medidos y NO juzgados: ${lienzosDesplazados} ${lienzosDesplazados === 1 ? "lienzo" : "lienzos"} ` +
        `que se desplazan a ancho fijo (${rotulosDesplazados} rótulos). Su ancho no lo decide ` +
        "el hueco, así que la palanca no es estrecharlos sino re-renderizarlos:",
    );
    for (const [variante, d] of [...desplazados].sort((a, b) =>
      a[0].localeCompare(b[0]),
    )) {
      console.log(
        `      ${variante} — el más justo a ${d.px.toFixed(1).replace(".", ",")}px ` +
          `(${d.fs} unidades en un lienzo de ${d.vb}, anclado a ${d.ancho}px)` +
          (d.px + 0.05 < SUELO_PX ? `  ← por debajo de ${SUELO_PX}` : ""),
      );
    }
  }
}

main();
