/**
 * ¿El kit de marca dice lo que hay en disco? — `npm run check:kit`.
 *
 * QUÉ PROTEGE. `lib/logo-kit.ts` declara dos cosas: lo que la página ofrece suelto o
 * referencia, y lo que viaja dentro del ZIP sin tener tarjeta propia. El ZIP en sí no
 * puede desincronizarse (se genera en el build leyendo el directorio, ver
 * `app/api/kit/route.ts`), pero el REGISTRO sí, y de tres maneras que ningún tipo ve:
 *
 *   1. Una ruta declarada cuyo archivo ya no está. La página serviría un 404 desde un
 *      chip que se ve perfectamente bien.
 *   2. Un archivo en disco que no está en ninguna de las dos listas. Es exactamente
 *      cómo aparecieron los diez huérfanos que P70.27 encontró: nadie los metió a
 *      propósito, simplemente nunca hubo nada que los contara. Ahora entrar sin
 *      declararse es rojo.
 *   3. Una pieza declarada a la que le falta alguno de sus PNG o su segunda tinta. La
 *      tarjeta prometería «en el kit: PNG de 1024, 512 y 256 px» y el kit traería dos.
 *
 * Y AFIRMA CUÁNTO HA MIRADO. Un metro que devuelve una lista vacía parece un aprobado,
 * y este repo se lo ha encontrado seis veces, así que falla al mirar cero.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { inflateSync } from "node:zlib";

import {
  medidaDeclarada,
  PIEZAS,
  RAIZ_KIT,
  rutasPublicadas,
  SOLO_EN_EL_KIT,
} from "../lib/logo-kit";

const RAIZ = process.cwd();
const problemas: string[] = [];

// --- El directorio existe ANTES de recorrer nada. «No encuentro la carpeta» y «no
//     hay archivos» tienen que distinguirse: sin esto, mover el kit haría que este
//     check aprobara mirando cero.
if (!existsSync(join(RAIZ, RAIZ_KIT))) {
  console.error(
    `\ncheck:kit — NO ENCUENTRO \`${RAIZ_KIT}\`, así que no ha mirado nada.\n\n` +
      "Esto no es «el kit está bien»: es que el check se ha quedado ciego. Si los\n" +
      "assets se han movido, actualiza `RAIZ_KIT` en `lib/logo-kit.ts`.\n",
  );
  process.exit(1);
}

/** Todo lo que hay en disco, como ruta servible (`/logo-kit/...`). */
function enDisco(): string[] {
  const raiz = join(RAIZ, RAIZ_KIT);
  const out: string[] = [];
  const baja = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const ruta = join(dir, e.name);
      if (e.isDirectory()) baja(ruta);
      else out.push(`/logo-kit/${relative(raiz, ruta).split(sep).join("/")}`);
    }
  };
  baja(raiz);
  return out.sort();
}

const disco = enDisco();
const publicadas = rutasPublicadas();
const declaradas = new Set([...publicadas, ...SOLO_EN_EL_KIT]);

if (!disco.length) {
  console.error(
    `\ncheck:kit — \`${RAIZ_KIT}\` existe y está VACÍO. El kit sería un ZIP sin nada dentro.\n`,
  );
  process.exit(1);
}

// 1 y 3 — lo declarado existe. (El 3 es un caso del 1: si a una pieza le falta un
//         PNG, su ruta derivada no está en disco y sale aquí, nombrando el archivo.)
const enDiscoSet = new Set(disco);
for (const ruta of publicadas) {
  if (!enDiscoSet.has(ruta)) {
    problemas.push(
      `la página ofrece \`${ruta}\` y ese archivo no está en disco. Sería un 404 desde un chip que se ve bien.`,
    );
  }
}
for (const ruta of SOLO_EN_EL_KIT) {
  if (!enDiscoSet.has(ruta)) {
    problemas.push(
      `\`${ruta}\` está declarado en \`SOLO_EN_EL_KIT\` y ya no existe. Si se borró a propósito, quítalo de la lista.`,
    );
  }
}

// 2 — nada en disco sin declarar.
for (const ruta of disco) {
  if (!declaradas.has(ruta)) {
    problemas.push(
      `\`${ruta}\` está en disco y no lo declara nadie. Viajaría dentro del kit sin que ninguna página lo mencione:\n` +
        "      publícalo en una tarjeta, o añádelo a `SOLO_EN_EL_KIT` con su motivo.",
    );
  }
}

