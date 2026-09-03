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
 *   se juzgan igual que el resto, y además se nombran aparte con su cifra. Lo
 *   que cambia no es el suelo sino la SALIDA: a un lienzo anclado por `min-w` no
 *   se le puede estrechar el dibujo, y re-renderizarlo con otra tipografía
 *   tampoco vale —Mermaid recoloca el grafo entero, y en una máquina de estados
 *   la colocación es parte de lo que se cuenta (medido y descartado en P55.5)—,
 *   así que la única palanca es ese mínimo. **Estuvieron medidos y no juzgados**
 *   entre el 2026-08-24 y el 2026-08-29, mientras no se sabía si tenían arreglo.
 *
 * - **Por debajo de 360.** El suelo de la DoD es 360 y aquí se aplica ese. A 320
 *   los lienzos estrechos del artículo pintan 9,7px: está medido, está fuera del
 *   contrato, y cerrarlo pediría lienzos de 244 unidades en vez de 280.
 *   **Y esa decisión de producto YA ESTÁ TOMADA: es D124** (2026-08-26). 360 es
 *   el suelo declarado del RÓTULO —no del sitio, que se verifica hasta 280 por
 *   D93 y P70.13—, así que esto no es una pregunta abierta esperando a que
 *   alguien abra este archivo. Lo que sigue en pie es que el informe lo diga en
 *   voz alta en vez de callárselo, que es lo que impide que el alcance quede
 *   recortado en silencio.
 *   **Se reabre** si el suelo de viewport del sitio baja de 360 como compromiso,
 *   o si una figura aparece en un hueco más estrecho que el `ANCHO_MINIMO` de
 *   aquí abajo — lo segundo lo delata el propio informe, que publica esa cifra.
 * - **Que el rótulo QUEPA.** Esto mide tamaño, no desbordamiento: un texto de 11
 *   unidades que se sale de su caja pasa por aquí. Eso se ve dibujando.
 * - **Texto que no sea `<text>` o `<p>` dentro del SVG.** Si aparece otra forma
 *   de meter texto en un lienzo, hay que añadirla — y mientras tanto el recuento
 *   de rótulos medidos es lo que delata que falta algo.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { JSDOM } from "jsdom";

import { locales } from "../lib/i18n/config";
import { PAGE_SLUGS } from "../lib/routes";
import { ANCHO_MINIMO, peorAncho } from "./figuras/ancho";
import {
  anchoDelViewBox,
  cita,
  rotulosDe,
  tamanoRotulo,
} from "./figuras/rotulos";

const RAIZ_BUILD = join(".next", "server", "app");

/** El suelo, en píxeles pintados: DoD columna A, punto 11. */
const SUELO_PX = 11;

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

/**
 * El aviso de un rótulo por debajo del suelo. La SALIDA depende de cómo esté
 * dimensionado el lienzo, y es la única diferencia que queda entre los dos
 * casos: uno se puede estrechar y el otro no.
 */
function avisoDeSuelo(m: {
  pintado: number;
  fs: number;
  anchoVb: number;
  ancho: number;
  motivo: string;
  nodo: Element;
  seDesplaza: boolean;
}): string {
  const cabecera =
    `rótulo a **${m.pintado.toFixed(1).replace(".", ",")}px** pintados (suelo ${SUELO_PX}): ` +
    `${m.fs} unidades en un lienzo de ${m.anchoVb}`;
  return m.seDesplaza
    ? `${cabecera} anclado a ${m.ancho}px (${m.motivo}). «${cita(m.nodo)}» — este NO se ` +
        "estrecha ni se re-renderiza: la palanca es su `min-w`."
    : `${cabecera}, dibujado como mucho a ${m.ancho}px (${m.motivo}). «${cita(m.nodo)}» — ` +
        "o el lienzo se estrecha, o el rótulo sube.";
}

