/**
 * Los pares que el censo NO puede juzgar — `npm run censo:imagen`.
 *
 * QUÉ MIDE, y por qué hace falta otro comando. `npm run censo` manda a `sinMedir`
 * todo texto que cae sobre una foto o un vídeo, y hace bien: compone velos con
 * `color-mix` y eso funciona mientras haya **un** color detrás del texto. Sobre
 * una imagen hay tantos como píxeles, el requisito de WCAG es contra el **peor**
 * de ellos, y con `backdrop-blur` de por medio el color efectivo ni siquiera está
 * en el DOM — lo calcula el compositor. No se puede rasterizar desde JavaScript lo
 * que hay detrás de un elemento.
 *
 * EL MÉTODO ES EL QUE YA ESTABA ESCRITO en `BRAND.md` §Cómo medir, punto 3: se
 * mide **sobre el píxel pintado**. En concreto: se oculta el texto sin quitarle la
 * caja (`visibility: hidden`), se fotografía, se recorta la región de esa caja y se
 * busca el píxel que peor contrasta con el color del texto. La cifra que sale es el
 * PEOR caso de la región, que es lo que pide 1.4.3.
 *
 * Y LOS DOS CASOS DE ESTE SITIO PIDEN COSAS DISTINTAS:
 *
 *   · **El hero de Sobre mí** es un vídeo. Una foto de un fotograma no dice nada
 *     del resto, así que se muestrea en varios `currentTime` y se publica el peor.
 *   · **El nav** es `sticky`, translúcido y con `backdrop-blur`: su fondo depende
 *     de por dónde vaya el scroll, así que no hay una cifra sino un rango. Se
 *     muestrea a varias alturas de scroll y se publica el peor.
 *
 * AFIRMA CUÁNTO HA MIRADO, que en este archivo importa más que en ningún otro: si
 * la lista sale vacía porque el selector no encontró nada, el informe se lee igual
 * que un aprobado. Publica pares vistos.hallados, vistos.fotografiados, muestras por par y los
 * que no pudo fotografiar con su motivo.
 *
 * USO:
 *
 *     npm run build && npm start        # en otra terminal
 *     npm run censo:imagen
 */
import { rmSync } from "node:fs";

import { locales, pagePath } from "../../lib/i18n/config";
import { PAGE_SLUGS } from "../../lib/routes";
import { guionDelCenso } from "../design-review/guion";
import { ab, evalJSON } from "../navegador/agent-browser";
import { carpeta, captura, toma } from "./camara";
import { informe, medidas, problemas, vistos } from "./informe";
import { peorPixel, round } from "./pixel";
import { type Hallazgo, type ParImagen, type Peor } from "./tipos";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const TEMAS = ["light", "dark"] as const;
const LOCALE = locales[0];

/**
 * A qué alturas se mira el nav. El fondo translúcido cambia con lo que pase por
 * debajo, así que una sola toma mediría una casualidad.
 *
 * EL 50 % ESTÁ PORQUE ES DONDE MIDE `npm run censo`. Sin él, esta pasada podría
 * encontrar menos pares que la pasada que dice cuáles hay que medir — y un metro
 * que ve menos que su propia lista de deberes se lee como un aprobado.
 */
const ALTURAS = [0, 0.2, 0.4, 0.5, 0.6, 0.8];

/** En cuántos puntos se muestrea un vídeo, repartidos por su duración. */
const FOTOGRAMAS = 4;

const guionCenso = guionDelCenso();

/** La duración del vídeo de la página, o 0 si no hay ninguno. */
const duracionDelVideo = () =>
  Number(
    evalJSON<string>("String(document.querySelector('video')?.duration ?? 0)"),
  );

/**
 * EL METRO, ANTES DEL HALLAZGO. Se mide el ancla por el camino del píxel y tiene
 * que dar lo que el censo da por su cuenta. Un desalineamiento de la captura o un
 * DPR mal aplicado producirían cifras plausibles sobre la región equivocada, que
 * es la forma de error que no se ve en el informe.
 */
async function validaElMetro(
  ancla: NonNullable<Hallazgo["ancla"]>,
  etiqueta: string,
): Promise<void> {
  ab(["eval", "window.ocultarSobreImagen()"]);
  const png = captura();
  ab(["eval", "window.mostrarSobreImagen()"]);
  const medido = await peorPixel(png, ancla.caja, ancla.color);
  const delta = medido ? Math.abs(medido.ratio - ancla.esperado) : NaN;
  if (!medido || delta > 0.05) {
    problemas.push(
      `${etiqueta}: EL METRO NO SE VALIDA — el ancla ` +
        `${ancla.ejemplo} da ` +
        `${medido ? medido.ratio.toFixed(2) : "nada"} por el píxel y ` +
        `${ancla.esperado.toFixed(2)} por el censo`,
    );
    return;
  }
  vistos.anclasOk += 1;
}

/**
 * Dónde se dispara la cámara en esta altura. Con vídeo y al principio de la
 * página son varios fotogramas; en cualquier otro caso, una sola toma.
 *
 * SE ESPERA AL `seeked`, no a un reloj. Fotografiar a mitad de salto da el
 * fotograma anterior o un lienzo en blanco, que es la versión en vídeo de «leer
 * estilos a mitad de transición»: la cifra sale perfecta y no describe nada.
 */
