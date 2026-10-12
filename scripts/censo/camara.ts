/**
 * La cámara: disparar la captura y recortar de ella el peor píxel de cada par.
 *
 * Aparte del recorrido porque es la pieza que TOCA EL DISCO —un PNG por toma en
 * una carpeta temporal, y los recortes de `--recortes=` cuando se piden— y porque
 * el recorrido no cambia cuando cambia cómo se dispara *(P72.195, 2026-09-02)*.
 */
import { mkdirSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import sharp from "sharp";

import { ab } from "../navegador/agent-browser";
import { peorPixel } from "./pixel";
import { type ParImagen, type Peor } from "./tipos";

export const carpeta = mkdtempSync(join(tmpdir(), "censo-imagen-"));

/** Dónde dejar los recortes medidos, si se han pedido. */
const RECORTES = process.argv
  .find((a) => a.startsWith("--recortes="))
  ?.split("=")[1];
if (RECORTES) mkdirSync(RECORTES, { recursive: true });

export function captura(): Buffer {
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
export async function toma(
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