function revisarLienzo(variante: string, svg: Element) {
  const anchoVb = anchoDelViewBox(svg);
  if (anchoVb === null) return;

  const textos = rotulosDe(svg);
  if (textos.length === 0) return; // un dibujo sin rótulos no tiene nada que medir

  const { ancho, motivo, seDesplaza } = peorAncho(svg);
  const escala = ancho / anchoVb;
  lienzos++;
  if (seDesplaza) lienzosDesplazados++;

  for (const nodo of textos) {
    const fs = tamanoRotulo(nodo, svg);
    if (fs === null) {
      // No se puede medir ⇒ no aprueba. Es la doctrina del repo: un rótulo que
      // el metro no sabe leer no es un rótulo correcto, es un punto ciego.
      fallo(
        variante,
        `un rótulo del lienzo \`${anchoVb}\` no declara su tamaño —ni con \`text-[Npx]\`, ` +
          "ni por atributo, ni en la hoja que el propio lienzo trae dentro—, así que no " +
          `se puede saber a cuántos píxeles se pinta: «${cita(nodo)}»`,
      );
      continue;
    }

    const pintado = fs * escala;
    rotulos++;
    if (pintado < peor.px) {
      peor = {
        px: pintado,
        donde: `${variante} · lienzo ${anchoVb} · ${cita(nodo, 30)}`,
      };
    }

    // UN LIENZO QUE SE DESPLAZA YA SE JUZGA COMO LOS DEMÁS (2026-08-29, P55.5).
    // Estuvo medido y no juzgado desde el 2026-08-24, y el motivo era honesto:
    // su ancho no lo decide el hueco sino su propio `min-w`, así que no se le
    // podía pedir que se estrechara y no se sabía si tenía arreglo. **Ese motivo
    // ya no existe**: el artefacto de Emendu pasó de 5,4 a 11,21px ensanchando
    // ese mínimo de 46 a 96rem. Una excepción se retira cuando se retira su
    // causa, no cuando alguien se acuerda. Lo único que sigue siendo distinto es
    // la salida, y de eso se encarga `avisoDeSuelo`.
    if (seDesplaza) {
      rotulosDesplazados++;
      const antes = desplazados.get(variante);
      if (!antes || pintado < antes.px) {
        desplazados.set(variante, { px: pintado, vb: anchoVb, ancho, fs });
      }
    }

    if (pintado + 0.05 < SUELO_PX) {
      fallo(
        variante,
        avisoDeSuelo({ pintado, fs, anchoVb, ancho, motivo, nodo, seDesplaza }),
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
      revisarLienzo(variante, svg);
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
    "  · fuera del contrato: por debajo de 360 no se juzga — 360 es el suelo " +
      "DECLARADO del rótulo, no del sitio (D124). A 320, los lienzos estrechos " +
      "del artículo pintan 9,7px (medido, P68.59).",
  );

  // ANCLADOS POR `min-w`. Se juzgan como el resto —lo hacen desde el
  // 2026-08-29—, pero se listan aparte y uno a uno, porque su salida es otra:
  // no se estrechan ni se re-renderizan, se les ensancha el mínimo. Un recuento
  // agregado es donde se esconden, y el censo ya se lo encontró con los pares
  // sobre imagen (P68.587).
  if (desplazados.size > 0) {
    console.log(
      `  · de esos, ${lienzosDesplazados} ${lienzosDesplazados === 1 ? "lienzo se desplaza" : "lienzos se desplazan"} ` +
        `a ancho fijo (${rotulosDesplazados} rótulos): su ancho no lo decide el hueco sino su ` +
        "`min-w`, que es también la única palanca si algún día bajan del suelo:",
    );
    for (const [variante, d] of [...desplazados].sort((a, b) =>
      a[0].localeCompare(b[0]),
    )) {
      console.log(
        `      ${variante} — el más justo a ${d.px.toFixed(1).replace(".", ",")}px ` +
          `(${d.fs} unidades en un lienzo de ${d.vb}, anclado a ${d.ancho}px)`,
      );
    }
  }
}

main();