/**
 * ---------------------------------------------------------------------------
 * EL CONTENIDO DE LOS BINARIOS (P85.2, 2026-08-30)
 *
 * Todo lo de arriba cuadra NOMBRES. Un PNG en blanco, truncado o regenerado al
 * tamaño equivocado los cuadra igual de bien, y ese es el fallo que de verdad
 * duele: un chip del Brand Kit que descarga un archivo roto se ve perfectamente
 * bien en la página.
 *
 * Así que cada binario se ABRE. Tres cosas, y las tres son del archivo, no de su
 * nombre: que sea del formato que dice la extensión, que mida lo que su nombre
 * promete (`medidaDeclarada`, en el registro: el número significa alto en el
 * símbolo, ancho en el lockup y lado en el favicon), y que tenga TINTA — se
 * inflan los IDAT, se deshacen los filtros y se suma el canal alfa.
 *
 * LO QUE ESTO NO PROMETE, y se escribe para no prometer de más: que el dibujo sea
 * el correcto. Un PNG del tamaño justo, con tinta, y con el logo de otra versión
 * pasa. Para eso haría falta comparar contra el SVG rasterizado, y eso vuelve a
 * meter la cadena nativa —sharp/libvips— dentro del guardián, que es justo lo que
 * `scripts/logo-kit/README.md` §Reproducibilidad explica que no es determinista.
 *
 * EL ANCLA QUE VALIDA EL METRO: el favicon de 16px lleva el trazo engordado de 6 a
 * 10 unidades a propósito, y el decodificador tiene que VERLO — 28,1% de tinta
 * frente al 17,9% del de 32. Si los dos salieran iguales, el que está mal es el
 * decodificador, no el asset.
 * ---------------------------------------------------------------------------
 */