function puntosDeMuestreo(
  duracion: number,
  altura: number,
): { js: string; donde: string }[] {
  const scroll = `scroll ${Math.round(altura * 100)} %`;
  if (duracion === 0 || altura !== 0) return [{ js: "'ok'", donde: scroll }];
  return Array.from({ length: FOTOGRAMAS }, (_, k) => {
    const t = round((duracion * (k + 1)) / (FOTOGRAMAS + 1));
    return {
      js:
        `(() => { const v = document.querySelector('video'); ` +
        `if (!v) return Promise.resolve('sin video'); v.pause(); ` +
        `return new Promise((r) => { v.addEventListener('seeked', () => r('ok'), { once: true }); ` +
        `v.currentTime = ${t}; setTimeout(() => r('sin seeked'), 3000); }); })()`,
      donde: `${scroll} · vídeo ${t}s`,
    };
  });
}

/**
 * Una altura de la página: se desplaza, se pregunta al censo qué hay sobre foto y
 * se fotografía en cada punto de muestreo. Escribe en `peores` y en `etiquetas`,
 * que son la memoria de la variante entera.
 */
async function mideAltura(
  altura: number,
  duracion: number,
  etiqueta: string,
  peores: Map<string, Peor>,
  etiquetas: Map<string, ParImagen>,
): Promise<void> {
  ab([
    "eval",
    `window.scrollTo(0, document.body.scrollHeight * ${altura}); 'ok'`,
  ]);
  ab(["eval", "new Promise((r) => setTimeout(() => r('ok'), 500))"]);

  const hallazgo = evalJSON<Hallazgo>("window.paresSobreImagen()");

  if (altura === 0 && hallazgo.ancla) {
    await validaElMetro(hallazgo.ancla, etiqueta);
  }

  if (hallazgo.encontrados.length === 0) return;
  for (const par of hallazgo.encontrados) {
    if (par.visible) etiquetas.set(par.clave, par);
  }

  for (const punto of puntosDeMuestreo(duracion, altura)) {
    ab(["eval", punto.js]);
    if (duracion > 0) {
      ab(["eval", "new Promise((r) => setTimeout(() => r('ok'), 400))"]);
    }
    const resultado = await toma(hallazgo.encontrados, punto.donde);
    for (const [i, v] of resultado) {
      const previo = peores.get(i);
      if (!previo || v.ratio < previo.ratio) peores.set(i, v);
    }
  }
}

/**
 * Una variante servida, con su tema puesto. Recorre las alturas y se queda con el
 * PEOR píxel de cada par: la unión de lo hallado en todas, no lo de la última — el
 * nav sobre una foto solo aparece cuando la página se ha desplazado, y el titular
 * del hero solo mientras no lo ha hecho. Quedarse con una sola toma perdería la
 * mitad de los pares sin decirlo.
 */
async function mideVariante(
  ruta: string,
  tema: (typeof TEMAS)[number],
): Promise<void> {
  ab(["open", `${BASE}${ruta}`]);
  ab(["set", "media", tema]);
  ab(["eval", "--stdin"], guionCenso);
  ab(["eval", "window.freezeMotion(); 'ok'"]);

  // ¿Hay vídeo? Si lo hay, se muestrea por fotogramas además de por altura.
  const duracion = duracionDelVideo();
  const etiqueta = `${ruta} · ${tema}`;
  const peores = new Map<string, Peor>();
  const etiquetas = new Map<string, ParImagen>();

  for (const altura of ALTURAS) {
    await mideAltura(altura, duracion, etiqueta, peores, etiquetas);
  }

  vistos.hallados += etiquetas.size;

  for (const par of etiquetas.values()) {
    const peor = peores.get(par.clave);
    if (!peor) {
      vistos.sinFotografiar += 1;
      problemas.push(
        `${etiqueta}: ${par.ejemplo} NO se pudo fotografiar en ninguna toma (¿siempre fuera del viewport?)`,
      );
      continue;
    }
    vistos.fotografiados += 1;
    medidas.push({
      pagina: ruta,
      tema,
      ejemplo: par.ejemplo,
      texto: par.texto,
      px: par.px,
      umbralAAA: par.AAA,
      umbralAA: par.AA,
      peor: peor.ratio,
      muestras: ALTURAS.length + (duracion > 0 ? FOTOGRAMAS : 0),
      donde: peor.donde,
      pixel: peor.pixel,
    });
  }

  if (etiquetas.size) {
    console.log(
      `  ${etiqueta.padEnd(34)} ${etiquetas.size} par(es) sobre imagen`,
    );
  }
}
async function main() {
  console.log(
    `censo:imagen — ${PAGE_SLUGS.length} páginas × ${TEMAS.length} temas sobre ${BASE}\n`,
  );

  // `--pagina=` acota la pasada a un slug mientras se depura. NO afecta al
  // veredicto de una pasada completa: si se usa, el resumen lo dice.
  const filtro = process.argv
    .find((a) => a.startsWith("--pagina="))
    ?.split("=")[1];
  const paginas = filtro
    ? PAGE_SLUGS.filter((s) => String(s).includes(filtro))
    : PAGE_SLUGS;

  for (const slug of paginas) {
    const ruta = pagePath(LOCALE, slug);
    for (const tema of TEMAS) await mideVariante(ruta, tema);
  }

  rmSync(carpeta, { recursive: true, force: true });

  console.log("");

  informe(paginas.length * TEMAS.length, filtro);
}
void main().catch((e: unknown) => {
  rmSync(carpeta, { recursive: true, force: true });
  console.error(`\n${e instanceof Error ? e.message : String(e)}\n`);
  process.exit(1);
});
