/**
 * El censo de contraste de TODO el sitio — `npm run censo`.
 *
 * QUÉ HACE. Recorre las páginas del registro (`PAGE_SLUGS`, D72) × los dos temas
 * sobre el sitio SERVIDO, inyecta `scripts/design-review/contrast-census.js` en
 * cada una y falla si aparece un solo par de TEXTO por debajo de AAA **o un solo
 * CONTORNO de control por debajo del 3:1 de WCAG 1.4.11**.
 *
 * Lo segundo se añadió el 2026-08-23 y llegaba tarde: el contorno de todo control
 * neutro del sitio llevaba en 1,21:1 desde V1, y no lo veía nadie porque
 * `check:marco` delega el contraste aquí, aquí se medía texto, y **axe no
 * implementa 1.4.11**. Tres eslabones, ninguno mintiendo, y un agujero al final.
 * El porqué largo está en el segundo pase de `contrast-census.js`.
 *
 * POR QUÉ EXISTE, y es una lección repetida de este repo: la pasada completa se
 * hacía **a mano**, conduciendo el navegador llamada a llamada, y por eso se
 * hizo entera dos veces en seis meses. En medio, el sitio ganó una página —la
 * decimotercera, el propio artículo— y el copy siguió publicando «AAA en las
 * doce páginas» sin que nada lo notara. *Que el trabajo deje algo detrás es más
 * barato que volver a hacerlo*, que es exactamente lo que dice de sí mismo el
 * script que este conduce.
 *
 * Y la lista de páginas NO se escribe aquí: sale de `PAGE_SLUGS`. Añadir una
 * página la mete en el censo sin que nadie se acuerde, igual que ya la mete en
 * el sitemap, en `gate:html` y en `/llms.txt`.
 *
 * NO ESTÁ EN CI, y es deliberado, por la misma razón que `npm run psi`: necesita
 * un navegador de verdad y un servidor delante. La mitad de los pares de este
 * sitio no existen hasta que el navegador COMPONE un `color-mix` sobre la
 * superficie de debajo, así que no hay forma estática de verlos. Se dispara al
 * cerrar una pasada de accesibilidad, y su fecha es `LAST_A11Y_REVIEW`.
 *
 * USO:
 *
 *     npm run build && npm start        # en otra terminal
 *     npm run censo
 *
 * AFIRMA CUÁNTO HA MIRADO, con guarda de cero en las cuatro dimensiones que ya han
 * fallado en silencio en este proyecto (`BRAND.md` §Cómo medir sin equivocarse):
 *
 *   1. **El metro**, contra los anclajes SIN cian —13,79 claro / 15,32 oscuro—,
 *      que no dependen del recorte de gamut y tienen que salir exactos.
 *   2. **Las reglas `:hover` indexadas.** Cero reglas es el fallo que tuvo el
 *      censo dos veces, y su síntoma era un aprobado.
 *   3. **El tema pintado**, contra el que se pidió. Un `set media` que no llega
 *      mediría la misma página dos veces y lo llamaría cobertura.
 *   4. **Los contornos de control indexados.** Toda página tiene al menos el
 *      enlace de salto, que dibuja caja; un cero aquí es el pase de 1.4.11 sin
 *      correr, no un aprobado.
 *
 * LO QUE NO CUBRE, dicho para que no se dé por cubierto:
 *
 * - **El texto sobre imagen.** El medidor no puede componer una foto, así que
 *   esos pares salen en `sinMedir` y hay que mirarlos aparte: se mide el píxel
 *   pintado bajo la caja del texto. Aquí se CUENTAN y se listan, no se juzgan.
 * - **Lo que está detrás de una interacción**: pestañas sin abrir, diálogos sin
 *   invocar. El censo ve el DOM que hay, no el que podría haber.
 * - **Un solo viewport.** El censo mide colores, que no dependen del ancho; el
 *   pliegue y el objetivo táctil son de `viewport-verifier` (D52).
 */

import { locales, pagePath } from "../lib/i18n/config";
import { PAGE_SLUGS } from "../lib/routes";
import { juzgaCorrida, mideCorrida } from "./censo/corrida";
import { HUELLA_PATH, huella, sellar } from "./censo/huella";
import { guionDelCenso } from "./design-review/guion";
import {
  compara,
  escribeInventario,
  INVENTARIO_PATH,
  leeInventario,
  type Corrida,
} from "./censo/inventario";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const TEMAS = ["light", "dark"] as const;

/** El locale que se mide. El censo mira COLORES, y el color no se traduce: medir
 *  las 26 variantes doblaría el tiempo para repetir cada par. El EN comparte
 *  componentes, y lo que sí cambia con el idioma —longitudes, saltos de línea—
 *  lo ve `viewport-verifier`, no esto. */
const LOCALE = locales[0];
/* El conductor de `agent-browser` vive en `scripts/navegador/agent-browser.ts`
 * desde 2026-08-28 (P50.77): la segunda pasada que necesita navegador —la del
 * pliegue— lo quería entero, y dos conductores se arreglan por separado el día
 * que el binario cambie de sitio. */

