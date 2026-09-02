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
 * que un aprobado. Publica pares hallados, fotografiados, muestras por par y los
 * que no pudo fotografiar con su motivo.
 *
 * USO:
 *
 *     npm run build && npm start        # en otra terminal
 *     npm run censo:imagen
 */
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import sharp from "sharp";

import { locales, pagePath } from "../../lib/i18n/config";
import { PAGE_SLUGS } from "../../lib/routes";
import { ab } from "../navegador/agent-browser";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const CENSO = "scripts/design-review/contrast-census.js";
const TEMAS = ["light", "dark"] as const;
const LOCALE = locales[0];

/** A qué alturas se mira el nav. El fondo translúcido cambia con lo que pase por
 *  debajo, así que una sola toma mediría una casualidad. */
const ALTURAS = [0, 0.2, 0.4, 0.6, 0.8];

/** En cuántos puntos se muestrea un vídeo, repartidos por su duración. */
const FOTOGRAMAS = 4;

interface Caja {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface ParImagen {
  i: number;
  /** Identidad estable entre tomas: el elemento, no el orden en que salió. */
  clave: string;
  ejemplo: string;
  texto: string;
  color: [number, number, number, number];
  px: number;
  peso: number;
  grande: boolean;
  AA: number;
  AAA: number;
  visible: boolean;
  caja: Caja;
}

interface Ancla {
  ejemplo: string;
  color: [number, number, number, number];
  /** Lo que el censo mide por su camino. El del píxel tiene que dar lo mismo. */
  esperado: number;
  caja: Caja;
}

interface Hallazgo {
  dpr: number;
  viewport: [number, number];
  encontrados: ParImagen[];
  ancla: Ancla | null;
}

/* ── El metro, escrito una vez ──────────────────────────────────────────────
 * Es el mismo de `contrast-census.js`, y tiene que dar lo mismo: los anclajes se
 * comprueban al final contra las cifras publicadas. */

const luminancia = (r: number, g: number, b: number): number => {
  const lin = [r, g, b]
    .map((v) => v / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * lin[0]! + 0.7152 * lin[1]! + 0.0722 * lin[2]!;
};

const round = (n: number) => Math.round(n * 100) / 100;

function ratio(
  fg: [number, number, number],
  bg: [number, number, number],
): number {
  const [hi, lo] = [luminancia(...fg), luminancia(...bg)].sort(
    (a, b) => b - a,
  ) as [number, number];
  return round((hi + 0.05) / (lo + 0.05));
}

/** Alfa del texto compuesta sobre el píxel que tiene debajo. */
const sobre = (
  fg: [number, number, number, number],
  bg: [number, number, number],
): [number, number, number] => [
  fg[0] * fg[3] + bg[0] * (1 - fg[3]),
  fg[1] * fg[3] + bg[1] * (1 - fg[3]),
  fg[2] * fg[3] + bg[2] * (1 - fg[3]),
];

/**
 * El peor píxel de la región: el que menos contrasta con el texto.
 *
 * SE MIRA LA CAJA ENTERA Y NO SOLO DONDE HAY GLIFOS, que es conservador a
 * propósito. Con el texto oculto no se sabe qué píxeles tapaba cada letra, y una
 * cifra optimista aquí sería justo el tipo de aprobado que este repo persigue.
 */
async function peorPixel(
  png: Buffer,
  caja: Caja,
  color: [number, number, number, number],
): Promise<{ ratio: number; pixel: [number, number, number] } | null> {
  const meta = await sharp(png).metadata();
  const x = Math.max(0, Math.min(caja.x, (meta.width ?? 0) - 1));
  const y = Math.max(0, Math.min(caja.y, (meta.height ?? 0) - 1));
  const w = Math.max(1, Math.min(caja.w, (meta.width ?? 0) - x));
  const h = Math.max(1, Math.min(caja.h, (meta.height ?? 0) - y));
  if (w <= 0 || h <= 0) return null;

  const { data, info } = await sharp(png)
    .extract({ left: x, top: y, width: w, height: h })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let peor = Infinity;
  let cual: [number, number, number] = [0, 0, 0];
  const canales = info.channels;

  for (let p = 0; p + canales - 1 < data.length; p += canales) {
    const bg: [number, number, number] = [data[p]!, data[p + 1]!, data[p + 2]!];
    const fg =
      color[3] === 1 ? [color[0], color[1], color[2]] : sobre(color, bg);
    const r = ratio(fg as [number, number, number], bg);
    if (r < peor) {
      peor = r;
      cual = bg;
    }
  }

  return Number.isFinite(peor) ? { ratio: peor, pixel: cual } : null;
}

/* ── El conductor ──────────────────────────────────────────────────────────── */

const guionCenso = readFileSync(CENSO, "utf8");
const carpeta = mkdtempSync(join(tmpdir(), "censo-imagen-"));

/** Dónde dejar los recortes medidos, si se han pedido. */
const RECORTES = process.argv
  .find((a) => a.startsWith("--recortes="))
  ?.split("=")[1];
if (RECORTES) mkdirSync(RECORTES, { recursive: true });

interface Peor {
  ratio: number;
  donde: string;
  /** El píxel culpable, en RGB. Sin él, una cifra rara no se puede diagnosticar. */
  pixel: [number, number, number];
}

interface Medida {
  pagina: string;
  tema: string;
  ejemplo: string;
  texto: string;
  px: number;
  umbralAAA: number;
  umbralAA: number;
  peor: number;
  muestras: number;
  donde: string;
  pixel: [number, number, number];
}

const medidas: Medida[] = [];
const problemas: string[] = [];
let hallados = 0;
let fotografiados = 0;
let sinFotografiar = 0;
let anclasOk = 0;

function captura(): Buffer {
  const destino = join(carpeta, `t-${Date.now()}-${Math.random()}.png`);
  ab(["screenshot", destino]);
  return readFileSync(destino);
}

/**
 * Una toma: oculta los textos —y los `fixed` que tapan—, fotografía y mide cada
 * caja. Se devuelve indexado por CLAVE y no por índice: el mismo elemento cambia
 * de número entre alturas, y atribuir el peor caso de uno a otro sería un
 * hallazgo inventado.
 */
async function toma(
  pares: ParImagen[],
  donde: string,
): Promise<Map<string, Peor>> {
  ab(["eval", "window.ocultarSobreImagen()"]);
  const png = captura();
  ab(["eval", "window.mostrarSobreImagen()"]);

  const salida = new Map<string, Peor>();
  for (const par of pares) {
    if (!par.visible) continue;
    const peor = await peorPixel(png, par.caja, par.color);
    if (!peor) continue;
    salida.set(par.clave, { ratio: peor.ratio, donde, pixel: peor.pixel });

    // `--recortes=<dir>` guarda LO QUE SE MIDIÓ, que es lo que convierte una
    // cifra rara en un diagnóstico. La primera pasada devolvió 1,04:1 sobre un
    // par que se creía holgado, y sin la imagen no había forma de saber si el
    // culpable era el vídeo, un `fixed` por encima o un recorte desplazado.
    if (RECORTES) {
      const nombre = `${par.clave}-${donde}`
        .replace(/[^a-z0-9]+/gi, "_")
        .slice(0, 90);
      await sharp(png)
        .extract({
          left: par.caja.x,
          top: par.caja.y,
          width: par.caja.w,
          height: par.caja.h,
        })
        .toFile(join(RECORTES, `${peor.ratio.toFixed(2)}-${nombre}.png`));
    }
  }
  return salida;
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
    for (const tema of TEMAS) {
      ab(["open", `${BASE}${ruta}`]);
      ab(["set", "media", tema]);
      ab(["eval", "--stdin"], guionCenso);
      ab(["eval", "window.freezeMotion(); 'ok'"]);

      // ¿Hay vídeo? Si lo hay, se muestrea por fotogramas además de por altura.
      const duracion = Number(
        JSON.parse(
          JSON.parse(
            ab([
              "eval",
              "JSON.stringify(String(document.querySelector('video')?.duration ?? 0))",
            ])
              .trim()
              .split("\n")
              .pop()!,
          ) as string,
        ),
      );

      const peores = new Map<string, Peor>();
      // La UNIÓN de lo hallado en todas las alturas, no lo de la última: el nav
      // sobre una foto solo aparece cuando la página se ha desplazado, y el
      // titular del hero solo mientras no lo ha hecho. Quedarse con una sola
      // toma perdería la mitad de los pares sin decirlo.
      const etiquetas = new Map<string, ParImagen>();

      for (const altura of ALTURAS) {
        ab([
          "eval",
          `window.scrollTo(0, document.body.scrollHeight * ${altura}); 'ok'`,
        ]);
        ab(["eval", "new Promise((r) => setTimeout(() => r('ok'), 500))"]);

        const hallazgo = JSON.parse(
          JSON.parse(
            ab(["eval", "JSON.stringify(window.paresSobreImagen())"])
              .trim()
              .split("\n")
              .pop()!,
          ) as string,
        ) as Hallazgo;

        // EL METRO, ANTES DEL HALLAZGO. Se mide el ancla por el camino del píxel
        // y tiene que dar lo que el censo da por su cuenta. Un desalineamiento de
        // la captura o un DPR mal aplicado producirían cifras plausibles sobre la
        // región equivocada, que es la forma de error que no se ve en el informe.
        if (altura === 0 && hallazgo.ancla) {
          ab(["eval", "window.ocultarSobreImagen()"]);
          const png = captura();
          ab(["eval", "window.mostrarSobreImagen()"]);
          const medido = await peorPixel(
            png,
            hallazgo.ancla.caja,
            hallazgo.ancla.color,
          );
          const delta = medido
            ? Math.abs(medido.ratio - hallazgo.ancla.esperado)
            : NaN;
          if (!medido || delta > 0.05) {
            problemas.push(
              `${ruta} · ${tema}: EL METRO NO SE VALIDA — el ancla ` +
                `${hallazgo.ancla.ejemplo} da ` +
                `${medido ? medido.ratio.toFixed(2) : "nada"} por el píxel y ` +
                `${hallazgo.ancla.esperado.toFixed(2)} por el censo`,
            );
          } else {
            anclasOk += 1;
          }
        }

        if (hallazgo.encontrados.length === 0) continue;
        for (const par of hallazgo.encontrados) {
          if (par.visible) etiquetas.set(par.clave, par);
        }

        const puntos: { js: string; donde: string }[] =
          duracion > 0 && altura === 0
            ? Array.from({ length: FOTOGRAMAS }, (_, k) => {
                const t = round((duracion * (k + 1)) / (FOTOGRAMAS + 1));
                return {
                  // SE ESPERA AL `seeked`, no a un reloj. Fotografiar a mitad de
                  // salto da el fotograma anterior o un lienzo en blanco, que es
                  // la versión en vídeo de «leer estilos a mitad de transición»:
                  // la cifra sale perfecta y no describe nada.
                  js:
                    `(() => { const v = document.querySelector('video'); ` +
                    `if (!v) return Promise.resolve('sin video'); v.pause(); ` +
                    `return new Promise((r) => { v.addEventListener('seeked', () => r('ok'), { once: true }); ` +
                    `v.currentTime = ${t}; setTimeout(() => r('sin seeked'), 3000); }); })()`,
                  donde: `scroll ${Math.round(altura * 100)} % · vídeo ${t}s`,
                };
              })
            : [{ js: "'ok'", donde: `scroll ${Math.round(altura * 100)} %` }];

        for (const punto of puntos) {
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

      hallados += etiquetas.size;
      const etiqueta = `${ruta} · ${tema}`;

      for (const par of etiquetas.values()) {
        const peor = peores.get(par.clave);
        if (!peor) {
          sinFotografiar += 1;
          problemas.push(
            `${etiqueta}: ${par.ejemplo} NO se pudo fotografiar en ninguna toma (¿siempre fuera del viewport?)`,
          );
          continue;
        }
        fotografiados += 1;
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
  }

  rmSync(carpeta, { recursive: true, force: true });

  console.log("");

  if (hallados === 0) {
    console.error(
      "censo:imagen — CERO pares hallados, y eso NO es un aprobado: el censo\n" +
        "  manda 16 a `sinMedir`. Si aquí salen cero, lo que falla es el detector.\n",
    );
    process.exit(1);
  }

  const ordenadas = [...medidas].sort(
    (a, b) => a.peor - a.umbralAAA - (b.peor - b.umbralAAA),
  );

  for (const m of ordenadas) {
    const nivel =
      m.peor >= m.umbralAAA ? "AAA" : m.peor >= m.umbralAA ? "AA" : "FALLA AA";
    console.log(
      `  ${nivel.padEnd(9)} ${m.peor.toFixed(2)}:1  (AAA ${m.umbralAAA})  ` +
        `${m.px}px  ${m.pagina} · ${m.tema}  ${m.ejemplo}  ← peor en ${m.donde}, píxel rgb(${m.pixel.join(",")})`,
    );
  }

  const bajoAA = medidas.filter((m) => m.peor < m.umbralAA);
  const bajoAAA = medidas.filter(
    (m) => m.peor >= m.umbralAA && m.peor < m.umbralAAA,
  );

  console.log(
    `\ncenso:imagen — ${hallados} pares hallados · ${fotografiados} medidos sobre el píxel pintado · ` +
      `${sinFotografiar} sin fotografiar\n` +
      `  ${bajoAA.length} por debajo de AA · ${bajoAAA.length} entre AA y AAA.\n` +
      `  Metro validado contra el ancla en ${anclasOk} de las ` +
      `${paginas.length * TEMAS.length} corridas` +
      (filtro
        ? `, PASADA PARCIAL (--pagina=${filtro}): esto no es un veredicto.`
        : "."),
  );

  for (const p of problemas) console.error(`  · ${p}`);

  if (bajoAA.length) process.exit(1);
}

void main().catch((e: unknown) => {
  rmSync(carpeta, { recursive: true, force: true });
  console.error(`\n${e instanceof Error ? e.message : String(e)}\n`);
  process.exit(1);
});
