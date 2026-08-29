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
function tamanoRotulo(nodo: Element, svg: Element): number | null {
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

  // ÚLTIMO RECURSO: LA HOJA QUE EL PROPIO LIENZO SE TRAE. Los SVG que genera
  // Mermaid no ponen el tamaño en ningún atributo: lo declaran en un `<style>`
  // dentro del `<svg>` y lo dejan heredar desde la raíz. Eso no se ve subiendo
  // por atributos, así que hay que resolver la cascada.
  //
  // Y NO LA RESUELVE `getComputedStyle`, que es lo que hacía aquí hasta el
  // 2026-08-29 y es el fallo más silencioso que ha tenido este repo: **jsdom no
  // registra un `<style>` que vive dentro de un `<svg>`** —queda en el namespace
  // SVG y `document.styleSheets` sale en 0—, así que devolvía su tamaño POR
  // DEFECTO, 16px, para cualquier lienzo. El artefacto de Emendu declaraba
  // justamente 16, así que su cifra publicada (5,4px) era correcta **por
  // coincidencia**: al re-renderizarlo a 56 el gate siguió diciendo 16 y bajó la
  // cifra a 3,2px, que es cuando se cayó. Un metro que devuelve el valor por
  // defecto se lee igual que uno que mide (`BRAND.md` §Cómo medir, punto 3).
  //
  // La cascada de aquí abajo es mínima a propósito —selectores planos, que es
  // todo lo que Mermaid emite— pero es de verdad: recorre del nodo hacia la
  // raíz, y en cada escalón se queda con la regla de mayor especificidad, y a
  // igualdad, con la última. La HERENCIA es el propio recorrido.
  const declarado = porHojaInterna(nodo, svg);
  if (declarado !== null) return declarado;

  return null;
}

/** Una regla de la hoja interna que declara `font-size`, ya puntuada. */
type Regla = { selector: string; px: number; peso: number; orden: number };

/** Se parsea una vez por lienzo: 36 lienzos × 332 rótulos si no. */
const reglasPorLienzo = new WeakMap<Element, Regla[]>();

/**
 * La especificidad de un selector plano, en la cuenta de siempre: ids ×100,
 * clases/atributos/pseudos ×10, tipos ×1. No cubre `:not()` ni combinadores
 * raros porque Mermaid no los emite; si algún día los emite, lo que pasa es que
 * dos reglas empatan y gana la última, que es el desempate correcto de CSS.
 */
function especificidad(sel: string): number {
  const ids = (sel.match(/#[\w-]+/g) ?? []).length;
  const clases = (sel.match(/[.[:][\w-]+/g) ?? []).length;
  const tipos = (sel.match(/(^|[\s>+~])[a-zA-Z][\w-]*/g) ?? []).length;
  return ids * 100 + clases * 10 + tipos;
}

/** Las reglas con `font-size` de la hoja que el lienzo trae dentro. */
function reglasDe(svg: Element): Regla[] {
  const cache = reglasPorLienzo.get(svg);
  if (cache) return cache;

  // Fuera los bloques `@…{…}` (los `@keyframes` de Mermaid): sin esto, partir
  // por `}` deja «selectores» como `from` y una llave suelta.
  let hoja = [...svg.querySelectorAll("style")]
    .map((n) => n.textContent ?? "")
    .join("\n");
  hoja = hoja.replace(/@[\w-]+[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, "");

  const reglas: Regla[] = [];
  let orden = 0;
  for (const m of hoja.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const px = m[2]?.match(/font-size:\s*([\d.]+)px/);
    if (!px?.[1]) continue;
    const valor = Number(px[1]);
    for (const sel of (m[1] ?? "").split(",")) {
      const s = sel.trim();
      if (s === "") continue;
      reglas.push({
        selector: s,
        px: valor,
        peso: especificidad(s),
        orden: orden++,
      });
    }
  }
  reglasPorLienzo.set(svg, reglas);
  return reglas;
}

/**
 * El `font-size` que la hoja interna le da a este nodo, heredado como lo hereda
 * un navegador: el primer ancestro (él incluido) al que le aplique una regla.
 */
function porHojaInterna(nodo: Element, svg: Element): number | null {
  const reglas = reglasDe(svg);
  if (reglas.length === 0) return null;

  for (let n: Element | null = nodo; n; n = n.parentElement) {
    let ganadora: Regla | null = null;
    for (const r of reglas) {
      let encaja = false;
      try {
        encaja = n.matches(r.selector);
      } catch {
        continue; // un selector que jsdom no sabe leer no puntúa
      }
      if (!encaja) continue;
      if (
        ganadora === null ||
        r.peso > ganadora.peso ||
        (r.peso === ganadora.peso && r.orden > ganadora.orden)
      ) {
        ganadora = r;
      }
    }
    if (ganadora) return ganadora.px;
    if (n === svg) break;
  }
  return null;
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

function revisarLienzo(variante: string, svg: Element) {
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
          `ni por atributo, ni en la hoja que el propio lienzo trae dentro—, así que no ` +
          `se puede saber a cuántos píxeles se pinta: «${(nodo.textContent ?? "").trim().slice(0, 40)}»`,
      );
      continue;
    }
    const pintado = fs * escala;
    rotulos++;
    if (seDesplaza) rotulosDesplazados++;
    if (pintado < peor.px) {
      peor = {
        px: pintado,
        donde: `${variante} · lienzo ${anchoVb} · ${(nodo.textContent ?? "").trim().slice(0, 30)}`,
      };
    }

    // UN LIENZO QUE SE DESPLAZA YA SE JUZGA COMO LOS DEMÁS (2026-08-29, P55.5).
    // Estuvo medido y no juzgado desde el 2026-08-24, y el motivo era honesto:
    // su ancho no lo decide el hueco sino su propio `min-w`, así que no se le
    // podía pedir que se estrechara y no se sabía si tenía arreglo. **Ese motivo
    // ya no existe**: el artefacto de Emendu pasó de 5,4 a 11,21px ensanchando
    // ese mínimo de 46 a 96rem. Una excepción se retira cuando se retira su
    // causa, no cuando alguien se acuerda.
    //
    // Lo único que sigue siendo distinto es la SALIDA, y por eso se le lista
    // aparte y su mensaje de fallo dice otra cosa: aquí «estrechar el lienzo»
    // no es una opción, y re-renderizar tampoco lo fue (recoloca el grafo).
    if (seDesplaza) {
      const antes = desplazados.get(variante);
      if (!antes || pintado < antes.px) {
        desplazados.set(variante, { px: pintado, vb: anchoVb, ancho, fs });
      }
      if (pintado + 0.05 < SUELO_PX) {
        fallo(
          variante,
          `rótulo a **${pintado.toFixed(1).replace(".", ",")}px** pintados (suelo ${SUELO_PX}): ` +
            `${fs} unidades en un lienzo de ${anchoVb} anclado a ${ancho}px (${motivo}). ` +
            `«${(nodo.textContent ?? "").trim().slice(0, 40)}» — este NO se estrecha ni se ` +
            "re-renderiza: la palanca es su `min-w`.",
        );
      }
      continue;
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