const problemas: string[] = [];
const fallo = (msg: string) => problemas.push(msg);

const guionCenso = guionDelCenso();

/**
 * `--pagina=` acota la pasada mientras se valida el propio metro — por ejemplo,
 * para comprobar que la composición por opacidad caza el caso malo sin gastar las
 * 28 corridas. **Una pasada parcial NO sella ni escribe inventario**: un sello
 * sacado de dos páginas se lee igual que uno de catorce y es falso, que es la
 * misma regla que ya aplica `psi -- --registro`.
 */
const FILTRO = process.argv
  .find((a) => a.startsWith("--pagina="))
  ?.split("=")[1];
const PAGINAS = FILTRO
  ? PAGE_SLUGS.filter((s) => String(s).includes(FILTRO))
  : PAGE_SLUGS;

/**
 * La salida del inventario, y **hace falta que exista** (2026-09-02, el mismo día
 * que el inventario).
 *
 * La huella cubre tokens, superficies y animaciones. Un color que NO es token —el
 * velo del nav es un `color-mix` escrito en el propio componente— puede cambiar de
 * verdad sin que la huella se entere, y entonces el diff ve pares desaparecer con
 * la huella intacta y suspende con razón aparente. Sin esta bandera, el primer
 * cambio legítimo de ese tipo dejaría el censo bloqueado y sin forma de aceptarlo:
 * un guardián que no se puede satisfacer se acaba desactivando entero, que es peor
 * que no tenerlo.
 *
 * Se pide a mano y se dice en voz alta en la salida, para que aceptar sea una
 * decisión visible y no el estado por defecto.
 */
const ACEPTA_INVENTARIO = process.argv.includes("--inventario-nuevo");

const TOTAL_CORRIDAS = PAGINAS.length * TEMAS.length;

let corridas = 0;
let paresTotales = 0;
let sinMedirTotales = 0;
let contornosTotales = 0;

/** El inventario de esta pasada: qué pares se midieron, no cuántos (P72.15). */
const inventario: Corrida[] = [];

console.log(
  `censo — ${PAGE_SLUGS.length} páginas × ${TEMAS.length} temas sobre ${BASE}\n`,
);

for (const slug of PAGINAS) {
  const ruta = pagePath(LOCALE, slug);
  for (const tema of TEMAS) {
    const c = mideCorrida(`${BASE}${ruta}`, tema, guionCenso);

    corridas++;
    inventario.push({
      pagina: ruta,
      tema,
      claves: c.censo.map((p) => p.clave).sort(),
    });
    paresTotales += c.pares;
    sinMedirTotales += c.sinMedir.length;
    contornosTotales += Number(c.contornos.match(/^\d+/)?.[0] ?? 0);

    const etiqueta = `${ruta} · ${tema}`;
    for (const p of juzgaCorrida(etiqueta, tema, c)) fallo(p);

    // CON EL CONTADOR DELANTE (P50.78, 2026-08-28). La línea por corrida ya
    // estaba; lo que faltaba era saber **por dónde va**. Con 28 corridas de un par
    // de minutos, «14/28» es la diferencia entre esperar y matar el proceso, y es
    // justo lo que no se podía decir el día que el censo se colgó en silencio.
    console.log(
      `  [${String(corridas).padStart(2)}/${TOTAL_CORRIDAS}] ` +
        `${etiqueta.padEnd(34)} ${String(c.pares).padStart(3)} pares · ` +
        `${c.sinMedir.length} sobre imagen · ${c.reveals} · ${c.opacidad} · metro ${c.metro}`,
    );

    // Y SE NOMBRAN, no solo se cuentan (P68.587, 2026-08-24). Un recuento al pie
    // —«16 pares sobre imagen quedan fuera del veredicto»— no es accionable: no
    // dice cuáles, así que nadie los mira nunca y la salvedad se vuelve
    // permanente. Con el nombre delante, la lista de lo que falta por medir a
    // mano es una lista, no una cifra.
    for (const p of c.sinMedir)
      console.log(`      ↳ sin medir · ${p.ejemplo} · ${p.px}px`);
  }
}

console.log("");

if (corridas === 0 || paresTotales === 0 || contornosTotales === 0)
  fallo(
    `el censo no ha medido nada (corridas: ${corridas}, pares: ${paresTotales}, ` +
      `contornos: ${contornosTotales}). Un metro que devuelve lista vacía parece un aprobado.`,
  );

/* --- El inventario: DE QUÉ CONJUNTO habla esta pasada (P72.15) -------------
 *
 * Se compara par a par con la anterior y el veredicto es ASIMÉTRICO. Uno que
 * APARECE es cobertura nueva y puede venir de un cambio de contenido legítimo:
 * se informa. Uno que DESAPARECE con la huella intacta es el metro viendo menos
 * —el 414 → 391 del 2026-08-27—, y eso sí suspende: un par que no está en la
 * lista no está aprobado, está sin mirar.
 */
const inventarioAnterior = leeInventario();
const huellaHoy = huella();
const diffs = inventarioAnterior
  ? compara(inventarioAnterior, {
      fecha: "",
      huella: huellaHoy,
      total: paresTotales,
      corridas: inventario,
    })
  : [];

