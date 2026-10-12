/**
 * Abrir los binarios del kit de marca, que es lo que `check:kit` no puede cuadrar
 * por el nombre.
 *
 * POR QUÉ SE DECODIFICA A MANO. Un PNG en blanco, truncado o regenerado al tamaño
 * equivocado cuadra el registro igual de bien que uno correcto, y ese es el fallo
 * que de verdad duele: un chip del Brand Kit que descarga un archivo roto se ve
 * perfectamente bien en la página. Así que cada binario se ABRE — y sin meter la
 * cadena nativa (sharp/libvips) dentro de un guardián, que es justo lo que
 * `scripts/logo-kit/README.md` §Reproducibilidad explica que no es determinista.
 *
 * LO QUE ESTO NO PROMETE, y se escribe para no prometer de más: que el dibujo sea
 * el correcto. Un PNG del tamaño justo, con tinta, y con el logo de otra versión
 * pasa. Para eso haría falta comparar contra el SVG rasterizado.
 *
 * EL ANCLA QUE VALIDA EL METRO: el favicon de 16px lleva el trazo engordado de 6 a
 * 10 unidades a propósito, y el decodificador tiene que VERLO — 28,1% de tinta
 * frente al 17,9% del de 32. Si los dos salieran iguales, el que está mal es el
 * decodificador, no el asset.
 */
import { inflateSync } from "node:zlib";

/** Los cuatro bytes de cabecera que describen el formato, y los datos crudos. */
type Ihdr = {
  ancho: number;
  alto: number;
  profundidad: number;
  color: number;
  entrelazado: number;
  idat: Buffer[];
};

/** Recorre los chunks: el IHDR describe el formato y los IDAT traen la imagen. */
function chunks(buf: Buffer): Ihdr {
  if (buf.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
    throw new Error("no empieza por la firma PNG");
  }
  const out: Ihdr = {
    ancho: 0,
    alto: 0,
    profundidad: 0,
    color: 0,
    entrelazado: 0,
    idat: [],
  };
  let p = 8;
  while (p + 8 <= buf.length) {
    const largo = buf.readUInt32BE(p);
    const tipo = buf.toString("ascii", p + 4, p + 8);
    if (tipo === "IHDR") {
      out.ancho = buf.readUInt32BE(p + 8);
      out.alto = buf.readUInt32BE(p + 12);
      out.profundidad = buf.readUInt8(p + 16);
      out.color = buf.readUInt8(p + 17);
      out.entrelazado = buf.readUInt8(p + 20);
    } else if (tipo === "IDAT") {
      out.idat.push(buf.subarray(p + 8, p + 8 + largo));
    } else if (tipo === "IEND") break;
    p += 12 + largo;
  }
  return out;
}

/**
 * Los cinco filtros de PNG, byte a byte. Sin deshacerlos, los bytes inflados no
 * son píxeles y la cobertura sería un número inventado.
 */
function sinFiltro(
  filtro: number,
  v: number,
  a: number,
  b: number,
  c: number,
): number {
  if (filtro === 1) return v + a;
  if (filtro === 2) return v + b;
  if (filtro === 3) return v + ((a + b) >> 1);
  if (filtro !== 4) return v;
  const pa = Math.abs(b - c);
  const pb = Math.abs(a - c);
  const pc = Math.abs(a + b - 2 * c);
  return v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c);
}

/** Los píxeles RGBA, ya desfiltrados, de un PNG de 8 bits sin entrelazar. */
function desfiltrar(crudo: Buffer, ancho: number, alto: number): Buffer {
  const bpp = 4;
  const linea = ancho * bpp;
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
      dst[x] = sinFiltro(filtro, fila[x] as number, a, b, c) & 255;
    }
  }
  return px;
}

/** Alto, ancho y cobertura de tinta de un PNG RGBA de 8 bits sin entrelazar. */
export function leePng(buf: Buffer): {
  ancho: number;
  alto: number;
  tinta: number;
} {
  const { ancho, alto, profundidad, color, entrelazado, idat } = chunks(buf);
  if (profundidad !== 8 || color !== 6 || entrelazado !== 0) {
    throw new Error(
      `es un PNG que este check no sabe leer (${profundidad} bits, tipo ${color}, entrelazado ${entrelazado}). ` +
        "Los 42 del kit son RGBA de 8 bits sin entrelazar: si el generador ha cambiado de formato, actualiza `leePng`",
    );
  }
  if (!idat.length) throw new Error("no tiene datos de imagen (ningún IDAT)");

  const px = desfiltrar(inflateSync(Buffer.concat(idat)), ancho, alto);
  let alfa = 0;
  for (let i = 3; i < px.length; i += 4) alfa += px[i] as number;
  return { ancho, alto, tinta: alfa / (255 * ancho * alto) };
}

/** El `.ico` no se decodifica: se comprueba que su índice no miente. */
export function leeIco(buf: Buffer): number {
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