/** Alto, ancho y cobertura de tinta de un PNG RGBA de 8 bits sin entrelazar. */
function leePng(buf: Buffer): { ancho: number; alto: number; tinta: number } {
  if (buf.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
    throw new Error("no empieza por la firma PNG");
  }
  let p = 8;
  let ancho = 0;
  let alto = 0;
  let profundidad = 0;
  let color = 0;
  let entrelazado = 0;
  const idat: Buffer[] = [];
  while (p + 8 <= buf.length) {
    const largo = buf.readUInt32BE(p);
    const tipo = buf.toString("ascii", p + 4, p + 8);
    if (tipo === "IHDR") {
      ancho = buf.readUInt32BE(p + 8);
      alto = buf.readUInt32BE(p + 12);
      profundidad = buf.readUInt8(p + 16);
      color = buf.readUInt8(p + 17);
      entrelazado = buf.readUInt8(p + 20);
    } else if (tipo === "IDAT") {
      idat.push(buf.subarray(p + 8, p + 8 + largo));
    } else if (tipo === "IEND") break;
    p += 12 + largo;
  }
  if (profundidad !== 8 || color !== 6 || entrelazado !== 0) {
    throw new Error(
      `es un PNG que este check no sabe leer (${profundidad} bits, tipo ${color}, entrelazado ${entrelazado}). ` +
        "Los 42 del kit son RGBA de 8 bits sin entrelazar: si el generador ha cambiado de formato, actualiza `leePng`",
    );
  }
  if (!idat.length) throw new Error("no tiene datos de imagen (ningún IDAT)");

  // Deshacer los cinco filtros de PNG. Sin esto los bytes inflados no son
  // píxeles y la cobertura sería un número inventado.
  const bpp = 4;
  const linea = ancho * bpp;
  const crudo = inflateSync(Buffer.concat(idat));
  if (crudo.length < alto * (linea + 1)) {
    throw new Error("los datos de imagen están truncados");
  }
  const px = Buffer.alloc(alto * linea);
  let o = 0;
  for (let y = 0; y < alto; y++) {
    const filtro = crudo[o++] as number;
    const fila = crudo.subarray(o, o + linea);
    o += linea;
    const dst = px.subarray(y * linea, (y + 1) * linea);
    const prev = y ? px.subarray((y - 1) * linea, y * linea) : null;
    for (let x = 0; x < linea; x++) {
      const a = x >= bpp ? (dst[x - bpp] as number) : 0;
      const b = prev ? (prev[x] as number) : 0;
      const c = x >= bpp && prev ? (prev[x - bpp] as number) : 0;
      let v = fila[x] as number;
      if (filtro === 1) v += a;
      else if (filtro === 2) v += b;
      else if (filtro === 3) v += (a + b) >> 1;
      else if (filtro === 4) {
        const pa = Math.abs(b - c);
        const pb = Math.abs(a - c);
        const pc = Math.abs(a + b - 2 * c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      dst[x] = v & 255;
    }
  }
  let alfa = 0;
  for (let i = 3; i < px.length; i += 4) alfa += px[i] as number;
  return { ancho, alto, tinta: alfa / (255 * ancho * alto) };
}

/** El `.ico` no se decodifica: se comprueba que su índice no miente. */
function leeIco(buf: Buffer): number {
  if (buf.readUInt16LE(0) !== 0 || buf.readUInt16LE(2) !== 1) {
    throw new Error("no tiene cabecera de ICO");
  }
  const entradas = buf.readUInt16LE(4);
  if (!entradas) throw new Error("declara cero imágenes dentro");
  for (let i = 0; i < entradas; i++) {
    const e = 6 + i * 16;
    const largo = buf.readUInt32LE(e + 8);
    const desde = buf.readUInt32LE(e + 12);
    if (!largo || desde + largo > buf.length) {
      throw new Error(
        `su imagen ${i + 1} apunta fuera del archivo: está truncado`,
      );
    }
  }
  return entradas;
}

let binarios = 0;
let tintaMin = 1;
let tintaMax = 0;
for (const ruta of disco) {
  const fichero = join(RAIZ, RAIZ_KIT, ruta.replace("/logo-kit/", ""));
  if (ruta.endsWith(".ico")) {
    try {
      leeIco(readFileSync(fichero));
      binarios++;
    } catch (e) {
      problemas.push(`\`${ruta}\` ${(e as Error).message}.`);
    }
    continue;
  }
  if (!ruta.endsWith(".png")) continue;
  const medida = medidaDeclarada(ruta);
  if (!medida) {
    // Un PNG cuyo nombre no dice qué mide es un hueco del metro, no un aprobado.
    problemas.push(
      `\`${ruta}\` es un PNG y \`medidaDeclarada\` no sabe qué tamaño promete su nombre, ` +
        "así que nadie puede comprobarlo. Si es una familia nueva, decláralo en `lib/logo-kit.ts`.",
    );
    continue;
  }
  try {
    const png = leePng(readFileSync(fichero));
    binarios++;
    const real =
      medida.eje === "ancho"
        ? png.ancho
        : medida.eje === "alto"
          ? png.alto
          : Math.max(png.ancho, png.alto);
    const cuadrado = medida.eje === "cuadrado" && png.ancho !== png.alto;
    if (real !== medida.px || cuadrado) {
      problemas.push(
        `\`${ruta}\` promete ${medida.px}px de ${medida.eje} y mide ${png.ancho}×${png.alto}.`,
      );
    }
    if (png.tinta <= 0) {
      problemas.push(
        `\`${ruta}\` está ENTERAMENTE TRANSPARENTE: es un archivo válido y un asset vacío, ` +
          "que es justo lo que se ve bien desde la página y se descarga roto.",
      );
    }
    tintaMin = Math.min(tintaMin, png.tinta);
    tintaMax = Math.max(tintaMax, png.tinta);
  } catch (e) {
    problemas.push(`\`${ruta}\` no se puede leer: ${(e as Error).message}.`);
  }
}

if (problemas.length) {
  console.error(
    `\ncheck:kit — ${problemas.length} ${problemas.length === 1 ? "problema" : "problemas"}:\n\n` +
      problemas.map((p) => `  · ${p}`).join("\n") +
      "\n\nEl registro es `lib/logo-kit.ts`.\n",
  );
  process.exit(1);
}

console.log(
  `check:kit — ${disco.length} archivos en \`${RAIZ_KIT}\` · ` +
    `${publicadas.length} publicados por ${PIEZAS.length} piezas y el favicon · ` +
    `${SOLO_EN_EL_KIT.length} solo dentro del kit, declarados`,
);
console.log(
  `             ${binarios} binarios abiertos · formato, medida declarada y tinta · ` +
    `cobertura entre ${(tintaMin * 100).toFixed(1)}% y ${(tintaMax * 100).toFixed(1)}%`,
);
console.log(
  "✓ El registro del kit y el disco cuadran, y los binarios no están vacíos.",
);