if (inventarioAnterior && diffs.length) {
  const mismaHuella = inventarioAnterior.huella === huellaHoy;
  console.log(
    `censo — el conjunto medido ha cambiado en ${diffs.length} corrida(s) ` +
      `desde el inventario de ${inventarioAnterior.fecha} ` +
      `(${inventarioAnterior.total} pares → ${paresTotales}):\n`,
  );
  for (const d of diffs) {
    for (const k of d.salieron) console.log(`  − ${d.corrida}  ${k}`);
    for (const k of d.entraron) console.log(`  + ${d.corrida}  ${k}`);
    // Ni «−» ni «+»: el mismo par con el otro umbral. Sale con su propio signo
    // para que no se confunda con el diff legítimo del cambio que se esté
    // sellando, que es lo que el 2026-09-04 costó varias mediciones descartar.
    for (const b of d.bascularon)
      console.log(`  ~ ${d.corrida}  ${b.antes}  →  ${b.ahora}`);
  }
  console.log("");

  const basculados = diffs.reduce((n, d) => n + d.bascularon.length, 0);
  if (basculados)
    console.log(
      `  ~ ${basculados} par(es) han cambiado de bucket de tamaño sin moverse ` +
        `(la frontera de «texto grande» de WCAG, a 24px). No es una desaparición: ` +
        `su gemelo está en la corrida nueva con los mismos colores.\n`,
    );

  const perdidos = diffs.reduce((n, d) => n + d.salieron.length, 0);
  if (perdidos && mismaHuella && !ACEPTA_INVENTARIO) {
    fallo(
      `${perdidos} par(es) han DESAPARECIDO del censo con la huella intacta. ` +
        `Eso no es un aprobado: es el metro viendo menos que la vez anterior. ` +
        `Los nombra la lista de arriba, con «−» delante. Si el cambio es LEGÍTIMO ` +
        `—se ha tocado un color que no es token, y por eso la huella no se entera—, ` +
        `se vuelve a lanzar con \`--inventario-nuevo\`.`,
    );
  }
  if (perdidos && ACEPTA_INVENTARIO) {
    console.log(
      `  ${perdidos} par(es) desaparecidos ACEPTADOS a mano (--inventario-nuevo).\n` +
        "  El inventario nuevo pasa a ser la referencia.\n",
    );
  }
}

if (problemas.length) {
  console.error(`censo — ${problemas.length} problema(s):\n`);
  for (const p of problemas) console.error(`  · ${p}`);
  console.error(
    `\n  Recuerda: los pares «sobre imagen» NO salen aquí — el medidor se abstiene\n` +
      `  y hay que medirlos aparte, sobre el píxel pintado bajo la caja del texto.`,
  );
  process.exit(1);
}

// La pasada deja algo detrás, que es lo que la separa de un hábito: el sello de
// lo que había cuando se midió. A partir de aquí, un token de color, una
// superficie o una animación nuevos ponen `check:palette` en rojo NOMBRÁNDOLOS,
// sin necesitar navegador — que es la mitad de la condición de re-medir de la
// DoD que hasta ahora había que acordarse de leer (D90).
const fecha = new Date().toISOString().slice(0, 10);

// UNA PASADA PARCIAL NO SELLA NI ESCRIBE INVENTARIO. Un sello sacado de dos
// páginas se lee exactamente igual que uno de catorce y es falso; y un inventario
// parcial haría que la pasada siguiente viera desaparecer doce corridas enteras.
// Misma regla que `psi -- --registro`, y por el mismo motivo.
if (FILTRO) {
  console.log(
    `censo — PASADA PARCIAL (--pagina=${FILTRO}): ${corridas} corridas, ` +
      `${paresTotales} pares. No se sella ni se escribe inventario, y esto NO es un veredicto.\n`,
  );
  process.exit(0);
}

const sello = sellar(fecha);

// Y el conjunto, no solo el total: es lo que hace que la pasada siguiente pueda
// decir QUÉ par entró o salió en vez de restar dos números (P72.15).
escribeInventario({
  fecha,
  huella: huellaHoy,
  total: paresTotales,
  corridas: inventario,
});

console.log(
  `censo ✓ — ${corridas} corridas (${PAGE_SLUGS.length} páginas × ${TEMAS.length} temas), ` +
    `${paresTotales} pares de texto y ${contornosTotales} contornos de control medidos, ` +
    `metro validado en las ${corridas}.\n` +
    `Cero bajo AA, cero bajo AAA y cero por debajo del 3:1 de WCAG 1.4.11. ` +
    `${sinMedirTotales} pares sobre imagen quedan fuera del veredicto y los mide ` +
    `\`npm run censo:imagen\`.\n\n` +
    `Sellado en ${HUELLA_PATH} — ${sello.resumen}.\n` +
    `Inventario en ${INVENTARIO_PATH} — ${paresTotales} pares en ${corridas} corridas.\n` +
    `Si esta pasada es la buena, actualiza LAST_A11Y_REVIEW en lib/design-values.ts.`,
);
