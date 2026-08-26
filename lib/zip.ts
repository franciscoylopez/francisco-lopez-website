/**
 * Un escritor de ZIP de 90 líneas, para no meter una dependencia — `lib/zip.ts`.
 *
 * POR QUÉ EXISTE. El Brand Kit sirve su kit completo como un solo archivo, y ese
 * archivo se genera EN EL BUILD leyendo `public/logo-kit/` (ver
 * `app/api/kit/route.ts`). Node trae `zlib` con `deflateRawSync` y `crc32`, que es
 * todo lo que hace falta: lo único que no trae es el CONTENEDOR, y el contenedor
 * son tres estructuras de campos fijos. Escribirlas cuesta menos que sumar un
 * árbol de dependencias a un repositorio público por algo que se usa una vez.
 *
 * ES DETERMINISTA A PROPÓSITO. Las marcas de tiempo van fijas a 1980-01-01, así que
 * el mismo contenido produce siempre los mismos bytes. Sin eso, el kit cambiaría
 * entero en cada build aunque no hubiera cambiado ningún asset, y cualquier
 * comparación posterior (un diff, una caché, un hash) dejaría de significar nada.
 *
 * LO QUE NO HACE, dicho para que no se dé por cubierto: no hace ZIP64, así que no
 * sirve por encima de 65.535 entradas ni de 4 GB. El kit tiene 55 archivos y pesa
 * 642 KB. Si algún día se acerca a esos límites, esto tiene que fallar en vez de
 * escribir un archivo corrupto, y por eso lo comprueba en vez de asumirlo.
 */
import { crc32, deflateRawSync } from "node:zlib";

export type EntradaZip = {
  /** Ruta dentro del ZIP, con `/` como separador. */
  nombre: string;
  datos: Buffer;
};

/** 1980-01-01 00:00, el suelo del formato. Fijo = salida reproducible. */
const FECHA_DOS = 0x0021;
const HORA_DOS = 0x0000;

const FIRMA_LOCAL = 0x04034b50;
const FIRMA_CENTRAL = 0x02014b50;
const FIRMA_FIN = 0x06054b50;

const MAX_ENTRADAS = 0xffff;
const MAX_BYTES = 0xffffffff;

export function creaZip(entradas: EntradaZip[]): Buffer {
  if (entradas.length > MAX_ENTRADAS) {
    throw new Error(
      `lib/zip: ${entradas.length} entradas y el formato sin ZIP64 admite ${MAX_ENTRADAS}. ` +
        "Escribir el ZIP igualmente daría un archivo corrupto que se abre a medias.",
    );
  }

  const locales: Buffer[] = [];
  const central: Buffer[] = [];
  let offset = 0;

  for (const entrada of entradas) {
    const nombre = Buffer.from(entrada.nombre, "utf8");
    const suma = crc32(entrada.datos);

    // Se comprime, y se queda con el resultado SOLO si gana. Los PNG ya vienen
    // comprimidos y el deflate los deja más grandes; los SVG bajan a un tercio.
    const comprimido = deflateRawSync(entrada.datos, { level: 9 });
    const gana = comprimido.length < entrada.datos.length;
    const cuerpo = gana ? comprimido : entrada.datos;
    const metodo = gana ? 8 : 0;

    const cabecera = Buffer.alloc(30);
    cabecera.writeUInt32LE(FIRMA_LOCAL, 0);
    cabecera.writeUInt16LE(20, 4); // versión necesaria para extraer
    cabecera.writeUInt16LE(0, 6); // flags
    cabecera.writeUInt16LE(metodo, 8);
    cabecera.writeUInt16LE(HORA_DOS, 10);
    cabecera.writeUInt16LE(FECHA_DOS, 12);
    cabecera.writeUInt32LE(suma, 14);
    cabecera.writeUInt32LE(cuerpo.length, 18);
    cabecera.writeUInt32LE(entrada.datos.length, 22);
    cabecera.writeUInt16LE(nombre.length, 26);
    cabecera.writeUInt16LE(0, 28); // campo extra
    locales.push(cabecera, nombre, cuerpo);

    const ficha = Buffer.alloc(46);
    ficha.writeUInt32LE(FIRMA_CENTRAL, 0);
    ficha.writeUInt16LE(20, 4); // versión con la que se creó
    ficha.writeUInt16LE(20, 6); // versión necesaria
    ficha.writeUInt16LE(0, 8);
    ficha.writeUInt16LE(metodo, 10);
    ficha.writeUInt16LE(HORA_DOS, 12);
    ficha.writeUInt16LE(FECHA_DOS, 14);
    ficha.writeUInt32LE(suma, 16);
    ficha.writeUInt32LE(cuerpo.length, 20);
    ficha.writeUInt32LE(entrada.datos.length, 24);
    ficha.writeUInt16LE(nombre.length, 28);
    ficha.writeUInt16LE(0, 30); // extra
    ficha.writeUInt16LE(0, 32); // comentario
    ficha.writeUInt16LE(0, 34); // disco
    ficha.writeUInt16LE(0, 36); // atributos internos
    ficha.writeUInt32LE(0, 38); // atributos externos
    ficha.writeUInt32LE(offset, 42);
    central.push(ficha, nombre);

    offset += cabecera.length + nombre.length + cuerpo.length;
  }

  const directorio = Buffer.concat(central);

  if (offset > MAX_BYTES || directorio.length > MAX_BYTES) {
    throw new Error(
      "lib/zip: el archivo pasa de 4 GB y esto no hace ZIP64. Falla aquí en vez de " +
        "escribir offsets truncados.",
    );
  }

  const fin = Buffer.alloc(22);
  fin.writeUInt32LE(FIRMA_FIN, 0);
  fin.writeUInt16LE(0, 4); // número de disco
  fin.writeUInt16LE(0, 6); // disco donde empieza el directorio
  fin.writeUInt16LE(entradas.length, 8);
  fin.writeUInt16LE(entradas.length, 10);
  fin.writeUInt32LE(directorio.length, 12);
  fin.writeUInt32LE(offset, 16);
  fin.writeUInt16LE(0, 20); // comentario

  return Buffer.concat([...locales, directorio, fin]);
}
