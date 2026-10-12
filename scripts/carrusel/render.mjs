/**
 * Renderiza un carrusel de LinkedIn — `npm run carrusel -- <ruta a slides.mjs>`.
 *
 * Saca un PNG por lámina y el PDF que LinkedIn pide para publicar un carrusel
 * (allí se sube como «documento», no como imágenes: subir los PNG sueltos da una
 * galería de fotos, que es otra cosa y rinde peor).
 *
 * QUÉ VIVE AQUÍ Y QUÉ NO (2026-09-01, P68.655). Aquí están la PLANTILLA y el
 * RENDER, que son sistema de marca: los tokens del tema oscuro, las dos
 * tipografías y el monograma con split. El CONTENIDO de cada pieza —su
 * `slides.mjs`— vive con la pieza, fuera del repo, igual que su artículo. Por eso
 * el comando recibe una ruta en vez de tener las piezas dentro.
 *
 * ANTES ESTABA ENTERO FUERA DEL REPO, con una copia de la plantilla por pieza. Es
 * decir: el aspecto de la marca no estaba en git y se propagaba copiando. Las tres
 * copias eran idénticas el día de la mudanza, que es la única razón por la que
 * salió gratis.
 *
 * EL GUARDIÁN MIRA TRES COSAS, Y LAS DOS ÚLTIMAS SON NUEVAS. La versión anterior
 * solo comparaba `scrollHeight` con `clientHeight` del bloque, así que dio «sin
 * desbordes en 10 láminas» dos veces sobre PNG rotos:
 *
 *   1. El bloque desborda su propia caja (lo que ya miraba).
 *   2. EL BLOQUE EMPUJA LA FIRMA FUERA DEL PIE. Pasó con una tabla de seis filas:
 *      el bloque no desbordaba, crecía, y el pie se salía de la lámina, que tiene
 *      `overflow:hidden`. Sin error y con el PNG cortado por abajo.
 *   3. DOS CELDAS SE PISAN EN HORIZONTAL. Las columnas 2 y 3 de `tabla` miden
 *      140px: dos cabeceras largas se solapan y el alto no se entera.
 *
 * Y AFIRMA CUÁNTO HA MIRADO, porque un metro que devuelve lista vacía parece un
 * aprobado, y este proyecto se lo ha encontrado ya seis veces.
 *
 * SU CASO MALO ESTÁ AL LADO Y SE DISPARA A MANO, porque este generador no es un
 * gate de CI (necesita navegador y la ruta de una pieza) y por eso no entra en
 * `check:guardianes`:
 *
 *     npm run carrusel -- scripts/carrusel/caso-malo.mjs   → tiene que salir 1
 *
 * Con las dos láminas que en su día dieron verde estando rotas. Si alguna vez sale
 * 0, el guardián se ha quedado ciego.
 *
 * AUN ASÍ SE MIRAN LOS PNG. El guardián cubre los tres modos de fallo conocidos,
 * no «que la lámina esté bien».
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import puppeteer from "puppeteer";

import { paletteHex } from "../../lib/design-values";

import { construirHtml, DIMENSIONES } from "./plantilla.mjs";

// `node render.mjs … | head` mataba el render por SIGPIPE tras la primera lámina
// y dejaba las otras nueve viejas, con el comando en verde. Es un fallo de
// operación, pero se arregla aquí: el proceso no se muere por un tubo cerrado.
process.stdout.on("error", (e) => {
  if (e.code !== "EPIPE") throw e;
});

const rutaSlides = process.argv[2];
if (!rutaSlides) {
  console.error(
    "\nFalta la ruta del contenido.\n\n" +
      "  npm run carrusel -- <ruta a slides.mjs> [<carpeta de salida>]\n\n" +
      "El `slides.mjs` exporta `meta`, `laminas` y `distribucion` (array vacío si\n" +
      "la pieza no lleva gráfico de barras: la plantilla lo importa siempre).\n",
  );
  process.exit(1);
}

const SLIDES = resolve(rutaSlides);
// Por defecto la salida es la carpeta de la pieza. Las piezas guardan su
// contenido en `<pieza>/fuente/slides.mjs`, así que si el archivo cuelga de una
// carpeta llamada `fuente` se sube un nivel; si no, se queda donde está.
const dirSlides = dirname(SLIDES);
const SALIDA = resolve(
  process.argv[3] ??
    (basename(dirSlides) === "fuente" ? dirname(dirSlides) : dirSlides),
);

const { laminas, distribucion, meta } = await import(
  pathToFileURL(SLIDES).href
);

const html = construirHtml({ laminas, distribucion, meta });
writeFileSync(join(dirSlides, "carrusel.html"), html, "utf8");

const navegador = await puppeteer.launch({ headless: "new" });
const pagina = await navegador.newPage();
await pagina.setViewport({
  width: DIMENSIONES.W,
  height: DIMENSIONES.H,
  deviceScaleFactor: 2,
});
await pagina.setContent(html, { waitUntil: "load" });
await pagina.evaluate(() => document.fonts.ready);

const revision = await pagina.evaluate(() => {
  // La caja del TEXTO, no la de la celda. Una celda de `grid-template-columns`
  // fija mide sus 140px pase lo que pase: el texto que no cabe se pinta fuera
  // sin mover la caja, y como va en `text-align:right` se derrama hacia la
  // IZQUIERDA, encima de la columna anterior. `scrollWidth` tampoco lo ve,
  // porque ignora el desbordamiento por el lado de inicio.
  //
  // Se usan las cajas por LÍNEA y no la envolvente: un texto que parte en dos
  // líneas dentro de su celda es correcto, y su envolvente daría un falso
  // positivo con la anchura entera de la línea.
  const cajaTexto = (el) => {
    const rango = document.createRange();
    rango.selectNodeContents(el);
    const cajas = [...rango.getClientRects()].filter((c) => c.width > 0);
    if (!cajas.length) return null;
    return {
      izq: Math.min(...cajas.map((c) => c.left)),
      der: Math.max(...cajas.map((c) => c.right)),
    };
  };

  const laminas = [...document.querySelectorAll(".lamina")];
  const fallos = [];
  let filasMiradas = 0;
  let paresMirados = 0;

  for (const s of laminas) {
    const bloque = s.querySelector(".bloque");
    const pie = s.querySelector(".pie");
    const cajaLamina = s.getBoundingClientRect();
    const relleno = parseFloat(getComputedStyle(s).paddingBottom);

    // 1 · El bloque desborda su propia caja.
    const desborde = bloque.scrollHeight - bloque.clientHeight;
    if (desborde > 0) fallos.push(`${s.id}: el bloque desborda +${desborde}px`);

    // 2 · El bloque empuja el pie fuera de la lámina.
    const sobra = Math.round(
      pie.getBoundingClientRect().bottom - (cajaLamina.bottom - relleno),
    );
    if (sobra > 1) fallos.push(`${s.id}: la firma se sale del pie +${sobra}px`);

    // 3 · Dos celdas se pisan en horizontal, dentro de la misma fila.
    for (const fila of s.querySelectorAll(".fila")) {
      filasMiradas++;
      const textos = [...fila.children].map(cajaTexto);
      for (let i = 0; i < textos.length - 1; i++) {
        if (!textos[i] || !textos[i + 1]) continue;
        paresMirados++;
        const solape = Math.round(textos[i].der - textos[i + 1].izq);
        if (solape > 1) {
          fallos.push(`${s.id}: dos celdas se pisan ${solape}px`);
          break;
        }
      }
    }
  }

  return {
    fallos,
    laminas: laminas.length,
    filasMiradas,
    paresMirados,
  };
});

console.log(
  `Revisadas ${revision.laminas} láminas: alto del bloque y pie en las ${revision.laminas}, ` +
    `y ${revision.paresMirados} par(es) de celdas contiguas en ${revision.filasMiradas} fila(s).`,
);
if (revision.fallos.length) {
  console.error(`\n${revision.fallos.length} problema(s):`);
  for (const f of revision.fallos) console.error(`  · ${f}`);
  console.error(
    "\nNo se ha exportado nada: los PNG anteriores siguen intactos.\n",
  );
  await navegador.close();
  process.exit(1);
}

mkdirSync(join(SALIDA, "carrusel"), { recursive: true });

for (let i = 0; i < laminas.length; i++) {
  const n = String(i + 1).padStart(2, "0");
  const el = await pagina.$(`#l${n}`);
  await el.screenshot({
    path: join(SALIDA, "carrusel", `${meta.slug}-${n}.png`),
  });
  console.log(`  ${meta.slug}-${n}.png`);
}

// El PDF va a 1 lámina por página, al tamaño exacto en px (LinkedIn lo escala).
await pagina.addStyleTag({
  content: `@page{size:${DIMENSIONES.W}px ${DIMENSIONES.H}px;margin:0}
            body{background:${paletteHex("dark").background}}
            .lamina{break-after:page;page-break-after:always}`,
});
await pagina.pdf({
  path: join(SALIDA, `${meta.slug}-carrusel.pdf`),
  width: `${DIMENSIONES.W}px`,
  height: `${DIMENSIONES.H}px`,
  printBackground: true,
  pageRanges: `1-${laminas.length}`,
});
console.log(`  ${meta.slug}-carrusel.pdf`);

await navegador.close();
console.log(`\n${laminas.length} láminas en ${SALIDA}`);
